import { ArrowUpRight, BadgeCheck, Handshake, MapPin } from "lucide-react";
import BottomSheet from "../components/BottomSheet";
import ImageWithFallback from "../components/ImageWithFallback";
import type { Creator } from "../types";

export default function CreatorDetail({
  open,
  creator,
  onClose,
  onCollaborate,
}: {
  open: boolean;
  creator: Creator | null;
  onClose: () => void;
  onCollaborate: (creator: Creator) => void;
}) {
  if (!creator) return null;
  return (
    <BottomSheet
      open={open}
      title={`${creator.name} — creative profile`}
      onClose={onClose}
      className="detail-sheet creator-detail"
    >
      <div className="creator-hero">
        <ImageWithFallback
          src={creator.portfolio[0]}
          alt={`${creator.name} portfolio cover`}
          ratio="16 / 8"
        />
        <div className="creator-intro">
          <ImageWithFallback src={creator.image} alt={creator.name} ratio="1" />
          <div>
            <h3>
              {creator.name}
              <BadgeCheck />
            </h3>
            <p>
              @{creator.handle} · {creator.role}
            </p>
          </div>
        </div>
      </div>
      <p className="creator-bio">{creator.bio}</p>
      <div className="creator-availability">
        <span />
        <div>
          <strong>{creator.availability}</strong>
          <small>
            <MapPin />
            Illustrative profile details
          </small>
        </div>
      </div>
      <button
        className="button primary creator-collaborate"
        onClick={() => onCollaborate(creator)}
      >
        <Handshake />
        Send collaboration request
      </button>
      <section>
        <p className="eyebrow">SKILLS</p>
        <div className="detail-chips">
          {creator.skills.map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      </section>
      <section>
        <p className="eyebrow">SERVICES & RATES</p>
        <div className="detail-list">
          {creator.services.map((service) => (
            <div key={service.name}>
              <strong>{service.name}</strong>
              <span>{service.rate}</span>
            </div>
          ))}
        </div>
      </section>
      <section>
        <p className="eyebrow">EQUIPMENT</p>
        <div className="detail-chips muted">
          {creator.equipment.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </section>
      <section>
        <p className="eyebrow">SELECTED WORK</p>
        <div className="creator-portfolio">
          {creator.portfolio.map((image, index) => (
            <ImageWithFallback
              key={image}
              src={image}
              alt={`${creator.name} portfolio work ${index + 1}`}
              ratio="4 / 5"
            />
          ))}
        </div>
      </section>
      <nav className="creator-links" aria-label="Illustrative social links">
        {creator.socialLinks.map((link) => (
          <button key={link} onClick={() => undefined}>
            {link}
            <ArrowUpRight />
          </button>
        ))}
      </nav>
    </BottomSheet>
  );
}
