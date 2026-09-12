import { useState } from 'react';
import { Check, X } from 'lucide-react';
import type { Job } from './data';
import { readLocal, writeLocal } from '../storage';

export default function JobApplication({job,onClose}:{job:Job;onClose:()=>void}){
 const [draft,setDraft]=useState(()=>readLocal(`application:${job.id}`,{note:'',portfolio:''})); const [saved,setSaved]=useState(false); const [error,setError]=useState('');
 return <div className="job-application"><button className="icon-button" onClick={onClose} aria-label="Close application"><X/></button>{saved?<div className="job-draft-saved"><Check/><h3>Draft saved on this device</h3><p>Nothing was submitted. Return any time before {job.deadline} to keep shaping it.</p><button className="button secondary" onClick={()=>setSaved(false)}>Continue editing</button><button className="button primary" onClick={onClose}>Back to the role</button></div>:<form onSubmit={e=>{e.preventDefault();if(writeLocal(`application:${job.id}`,draft))setSaved(true);else setError('Couldn’t save this draft. Free browser storage and try again.')}}><p className="eyebrow">APPLICATION DRAFT</p><h3>Tell {job.studio} why you fit.</h3><label>Why are you a strong fit?<textarea value={draft.note} onChange={e=>setDraft({...draft,note:e.target.value})} required minLength={20} placeholder="Share relevant work, your approach, and availability…"/></label><label>Portfolio link<input type="url" value={draft.portfolio} onChange={e=>setDraft({...draft,portfolio:e.target.value})} placeholder="https://"/></label><p className="form-note">This saves a private draft only. It does not contact the studio.</p>{error&&<p role="alert">{error}</p>}<button className="button primary" type="submit">Save application draft</button></form>}</div>
}
