# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/bb4c8e0f-7e4f-4a6a-84c7-f8bd0db941e0

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/bb4c8e0f-7e4f-4a6a-84c7-f8bd0db941e0) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Configuration

Environment variables are loaded from the `.env` file at the root of the project. Copy `.env` as `.env.local` if you need different settings per environment and restart the dev server after changing values.

| Variable | Description | How to obtain |
| --- | --- | --- |
| `VITE_SUPABASE_PROJECT_ID` | Supabase project identifier used to connect the app to the correct backend project. | Found in your Supabase project's settings under **Project Settings → General → Reference ID**. |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Public API key required for client-side Supabase calls. | In the Supabase dashboard, go to **Project Settings → API** and copy the "anon public" key. |
| `VITE_SUPABASE_URL` | Base URL for the Supabase REST and realtime services. | Available in **Project Settings → API** within the Supabase dashboard. |
| `VITE_STRIPE_BETA_LINK` | Shareable Stripe Payment Link that allows users to purchase or join the beta offering promoted in the app. | In the Stripe Dashboard, create or open the Payment Link associated with your beta product (test mode for development), then copy the link URL from the "Share" panel. |

For Stripe, ensure you create the Payment Link in **test mode** while working locally. Once you're ready for production, switch the URL to the live link so users can complete the purchase flow.

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/bb4c8e0f-7e4f-4a6a-84c7-f8bd0db941e0) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
