-- ==============================================================================
-- Creative Circle — Complete Production Supabase Database Schema
-- Run this script in your Supabase Project Dashboard -> SQL Editor -> New Query.
-- It creates tables, indexes, Row Level Security (RLS) policies, and Realtime sync.
-- ==============================================================================

-- 1. POSTS TABLE
CREATE TABLE IF NOT EXISTS public.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  author_handle text NOT NULL,
  discipline text NOT NULL,
  avatar_url text,
  image_url text NOT NULL,
  title text NOT NULL,
  caption text,
  category text NOT NULL,
  location text DEFAULT 'Namibia',
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. COMMENTS TABLE
CREATE TABLE IF NOT EXISTS public.comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  body text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 3. JOBS & BRIEFS TABLE
CREATE TABLE IF NOT EXISTS public.jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  poster_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  client_name text NOT NULL,
  title text NOT NULL,
  discipline text NOT NULL,
  budget text NOT NULL,
  location text NOT NULL,
  job_type text NOT NULL,
  description text NOT NULL,
  skills text[] DEFAULT '{}',
  deadline timestamptz,
  created_at timestamptz DEFAULT now()
);

-- 4. JOB APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
  applicant_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  applicant_name text NOT NULL,
  applicant_role text NOT NULL,
  cover_letter text NOT NULL,
  proposed_rate text,
  created_at timestamptz DEFAULT now()
);

-- 5. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  client_name text NOT NULL,
  status text NOT NULL DEFAULT 'In progress',
  phase text NOT NULL DEFAULT 'Planning',
  progress integer NOT NULL DEFAULT 0,
  budget text,
  due_date text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 6. PROJECT TASKS TABLE
CREATE TABLE IF NOT EXISTS public.project_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  status text NOT NULL DEFAULT 'todo',
  priority text NOT NULL DEFAULT 'medium',
  due_date text,
  created_at timestamptz DEFAULT now()
);

-- 7. SAVED BOOKMARKS TABLE
CREATE TABLE IF NOT EXISTS public.saved_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id text NOT NULL,
  kind text NOT NULL,
  title text NOT NULL,
  subtitle text,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, item_id, kind)
);

-- 8. CONVERSATIONS & CHAT TABLES
CREATE TABLE IF NOT EXISTS public.conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text DEFAULT 'direct',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.conversation_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  last_read_at timestamptz DEFAULT now(),
  joined_at timestamptz DEFAULT now(),
  UNIQUE(conversation_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  sender_name text NOT NULL,
  body text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- ==============================================================================
-- INDEXES FOR QUERY OPTIMIZATION
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_category ON public.posts(category);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON public.comments(post_id);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON public.jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_project_tasks_project_id ON public.project_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_saved_items_user_id ON public.saved_items(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Grant API roles
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.posts, public.comments, public.jobs TO anon, authenticated;
GRANT ALL ON TABLE
  public.posts,
  public.comments,
  public.jobs,
  public.job_applications,
  public.projects,
  public.project_tasks,
  public.saved_items,
  public.conversations,
  public.conversation_participants,
  public.messages
TO authenticated;

-- Policies: POSTS
DROP POLICY IF EXISTS "Posts are viewable by everyone" ON public.posts;
CREATE POLICY "Posts are viewable by everyone" ON public.posts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can create posts" ON public.posts;
CREATE POLICY "Authenticated users can create posts" ON public.posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id OR author_id IS NULL);

DROP POLICY IF EXISTS "Users can update own posts" ON public.posts;
CREATE POLICY "Users can update own posts" ON public.posts FOR UPDATE TO authenticated USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can delete own posts" ON public.posts;
CREATE POLICY "Users can delete own posts" ON public.posts FOR DELETE TO authenticated USING (auth.uid() = author_id);

-- Policies: COMMENTS
DROP POLICY IF EXISTS "Comments are viewable by everyone" ON public.comments;
CREATE POLICY "Comments are viewable by everyone" ON public.comments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can post comments" ON public.comments;
CREATE POLICY "Authenticated users can post comments" ON public.comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Policies: JOBS & APPLICATIONS
DROP POLICY IF EXISTS "Jobs are viewable by everyone" ON public.jobs;
CREATE POLICY "Jobs are viewable by everyone" ON public.jobs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can post jobs" ON public.jobs;
CREATE POLICY "Authenticated users can post jobs" ON public.jobs FOR INSERT TO authenticated WITH CHECK (auth.uid() = poster_id OR poster_id IS NULL);

DROP POLICY IF EXISTS "Users can apply to jobs" ON public.job_applications;
CREATE POLICY "Users can apply to jobs" ON public.job_applications FOR INSERT TO authenticated WITH CHECK (auth.uid() = applicant_id OR applicant_id IS NULL);

DROP POLICY IF EXISTS "Applicants and posters can view applications" ON public.job_applications;
CREATE POLICY "Applicants and posters can view applications" ON public.job_applications FOR SELECT TO authenticated USING (
  auth.uid() = applicant_id OR 
  EXISTS (SELECT 1 FROM public.jobs WHERE jobs.id = job_applications.job_id AND jobs.poster_id = auth.uid())
);

-- Policies: PROJECTS & TASKS
DROP POLICY IF EXISTS "Users can view and manage their projects" ON public.projects;
CREATE POLICY "Users can view and manage their projects" ON public.projects FOR ALL TO authenticated USING (auth.uid() = owner_id OR owner_id IS NULL);

DROP POLICY IF EXISTS "Users can view and manage their tasks" ON public.project_tasks;
CREATE POLICY "Users can view and manage their tasks" ON public.project_tasks FOR ALL TO authenticated USING (auth.uid() = user_id OR user_id IS NULL);

-- Policies: SAVED ITEMS
DROP POLICY IF EXISTS "Users can manage their saved items" ON public.saved_items;
CREATE POLICY "Users can manage their saved items" ON public.saved_items FOR ALL TO authenticated USING (auth.uid() = user_id OR user_id IS NULL);

-- Policies: CHAT & MESSAGES
DROP POLICY IF EXISTS "Participants can view conversations" ON public.conversations;
CREATE POLICY "Participants can view conversations" ON public.conversations FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.conversation_participants cp WHERE cp.conversation_id = id AND cp.user_id = auth.uid())
);

DROP POLICY IF EXISTS "Participants can view messages" ON public.messages;
CREATE POLICY "Participants can view messages" ON public.messages FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.conversation_participants cp WHERE cp.conversation_id = messages.conversation_id AND cp.user_id = auth.uid())
);

DROP POLICY IF EXISTS "Participants can send messages" ON public.messages;
CREATE POLICY "Participants can send messages" ON public.messages FOR INSERT TO authenticated WITH CHECK (
  auth.uid() = sender_id OR sender_id IS NULL
);

-- ==============================================================================
-- REALTIME BROADCAST
-- ==============================================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;
END $$;

ALTER PUBLICATION supabase_realtime ADD TABLE public.posts, public.comments, public.messages;
