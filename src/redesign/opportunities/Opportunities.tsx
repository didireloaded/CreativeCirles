import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Bookmark,
  CalendarPlus,
  Check,
  Handshake,
  MapPin,
  Search,
  Newspaper,
} from "lucide-react";
import { useProductDomain } from "../domain/useProductDomain";
import type { Page } from "../types";
import "./opportunities.css";

const buzz = [
  {
    id: "film-fund",
    type: "Grant",
    title: "Southern stories film fund",
    where: "Southern Africa",
    deadline: "Closes in 12 days",
    text: "Preview editorial listing for documentary and short-form storytellers.",
  },
  {
    id: "design-lab",
    type: "Workshop",
    title: "Identity systems lab",
    where: "Windhoek",
    deadline: "24 Oct",
    text: "A small-group working session for designers building flexible identity systems.",
  },
  {
    id: "photo-award",
    type: "Competition",
    title: "New African image award",
    where: "Online",
    deadline: "Closing soon",
    text: "Preview opportunity for emerging photographers exploring place and belonging.",
  },
];
const swaps = [
  {
    id: "edit-photo",
    offer: "Film editing",
    need: "Portrait photography",
    name: "Leo M.",
  },
  {
    id: "design-sound",
    offer: "Brand design",
    need: "Sound design",
    name: "Kai T.",
  },
];

export function CreativeBuzz({
  notify,
  navigate,
}: {
  notify: (message: string) => void;
  navigate: (page: Page) => void;
}) {
  const { state, toggleSaved } = useProductDomain();
  const [type, setType] = useState("All");
  const [place, setPlace] = useState("Windhoek");
  const list = useMemo(
    () => buzz.filter((item) => type === "All" || item.type === type),
    [type],
  );
  return (
    <main className="opp-page">
      <header className="opp-hero">
        <button
          className="icon-button"
          onClick={() => navigate("tools")}
          aria-label="Back to creative tools"
        >
          <ArrowLeft />
        </button>
        <div>
          <p className="eyebrow">CREATIVE BUZZ · PREVIEW EDITORIAL</p>
          <h1>
            What’s moving
            <br />
            around the circle.
          </h1>
          <p>
            Funding calls, workshops, competitions, and things worth knowing.
          </p>
        </div>
        <Newspaper />
      </header>
      <section className="opp-controls">
        <label>
          Opportunity
          <select
            value={type}
            onChange={(event) => setType(event.target.value)}
          >
            <option>All</option>
            <option>Grant</option>
            <option>Workshop</option>
            <option>Competition</option>
          </select>
        </label>
        <label>
          Manual location
          <select
            aria-label="Manual location"
            value={place}
            onChange={(event) => setPlace(event.target.value)}
          >
            <option>Windhoek</option>
            <option>Swakopmund</option>
            <option>Remote</option>
          </select>
        </label>
        <button
          className="button secondary"
          onClick={() =>
            notify(
              "Device location stays off. Use the manual city filter for this preview.",
            )
          }
        >
          <MapPin />
          Nearby: {place}
        </button>
      </section>
      <section className="opp-grid">
        {list.map((item) => {
          const saved = state.savedItems.some(
            (value) => value.kind === "opportunity" && value.id === item.id,
          );
          return (
            <article key={item.id}>
              <span>{item.type}</span>
              <h2>{item.title}</h2>
              <p>{item.text}</p>
              <div>
                <small>
                  <MapPin />
                  {item.where}
                </small>
                <strong>{item.deadline}</strong>
              </div>
              <div className="opp-actions">
                <button
                  className="button secondary"
                  onClick={() => {
                    toggleSaved({
                      id: item.id,
                      kind: "opportunity",
                      title: item.title,
                    });
                    notify("Saved opportunities updated locally.");
                  }}
                >
                  <Bookmark fill={saved ? "currentColor" : "none"} />
                  {saved ? "Saved" : "Save"}
                </button>
                <button
                  className="button primary"
                  onClick={() =>
                    notify("Reminder and linked task draft created locally.")
                  }
                >
                  <CalendarPlus />
                  Plan it
                </button>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}

export function SkillSwap({
  notify,
  navigate,
}: {
  notify: (message: string) => void;
  navigate: (page: Page) => void;
}) {
  const [proposed, setProposed] = useState<string[]>([]);
  return (
    <main className="opp-page">
      <header className="opp-hero swap-hero">
        <button
          className="icon-button"
          onClick={() => navigate("tools")}
          aria-label="Back to creative tools"
        >
          <ArrowLeft />
        </button>
        <div>
          <p className="eyebrow">TRADE TALENT, NOT VALUE</p>
          <h1>Skill swap</h1>
          <p>
            Clear exchanges between creatives, with scope and expectations up
            front.
          </p>
        </div>
        <Handshake />
      </header>
      <div className="swap-compose">
        <div>
          <p className="eyebrow">YOUR OFFER</p>
          <h2>I can offer photography</h2>
          <p>Available for one half-day collaboration this month.</p>
        </div>
        <button
          className="button secondary"
          onClick={() =>
            notify("Your skill-swap offer is editable in this local preview.")
          }
        >
          Edit offer
        </button>
      </div>
      <label className="swap-search">
        <Search />
        <input
          type="search"
          placeholder="Search skills you need"
          aria-label="Search skill swaps"
        />
      </label>
      <section className="swap-list">
        {swaps.map((item) => (
          <article key={item.id}>
            <div>
              <span>{item.name}</span>
              <h2>{item.offer}</h2>
              <p>
                Looking for <strong>{item.need}</strong>
              </p>
            </div>
            <button
              className={`button ${proposed.includes(item.id) ? "secondary" : "primary"}`}
              onClick={() => {
                setProposed((previous) => [...previous, item.id]);
                notify(`Swap proposal with ${item.name} saved locally.`);
              }}
            >
              {proposed.includes(item.id) ? (
                <>
                  <Check />
                  Proposed
                </>
              ) : (
                <>Propose swap</>
              )}
            </button>
            <button
              className="button secondary"
              onClick={() => navigate("inbox")}
            >
              Negotiate in Inbox
            </button>
          </article>
        ))}
      </section>
    </main>
  );
}
