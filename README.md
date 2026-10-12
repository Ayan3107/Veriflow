# VERIFLOW

A web-based research assistant powered by Tavily, with a Next.js frontend and FastAPI backend.

## Features
- Web research and source links
- Structured research answers and summaries
- Suggested next steps and limitations

## Run locally
Backend: activate your Python environment, install dependencies with `python -m pip install -r backend/requirements.txt`, then run `python -m uvicorn main:app --reload --port 8000` from the backend directory.

Frontend: run `npm install` and `npm run dev` from the frontend directory.

Set `TAVILY_API_KEY` in `backend/.env`. Set `NEXT_PUBLIC_API_URL` for the frontend when using a separately hosted backend.

## Security
Never commit API keys or `.env` files. Verify important research claims against their original sources.

Project under active development.

