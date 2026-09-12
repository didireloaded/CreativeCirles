import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleDashed,
  Clock3,
  Plus,
  Target,
  TimerReset,
  X,
} from "lucide-react";
import type { OnboardingProfile } from "../onboarding/model";
import { creators } from "../data";
import TaskDetail from "./TaskDetail";
import {
  createTask,
  readTasks,
  writeTasks,
  type CreativeTask,
  type TaskDraft,
  type TaskStatus,
} from "./model";
import "./tasks.css";

interface TasksProps {
  notify: (message: string) => void;
  profile: OnboardingProfile;
  pendingDraft: TaskDraft | null;
  onDraftConsumed: () => void;
}

type TaskView = "Today" | "All tasks" | "Progress";
type TaskFilter = "all" | "in-progress" | "completed" | "overdue";
const dayKey = (value: Date) =>
  `${value.getFullYear()}-${value.getMonth()}-${value.getDate()}`;

export default function Tasks({
  notify,
  profile,
  pendingDraft,
  onDraftConsumed,
}: TasksProps) {
  const [tasks, setTasks] = useState<CreativeTask[]>(readTasks);
  const [view, setView] = useState<TaskView>("Today");
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [selected, setSelected] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [draftContext, setDraftContext] = useState<TaskDraft | null>(null);
  const [feedback, setFeedback] = useState("");
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [calendarMonth, setCalendarMonth] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );

  useEffect(() => {
    writeTasks(tasks);
  }, [tasks]);
  useEffect(() => {
    if (!pendingDraft) return;
    setTitle(pendingDraft.title);
    setDraftContext(pendingDraft);
    setShowCreate(true);
    onDraftConsumed();
  }, [pendingDraft, onDraftConsumed]);

  const today = useMemo(() => new Date(), []);
  const calendarDates = useMemo(() => {
    const start = new Date(
      calendarMonth.getFullYear(),
      calendarMonth.getMonth(),
      1,
    );
    start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return date;
    });
  }, [calendarMonth]);
  const visibleTasks = useMemo(
    () =>
      tasks.filter((task) => {
        if (filter !== "all" && task.status !== filter) return false;
        if (
          view === "Today" &&
          task.dueAt &&
          dayKey(new Date(task.dueAt)) !== dayKey(selectedDate) &&
          task.status !== "overdue"
        )
          return false;
        return true;
      }),
    [filter, tasks, selectedDate, view],
  );
  const done = tasks.filter((task) => task.status === "completed").length;
  const inProgress = tasks.filter(
    (task) => task.status === "in-progress",
  ).length;
  const overdue = tasks.filter((task) => task.status === "overdue").length;
  const selectedTask = tasks.find((task) => task.id === selected) || null;

  function updateTask(next: CreativeTask) {
    setTasks((current) =>
      current.map((task) => (task.id === next.id ? next : task)),
    );
  }

  function toggleComplete(task: CreativeTask) {
    const isComplete = task.status === "completed";
    updateTask({ ...task, status: isComplete ? "open" : "completed" });
    const message = isComplete ? "Task reopened" : "Task completed";
    setFeedback(message);
    notify(message);
  }

  function addTask(event: React.FormEvent) {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;
    const task = createTask({
      source: draftContext?.source || "manual",
      title: cleanTitle,
      relatedId: draftContext?.relatedId,
      dueAt: draftContext?.dueAt,
      assigneeIds: draftContext?.assigneeIds,
    });
    setTasks((current) => [task, ...current]);
    setTitle("");
    setDraftContext(null);
    setShowCreate(false);
    setView("All tasks");
    setFeedback("Task added");
    notify("Task added to your creative plan.");
  }

  return (
    <main className="tasks-page">
      <header className="tasks-header">
        <div>
          <p className="eyebrow">THE WORK BEHIND THE WORK</p>
          <h1>Your tasks</h1>
          <p>{profile.displayName || "Jordan"}, keep the next move clear.</p>
        </div>
        <button
          type="button"
          className="tasks-create-button"
          onClick={() => setShowCreate(true)}
        >
          <Plus /> <span>New task</span>
        </button>
      </header>
      <nav className="tasks-tabs" aria-label="Task views">
        {(["Today", "All tasks", "Progress"] as const).map((item) => (
          <button
            type="button"
            key={item}
            className={view === item ? "is-active" : ""}
            aria-pressed={view === item}
            onClick={() => setView(item)}
          >
            {item}
          </button>
        ))}
      </nav>

      {showCreate && (
        <form className="task-create-form" onSubmit={addTask}>
          <div>
            <label htmlFor="task-title">What needs to move forward?</label>
            <input
              id="task-title"
              autoFocus
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Name the next useful action"
              required
            />
          </div>
          <button type="submit">
            Add task <ArrowUpRight />
          </button>
          <button
            type="button"
            aria-label="Close new task form"
            onClick={() => setShowCreate(false)}
          >
            <X />
          </button>
        </form>
      )}

      <section className="task-summary" aria-label="Task summary">
        <article>
          <CalendarDays />
          <span>Today</span>
          <strong>
            {
              tasks.filter(
                (task) =>
                  task.dueAt &&
                  dayKey(new Date(task.dueAt)) === dayKey(today) &&
                  task.status !== "completed",
              ).length
            }
          </strong>
          <small>tasks</small>
        </article>
        <article>
          <CircleDashed />
          <span>In progress</span>
          <strong>{inProgress}</strong>
          <small>active</small>
        </article>
        <article>
          <TimerReset />
          <span>Past due</span>
          <strong>{overdue}</strong>
          <small>needs care</small>
        </article>
        <article>
          <CheckCircle2 />
          <span>Completed</span>
          <strong>{done}</strong>
          <small>finished</small>
        </article>
      </section>

      {view === "Progress" ? (
        <section className="task-progress">
          <div className="task-progress-copy">
            <p className="eyebrow">YOUR CREATIVE RHYTHM</p>
            <h2>
              {done} finished,
              <br />
              {tasks.length - done} still moving.
            </h2>
            <p>
              A simple view of the work you have closed and what still needs
              your attention.
            </p>
          </div>
          <div
            className="task-progress-chart"
            role="img"
            aria-label={`${done} of ${tasks.length} tasks completed`}
          >
            <div
              style={
                {
                  "--progress": `${Math.round((done / tasks.length) * 100)}%`,
                } as React.CSSProperties
              }
            >
              <strong>{Math.round((done / tasks.length) * 100)}%</strong>
              <span>complete</span>
            </div>
            <dl>
              <div>
                <dt>In progress</dt>
                <dd>{inProgress}</dd>
              </div>
              <div>
                <dt>Past due</dt>
                <dd>{overdue}</dd>
              </div>
              <div>
                <dt>Total tasks</dt>
                <dd>{tasks.length}</dd>
              </div>
            </dl>
          </div>
        </section>
      ) : (
        <>
          <section className="task-calendar" aria-label="Full task calendar">
            <header>
              <div>
                <p className="eyebrow">PLAN THE MONTH</p>
                <h2>
                  {calendarMonth.toLocaleDateString("en-GB", {
                    month: "long",
                    year: "numeric",
                  })}
                </h2>
              </div>
              <div>
              <button
                type="button"
                className="button secondary"
                aria-label="Go to today"
                onClick={() => {
                    const now = new Date();
                    setCalendarMonth(
                      new Date(now.getFullYear(), now.getMonth(), 1),
                    );
                    setSelectedDate(now);
                  }}
                >
                  Today
                </button>
                <button
                  type="button"
                  className="icon-button"
                  aria-label="Previous month"
                  onClick={() =>
                    setCalendarMonth(
                      (current) =>
                        new Date(
                          current.getFullYear(),
                          current.getMonth() - 1,
                          1,
                        ),
                    )
                  }
                >
                  <ChevronLeft />
                </button>
                <button
                  type="button"
                  className="icon-button"
                  aria-label="Next month"
                  onClick={() =>
                    setCalendarMonth(
                      (current) =>
                        new Date(
                          current.getFullYear(),
                          current.getMonth() + 1,
                          1,
                        ),
                    )
                  }
                >
                  <ChevronRight />
                </button>
              </div>
            </header>
            <div className="task-calendar-weekdays" aria-hidden="true">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
            <div className="task-calendar-grid">
              {calendarDates.map((date) => {
                const key = dayKey(date);
                const count = tasks.filter(
                  (task) =>
                    task.dueAt &&
                    dayKey(new Date(task.dueAt)) === key &&
                    task.status !== "completed",
                ).length;
                return (
                  <button
                    type="button"
                    key={date.toISOString()}
                    className={`${key === dayKey(selectedDate) ? "is-selected " : ""}${key === dayKey(today) ? "is-today " : ""}${date.getMonth() !== calendarMonth.getMonth() ? "is-other-month" : ""}`}
                    aria-pressed={key === dayKey(selectedDate)}
                    aria-label={`${date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}${count ? `, ${count} tasks` : ""}`}
                    onClick={() => {
                      setSelectedDate(date);
                      setView("Today");
                    }}
                  >
                    <span>{date.getDate()}</span>
                    {count > 0 && <i>{count}</i>}
                  </button>
                );
              })}
            </div>
          </section>
          <div className="task-list-heading">
            <div>
              <h2>
                {view === "Today"
                  ? selectedDate.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })
                  : "Everything in motion"}
              </h2>
              <span>{visibleTasks.length} tasks</span>
            </div>
            <div className="task-filters" aria-label="Task status filters">
              {(
                [
                  { value: "all", label: "All" },
                  { value: "in-progress", label: "In progress" },
                  { value: "completed", label: "Completed" },
                  { value: "overdue", label: "Past due" },
                ] as const
              ).map((item) => (
                <button
                  type="button"
                  key={item.value}
                  aria-pressed={filter === item.value}
                  onClick={() => setFilter(item.value)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <section className="task-list">
            {visibleTasks.map((task) => {
              const assignees = (task.assigneeIds || [])
                .map((id) => creators.find((creator) => creator.id === id))
                .filter(Boolean);
              return (
                <article
                  className={`task-card task-${task.priority}`}
                  key={task.id}
                >
                  <label className="task-complete">
                    <input
                      type="checkbox"
                      checked={task.status === "completed"}
                      aria-label={`${task.status === "completed" ? "Reopen" : "Complete"} ${task.title}`}
                      onChange={() => toggleComplete(task)}
                    />
                    <span />
                  </label>
                  <div className="task-card-copy">
                    <div>
                      <span className="task-source">{task.source}</span>
                      <span
                        className={`task-status task-status-${task.status}`}
                      >
                        {task.status.replace("-", " ")}
                      </span>
                    </div>
                    <h3>{task.title}</h3>
                    <p>
                      {task.description ||
                        "A new task ready for the next detail."}
                    </p>
                    <div className="task-meta">
                      <span>
                        <Clock3 />
                        {task.dueAt
                          ? new Date(task.dueAt).toLocaleString("en-GB", {
                              weekday: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "No due date"}
                      </span>
                      <span>
                        <Target />
                        {task.durationMinutes} min
                      </span>
                      {assignees.length > 0 && (
                        <span className="task-assignees">
                          {assignees.map((creator) => (
                            <img
                              key={creator!.id}
                              src={creator!.image}
                              alt={creator!.name}
                            />
                          ))}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="task-open"
                    aria-label={`Open ${task.title}`}
                    onClick={() => setSelected(task.id)}
                  >
                    <ChevronRight />
                  </button>
                </article>
              );
            })}
            {visibleTasks.length === 0 && (
              <div className="task-empty">
                <CheckCircle2 />
                <h3>Nothing waiting here.</h3>
                <p>Choose another view or add the next useful task.</p>
                <button type="button" onClick={() => setShowCreate(true)}>
                  Create a task
                </button>
              </div>
            )}
          </section>
        </>
      )}
      {feedback && (
        <p className="task-feedback" role="status">
          {feedback}
        </p>
      )}
      {selectedTask && (
        <TaskDetail
          task={selectedTask}
          onClose={() => setSelected(null)}
          onChange={updateTask}
        />
      )}
    </main>
  );
}
