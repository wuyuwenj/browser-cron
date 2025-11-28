# Google OAuth Setup Guide

This guide will walk you through setting up Google OAuth for user authentication.

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **Select a project** → **New Project**
3. Enter project name: `BrowserCron` (or your app name)
4. Click **Create**

---

## Step 2: Enable Google+ API

1. In your project, go to **APIs & Services** → **Library**
2. Search for "**Google+ API**"
3. Click on it and click **Enable**

---

## Step 3: Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Select **External** (unless you have Google Workspace)
3. Click **Create**

4. Fill in the required fields:
   - **App name**: BrowserCron
   - **User support email**: Your email
   - **Developer contact information**: Your email

5. Click **Save and Continue**

6. **Scopes**: Click **Save and Continue** (default scopes are fine)

7. **Test users** (for development):
   - Click **+ Add Users**
   - Add your Gmail address
   - Click **Save and Continue**

8. Click **Back to Dashboard**

---

## Step 4: Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **+ Create Credentials** → **OAuth client ID**
3. Select **Application type**: **Web application**
4. **Name**: `BrowserCron Web Client`

5. **Authorized JavaScript origins**:
   - For local development: `http://localhost:3000`
   - For production: `https://yourdomain.com`

6. **Authorized redirect URIs**:
   - For local: `http://localhost:3000/api/auth/callback/google`
   - For production: `https://yourdomain.com/api/auth/callback/google`

7. Click **Create**

8. **Copy your credentials**:
   - You'll see a popup with:
     - **Client ID** (looks like: `123456789-abc...xyz.apps.googleusercontent.com`)
     - **Client Secret** (looks like: `GOCSPX-abc...xyz`)

---

## Step 5: Add Credentials to .env

1. Open your `.env` file
2. Add your credentials:

```bash
# Google OAuth
GOOGLE_CLIENT_ID="123456789-abc...xyz.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-abc...xyz"
```

---

## Step 6: Generate NextAuth Secret

Generate a random secret for NextAuth:

```bash
openssl rand -base64 32
```

Add it to `.env`:

```bash
AUTH_SECRET="your_generated_secret_here"
```

---

## Step 7: Update Database Schema

Apply the NextAuth database schema changes:

```bash
npx prisma db push
```

Or if using migrations:

```bash
npx prisma migrate dev --name add_nextauth
```

---

## Step 8: Test the Login

1. Restart your dev server:
   ```bash
   npm run dev
   ```

2. Go to `http://localhost:3000/login`

3. Click **Continue with Google**

4. Sign in with the test user email you added earlier

5. You should be redirected to `/dashboard` after successful login

---

## Troubleshooting

### Error: "Access blocked: This app's request is invalid"

- Make sure you added your email as a test user in OAuth consent screen
- Check that redirect URI exactly matches: `http://localhost:3000/api/auth/callback/google`

### Error: "redirect_uri_mismatch"

- Go back to Credentials and verify the redirect URI
- Make sure it matches exactly (including http/https and trailing slash)
- Add both with and without trailing slash if needed

### Can't find OAuth consent screen

- Make sure Google+ API is enabled
- Try refreshing the Google Cloud Console

---

## Production Setup

When deploying to production:

1. **Update OAuth consent screen** to "Published" status
2. **Add production URLs** to authorized origins and redirect URIs:
   - Origin: `https://yourdomain.com`
   - Redirect: `https://yourdomain.com/api/auth/callback/google`

3. **Update environment variables** in your hosting platform (Vercel, Railway, etc.)

4. **OAuth consent verification** (if needed):
   - Google may require verification if you use sensitive scopes
   - For basic login (email, profile), verification is usually not needed

---

## Security Best Practices

- ✅ Never commit `.env` file to git
- ✅ Use different Google Cloud projects for dev/prod
- ✅ Regularly rotate your `AUTH_SECRET`
- ✅ Keep `GOOGLE_CLIENT_SECRET` secret (never expose in client-side code)
- ✅ Add only trusted domains to authorized origins

---

## Additional Resources

- [NextAuth.js Documentation](https://authjs.dev)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com)
