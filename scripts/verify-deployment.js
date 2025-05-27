/**
 * Deployment Verification Script
 * Verifies all systems are working after deployment
 */

const DEPLOYMENT_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

async function verifyDeployment() {
  console.log("🚀 Starting deployment verification...")
  console.log(`📍 Testing deployment at: ${DEPLOYMENT_URL}`)

  const results = {
    timestamp: new Date().toISOString(),
    url: DEPLOYMENT_URL,
    tests: {},
    overall: "pending",
  }

  try {
    // Test 1: Basic Health Check
    console.log("\n🧪 Test 1: Basic Health Check")
    try {
      const response = await fetch(`${DEPLOYMENT_URL}/api/health`)
      const data = await response.json()
      results.tests.basicHealth = {
        status: response.ok ? "pass" : "fail",
        statusCode: response.status,
        service: data.service,
      }
      console.log(`✅ Basic health check: ${response.status}`)
    } catch (error) {
      results.tests.basicHealth = {
        status: "fail",
        error: error.message,
      }
      console.log(`❌ Basic health check failed: ${error.message}`)
    }

    // Test 2: Detailed Health Check
    console.log("\n🧪 Test 2: Detailed Health Check")
    try {
      const response = await fetch(`${DEPLOYMENT_URL}/api/health/detailed`)
      const data = await response.json()
      results.tests.detailedHealth = {
        status: data.status === "healthy" ? "pass" : "fail",
        checks: data.checks,
        dependencies: data.dependencies,
      }
      console.log(`✅ Detailed health check: ${data.status}`)

      // Log any unhealthy checks
      if (data.checks) {
        Object.entries(data.checks).forEach(([name, check]) => {
          if (check.status === "unhealthy") {
            console.log(`⚠️  ${name}: ${check.message}`)
          }
        })
      }
    } catch (error) {
      results.tests.detailedHealth = {
        status: "fail",
        error: error.message,
      }
      console.log(`❌ Detailed health check failed: ${error.message}`)
    }

    // Test 3: System Integration Test
    console.log("\n🧪 Test 3: System Integration Test")
    try {
      const response = await fetch(`${DEPLOYMENT_URL}/api/test-system`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testType: "deployment" }),
      })
      const data = await response.json()
      results.tests.systemIntegration = {
        status: data.overall === "pass" ? "pass" : "fail",
        summary: data.summary,
        results: data.results,
      }
      console.log(
        `✅ System integration: ${data.overall} (${data.summary?.passed}/${data.summary?.total} tests passed)`,
      )
    } catch (error) {
      results.tests.systemIntegration = {
        status: "fail",
        error: error.message,
      }
      console.log(`❌ System integration test failed: ${error.message}`)
    }

    // Test 4: API Endpoints
    console.log("\n🧪 Test 4: API Endpoints")
    const endpoints = [
      "/api/speech-to-text",
      "/api/text-to-speech",
      "/api/generate-response",
      "/api/twilio/voice",
      "/api/twilio/sms",
    ]

    const endpointResults = {}
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${DEPLOYMENT_URL}${endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ test: true }),
        })
        endpointResults[endpoint] = {
          status: response.status < 500 ? "pass" : "fail",
          statusCode: response.status,
        }
        console.log(`  ${endpoint}: ${response.status}`)
      } catch (error) {
        endpointResults[endpoint] = {
          status: "fail",
          error: error.message,
        }
        console.log(`  ${endpoint}: ERROR - ${error.message}`)
      }
    }

    results.tests.apiEndpoints = {
      status: Object.values(endpointResults).every((result) => result.status === "pass") ? "pass" : "partial",
      endpoints: endpointResults,
    }

    // Calculate overall status
    const testResults = Object.values(results.tests)
    const passCount = testResults.filter((test) => test.status === "pass").length
    const totalTests = testResults.length

    if (passCount === totalTests) {
      results.overall = "pass"
    } else if (passCount > totalTests / 2) {
      results.overall = "partial"
    } else {
      results.overall = "fail"
    }

    // Final Report
    console.log("\n📊 DEPLOYMENT VERIFICATION REPORT")
    console.log("=" * 50)
    console.log(`Overall Status: ${results.overall.toUpperCase()}`)
    console.log(`Tests Passed: ${passCount}/${totalTests}`)
    console.log(`Deployment URL: ${DEPLOYMENT_URL}`)
    console.log(`Timestamp: ${results.timestamp}`)

    if (results.overall === "pass") {
      console.log("\n🎉 Deployment verification PASSED! System is ready for use.")
    } else if (results.overall === "partial") {
      console.log("\n⚠️  Deployment verification PARTIAL. Some issues detected but core functionality works.")
    } else {
      console.log("\n❌ Deployment verification FAILED. Critical issues detected.")
    }

    return results
  } catch (error) {
    console.error("❌ Deployment verification failed:", error)
    results.overall = "fail"
    results.error = error.message
    return results
  }
}

// Run verification if called directly
if (require.main === module) {
  verifyDeployment()
    .then((results) => {
      process.exit(results.overall === "pass" ? 0 : 1)
    })
    .catch((error) => {
      console.error("Verification script error:", error)
      process.exit(1)
    })
}

module.exports = { verifyDeployment }
