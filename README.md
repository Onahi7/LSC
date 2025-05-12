# LSC

A modern, feature-rich church web application built with Next.js 14, TypeScript, and TailwindCSS. This application provides a comprehensive solution for church management, including user authentication, role-based access control, sermon management, and more.

## Features

- 🔐 **Advanced Authentication**
  - Email and password authentication
  - Google OAuth integration
  - Email verification
  - Password reset functionality
  - Session management with JWT refresh tokens

- 👥 **User Management**
  - Role-based access control (SUPERADMIN, ADMIN, PASTOR, LEADER, MEMBER)
  - User profiles with image upload
  - Customizable privacy settings
  - Profile verification system

- 🎨 **Modern UI/UX**
  - Responsive design with TailwindCSS
  - Dark/Light theme support
  - Custom UI components using Radix UI
  - Interactive galleries and carousels

- 📱 **Content Management**
  - Sermon management system
  - Events calendar
  - Ministry sections
  - Photo gallery
  - Testimonials

- 💰 **Online Giving**
  - Integrated payment system with Paystack
  - Secure transaction handling
  - Donation tracking

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18.x or later
- pnpm (recommended) or npm
- PostgreSQL database (or Neon.tech account)
- Cloudinary account (for image uploads)

## Installation

1. Clone the repository:
\`\`\`powershell
git clone https://github.com/Onahi7/LSC
cd lsc
\`\`\`

2. Install dependencies:
\`\`\`powershell
pnpm install
npm install --legacy-peer-deps
\`\`\`

3. Set up environment variables:
Create a \`.env\` file in the root directory with the following variables:
\`\`\`env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/your-database"

# Next Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# OAuth - Google
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Email (for verification and password reset)
SMTP_HOST="your-smtp-host"
SMTP_PORT="587"
SMTP_USER="your-smtp-username"
SMTP_PASSWORD="your-smtp-password"
EMAIL_FROM="noreply@yourchurch.com"

# Paystack (for donations)
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY="your-paystack-public-key"
PAYSTACK_SECRET_KEY="your-paystack-secret-key"
\`\`\`

4. Initialize the database:
\`\`\`powershell
# Push the database schema
npx prisma init


# Generate Prisma Client
npx prisma generate
then
npx prisma db push

# (Optional) Seed the database with initial data
pnpm prisma db seed
\`\`\`

## Development

To start the development server:
\`\`\`powershell
pnpm dev or
npm run dev
\`\`\`

The application will be available at \`http://localhost:3000\`

## Database Management

### Prisma Studio
To view and manage your database through Prisma Studio:
\`\`\`powershell
npx prisma studio
\`\`\`

### Database Migrations
When you make changes to the schema:
\`\`\`powershell
# Create a migration
npx prisma migrate dev --name your_migration_name

# Apply migrations
npxprisma migrate deploy
\`\`\`

## Building for Production

1. Build the application:
\`\`\`powershell
pnpm build or
npm run build
\`\`\`

2. Start the production server:
\`\`\`powershell
pnpm start or
npm run dev
\`\`\`

## Project Structure

\`\`\`
├── app/                  # Next.js app directory
│   ├── api/             # API routes
│   ├── auth/            # Authentication pages
│   └── components/      # Page-specific components
├── components/          # Reusable components
│   └── ui/             # UI components
├── hooks/              # Custom React hooks
├── lib/               # Utility functions and configurations
├── prisma/            # Database schema and migrations
├── providers/         # React context providers
├── public/           # Static assets
└── types/            # TypeScript type definitions
\`\`\`

## Testing

Run the test suite:
\`\`\`powershell
pnpm test
\`\`\`

## Contributing

1. Fork the repository
2. Create your feature branch: \`git checkout -b feature/new-feature\`
3. Commit your changes: \`git commit -m 'Add new feature'\`
4. Push to the branch: \`git push origin feature/new-feature\`
5. Submit a pull request

## License

[MIT License](LICENSE)

## Support

For support, email support@yourchurch.com or create an issue in the repository.
