import { useRef, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  FolderKanban,
  Image,
  Lightbulb,
  Plus,
  Send,
  Trash2,
  Folder,
  Music2,
  MoreHorizontal,
  BriefcaseBusiness,
  Handshake,
  Store,
  Users,
} from "lucide-react";
import Modal from "./Modal";
import { photos } from "./data";
import { readLocal, writeLocal } from "./storage";
import MediaPreview, { validateMediaFile } from "./components/MediaPreview";
import { createRemotePost } from "../lib/supabase/api";

type Draft = {
  id: string;
  title: string;
  body: string;
  kind: string;
  created: string;
};
export default function CreateFlow({
  onClose,
  notify,
  initialDrafts = false,
  navigate,
}: {
  onClose: () => void;
  notify: (m: string) => void;
  initialDrafts?: boolean;
  navigate?: (page: string) => void;
}) {
  const [screen, setScreen] = useState<"menu" | "more" | "compose" | "drafts">(
    initialDrafts ? "drafts" : "menu",
  );
  const [kind, setKind] = useState("Post");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [drafts, setDrafts] = useState<Draft[]>(() => readLocal("drafts", []));
  const [draftFilter, setDraftFilter] = useState("All");
  const [media, setMedia] = useState<File | null>(null);
  const [mediaError, setMediaError] = useState("");
  const mediaInput = useRef<HTMLInputElement>(null);
  const openCompose = (value: string) => {
    setKind(value);
    setTitle("");
    setBody("");
    setScreen("compose");
  };
  const resumeDraft = (d: Draft) => {
    setKind(d.kind || "Post");
    setTitle(d.title || "");
    setBody(d.body || "");
    setScreen("compose");
  };
  const handleMoreChoice = (itemTitle: string) => {
    if (!navigate) {
      openCompose(itemTitle);
      return;
    }
    onClose();
    switch (itemTitle) {
      case "Job":
        navigate("jobs?create=true");
        break;
      case "Collaboration":
        navigate("inbox?tab=collaborations&createCollab=true");
        break;
      case "Service":
        navigate("business?view=Services&create=true");
        break;
      case "Digital product":
        navigate("business?view=Products&create=true");
        break;
      case "Skill swap":
        navigate("skill-swap?create=true");
        break;
      case "Community":
        navigate("discover?view=Communities");
        break;
      default:
        openCompose(itemTitle);
        break;
    }
  };
  const save = () => {
    const d = {
      id: crypto.randomUUID(),
      title: title.trim() || "Untitled idea",
      body: body.trim(),
      kind,
      created: new Date().toLocaleDateString(),
    };
    const next = [d, ...drafts];
    setDrafts(next);
    writeLocal("drafts", next);
    notify("Draft saved on this device.");
    setScreen("drafts");
  };
  const remove = (id: string) => {
    const next = drafts.filter((d) => d.id !== id);
    setDrafts(next);
    writeLocal("drafts", next);
    notify("Draft removed.");
  };
  return (
    <Modal
      title={
        screen === "menu"
          ? "Start something"
          : screen === "compose"
            ? `Create ${kind.toLowerCase()}`
            : screen === "more"
              ? "More ways to create"
              : "Saved ideas"
      }
      onClose={onClose}
      wide={screen === "drafts" || screen === "more"}
      className={screen === "menu" ? "create-radial" : ""}
    >
      {screen === "menu" && (
        <div className="create-menu">
          <p>Create something</p>
          {[
            {
              n: "Post",
              d: "Share a quick thought or piece of work",
              i: <Image />,
              act: () => openCompose("Post"),
            },
            {
              n: "Project",
              d: "Tell the full story behind your work",
              i: <FolderKanban />,
              act: () => {
                if (navigate) {
                  onClose();
                  navigate("projects?create=true");
                } else {
                  openCompose("Project");
                }
              },
            },
            {
              n: "Story",
              d: "Share a moment for the next 24 hours",
              i: <Plus />,
              act: () => openCompose("Story"),
            },
            {
              n: "Event",
              d: "Bring your creative circle together",
              i: <CalendarDays />,
              act: () => {
                if (navigate) {
                  onClose();
                  navigate("discover?view=Events");
                } else {
                  openCompose("Event");
                }
              },
            },
          ].map((x) => (
            <button
              key={x.n}
              aria-label={`${x.n}. ${x.d}`}
              onClick={x.act}
            >
              <span>{x.i}</span>
              <b>{x.n}</b>
            </button>
          ))}
          <button
            className="draft-entry"
            aria-label="More creation options"
            onClick={() => setScreen("more")}
          >
            <span>
              <MoreHorizontal />
            </span>
            <b>More</b>
          </button>
        </div>
      )}
      {screen === "more" && (
        <section className="create-more">
          <button type="button" className="text-back" onClick={() => setScreen("menu")}><ArrowLeft /> Creation menu</button>
          <div><p className="eyebrow">BUILD YOUR PRACTICE</p><h3>What do you want to put into the circle?</h3></div>
          <div className="create-more-grid">
            {[
              { n: "Job", d: "Share a role or paid opportunity", i: <BriefcaseBusiness /> },
              { n: "Collaboration", d: "Invite people into an idea", i: <Handshake /> },
              { n: "Service", d: "List something people can hire you for", i: <Store /> },
              { n: "Digital product", d: "Prepare a resource or template listing", i: <FolderKanban /> },
              { n: "Skill swap", d: "Offer one skill in exchange for another", i: <Users /> },
              { n: "Community", d: "Start a focused creative circle", i: <Plus /> },
            ].map(item => <button key={item.n} onClick={() => handleMoreChoice(item.n)}><span>{item.i}</span><strong>{item.n}</strong><small>{item.d}</small></button>)}
          </div>
          <button className="button secondary create-ideas" onClick={() => setScreen("drafts")}><Lightbulb /> Open saved ideas</button>
        </section>
      )}
      {screen === "compose" && (
        <form
          className="compose"
          onSubmit={(e) => {
            e.preventDefault();
            if (kind === "Post") {
              try {
                const newPost = {
                  id: `post-${Date.now()}`,
                  author: "You",
                  authorRole: "Creator",
                  avatar: photos.portrait,
                  caption: title ? `${title} — ${body}` : body || "New post",
                  image: media ? URL.createObjectURL(media) : photos.art,
                  likes: 1,
                  comments: 0,
                  date: "Just now",
                  time: "Just now",
                  category: "Photography",
                };
                const existing = readLocal<Record<string, unknown>[]>(
                  "feed-local-posts",
                  [],
                );
                writeLocal("feed-local-posts", [newPost, ...existing]);
                createRemotePost({
                  title: title.trim() || "Creative update",
                  caption: body.trim() || "Shared to the community feed.",
                  category: "Photography",
                  imageUrl: photos.art,
                  authorName: "You",
                  authorHandle: "you.creates",
                }).catch(() => {});
              } catch {
                /* Preview storage fallback */
              }
            }
            notify(`${kind} preview created locally. No file was uploaded.`);
            onClose();
            if (navigate && kind === "Post") {
              navigate("home");
            }
          }}
        >
          <button
            type="button"
            className="text-back"
            onClick={() => setScreen("menu")}
          >
            <ArrowLeft /> Creation menu
          </button>
          {media ? (
            <MediaPreview
              file={media}
              onRemove={() => {
                setMedia(null);
                setMediaError("");
              }}
              onReplace={() => mediaInput.current?.click()}
            />
          ) : (
            <div className="compose-preview">
              <img
                src={
                  kind === "Project"
                    ? photos.dunes
                    : kind === "Event"
                      ? photos.art
                      : photos.camera
                }
                alt="Sample creation preview"
              />
              <span>{kind.toUpperCase()} PREVIEW</span>
            </div>
          )}
          <label className="media-picker">
            <span>Add image, video, or audio</span>
            <input
              ref={mediaInput}
              type="file"
              accept="image/*,video/*,audio/*"
              aria-describedby={mediaError ? "media-file-error" : undefined}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                const result = validateMediaFile(file);
                if (result.ok) {
                  setMedia(file);
                  setMediaError("");
                } else setMediaError(result.message);
                event.target.value = "";
              }}
            />
          </label>
          {mediaError && (
            <p className="media-error" id="media-file-error" role="alert">
              {mediaError}
            </p>
          )}
          <label>
            Title
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={80}
              required
              placeholder="Give this idea a name"
            />
          </label>
          <label>
            {kind === "Post" ? "Caption" : "Description"}
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              maxLength={1000}
              placeholder="Tell people what this is about"
            />
          </label>
          <div className="compose-actions">
            <button type="button" className="button secondary" onClick={save}>
              Save draft
            </button>
            <button className="button primary" type="submit">
              Publish preview <Send size={16} />
            </button>
          </div>
          <p className="form-note">
            Preview only. Publishing does not send data anywhere.
          </p>
        </form>
      )}
      {screen === "drafts" && (
        <div className="drafts">
          <button
            type="button"
            className="text-back"
            onClick={() => setScreen("menu")}
          >
            <ArrowLeft /> Creation menu
          </button>
          <div className="draft-stack-intro">
            <p className="eyebrow">YOUR CREATIVE NOTEBOOK</p>
            <h3>Your inspiration, collected.</h3>
            <div className="draft-filters">
              <button
                aria-pressed={draftFilter === "Audio"}
                onClick={() =>
                  setDraftFilter(draftFilter === "Audio" ? "All" : "Audio")
                }
              >
                <Music2 size={15} /> Audio content
              </button>
              <button
                aria-pressed={draftFilter === "All"}
                onClick={() => setDraftFilter("All")}
              >
                <Folder size={15} /> All categories
              </button>
            </div>
            <button
              className="button primary"
              onClick={() => openCompose("Post")}
            >
              <Plus size={16} /> Create new
            </button>
          </div>
          {draftFilter === "Audio" ? (
            <div className="draft-empty">
              <Music2 />
              <h3>No audio ideas yet.</h3>
              <p>Your saved audio ideas will appear here.</p>
            </div>
          ) : drafts.length ? (
            <div className="draft-stack">
              {drafts.map((d, i) => (
                <article key={d.id} style={{ "--i": i } as React.CSSProperties}>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => resumeDraft(d)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") resumeDraft(d);
                    }}
                    style={{ cursor: "pointer" }}
                    aria-label={`Resume editing ${d.title}`}
                  >
                    <span>{d.kind} · On this device</span>
                    <h4>{d.title}</h4>
                    <p>{d.body || "A thought waiting for its next line."}</p>
                    <small>{d.created}</small>
                    <div className="draft-media">
                      <img src={photos.ocean} alt="Sample ocean inspiration" />
                      <img src={photos.art} alt="Sample color inspiration" />
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(d.id);
                    }}
                    aria-label={`Delete ${d.title}`}
                  >
                    <Trash2 />
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <div className="draft-empty">
              <Lightbulb />
              <h3>Your notebook is open.</h3>
              <div className="draft-media">
                <img src={photos.ocean} alt="Sample ocean inspiration" />
                <img src={photos.art} alt="Sample color inspiration" />
              </div>
              <p>
                Save a post or project draft and it will wait here on this
                device.
              </p>
              <button
                className="button primary"
                onClick={() => openCompose("Post")}
              >
                Create your first draft
              </button>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
