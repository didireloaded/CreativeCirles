import { BellOff, Check, Flag, Pin, Send, Users } from "lucide-react";
import { useState } from "react";
import BottomSheet from "../components/BottomSheet";
import ImageWithFallback from "../components/ImageWithFallback";
import type { Community, Creator } from "../types";

function readJoined(): string[] {
  try {
    const value = JSON.parse(
      localStorage.getItem("circle:joined-communities") || "[]",
    );
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export default function CommunityDetail({
  open,
  community,
  onClose,
  notify,
  onSelectCreator,
}: {
  open: boolean;
  community: Community | null;
  onClose: () => void;
  notify: (message: string) => void;
  onSelectCreator?: (creator: Creator) => void;
}) {
  const [joined, setJoined] = useState<string[]>(readJoined);
  const [muted, setMuted] = useState(false);
  const [post, setPost] = useState("");
  if (!community) return null;
  const active = joined.includes(community.id);
  const toggle = () => {
    const next = active
      ? joined.filter((id) => id !== community.id)
      : [...joined, community.id];
    setJoined(next);
    try {
      localStorage.setItem("circle:joined-communities", JSON.stringify(next));
    } catch {
      /* Session state remains available. */
    }
    notify(
      active
        ? `Left ${community.name} in this preview.`
        : `Joined ${community.name} in this preview.`,
    );
  };
  return (
    <BottomSheet
      open={open}
      title={community.name}
      onClose={onClose}
      className="detail-sheet community-detail"
    >
      <ImageWithFallback
        src={community.image}
        alt={`${community.name} cover`}
        ratio="16 / 8"
      />
      <div className="community-heading">
        <div>
          <p className="eyebrow">{community.category}</p>
          <h3>{community.name}</h3>
          <span>
            <Users />
            {community.members + (active ? 1 : 0)} preview members
          </span>
        </div>
        <button
          className={`button ${active ? "secondary" : "primary"}`}
          aria-label={active ? "Leave community" : "Join community"}
          onClick={toggle}
        >
          {active ? (
            <>
              <Check />
              Joined
            </>
          ) : (
            "Join community"
          )}
        </button>
      </div>
    <p className="detail-caption">{community.description}</p>
    <blockquote>{community.purpose}</blockquote>
    <section className="community-rules">
      <p className="eyebrow">HOW THIS CIRCLE WORKS</p>
      <div className="detail-list"><div><span><Pin />Pinned welcome</span><b>Share the work, then name the feedback you need.</b></div><div><span>01</span><b>Be specific and constructive</b></div><div><span>02</span><b>Credit collaborators and references</b></div><div><span>03</span><b>No unsolicited promotion</b></div></div>
    </section>
    {active && <section><p className="eyebrow">START A CONVERSATION</p><form className="community-compose" onSubmit={event=>{event.preventDefault();if(!post.trim())return;notify(`Post added to ${community.name} on this device.`);setPost("")}}><textarea value={post} onChange={event=>setPost(event.target.value)} placeholder="Share work, ask a question, or request feedback…" maxLength={600}/><button className="button primary" disabled={!post.trim()}><Send />Post</button></form></section>}
      <section>
        <p className="eyebrow">DISCIPLINES</p>
        <div className="detail-chips">
          {community.disciplines.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </section>
      <section>
        <p className="eyebrow">PEOPLE IN THIS CIRCLE</p>
        <div className="community-members">
          {community.memberPreviews.map((member) => (
            <button
              type="button"
              className="community-member-btn"
              key={member.id}
              onClick={() => {
                if (onSelectCreator) {
                  onClose();
                  onSelectCreator(member);
                }
              }}
              aria-label={`View ${member.name} profile`}
            >
              <ImageWithFallback src={member.image} alt="" ratio="1" />
              <span>{member.name}</span>
            </button>
          ))}
        </div>
      </section>
    <section>
      <p className="eyebrow">RECENT WORK</p>
        <div className="community-work">
          {community.recentWork.map((image, index) => (
            <ImageWithFallback
              key={image}
              src={image}
              alt={`${community.name} recent work ${index + 1}`}
              ratio="4 / 3"
            />
          ))}
        </div>
    </section>
    <section className="community-controls"><button className="button secondary" onClick={()=>{setMuted(!muted);notify(muted?'Community notifications restored.':'Community notifications muted on this device.')}}><BellOff />{muted?'Unmute':'Mute'} community</button><button className="button secondary" onClick={()=>notify('Community report saved locally for moderation review.')}><Flag />Report</button></section>
    </BottomSheet>
  );
}
