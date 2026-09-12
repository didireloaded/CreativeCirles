import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
const initial=[{id:'amara',name:'Amara K.',role:'Photographer',stage:'Shortlist'},{id:'leo',name:'Leo M.',role:'Filmmaker',stage:'Review'},{id:'nia',name:'Nia S.',role:'Designer',stage:'Interview'}];
export default function Applicants({navigate}:{navigate:(page:'inbox'|'projects')=>void}){
 const [people,setPeople]=useState(initial); return <section className="applicant-board"><div><p className="eyebrow">YOUR POSTED ROLE · LOCAL PREVIEW</p><h2>Applicants</h2></div>{people.map(person=><article key={person.id}><div><strong>{person.name}</strong><span>{person.role}</span></div><label>Stage<select aria-label={`${person.name} application stage`} value={person.stage} onChange={e=>setPeople(old=>old.map(item=>item.id===person.id?{...item,stage:e.target.value}:item))}><option>Review</option><option>Shortlist</option><option>Interview</option><option>Offer</option></select></label><button className="icon-button" aria-label={`Message ${person.name}`} onClick={()=>navigate('inbox')}><ArrowUpRight/></button></article>)}</section>
}
