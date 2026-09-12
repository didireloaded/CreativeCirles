import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  ListPlus,
  MessageCircle,
  Mic,
  MoreHorizontal,
  Paperclip,
  Phone,
  Search,
  Send,
  Users,
  Video,
  X,
} from "lucide-react";
import { creators, photos } from "./data";
import CallPreview, { type CallMode } from "./calls/CallPreview";
import type { ScreenProps } from "./types";
import "./inbox.css";
import { useLocalState } from "./storage";

interface PreviewMessage {
  id: string;
  body: string;
  own: boolean;
  time: string;
}
interface Conversation {
  id: string;
  name: string;
  role: string;
  image: string;
  title: string;
  time: string;
  unread: number;
  messages: PreviewMessage[];
}
const conversationSeed: Conversation[] = [
  {
    id: "amara",
    name: "Amara K.",
    role: "Photographer",
    image: photos.portrait,
    title: "Desert light, a shared vision",
    time: "10:42",
    unread: 2,
    messages: [
      {
        id: "a1",
        body: "Hey Jordan! Your last series has such a beautiful sense of place.",
        own: false,
        time: "10:38",
      },
      {
        id: "a2",
        body: "Thank you, Amara. I’ve been trying to capture the quieter moments.",
        own: true,
        time: "10:40",
      },
      {
        id: "a3",
        body: "I’m putting together a small editorial in the dunes. Would love to hear your ideas ☀️",
        own: false,
        time: "10:42",
      },
    ],
  },
  {
    id: "leo",
    name: "Leo M.",
    role: "Filmmaker",
    image: photos.male,
    title: "A story worth telling",
    time: "09:15",
    unread: 1,
    messages: [
      {
        id: "l1",
        body: "The first cut is ready for a fresh pair of eyes. Coffee and a screening this week?",
        own: false,
        time: "09:15",
      },
    ],
  },
  {
    id: "nia",
    name: "Nia S.",
    role: "Fashion designer",
    image: photos.woman,
    title: "Studio conversations",
    time: "Yesterday",
    unread: 0,
    messages: [
      {
        id: "n1",
        body: "Those textures would look incredible in the next collection.",
        own: false,
        time: "Yesterday",
      },
      {
        id: "n2",
        body: "Let’s put a few references together!",
        own: true,
        time: "Yesterday",
      },
    ],
  },
  {
    id: "kai",
    name: "Kai T.",
    role: "Visual artist",
    image: photos.man,
    title: "Made of many perspectives",
    time: "Tue",
    unread: 0,
    messages: [
      {
        id: "k1",
        body: "I saved a few exhibition references for us. The warm tones feel right.",
        own: false,
        time: "Tue",
      },
    ],
  },
  {
    id: "mila",
    name: "Mila J.",
    role: "Motion designer",
    image: photos.woman2,
    title: "Ideas in motion",
    time: "Mon",
    unread: 0,
    messages: [
      {
        id: "m1",
        body: "Thanks for the inspiration. Excited to see where this takes us.",
        own: false,
        time: "Mon",
      },
    ],
  },
];
const requests = [
  {
    id: "desert",
    person: "amara",
    title: "Desert light editorial",
    category: "PHOTOGRAPHY · COLLABORATION",
    image: photos.dunes,
    body: "A portrait series about the connection between people and the landscapes we call home.",
    role: "Creative direction",
    location: "Swakopmund",
    timing: "Dates to be discussed",
  },
  {
    id: "exhibition",
    person: "kai",
    title: "Different eyes, one city",
    category: "VISUAL ARTS · COLLABORATION",
    image: photos.art,
    body: "An independent group exhibition bringing together different creative perspectives on Windhoek.",
    role: "Visual storytelling",
    location: "Windhoek",
    timing: "Planning stage",
  },
];
function readLocal<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

export default function Inbox({ notify, openTaskDraft, navigate }: ScreenProps) {
  const [tab, setTab] = useState<"messages" | "collaborations">("messages");
  const [conversations, setConversations] = useState<Conversation[]>(() =>
    readLocal("cc-preview-conversations", conversationSeed),
  );
  const [statuses, setStatuses] = useState<
    Record<string, "accepted" | "declined">
  >(() => readLocal("cc-preview-requests", {}));
  const [activeId, setActiveId] = useState("amara");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [messageError, setMessageError] = useState("");
  const [showCollabComposer, setShowCollabComposer] = useState(false);
  const [collabTitle, setCollabTitle] = useState("");
  const [callMode, setCallMode] = useState<CallMode | null>(null);
  const [conversationMenu, setConversationMenu] = useState(false);
  const [archived,setArchived] = useLocalState<string[]>("archived-conversations",[]);
  const [muted,setMuted] = useLocalState<string[]>("muted-conversations",[]);
  const [showArchived,setShowArchived] = useState(false);
  const [collabNeed,setCollabNeed] = useState("");
  const [collabPosts,setCollabPosts] = useLocalState<{id:string;title:string;need:string}[]>("collaboration-posts",[]);
  const attachmentInput = useRef<HTMLInputElement>(null);
  const messagesEnd = useRef<HTMLDivElement>(null);
  const active =
    conversations.find((conversation) => conversation.id === activeId) ||
    conversations[0];
  const filtered = conversations.filter((conversation) =>
    (showArchived ? archived.includes(conversation.id) : !archived.includes(conversation.id)) && `${conversation.name} ${conversation.role} ${conversation.title}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  const pending = requests.filter((request) => !statuses[request.id]).length;

  useEffect(() => {
    try {
      localStorage.setItem(
        "cc-preview-conversations",
        JSON.stringify(conversations),
      );
    } catch {
      setMessageError(
        "Device storage is full. New messages will last for this session only.",
      );
    }
  }, [conversations]);
  useEffect(() => {
    const panel = messagesEnd.current;
    if (panel) panel.scrollTop = panel.scrollHeight;
  }, [activeId, conversations]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const chatParam = params.get("chat") || params.get("user");
    const tabParam = params.get("tab");
    const createCollabParam = params.get("createCollab") || params.get("collab");

    if (tabParam === "collaborations") {
      setTab("collaborations");
    } else if (tabParam === "messages") {
      setTab("messages");
    }

    if (chatParam) {
      const existingConv = conversations.find(
        (c) => c.id === chatParam || c.name.toLowerCase().includes(chatParam.toLowerCase()),
      );
      if (existingConv) {
        openConversation(existingConv.id);
      } else {
        const creator = creators.find(
          (c) => c.id === chatParam || c.name.toLowerCase().includes(chatParam.toLowerCase()),
        );
        if (creator) {
          const newConv: Conversation = {
            id: creator.id,
            name: creator.name,
            role: creator.role,
            image: creator.image,
            title: `Chat with ${creator.name}`,
            time: "Just now",
            unread: 0,
            messages: [],
          };
          setConversations((prev) => [newConv, ...prev.filter((c) => c.id !== creator.id)]);
          openConversation(creator.id);
        }
      }
    }

    try {
      const pendingCollab = localStorage.getItem("cc-pending-collaboration");
      if (pendingCollab) {
        const parsed = JSON.parse(pendingCollab);
        if (parsed.title) setCollabTitle(parsed.title);
        setShowCollabComposer(true);
        setTab("collaborations");
        localStorage.removeItem("cc-pending-collaboration");
      }
    } catch {
      /* Preview storage fallback */
    }

    if (createCollabParam === "true") {
      setShowCollabComposer(true);
      setTab("collaborations");
    }
  }, []);

  function openConversation(id: string) {
    setDrafts((current) => ({ ...current, [activeId]: draft }));
    setDraft(drafts[id] || "");
    setActiveId(id);
    setMobileOpen(true);
    setTab("messages");
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === id ? { ...conversation, unread: 0 } : conversation,
      ),
    );
  }

  function sendMessage(event: React.FormEvent) {
    event.preventDefault();
    const body = draft.trim();
    if (!body) return;
    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === activeId
          ? {
              ...conversation,
              time,
              messages: [
                ...conversation.messages,
                { id: crypto.randomUUID(), body, own: true, time },
              ],
            }
          : conversation,
      ),
    );
    setDraft("");
    setDrafts((current) => ({ ...current, [activeId]: "" }));
  }

  function decide(id: string, status: "accepted" | "declined") {
    const next = { ...statuses, [id]: status };
    setStatuses(next);
    try {
      localStorage.setItem("cc-preview-requests", JSON.stringify(next));
    } catch {
      notify(
        "Request updated for this session. Device storage is unavailable.",
      );
    }
    if (status === "accepted") {
      const request = requests.find((item) => item.id === id);
      if (request) openConversation(request.person);
      notify(
        "Preview request accepted. Explore the conversation; nothing is sent to a creator.",
      );
    } else notify("Request declined in this preview.");
  }

  return (
    <section
      className={`in-page ${mobileOpen && tab === "messages" ? "in-conversation-open" : ""}`}
      aria-label="Inbox"
    >
      <div className="in-overview">
        <header className="in-title">
          <div>
            <p className="eyebrow">GOOD WORK STARTS WITH A CONVERSATION</p>
            <h1>Your circle, closer.</h1>
            <p className="muted">A place for the ideas you’ll make together.</p>
          </div>
          <span className="in-title-icon" aria-hidden="true">
            <MessageCircle size={26} strokeWidth={1.5} />
          </span>
        </header>
        <div className="in-tabs" aria-label="Inbox views">
          <button
            type="button"
            onClick={() => setTab("messages")}
            aria-pressed={tab === "messages"}
          >
            Messages <span>{conversations.length}</span>
          </button>
          <button
            type="button"
            onClick={() => setTab("collaborations")}
            aria-pressed={tab === "collaborations"}
          >
            Collaborations {pending > 0 && <span>{pending}</span>}
          </button>
        </div>
      </div>

      {tab === "messages" ? (
        <div className="in-layout">
          <aside className="in-list-panel" aria-label="Conversations">
            <label className="in-search">
              <Search size={18} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Find a conversation"
                aria-label="Find a conversation"
              />
              {search && (
                <button
                  className="in-clear"
                  aria-label="Clear search"
                  onClick={() => setSearch("")}
                >
                  <X size={16} />
                </button>
              )}
            </label>
            <div className="in-circle-heading">
              <span>Your circle</span>
              <small>Sample activity</small>
            </div>
            <div className="in-circle">
              {conversations.map((person, index) => (
                <button
                  key={person.id}
                  onClick={() => openConversation(person.id)}
                  aria-label={`Open conversation with ${person.name}`}
                >
                  <span className="in-person-image">
                    <img src={person.image} alt="" />
                    {index < 3 && <i aria-hidden="true" />}
                  </span>
                  <span>{person.name.split(" ")[0]}</span>
                </button>
              ))}
            </div>
            <div className="in-list-title">
              <h2>{showArchived ? "Archived messages" : "All messages"}</h2>
              <button className="button secondary" onClick={()=>setShowArchived(!showArchived)}>{showArchived ? "All messages" : "Archived"}</button>
              <span>{filtered.length}</span>
            </div>
            <div className="in-message-list">
              {filtered.map((conversation) => (
                <button
                  key={conversation.id}
                  className={`in-chat-row ${activeId === conversation.id ? "in-selected" : ""}`}
                  onClick={() => openConversation(conversation.id)}
                  aria-label={`${conversation.name}, ${conversation.unread ? `${conversation.unread} unread sample messages, ` : ""}${conversation.messages.at(-1)?.body}`}
                >
                  <img className="avatar" src={conversation.image} alt="" />
                  <span className="in-chat-summary">
                    <span className="in-chat-name">
                      {conversation.name}
                      <time>{conversation.time}</time>
                    </span>
                    <span className="in-chat-snippet">
                      {conversation.messages.at(-1)?.own && "You: "}
                      {conversation.messages.at(-1)?.body}
                    </span>
                    <span className="in-chat-role">{conversation.role}</span>
                  </span>
                  {conversation.unread > 0 && (
                    <span className="in-unread" aria-hidden="true">
                      {conversation.unread}
                    </span>
                  )}
                </button>
              ))}
              {!filtered.length && (
                <div className="in-empty">
                  <Search size={26} />
                  <h3>No conversations found</h3>
                  <p>Try a creator’s name or discipline.</p>
                  <button
                    className="button secondary"
                    onClick={() => setSearch("")}
                  >
                    Clear search
                  </button>
                </div>
              )}
            </div>
            <p className="in-list-note">
              A few familiar faces. Your next great idea.
            </p>
          </aside>

          <div
            className="in-detail"
            aria-label={`Conversation with ${active.name}`}
          >
            <header className="in-detail-head">
              <button
                className="icon-button in-back"
                onClick={() => setMobileOpen(false)}
                aria-label="Back to messages"
              >
                <ArrowLeft size={21} />
              </button>
              <button
                type="button"
                className="in-header-profile-btn"
                onClick={() => {
                  if (navigate) navigate(`discover?creator=${active.id}`);
                }}
                aria-label={`View ${active.name}'s profile`}
                style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", padding: 0, cursor: "pointer", font: "inherit", color: "inherit", textAlign: "left" }}
              >
                <img className="avatar" src={active.image} alt="" />
                <div>
                  <h2 style={{ margin: 0 }}>{active.name}</h2>
                  <p style={{ margin: 0 }}>{active.role}</p>
                </div>
              </button>
              <span className="in-call-actions">
                <button
                  className="icon-button"
                  aria-label={`Preview voice call with ${active.name}`}
                  onClick={() => setCallMode("voice")}
                >
                  <Phone size={18} />
                </button>
                <button
                  className="icon-button"
                  aria-label={`Preview video call with ${active.name}`}
                  onClick={() => setCallMode("video")}
                >
                  <Video size={18} />
                </button>
              </span>
              <button
                className="icon-button in-task-action"
                aria-label="Turn latest message into a task"
                onClick={() =>
                  openTaskDraft({
                    source: "message",
                    relatedId: active.id,
                    title: `Follow up: ${active.messages.at(-1)?.body || active.title}`,
                    assigneeIds: [active.id],
                  })
                }
              >
                <ListPlus size={19} />
              </button>
              <button className="icon-button" aria-label="Conversation options" aria-expanded={conversationMenu} onClick={() => setConversationMenu(!conversationMenu)}><MoreHorizontal /></button>
              {conversationMenu && <div className="in-conversation-menu"><button onClick={() => { setMuted(current=>current.includes(active.id)?current.filter(id=>id!==active.id):[...current,active.id]); setConversationMenu(false); }}>{muted.includes(active.id)?"Unmute notifications":"Mute notifications"}</button><button onClick={() => { setConversations(current => current.map(item => item.id === active.id ? { ...item, unread: 1 } : item)); setConversationMenu(false); }}>Mark unread</button><button onClick={() => { setArchived(current=>current.includes(active.id)?current.filter(id=>id!==active.id):[...current,active.id]); setMobileOpen(false); setConversationMenu(false); }}>{archived.includes(active.id)?"Restore conversation":"Archive conversation"}</button></div>}
            </header>
            <div className="in-message-thread" ref={messagesEnd}>
              <div className="in-conversation-intro">
                <span className="in-conversation-symbol">
                  <Users size={25} strokeWidth={1.4} />
                </span>
                <p className="eyebrow">BETTER TOGETHER</p>
                <h3>{active.title}</h3>
                <p>This is where an idea becomes a collaboration.</p>
              </div>
              <div className="in-date-divider">
                <span>Preview conversation</span>
              </div>
              <div
                className="in-bubbles"
                role="log"
                aria-label="Preview messages"
                aria-live="polite"
                aria-relevant="additions text"
              >
                {active.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`in-message ${message.own ? "in-own" : ""}`}
                  >
                    {!message.own && <img src={active.image} alt="" />}
                    <div>
                      <p>{message.body}</p>
                      <span>
                        {message.time}
                        {message.own && <span> · Saved locally</span>}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="in-compose-wrap">
              <p className="in-preview-note">
                Preview conversation · messages stay on this device
              </p>
              <form className="in-compose" onSubmit={sendMessage}>
                <input ref={attachmentInput} className="in-sr-only" type="file" accept="image/*,video/*,audio/*,.pdf,.doc,.docx" onChange={event => { const file = event.target.files?.[0]; if (file) { setDraft(current => `${current}${current ? " " : ""}📎 ${file.name}`); notify("Attachment added to this local message draft."); } event.target.value = ""; }} />
                <button type="button" aria-label="Add attachment" onClick={() => attachmentInput.current?.click()}><Paperclip size={18} /></button>
                <button type="button" aria-label="Add voice note" onClick={() => setDraft(current => `${current}${current ? " " : ""}🎙 Voice note preview`)}><Mic size={18} /></button>
                <label className="in-sr-only" htmlFor="preview-message">
                  Message {active.name}
                </label>
                <input
                  id="preview-message"
                  value={draft}
                  maxLength={2000}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Start with an idea…"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  disabled={!draft.trim()}
                  aria-label="Send preview message"
                >
                  <Send size={19} />
                </button>
              </form>
              {messageError && (
                <p role="status" className="in-storage-error">
                  {messageError}
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="in-collaborations">
          <div className="in-requests-heading">
            <div>
              <h2>Make something together.</h2>
              <p className="muted">
                Invitations to put your perspective to work.
              </p>
            </div>
            <button
              className="button primary"
              onClick={() => setShowCollabComposer(!showCollabComposer)}
            >
              {showCollabComposer ? "Close composer" : "Post a collaboration"}
            </button>
          </div>
          {collabPosts.map(post=><article className="in-request" key={post.id}><div className="in-request-content"><p className="eyebrow">YOUR LOCAL DRAFT</p><h3>{post.title}</h3><p>Looking for {post.need}</p><button className="button secondary" onClick={()=>{setCollabTitle(post.title);setCollabNeed(post.need);setShowCollabComposer(true);}}>Use as new draft</button></div></article>)}
          {showCollabComposer && (
            <form
              className="in-collab-composer"
              onSubmit={(event) => {
                event.preventDefault();
                if (!collabTitle.trim()) return;
                setCollabPosts(current=>[{id:crypto.randomUUID(),title:collabTitle,need:collabNeed},...current]);
                notify("Collaboration draft saved on this device.");
                setCollabTitle("");
                setShowCollabComposer(false);
              }}
            >
              <label>
                What are you making together?
                <input
                  value={collabTitle}
                  onChange={(event) => setCollabTitle(event.target.value)}
                  placeholder="e.g. Short film, open studio, photo walk"
                  required
                />
              </label>
              <label>
                What kind of collaborator do you need?
                <input placeholder="e.g. Sound designer or editor" required value={collabNeed} onChange={event=>setCollabNeed(event.target.value)} />
              </label>
              <button className="button primary" type="submit">
                Post collaboration
              </button>
            </form>
          )}
          <div className="in-request-grid">
            {requests.map((request) => {
              const person = conversations.find(
                (conversation) => conversation.id === request.person,
              )!;
              const status = statuses[request.id];
              return (
                <article className="in-request" key={request.id}>
                  <div className="in-request-cover">
                    <img src={request.image} alt={request.title} />
                    <span>{request.location}</span>
                  </div>
                  <div className="in-request-content">
                    <button
                      type="button"
                      className="in-request-author-btn"
                      onClick={() => {
                        if (navigate) navigate(`discover?creator=${person.id}`);
                      }}
                      style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", padding: 0, cursor: "pointer", font: "inherit", color: "inherit", textAlign: "left" }}
                      aria-label={`View ${person.name}'s profile`}
                    >
                      <img className="avatar" src={person.image} alt="" />
                      <div>
                        <strong>{person.name}</strong>
                        <span>Invited you to collaborate</span>
                      </div>
                    </button>
                    <p className="eyebrow">{request.category}</p>
                    <h3>{request.title}</h3>
                    <p className="in-request-description">{request.body}</p>
                    <dl>
                      <div>
                        <dt>Your contribution</dt>
                        <dd>{request.role}</dd>
                      </div>
                      <div>
                        <dt>Timeline</dt>
                        <dd>{request.timing}</dd>
                      </div>
                    </dl>
                    {status ? (
                      <div className="in-request-status">
                        <span>
                          {status === "accepted" ? (
                            <Check size={18} />
                          ) : (
                            <X size={18} />
                          )}
                          {status === "accepted"
                            ? "Accepted in preview"
                            : "Declined in preview"}
                        </span>
                        {status === "accepted" ? (
                          <button
                            className="button secondary"
                            onClick={() => openConversation(request.person)}
                          >
                            Open conversation <ArrowUpRight size={17} />
                          </button>
                        ) : (
                          <button
                            className="button secondary"
                            onClick={() => {
                              const next = { ...statuses };
                              delete next[request.id];
                              setStatuses(next);
                              try {
                                localStorage.setItem(
                                  "cc-preview-requests",
                                  JSON.stringify(next),
                                );
                              } catch {
                                notify("Request restored for this session.");
                              }
                            }}
                          >
                            Undo decline
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="in-request-actions">
                        <button
                          className="button primary"
                          onClick={() => decide(request.id, "accepted")}
                        >
                          Accept invitation <ArrowUpRight size={17} />
                        </button>
                        <button
                          className="button secondary"
                          onClick={() => decide(request.id, "declined")}
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
          <p className="in-collab-note">
            Decisions are saved on this device for the UI preview. No
            invitations or messages are sent.
          </p>
        </div>
      )}
      <CallPreview
        open={callMode !== null}
        mode={callMode || "voice"}
        creator={
          creators.find((creator) => creator.id === active.id) || creators[0]
        }
        onClose={() => setCallMode(null)}
      />
    </section>
  );
}
