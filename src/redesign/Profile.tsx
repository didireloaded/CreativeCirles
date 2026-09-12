import { useState } from "react";
import {
  ArrowUpRight,
  Camera,
  Check,
  Grid2X2,
  Link as LinkIcon,
  ListPlus,
  MapPin,
  Pencil,
  Settings,
  Palette,
} from "lucide-react";
import { photos } from "./data";
import type { ScreenProps } from "./types";
import Modal from "./Modal";
import { persistOnboarding } from "./onboarding/model";
import BottomSheet from "./components/BottomSheet";
import "./profile.css";

const profileImages = [
  photos.dunes,
  photos.camera,
  photos.fashion,
  photos.ocean,
  photos.art,
  photos.architecture,
];
export default function Profile({
  notify,
  navigate,
  openDrafts,
  profile,
  editPreferences,
  openTaskDraft,
  updateProfile,
}: ScreenProps) {
  const [tab, setTab] = useState<"Work" | "Projects" | "About">("Work");
  const [edit, setEdit] = useState(false);
  const [saved, setSaved] = useState(() => ({
      name: profile.displayName || "Jordan K.",
      bio:
        profile.bio ||
        "Visual storyteller. Finding quiet frames in loud places.",
      handle: profile.handle || "jordan.creates",
      location: profile.location || "",
      avatarDataUrl: profile.avatarDataUrl || "",
    }));
  const [form, setForm] = useState(saved);
  const [work, setWork] = useState<string | null>(null);
  const [error, setError] = useState("");
  const save = (e: React.FormEvent) => {
    e.preventDefault();
    const next = { ...profile, displayName: form.name.trim(), bio: form.bio.trim(), handle: form.handle, location: form.location, avatarDataUrl: form.avatarDataUrl };
    if (!(updateProfile ? updateProfile(next) : persistOnboarding(next))) {
      setError("Couldn’t save your profile. Try a smaller photo or free some browser storage.");
      return;
    }
    setSaved(form);
    setEdit(false);
    notify("Profile preview saved on this device.");
  };
  return (
    <div className="pf-page">
      <header className="pf-hero">
        <img src={photos.desert} alt="Golden desert landscape" />
        <div className="pf-shade" />
        <button
          className="icon-button pf-settings"
          onClick={editPreferences}
          aria-label="Edit creative preferences"
        >
          <Settings />
        </button>
        <div className="pf-identity">
          <img
            src={saved.avatarDataUrl || photos.portrait}
            alt="Your profile portrait"
          />
          <div>
            <span className="eyebrow">
              {profile.role || "MULTIDISCIPLINARY CREATIVE"}
            </span>
            <h1>
              {saved.name}
              <Check aria-label="Sample verified badge" />
            </h1>
            <p>@{saved.handle}</p>
          </div>
        </div>
      </header>
      <main className="pf-content">
        <div className="pf-actions">
          <button className="button primary" onClick={() => { setForm(saved); setError(""); setEdit(true); }}>
            <Pencil size={16} /> Edit profile
          </button>
          <button
            className="button secondary"
            onClick={() => navigate("workspace")}
          >
            My workspace <ArrowUpRight size={16} />
          </button>
          <button
            className="button secondary"
            onClick={() => navigate("tools")}
          >
            <Palette size={16} /> Creative tools
          </button>
        </div>
        <p className="pf-bio">{saved.bio}</p>
        <div className="pf-meta">
          <span>
            <MapPin /> {saved.location || "Add your location"}
          </span>
          <span>
            <LinkIcon /> Portfolio link · sample
          </span>
        </div>
        <div
          className="pf-stats sample-label"
          aria-label="Sample profile figures"
        >
          <span>
            <b>24</b> work
          </span>
          <span>
            <b>892</b> followers
          </span>
          <span>
            <b>145</b> following
          </span>
          <i>Sample figures</i>
        </div>
        <nav className="pf-tabs">
          {(["Work", "Projects", "About"] as const).map((x) => (
            <button key={x} onClick={() => setTab(x)} aria-pressed={tab === x}>
              {x}
            </button>
          ))}
        </nav>
        {tab === "Work" && (
          <section>
            <div className="section-heading">
              <h2>Recent work</h2>
              <Grid2X2 />
            </div>
            <div className="pf-grid">
              {profileImages.map((p, i) => (
                <button
                  key={p}
                  onClick={() => setWork(p)}
                  aria-label={`View creative work ${i + 1}`}
                >
                  <img src={p} alt={`Sample creative work ${i + 1}`} />
                </button>
              ))}
            </div>
          </section>
        )}
        {tab === "Projects" && (
          <section className="pf-project">
            <img src={photos.dunes} alt="Dunes at sunset" />
            <div>
              <p className="eyebrow">FEATURED PROJECT · SAMPLE</p>
              <h2>Between sand & sky</h2>
              <p>
                A shared portrait study of the Namib, built with credited
                collaborators and a little patience.
              </p>
              <button
                className="button primary"
                onClick={() =>
                  navigate("projects")
                }
              >
                View project <ArrowUpRight size={16} />
              </button>
              <button
                className="button secondary"
                onClick={() =>
                  openTaskDraft({
                    source: "project",
                    relatedId: "between-sand-sky",
                    title: "Plan the next Between sand & sky milestone",
                  })
                }
              >
                <ListPlus size={16} /> Add project task
              </button>
            </div>
          </section>
        )}
        {tab === "About" && (
          <section className="pf-about">
            <div>
              <p className="eyebrow">CREATIVE PRACTICE</p>
              <h2>Stories rooted in place.</h2>
            </div>
            <div>
              <p>{saved.bio}</p>
              <h3>Open to</h3>
              <p>
                {profile.interests.length
                  ? profile.interests.join(" · ")
                  : "Editorial photography · Short films · Creative direction · Passion projects"}
              </p>
              <h3>Saved ideas</h3>
              <button className="button secondary" onClick={openDrafts}>
                Open creative notebook
              </button>
              <button className="button secondary" onClick={editPreferences}>
                Edit creative preferences
              </button>
            </div>
          </section>
        )}
      </main>
      <BottomSheet open={Boolean(work)} title="Creative work" onClose={() => setWork(null)}>
        {work && <img src={work} alt="Selected portfolio work" style={{ width: "100%", borderRadius: 20 }} />}
      </BottomSheet>
      {edit && (
        <Modal title="Edit profile preview" onClose={() => setEdit(false)}>
          <form className="pf-form" onSubmit={save}>
            <label>Profile photo<input type="file" accept="image/*" onChange={event => {
              const file = event.target.files?.[0];
              if (!file) return;
              if (!file.type.startsWith("image/") || file.size > 2 * 1024 * 1024) { setError("Choose an image smaller than 2 MB."); return; }
              const reader = new FileReader();
              reader.onload = () => { if (typeof reader.result === "string") setForm(current => ({ ...current, avatarDataUrl: reader.result as string })); setError(""); };
              reader.onerror = () => setError("Couldn’t read that photo. Choose another image.");
              reader.readAsDataURL(file);
            }} /></label>
            <label>
              Display name
              <input
                value={form.name}
                maxLength={40}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </label>
            <label>Handle<input value={form.handle} pattern="[a-z0-9._]{3,30}" required onChange={e => setForm({ ...form, handle: e.target.value })} /></label>
            <label>Location<input value={form.location} maxLength={80} onChange={e => setForm({ ...form, location: e.target.value })} /></label>
            <label>
              Short bio
              <textarea
                value={form.bio}
                maxLength={160}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                required
              />
            </label>
            <p>Changes stay on this device until profile integration begins.</p>
            {error && <p role="alert">{error}</p>}
            <button className="button primary" type="submit">
              Save changes
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
