import { useState } from 'react';
import { ImageOff } from 'lucide-react';

type Props = {
  src: string;
  alt: string;
  ratio?: string;
  className?: string;
  loading?: 'eager' | 'lazy';
};

export default function ImageWithFallback({ src, alt, ratio = 'auto', className = '', loading = 'lazy' }: Props) {
  const [failed, setFailed] = useState(false);
  return <span className={`ui-image ${className}`} style={{ aspectRatio: ratio }}>
    {failed
      ? <span className="ui-image-fallback" role="img" aria-label={`${alt} unavailable`}><ImageOff aria-hidden="true" /><small>Creative Circle</small></span>
      : <img src={src} alt={alt} loading={loading} onError={() => setFailed(true)} />}
  </span>;
}
