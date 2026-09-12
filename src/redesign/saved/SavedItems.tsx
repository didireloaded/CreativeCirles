import { useState } from "react";
import { ArrowLeft, Bookmark, Search, Trash2 } from "lucide-react";
import { useProductDomain } from "../domain/useProductDomain";
import type { Page } from "../types";
import "../opportunities/opportunities.css";
import "./saved.css";
import BottomSheet from "../components/BottomSheet";
import type { SavedItem } from "../domain/types";
import { useNavigate } from "react-router-dom";
export default function SavedItems({
  navigate,
}: {
  navigate: (p: Page) => void;
}) {
  const { state, toggleSaved } = useProductDomain();
  const router = useNavigate();
  const [selected, setSelected] = useState<SavedItem | null>(null);
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState("All");
  const list = state.savedItems.filter(
    (x) =>
      (kind === "All" || x.kind === kind) &&
      x.title.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <main className="saved-page">
      <header className="saved-hero">
        <button
          className="icon-button"
          onClick={() => navigate("tools")}
          aria-label="Back to creative tools"
        >
          <ArrowLeft />
        </button>
        <div>
          <p className="eyebrow">KEEP WHAT MOVES YOU</p>
          <h1>Saved</h1>
          <p>Work, people, jobs, opportunities, and ideas in one place.</p>
        </div>
        <Bookmark />
      </header>
      <section className="saved-controls">
        <label>
          <Search />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search saved items"
            placeholder="Search your saved collection"
          />
        </label>
        <select
          aria-label="Filter saved items"
          value={kind}
          onChange={(e) => setKind(e.target.value)}
        >
          <option>All</option>
          <option value="work">Work</option>
          <option value="creator">Creators</option>
          <option value="job">Jobs</option>
          <option value="opportunity">Opportunities</option>
          <option value="project">Projects</option>
          <option value="template">Templates</option>
        </select>
      </section>
      <section className="saved-list">
        {list.map((item) => (
          <article key={`${item.kind}-${item.id}`}>
            <span>{item.kind}</span>
            <button className="saved-open" onClick={() => setSelected(item)}>{item.title}</button>
            <button
              className="icon-button"
              aria-label={`Remove ${item.title}`}
              onClick={() => toggleSaved(item)}
            >
              <Trash2 />
            </button>
          </article>
        ))}
        {!list.length && (
          <div className="saved-empty">
            <Bookmark />
            <h2>Nothing saved here yet.</h2>
            <p>
              Change the filter or explore the circle to keep something useful.
            </p>
            <button
              className="button primary"
              onClick={() => navigate("discover")}
            >
              Explore work
            </button>
          </div>
        )}
      </section>
      <BottomSheet open={Boolean(selected)} title={selected?.title || "Saved item"} onClose={() => setSelected(null)}>
        {selected && <div className="saved-detail"><p className="eyebrow">{selected.kind}</p><h2>{selected.title}</h2>{selected.content && <pre>{selected.content}</pre>}<button className="button primary" onClick={() => { const routes:Record<string,Page>={work:'home',job:'jobs',creator:'talent',project:'projects',opportunity:'buzz',template:'ai-studio',product:'business'}; router(`/${routes[selected.kind]}?item=${encodeURIComponent(selected.id)}`); }}>Open {selected.kind === 'template' ? 'Drafting Studio' : selected.kind}</button></div>}
      </BottomSheet>
    </main>
  );
}
