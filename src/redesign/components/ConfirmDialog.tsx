import BottomSheet from './BottomSheet';

type Props = { open: boolean; title: string; description: string; actionLabel: string; onConfirm: () => void; onClose: () => void };

export default function ConfirmDialog({ open, title, description, actionLabel, onConfirm, onClose }: Props) {
  return <BottomSheet open={open} title={title} onClose={onClose} className="ui-confirm">
    <p>{description}</p>
    <div className="ui-confirm-actions"><button className="button secondary" onClick={onClose}>Cancel</button><button className="button ui-danger" onClick={onConfirm}>{actionLabel}</button></div>
  </BottomSheet>;
}
