import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import MediaPreview, { validateMediaFile } from '../components/MediaPreview';

describe('local media previews', () => {
  it('accepts supported files and rejects unsupported files', () => {
    expect(validateMediaFile(new File(['x'], 'work.txt', { type: 'text/plain' }))).toEqual({ ok: false, message: 'Choose an image, video, or audio file.' });
    expect(validateMediaFile(new File(['x'], 'frame.jpg', { type: 'image/jpeg' }))).toEqual({ ok: true, kind: 'image' });
  });

  it('enforces media-specific file limits', () => {
    const oversizedImage = new File([new Uint8Array(15 * 1024 * 1024 + 1)], 'large.jpg', { type: 'image/jpeg' });
    expect(validateMediaFile(oversizedImage)).toEqual({ ok: false, message: 'Images must be 15 MB or smaller.' });
  });

  it('revokes an object URL when the preview is removed', () => {
    const create = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:preview');
    const revoke = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined);
    const file = new File(['image'], 'frame.jpg', { type: 'image/jpeg' });
    const { rerender } = render(<MediaPreview file={file} onRemove={vi.fn()} onReplace={vi.fn()} />);
    rerender(<MediaPreview file={null} onRemove={vi.fn()} onReplace={vi.fn()} />);
    expect(create).toHaveBeenCalledWith(file);
    expect(revoke).toHaveBeenCalledWith('blob:preview');
  });
});
