This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

Build the OAuth 2.0 Client locally through the Google Cloud Console to ensure that the web page can run normally locally.

Create a file at the root of your project called .env.local

Example of .env.local:

NEXTAUTH_URL=http://localhost:3000

NEXTAUTH_SECRET= a-base64-secret

GOOGLE_CLIENT_ID= your-google-client-id

GOOGLE_CLIENT_SECRET= your-google-client-secret

If you want to Run locally, you need to create a OAuth 2.0 Client on Google Cloud console

This file shoud named <.env.local>

Here are some pieces of information that you might use: 

Authorized redirect URIs: http://localhost:3000/api/auth/callback/google

Authorized JavaScript origins: http://localhost:3000


This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
