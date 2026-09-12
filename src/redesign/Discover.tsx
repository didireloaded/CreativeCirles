import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Bookmark,
  CalendarDays,
  Check,
  ListPlus,
  MapPin,
  Search,
  SlidersHorizontal,
  Palette,
  Users,
  X,
} from "lucide-react";
import { communities as circles, creators, photos } from "./data";
import type { Community, Creator, ScreenProps } from "./types";
import { EmptyState } from "./components/AsyncState";
import CreatorDetail from "./details/CreatorDetail";
import CommunityDetail from "./details/CommunityDetail";
import "./discover.css";

const categories = [
  "All",
  "Photography",
  "Film",
  "Fashion",
  "Design",
  "Music",
] as const;
type Category = (typeof categories)[number];
const views = ["For you", "Creatives", "Communities", "Events"] as const;
type View = (typeof views)[number];

const works = [
  {
    id: "dunes",
    title: "A quieter kind of wild.",
    subtitle: "A study in light and endless landscapes",
    category: "Photography",
    image: photos.dunes,
    creator: 0,
    shape: "hero",
    tags: "landscape travel nature desert light",
    description:
      "An illustrative photography series exploring texture, warm light, and the quiet rhythm of open landscapes.",
  },
  {
    id: "fashion",
    title: "Made to move.",
    subtitle: "Form, fabric & freedom",
    category: "Fashion",
    image: photos.fashion,
    creator: 2,
    shape: "tall",
    tags: "style clothes editorial portrait",
    description:
      "A sample fashion editorial about the relationship between movement, silhouette, and personal expression.",
  },
  {
    id: "music",
    title: "After the soundcheck",
    subtitle: "In between the songs",
    category: "Music",
    image: photos.music,
    creator: 1,
    shape: "square",
    tags: "live music sound performance stage",
    description:
      "A sample visual journal about the moments of anticipation that surround a live performance.",
  },
  {
    id: "architecture",
    title: "Different angles",
    subtitle: "Looking up, looking closer",
    category: "Design",
    image: photos.architecture,
    creator: 4,
    shape: "square",
    tags: "architecture space building geometric",
    description:
      "An illustrative design study following the lines and shapes we pass on an ordinary day.",
  },
  {
    id: "ocean",
    title: "Where the shore begins",
    subtitle: "A visual field note",
    category: "Photography",
    image: photos.ocean,
    creator: 0,
    shape: "wide",
    tags: "coast ocean blue water landscape nature",
    description:
      "A sample collection of visual field notes inspired by the movement, layers, and colors of the coastline.",
  },
  {
    id: "art",
    title: "Color outside the lines",
    subtitle: "Experiments from the studio",
    category: "Design",
    image: photos.art,
    creator: 3,
    shape: "tall",
    tags: "art colors painting abstract studio",
    description:
      "An illustrative collection of color and texture experiments, kept as a record of the creative process.",
  },
  {
    id: "camera",
    title: "One frame at a time",
    subtitle: "Behind the lens",
    category: "Film",
    image: photos.camera,
    creator: 1,
    shape: "square",
    tags: "camera filmmaking video film reel",
    description:
      "A sample film project exploring how a single frame can suggest a much bigger story.",
  },
  {
    id: "desert",
    title: "Take the long way",
    subtitle: "Stories from the open road",
    category: "Film",
    image: photos.desert,
    creator: 4,
    shape: "wide",
    tags: "road travel landscape desert film nature",
    description:
      "An illustrative short-film concept about slowing down and finding stories along the way.",
  },
];
type Work = (typeof works)[number];

const events = [
  {
    id: "photo-walk",
    name: "Golden hour photo walk",
    category: "Photography",
    image: photos.dunes,
    month: "OCT",
    day: "12",
    time: "Saturday · 16:30–18:00",
    place: "Sample meeting point",
    description:
      "Meet fellow image makers, explore the light, and share what catches your eye.",
  },
  {
    id: "open-studio",
    name: "Open studio, open minds",
    category: "Design",
    image: photos.art,
    month: "OCT",
    day: "18",
    time: "Friday · 17:00–19:00",
    place: "Sample creative studio",
    description:
      "Bring a work in progress for a relaxed evening of ideas and constructive feedback.",
  },
  {
    id: "film-night",
    name: "Short stories on screen",
    category: "Film",
    image: photos.camera,
    month: "OCT",
    day: "25",
    time: "Friday · 18:00–20:00",
    place: "Sample screening room",
    description:
      "A community screening and conversation about the stories behind the final frame.",
  },
];

function useSavedSet(key: string) {
  const [values, setValues] = useState<string[]>(() => {
    try {
      const stored: unknown = JSON.parse(localStorage.getItem(key) || "[]");
      return Array.isArray(stored)
        ? stored.filter((item): item is string => typeof item === "string")
        : [];
    } catch {
      return [];
    }
  });
  const toggle = (id: string) => {
    setValues((current) => {
      const next = current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id];
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {
        /* Keep the current preview usable without persistent storage. */
      }
      return next;
    });
  };
  return [values, toggle] as const;
}

export default function Discover({
  notify,
  profile,
  openTaskDraft,
  navigate,
}: ScreenProps) {
  const previewState = new URLSearchParams(window.location.search).get("state");
  const [view, setView] = useState<View>(() => {
    const param = new URLSearchParams(window.location.search).get("view");
    if (param && views.includes(param as View)) {
      return param as View;
    }
    return "For you";
  });
  const [category, setCategory] = useState<Category>(() => {
    try {
      const value = localStorage.getItem("cc-preferred-discipline");
      return categories.includes(value as Category)
        ? (value as Category)
        : "All";
    } catch {
      return "All";
    }
  });
  const [query, setQuery] = useState("");
  const [savedOnly, setSavedOnly] = useState(false);
  const [selected, setSelected] = useState<Work | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<
    (typeof events)[number] | null
  >(null);
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(
    null,
  );
  const [saved, toggleSaved] = useSavedSet("cc-discover-saves");
  const [following, toggleFollowing] = useSavedSet("cc-discover-following");
  const [joined, toggleJoined] = useSavedSet("cc-discover-joined");
  const [interested, toggleInterested] = useSavedSet("cc-discover-events");
  const dialog = useRef<HTMLDialogElement>(null);
  const search = query.trim().toLowerCase();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get("view");
    if (viewParam && views.includes(viewParam as View)) {
      setView(viewParam as View);
    }
    const creatorParam = params.get("creator");
    if (creatorParam) {
      const found = creators.find(
        (c) => c.id === creatorParam || c.name.toLowerCase() === creatorParam.toLowerCase(),
      );
      if (found) setSelectedCreator(found);
    }
    const workParam = params.get("work") || params.get("item");
    if (workParam) {
      const found = works.find((w) => w.id === workParam);
      if (found) setSelected(found);
    }
  }, []);
  const matchCategory = (value: string) =>
    category === "All" || category === value;

  const filteredWorks = useMemo(
    () =>
      works.filter(
        (work) =>
          (category === "All" || work.category === category) &&
          (!savedOnly || saved.includes(work.id)) &&
          `${work.title} ${work.subtitle} ${work.tags} ${work.category} ${creators[work.creator].name}`
            .toLowerCase()
            .includes(search),
      ),
    [category, savedOnly, saved, search],
  );
  const recommendedWorks = useMemo(
    () =>
      [...filteredWorks].sort(
        (a, b) =>
          Number(profile.interests.includes(b.category)) -
          Number(profile.interests.includes(a.category)),
      ),
    [filteredWorks, profile.interests],
  );

  const filteredCreators = creators.filter((creator) => {
    const creatorCategory =
      creator.role === "Photographer"
        ? "Photography"
        : creator.role === "Filmmaker"
          ? "Film"
          : creator.role === "Fashion designer"
            ? "Fashion"
            : "Design";
    return (
      matchCategory(creatorCategory) &&
      `${creator.name} ${creator.role} ${creator.handle}`
        .toLowerCase()
        .includes(search)
    );
  });
  const filteredCircles = circles.filter(
    (circle) =>
      matchCategory(circle.category) &&
      `${circle.name} ${circle.description} ${circle.category}`
        .toLowerCase()
        .includes(search),
  );
  const filteredEvents = events.filter(
    (event) =>
      matchCategory(event.category) &&
      `${event.name} ${event.description} ${event.category}`
        .toLowerCase()
        .includes(search),
  );
  const resultCount =
    previewState === "empty"
      ? 0
      : view === "For you"
        ? filteredWorks.length
        : view === "Creatives"
          ? filteredCreators.length
          : view === "Communities"
            ? filteredCircles.length
            : filteredEvents.length;

  useEffect(() => {
    if (selected && dialog.current && !dialog.current.open)
      dialog.current.showModal();
  }, [selected]);

  const closeDetail = () => {
    dialog.current?.close();
    setSelected(null);
  };
  const saveWork = (work: Work) => {
    toggleSaved(work.id);
    notify(
      saved.includes(work.id)
        ? "Removed from your saved inspiration."
        : "Saved to your inspiration on this device.",
    );
  };
  const reset = () => {
    setQuery("");
    setCategory("All");
    setSavedOnly(false);
  };
  const chooseCategory = (value: Category) => {
    setCategory(value);
    try {
      localStorage.setItem("cc-preferred-discipline", value);
    } catch {
      /* Keep filtering available for this session. */
    }
  };

  return (
    <div className="ds-page">
      <header className="ds-heading">
        <div>
          <p className="eyebrow">A little curiosity goes a long way</p>
          <h1>Discover</h1>
          <p className="ds-intro">Find your favourite content</p>
        </div>
        <button
          className="icon-button ds-heading-mark"
          onClick={() => navigate("tools")}
          aria-label="Open creative tools"
        >
          <Palette size={21} />
          <span className="ds-sr-only">Creative tools</span>
        </button>
      </header>

      <div className="ds-search-row">
        <label className="ds-search">
          <Search size={21} aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            type="search"
            placeholder="Find work, creatives, communities…"
            aria-label="Search discovery"
          />
        </label>
        {view === "For you" && (
          <button
            className={`ds-save-filter ${savedOnly ? "ds-selected" : ""}`}
            aria-pressed={savedOnly}
            onClick={() => setSavedOnly(!savedOnly)}
            aria-label={
              savedOnly ? "Show all inspiration" : "Show saved inspiration"
            }
          >
            <Bookmark size={19} fill={savedOnly ? "currentColor" : "none"} />
            <span>Saved</span>
          </button>
        )}
      </div>

      <nav className="ds-view-nav" aria-label="Discovery views">
        {views.map((item) => (
          <button
            key={item}
            className={view === item ? "ds-active" : ""}
            aria-pressed={view === item}
            onClick={() => setView(item)}
          >
            {item}
          </button>
        ))}
      </nav>

      <div className="ds-category-row">
        <div className="ds-categories" aria-label="Filter by discipline">
          {categories.map((item) => (
            <button
              key={item}
              aria-pressed={category === item}
              onClick={() => chooseCategory(item)}
              className={category === item ? "ds-selected" : ""}
            >
              {item}
            </button>
          ))}
        </div>
        <SlidersHorizontal
          className="ds-filter-decoration"
          size={18}
          aria-hidden="true"
        />
      </div>

      <div className="ds-results-heading">
        <h2>
          {view === "For you"
            ? savedOnly
              ? "Your saved inspiration"
              : "Recommended for you"
            : view === "Creatives"
              ? "Meet your kind of people"
              : view === "Communities"
                ? "Find a circle that feels like you"
                : "Make room for a new connection"}
        </h2>
        <span className="sample-label">
          Sample {view === "For you" ? "work" : view.toLowerCase()}
        </span>
      </div>
      <span className="ds-sr-only" role="status">
        {resultCount} {view.toLowerCase()} results{query ? ` for ${query}` : ""}
      </span>

      {resultCount === 0 && (
        <EmptyState
          icon={<Search size={32} strokeWidth={1.4} />}
          title={
            previewState === "empty"
              ? "Your next creative connection starts here."
              : savedOnly
                ? "Your inspiration starts here."
                : "Nothing here just yet."
          }
          description={
            previewState === "empty"
              ? "Explore work and people shaped around the interests you chose."
              : savedOnly
                ? "Save work that catches your eye, then find it here."
                : "Try another search or explore a different discipline."
          }
          action={{
            label: `Explore all ${view === "For you" ? "work" : view.toLowerCase()}`,
            onClick: reset,
          }}
        />
      )}

      {view === "For you" && resultCount > 0 && (
        <div
          className={`ds-gallery ${recommendedWorks.length < 4 ? "ds-gallery-filtered" : ""}`}
          aria-label="Illustrative creative work"
        >
          {recommendedWorks.map((work, index) => (
            <article className={`ds-work ds-work-${work.shape}`} key={work.id}>
              <button
                className="ds-work-open"
                onClick={() => setSelected(work)}
                aria-label={`Open ${work.title}, sample ${work.category.toLowerCase()} by ${creators[work.creator].name}`}
              >
                <img
                  src={work.image}
                  alt={work.subtitle}
                  loading={index < 3 ? "eager" : "lazy"}
                />
                <div className="ds-work-gradient" />
                <span className="ds-work-category">{work.category}</span>
                <div className="ds-work-copy">
                  <p>{work.subtitle}</p>
                  <h3>{work.title}</h3>
                  <div className="ds-work-author">
                    <img src={creators[work.creator].image} alt="" />
                    <span>{creators[work.creator].name}</span>
                    <ArrowUpRight size={19} />
                  </div>
                </div>
              </button>
              <button
                className={`ds-work-save ${saved.includes(work.id) ? "ds-is-saved" : ""}`}
                aria-label={`${saved.includes(work.id) ? "Unsave" : "Save"} ${work.title}`}
                aria-pressed={saved.includes(work.id)}
                onClick={() => saveWork(work)}
              >
                <Bookmark
                  size={19}
                  fill={saved.includes(work.id) ? "currentColor" : "none"}
                />
              </button>
            </article>
          ))}
        </div>
      )}

      {view === "Creatives" && resultCount > 0 && (
        <div className="ds-creators" aria-label="Sample creative profiles">
          {filteredCreators.map((creator) => {
            const index = creators.findIndex(
              (item) => item.handle === creator.handle,
            );
            const cover =
              works.find((work) => work.creator === index)?.image || photos.art;
            return (
              <article
                className="ds-creator"
                key={creator.handle}
                onClick={() => setSelectedCreator(creator)}
              >
                <div className="ds-creator-cover">
                  <img src={cover} alt={`${creator.role} sample work`} />
                </div>
                <div className="ds-creator-info">
                  <img
                    className="ds-creator-avatar"
                    src={creator.image}
                    alt=""
                  />
                  <h3>{creator.name}</h3>
                  <p>@{creator.handle}</p>
                  <span className="ds-creator-role">{creator.role}</span>
                  <button
                    className={`button ${following.includes(creator.handle) ? "secondary" : "primary"}`}
                    aria-pressed={following.includes(creator.handle)}
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleFollowing(creator.handle);
                      notify(
                        following.includes(creator.handle)
                          ? `Unfollowed ${creator.name} in this preview.`
                          : `Following ${creator.name} in this preview.`,
                      );
                    }}
                  >
                    {following.includes(creator.handle) ? (
                      <>
                        <Check size={16} />
                        Following
                      </>
                    ) : (
                      <>
                        Follow creative
                        <ArrowUpRight size={16} />
                      </>
                    )}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {view === "Communities" && resultCount > 0 && (
        <div className="ds-circles" aria-label="Sample communities">
          {filteredCircles.map((circle) => (
            <article
              key={circle.id}
              className="ds-circle"
              onClick={() => setSelectedCommunity(circle)}
            >
              <img
                className="ds-circle-image"
                src={circle.image}
                alt={`${circle.category} community illustration`}
              />
              <div className="ds-circle-content">
                <div className="ds-circle-meta">
                  <span className="eyebrow">{circle.category}</span>
                  <Users size={18} />
                </div>
                <h3>{circle.name}</h3>
                <p>{circle.description}</p>
                <div className="ds-circle-bottom">
                  <span>{circle.members} members</span>
                  <button
                    className={`button ${joined.includes(circle.id) ? "secondary" : "primary"}`}
                    aria-pressed={joined.includes(circle.id)}
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleJoined(circle.id);
                      notify(
                        joined.includes(circle.id)
                          ? `Left ${circle.name} in this preview.`
                          : `Joined ${circle.name} in this preview.`,
                      );
                    }}
                  >
                    {joined.includes(circle.id) ? (
                      <>
                        <Check size={16} />
                        Joined
                      </>
                    ) : (
                      <>
                        Join circle
                        <ArrowUpRight size={16} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {view === "Events" && resultCount > 0 && (
        <div
          className="ds-events"
          aria-label="Sample events, illustrative dates and venues"
        >
          {filteredEvents.map((event) => (
            <article
              key={event.id}
              className="ds-event"
              onClick={() => setSelectedEvent(event)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setSelectedEvent(event);
              }}
            >
              <div className="ds-event-image">
                <img
                  src={event.image}
                  alt={`${event.category} event illustration`}
                />
                <div className="ds-event-date">
                  <span>{event.month}</span>
                  <strong>{event.day}</strong>
                </div>
              </div>
              <div className="ds-event-info">
                <h3>{event.name}</h3>
                <p>{event.description}</p>
                <div className="ds-event-details">
                  <span>
                    <CalendarDays size={16} />
                    {event.time}
                  </span>
                  <span>
                    <MapPin size={16} />
                    {event.place}
                  </span>
                </div>
                <button
                  className={`button ${interested.includes(event.id) ? "primary" : "secondary"}`}
                  aria-pressed={interested.includes(event.id)}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleInterested(event.id);
                    notify(
                      interested.includes(event.id)
                        ? "Removed from your events."
                        : "Interest saved on this device.",
                    );
                  }}
                >
                  {interested.includes(event.id) ? (
                    <>
                      <Check size={17} />
                      Interested
                    </>
                  ) : (
                    <>
                      <Bookmark size={17} />
                      I’m interested
                    </>
                  )}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <footer className="ds-footer">
        <span className="ds-footer-dot" />
        {query || category !== "All"
          ? "A new perspective is only a search away."
          : "Good work connects us."}
        <span>Keep exploring.</span>
      </footer>

      <dialog
        className="ds-detail"
        ref={dialog}
        onCancel={() => setSelected(null)}
        onClose={() => setSelected(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeDetail();
        }}
        aria-labelledby="ds-detail-title"
      >
        {selected && (
          <div className="ds-detail-inner">
            <div className="ds-detail-image">
              <img src={selected.image} alt={selected.subtitle} />
            </div>
            <div className="ds-detail-body">
              <button
                className="icon-button ds-detail-close"
                onClick={closeDetail}
                aria-label="Close work detail"
                autoFocus
              >
                <X size={22} />
              </button>
              <p className="eyebrow">{selected.category}</p>
              <h2 id="ds-detail-title">{selected.title}</h2>
              <p className="ds-detail-description">{selected.description}</p>
              <button
                type="button"
                className="ds-detail-author ds-detail-author-btn"
                onClick={() => {
                  const author = creators[selected.creator];
                  closeDetail();
                  setSelectedCreator(author);
                }}
                aria-label={`View ${creators[selected.creator].name}'s profile`}
              >
                <img
                  className="avatar"
                  src={creators[selected.creator].image}
                  alt=""
                />
                <div>
                  <strong>{creators[selected.creator].name}</strong>
                  <span>{creators[selected.creator].role}</span>
                </div>
              </button>
              <button
                className={`button ${saved.includes(selected.id) ? "secondary" : "primary"} ds-detail-save`}
                aria-pressed={saved.includes(selected.id)}
                onClick={() => saveWork(selected)}
              >
                <Bookmark
                  size={18}
                  fill={saved.includes(selected.id) ? "currentColor" : "none"}
                />
                {saved.includes(selected.id)
                  ? "Saved to inspiration"
                  : "Save to inspiration"}
              </button>
              <button
                className="button secondary ds-detail-save"
                onClick={() =>
                  openTaskDraft({
                    source: "project",
                    relatedId: selected.id,
                    title: `Explore ${selected.title}`,
                    assigneeIds: [creators[selected.creator].id],
                  })
                }
              >
                <ListPlus size={18} /> Plan next step
              </button>
              <p className="ds-detail-note">Saved items stay on this device.</p>
            </div>
          </div>
        )}
      </dialog>
      <dialog
        className="ds-detail"
        open={Boolean(selectedEvent)}
        onCancel={() => setSelectedEvent(null)}
        aria-labelledby="event-detail-title"
      >
        {selectedEvent && (
          <div className="ds-detail-inner">
            <div className="ds-detail-image">
              <img src={selectedEvent.image} alt={selectedEvent.name} />
            </div>
            <div className="ds-detail-body">
              <button
                className="icon-button ds-detail-close"
                onClick={() => setSelectedEvent(null)}
                aria-label="Close event detail"
              >
                <X size={22} />
              </button>
              <p className="eyebrow">{selectedEvent.category}</p>
              <h2 id="event-detail-title">{selectedEvent.name}</h2>
              <p className="ds-detail-description">
                {selectedEvent.description}
              </p>
              <div className="ds-event-details">
                <span>
                  <CalendarDays size={16} />
                  {selectedEvent.time}
                </span>
                <span>
                  <MapPin size={16} />
                  {selectedEvent.place}
                </span>
              </div>
              <button
                className="button primary ds-detail-save"
                onClick={() => {
                  toggleInterested(selectedEvent.id);
                  notify("Event interest updated on this device.");
                }}
              >
                <Bookmark size={18} />{" "}
                {interested.includes(selectedEvent.id)
                  ? "Interested"
                  : "Save event"}
              </button>
              <button
                className="button secondary ds-detail-save"
                onClick={() =>
                  openTaskDraft({
                    source: "event",
                    relatedId: selectedEvent.id,
                    title: `Prepare for ${selectedEvent.name}`,
                  })
                }
              >
                <ListPlus size={18} /> Add event task
              </button>
            </div>
          </div>
        )}
      </dialog>
      <CreatorDetail
        open={Boolean(selectedCreator)}
        creator={selectedCreator}
        onClose={() => setSelectedCreator(null)}
        onCollaborate={(creator) => {
          setSelectedCreator(null);
          try {
            const draft = {
              title: `Collaboration with ${creator.name}`,
              recipient: creator.name,
              recipientId: creator.id,
              date: new Date().toISOString(),
            };
            localStorage.setItem("cc-pending-collaboration", JSON.stringify(draft));
          } catch {
            /* Preview storage fallback */
          }
          notify(`Drafting collaboration with ${creator.name}...`);
          navigate(`inbox?chat=${creator.id}&tab=collaborations&createCollab=true`);
        }}
        onMessage={(creator) => {
          setSelectedCreator(null);
          navigate(`inbox?chat=${creator.id}`);
        }}
      />
      <CommunityDetail
        open={Boolean(selectedCommunity)}
        community={selectedCommunity}
        onClose={() => setSelectedCommunity(null)}
        onSelectCreator={(creator) => {
          setSelectedCommunity(null);
          setSelectedCreator(creator);
        }}
        notify={notify}
      />
    </div>
  );
}
