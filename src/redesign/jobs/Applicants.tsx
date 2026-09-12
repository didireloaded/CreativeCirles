import { useLocalState } from "../storage";
import { ArrowUpRight } from "lucide-react";
const initial = [
  { id: "amara", name: "Amara K.", role: "Photographer", stage: "Shortlist" },
  { id: "leo", name: "Leo M.", role: "Filmmaker", stage: "Review" },
  { id: "nia", name: "Nia S.", role: "Designer", stage: "Interview" },
];
export default function Applicants({
  navigate,
}: {
  navigate: (page: string) => void;
}) {
  const [people, setPeople] = useLocalState("applicant-stages", initial);
  return (
    <section className="applicant-board">
      <div>
        <p className="eyebrow">YOUR POSTED ROLE · LOCAL PREVIEW</p>
        <h2>Applicants</h2>
      </div>
      {people.map((person) => (
        <article key={person.id}>
          <button
            type="button"
            onClick={() => navigate(`discover?creator=${person.id}`)}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              font: "inherit",
              color: "inherit",
              textAlign: "left",
              display: "flex",
              flexDirection: "column",
            }}
            aria-label={`View ${person.name}'s profile`}
          >
            <strong>{person.name}</strong>
            <span>{person.role}</span>
          </button>
          <label>
            Stage
            <select
              aria-label={`${person.name} application stage`}
              value={person.stage}
              onChange={(e) =>
                setPeople((old) =>
                  old.map((item) =>
                    item.id === person.id
                      ? { ...item, stage: e.target.value }
                      : item,
                  ),
                )
              }
            >
              <option>Review</option>
              <option>Shortlist</option>
              <option>Interview</option>
              <option>Offer</option>
            </select>
          </label>
          <button
            className="icon-button"
            aria-label={`Message ${person.name}`}
            onClick={() => navigate(`inbox?chat=${person.id}`)}
          >
            <ArrowUpRight />
          </button>
        </article>
      ))}
    </section>
  );
}
