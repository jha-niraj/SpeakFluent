# Google OAuth Setup Guide for Production

This guide will help you set up Google OAuth authentication for both development and production environments.

## 🔧 Environment Variables

Make sure you have the following environment variables set in your production environment (Vercel):

### Required Variables
```bash
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret  # NOT GOOGLE_SECRET_ID

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=https://your-domain.vercel.app  # Your production URL

# Database
DATABASE_URL=your_database_connection_string
```

## 🌐 Google Cloud Console Setup

### 1. Create or Update OAuth 2.0 Client

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to "APIs & Services" > "Credentials"
3. Click "Create Credentials" > "OAuth client ID" (or edit existing)
4. Select "Web application"

### 2. Configure Authorized URLs

#### Authorized JavaScript Origins:
- Development: `http://localhost:3000`
- Production: `https://your-domain.vercel.app`

#### Authorized Redirect URIs:
- Development: `http://localhost:3000/api/auth/callback/google`
- Production: `https://your-domain.vercel.app/api/auth/callback/google`

### 3. Important Notes:
- **Replace `your-domain.vercel.app` with your actual Vercel deployment URL**
- **Ensure there are no trailing slashes in the URLs**
- **Both HTTP (dev) and HTTPS (prod) origins should be listed**

## 🚀 Vercel Deployment Configuration

### 1. Environment Variables in Vercel Dashboard:

1. Go to your Vercel project dashboard
2. Navigate to "Settings" > "Environment Variables"
3. Add all the required variables listed above

### 2. Generate NEXTAUTH_SECRET:

```bash
# Run this command to generate a secure secret
openssl rand -base64 32
```

Or use this online tool: [Generate Secret](https://generate-secret.vercel.app/32)

## 🔍 Troubleshooting Common Issues

### Configuration Error in Production

**Error:** `/error?error=configuration`

**Causes & Solutions:**

1. **Wrong Environment Variable Name:**
   - ❌ `GOOGLE_SECRET_ID`
   - ✅ `GOOGLE_CLIENT_SECRET`

2. **Missing Environment Variables:**
   ```bash
   # Check all variables are set in Vercel
   GOOGLE_CLIENT_ID
   GOOGLE_CLIENT_SECRET
   NEXTAUTH_SECRET
   NEXTAUTH_URL
   ```

3. **Incorrect NEXTAUTH_URL:**
   - Must match your exact Vercel deployment URL
   - Include `https://` for production
   - No trailing slashes

4. **Google Console Redirect URI Mismatch:**
   - Verify redirect URI exactly matches: `https://your-domain.vercel.app/api/auth/callback/google`

### OAuth Error Handling

**Error:** `access_denied` or `OAuthCallback`

**Solutions:**
1. Check Google Console authorized domains
2. Verify redirect URIs are correctly configured
3. Ensure OAuth consent screen is properly set up

### Domain Verification Issues

**Error:** Unauthorized domain

**Solutions:**
1. Add your domain to authorized domains in Google Console
2. Verify domain ownership if required
3. Check OAuth consent screen configuration

## ✅ Testing Checklist

### Development Testing:
- [ ] Google OAuth works on `localhost:3000`
- [ ] All environment variables are set
- [ ] Database connection is working

### Production Testing:
- [ ] Deploy to Vercel with all environment variables
- [ ] Test Google OAuth on production URL
- [ ] Verify redirect URLs in Google Console
- [ ] Check error page functionality

## 🛠️ Quick Fix Commands

### Re-deploy with Environment Variables:
```bash
# Trigger new deployment
vercel --prod
```

### Check Environment Variables:
```bash
# In your production environment
vercel env ls
```

## 📞 Support

If you continue to experience issues:

1. Check the error page for detailed error information
2. Verify all URLs match exactly (no extra characters)
3. Ensure environment variables are saved and deployed
4. Check Google Cloud Console for any restrictions or quotas

## 🔗 Useful Links

- [Google Cloud Console](https://console.cloud.google.com/)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [OAuth 2.0 Debugging](https://developers.google.com/identity/protocols/oauth2/web-server#troubleshooting) 