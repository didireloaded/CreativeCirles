import { Bell, CheckCheck, FolderKanban, MessageCircle, Users } from "lucide-react";
import { useState } from "react";
import BottomSheet from "../components/BottomSheet";
import { EmptyState } from "../components/AsyncState";

export type NotificationItem = {
  id: string;
  group: "Today" | "Earlier";
  title: string;
  detail: string;
  time: string;
  type?: "comment" | "collaboration" | "project";
};
function readIds() {
  try {
    const value = JSON.parse(
      localStorage.getItem("circle:read-notifications") || "[]",
    );
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export default function NotificationPanel({
  open,
  items,
  onClose,
}: {
  open: boolean;
  items: NotificationItem[];
  onClose: () => void;
}) {
  const [read, setRead] = useState<string[]>(readIds);
  const markAll = () => {
    const next = [...new Set([...read, ...items.map((item) => item.id)])];
    setRead(next);
    try {
      localStorage.setItem("circle:read-notifications", JSON.stringify(next));
    } catch {
      /* Session state remains visible. */
    }
  };
  const icon = (type?: NotificationItem["type"]) =>
    type === "comment" ? (
      <MessageCircle />
    ) : type === "collaboration" ? (
      <Users />
    ) : (
      <FolderKanban />
    );
  return (
    <BottomSheet
      open={open}
      title="Notifications"
      onClose={onClose}
      className="notification-sheet"
    >
      {items.length ? (
        <>
          <div className="notification-tools">
            <span>
              {items.filter((item) => !read.includes(item.id)).length} unread
            </span>
            <button onClick={markAll}>
              <CheckCheck />
              Mark all as read
            </button>
          </div>
          {(["Today", "Earlier"] as const).map((group) => {
            const grouped = items.filter((item) => item.group === group);
            return grouped.length ? (
              <section key={group}>
                <p className="eyebrow">{group}</p>
                <div className="notification-list">
                  {grouped.map((item) => (
                    <article
                      className={read.includes(item.id) ? "is-read" : ""}
                      key={item.id}
                    >
                      <span>{icon(item.type)}</span>
                      <div>
                        <strong>{item.title}</strong>
                        <p>{item.detail}</p>
                      </div>
                      <time>{item.time}</time>
                    </article>
                  ))}
                </div>
              </section>
            ) : null;
          })}
        </>
      ) : (
        <EmptyState
          icon={<Bell />}
          title="Nothing new right now"
          description="You’re all caught up. Collaboration, comment, and project updates will appear here."
        />
      )}
    </BottomSheet>
  );
}
