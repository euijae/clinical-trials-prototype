# Clinical Trials Chatbot (Prototype)

> Note: If there's anything I've missed, please feel free to reach out. I am more than happy to address it

## Scopes

- This application focuses on the AI assistant feature.
- Q&A chat service where the AI assistant helps Sarah answer questions related to clinical trials, based on the [dataset](./backend/data/ctg-studies.csv)
- Conversations persist as long as the user session is active.

## Deep Dive

### If Sarah wanted to filter trials by additional criteria (e.g., trial phase, sponsor), how would you extend the functionality?

I would add extra metadata fields like phase and sponsor when loading the data, then extend the backend and search bar so Sarah can apply filters before retrieving the most relevant trials.

### What compromises did you make in your solution, and why were those compromises necessary?

The compromises I made in my solution is in-memory storage to make my prototype simple. 

### How would you identify opportunities to improve the user experience of this application, and what would you prioritize first?

I would monitor how clients search and identify where results are weak. Then I would gather feedback and prioritize adding clear filters and showing citations to build trust in the answers.

## Bonus Points

### NSCLC has many different representations in the dataset. 

> Note: For example, it could be “non small cell lung cancer”, “non small cell lung carcinoma”, “NSCLC”, “carcinoma of the lungs, non small cell”, etc. How do we capture all the relevant clinical trials for searches on any disease?

I would normalize synonyms by mapping different terms to a single canonical label so that all relevant trials are matched.

### How do we allow her to search for NSCLC trials -AND- immunotherapy related drugs?

Combine semantic search with filters, so the system retrieves only documents that match both NSCLC and immunotherapy.

### How would you deploy your software?

I would containerize the app with Docker and deploy it to a cloud provider (e.g., AWS or Vercel) so it can scale and be easily updated.

### What are the alternatives to loading the dataset into memory, and why would you want to use those alternatives?

Instead of in-memory storage, I could use a vector database, which allows larger datasets, persistence, and faster retrieval at scale.

### How do we evaluate completeness of results?

Compare retrieved trials against a known ground truth set, track recall and precision metrics, and review whether queries consistently return all the expected trials.

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