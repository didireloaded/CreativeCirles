import { useMemo, useState } from 'react';
import { MessageCircle, Send, Share2 } from 'lucide-react';
import BottomSheet from '../components/BottomSheet';
import ImageWithFallback from '../components/ImageWithFallback';
import type { Comment, CreativePost, Creator } from '../types';

type Props = { open: boolean; post: CreativePost | null; creator: Creator | null; onClose: () => void; notify: (message: string) => void };

function readComments(id: string): Comment[] {
  try { const value: unknown = JSON.parse(localStorage.getItem(`circle:comments:${id}`) || '[]'); return Array.isArray(value) ? value as Comment[] : []; }
  catch { return []; }
}

export default function PostDetail({ open, post, creator, onClose, notify }: Props) {
  const [draft, setDraft] = useState('');
  const [comments, setComments] = useState<Comment[]>(() => post ? readComments(post.id) : []);
  const storageId = post?.id;
  const visibleComments = useMemo(() => storageId ? comments : [], [comments, storageId]);
  if (!post || !creator) return null;
  const submit = () => {
    const body = draft.trim(); if (!body) return;
    const next = [...comments, { id: `${Date.now()}`, author: 'You', body, createdAt: 'Just now' }];
    setComments(next); setDraft('');
    try { localStorage.setItem(`circle:comments:${post.id}`, JSON.stringify(next)); } catch { /* Keep comments useful for the session. */ }
    notify('Comment added to this local preview.');
  };
  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title: post.title, text: post.caption, url: location.href });
      else { await navigator.clipboard?.writeText(location.href); notify('Preview link copied.'); }
    } catch { /* A dismissed native share needs no follow-up. */ }
  };
  return <BottomSheet open={open} title={post.title} onClose={onClose} className="detail-sheet">
    <ImageWithFallback src={post.image} alt={post.title} ratio="16 / 11" />
    <div className="detail-author"><ImageWithFallback src={creator.image} alt="" ratio="1" /><div><strong>{creator.name}</strong><span>{creator.role} · @{creator.handle}</span></div></div>
    <p className="detail-caption">{post.caption}</p>
    <div className="detail-meta"><span>{post.likes} appreciations</span><span>{post.comments + visibleComments.length} comments</span><button onClick={share}><Share2 />Share</button></div>
    <section className="detail-comments" aria-labelledby="comments-title"><h3 id="comments-title"><MessageCircle />Conversation</h3>
      {visibleComments.length === 0 ? <p className="detail-zero">Start a thoughtful conversation about this work.</p> : visibleComments.map(comment => <article key={comment.id}><strong>{comment.author}</strong><p>{comment.body}</p><small>{comment.createdAt}</small></article>)}
      <div className="detail-comment-form"><label><span>Add a comment</span><textarea aria-label="Add a comment" value={draft} onChange={event => setDraft(event.target.value)} placeholder="Share something specific and constructive…" /></label><button className="button primary" disabled={!draft.trim()} onClick={submit}><Send />Post comment</button></div>
    </section>
  </BottomSheet>;
}
