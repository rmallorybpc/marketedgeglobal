# PartnerAI (MarketEdge)

PartnerAI™ is the platform front-end for MarketEdge's AI-enabled tooling. This React + TypeScript app demonstrates the PartnerAI interface and the Coms Support Coach integration. The project uses Vite, Tailwind CSS, and Material UI.

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Material UI
- React Router

## Prerequisites

- Node.js 18+ (recommended)
- npm 9+

## PartnerAI demo

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Lint the codebase:

```bash
npm run lint
```

## Project Structure

```
.
├── src/                 # Application source
├── index.html           # HTML entry
├── vite.config.ts       # Vite config
├── tailwind.config.js   # Tailwind config
└── tsconfig*.json       # TypeScript config
```

## Notes

If you are setting up new routes or layouts, check `src/main.tsx` and the components in `src/layout`.

For documentation-only branches that don't include a `package.json`, tooling commands like `npm run lint` won't be available.

## Agent Chat (OpenAI)

The chat widget on the site calls a separate backend proxy to keep your API key private.

- See docs/agent-backend.md for setup
- Set the GitHub Actions secret VITE_AGENT_API_URL to your deployed /agent endpoint
 - Optional: use the Fly.io deployment workflow in .github/workflows/deploy-agent.yml

## PartnerAI demo Page with ChatGPT Assistant

The PartnerAI demo includes an integrated chat widget that connects directly to an OpenAI Assistant. This allows visitors to ask questions about your organization's messaging and communications.

### Setup

1. **Get your OpenAI API key:**
   - Go to [platform.openai.com/api/keys](https://platform.openai.com/api/keys)
   - Create a new secret key
   - Keep this safe (don't commit it!)

2. **Get your Assistant ID:**
   - Go to [platform.openai.com/assistants](https://platform.openai.com/assistants)
   - Find your assistant in the list
   - Copy the ID (looks like `asst_XXXXXXXXXXXXXXXX`)

3. **Configure environment variables:**
   - Copy `.env.example` to `.env.local`
   - Add your OpenAI API key: `VITE_OPENAI_API_KEY=sk_...`
   - Add your Assistant ID: `VITE_OPENAI_ASSISTANT_ID=asst_...`

4. **Development:**
   ```bash
   npm run dev
   ```
   Visit `/get-started/` to test the PartnerAI demo

### Important: API Key Security

**⚠️ Never commit your `.env.local` file or API keys to version control.**

For production deployments:
- Store secrets in your hosting platform's environment variable settings (Vercel, Netlify, GitHub Pages Actions, etc.)
- The Vite dev server reads from `.env.local` automatically
- The build process injects `VITE_*` prefixed variables at build time

# Site

https://marketedgeglobal.github.io/marketedgeglobal/

