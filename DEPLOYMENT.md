# Caring Clarity AI Voice Agent - Deployment Guide

## 🚀 Quick Deployment Checklist

### Prerequisites
- [x] Vercel account
- [x] Supabase account  
- [x] Deepgram account
- [x] Groq account
- [x] Twilio account
- [x] Resend account

### Environment Variables Required
\`\`\`bash
# Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI Services
DEEPGRAM_API_KEY=your_deepgram_key
DEEPGRAM_LANGUAGE=en-US
DEEPGRAM_MODEL=nova-2-medical
DEEPGRAM_TTS_MODEL=aura-2-athena-en
GROQ_API_KEY=your_groq_key

# Communication
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890
RESEND_API_KEY=your_resend_key

# Application
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
CACHE_TTL_SECONDS=3600
\`\`\`

## 📋 Deployment Steps

### 1. Deploy to Vercel
\`\`\`bash
# Clone and deploy
git clone <your-repo>
cd caring-clarity-ai
vercel --prod

# Or use Vercel dashboard to import from GitHub
\`\`\`

### 2. Set Environment Variables
In Vercel dashboard:
1. Go to Project Settings → Environment Variables
2. Add all required variables listed above
3. Redeploy to apply changes

### 3. Initialize Database
\`\`\`bash
# Run database migrations
curl -X POST https://your-app.vercel.app/api/test-system \
  -H "Content-Type: application/json" \
  -d '{"testType": "database"}'
\`\`\`

### 4. Configure Twilio Webhooks
In Twilio Console:
1. **Voice webhook**: `https://your-app.vercel.app/api/twilio/voice`
2. **SMS webhook**: `https://your-app.vercel.app/api/twilio/sms`

### 5. Verify Deployment
\`\`\`bash
# Run verification script
curl -X POST https://your-app.vercel.app/api/test-system
\`\`\`

## 🧪 Testing Your Deployment

### Health Checks
- **Basic**: `GET /api/health`
- **Detailed**: `GET /api/health/detailed`
- **System Test**: `POST /api/test-system`

### Manual Testing
1. **Web Interface**: Visit your Vercel URL
2. **Phone Calls**: Call your Twilio number
3. **SMS**: Text your Twilio number
4. **Crisis Detection**: Test with crisis keywords

## 📞 Twilio Configuration

### Phone Number Setup
1. Purchase a phone number in Twilio Console
2. Configure webhooks:
   - **Voice**: `https://your-app.vercel.app/api/twilio/voice`
   - **SMS**: `https://your-app.vercel.app/api/twilio/sms`

### Testing Phone Integration
\`\`\`bash
# Test voice webhook
curl -X POST https://your-app.vercel.app/api/twilio/voice \
  -d "CallSid=test123&From=+1234567890&To=+1987654321"

# Test SMS webhook  
curl -X POST https://your-app.vercel.app/api/twilio/sms \
  -d "From=+1234567890&Body=Hello&MessageSid=test123"
\`\`\`

## 🔧 Configuration

### Voice Settings
- **Default Voice**: Athena (professional female)
- **Language**: English (US)
- **Model**: Nova-2-Medical (optimized for healthcare)

### Business Logic
- **Age Restriction**: Children 10+ only
- **Service Type**: Telehealth only
- **Insurance**: No Medicaid/Medicare
- **Cancellation**: 24-hour policy, $125 fee

### Message Routing
- **Billing**: Jessica (SMS + Email)
- **Appointments**: Jessica (SMS + Email)  
- **Intake**: Stephanie (Email)
- **Crisis**: Jessica (SMS + Email)
- **Care Management**: Erik Coleman

## 🚨 Crisis Intervention

The system automatically detects crisis situations and:
1. Provides immediate support response
2. Offers emergency resources (911, crisis hotlines)
3. Logs incident for follow-up
4. Notifies staff immediately

### Crisis Keywords Monitored
- suicide, kill myself, want to die
- emergency, crisis, 911
- hurt myself, end it all

## 📊 Monitoring & Analytics

### Available Metrics
- Conversation quality scores
- Response times
- Intent classification accuracy
- Escalation rates
- User satisfaction

### Accessing Analytics
- Database: `conversation_metrics` table
- API: `GET /api/analytics` (to be implemented)

## 🔒 Security & Privacy

### Data Protection
- All conversations encrypted in transit
- PHI handling compliant
- Row-level security enabled
- Environment variables secured

### Access Control
- Service role for database access
- API key authentication
- Webhook signature verification

## 🐛 Troubleshooting

### Common Issues

**1. "Tenant not found" error**
\`\`\`bash
# Check if business data was seeded
curl https://your-app.vercel.app/api/health/detailed
\`\`\`

**2. Voice not working**
- Verify Deepgram API key
- Check TTS model configuration
- Test with `/api/text-to-speech`

**3. Phone calls failing**
- Verify Twilio webhooks are correct
- Check Twilio account balance
- Test webhook endpoints manually

**4. Messages not sending**
- Verify Resend API key
- Check Twilio SMS configuration
- Review message logs in database

### Debug Endpoints
- `GET /api/health/detailed` - Full system status
- `POST /api/test-system` - Integration tests
- `GET /api/health` - Basic health check

## 📈 Performance Optimization

### Caching
- Knowledge base responses cached (1 hour)
- Common queries cached
- Provider lookups cached

### Response Times
- Target: <2 seconds for AI responses
- Monitoring: Built-in latency tracking
- Optimization: Parallel processing enabled

## 🔄 Updates & Maintenance

### Regular Tasks
- Monitor conversation quality scores
- Review crisis intervention logs
- Update knowledge base content
- Check system health metrics

### Scaling Considerations
- Vercel auto-scales
- Database connection pooling
- Rate limiting implemented
- Error handling robust

## 📞 Support Contacts

### Technical Issues
- Check deployment logs in Vercel
- Review database logs in Supabase
- Monitor API usage in service dashboards

### Business Configuration
- Update knowledge base via database
- Modify staff routing in message service
- Adjust business hours and policies

---

## ✅ Deployment Complete!

Your Caring Clarity AI Voice Agent is now ready for production use with:

- ✅ Multi-channel support (web, phone, SMS)
- ✅ Intelligent intake flow with disclaimers
- ✅ Crisis intervention and escalation
- ✅ Staff message routing
- ✅ Knowledge base integration
- ✅ Analytics and monitoring
- ✅ Accessibility features
- ✅ Performance optimization

**Next Steps:**
1. Test all functionality thoroughly
2. Train staff on new message routing
3. Monitor initial usage and adjust as needed
4. Schedule regular system health checks
