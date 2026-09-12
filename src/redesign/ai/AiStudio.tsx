import { useState } from "react";
import {
  ArrowLeft,
  NotebookPen,
  Check,
  Copy,
  FileText,
  Save,
} from "lucide-react";
import { useProductDomain } from "../domain/useProductDomain";
import type { Page } from "../types";
import "../opportunities/opportunities.css";
import "./ai.css";
import { useLocalState } from "../storage";
import type { TaskDraft } from "../tasks/model";
const tools = [
  "Shot List",
  "Storyboard",
  "Bio Optimizer",
  "Pitch Builder",
  "Pricing Calculator",
  "Project Brief",
  "Caption Helper",
  "Contract",
];
function generate(tool: string, subject: string) {
  const name = subject.trim() || "your creative project";
  return tool === "Shot List"
    ? `PREVIEW DRAFT\n1. Establishing wide — ${name}\n2. Intentional detail — hands and texture\n3. Human medium — quiet action\n4. Closing frame — room to breathe`
    : tool === "Contract"
      ? `PREVIEW TEMPLATE\nParties: Creator and Client\nScope: ${name}\nDeliverables: To be agreed in writing\nUsage: Limited to the agreed campaign\nCancellation: Written notice required`
      : ({
        Storyboard: `STORYBOARD WORKSHEET — ${name}\n\n01 · Establish the setting\nFrame: wide\nAction: introduce place and time\nSound: ambient texture\n\n02 · Introduce the subject\nFrame: medium\nAction: reveal the main activity\nSound: natural dialogue\n\n03 · Show the detail\nFrame: close-up\nAction: isolate the meaningful gesture\nSound: focused detail\n\n04 · Resolve the sequence\nFrame: wide or reverse\nAction: show what changed\nSound: carry the final beat`,
        'Bio Optimizer': `BIO WORKSHEET\n\nYour current direction\n${name}\n\nShort bio\nI am a [discipline] based in [location], creating [type of work] for [audience]. My practice explores [specific theme].\n\nProfile headline\n[Discipline] · [specialty] · Available for [type of collaboration]\n\nBefore publishing\nReplace the bracketed details, add one concrete achievement, and keep the bio under 160 characters.`,
        'Pitch Builder': `PITCH OUTLINE — ${name}\n\n1. The idea — what are we making?\n2. The audience — who is it for?\n3. The creative approach — mood, format, and references\n4. The deliverables — scope and usage\n5. The team — roles and relevant work\n6. The schedule — milestones and review rounds\n7. The budget — production and contingency\n8. The ask — decision, deadline, and next step`,
        'Project Brief': `PROJECT BRIEF — ${name}\n\nObjective:\nAudience:\nKey message:\nDeliverables and formats:\nCreative references:\nTeam and responsibilities:\nMilestones:\nBudget:\nReview and approval process:\nSuccess measures:`,
        'Caption Helper': `CAPTION WORKSHEET — ${name}\n\nOpening: One specific detail that invites the viewer in.\nContext: Why you made the work and what you explored.\nProcess: Share one decision, material, or technique.\nCredit: Name your collaborators.\nInvitation: Ask a focused question about the work.`,
      }[tool] || name);
}
export default function AiStudio({
  notify,
  navigate,
  openTaskDraft,
}: {
  notify: (m: string) => void;
  navigate: (p: Page) => void;
  openTaskDraft?: (draft: TaskDraft) => void;
}) {
  const { toggleSaved } = useProductDomain();
  const [tool, setTool] = useState("Shot List");
  const [subject, setSubject] = useState("Desert editorial at first light");
  const [output, setOutput] = useState("");
  const [history, setHistory] = useLocalState<{id:string;tool:string;subject:string;output:string}[]>("drafting-history", []);
  const [hours, setHours] = useState(8);
  const [rate, setRate] = useState(650);
  const [expenses, setExpenses] = useState(0);
  const [contingency, setContingency] = useState(10);
  return (
    <main className="ai-page">
      <header className="ai-hero">
        <button
          className="icon-button"
          onClick={() => navigate("tools")}
          aria-label="Back to creative tools"
        >
          <ArrowLeft />
        </button>
        <div>
          <p className="eyebrow">CREATIVE DRAFTING WORKSPACE</p>
          <h1>Drafting Studio</h1>
          <p>Structured tools for the thinking around your work.</p>
        </div>
        <NotebookPen />
      </header>
      <div className="ai-layout">
        <aside>
          <h2>Tools</h2>
          {tools.map((x) => (
            <button
              key={x}
              aria-pressed={tool === x}
              onClick={() => {
                setTool(x);
                setOutput("");
              }}
            >
              {x === "Contract" ? <FileText /> : <NotebookPen />}
              {x}
            </button>
          ))}
          <p>Your drafts stay local until you choose to save or copy them.</p>
        </aside>
        <section className="ai-work">
          <p className="eyebrow">{tool.toUpperCase()}</p>
          <h2>Shape a useful first draft.</h2>
          <label>
            What are you working on?
            <textarea
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              minLength={4}
            />
          </label>
          {tool === "Pricing Calculator" && <div className="pricing-inputs">{[{label:'Estimated hours',value:hours,set:setHours},{label:'Hourly rate (N$)',value:rate,set:setRate},{label:'Expenses (N$)',value:expenses,set:setExpenses},{label:'Contingency (%)',value:contingency,set:setContingency}].map(field => <label key={field.label}>{field.label}<input type="number" min="0" max={field.label.includes('%') ? 100 : 1000000} value={field.value} onChange={event => field.set(Math.max(0,Number(event.target.value)))}/></label>)}</div>}
          <button
            className="button primary"
            disabled={!subject.trim()}
            onClick={() => {
              const base = hours * rate + expenses;
              const value = tool === "Pricing Calculator" ? `ESTIMATE — ${subject}\n\nLabour: ${hours} hours × N$${rate.toFixed(2)} = N$${(hours*rate).toFixed(2)}\nExpenses: N$${expenses.toFixed(2)}\nContingency (${contingency}%): N$${(base*contingency/100).toFixed(2)}\n\nTotal estimate: N$${(base*(1+contingency/100)).toFixed(2)}\n\nExcludes taxes. Confirm scope, licensing, and revision rounds before quoting.` : generate(tool, subject);
              setOutput(value);
              setHistory((old) => [{id:crypto.randomUUID(),tool,subject,output:value}, ...old].slice(0, 20));
            }}
          >
            <NotebookPen />
            Generate preview draft
          </button>
          {output && (
            <article className="ai-output">
              <span>Preview draft</span>
              <pre>{output}</pre>
              {tool === "Contract" && (
                <p className="ai-legal">
                  Template only—not legal advice. Ask an appropriately qualified
                  professional to review it.
                </p>
              )}
              <div>
                <button
                  className="button secondary"
                  onClick={async () => {
                    try { if (!navigator.clipboard) throw new Error('unavailable'); await navigator.clipboard.writeText(output); notify("Draft copied."); } catch { notify("Couldn’t copy. Select the draft text to copy it manually."); }
                  }}
                >
                  <Copy />
                  Copy
                </button>
                <button
                  className="button secondary"
                  onClick={() => {
                    toggleSaved({
                      id: `${tool}-${subject}`,
                      kind: "template",
                      title: `${tool}: ${subject}`,
                      content: output,
                    });
                    notify("Draft saved to your local collection.");
                  }}
                >
                  <Save />
                  Save
                </button>
                <button
                  className="button secondary"
                  onClick={() => openTaskDraft ? openTaskDraft({source:"manual",title:`Develop ${tool.toLowerCase()}: ${subject}`}) : navigate("tasks")}
                >
                  <Check />
                  Create task
                </button>
              </div>
            </article>
          )}
        </section>
        <aside className="ai-history">
          <h2>Recent</h2>
          {history.length ? (
            history.map((x) => (
              <button
                key={x.id}
                onClick={() => { setTool(x.tool); setSubject(x.subject); setOutput(x.output); }}
              >
                {x.tool}: {x.subject}
              </button>
            ))
          ) : (
            <p>Your local draft history will appear here.</p>
          )}
        </aside>
      </div>
    </main>
  );
}
