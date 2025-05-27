# Caring Clarity AI Voice Agent - Vercel Deployment

## 🚀 **Single Platform Deployment (Vercel Only)**

### **Why Vercel?**
- ✅ Next.js optimized
- ✅ Automatic scaling
- ✅ Global edge network
- ✅ Integrated monitoring
- ✅ Simple configuration
- ✅ NYC region available (iad1/ewr1)

## 📋 **Deployment Steps**

### 1. **Prepare Environment Variables**
Create a `.env.local` file for testing:
\`\`\`bash
# Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI Services  
DEEPGRAM_API_KEY=your_deepgram_key
DEEPGRAM_TTS_MODEL=aura-2-athena-en
GROQ_API_KEY=your_groq_key

# Communication
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890
RESEND_API_KEY=your_resend_key

# Application (set after deployment)
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
CACHE_TTL_SECONDS=3600

# Optional (for NYC region)
VERCEL_REGION=iad1
\`\`\`

### 2. **Deploy to Vercel**

#### Option A: GitHub Integration (Recommended)
1. Push code to GitHub
2. Connect repository in Vercel dashboard
3. Add environment variables in Vercel settings
4. Deploy automatically

#### Option B: Vercel CLI
\`\`\`bash
# Install Vercel CLI
npm install -g vercel

# Login and deploy
vercel login
vercel --prod

# Follow prompts to configure
\`\`\`

### 3. **Configure Environment Variables in Vercel**
In Vercel Dashboard → Project Settings → Environment Variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase URL | All |
| `SUPABASE_SERVICE_ROLE_KEY` | Your service role key | All |
| `DEEPGRAM_API_KEY` | Your Deepgram key | All |
| `GROQ_API_KEY` | Your Groq key | All |
| `TWILIO_ACCOUNT_SID` | Your Twilio SID | All |
| `TWILIO_AUTH_TOKEN` | Your Twilio token | All |
| `TWILIO_PHONE_NUMBER` | Your Twilio number | All |
| `RESEND_API_KEY` | Your Resend key | All |
| `NEXT_PUBLIC_APP_URL` | https://your-app.vercel.app | All |
| `CACHE_TTL_SECONDS` | 3600 | All |
| `VERCEL_REGION` | iad1 | All |

### 4. **Update App URL**
After first deployment:
1. Copy your Vercel app URL
2. Update `NEXT_PUBLIC_APP_URL` environment variable
3. Redeploy to apply changes

### 5. **Configure Twilio Webhooks**
In Twilio Console, set webhooks to:
- **Voice**: `https://your-app.vercel.app/api/twilio/voice`
- **SMS**: `https://your-app.vercel.app/api/twilio/sms`

### 6. **Verify Deployment**
\`\`\`bash
# Test health check
curl https://your-app.vercel.app/api/health

# Run full system test
curl -X POST https://your-app.vercel.app/api/test-system \
  -H "Content-Type: application/json" \
  -d '{"testType": "deployment"}'
\`\`\`

## 🌍 **NYC Region Configuration**

### **Best Regions for NYC:**
1. **`iad1`** - Washington DC (recommended)
2. **`ewr1`** - Newark, NJ (closest)
3. **`bos1`** - Boston, MA

### **Set Region in vercel.json:**
\`\`\`json
{
  "regions": ["iad1"],
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
\`\`\`

## 🧪 **Testing Your Deployment**

### **Automated Tests:**
\`\`\`bash
# Health check
curl https://your-app.vercel.app/api/health/detailed

# System integration test
curl -X POST https://your-app.vercel.app/api/test-system
\`\`\`

### **Manual Tests:**
1. **Web Interface**: Visit your Vercel URL
2. **Phone**: Call your Twilio number
3. **SMS**: Text your Twilio number
4. **Crisis Test**: Say "I need help with suicidal thoughts"

## 📊 **Monitoring**

### **Vercel Analytics:**
- Function execution times
- Error rates
- Regional performance

### **Custom Monitoring:**
- `GET /api/health/detailed` - System status
- Database: `conversation_metrics` table
- Logs: Vercel dashboard

## 🔧 **Performance Optimization**

### **Vercel Edge Functions:**
- Automatic global distribution
- Sub-100ms response times
- Automatic scaling

### **Caching Strategy:**
- Knowledge base: 1 hour
- Provider data: 30 minutes
- Static assets: CDN cached

## 🚨 **Troubleshooting**

### **Common Issues:**

**1. Environment Variables Not Working**
- Redeploy after adding variables
- Check variable names match exactly
- Verify all environments selected

**2. Twilio Webhooks Failing**
- Ensure HTTPS URLs
- Check webhook URLs in Twilio console
- Verify function timeout settings

**3. Database Connection Issues**
- Check Supabase service role key
- Verify RLS policies
- Test connection in health check

## 📞 **Support**

### **Vercel Issues:**
- Check deployment logs
- Review function logs
- Monitor analytics dashboard

### **Application Issues:**
- Use health check endpoints
- Review conversation metrics
- Check Supabase logs

---

## ✅ **Deployment Complete!**

Your Caring Clarity AI Voice Agent is now running on Vercel with:
- 🌍 NYC region optimization (iad1)
- ⚡ Sub-second response times
- 📈 Automatic scaling
- 🔒 Enterprise security
- 📊 Built-in monitoring

**Your app is live at:** `https://your-app.vercel.app`
