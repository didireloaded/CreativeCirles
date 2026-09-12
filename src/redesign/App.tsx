import { useCallback, useEffect, useState } from 'react';
import { Compass, Home as HomeIcon, Inbox as InboxIcon, Plus, Bell, Sparkles, ListTodo } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import Welcome from './Welcome'; import Home from './Home'; import Discover from './Discover'; import Inbox from './Inbox'; import Profile from './Profile'; import Workspace from './Workspace'; import CreateFlow from './CreateFlow'; import Tasks from './tasks/Tasks';
import OnboardingFlow from './onboarding/OnboardingFlow';
import { defaultOnboardingProfile, persistOnboarding, readOnboarding, type OnboardingProfile } from './onboarding/model';
import type { Page, ScreenProps } from './types';
import NotificationPanel, { type NotificationItem } from './details/NotificationPanel';
import PwaStatus from './pwa/PwaStatus';
import type { TaskDraft } from './tasks/model';
import { DomainProvider } from './domain/DomainProvider';
import { isSecondaryPage, pathPage } from './routing';
import ToolsHub from './tools/ToolsHub';
import Jobs from './jobs/Jobs';
import TalentFinder from './talent/TalentFinder';

const notificationItems: NotificationItem[] = [
 {id:'comment-amara',group:'Today',title:'Amara commented on your project',detail:'“The quieter frame really holds the story.”',time:'12 min',type:'comment'},
 {id:'collab-leo',group:'Today',title:'Leo sent a collaboration idea',detail:'A short film about creative rituals.',time:'1 hr',type:'collaboration'},
 {id:'project-review',group:'Earlier',title:'A project milestone is ready',detail:'Editorial sequence moved into review.',time:'Yesterday',type:'project'},
];

export default function App(){
 const router=useNavigate(), location=useLocation();
 const [profile,setProfile]=useState<OnboardingProfile>(()=>readOnboarding());
 const [entry,setEntry]=useState<'welcome'|'onboarding'|'app'>(()=>{const saved=readOnboarding();if(saved.completed)return'app';return sessionStorage.getItem('circle:entered')==='1'||location.pathname!=='/'?'onboarding':'welcome'});
 const [create,setCreate]=useState<'create'|'drafts'|null>(null); const [pendingTaskDraft,setPendingTaskDraft]=useState<TaskDraft|null>(null); const [notificationsOpen,setNotificationsOpen]=useState(false); const [toast,setToast]=useState(''); const [navCompact,setNavCompact]=useState(false); const page=pathPage(location.pathname);
 useEffect(()=>{if(entry!=='app')return; if(location.pathname==='/'||location.pathname.startsWith('/onboarding')) router('/home',{replace:true})},[entry,location.pathname,router]);
 useEffect(()=>{if(!toast)return;const timer=setTimeout(()=>setToast(''),2800);return()=>clearTimeout(timer)},[toast]);
 useEffect(()=>{let previous=window.scrollY;let ticking=false;const onScroll=()=>{if(ticking)return;ticking=true;requestAnimationFrame(()=>{const current=window.scrollY;if(current>previous+5)setNavCompact(true);else if(current<previous-5)setNavCompact(false);previous=current;ticking=false})};window.addEventListener('scroll',onScroll,{passive:true});return()=>window.removeEventListener('scroll',onScroll)},[]);
 const navigate=(next:Page)=>{router(`/${next}`);window.scrollTo({top:0,behavior:'smooth'})};
 const finishOnboarding=(next:OnboardingProfile)=>{persistOnboarding(next);setProfile(next);sessionStorage.setItem('circle:entered','1');setEntry('app');router('/home')};
 const skipOnboarding=()=>finishOnboarding({...defaultOnboardingProfile,completed:true,role:'Multidisciplinary',interests:['Photography','Film','Design'],displayName:'Jordan K.',handle:'jordan.creates',bio:'Visual storyteller. Finding quiet frames in loud places.'});
 const editPreferences=()=>{setEntry('onboarding');router('/onboarding/role')};
 const openTaskDraft=(draft:TaskDraft)=>{setPendingTaskDraft(draft);navigate('tasks')};
 const consumeTaskDraft=useCallback(()=>setPendingTaskDraft(null),[]);
 const props:ScreenProps={notify:setToast,navigate,openCreate:()=>setCreate('create'),openDrafts:()=>setCreate('drafts'),profile,editPreferences,openNotifications:()=>setNotificationsOpen(true),openTaskDraft};
 const navigation=[{p:'home' as Page,n:'Home',i:<HomeIcon/>},{p:'discover' as Page,n:'Discover',i:<Compass/>},{p:'create' as const,n:'Create',i:<Plus/>},{p:'tasks' as Page,n:'Tasks',i:<ListTodo/>},{p:'inbox' as Page,n:'Inbox',i:<InboxIcon/>}];
 if(entry==='welcome')return <Welcome onStart={()=>{sessionStorage.setItem('circle:entered','1');setEntry('onboarding');router('/onboarding/role')}}/>;
 if(entry==='onboarding')return <OnboardingFlow initialProfile={profile} onComplete={finishOnboarding} onSkip={skipOnboarding} onCancel={profile.completed?()=>{setEntry('app');router('/profile')}:undefined}/>;
 return <div className={`app-shell page-${page} ${create?'create-open':''}`}><aside className="side-nav"><button className="brand" onClick={()=>navigate('home')} aria-label="Creative Circle home"><i/> <span>Creative<br/>Circle</span></button><nav aria-label="Primary navigation">{navigation.map(x=><button key={x.n} aria-label={x.n} aria-expanded={x.p==='create'?Boolean(create):undefined} className={`${x.p===page?'active':''} ${x.p==='create'?'create-nav':''}`} aria-current={x.p===page?'page':undefined} onClick={()=>x.p==='create'?setCreate('create'):navigate(x.p)}>{x.i}<span>{x.n}</span></button>)}</nav><button className={`workspace-nav ${page==='workspace'?'active':''}`} onClick={()=>navigate('workspace')}><Sparkles/><span>My workspace</span></button><div className="side-person"><button className="side-profile" onClick={()=>navigate('profile')} aria-label="Open your profile"><img src={profile.avatarDataUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"} alt=""/><span><b>{profile.displayName || 'Jordan K.'}</b><small>@{profile.handle || 'jordan.creates'}</small></span></button><button onClick={()=>setNotificationsOpen(true)} aria-label="Notifications"><Bell/></button></div></aside>
 <div className="mobile-brand"><button className="brand" onClick={()=>navigate('home')} aria-label="Creative Circle home"><i/><span>Creative Circle</span></button><div className="mobile-brand-actions"><button className="mobile-profile" onClick={()=>navigate('profile')} aria-label="Open your profile"><img src={profile.avatarDataUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"} alt=""/></button><button onClick={()=>setNotificationsOpen(true)} className="icon-button" aria-label="Notifications"><Bell/></button></div></div>
 <PwaStatus/><div className="preview-banner" role="note">UI preview <span>Sample content · local interactions</span></div>
 <div className="app-content"><DomainProvider>{page==='home'?<Home {...props}/>:page==='discover'?<Discover {...props}/>:page==='tasks'?<Tasks notify={setToast} profile={profile} pendingDraft={pendingTaskDraft} onDraftConsumed={consumeTaskDraft}/>:page==='inbox'?<Inbox {...props}/>:page==='profile'?<Profile {...props}/>:page==='workspace'?<Workspace {...props}/>:page==='jobs'?<Jobs notify={setToast} navigate={navigate}/>:page==='talent'?<TalentFinder notify={setToast} navigate={navigate}/>:isSecondaryPage(page)?<ToolsHub navigate={navigate} goBack={()=>router(-1)}/>:<Workspace {...props}/>}</DomainProvider></div>
 <nav className={`bottom-nav ${navCompact?'is-compact':''}`} aria-label="Primary navigation">{navigation.map(x=><button key={x.n} aria-label={x.n} aria-expanded={x.p==='create'?Boolean(create):undefined} className={`${x.p===page?'active':''} ${x.p==='create'?'create-nav':''}`} aria-current={x.p===page?'page':undefined} onClick={()=>x.p==='create'?setCreate('create'):navigate(x.p)}>{x.i}<span>{x.n}</span></button>)}</nav>
 {create&&<CreateFlow initialDrafts={create==='drafts'} onClose={()=>setCreate(null)} notify={setToast}/>}<NotificationPanel open={notificationsOpen} items={notificationItems} onClose={()=>setNotificationsOpen(false)}/>{toast&&<div className="toast" role="status">{toast}</div>}</div>
}
