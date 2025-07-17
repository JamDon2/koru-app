# Koru App

A finance app built with a monorepo setup. This project has a FastAPI API backend, a Next.js web frontend, and a React Native mobile app all in one place.

## What's in here?

This is a monorepo, which means all our different apps live in the same repo instead of being split up. Here's what we have:

### Apps

- **`apps/api/`** - Python FastAPI backend that handles all the server stuff
- **`apps/web/`** - Next.js web app (the website)
- **`apps/mobile/`** - React Native mobile app using Expo

### Packages

- **`packages/api-client/`** - Shared TypeScript client for talking to the API

### Services

- **`services/email/`** - Email service for sending emails

## Getting started

### Prerequisites

- `pnpm` package manager
- Python 3.12+
- PostgreSQL database
- Redis (for caching and sessions)
- RabbitMQ (for background tasks)

### Environment setup

You'll need to set up environment variables for each app:

**API (apps/api/.env):**

```bash
DATABASE_URL=postgresql://user:password@localhost/koru_db
JWT_SECRET=your-super-secret-jwt-key
HCAPTCHA_SITEKEY=your-hcaptcha-site-key
HCAPTCHA_SECRET=your-hcaptcha-secret
GOCARDLESS_SECRET_ID=your-gocardless-id
GOCARDLESS_SECRET_KEY=your-gocardless-key

# Optional - these have defaults
REDIS_HOST=localhost
REDIS_PORT=6379
RABBITMQ_HOST=localhost
RABBITMQ_USER=guest
RABBITMQ_PASSWORD=guest
```

**Web app (apps/web/.env.local):**

```bash
API_URL=http://127.0.0.1:8000/
NEXT_PUBLIC_API_URL=/api
```

You can copy `apps/web/example.env.local` to get started with the web app.

### Installation and startup

```bash
# Install everything
pnpm install

# Set up your environment files (see above)

# Start all apps at once
pnpm turbo run dev
```

This will start the API server, web app, and get the mobile app ready to run.

## Development commands

### Running

```bash
# Start everything
pnpm turbo run dev
```

### Database

```bash
# Create a new migration
pnpm db:migrate "your migration name"

# Apply migrations to database
pnpm db:upgrade
```

### API

```bash
# Regenerate the API client when you change the backend
pnpm generate:api-client
```

## Git hooks

We use Husky for automated git hooks that keep the codebase clean:

**Pre-commit hook automatically:**

- Stashes your unstaged changes (so only staged code gets checked)
- Runs linting on all apps
- Regenerates the API client to keep it in sync
- Formats all code with Prettier
- Stages any auto-fixes from linting/formatting
- Restores your stashed changes

If any step fails, it reverts the auto-fixes and aborts the commit. This means you never accidentally commit broken code or outdated API clients.

You don't need to run `pnpm format` manually - the hook does it for you!

## Deployment

### CI/CD Pipeline

When you push to `main`, GitHub Actions automatically:

1. Builds Docker images for API, web, and email services
2. Pushes them to GitHub Container Registry
3. Updates Kubernetes manifests in the separate `koru-infra` repo
4. ArgoCD picks up the changes and deploys to production

### Kubernetes Infrastructure

The production setup uses:

- **ArgoCD** - GitOps deployment (watches the infra repo for changes)
- **Sealed Secrets** - Encrypted secrets management in Git
- **Cert-Manager** - Automatic SSL certificate management
- **Traefik** - Ingress controller with mTLS authentication
- **Cloudflare** - DNS and WAF protection

**Services deployed:**

- `api` - Main FastAPI backend
- `api-celery` - Background task worker (same image, different entrypoint)
- `web` - Next.js frontend
- `email` - Email service for templates

The setup uses mTLS between Traefik and Cloudflare to only allow it to access the backend.

## Tech stack

### Backend (Python)

- **FastAPI** - Modern Python web framework with automatic API docs
- **SQLModel** - Database ORM built on SQLAlchemy and Pydantic
- **PostgreSQL** - Main database
- **Redis** - Caching and session storage
- **RabbitMQ + Celery** - Background task processing
- **Alembic** - Database migrations
- **Pydantic** - Data validation and settings management
- **JWT** - Authentication tokens
- **GoCardless** - Bank account connections and transactions

### Frontend (Web)

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React Query** - Server state management
- **Zustand** - Client state management
- **React Hook Form + Zod** - Forms and validation
- **Radix UI** - Accessible UI components
- **Framer Motion** - Animations

### Mobile (React Native)

- **Expo** - React Native development platform
- **React Navigation** - Navigation library
- **NativeWind** - Tailwind CSS for React Native
- **Expo Router** - File-based routing
- **AsyncStorage** - Local data persistence
- **SecureStore** - Secure credential storage

### Development Tools

- **pnpm** - Fast package manager with workspaces
- **Turbo** - Monorepo build system
- **ESLint + Prettier** - Code linting and formatting
- **TypeScript** - Type safety across the stack
- **Ruff + MyPy** - Python linting and type checking
- **OpenAPI** - API documentation and client generation

### Services & Infrastructure

- **hCaptcha** - Bot protection
- **Email service** - Custom email templates with React Email

The API automatically generates OpenAPI specs which we use to create a TypeScript client. This keeps the frontend and mobile app perfectly synced with the backend - no manual API integration needed!
