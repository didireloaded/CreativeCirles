import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Check,
  FileText,
  FolderKanban,
  MessageCircle,
  Plus,
  Users,
} from "lucide-react";
import { creators } from "../data";
import { useProductDomain } from "../domain/useProductDomain";
import type { Page } from "../types";
import "./projects.css";
import { useLocalState } from "../storage";
import BottomSheet from "../components/BottomSheet";
import { createTask, readTasks, writeTasks } from "../tasks/model";
import type { ProductProject } from "../domain/types";
type Tab = "Overview" | "Phases" | "Team" | "Files" | "Budget" | "Activity";
const tabs: Tab[] = [
  "Overview",
  "Phases",
  "Team",
  "Files",
  "Budget",
  "Activity",
];
export default function Projects({
  notify,
  navigate,
}: {
  notify: (m: string) => void;
  navigate: (p: Page | string) => void;
}) {
  const { state, updateProject } = useProductDomain();
  const [selected, setSelected] = useState<string | null>(()=>new URLSearchParams(location.search).get("item"));
  const [tab, setTab] = useState<Tab>("Overview");
  const [approvals,setApprovals] = useLocalState<Record<string,boolean>>("project-approvals",{});
  const [budgets,setBudgets] = useLocalState<Record<string,{label:string;amount:number}[]>>("project-budgets",{});
  const [budgetEditor,setBudgetEditor] = useState(false);
  const [budgetLabel,setBudgetLabel] = useState("");
  const [budgetAmount,setBudgetAmount] = useState(0);
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newProjectBrief, setNewProjectBrief] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const item = params.get("item");
    if (item) setSelected(item);
    if (params.get("create") === "true") setNewProjectOpen(true);
  }, []);

  const project = state.projects.find((p) => p.id === selected);
  const phase = project?.phase || "Development";
  const approved = Boolean(project && approvals[project.id]);
  const lines = project ? budgets[project.id] || [] : [];
  const recorded = 23600 + lines.reduce((sum,line)=>sum+line.amount,0);
  if (project)
    return (
      <main className="projects-page">
        <button className="projects-back" onClick={() => setSelected(null)}>
          <ArrowLeft />
          All projects
        </button>
        <header className="project-title">
          <div>
            <p className="eyebrow">PROJECT WORKSPACE · LOCAL PREVIEW</p>
            <h1>{project.title}</h1>
            <p>
              {phase} · due {project.dueLabel}
            </p>
          </div>
          <div>
            <button
              className="button secondary"
              onClick={() => navigate("inbox?chat=leo")}
            >
              <MessageCircle />
              Conversation
            </button>
            <button
              className="button primary"
              aria-label="Open linked tasks"
              onClick={() => navigate("tasks")}
            >
              Open linked tasks
              <ArrowUpRight />
            </button>
          </div>
        </header>
        <nav className="project-tabs" role="tablist">
          {tabs.map((x) => (
            <button
              role="tab"
              aria-selected={tab === x}
              key={x}
              onClick={() => setTab(x)}
            >
              {x}
            </button>
          ))}
        </nav>
        <section className="project-panel">
          {tab === "Overview" && (
            <div className="project-overview">
              <article>
                <p className="eyebrow">THE BRIEF</p>
                <h2>A study of shape, light, and quiet.</h2>
                <p>
                  Create an editorial image story rooted in the Namib, built
                  with credited collaborators and a restrained visual language.
                </p>
                <div className="project-progress">
                  <span style={{ width: `${project.progress}%` }} />
                  <p>{project.progress}% complete</p>
                </div>
              </article>
              <aside>
                <h3>Next milestone</h3>
                <strong>Golden-hour production day</strong>
                <p>
                  <CalendarDays />
                  18 Oct · Sossusvlei
                </p>
                <button
                  className="button secondary"
                  onClick={() => { writeTasks([...readTasks(),createTask({source:"project",relatedId:project.id,title:`Prepare ${project.title} milestone`})]); notify("Milestone added to Tasks."); }}
                >
                  Set reminder
                </button>
              </aside>
            </div>
          )}
          {tab === "Phases" && (
            <div className="phase-list">
              {[
                "Development",
                "Pre-Production",
                "Production",
                "Post-Production",
                "Distribution",
              ].map((x, i) => (
                <button
                  key={x}
                  aria-pressed={phase === x}
                  onClick={() => {
                    updateProject({...project,phase:x as ProductProject['phase']});
                    notify(`Project moved to ${x} locally.`);
                  }}
                >
                  <span>{i + 1}</span>
                  <strong>{x}</strong>
                  {phase === x && <Check />}
                </button>
              ))}
            </div>
          )}
          {tab === "Team" && (
            <div className="project-team">
              {creators.slice(0, 4).map((p, i) => (
                <article key={p.id}>
                  <button
                    type="button"
                    onClick={() => navigate(`discover?creator=${p.id}`)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      background: "none",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      font: "inherit",
                      color: "inherit",
                      textAlign: "left",
                    }}
                    aria-label={`View ${p.name}'s profile`}
                  >
                    <img src={p.image} alt="" />
                    <div>
                      <strong>{p.name}</strong>
                      <span>
                        {i === 0
                          ? "Creative lead"
                          : i === 1
                            ? "Film lead"
                            : "Collaborator"}
                      </span>
                    </div>
                  </button>
                  <progress max="100" value={75 - i * 12} />
                </article>
              ))}
              <button
                className="button secondary"
                onClick={() => navigate("talent")}
              >
                <Plus />
                Invite talent
              </button>
            </div>
          )}
          {tab === "Files" && (
            <div className="project-files">
              <article>
                <FileText />
                <div>
                  <strong>Treatment_v3.pdf</strong>
                  <span>Version 3 · reviewed today</span>
                </div>
                <button
                  className="button secondary"
                  onClick={() => setApprovals(current=>({...current,[project.id]:!approved}))}
                >
                  {approved ? "Approved locally" : "Mark approved locally"}
                </button>
              </article>
              <article>
                <FileText />
                <div>
                  <strong>Location_references.zip</strong>
                  <span>Version 2 · local metadata</span>
                </div>
              </article>
              <p>
                Files are represented by local metadata until cloud storage is
                connected.
              </p>
            </div>
          )}
          {tab === "Budget" && (
            <div className="project-budget">
              <div>
                <span>Planned</span>
                <strong>N$ 42,000</strong>
              </div>
              <div>
                <span>Recorded</span>
                <strong>N$ {recorded.toLocaleString()}</strong>
              </div>
              <div className="budget-remaining">
                <span>Available</span>
                <strong>N$ {(42000-recorded).toLocaleString()} remaining</strong>
              </div>
              <button
                className="button secondary"
                onClick={() => setBudgetEditor(true)}
              >
                <Plus />
                Add budget line
              </button>
              {lines.map((line,index)=><p key={`${line.label}-${index}`}>{line.label} · N$ {line.amount.toLocaleString()}</p>)}
            </div>
          )}
          {tab === "Activity" && (
            <ol className="project-activity">
              <li>
                <strong>Phase changed</strong>
                <span>Moved into {phase} · Today</span>
              </li>
              <li>
                <strong>File reviewed</strong>
                <span>Treatment_v3.pdf · Yesterday</span>
              </li>
              <li>
                <strong>Leo joined the project</strong>
                <span>Film lead · 2 days ago</span>
              </li>
            </ol>
          )}
        </section>
        <BottomSheet open={budgetEditor} title="Add a budget line" onClose={()=>setBudgetEditor(false)}><form className="product-editor" onSubmit={e=>{e.preventDefault();setBudgets(current=>({...current,[project.id]:[...(current[project.id]||[]),{label:budgetLabel,amount:budgetAmount}]}));setBudgetEditor(false);setBudgetLabel("");setBudgetAmount(0);}}><label>Description<input required value={budgetLabel} onChange={e=>setBudgetLabel(e.target.value)}/></label><label>Amount (N$)<input type="number" required min="0.01" step="0.01" value={budgetAmount} onChange={e=>setBudgetAmount(Number(e.target.value))}/></label><button className="button primary">Add expense</button></form></BottomSheet>
      </main>
    );
  return (
    <main className="projects-page">
      <header className="projects-hero">
        <button
          className="icon-button"
          onClick={() => navigate("tools")}
          aria-label="Back to creative tools"
        >
          <ArrowLeft />
        </button>
        <div>
          <p className="eyebrow">THE WORK, IN MOTION</p>
          <h1>Projects</h1>
          <p>
            Shared bodies of work—from the first conversation to final delivery.
          </p>
        </div>
        <FolderKanban />
      </header>
      <div className="projects-summary">
        <span>
          <strong>{state.projects.length}</strong>active projects
        </span>
        <span>
          <strong>5</strong>collaborators
        </span>
        <span>
          <strong>2</strong>milestones this week
        </span>
        <button
          className="button primary"
          style={{ marginLeft: "auto", fontSize: 12, padding: "8px 14px", display: "flex", alignItems: "center", gap: 6 }}
          onClick={() => setNewProjectOpen(true)}
        >
          <Plus size={15} /> New project
        </button>
      </div>
      <section className="project-cards">
        {state.projects.map((p, i) => (
          <button
            key={p.id}
            aria-label={`Open ${p.title}`}
            onClick={() => setSelected(p.id)}
          >
            <span className={`project-card-art art-${i}`}>
              <FolderKanban />
            </span>
            <span className="project-card-copy">
              <small>{p.phase}</small>
              <strong>{p.title}</strong>
              <span>
                <Users /> {i + 2} collaborators
              </span>
              <span className="project-card-progress">
                <i style={{ width: `${p.progress}%` }} />
              </span>
              <em>
                {p.progress}% · due {p.dueLabel}
              </em>
            </span>
            <ArrowUpRight />
          </button>
        ))}
      </section>
      <BottomSheet open={newProjectOpen} title="Start a new project" onClose={() => setNewProjectOpen(false)}>
        <form
          className="product-editor"
          onSubmit={(e) => {
            e.preventDefault();
            const createdProject: ProductProject = {
              id: `project-${Date.now()}`,
              title: newProjectTitle.trim() || "Untitled Project",
              phase: "Development",
              progress: 10,
              dueLabel: "In 30 days",
            };
            updateProject(createdProject);
            setNewProjectOpen(false);
            setNewProjectTitle("");
            setNewProjectBrief("");
            setSelected(createdProject.id);
            notify(`Project "${createdProject.title}" initialized locally.`);
          }}
        >
          <label>
            Project title
            <input
              required
              value={newProjectTitle}
              onChange={(e) => setNewProjectTitle(e.target.value)}
              placeholder="e.g. Desert Echoes Editorial"
            />
          </label>
          <label>
            Brief / Description
            <textarea
              value={newProjectBrief}
              onChange={(e) => setNewProjectBrief(e.target.value)}
              placeholder="What is this project exploring?"
            />
          </label>
          <button className="button primary" type="submit">
            Create project
          </button>
        </form>
      </BottomSheet>
    </main>
  );
}
