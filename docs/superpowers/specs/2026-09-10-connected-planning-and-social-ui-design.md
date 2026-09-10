# Connected Planning and Social UI Design

## Purpose

This phase strengthens Creative Circle's frontend around four connected experiences: a strategic creator Dashboard, a separate operational Tasks product, richer Story interactions, and a polished calling preview. It remains a frontend-only build. Data will use deterministic preview content and local browser persistence until the Supabase phase.

## Product boundaries

Dashboard and Tasks are separate top-level experiences with different jobs:

- **Dashboard** helps a creator understand projects, collaborators, meetings, calendar commitments, reminders, and performance.
- **Tasks** helps a creator execute work through assignments, priorities, deadlines, subtasks, attachments, and progress.

The two experiences may link to the same project or collaborator, but neither is presented as a tab inside the other. Meetings and the full calendar remain in Dashboard. Tasks uses a compact date strip and due-date filters rather than duplicating the calendar.

## Navigation

Mobile primary navigation becomes Home, Discover, Create, Tasks, and Inbox. The profile remains available from the signed-in user's avatar. Dashboard remains available from its dedicated sparkle/dashboard entry and from the desktop sidebar.

Existing routes remain compatible. The current Workspace route becomes the Dashboard presentation so bookmarked preview URLs continue to work. Tasks receives its own route and primary navigation state.

## Dashboard

Dashboard keeps the current light editorial presentation and adds a dedicated Meetings view alongside Overview, Calendar, and Insights.

The Meetings view contains:

- the signed-in creator identity;
- a search field for collaborators or meetings;
- horizontally scrollable active-collaborator avatars;
- upcoming meeting cards with title, time, duration, participants, type, and status;
- a featured next-collaboration card using a restrained Creative Circle gradient;
- Join, Details, Reminder, and Reschedule preview actions;
- useful empty, completed, cancelled, and reminder-set states.

Join is a frontend preview action until real calling exists. It must clearly disclose that nothing is sent and no meeting is entered.

## Tasks

Tasks is a standalone operational destination with Today, All Tasks, and Progress views. Status filters cover In Progress, Completed, Overdue, and Awaiting Feedback.

The Today view contains a greeting, current date, summary cards, compact date strip, and today's task list. Each task card shows its project or collaboration, time, duration, priority, status, and assignee group. Completion controls update local preview state immediately.

Task detail includes:

- title and description;
- related project or collaboration;
- assignees;
- due date and time;
- priority and status;
- checklist or subtasks;
- attachment previews;
- comments and activity history.

The Progress view summarizes completed, active, overdue, and awaiting-feedback work with an accessible weekly chart. Visual charts also expose equivalent text for assistive technology.

Task creation can be opened with prefilled context from Projects, Collaborations, Jobs, Messages, Events, and creator profiles. During the frontend phase these entry points create local preview tasks only. Each entry point must communicate its result and preserve the user's current context.

## Stories

Story reactions are limited to the full-screen Story Viewer and do not alter regular post controls.

The viewer adds:

- a translucent private-reply field;
- a separate like control;
- a curved horizontal emoji carousel;
- pointer, touch, and keyboard navigation;
- a raised and enlarged centered reaction;
- a restrained reaction-burst animation;
- automatic playback pause while the controls are being used.

Story replies are private and represented as locally saved Inbox replies in this phase. Likes and emoji reactions persist locally. Tapping the story navigation zones continues to move between stories, while interacting with the reply or reaction controls never advances the story.

## Calling preview

Voice and video entry buttons appear only in an open Inbox conversation. They open an immersive calling preview using the selected creator's portrait, with a frosted control panel for camera, microphone, audio output, camera switching, and ending the call.

The controls may toggle visual state for demonstration. A persistent Coming Soon label explains that the experience is a preview. The implementation must never request camera or microphone permission, create a WebRTC connection, ring a user, or imply that a real call is active. Ending the preview returns focus and context to the conversation.

## Visual system

The reference images guide composition and interaction, not branding. All new UI uses Creative Circle's existing system:

- deep burgundy and wine for immersive surfaces;
- warm cream for planning and productivity surfaces;
- gold for active, selected, and important states;
- restrained translucent glass;
- consistent typography, corner radii, spacing, shadows, and icon weight;
- responsive layouts for mobile, tablet, and desktop;
- minimum touch targets, visible keyboard focus, reduced-motion support, and safe-area padding.

Dashboard and Tasks should look related but unmistakably different: Dashboard is spacious and editorial; Tasks is denser and execution-focused. Story and call surfaces are immersive and media-led.

## State and data flow

Preview state is owned locally by the feature that renders it and persisted through versioned local-storage keys where persistence improves the demonstration. Stored data is validated before use and falls back safely when storage is unavailable.

Cross-app task creation uses one small, typed task-draft contract containing source, related entity, suggested title, optional deadline, and assignees. This keeps integrations independent of the internal Tasks implementation and provides a clean boundary for the later Supabase replacement.

## Error and empty states

Every new surface includes intentional loading, empty, failure, and unavailable states where applicable. Local-storage failure must not block interaction; the UI explains that changes will last only for the current visit. Actions that are not live must say Preview or Coming Soon at the point of interaction.

## Verification

Implementation is test-driven and includes:

- component tests for task filtering, completion, creation, story reactions, private replies, and call-preview safety;
- routing and navigation tests for Tasks and Dashboard;
- interaction tests for meeting actions and cross-app task drafts;
- keyboard, focus-restoration, reduced-motion, and accessible-name checks;
- responsive browser checks at supported mobile, tablet, and desktop widths;
- type checking, linting, production build, and the existing end-to-end suite.

## Out of scope

This phase does not implement Supabase persistence, real notifications, real meeting entry, voice or video transport, media-device permissions, public story comments, or server-side task assignment. Those capabilities will use this frontend contract in later backend phases.
