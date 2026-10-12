"use client";

import { useState } from "react";

const examples = [
  "Should our team migrate from REST to GraphQL?",
  "Does a four-day workweek improve productivity?",
  "Compare the risks of two competing approaches.",
];

type ResearchSource = {
  id?: number;
  title?: string;
  url?: string;
  content?: string;
  score?: number;
};

type ResearchResult = {
  question?: string;
  mission?: string;
  answer?: string | null;
  summary?: string;
  source_count?: number;
  sources?: ResearchSource[];
  results?: ResearchSource[];
  next_steps?: string[];
  limitations?: string;
};

export default function Home() {
  const [mission, setMission] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [report, setReport] = useState<ResearchResult | null>(null);

  async function runResearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const question = mission.trim();
    if (question.length < 12 || loading) return;

    setLoading(true);
    setError("");
    setReport(null);

    try {
      const apiUrl = (
        process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"
      ).replace(/\/+$/, "");

      const response = await fetch(`${apiUrl}/mission`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mission: question }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "Research failed. Please try again."
        );
      }

      setReport(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not connect to VERIFLOW. Check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  const sources = report?.sources ?? report?.results ?? [];

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#090a0b] text-[#f3f0e8]">
      <header className="relative z-10 flex items-center justify-between border-b border-white/10 px-5 py-5 sm:px-10">
        <a
          href="#"
          className="font-sans text-sm font-bold tracking-[0.22em]"
          aria-label="VERIFLOW home"
        >
          VERIFLOW<span className="text-[#c7ff68]">.</span>
        </a>

        <div className="flex items-center gap-2 text-[10px] tracking-[0.16em] text-white/55 sm:text-xs">
          <span className="h-2 w-2 rounded-full bg-[#c7ff68]" />
          EVIDENCE INTELLIGENCE
        </div>
      </header>

      <section className="relative isolate flex min-h-[780px] flex-col overflow-hidden">
        <video
          className="absolute inset-0 -z-30 h-full w-full object-cover opacity-55"
          src="/media/animo-parallax-totem-1080p.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />

        <div className="absolute inset-0 -z-20 bg-gradient-to-b from-[#090a0b]/40 via-[#090a0b]/50 to-[#090a0b]" />

        <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-5 pb-12 pt-28 sm:px-10 sm:pb-16 sm:pt-36">
          <div className="mb-10 max-w-4xl">
            <p className="mb-6 text-[10px] tracking-[0.28em] text-[#c7ff68] sm:text-xs">
              RESEARCH FIRST. DECIDE WITH CONFIDENCE.
            </p>

            <h1 className="font-sans text-5xl font-medium leading-[0.98] tracking-[-0.055em] sm:text-7xl md:text-8xl">
              Less guessing.
              <br />
              <span className="text-white/45">More evidence.</span>
            </h1>

            <p className="mt-7 max-w-xl text-sm leading-7 text-white/65 sm:text-base">
              Investigate complex questions, discover relevant sources,
              compare findings, and turn research into a clearer next step.
            </p>
          </div>

          <form
            onSubmit={runResearch}
            className="w-full max-w-4xl rounded-xl border border-white/15 bg-black/55 p-4 shadow-2xl backdrop-blur-xl sm:p-6"
          >
            <label
              htmlFor="mission"
              className="mb-4 block text-[10px] tracking-[0.2em] text-white/55"
            >
              YOUR RESEARCH MISSION
            </label>

            <textarea
              id="mission"
              value={mission}
              onChange={(event) => setMission(event.target.value)}
              placeholder="What do you need to investigate or decide?"
              minLength={12}
              maxLength={1000}
              rows={3}
              required
              disabled={loading}
              className="w-full resize-y border-0 border-b border-white/15 bg-transparent py-3 font-sans text-xl leading-relaxed text-white outline-none placeholder:text-white/30 focus:border-[#c7ff68] sm:text-2xl"
            />

            <div className="flex flex-col justify-between gap-4 pt-5 sm:flex-row sm:items-center">
              <span className="text-xs text-white/40">
                Research backed by discoverable sources.
              </span>

              <button
                type="submit"
                disabled={loading || mission.trim().length < 12}
                className="flex min-h-12 items-center justify-center gap-5 rounded-md bg-[#c7ff68] px-6 font-sans text-xs font-bold tracking-wide text-[#10120b] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? "RESEARCHING..." : "INVESTIGATE"}
                <span aria-hidden="true">↗</span>
              </button>
            </div>

            <div className="mt-5 flex flex-wrap gap-2 border-t border-white/10 pt-4">
              {examples.map((example) => (
                <button
                  key={example}
                  type="button"
                  disabled={loading}
                  onClick={() => setMission(example)}
                  className="rounded-full border border-white/15 px-3 py-2 text-left font-sans text-xs text-white/60 transition hover:border-[#c7ff68] hover:text-white disabled:opacity-40"
                >
                  {example}
                </button>
              ))}
            </div>
          </form>

          {error && (
            <div
              role="alert"
              className="mt-5 max-w-4xl rounded-lg border border-red-400/30 bg-red-950/40 p-4 text-sm text-red-200"
            >
              {error}
            </div>
          )}

          {report && (
            <section
              aria-live="polite"
              className="mt-8 max-w-4xl rounded-xl border border-white/15 bg-[#111314]/95 p-5 sm:p-7"
            >
              <p className="mb-3 text-[10px] tracking-[0.2em] text-[#c7ff68]">
                RESEARCH REPORT
              </p>

              <h2 className="mb-4 font-sans text-xl font-medium sm:text-2xl">
                {report.question || report.mission || mission}
              </h2>

              <div className="mb-6 flex flex-wrap items-center gap-3 text-xs text-white/50">
                <span>
                  {report.source_count ?? sources.length} sources found
                </span>
                <span aria-hidden="true">·</span>
                <span>Powered by Tavily</span>
              </div>

              {(report.answer || report.summary) && (
                <div>
                  <h3 className="mb-2 text-xs font-semibold tracking-[0.16em] text-white/50">
                    FINDINGS
                  </h3>
                  <p className="whitespace-pre-wrap text-sm leading-7 text-white/80">
                    {report.answer || report.summary}
                  </p>
                </div>
              )}

              {sources.length > 0 && (
                <div className="mt-8">
                  <h3 className="mb-2 text-xs font-semibold tracking-[0.16em] text-white/50">
                    SOURCES & EVIDENCE
                  </h3>

                  {sources.map((source, index) => (
                    <article
                      key={`${source.url || source.title || "source"}-${index}`}
                      className="border-t border-white/10 py-5"
                    >
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 text-xs text-[#c7ff68]">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <div className="min-w-0 flex-1">
                          {source.url ? (
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="break-words font-sans text-sm font-medium text-[#c7ff68] hover:underline"
                            >
                              {source.title || source.url} ↗
                            </a>
                          ) : (
                            <h4 className="text-sm font-medium">
                              {source.title || `Source ${index + 1}`}
                            </h4>
                          )}

                          {typeof source.score === "number" && (
                            <p className="mt-1 text-xs text-white/40">
                              Search relevance score:{" "}
                              {source.score.toFixed(2)}
                            </p>
                          )}

                          {source.content && (
                            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-white/60">
                              {source.content}
                            </p>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {report.next_steps && report.next_steps.length > 0 && (
                <div className="mt-6 border-t border-white/10 pt-5">
                  <h3 className="mb-3 text-xs font-semibold tracking-[0.16em] text-[#c7ff68]">
                    RECOMMENDED NEXT STEPS
                  </h3>

                  <ol className="space-y-3">
                    {report.next_steps.map((step, index) => (
                      <li
                        key={`${index}-${step}`}
                        className="flex gap-3 text-sm leading-6 text-white/70"
                      >
                        <span className="text-white/35">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {report.limitations && (
                <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.03] p-4">
                  <h3 className="mb-2 text-xs font-semibold tracking-[0.16em] text-white/50">
                    IMPORTANT LIMITATIONS
                  </h3>
                  <p className="text-xs leading-6 text-white/55">
                    {report.limitations}
                  </p>
                </div>
              )}
            </section>
          )}
        </div>
      </section>

      <footer className="flex flex-col justify-between gap-3 border-t border-white/10 px-5 py-6 text-[10px] tracking-[0.15em] text-white/40 sm:flex-row sm:px-10">
        <span>VERIFLOW · EVIDENCE-TO-ACTION</span>
        <a
          href="https://github.com/Ayan3107"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white"
        >
          GITHUB ↗
        </a>
      </footer>
    </main>
  );
}