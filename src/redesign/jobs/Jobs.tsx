import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Bookmark,
  BriefcaseBusiness,
  Search,
  Share2,
} from "lucide-react";
import { useProductDomain } from "../domain/useProductDomain";
import type { Page } from "../types";
import Applicants from "./Applicants";
import JobApplication from "./JobApplication";
import JobDetail from "./JobDetail";
import { jobs, type JobCategory, type JobType, type Job } from "./data";
import "./jobs.css";
import JobEditor from "./JobEditor";
import { useLocalState } from "../storage";
export default function Jobs({
  notify,
  navigate,
}: {
  notify: (message: string) => void;
  navigate: (page: Page) => void;
}) {
  const { state, toggleSaved } = useProductDomain();
  const [listings, setListings] = useLocalState<Job[]>("job-listings", []);
  const [editor, setEditor] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"All" | JobCategory>("All");
  const [type, setType] = useState<"All" | JobType>("All");
  const [savedOnly, setSavedOnly] = useState(false);
  const [selected, setSelected] = useState<Job | null>(() => [...listings, ...jobs].find(job => job.id === new URLSearchParams(location.search).get("item")) || null);
  const [applying, setApplying] = useState(false);
  const [view, setView] = useState<"Browse" | "Applicants">("Browse");
  const filtered = useMemo(
    () =>
      [...listings, ...jobs].filter(
        (job) =>
          (category === "All" || job.category === category) &&
          (type === "All" || job.type === type) &&
          (!savedOnly ||
            state.savedItems.some(
              (item) => item.kind === "job" && item.id === job.id,
            )) &&
          `${job.title} ${job.studio} ${job.category}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [category, type, savedOnly, state.savedItems, query, listings],
  );
  const save = (job: Job) => {
    toggleSaved({ id: job.id, kind: "job", title: job.title });
    notify("Saved jobs updated on this device.");
  };
  if (selected)
    return (
      <main className="jobs-page">
        {applying ? (
          <JobApplication job={selected} onClose={() => setApplying(false)} />
        ) : (
          <JobDetail
            job={selected}
            saved={state.savedItems.some(
              (i) => i.kind === "job" && i.id === selected.id,
            )}
            onBack={() => setSelected(null)}
            onSave={() => save(selected)}
            onApply={() => setApplying(true)}
          />
        )}
      </main>
    );
  return (
    <main className="jobs-page">
      <header className="jobs-hero">
        <button
          className="icon-button"
          onClick={() => navigate("tools")}
          aria-label="Back to creative tools"
        >
          <ArrowLeft />
        </button>
        <div>
          <p className="eyebrow">OPPORTUNITY, WITH INTENTION</p>
          <h1>
            Find work that
            <br />
            feels like yours.
          </h1>
          <p>Creative briefs, flexible roles, and thoughtful teams.</p>
        </div>
        <BriefcaseBusiness aria-hidden="true" />
      </header>
      <div className="jobs-section-heading"><div><p className="eyebrow">YOUR NEXT CHAPTER</p><h2>Open opportunities</h2></div><button className="button primary" onClick={() => setEditor(true)}>Post a role</button></div>
      <nav className="jobs-tabs">
        <button
          aria-pressed={view === "Browse"}
          onClick={() => setView("Browse")}
        >
          Browse roles
        </button>
        <button
          aria-pressed={view === "Applicants"}
          onClick={() => setView("Applicants")}
        >
          Your applicants <span>3</span>
        </button>
      </nav>
      {view === "Applicants" ? (
        <Applicants navigate={navigate} />
      ) : (
        <>
          <section className="jobs-filters">
            <label>
              <Search />
              <input
                aria-label="Search jobs"
                type="search"
                placeholder="Search role, studio, or craft"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            <select
              aria-label="Filter by category"
              value={category}
              onChange={(e) => setCategory(e.target.value as typeof category)}
            >
              <option value="All">All disciplines</option>
              <option>Photography</option>
              <option>Film</option>
              <option>Design</option>
              <option>Music</option>
            </select>
            <select
              aria-label="Filter by job type"
              value={type}
              onChange={(e) => setType(e.target.value as typeof type)}
            >
              <option value="All">All job types</option>
              <option>Freelance</option>
              <option>Contract</option>
              <option>Part-time</option>
              <option>Full-time</option>
            </select>
            <button
              className={`button secondary ${savedOnly ? "is-active" : ""}`}
              aria-pressed={savedOnly}
              onClick={() => setSavedOnly(!savedOnly)}
            >
              Saved jobs
            </button>
          </section>
          <p className="jobs-count">
            {filtered.length} opportunities · Sample listings
          </p>
          <section className="jobs-list">
            {filtered.map((job) => (
              <article key={job.id}>
                <button
                  className="job-open"
                  aria-label={`Open ${job.title}`}
                  onClick={() => setSelected(job)}
                >
                  <span className="job-mark">{job.studio.slice(0, 1)}</span>
                  <span>
                    <small>
                      {job.category} · {job.type}
                    </small>
                    <strong>{job.title}</strong>
                    <em>{job.studio}</em>
                    <span className="job-summary-preview">{job.summary}</span>
                  </span>
                  <span className="job-budget">
                    {job.budget}
                    <small>{job.location}</small>
                  </span>
                  <ArrowUpRight />
                </button>
                <div className="job-quick">
                  <button
                    aria-label={`Save ${job.title}`}
                    aria-pressed={state.savedItems.some(
                      (i) => i.kind === "job" && i.id === job.id,
                    )}
                    onClick={() => save(job)}
                  >
                    <Bookmark
                      fill={
                        state.savedItems.some(
                          (i) => i.kind === "job" && i.id === job.id,
                        )
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </button>
                  <button
                    aria-label={`Share ${job.title}`}
                    onClick={async () => {
                      const url = `${location.origin}/jobs?item=${encodeURIComponent(job.id)}`;
                      try {
                        if (navigator.share) await navigator.share({title:job.title,text:job.summary,url});
                        else if (navigator.clipboard) { await navigator.clipboard.writeText(url); notify("Job link copied."); }
                        else notify("Sharing is unavailable in this browser.");
                      } catch (error) { if (!(error instanceof DOMException && error.name === "AbortError")) notify("Couldn’t share this role. Try again."); }
                    }}
                  >
                    <Share2 />
                  </button>
                </div>
              </article>
            ))}
            {!filtered.length && (
              <div className="jobs-empty">
                <Search />
                <h2>No roles in this corner yet.</h2>
                <p>Clear a filter or try another creative discipline.</p>
                <button
                  className="button primary"
                  onClick={() => {
                    setQuery("");
                    setCategory("All");
                    setType("All");
                    setSavedOnly(false);
                  }}
                >
                  Show all roles
                </button>
              </div>
            )}
          </section>
        </>
      )}
      {editor && <JobEditor onClose={() => setEditor(false)} onSave={job => { setListings(current => [job, ...current]); setEditor(false); setQuery(""); setCategory("All"); setType("All"); setSavedOnly(false); setView("Browse"); }} />}
    </main>
  );
}
