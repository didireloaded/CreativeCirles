import type { Community, Creator } from './types';

// Illustrative content for the UI preview; no live account or activity data.
export const photos = {
  portrait: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=85',
  male: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=85',
  woman: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=240&q=85',
  man: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=240&q=85',
  woman2: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=240&q=85',
  dunes: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=1400&q=90',
  fashion: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1100&q=85',
  desert: 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&w=1200&q=85',
  ocean: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1000&q=85',
  music: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1000&q=85',
  architecture: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1000&q=85',
  art: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?auto=format&fit=crop&w=1000&q=85',
  camera: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1100&q=85',
};
export const creators: Creator[] = [
  { id:'amara', name:'Amara K.', handle:'amara.creates', role:'Photographer', image:photos.portrait, bio:'Documentary photographer drawn to warm light and honest stories.', availability:'Available for selected projects', skills:['Editorial photography','Art direction','Retouching'], equipment:['Sony A7 IV','35mm prime','Portable lighting'], services:[{name:'Editorial session',rate:'From N$2,800'},{name:'Full-day production',rate:'From N$7,500'}], portfolio:[photos.dunes,photos.ocean,photos.desert], socialLinks:['Instagram','Behance'] },
  { id:'leo', name:'Leo M.', handle:'framesbyleo', role:'Filmmaker', image:photos.male, bio:'Director and editor making human-scale films with a cinematic pulse.', availability:'Open to collaborations', skills:['Directing','Editing','Color grading'], equipment:['Blackmagic Pocket 6K','Cinema lens kit','Field recorder'], services:[{name:'Short-form film',rate:'Project quote'},{name:'Edit session',rate:'From N$850/hour'}], portfolio:[photos.camera,photos.desert,photos.music], socialLinks:['YouTube','Vimeo'] },
  { id:'nia', name:'Nia S.', handle:'nia.studio', role:'Fashion designer', image:photos.woman, bio:'Independent designer exploring movement, memory, and everyday form.', availability:'Booking next month', skills:['Fashion design','Styling','Creative direction'], equipment:['Industrial sewing setup','Pattern library'], services:[{name:'Custom look',rate:'Project quote'},{name:'Styling session',rate:'From N$1,900'}], portfolio:[photos.fashion,photos.art,photos.architecture], socialLinks:['Instagram','Behance'] },
  { id:'kai', name:'Kai T.', handle:'kaimakes', role:'Visual artist', image:photos.man, bio:'Visual artist translating local textures into bold color and form.', availability:'Available', skills:['Illustration','Painting','Murals'], equipment:['Studio print setup','Drawing tablet'], services:[{name:'Commissioned artwork',rate:'From N$3,200'}], portfolio:[photos.art,photos.architecture,photos.fashion], socialLinks:['Instagram','Portfolio'] },
  { id:'mila', name:'Mila J.', handle:'mila.motion', role:'Motion designer', image:photos.woman2, bio:'Motion designer turning complex ideas into clear, playful visual stories.', availability:'Selective', skills:['Motion design','3D','Storyboarding'], equipment:['Motion workstation','Camera kit'], services:[{name:'Motion identity',rate:'Project quote'}], portfolio:[photos.architecture,photos.music,photos.ocean], socialLinks:['LinkedIn','Behance'] },
];

export const communities: Community[] = [
  { id:'frame-circle',name:'The Frame Circle',category:'Photography',image:photos.dunes,description:'A place to share frames, exchange feedback, and explore new perspectives.',purpose:'Practice together and make stronger, more intentional images.',members:128,disciplines:['Photography','Art direction'],memberPreviews:creators.slice(0,3),recentWork:[photos.dunes,photos.ocean] },
  { id:'moving-stories',name:'Moving Stories',category:'Film',image:photos.camera,description:'From first idea to final cut. Find fellow storytellers and share your process.',purpose:'Connect filmmakers across every stage of production.',members:76,disciplines:['Film','Writing','Sound'],memberPreviews:creators.slice(1,4),recentWork:[photos.camera,photos.desert] },
  { id:'studio-table',name:'The Studio Table',category:'Design',image:photos.art,description:'Bring your sketches, works in progress, and the questions behind your work.',purpose:'Make feedback feel generous, specific, and useful.',members:94,disciplines:['Design','Illustration','Motion'],memberPreviews:creators.slice(2,5),recentWork:[photos.art,photos.architecture] },
];
