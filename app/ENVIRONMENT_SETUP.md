# Environment Variables Setup

This application uses several optional environment variables for different features. Copy these into your `.env.local` file as needed:

## Required Variables

```bash
# Gemini AI API Key (Required for chat functionality)
GOOGLE_API_KEY=your-gemini-api-key-here
```

## Optional Authentication Variables

```bash
# NextAuth Configuration (Optional - for user authentication)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth (Optional - for Google sign-in)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email Provider (Optional - for magic link sign-in)
EMAIL_SERVER=smtp://username:password@smtp.example.com:587
EMAIL_FROM=noreply@yourdomain.com

# Firebase Configuration (Optional - for data persistence)
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=your-firebase-client-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour-private-key-here\n-----END PRIVATE KEY-----"
```

## Notes

- **The application will work without authentication variables** - providers are loaded conditionally
- Only the `GOOGLE_API_KEY` is strictly required for AI chat functionality
- Authentication features will be disabled if credentials are not provided
- Firebase adapter is optional - without it, sessions won't be persisted across browser restarts

## Creating Your Environment File

1. Create a `.env.local` file in the root directory
2. Add the variables you want to use
3. Restart the development server after making changes

Example minimal setup:
```bash
GOOGLE_API_KEY=your-gemini-api-key-here
``` 