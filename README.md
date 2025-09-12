# Clinical Trials Chatbot (Prototype)

## Scopes

- This application focuses on the AI assistant feature.
- Q&A chat service where the AI assistant helps Sarah answer questions related to clinical trials, based on the [dataset](./backend/data/ctg-studies.csv)
- Conversations persist as long as the user session is active.

## Environment

- Common
    - `TypeScript` as the primary language
    - `bun` for package management and scripts
    - `prettier` for code formatting
- Frontend
    - `React` for the UI
    - `Redux` for local state/session management
    - `Vite` for build tooling
    - `Tailwind` for CSS styling
- Backend
    - `LangChain` + `OpenAI` for AI assistant logic and query orchestration
    - `zod` for schema-based data validation

## Installation

> Note: Please feel free to use your preferred package manager. I chose `bun` for this assessment.

Start the backend

```bash
# from root
cd ./backend
bun install
bun dev run
```

Start the frontend

```bash
# from root 
cd ./frontend
bun install
bun run dev
```

Open the browser

```
http://localhost:5173
```
