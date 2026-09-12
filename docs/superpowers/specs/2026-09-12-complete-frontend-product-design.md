# Creative Circle Complete Frontend Product Design

## Purpose

This phase completes the interactive Creative Circle PWA frontend before full backend integration. It extends the approved application in place and preserves its five primary destinations: Home, Discover, Create, Tasks, and Inbox. Workspace remains the creator dashboard, Tasks remains a separate execution product, and Profile remains available from the signed-in creator identity.

All new experiences use realistic, validated local data and versioned browser storage. Nothing may claim a remote action succeeded. Features requiring accounts, remote users, AI generation, calling infrastructure, moderation staff, payments, or cloud storage must identify themselves as previews at the point of action. Payment processing and checkout are excluded entirely.

## Governing principles

- Preserve the current React, TypeScript, Vite, CSS, native-dialog, and local-storage architecture.
- Extend existing components, routes, tokens, state helpers, and interaction patterns before creating new systems.
- Use Creative Circle’s burgundy, cream, gold, editorial typography, restrained glass, spacing, radii, and icon language.
- Do not introduce a second router, global state library, styling framework, or mock server.
- Every visible control must perform a meaningful local action, open a useful detail, or clearly explain why it is unavailable.
- Every stored value must be validated and safely recover from malformed or unavailable storage.
- Every module must support narrow mobile, normal mobile, tablet, and desktop layouts.
- Every meaningful collection must include populated, filtered, empty, loading, error, and offline representations.
- Payments, checkout, payouts, refunds, and financial account connection are out of scope.

## Information architecture

### Primary navigation

The five primary destinations remain:

1. Home — community feed, stories, and social discovery.
2. Discover — personalized discovery plus the Explore/Tools hub.
3. Create — post, project, story, event, opportunity, service, and product creation entry points.
4. Tasks — personal execution, assignments, deadlines, and progress.
5. Inbox — direct/group messaging, collaboration requests, and call previews.

### Secondary destinations

Discover gains an Explore/Tools entry that opens the product hub. The hub contains:

- Jobs
- Find Talent
- Projects
- AI Studio
- Creative Buzz
- Nearby
- Skill Swap
- Contracts
- Feedback
- Services

Profile gains creator-business, saved-items, verification, safety, privacy, and notification entries. Workspace continues to expose Overview, Meetings, Calendar, and Insights. Secondary destinations retain their own URL so refresh, browser history, and direct links behave predictably.

## Shared local domain layer

The frontend uses one shared versioned local domain store rather than independent page-specific mock arrays. It contains repositories for profiles, follows, posts, comments, stories, conversations, messages, jobs, applications, saved items, collaboration requests, projects, tasks, events, opportunities, services, products, templates, contracts, reports, and preferences.

Seed data is deterministic and labeled as preview content in state metadata, not repeatedly stamped across production-facing UI. Mutations update all dependent views. Examples:

- applying to a job updates the job, application tracker, notifications, and related tasks;
- accepting a collaboration creates or links a conversation and may create a project draft;
- saving an event or grant can create a reminder or task;
- accepting a proposal updates the project activity timeline;
- a story reply appears in its creator conversation;
- an AI output can be saved to a project, task, draft, or contract library;
- blocking a profile hides its posts and conversations from normal discovery.

The domain layer exposes typed query and command functions. UI modules do not manipulate raw local-storage JSON directly.

## Module 1: Marketplace

### Jobs board

The Jobs area provides search, category chips, job-type filters, location, remote/on-site, budget, duration, experience, and deadline filters. It supports full-time, part-time, contract, freelance, collaboration, and one-off project opportunities.

Job cards show title, organization or creator, verification state, discipline, location, work mode, budget, duration, deadline, applicant count, and saved state. A job detail includes description, deliverables, requirements, preferred skills, project context, timeline, budget, creator identity, safety guidance, and related opportunities.

Users can save, unsave, share, apply, withdraw, report, and create a task from a job. Applying opens a multi-step local application flow with profile selection, pitch, relevant portfolio items, rate, availability, attachments metadata, review, and confirmation. Applicant tracking provides Draft, Submitted, Viewed, Shortlisted, Interview, Offered, Accepted, Declined, and Withdrawn states.

Job creators can compose, edit, pause, close, duplicate, and locally publish opportunities. A creator-facing applicant view supports search, status filters, profile review, notes, shortlist, decline, message, and collaboration/project conversion.

### Talent finder

Talent Finder supports search and filters for discipline, skill, location, remote availability, experience, budget, rating, verification, response time, and collaboration openness. Users can switch grid/list layouts and sort by relevance, rating, price, experience, or response time.

Talent cards and details expose profile identity, availability, skills, services, rates, equipment, portfolio, testimonials, response time, and collaboration history preview. Users can save talent, follow, message, create a task, request collaboration, invite to a project, compare a small set of profiles, block, or report.

AI matching is represented by an explainable local recommendation panel. It shows the factors used—skills, location, availability, budget, and project fit—and never claims that a remote model ran.

## Module 2: Projects

Projects remains distinct from Tasks. A Project is the shared body of work; Tasks are executable actions that may belong to it.

The Projects destination contains Active, Planning, Review, Completed, and Archived views. Each project shows phase, progress, team, next milestone, budget status, deadline health, files, and recent activity.

Project detail contains:

- Overview with brief, goals, deliverables, dates, location, and status;
- Phases: Development, Pre-Production, Production, Post-Production, Distribution;
- Tasks linked to the existing Tasks product;
- Team with roles, permissions preview, workload, and contribution progress;
- Files with folders, metadata, version history, comments, approval state, and local attachment previews;
- Budget with planned and recorded line items, totals, remaining amount, and warnings;
- Milestones and deadlines;
- Activity timeline;
- Proposals and project bids;
- project conversation link.

Users can create, edit, duplicate, archive, and restore projects; change phases; manage members; add milestones; add budget lines; attach local file metadata; request approval; record review decisions; and create linked tasks. Destructive actions require confirmation and remain recoverable where practical.

Project bidding includes open brief, requirements, proposal composer, proposed rate, timeline, milestones, portfolio references, revisions, withdraw, shortlist, accept, and decline interactions. Accepting a proposal creates a team member, project activity, conversation, and suggested onboarding tasks.

## Module 3: Creative Tools / AI Studio

AI Studio provides a chat-style workspace and a tool library without calling an external AI service. It contains:

- Contract Generator
- Shot List Creator
- Storyboard Assistant
- Bio Optimizer
- Pitch Deck Builder
- Pricing Calculator
- Project Brief Builder
- Caption and project-description helper

Each tool has structured inputs, validation, example prompts, locally generated deterministic preview output, edit controls, copy/download presentation, and Save to Project, Save to Tasks, or Save to Ideas actions where appropriate. Outputs must say “Preview draft” and never claim legal, financial, or professional certainty.

The template library supports categories, search, ratings presentation, favorites, recent templates, preview, duplicate, and local download/export where browser APIs allow it. Conversation history is local, searchable, renameable, and deletable with confirmation.

AI Insights presents trends, profile completeness, pricing opportunities, collaboration suggestions, and content patterns using explainable seeded calculations. Every insight shows why it appeared and provides a relevant next action.

## Module 4: Community and trust

### Feed completion

The existing feed gains category filtering for Film, Photography, Design, Music, Writing, Fashion, and Feedback. Onboarding interests determine the initial personalized categories and users can change them later.

Post composition supports text, image, video, audio, category, audience, location, mentions, tags, project association, alt text, and feedback requests. Feedback requests specify aspects such as composition, pacing, color, sound, writing, concept, technique, or pricing.

Posts support like, unlike, comments, threaded replies, share, bookmark, edit, delete, hide, report, follow creator, mute creator, and create task. Local pagination simulates infinite scroll with deterministic pages. Pull-to-refresh is implemented where pointer capabilities support it and has an equivalent Refresh control.

### Profiles and relationships

Profiles gain working follow/unfollow, private follow-request preview, followers/following lists, saved profile lists, collaboration availability, online-state preference, richer service rates, testimonials, and portfolio project details.

Verification includes an application checklist, identity/evidence metadata, submission state, under-review state, information request, approval, rejection, and reapply presentation. It remains a local workflow and never displays an approved badge as the result of a fake self-verification action.

### Communities and feedback

Communities gain searchable feeds, membership roles, rules, pinned posts, member lists, community events, post composition, leave/join confirmation, mute, and report actions.

Feedback includes public critique requests and an anonymous-feedback mode. Anonymous mode hides identity in the preview UI, explains its limits, supports structured critique prompts, and provides report/block controls. No local implementation claims guaranteed anonymity from a real service.

### Safety

Users can report posts, profiles, comments, messages, jobs, communities, and events with reason, optional detail, block option, confirmation, and local report history. Blocking immediately removes the person’s content from ordinary surfaces and provides a settings screen to unblock them. Muting hides feed content without blocking messaging or profile access.

## Module 5: Communication

Inbox gains direct and group conversations, creation of group chats, participant details, conversation search, unread filters, pin, mute, archive, mark read/unread, and delete-local-history confirmation.

Messages support text, image/video/audio/file attachment previews, voice-note recording simulation without microphone permission, replies, reactions, edit, delete, copy, save attachment metadata, and convert to task. Delivery, read receipts, typing indicators, and online presence are deterministic UI states and labeled preview activity where needed.

Story replies are inserted into the matching conversation. Collaboration requests, job applications, project invitations, and proposal activity link into contextual Inbox threads.

The existing call preview gains voice/video selection, incoming-call presentation, declined/missed/completed call-history states, and group-call composition. It remains Coming Soon, requests no device permissions, creates no WebRTC connection, and contacts nobody.

Notification preferences cover social, messages, collaborations, projects, tasks, jobs, events, recommendations, verification, and moderation. The notification center supports filtering, deep links to local entities, marking individual/all items read, and clearing read notifications.

## Module 6: Opportunities

Creative Buzz contains industry news, grants, funding calls, workshops, competitions, residencies, festivals, and trending topics. Items support category, location, deadline, eligibility, source presentation, save, share, reminder, task, hide, and report-source actions.

Because this phase has no live content service, all entries are clearly preview editorial content and cannot masquerade as current factual opportunities. Expired and closing-soon states are represented. Filters include category, location, eligibility, format, cost, and deadline.

Nearby Talent uses a permission-free location selector by default. Users choose a region/city or simulated radius and can browse talent, events, communities, and opportunities. A “Use my location” control remains unavailable until location permission and backend privacy architecture exist, with manual location always available.

Skill Swap lets users offer skills, request skills, define scope and availability, search compatible swaps, save matches, propose a swap, negotiate in Inbox, accept, decline, and convert an accepted swap into a project with tasks.

## Module 7: Creator business without payments

### Services

Creators can list, edit, pause, duplicate, and archive services. A service includes title, description, category, deliverables, exclusions, turnaround, revisions, location/remote availability, hourly/half-day/full-day/project rates, portfolio examples, requirements, and booking availability.

Visitors can save a service, request availability, ask a question, share, report, or start a booking inquiry. Booking inquiries progress through New, Discussing, Quote Sent, Confirmed, In Progress, Delivered, Completed, Declined, and Cancelled local states. No payment, deposit, checkout, or payout UI is included.

### Digital products and subscriptions

Creators can compose digital product listings for LUTs, presets, templates, guides, and asset packs, including files metadata, images, versions, licensing summary, price presentation, and status. Products can be previewed, saved, shared, edited, paused, and archived. Purchase/download actions are replaced with “Sales coming later”; no simulated purchase success is allowed.

Free, Supporter, and VIP subscription tiers can be configured with benefits, visibility, content eligibility, and member-count previews. Subscribe actions explain that subscriptions are unavailable until payments launch.

### Revenue and supporters

Revenue analytics is a clearly labeled sample dashboard showing services, products, subscriptions, and tips as illustrative income-source categories. It supports periods, charts, booking pipeline, top services, and supporters presentation. It must never imply that money was collected. Tips and support show a coming-later state without accepting amounts or payment details.

## Contracts and legal templates

The Contracts area contains template categories, search, favorites, previews, duplicate, local editing, parties, scope, deliverables, dates, cancellation, usage rights, revisions, confidentiality, and signature-placeholder presentation. Contracts can link to projects and collaborators and generate review tasks.

Every contract and generated clause is labeled a preview template and includes a concise prompt to obtain appropriate professional advice. No legal-validity claim or fake electronic signature completion is allowed.

## Cross-feature workflows

The following workflows are required:

1. Job → application → conversation → project → linked tasks.
2. Talent profile → collaboration request → conversation → project invitation.
3. Buzz item/event/grant → saved item → reminder or task.
4. Skill swap → negotiation conversation → accepted project → tasks.
5. Feed post/story → comment or reply → notification/conversation.
6. Message → task linked back to conversation.
7. AI Studio output → project, contract, task, or saved idea.
8. Proposal → review → accepted team member and project activity.
9. Service inquiry → conversation → booking pipeline → project.
10. Report/block → immediate filtering across feed, discovery, jobs, and Inbox.

## Creation system

The radial Create control remains lightweight. Its first layer continues to show Post, Project, Story, Event, and Ideas. A “More” entry or a secondary creation sheet exposes Job, Collaboration, Service, Product, Skill Swap, and Community without overcrowding the radial layout.

Every composer supports draft restoration, validation, back navigation without accidental loss, discard confirmation, local preview, and success routing to the created entity. File inputs validate type and size and never claim upload completion.

## Search and saved content

Global search is available through Discover and indexes all local domain entities. Results are grouped into Work, Creators, Jobs, Projects, Communities, Events, Buzz, Services, Products, and Templates. Recent searches and saved searches can be cleared.

Saved content is organized under Profile with filters for posts, creators, jobs, events, buzz, services, products, templates, and projects. Unsaving updates every source view.

## Accessibility and interaction quality

- Minimum interactive target is 44 CSS pixels except tightly grouped non-primary desktop controls with an equivalent accessible target.
- Every icon-only control has a specific accessible name.
- Tabs implement arrow-key behavior and correct selected/focus states.
- Dialogs trap focus through native dialog behavior and restore focus to their opener.
- Dynamic results and confirmations are announced without duplicating global toast announcements.
- Charts expose equivalent text.
- Media requires useful alternative text or an explicit decorative state.
- Color is never the only status indicator.
- Reduced-motion mode removes nonessential motion and pauses timed media.
- Touch gestures have visible button alternatives.

## Error, empty, and offline behavior

Each repository command returns a typed success or failure result. Storage failure preserves session state and explains that changes will not persist. Corrupt stored state is quarantined by falling back to validated seed data without crashing.

Unavailable remote features explain the missing capability and present a useful alternative. Examples include manual location instead of device location, local preview output instead of AI generation, file metadata instead of upload, and saved message drafts instead of sending to another account.

Offline mode preserves local browsing and mutations, displays a quiet global status, and never shows fake synchronization. A future-sync queue presentation may list pending local actions but does not claim they will upload until backend synchronization exists.

## Testing and verification

Every module is developed test-first. Required coverage includes:

- domain validation, relationships, filtering, sorting, pagination, and mutations;
- route parsing, browser history, direct links, and five-tab navigation preservation;
- forms, drafts, confirmations, destructive-action recovery, and cross-feature workflows;
- permission safety for calls, voice notes, and nearby discovery;
- accessible names, keyboard operation, focus restoration, announcements, and reduced motion;
- 320px, 390px, tablet, and desktop browser layouts;
- loading, empty, error, malformed-storage, and offline states;
- full unit suite, typecheck, lint, production build, and end-to-end suite at each module checkpoint.

## Delivery sequence

The frontend ships in independently verified modules:

1. Shared domain store, secondary routing, and Explore/Tools hub.
2. Jobs and Talent Finder.
3. Projects, proposals, files, team, budget, and task connections.
4. Community, profiles, relationships, feedback, verification, and safety.
5. Communication, group messaging, attachments, notifications, and call history.
6. Creative Buzz, Nearby, Skill Swap, and global saved/search experiences.
7. AI Studio, templates, and contracts.
8. Services, booking pipeline, products, subscriptions, revenue previews, and supporters.
9. Cross-feature integration audit, responsive visual review, accessibility review, and regression verification.

Each module must be usable and testable before the next module begins. Existing verified behavior remains the baseline throughout.

## Explicit exclusions

- Payment collection
- Checkout
- Deposits
- Payouts
- Refunds
- Stored payment methods
- Banking integrations
- Real AI model calls
- Real calling or media permissions
- Real geolocation permissions
- Cloud file uploads
- Remote push/email delivery
- Claims that another real person received or acted on local preview data
- Full production backend integration beyond the existing Supabase foundation
