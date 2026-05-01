
  # Travel app frontend design

  This is a code bundle for Travel app frontend design. The original project is available at https://www.figma.com/design/rijnP1GKQZN5bkU7czAxGE/Travel-app-frontend-design.

  ## Running the code

  Run `npm i` to install the dependencies.

  Create a local `.env.local` file from `.env.example` and set `OPENROUTER_API_KEY`.

  Run `npm run dev` to start the development server.

  Run `npx vercel dev` or `npm run dev:vercel` when you need to test the `/api/openrouter` Vercel function locally.

  ## Vercel environment

  Add `OPENROUTER_API_KEY` in the Vercel project settings for Production, Preview, and Development as needed. Do not use a `VITE_` prefix for AI provider secrets; the browser calls `/api/openrouter`, and the Vercel function reads the secret server-side.

  If you have access to the project team, run `vercel link` once, then `vercel env pull .env.local` to mirror the selected Vercel environment locally.
  
