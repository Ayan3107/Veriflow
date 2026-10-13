# VERIFLOW

**Turn a research question into an evidence-backed report.**

VERIFLOW is an AI-assisted research application that searches the web, collects relevant evidence, and uses Google Gemini to synthesize concise answers with source references and practical next steps.

- **Live demo:** https://veriflow-blond.vercel.app/
- **API:** https://veriflow-ofla.onrender.com/
- **Health check:** https://veriflow-ofla.onrender.com/health

## Features

- **Web research:** Search the web using Tavily.
- **AI synthesis:** Generate answers using Google Gemini and retrieved source excerpts.
- **Source transparency:** Return source titles, URLs, excerpts, and relevance scores.
- **Structured reports:** Include summaries, recommended next steps, and limitations.
- **Graceful fallback:** Use the Tavily answer or a fallback message when Gemini cannot generate a usable response.

## Architecture

```text
Research question
       |
       v
Next.js frontend
       |
       v
FastAPI backend
       |
       v
Tavily web search
       |
       v
Source evidence
       |
       v
Google Gemini synthesis
       |
       v
Report + source links + next steps
```

## Technology stack

- **Frontend:** Next.js
- **Backend:** Python, FastAPI, Pydantic
- **Web search:** Tavily
- **AI synthesis:** Google Gemini API
- **Deployment:** Vercel and Render

## Try the live demo

Open the [VERIFLOW application](https://veriflow-blond.vercel.app/) and enter a specific research question.

Example:

> What are the main risks and benefits of using small language models for AI agents?

Review the generated answer and open the linked sources to verify the evidence.

## Run locally

### Prerequisites

- Python 3.11 or newer
- Node.js and npm
- Tavily and Google Gemini API keys

### 1. Clone the repository

```bash
git clone https://github.com/Ayan3107/Veriflow.git
cd Veriflow
```

### 2. Configure the backend

Create `backend/.env`:

```dotenv
TAVILY_API_KEY=your_tavily_api_key
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
FRONTEND_ORIGIN=http://localhost:3000
```

Install the backend dependencies:

**Windows PowerShell**

```powershell
python -m venv backend\.venv
.\backend\.venv\Scripts\Activate.ps1
python -m pip install -r backend\requirements.txt
```

Start the backend:

```powershell
cd backend
python -m uvicorn main:app --reload --port 8000
```

The API runs at `http://127.0.0.1:8000`. Interactive API documentation is available at `http://127.0.0.1:8000/docs`.

### 3. Configure the frontend

Open a second terminal and navigate to the frontend directory:

```bash
cd frontend
```

Configure `NEXT_PUBLIC_API_URL` to point to the backend, using the environment-file convention supported by the frontend. For local development, use:

```dotenv
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

Install dependencies and start Next.js:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## API endpoints

| Endpoint | Purpose |
|---|---|
| `GET /` | Basic service information |
| `GET /health` | Reports backend health and whether provider keys are configured |
| `POST /mission` | Searches for evidence and returns a structured research report |

Example request to `POST /mission`:

```json
{
  "question": "What are the risks and benefits of small language models?"
}
```

The API also accepts the legacy `mission` field.

## Limitations and responsible use

- AI-generated answers can contain errors or omit important context.
- Search results depend on the query and available web coverage.
- Source excerpts do not independently prove that a claim is true.
- Gemini synthesis can fall back to Tavily when a usable Gemini response is unavailable.
- Verify important claims against the original sources, especially before making consequential decisions.
- Provider availability, model access, and usage limits depend on current account settings and service availability.

## Security

- Keep API keys in server-side environment variables.
- Never commit `.env` files or expose provider keys in frontend code.
- Never place secrets in `NEXT_PUBLIC_*` variables.
- Rotate any key that is accidentally exposed.

## Current implementation

VERIFLOW currently uses Tavily for web research and Google Gemini for answer synthesis. It does not currently implement Nebius Token Factory or an NVIDIA model.

## License

Released under the MIT License. See [LICENSE](LICENSE).
