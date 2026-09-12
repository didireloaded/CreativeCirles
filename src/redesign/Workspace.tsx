import { useEffect, useRef, useState } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Film,
  Image,
  MapPin,
  Plus,
  SlidersHorizontal,
  Palette,
  X,
} from "lucide-react";
import { creators, photos } from "./data";
import type { ScreenProps } from "./types";
import MeetingsView from "./dashboard/MeetingsView";
import "./workspace.css";

type WorkspaceView = "Overview" | "Meetings" | "Calendar" | "Insights";
const workspaceViews: WorkspaceView[] = [
  "Overview",
  "Meetings",
  "Calendar",
  "Insights",
];
type Reminder = {
  id: string;
  title: string;
  date: string;
  time: string;
  done: boolean;
  sample?: boolean;
};
const reminderKey = "creative-circle-workspace-reminders-v1";
const dateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const shiftDate = (date: Date, amount: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
};
const monthTitle = (date: Date) =>
  date.toLocaleDateString("en-GB", { month: "long", year: "numeric" });

function readReminders(): Reminder[] {
  try {
    const stored: unknown = JSON.parse(
      localStorage.getItem(reminderKey) || "null",
    );
    if (Array.isArray(stored))
      return stored.filter(
        (item): item is Reminder =>
          item &&
          typeof item.id === "string" &&
          typeof item.title === "string" &&
          typeof item.date === "string" &&
          typeof item.time === "string" &&
          typeof item.done === "boolean",
      );
  } catch {
    /* The preview still works when local storage is unavailable. */
  }
  return [
    {
      id: "sample-review",
      title: "Review Nia’s campaign selects",
      date: dateKey(new Date()),
      time: "15:00",
      done: false,
      sample: true,
    },
    {
      id: "sample-moodboard",
      title: "Share the desert shoot moodboard",
      date: dateKey(new Date()),
      time: "17:30",
      done: false,
      sample: true,
    },
    {
      id: "sample-checkin",
      title: "Creative check-in with Leo",
      date: dateKey(shiftDate(new Date(), 1)),
      time: "10:00",
      done: false,
      sample: true,
    },
  ];
}

function formatReminderDate(value: string, time: string) {
  const today = dateKey(new Date());
  const tomorrow = dateKey(shiftDate(new Date(), 1));
  const date =
    value === today
      ? "Today"
      : value === tomorrow
        ? "Tomorrow"
        : new Date(`${value}T12:00:00`).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
          });
  return `${date} · ${time}`;
}

export default function Workspace({
  notify,
  navigate,
  openCreate,
  openDrafts,
  profile,
}: ScreenProps) {
  const [view, setView] = useState<WorkspaceView>("Overview");
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [calendarMode, setCalendarMode] = useState<"Weekly" | "Monthly">(
    "Weekly",
  );
  const [reminders, setReminders] = useState<Reminder[]>(readReminders);
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [reminderTitle, setReminderTitle] = useState("");
  const [reminderDate, setReminderDate] = useState(() => dateKey(new Date()));
  const [reminderTime, setReminderTime] = useState("09:00");
  const [selectedCreator, setSelectedCreator] = useState<number | null>(null);
  const [projectExpanded, setProjectExpanded] = useState(false);
  const [insightPeriod, setInsightPeriod] = useState<"7 days" | "30 days">(
    "7 days",
  );
  const reminderInput = useRef<HTMLInputElement>(null);
  const storageAvailable = useRef(true);

  useEffect(() => {
    try {
      localStorage.setItem(reminderKey, JSON.stringify(reminders));
    } catch {
      storageAvailable.current = false;
    }
  }, [reminders]);
  useEffect(() => {
    if (showReminderForm) reminderInput.current?.focus();
  }, [showReminderForm]);

  const today = new Date();
  const dayOfWeek = (selectedDate.getDay() + 6) % 7;
  const weekStart = shiftDate(selectedDate, -dayOfWeek);
  const weekDates = Array.from({ length: 7 }, (_, index) =>
    shiftDate(weekStart, index),
  );
  const firstOfMonth = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    1,
  );
  const monthStart = shiftDate(
    firstOfMonth,
    -((firstOfMonth.getDay() + 6) % 7),
  );
  const monthDates = Array.from({ length: 42 }, (_, index) =>
    shiftDate(monthStart, index),
  );
  const calendarReminders = reminders.filter(
    (reminder) => reminder.date === dateKey(selectedDate),
  );
  const todayReminders = reminders.filter(
    (reminder) => reminder.date === dateKey(today),
  );
  const currentCreator =
    selectedCreator === null ? null : creators[selectedCreator];

  function addReminder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = reminderTitle.trim();
    if (!title) return;
    setReminders((previous) => [
      ...previous,
      {
        id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        title,
        date: reminderDate,
        time: reminderTime,
        done: false,
      },
    ]);
    setSelectedDate(new Date(`${reminderDate}T12:00:00`));
    setReminderTitle("");
    setShowReminderForm(false);
    notify(
      storageAvailable.current
        ? "Reminder saved on this device. Notifications will be connected later."
        : "Reminder added for this visit. Browser storage is unavailable.",
    );
  }

  function openReminderForm() {
    setReminderDate(dateKey(view === "Calendar" ? selectedDate : today));
    setShowReminderForm(true);
  }

  function reminderList(items: Reminder[]) {
    return (
      <div className="ws-reminders">
        {items.length === 0 ? (
          <div className="ws-empty-day">
            <CalendarDays size={26} />
            <h3>A little room to create.</h3>
            <p>No reminders for this day. Add one when you need it.</p>
          </div>
        ) : (
          items.map((reminder, index) => (
            <div
              className={`ws-reminder ${reminder.done ? "ws-reminder-done" : ""}`}
              key={reminder.id}
            >
              <span
                className={`ws-reminder-symbol ${index % 2 ? "ws-symbol-amber" : ""}`}
              >
                {index % 2 ? <Image size={19} /> : <Film size={19} />}
              </span>
              <div className="ws-reminder-copy">
                <strong>{reminder.title}</strong>
                <span>
                  {formatReminderDate(reminder.date, reminder.time)}
                  {reminder.sample ? " · Sample" : " · On this device"}
                </span>
              </div>
              <label className="ws-complete">
                <input
                  type="checkbox"
                  checked={reminder.done}
                  onChange={() =>
                    setReminders((previous) =>
                      previous.map((item) =>
                        item.id === reminder.id
                          ? { ...item, done: !item.done }
                          : item,
                      ),
                    )
                  }
                  aria-label={`Mark ${reminder.title} ${reminder.done ? "incomplete" : "complete"}`}
                />
                <span aria-hidden="true">
                  {reminder.done && <Check size={13} />}
                </span>
              </label>
            </div>
          ))
        )}
      </div>
    );
  }

  function calendar(compact = false) {
    const dates =
      !compact && calendarMode === "Monthly" ? monthDates : weekDates;
    return (
      <div className={`ws-calendar ${compact ? "ws-calendar-compact" : ""}`}>
        <div className="ws-calendar-header">
          <h3>{monthTitle(selectedDate)}</h3>
          <div className="ws-calendar-controls">
            <button
              className="icon-button"
              aria-label="Previous period"
              onClick={() =>
                setSelectedDate(
                  calendarMode === "Monthly" && !compact
                    ? new Date(
                        selectedDate.getFullYear(),
                        selectedDate.getMonth() - 1,
                        1,
                      )
                    : shiftDate(selectedDate, -7),
                )
              }
            >
              <ChevronLeft size={16} />
            </button>
            <button
              className="icon-button"
              aria-label="Next period"
              onClick={() =>
                setSelectedDate(
                  calendarMode === "Monthly" && !compact
                    ? new Date(
                        selectedDate.getFullYear(),
                        selectedDate.getMonth() + 1,
                        1,
                      )
                    : shiftDate(selectedDate, 7),
                )
              }
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        {!compact && (
          <div className="ws-calendar-options">
            <div className="ws-segmented">
              {(["Weekly", "Monthly"] as const).map((mode) => (
                <button
                  key={mode}
                  className={calendarMode === mode ? "is-active" : ""}
                  aria-pressed={calendarMode === mode}
                  onClick={() => setCalendarMode(mode)}
                >
                  {mode}
                </button>
              ))}
            </div>
            <button
              className="ws-text-button"
              onClick={() => setSelectedDate(new Date())}
            >
              Today
            </button>
          </div>
        )}
        <div className="ws-weekdays" aria-hidden="true">
          {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
            <span key={index}>{day}</span>
          ))}
        </div>
        <div
          className={`ws-calendar-grid ${dates.length > 7 ? "ws-month-grid" : ""}`}
        >
          {dates.map((date) => {
            const key = dateKey(date);
            const hasReminder = reminders.some(
              (reminder) => reminder.date === key && !reminder.done,
            );
            return (
              <button
                key={key}
                aria-label={date.toLocaleDateString("en-GB", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
                aria-pressed={key === dateKey(selectedDate)}
                className={`${key === dateKey(selectedDate) ? "is-selected" : ""} ${date.getMonth() !== selectedDate.getMonth() ? "is-other-month" : ""} ${key === dateKey(today) ? "is-today" : ""}`}
                onClick={() => {
                  setSelectedDate(date);
                  if (compact) setView("Calendar");
                }}
              >
                <span>{date.getDate()}</span>
                <i className={hasReminder ? "has-reminder" : ""} />
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="ws-page">
      <header className="ws-page-header">
        <div>
          <p className="eyebrow">YOUR CREATIVE DAY, IN FOCUS</p>
          <h1>
            {view === "Overview"
              ? `Good morning, ${profile.displayName || "Jordan"}!`
              : view}
          </h1>
        </div>
        <div className="ws-header-actions">
          <button
            className="button secondary"
            onClick={() => navigate("tools")}
            aria-label="Open creative tools"
          >
            <Palette size={17} />
            <span>Creative tools</span>
          </button>
          <button
            className="button secondary ws-new-reminder"
            onClick={openReminderForm}
          >
            <Plus size={17} />
            <span>New reminder</span>
          </button>
        </div>
      </header>
      <div className="ws-view-tabs" role="tablist" aria-label="Workspace views">
        {workspaceViews.map((tab) => (
          <button
            id={`ws-tab-${tab}`}
            aria-controls={`ws-panel-${tab}`}
            key={tab}
            role="tab"
            aria-selected={view === tab}
            tabIndex={view === tab ? 0 : -1}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
                event.preventDefault();
                const direction =
                  event.key === "ArrowRight" ? 1 : workspaceViews.length - 1;
                const next =
                  workspaceViews[
                    (workspaceViews.indexOf(tab) + direction) %
                      workspaceViews.length
                  ];
                setView(next);
                requestAnimationFrame(() =>
                  document.getElementById(`ws-tab-${next}`)?.focus(),
                );
              }
            }}
            onClick={() => setView(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {showReminderForm && (
        <form className="ws-reminder-form" onSubmit={addReminder}>
          <div className="ws-form-heading">
            <div>
              <h2>A little nudge for later</h2>
              <p>Saved on this device. Push notifications are coming later.</p>
            </div>
            <button
              type="button"
              className="icon-button"
              aria-label="Close reminder form"
              onClick={() => setShowReminderForm(false)}
            >
              <X size={19} />
            </button>
          </div>
          <label className="ws-reminder-title">
            What would you like to remember?
            <input
              ref={reminderInput}
              value={reminderTitle}
              onChange={(event) => setReminderTitle(event.target.value)}
              maxLength={120}
              required
              placeholder="e.g. Send the first edit to Nia"
            />
          </label>
          <div className="ws-form-bottom">
            <label>
              Date
              <input
                type="date"
                required
                value={reminderDate}
                onChange={(event) => setReminderDate(event.target.value)}
              />
            </label>
            <label>
              Time
              <input
                type="time"
                required
                value={reminderTime}
                onChange={(event) => setReminderTime(event.target.value)}
              />
            </label>
            <button className="button primary" type="submit">
              Save reminder <ArrowRight size={16} />
            </button>
          </div>
        </form>
      )}

      <div
        id={`ws-panel-${view}`}
        role="tabpanel"
        aria-labelledby={`ws-tab-${view}`}
      >
        {view === "Overview" && (
          <>
            <div className="ws-greeting">
              <div>
                <h2>Your creative workspace</h2>
                <p>
                  {today.toLocaleDateString("en-GB", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}{" "}
                  <span>—</span> Good to see you,{" "}
                  {profile.displayName || "Jordan"}.
                </p>
              </div>
              <span className="sample-label">Sample workspace</span>
            </div>
            <div className="ws-stats" aria-label="Sample workspace activity">
              <div>
                <strong>03</strong>
                <span>Active projects</span>
                <i className="ws-stat-dot" />
              </div>
              <div>
                <strong>
                  {String(
                    todayReminders.filter((item) => !item.done).length,
                  ).padStart(2, "0")}
                </strong>
                <span>Reminders today</span>
                <i className="ws-stat-dot ws-dot-orange" />
              </div>
              <div>
                <strong>05</strong>
                <span>Creative collaborators</span>
                <i className="ws-stat-dot ws-dot-lilac" />
              </div>
            </div>
            <div className="ws-layout">
              <div className="ws-main-column">
                <section className="ws-collaborators">
                  <div className="section-heading">
                    <h2>Collaborators</h2>
                    <button
                      className="ws-text-button"
                      onClick={() => navigate("discover")}
                    >
                      Find creators <ArrowUpRight size={15} />
                    </button>
                  </div>
                  <div className="ws-creator-row">
                    {creators.slice(1).map((creator, index) => (
                      <button
                        key={creator.handle}
                        className={`ws-creator ${selectedCreator === index + 1 ? "is-active" : ""}`}
                        onClick={() =>
                          setSelectedCreator(
                            selectedCreator === index + 1 ? null : index + 1,
                          )
                        }
                        aria-expanded={selectedCreator === index + 1}
                      >
                        <div className="ws-creator-image">
                          <img src={creator.image} alt="" />
                          <span>{creator.name}</span>
                        </div>
                        <span>{creator.role}</span>
                      </button>
                    ))}
                  </div>
                  <button
                    className="ws-add-idea"
                    onClick={() => navigate("discover")}
                  >
                    <Plus size={15} /> Add collaborator
                  </button>
                  {currentCreator && (
                    <div className="ws-creator-detail">
                      <div>
                        <strong>{currentCreator.name}</strong>
                        <p>
                          {currentCreator.role} · @{currentCreator.handle}
                        </p>
                      </div>
                      <button
                        className="ws-text-button"
                        onClick={() => navigate("discover")}
                      >
                        Explore the circle <ArrowRight size={16} />
                      </button>
                    </div>
                  )}
                </section>
                <section className="ws-reminder-section">
                  <div className="section-heading">
                    <h2>Reminders</h2>
                    <button
                      className="ws-text-button"
                      onClick={() => {
                        setSelectedDate(today);
                        setView("Calendar");
                      }}
                    >
                      View calendar <ArrowUpRight size={15} />
                    </button>
                  </div>
                  {reminderList(todayReminders)}
                </section>
                <section className="ws-upcoming">
                  <div className="section-heading">
                    <h2>Upcoming</h2>
                    <span className="muted">Sample project</span>
                  </div>
                  <article className="ws-project-card">
                    <img
                      className="ws-project-photo"
                      src={photos.dunes}
                      alt="Sculpted golden dunes in warm evening light"
                    />
                    <div className="ws-project-overlay" />
                    <div className="ws-project-top">
                      <span>PHOTOGRAPHY</span>
                      <span>
                        <CalendarDays size={14} />
                        {shiftDate(today, 3).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>
                    <div className="ws-project-bottom">
                      <span className="ws-project-location">
                        <MapPin size={13} /> Sossusvlei, Namibia
                      </span>
                      <h3>
                        Desert, in a<br />
                        different light.
                      </h3>
                      <div className="ws-project-footer">
                        <div className="ws-project-people">
                          <img src={creators[0].image} alt="Amara" />
                          <img src={creators[1].image} alt="Leo" />
                          <span>You + Leo</span>
                        </div>
                        <button
                          className="ws-project-open"
                          aria-label={
                            projectExpanded
                              ? "Close project details"
                              : "View desert photography project"
                          }
                          aria-expanded={projectExpanded}
                          onClick={() => setProjectExpanded(!projectExpanded)}
                        >
                          {projectExpanded ? (
                            <X size={20} />
                          ) : (
                            <ArrowUpRight size={22} />
                          )}
                        </button>
                      </div>
                    </div>
                  </article>
                  {projectExpanded && (
                    <div className="ws-project-details">
                      <p className="eyebrow">THE PROJECT BRIEF · SAMPLE</p>
                      <h3>A study of shape, light, and quiet.</h3>
                      <p>
                        An editorial photo story exploring the changing textures
                        of the Namib. Meet before sunrise, capture the first
                        light, and bring the story together as a shared
                        portfolio project.
                      </p>
                      <div>
                        <span>
                          <Clock3 size={16} /> 06:00 · Golden hour shoot
                        </span>
                        <button
                          className="ws-text-button"
                          onClick={() => navigate("inbox")}
                        >
                          Open preview inbox <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </section>
              </div>
              <aside className="ws-side-column">
                <section className="ws-side-calendar">
                  <div className="section-heading">
                    <h2>Ahead this week</h2>
                    <CalendarDays size={19} className="muted" />
                  </div>
                  {calendar(true)}
                  <div className="ws-week-note">
                    <span className="ws-week-note-dot" />
                    <p>
                      A little planning.
                      <br />
                      <strong>A lot of possibility.</strong>
                    </p>
                    <button
                      className="icon-button"
                      aria-label="Open full calendar"
                      onClick={() => setView("Calendar")}
                    >
                      <ArrowUpRight size={19} />
                    </button>
                  </div>
                </section>
                <section className="ws-drafts">
                  <div className="section-heading">
                    <h2>Room for an idea</h2>
                    <span className="ws-draft-mark">✳</span>
                  </div>
                  <p>
                    The next great thing starts
                    <br />
                    with a little something.
                  </p>
                  <button className="ws-draft-card" onClick={openDrafts}>
                    <span className="ws-draft-label">
                      <span className="ws-draft-status" /> YOUR CREATIVE
                      NOTEBOOK
                    </span>
                    <h3>
                      Keep a thought.
                      <br />
                      Make it happen.
                    </h3>
                    <div className="ws-draft-images">
                      <img
                        src={photos.ocean}
                        alt="Ocean waves for visual inspiration"
                      />
                      <img
                        src={photos.art}
                        alt="Colorful abstract art for visual inspiration"
                      />
                    </div>
                    <span className="ws-draft-link">
                      Open saved ideas <ArrowUpRight size={18} />
                    </span>
                  </button>
                  <button className="ws-add-idea" onClick={openCreate}>
                    <Plus size={16} /> Start something new
                  </button>
                </section>
              </aside>
            </div>
          </>
        )}

        {view === "Meetings" && (
          <MeetingsView notify={notify} profile={profile} />
        )}

        {view === "Calendar" && (
          <div className="ws-calendar-layout">
            <section className="ws-calendar-full">
              <div className="ws-view-intro">
                <p className="eyebrow">A LITTLE SPACE TO PLAN</p>
                <h2>Your rhythm, your calendar.</h2>
                <p>Keep the important things in sight.</p>
              </div>
              {calendar()}
              <div className="ws-calendar-legend">
                <span />
                <p>Upcoming reminder</p>
                <span className="ws-legend-today" />
                <p>Today</p>
              </div>
            </section>
            <section className="ws-schedule">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">ON THE AGENDA</p>
                  <h2>
                    {selectedDate.toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                    })}
                  </h2>
                </div>
                <button
                  className="icon-button"
                  aria-label="Add reminder for selected date"
                  onClick={openReminderForm}
                >
                  <Plus size={19} />
                </button>
              </div>
              {reminderList(calendarReminders)}
              <button className="ws-add-idea" onClick={openReminderForm}>
                <Plus size={16} /> Add a reminder
              </button>
              <p className="ws-storage-note">
                Your own reminders stay on this device. Sample reminders are
                marked in the list.
              </p>
            </section>
          </div>
        )}

        {view === "Insights" && (
          <div className="ws-insights">
            <div className="ws-insight-heading">
              <div className="ws-view-intro">
                <p className="eyebrow">A WIDER PICTURE</p>
                <h2>See your creativity travel.</h2>
                <p>A look at how your work connects with the circle.</p>
              </div>
              <label className="ws-period">
                <SlidersHorizontal size={15} />
                <select
                  value={insightPeriod}
                  onChange={(event) =>
                    setInsightPeriod(event.target.value as "7 days" | "30 days")
                  }
                  aria-label="Insights period"
                >
                  <option>7 days</option>
                  <option>30 days</option>
                </select>
              </label>
            </div>
            <div className="ws-sample-banner">
              <span className="sample-label">Sample insights</span>
              <p>
                Illustrative figures for this UI preview. Live analytics will be
                connected later.
              </p>
            </div>
            <div className="ws-insight-metrics">
              {[
                {
                  name: "Profile views",
                  value: insightPeriod === "7 days" ? "1,248" : "4,820",
                  change: "+12.8%",
                  caption: "vs. previous period",
                },
                {
                  name: "New followers",
                  value: insightPeriod === "7 days" ? "86" : "312",
                  change: "+8.4%",
                  caption: "vs. previous period",
                },
                {
                  name: "Work impressions",
                  value: insightPeriod === "7 days" ? "8,620" : "34,800",
                  change: "+16.2%",
                  caption: "vs. previous period",
                },
                {
                  name: "Engagement rate",
                  value: insightPeriod === "7 days" ? "6.4%" : "5.9%",
                  change: insightPeriod === "7 days" ? "+0.8 pts" : "−0.3 pts",
                  caption: "vs. previous period",
                },
              ].map((metric, index) => (
                <article key={metric.name}>
                  <span>{metric.name}</span>
                  <strong>{metric.value}</strong>
                  <p
                    className={
                      index === 3 && insightPeriod === "30 days"
                        ? "ws-trend-down"
                        : ""
                    }
                  >
                    {index === 3 && insightPeriod === "30 days" ? (
                      <ArrowDownRight size={14} />
                    ) : (
                      <ArrowUpRight size={14} />
                    )}
                    <b>{metric.change}</b>
                    <span>{metric.caption}</span>
                  </p>
                </article>
              ))}
            </div>
            <div className="ws-insight-bottom">
              <section className="ws-reach-chart">
                <div className="section-heading">
                  <div>
                    <h2>Your work, discovered</h2>
                    <p className="muted">Sample daily impressions</p>
                  </div>
                  <span className="ws-chart-key">
                    <i />
                    Impressions
                  </span>
                </div>
                <div
                  className="ws-chart"
                  role="img"
                  aria-label={
                    insightPeriod === "7 days"
                      ? "Sample impressions Monday 820, Tuesday 1040, Wednesday 930, Thursday 1510, Friday 1230, Saturday 1720, Sunday 1370. Total 8,620."
                      : "Sample weekly impressions, week one 7200, week two 8600, week three 8100, week four 10900. Total 34,800."
                  }
                >
                  <div className="ws-chart-lines">
                    <span />
                    <span />
                    <span />
                  </div>
                  {(insightPeriod === "7 days"
                    ? [820, 1040, 930, 1510, 1230, 1720, 1370]
                    : [7200, 8600, 8100, 10900]
                  ).map((value, index) => (
                    <div className="ws-chart-column" key={index}>
                      <span className="ws-chart-value">
                        {value.toLocaleString()}
                      </span>
                      <div
                        style={{
                          height: `${(value / (insightPeriod === "7 days" ? 1800 : 11500)) * 165}px`,
                        }}
                        className={
                          index === (insightPeriod === "7 days" ? 5 : 3)
                            ? "ws-chart-highlight"
                            : ""
                        }
                      />
                      <span>
                        {insightPeriod === "7 days"
                          ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][
                              index
                            ]
                          : `Week ${index + 1}`}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
              <section className="ws-top-work">
                <div className="section-heading">
                  <h2>Top performing posts</h2>
                </div>
                {[
                  {
                    title: "Between sand & sky",
                    type: "Photography",
                    photo: photos.dunes,
                    rate: "8.9%",
                  },
                  {
                    title: "A quieter kind of blue",
                    type: "Visual story",
                    photo: photos.ocean,
                    rate: "7.1%",
                  },
                  {
                    title: "Built with intention",
                    type: "Architecture",
                    photo: photos.architecture,
                    rate: "6.8%",
                  },
                ].map((item) => (
                  <button
                    className="ws-top-work-item"
                    key={item.title}
                    onClick={() => navigate("profile")}
                  >
                    <img src={item.photo} alt="" />
                    <span>
                      <strong>{item.title}</strong>
                      <small>{item.type}</small>
                    </span>
                    <span className="ws-work-rate">
                      <b>{item.rate}</b>
                      <small>engagement</small>
                    </span>
                  </button>
                ))}
                <p className="ws-storage-note">Sample performance per post.</p>
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
