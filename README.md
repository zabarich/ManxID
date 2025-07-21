# Manx ID - Digital Identity Wallet

A mobile-first digital identity wallet and web portal for Isle of Man government services. This is a demonstration application showcasing the "Tell Us Once" concept and digital credentials.

## Features

- **Single Sign-On**: Azure AD B2C authentication with FIDO2 support
- **Digital Onboarding**: Biometric and document verification (demo stubs)
- **Service Dashboard**: Unified view of government services (Tax, Vehicle, Benefits, Health, Education)
- **Tell Us Once**: Update address and contact details across all services
- **Proof of Age**: QR credential for age verification
- **Mobile-First**: Responsive design optimized for mobile devices
- **Dark Mode**: System-preference aware theme switching

## Tech Stack

- **Frontend**: Next.js 14 with App Router, React 18, TypeScript
- **Styling**: Tailwind CSS with Government Design System colors
- **Authentication**: NextAuth.js with Azure AD B2C
- **UI Components**: Lucide React icons, custom components
- **Forms**: React Hook Form with Zod validation
- **QR Codes**: react-qr-code for generation
- **Deployment**: Vercel (ready for hobby tier)

## Quick Start

1. **Clone and install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Demo Features

This is a demonstration application. Key demo features include:

- **Mock Authentication**: Uses placeholder Azure AD B2C configuration
- **Simulated Services**: Government service APIs are mocked
- **Demo Data**: Uses sample user data and credentials
- **Biometric Stubs**: Onboarding flow simulates document/biometric verification

## User Journey

### 1. Welcome & Authentication
- Landing page with government branding
- Secure sign-in with Azure AD B2C (mocked for demo)

### 2. Onboarding Flow
- Document verification (simulated camera capture)
- Biometric verification (simulated selfie capture)
- Profile completion with extracted data

### 3. Dashboard
- Service status cards showing government services
- Quick access to proof of age and profile updates
- Mobile-first responsive layout

### 4. Tell Us Once
- Update personal details in one place
- Automatic propagation to all government services
- Real-time status updates showing service synchronization

### 5. Digital Credentials
- Generate QR code for proof of age
- Offline verification with validation codes
- Cryptographically signed credentials

### 6. Verification
- Public verification page for QR codes
- Age verification without sharing personal data
- Government-branded validation interface

## Key User Stories

- **Emily (18, student)**: Get proof-of-age credential for venues
- **Adam (24, pilot)**: Update address once and notify all departments
- **Government staff**: Verify age credentials via QR scanner

## Performance Requirements

- **First Contentful Paint**: <1.5s on 4G
- **Accessibility**: WCAG AA color contrast
- **Security**: JWT tokens in HTTP-only cookies
- **Mobile**: Touch-optimized interface

## Environment Setup

### Required Environment Variables

```bash
# NextAuth.js
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=your-app-url

# Azure AD B2C (get from Azure portal)
AZURE_AD_B2C_TENANT_NAME=your-tenant
AZURE_AD_B2C_CLIENT_ID=your-client-id
AZURE_AD_B2C_CLIENT_SECRET=your-client-secret
AZURE_AD_B2C_PRIMARY_USER_FLOW=B2C_1_signupsignin
```

### Azure AD B2C Setup

1. Create Azure AD B2C tenant
2. Configure user flows for sign-up/sign-in
3. Register application and get client credentials
4. Update environment variables

## Deployment

### Vercel (Recommended)

1. **Connect repository to Vercel**
2. **Set environment variables** in Vercel dashboard
3. **Deploy automatically** on push to main branch

The app is optimized for Vercel's hobby tier with:
- Static generation where possible
- Edge runtime for API routes
- Optimized bundle size

### Manual Deployment

```bash
npm run build
npm start
```

## Project Structure

```
/
├── app/                    # Next.js 14 App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── onboarding/        # User onboarding
│   ├── verify/            # QR verification
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── credentials/       # QR code components
│   ├── dashboard/         # Dashboard components
│   ├── onboarding/        # Onboarding flow
│   ├── providers/         # Context providers
│   └── welcome/           # Landing page
├── lib/                   # Utilities
│   └── auth.ts           # NextAuth configuration
├── public/               # Static assets
└── styles/              # Global styles
```

## API Routes

- `POST /api/auth/[...nextauth]` - NextAuth.js handler
- `POST /api/profile/update` - Update user profile
- `POST /api/credentials/generate` - Generate QR credentials
- `GET /verify/[code]` - Public verification page

## Security Considerations

- **Demo Only**: This is not production-ready
- **No PII Storage**: Personal data simulated, not persisted
- **HTTPS Required**: Use HTTPS in production
- **CSRF Protection**: Built into NextAuth.js
- **Data Residency**: Designed for UK/EU compliance

## Contributing

This is a demonstration project for the Isle of Man Government Digital Identity initiative.

## License

Copyright © 2025 ETHOS Limited. Demonstration purposes only.

## Support

For questions about this demo, contact ETHOS Limited.

---

**⚠️ Demo Notice**: This is a demonstration application. Do not use with real personal data. 