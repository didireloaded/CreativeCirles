export type JobType = 'Contract' | 'Freelance' | 'Part-time' | 'Full-time';
export type JobCategory = 'Photography' | 'Film' | 'Design' | 'Music';
export interface Job { id:string; title:string; studio:string; category:JobCategory; type:JobType; budget:string; location:string; duration:string; deadline:string; summary:string; requirements:string[] }
export const jobs:Job[]=[
 {id:'brand-photo',title:'Brand photographer',studio:'North Studio',category:'Photography',type:'Freelance',budget:'N$ 8,000–12,000',location:'Windhoek · On site',duration:'2 shoot days',deadline:'18 Oct',summary:'Create a warm, human image library for a Namibian lifestyle launch.',requirements:['Editorial portfolio','Confident directing talent','Own lighting kit']},
 {id:'documentary-editor',title:'Documentary editor',studio:'Field Notes Films',category:'Film',type:'Contract',budget:'N$ 24,000',location:'Remote',duration:'4 weeks',deadline:'21 Oct',summary:'Shape a 14-minute documentary about makers working across the Namib.',requirements:['DaVinci Resolve or Premiere','Documentary storytelling','Sound-editing confidence']},
 {id:'identity-designer',title:'Visual identity designer',studio:'Common Ground',category:'Design',type:'Part-time',budget:'N$ 450/hour',location:'Hybrid · Windhoek',duration:'6 weeks',deadline:'28 Oct',summary:'Build an expressive identity system for a new community arts programme.',requirements:['Identity systems','Presentation design','Collaborative workshops']},
];
