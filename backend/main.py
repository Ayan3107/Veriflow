
import logging
import os
from typing import Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, model_validator
from tavily import TavilyClient

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("veriflow")

app = FastAPI(
    title="VERIFLOW API",
    description="Evidence-to-Action Research API powered by Tavily",
    version="0.4.0",
)

allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

frontend_origin = os.getenv("FRONTEND_ORIGIN", "").strip().rstrip("/")
if frontend_origin:
    allowed_origins.append(frontend_origin)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)


class MissionRequest(BaseModel):
    question: Optional[str] = Field(default=None, max_length=1000)
    mission: Optional[str] = Field(default=None, max_length=1000)

    @model_validator(mode="after")
    def validate_mission(self):
        text = (self.question or self.mission or "").strip()

        if len(text) < 12:
            raise ValueError(
                "Provide a research question containing at least 12 characters."
            )

        self.question = text
        self.mission = text
        return self


def get_tavily_client() -> TavilyClient:
    api_key = os.getenv("TAVILY_API_KEY")

    if not api_key:
        raise HTTPException(
            status_code=503,
            detail="Research is unavailable because Tavily is not configured.",
        )

    return TavilyClient(api_key=api_key)


@app.get("/")
def root():
    return {
        "name": "VERIFLOW",
        "status": "online",
        "message": "Evidence-to-Action Research API",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "tavily_configured": bool(os.getenv("TAVILY_API_KEY")),
    }


@app.post("/mission")
def create_mission(request: MissionRequest):
    question = request.question or ""

    try:
        client = get_tavily_client()

        response = client.search(
            query=question,
            search_depth="advanced",
            max_results=5,
            include_answer="advanced",
        )

    except HTTPException:
        raise
    except Exception:
        logger.exception("Tavily research request failed")
        raise HTTPException(
            status_code=502,
            detail=(
                "Tavily could not complete the research request. "
                "Check your API configuration or try again."
            ),
        )

    sources = []

    for index, result in enumerate(response.get("results", []), start=1):
        url = result.get("url")

        if not url:
            continue

        sources.append(
            {
                "id": index,
                "title": result.get("title") or "Untitled source",
                "url": url,
                "content": result.get("content") or "",
                "score": result.get("score"),
            }
        )

    answer = response.get("answer")

    if not answer and sources:
        summary = (
            f"Tavily returned {len(sources)} sources. "
            "Review their excerpts and compare the evidence before deciding."
        )
    elif answer:
        summary = answer
    else:
        summary = (
            "No sources were returned. Try a more specific question "
            "or include the relevant technology, timeframe, or use case."
        )

    next_steps = [
        "Open the linked sources and verify the claims against the original material.",
        "Compare the sources for agreement, disagreement, and missing context.",
        "Check publication dates and prefer authoritative, relevant sources.",
        "Make a decision only after checking whether the evidence fits your situation.",
    ]

    report = {
        "status": "completed",
        "question": question,
        "summary": summary,
        "answer": answer,
        "source_count": len(sources),
        "sources": sources,
        "results": sources,
        "next_steps": next_steps,
        "limitations": (
            "Search summaries may omit context or contain errors. "
            "Verify important claims in the original sources. "
            "A search result alone does not establish that a claim is true."
        ),
    }

    return report
