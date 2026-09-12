import { useState } from 'react';
import { Check, X } from 'lucide-react';
import type { Job } from './data';

export default function JobApplication({job,onClose}:{job:Job;onClose:()=>void}){
 const [note,setNote]=useState(''); const [saved,setSaved]=useState(false);
 return <div className="job-application"><button className="icon-button" onClick={onClose} aria-label="Close application"><X/></button>{saved?<div className="job-draft-saved"><Check/><h3>Draft saved on this device</h3><p>Nothing was submitted. Return any time before {job.deadline} to keep shaping it.</p><button className="button secondary" onClick={onClose}>Back to the role</button></div>:<form onSubmit={e=>{e.preventDefault();setSaved(true)}}><p className="eyebrow">APPLICATION DRAFT · LOCAL PREVIEW</p><h3>Tell {job.studio} why you fit.</h3><label>Why are you a strong fit?<textarea value={note} onChange={e=>setNote(e.target.value)} required minLength={20} placeholder="Share relevant work, your approach, and availability…"/></label><label>Portfolio link<input type="url" placeholder="https://"/></label><p className="form-note">This saves a private draft only. It does not contact the studio.</p><button className="button primary" type="submit">Save application draft</button></form>}</div>
}
