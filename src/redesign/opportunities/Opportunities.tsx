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
import { useLocalState } from "../storage";
import BottomSheet from "../components/BottomSheet";
import type { TaskDraft } from "../tasks/model";

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
  openTaskDraft,
}: {
  notify: (message: string) => void;
  navigate: (page: Page) => void;
  openTaskDraft?: (draft:TaskDraft)=>void;
}) {
  const { state, toggleSaved } = useProductDomain();
  const [type, setType] = useState("All");
  const [place, setPlace] = useState("All locations");
  const list = useMemo(
    () => buzz.filter((item) => (type === "All" || item.type === type) && (place === "All locations" || item.where === place || (place === "Remote" && item.where === "Online"))),
    [type,place],
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
            <option>All locations</option>
            <option>Windhoek</option>
            <option>Southern Africa</option>
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
        {!list.length && <p>No opportunities match this location. Try All locations.</p>}
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
                  onClick={() => openTaskDraft ? openTaskDraft({source:"event",relatedId:item.id,title:`Prepare for ${item.title}`}) : navigate("tasks")}
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
  const [proposed, setProposed] = useLocalState<string[]>("swap-proposals",[]);
  const [offer,setOffer] = useLocalState("swap-offer",{skill:"photography",details:"Available for one half-day collaboration this month."});
  const [editing,setEditing] = useState(false);
  const [form,setForm] = useState(offer);
  const [query,setQuery] = useState("");
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
          <h2>I can offer {offer.skill}</h2>
          <p>{offer.details}</p>
        </div>
        <button
          className="button secondary"
          onClick={() => {setForm(offer);setEditing(true);}}
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
          value={query}
          onChange={e=>setQuery(e.target.value)}
        />
      </label>
      <section className="swap-list">
        {swaps.filter(item=>`${item.offer} ${item.need} ${item.name}`.toLowerCase().includes(query.toLowerCase())).map((item) => (
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
                setProposed((previous) => previous.includes(item.id) ? previous.filter(id=>id!==item.id) : [...previous, item.id]);
                notify("Swap proposal draft updated on this device.");
              }}
            >
              {proposed.includes(item.id) ? (
                <>
                  <Check />
                  Draft saved · undo
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
      <BottomSheet open={editing} title="Your skill-swap offer" onClose={()=>setEditing(false)}><form className="product-editor" onSubmit={e=>{e.preventDefault();setOffer(form);setEditing(false);}}><label>Skill you offer<input required value={form.skill} onChange={e=>setForm({...form,skill:e.target.value})}/></label><label>Scope and availability<textarea required value={form.details} onChange={e=>setForm({...form,details:e.target.value})}/></label><button className="button primary">Save offer</button></form></BottomSheet>
    </main>
  );
}
