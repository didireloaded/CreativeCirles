import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Bookmark,
  Check,
  Grid2X2,
  List,
  MapPin,
  Search,
  SlidersHorizontal,
  Star,
  UsersRound,
} from "lucide-react";
import { creators } from "../data";
import { useProductDomain } from "../domain/useProductDomain";
import type { Page } from "../types";
import TalentCompare from "./TalentCompare";
import "./talent.css";
import CreatorDetail from "../details/CreatorDetail";
import type { Creator } from "../types";
import { readLocal, writeLocal } from "../storage";
const ratings = [4.9, 4.8, 4.7, 4.9, 4.6];
const prices = ["N$650/hr", "N$800/hr", "N$550/hr", "N$720/hr", "N$600/hr"];
export default function TalentFinder({
  notify,
  navigate,
}: {
  notify: (message: string) => void;
  navigate: (page: Page | string) => void;
}) {
  const { state, toggleSaved } = useProductDomain();
  const [personDetail,setPersonDetail] = useState<Creator|null>(()=>creators.find(person=>person.id===new URLSearchParams(location.search).get("item"))||null);
  const [query, setQuery] = useState("");
  const [skill, setSkill] = useState("All");
  const [available, setAvailable] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState("Relevance");
  const [compare, setCompare] = useState<string[]>([]);
  const list = useMemo(
    () =>
      creators
        .map((person, index) => ({
          ...person,
          rating: ratings[index],
          price: prices[index],
        }))
        .filter(
          (person) =>
            (skill === "All" ||
              person.skills.some((item) =>
                item.toLowerCase().includes(skill.toLowerCase()),
              ) ||
              person.role.toLowerCase().includes(skill.toLowerCase())) &&
            (!available ||
              person.availability.toLowerCase().startsWith("available")) &&
            `${person.name} ${person.role} ${person.skills.join(" ")}`
              .toLowerCase()
              .includes(query.toLowerCase()),
        )
        .sort((a, b) =>
          sort === "Rating"
            ? b.rating - a.rating
            : sort === "Price"
              ? Number(a.price.match(/\d+/)?.[0]) -
                Number(b.price.match(/\d+/)?.[0])
              : 0,
        ),
    [skill, available, query, sort],
  );
  const selected = creators.filter((person) => compare.includes(person.id));
  return (
    <main className="talent-page">
      <header className="talent-hero">
        <button
          className="icon-button"
          onClick={() => navigate("tools")}
          aria-label="Back to creative tools"
        >
          <ArrowLeft />
        </button>
        <div>
          <p className="eyebrow">FIND YOUR PEOPLE</p>
          <h1>
            The right craft.
            <br />
            The right chemistry.
          </h1>
          <p>Search a thoughtful circle of working creatives.</p>
        </div>
        <UsersRound />
      </header>
      <section className="talent-controls">
        <label className="talent-search">
          <Search />
          <input
            type="search"
            aria-label="Search talent"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Name, craft, or skill"
          />
        </label>
        <label>
          Skill
          <select
            aria-label="Filter by skill"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
          >
            <option>All</option>
            <option>Photography</option>
            <option>Film</option>
            <option>Design</option>
            <option>Fashion</option>
          </select>
        </label>
        <label>
          Sort
          <select
            aria-label="Sort talent"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option>Relevance</option>
            <option>Rating</option>
            <option>Price</option>
          </select>
        </label>
        <button
          className={`button secondary ${available ? "is-active" : ""}`}
          aria-pressed={available}
          onClick={() => setAvailable(!available)}
        >
          <SlidersHorizontal />
          Available now
        </button>
        <div className="talent-view">
          <button
            aria-label="Grid view"
            aria-pressed={view === "grid"}
            onClick={() => setView("grid")}
          >
            <Grid2X2 />
          </button>
          <button
            aria-label="List view"
            aria-pressed={view === "list"}
            onClick={() => setView("list")}
          >
            <List />
          </button>
        </div>
      </section>
      {compare.length > 0 && (
        <div className="talent-compare-bar" role="status">
          Selection ready <span>Compare below</span>
        </div>
      )}
      <section
        className={`talent-results talent-${view}`}
        aria-label="Talent results"
      >
        {list.map((person) => {
          const saved = state.savedItems.some(
            (i) => i.kind === "creator" && i.id === person.id,
          );
          const compared = compare.includes(person.id);
          return (
            <article key={person.id}>
              <div className="talent-photo">
                <img
                  src={person.image}
                  alt={`${person.name}, ${person.role}`}
                />
                <span>{person.availability}</span>
              </div>
              <div className="talent-card-copy">
                <small>{person.role}</small>
                <h2><button className="talent-name" onClick={()=>setPersonDetail(person)}>{person.name}</button></h2>
                <p>
                  <MapPin />
                  Windhoek · <Star fill="currentColor" />
                  {person.rating}
                </p>
                <div>
                  {person.skills.slice(0, 3).map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <strong>{person.price}</strong>
                <div className="talent-actions">
                  <button
                    className="button primary"
                    onClick={() => {
                      const drafts = readLocal<{id:string;title:string;need:string}[]>("collaboration-posts",[]);
                      writeLocal("collaboration-posts",[{id:crypto.randomUUID(),title:`Collaboration with ${person.name}`,need:person.role},...drafts]);
                      writeLocal("cc-pending-collaboration", {
                        title: `Collaboration with ${person.name}`,
                        need: person.role,
                        collaboratorId: person.id,
                      });
                      notify("Collaboration draft added to Inbox → Collaborations.");
                      navigate("inbox");
                    }}
                    aria-label={`Collaborate with ${person.name}`}
                  >
                    Collaborate
                  </button>
                  <button
                    className="icon-button"
                    aria-label={`Save ${person.name}`}
                    aria-pressed={saved}
                    onClick={() =>
                      toggleSaved({
                        id: person.id,
                        kind: "creator",
                        title: person.name,
                      })
                    }
                  >
                    <Bookmark fill={saved ? "currentColor" : "none"} />
                  </button>
                  <button
                    className="icon-button"
                    aria-label={`Compare ${person.name}`}
                    aria-pressed={compared}
                    onClick={() =>
                      setCompare((old) =>
                        compared
                          ? old.filter((id) => id !== person.id)
                          : old.length < 3
                            ? [...old, person.id]
                            : old,
                      )
                    }
                  >
                    {compared ? <Check /> : <UsersRound />}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </section>
      {!list.length && <div className="saved-empty"><h2>No matching creatives</h2><p>Try another skill or clear your search.</p><button className="button secondary" onClick={()=>{setSkill("All");setQuery("");setAvailable(false);}}>Clear filters</button></div>}
      <CreatorDetail
        open={Boolean(personDetail)}
        creator={personDetail}
        onClose={() => setPersonDetail(null)}
        onCollaborate={(person) => {
          const drafts = readLocal<{id:string;title:string;need:string}[]>("collaboration-posts",[]);
          writeLocal("collaboration-posts",[{id:crypto.randomUUID(),title:`Collaboration with ${person.name}`,need:person.role},...drafts]);
          setPersonDetail(null);
          navigate(`inbox?chat=${person.id}&tab=collaborations&createCollab=true`);
          notify("Draft available in Collaborations.");
        }}
        onMessage={(person) => {
          setPersonDetail(null);
          navigate(`inbox?chat=${person.id}`);
        }}
      />
      {compare.length > 0 && (
        <TalentCompare people={selected} onClose={() => setCompare([])} />
      )}
    </main>
  );
}
