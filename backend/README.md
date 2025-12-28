# Hermeos Proptech Backend API

Complete backend API for the Hermeos Proptech platform built with Node.js, Express, TypeScript, and Prisma.

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- PostgreSQL database
- npm >= 9.0.0

### Installation

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env file with your configuration
# Update DATABASE_URL, JWT_SECRET, etc.

# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed database (optional)
npm run db:seed

# Start development server
npm run dev
```

The API will be available at `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── controllers/           # Business logic
│   │   ├── auth.controller.ts
│   │   ├── property.controller.ts
│   │   ├── ownership.controller.ts
│   │   ├── transfer.controller.ts
│   │   └── admin.controller.ts
│   ├── routes/                # API routes
│   │   ├── auth.routes.ts
│   │   ├── property.routes.ts
│   │   ├── ownership.routes.ts
│   │   ├── transfer.routes.ts
│   │   ├── admin.routes.ts
│   │   └── ...
│   ├── middleware/            
│   │   ├── auth.ts           # JWT authentication
│   │   └── errorHandler.ts   # Error handling
│   ├── utils/
│   │   └── logger.ts         # Winston logger
│   └── server.ts             # Express app
├── package.json
├── tsconfig.json
└── .env.example
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

Returns:
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Using Auth Token
Include the token in the Authorization header:
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/forgot-password` - Send password reset
- `POST /api/auth/reset-password` - Reset password

### Properties
- `GET /api/properties` - Get all properties (with filters)
- `GET /api/properties/:id` - Get property by ID
- `POST /api/properties` - Create property (Admin)
- `PUT /api/properties/:id` - Update property (Admin)
- `DELETE /api/properties/:id` - Delete property (Super Admin)
- `GET /api/properties/:id/distributions` - Get property distributions

### Ownerships
- `GET /api/ownerships/my-ownerships` - Get user's ownerships
- `POST /api/ownerships/register` - Register ownership (purchase units)
- `GET /api/ownerships/:id` - Get ownership details

### Transfer Requests
- `POST /api/transfers` - Create transfer request
- `GET /api/transfers` - Get user's transfer requests
- `GET /api/transfers/:id` - Get transfer request details
- `PUT /api/transfers/:id/approve` - Approve transfer (Admin)
- `PUT /api/transfers/:id/reject` - Reject transfer (Admin)

### Support
- `POST /api/support` - Submit support ticket
- `GET /api/support` - Get user's tickets

### Admin
- `GET /api/admin/dashboard/stats` - Get dashboard statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/:id` - Get user details
- `PUT /api/admin/users/:id/verify` - Verify user
- `PUT /api/admin/users/:id/role` - Update user role
- `GET /api/admin/kyc/pending` - Get pending KYC
- `PUT /api/admin/kyc/:id/approve` - Approve KYC
- `PUT /api/admin/kyc/:id/reject` - Reject KYC
- `GET /api/admin/transfers` - Get all transfer requests
- `GET /api/admin/audit-logs` - Get audit logs

## 🗄️ Database Models

- **User** - User accounts and authentication
- **KYC** - KYC verification records
- **Property** - Real estate properties
- **Ownership** - User property ownership records
- **Transaction** - Financial transactions
- **Distribution** - Income distributions
- **TransferRequest** - Ownership transfer requests
- **Notification** - User notifications
- **Document** - User documents
- **SupportTicket** - Support tickets
- **AdminAuditLog** - Admin action logs

## 🔧 Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm start            # Start production server
npm run db:push      # Push schema changes to database
npm run db:migrate   # Run migrations
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed database with sample data
npm test             # Run tests
npm run lint         # Run ESLint
```

## 🌐 Environment Variables

Required environment variables (see `.env.example`):

- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT secret key
- `SENDGRID_API_KEY` - SendGrid email API key
- `PAYSTACK_SECRET_KEY` - Paystack payment gateway key
- `AWS_ACCESS_KEY_ID` - AWS S3 access key
- `AWS_SECRET_ACCESS_KEY` - AWS S3 secret key
- `AWS_S3_BUCKET` - S3 bucket name

## 🔒 Security Features

- Password hashing with bcrypt
- JWT authentication
- Rate limiting
- Helmet security headers
- CORS configuration
- Input validation with express-validator
- SQL injection protection (Prisma ORM)

## 📝 API Response Format

Success:
```json
{
  "success": true,
  "data": { ... }
}
```

Error:
```json
{
  "status": "error",
  "message": "Error description"
}
```

## 🚀 Production Deployment

1. Set `NODE_ENV=production`
2. Update all environment variables
3. Run database migrations: `npm run db:migrate`
4. Build: `npm run build`
5. Start: `npm start`

## 📞 Support

For backend issues or questions, contact the development team.

## 📄 License

Proprietary - Hermeos Proptech Platform
