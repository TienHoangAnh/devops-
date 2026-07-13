# Deploy to Vercel

This repository is deployed as **two Vercel projects**. The frontend is a static Vite site; the Express API is a serverless project. A managed PostgreSQL database is required. Redis is optional in the current codebase and may be supplied by Upstash when it is used.

## 1. Backend project

Import the same Git repository in Vercel and set **Root Directory** to `backend`.

Set these Production environment variables:

```text
DATABASE_URL=postgresql://...
JWT_SECRET=<long-random-secret>
JWT_REFRESH_SECRET=<different-long-random-secret>
FRONTEND_URL=https://<your-frontend>.vercel.app
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<smtp-user>
SMTP_PASS=<smtp-app-password>
EMAIL_FROM=DevOps Learning <noreply@example.com>
GOOGLE_CLIENT_ID=<google-client-id>
GOOGLE_CLIENT_SECRET=<google-client-secret>
```

`backend/api/index.ts` is the Vercel entry point. Before the first deploy, apply the schema to the production database from a trusted environment:

```powershell
npm.cmd run db:push --prefix backend
npm.cmd run db:seed --prefix backend
```

Use the deployed backend URL as `https://<your-api>.vercel.app`.

## 2. Frontend project

Import the repository again with the root directory left at the repository root. The root `vercel.json` builds `frontend` and includes the SPA fallback.

Set:

```text
VITE_API_URL=https://<your-api>.vercel.app/api
VITE_GOOGLE_CLIENT_ID=<google-client-id>
```

Redeploy the backend after the frontend domain is known and set `FRONTEND_URL` to that exact HTTPS URL. For a preview domain, add it to `FRONTEND_URL` as a comma-separated value.

## 3. Google OAuth

In Google Cloud Console add the frontend URL to **Authorized JavaScript origins**. The Google client ID in the frontend and backend must be the same. This app uses Google Identity Services to exchange an ID token; no redirect callback URL is needed for this login flow.

## Security checklist

- Never commit `.env` files or production credentials.
- Use distinct, random JWT secrets in production.
- Create a managed PostgreSQL database; serverless functions cannot use the Docker Compose database.
- The default demo accounts in `prisma/seed.ts` are for development only. Change or remove them before a public launch.
