import { ArrowRight } from 'lucide-react';
import { creators } from './data';
import './welcome.css';

export default function Welcome({ onStart }: { onStart: () => void }) {
  const orbit = [...creators, ...creators, creators[2]];
  return <main className="welcome">
    <div className="welcome-art" aria-label="Sample portraits representing a circle of creatives">
      <div className="orbit-lines" aria-hidden="true"><i /><i /><i /></div>
      {orbit.map((creator, index) => <img key={`${creator.handle}-${index}`} className={`orbit-face face-${index + 1}`} src={creator.image} alt={`Sample portrait: ${creator.role}`} />)}
    </div>
    <section className="welcome-copy">
      <div><h1>Creative Circle</h1><p className="welcome-intro">Create moments. Share stories.</p></div>
      <button className="welcome-cta" onClick={onStart}>Get started <ArrowRight size={18} /></button>
      <p className="welcome-note">UI preview · sample people and content</p>
    </section>
  </main>;
}
