import {
  ArrowLeft,
  ArrowUpRight,
  NotebookPen,
  BriefcaseBusiness,
  Building2,
  Handshake,
  Search,
  Newspaper,
  Store,
  UsersRound,
} from "lucide-react";
import { useProductDomain } from "../domain/useProductDomain";
import type { Page } from "../types";
import "./tools.css";

const tools: {
  title: string;
  description: string;
  route: Page;
  icon: typeof BriefcaseBusiness;
  tone: string;
}[] = [
  {
    title: "Jobs board",
    description: "Find briefs, roles, and paid creative opportunities.",
    route: "jobs",
    icon: BriefcaseBusiness,
    tone: "amber",
  },
  {
    title: "Talent finder",
    description: "Search the circle by craft, place, and availability.",
    route: "talent",
    icon: UsersRound,
    tone: "blue",
  },
  {
    title: "Projects",
    description: "Move productions from first idea to final delivery.",
    route: "projects",
    icon: Building2,
    tone: "rose",
  },
  {
    title: "Creative Buzz",
    description: "Discover grants, workshops, news, and competitions.",
    route: "buzz",
    icon: Newspaper,
    tone: "gold",
  },
  {
    title: "Skill swap",
    description: "Trade time and talent with trusted collaborators.",
    route: "skill-swap",
    icon: Handshake,
    tone: "mint",
  },
  {
    title: "Drafting studio",
    description: "Shape shot lists, contracts, bios, pitches, and pricing.",
    route: "ai-studio",
    icon: NotebookPen,
    tone: "violet",
  },
  {
    title: "Creator business",
    description: "Manage services, inquiries, products, and insights.",
    route: "business",
    icon: Store,
    tone: "coral",
  },
  {
    title: "Saved",
    description: "Return to work, talent, jobs, and ideas you kept.",
    route: "saved",
    icon: Search,
    tone: "sand",
  },
];

export default function ToolsHub({
  navigate,
  goBack,
}: {
  navigate: (page: Page) => void;
  goBack: () => void;
}) {
  const { state } = useProductDomain();
  return (
    <main className="tools-page">
      <header className="tools-hero">
        <button
          className="icon-button tools-back"
          onClick={goBack}
          aria-label="Back to workspace"
        >
          <ArrowLeft />
        </button>
        <div>
          <p className="eyebrow">THE BUSINESS OF MAKING</p>
          <h1>
            Make more room
            <br />
            for the work.
          </h1>
          <p>
            Everything around your creative practice, gathered into one calm
            place.
          </p>
        </div>
        <div className="tools-orbit" aria-hidden="true">
          <i />
          <i />
          <i />
          <span>CC</span>
        </div>
      </header>
      <section className="tools-summary" aria-label="Local workspace summary">
        <div>
          <strong>{state.projects.length}</strong>
          <span>projects moving</span>
        </div>
        <div>
          <strong>{state.savedItems.length}</strong>
          <span>ideas saved</span>
        </div>
        <p>
          <b>Local preview data</b>
          <br />
          Your changes stay on this device until the full backend is connected.
        </p>
      </section>
      <section className="tools-grid" aria-label="Creative tools">
        {tools.map(({ title, description, route, icon: Icon, tone }, index) => (
          <button
            className={`tools-card tools-${tone}`}
            key={title}
            onClick={() => navigate(route)}
            aria-label={`Open ${title}`}
          >
            <span className="tools-number">0{index + 1}</span>
            <span className="tools-icon">
              <Icon />
            </span>
            <span className="tools-copy">
              <strong>{title}</strong>
              <small>{description}</small>
            </span>
            <ArrowUpRight className="tools-arrow" />
          </button>
        ))}
      </section>
    </main>
  );
}
