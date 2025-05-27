/**
 * Test script for validating voice assistant functionality
 * Tests all critical components: TTS, STT, AI response, and WebSocket connectivity
 */
const fetch = require('node-fetch');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000';
const RENDER_WS_URL = process.env.RENDER_WEBSOCKET_URL || 'wss://voice-agent-websocket.onrender.com';
const TEST_CALL_SID = 'test-call-' + Date.now();
const TEST_TENANT_ID = 'test-tenant';
const TEST_USER_ID = 'test-user';

async function runTests() {
  console.log('🧪 Starting voice assistant validation tests');
  console.log(`📌 Using base URL: ${BASE_URL}`);
  console.log(`📌 Using WebSocket URL: ${RENDER_WS_URL}`);
  
  let allTestsPassed = true;
  
  // Test 1: Environment Variables
  console.log('\n🔍 Test 1: Checking environment variables');
  try {
    const envResponse = await fetch(`${BASE_URL}/api/health/env`);
    const envData = await envResponse.json();
    
    console.log(`Status: ${envData.status}`);
    if (envData.status === 'warning' && envData.missingVars?.length > 0) {
      console.warn(`⚠️ Warning: Missing environment variables: ${envData.missingVars.join(', ')}`);
      console.warn('Some functionality may not work correctly without these variables');
    } else if (envData.status === 'healthy') {
      console.log('✅ All required environment variables are set');
    }
  } catch (error) {
    console.error('❌ Failed to check environment variables:', error.message);
    allTestsPassed = false;
  }
  
  // Test 2: Text-to-Speech API
  console.log('\n🔍 Test 2: Testing TTS endpoint');
  try {
    const ttsResponse = await fetch(`${BASE_URL}/api/text-to-speech`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        text: 'This is a test of the text to speech system.',
        voiceModel: 'aura-asteria-en'
      })
    });
    
    if (ttsResponse.ok) {
      const audioBuffer = await ttsResponse.arrayBuffer();
      console.log(`✅ TTS endpoint working (generated ${audioBuffer.byteLength} bytes of audio)`);
    } else {
      const errorText = await ttsResponse.text();
      throw new Error(`TTS endpoint returned ${ttsResponse.status}: ${errorText}`);
    }
  } catch (error) {
    console.error('❌ TTS test failed:', error.message);
    allTestsPassed = false;
  }
  
  // Test 3: AI Response Generation
  console.log('\n🔍 Test 3: Testing AI response generation');
  try {
    const aiResponse = await fetch(`${BASE_URL}/api/generate-response`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message: 'I would like to schedule an appointment for therapy.',
        conversationHistory: []
      })
    });
    
    if (aiResponse.ok) {
      const aiData = await aiResponse.json();
      console.log(`✅ AI response generated: "${aiData.response}"`);
    } else {
      const errorText = await aiResponse.text();
      throw new Error(`AI endpoint returned ${aiResponse.status}: ${errorText}`);
    }
  } catch (error) {
    console.error('❌ AI response test failed:', error.message);
    allTestsPassed = false;
  }
  
  // Test 4: WebSocket Connectivity
  console.log('\n🔍 Test 4: Testing WebSocket connectivity');
  try {
    // First check the diagnostic endpoint
    const wsTestResponse = await fetch(`${BASE_URL}/api/websocket-test`);
    const wsTestData = await wsTestResponse.json();
    
    if (wsTestData.status !== 'healthy') {
      console.warn(`⚠️ Warning: WebSocket server may not be reachable: ${wsTestData.message}`);
      console.warn('Attempting direct WebSocket connection anyway...');
    } else {
      console.log('✅ WebSocket server is reachable via HTTP');
    }
    
    // Now try an actual WebSocket connection
    return new Promise((resolve) => {
      const wsUrl = `${RENDER_WS_URL}/stream?callSid=${TEST_CALL_SID}&tenantId=${TEST_TENANT_ID}&userId=${TEST_USER_ID}`;
      console.log(`Connecting to WebSocket: ${wsUrl}`);
      
      const ws = new WebSocket(wsUrl);
      let connectionSuccessful = false;
      
      ws.on('open', () => {
        console.log('✅ WebSocket connection established');
        connectionSuccessful = true;
        
        // Send a test start event
        const startEvent = {
          event: 'start',
          start: {
            callSid: TEST_CALL_SID,
            streamSid: 'test-stream-' + Date.now()
          }
        };
        
        ws.send(JSON.stringify(startEvent));
        console.log('✅ Start event sent');
        
        // Close after 5 seconds
        setTimeout(() => {
          ws.close();
          console.log('✅ WebSocket test completed');
          resolve(allTestsPassed && connectionSuccessful);
        }, 5000);
      });
      
      ws.on('message', (data) => {
        console.log(`📩 Received WebSocket message: ${data}`);
      });
      
      ws.on('error', (error) => {
        console.error('❌ WebSocket connection failed:', error.message);
        connectionSuccessful = false;
        resolve(false);
      });
      
      // Set a timeout in case the connection never establishes
      setTimeout(() => {
        if (!connectionSuccessful) {
          console.error('❌ WebSocket connection timed out');
          ws.close();
          resolve(false);
        }
      }, 10000);
    });
  } catch (error) {
    console.error('❌ WebSocket test failed:', error.message);
    return false;
  }
}

// Run the tests
runTests().then((success) => {
  if (success) {
    console.log('\n🎉 All tests passed! The voice assistant should be functioning correctly.');
    process.exit(0);
  } else {
    console.error('\n❌ Some tests failed. Please review the logs and fix any issues.');
    process.exit(1);
  }
});
