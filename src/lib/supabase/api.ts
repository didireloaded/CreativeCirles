import { supabase } from './client';
import type { Database } from './database.types';
import type { CreativePost } from '../../redesign/types';

export type PostRow = Database['public']['Tables']['posts']['Row'];
export type CommentRow = Database['public']['Tables']['comments']['Row'];
export type JobRow = Database['public']['Tables']['jobs']['Row'];
export type ProjectRow = Database['public']['Tables']['projects']['Row'];
export type TaskRow = Database['public']['Tables']['project_tasks']['Row'];
export type SavedItemRow = Database['public']['Tables']['saved_items']['Row'];

// Helper to get typed client
function getClient() {
  return supabase;
}

// --- Posts ---
export async function fetchRemotePosts(): Promise<CreativePost[] | null> {
  const client = getClient();
  if (!client) return null;
  try {
    const { data, error } = await client
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return null;
    const rows = data as unknown as PostRow[];

    return rows.map((row) => ({
      id: row.id,
      authorId: row.author_id || 'remote',
      author: row.author_name,
      handle: row.author_handle,
      discipline: row.discipline,
      avatar: row.avatar_url || '',
      image: row.image_url,
      title: row.title,
      caption: row.caption || '',
      category: row.category,
      location: row.location || 'Namibia',
      likes: row.likes_count,
      comments: row.comments_count,
    }));
  } catch {
    return null;
  }
}

export async function createRemotePost(post: {
  title: string;
  caption: string;
  category: string;
  imageUrl: string;
  discipline?: string;
  authorName?: string;
  authorHandle?: string;
}): Promise<PostRow | null> {
  const client = getClient();
  if (!client) return null;
  try {
    const user = (await client.auth.getUser()).data.user;
    const { data, error } = await client
      .from('posts')
      .insert({
        title: post.title,
        caption: post.caption,
        category: post.category,
        image_url: post.imageUrl,
        discipline: post.discipline || 'Creative',
        author_name: post.authorName || 'Jordan K.',
        author_handle: post.authorHandle || 'jordan.creates',
        author_id: user?.id || null,
      })
      .select()
      .single();

    if (error || !data) return null;
    return data as unknown as PostRow;
  } catch {
    return null;
  }
}

// --- Comments ---
export async function fetchRemoteComments(postId: string): Promise<CommentRow[] | null> {
  const client = getClient();
  if (!client) return null;
  try {
    const { data, error } = await client
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error || !data) return null;
    return data as unknown as CommentRow[];
  } catch {
    return null;
  }
}

export async function createRemoteComment(postId: string, body: string, authorName = 'You'): Promise<CommentRow | null> {
  const client = getClient();
  if (!client) return null;
  try {
    const user = (await client.auth.getUser()).data.user;
    const { data, error } = await client
      .from('comments')
      .insert({
        post_id: postId,
        body,
        author_name: authorName,
        user_id: user?.id || null,
      })
      .select()
      .single();

    if (error || !data) return null;
    return data as unknown as CommentRow;
  } catch {
    return null;
  }
}

// --- Realtime Subscriptions ---
export function subscribeToRemoteComments(postId: string, onComment: (comment: CommentRow) => void) {
  const client = getClient();
  if (!client) return () => {};
  const channel = client
    .channel(`comments:${postId}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'comments', filter: `post_id=eq.${postId}` },
      (payload) => {
        if (payload.new) onComment(payload.new as CommentRow);
      },
    )
    .subscribe();

  return () => {
    client.removeChannel(channel);
  };
}

// --- Jobs ---
export async function fetchRemoteJobs(): Promise<JobRow[] | null> {
  const client = getClient();
  if (!client) return null;
  try {
    const { data, error } = await client.from('jobs').select('*').order('created_at', { ascending: false });
    if (error || !data) return null;
    return data as unknown as JobRow[];
  } catch {
    return null;
  }
}

export async function createRemoteJob(job: {
  clientName: string;
  title: string;
  discipline: string;
  budget: string;
  location: string;
  jobType: string;
  description: string;
  skills?: string[];
}): Promise<JobRow | null> {
  const client = getClient();
  if (!client) return null;
  try {
    const user = (await client.auth.getUser()).data.user;
    const { data, error } = await client
      .from('jobs')
      .insert({
        client_name: job.clientName,
        title: job.title,
        discipline: job.discipline,
        budget: job.budget,
        location: job.location,
        job_type: job.jobType,
        description: job.description,
        skills: job.skills || [],
        poster_id: user?.id || null,
      })
      .select()
      .single();

    if (error || !data) return null;
    return data as unknown as JobRow;
  } catch {
    return null;
  }
}

// --- Projects & Tasks ---
export async function fetchRemoteProjects(): Promise<ProjectRow[] | null> {
  const client = getClient();
  if (!client) return null;
  try {
    const { data, error } = await client.from('projects').select('*').order('created_at', { ascending: false });
    if (error || !data) return null;
    return data as unknown as ProjectRow[];
  } catch {
    return null;
  }
}

export async function updateRemoteProject(project: {
  id: string;
  title?: string;
  status?: string;
  phase?: string;
  progress?: number;
}): Promise<ProjectRow | null> {
  const client = getClient();
  if (!client) return null;
  try {
    const { data, error } = await client
      .from('projects')
      .update(project)
      .eq('id', project.id)
      .select()
      .single();

    if (error || !data) return null;
    return data as unknown as ProjectRow;
  } catch {
    return null;
  }
}

export async function fetchRemoteTasks(): Promise<TaskRow[] | null> {
  const client = getClient();
  if (!client) return null;
  try {
    const { data, error } = await client.from('project_tasks').select('*').order('created_at', { ascending: false });
    if (error || !data) return null;
    return data as unknown as TaskRow[];
  } catch {
    return null;
  }
}

export async function updateRemoteTaskStatus(taskId: string, status: string): Promise<boolean> {
  const client = getClient();
  if (!client) return false;
  try {
    const { error } = await client.from('project_tasks').update({ status }).eq('id', taskId);
    return !error;
  } catch {
    return false;
  }
}

// --- Saved Items ---
export async function fetchRemoteSavedItems(): Promise<SavedItemRow[] | null> {
  const client = getClient();
  if (!client) return null;
  try {
    const { data, error } = await client.from('saved_items').select('*');
    if (error || !data) return null;
    return data as unknown as SavedItemRow[];
  } catch {
    return null;
  }
}

export async function toggleRemoteSavedItem(item: {
  itemId: string;
  kind: string;
  title: string;
  subtitle?: string;
}): Promise<boolean> {
  const client = getClient();
  if (!client) return false;
  try {
    const user = (await client.auth.getUser()).data.user;
    const { data } = await client
      .from('saved_items')
      .select('id')
      .eq('item_id', item.itemId)
      .eq('kind', item.kind)
      .maybeSingle();

    if (data && 'id' in data) {
      await client.from('saved_items').delete().eq('id', data.id as string);
    } else {
      await client.from('saved_items').insert({
        item_id: item.itemId,
        kind: item.kind,
        title: item.title,
        subtitle: item.subtitle,
        user_id: user?.id || null,
      });
    }
    return true;
  } catch {
    return false;
  }
}
