import { useState } from 'react';
import BottomSheet from '../components/BottomSheet';
import type { Job, JobCategory, JobType } from './data';

export default function JobEditor({onClose,onSave}:{onClose:()=>void;onSave:(job:Job)=>void}) {
  const [form,setForm] = useState({title:'',studio:'',category:'Photography' as JobCategory,type:'Freelance' as JobType,budget:'',location:'',duration:'',deadline:'',summary:'',requirements:''});
  return <BottomSheet open title="Create a job listing" onClose={onClose}><form className="product-editor" onSubmit={event=>{event.preventDefault();onSave({...form,id:crypto.randomUUID(),requirements:form.requirements.split('\n').map(x=>x.trim()).filter(Boolean)});}}>
    <p>Save a listing on this device. Public publishing will be available when the community launches.</p>
    {(['title','studio','budget','location','duration'] as const).map(field=><label key={field}>{({title:'Role title',studio:'Studio or company',budget:'Budget or rate',location:'Location',duration:'Duration'})[field]}<input required value={form[field]} maxLength={120} onChange={e=>setForm({...form,[field]:e.target.value})}/></label>)}
    <label>Category<select value={form.category} onChange={e=>setForm({...form,category:e.target.value as JobCategory})}>{['Photography','Film','Design','Music'].map(x=><option key={x}>{x}</option>)}</select></label>
    <label>Job type<select value={form.type} onChange={e=>setForm({...form,type:e.target.value as JobType})}>{['Freelance','Contract','Part-time','Full-time'].map(x=><option key={x}>{x}</option>)}</select></label>
    <label>Application deadline<input required type="date" value={form.deadline} onChange={e=>setForm({...form,deadline:e.target.value})}/></label>
    <label>About the role<textarea required minLength={20} value={form.summary} onChange={e=>setForm({...form,summary:e.target.value})}/></label>
    <label>Requirements, one per line<textarea required value={form.requirements} onChange={e=>setForm({...form,requirements:e.target.value})}/></label>
    <button className="button primary" type="submit">Save listing</button>
  </form></BottomSheet>;
}
