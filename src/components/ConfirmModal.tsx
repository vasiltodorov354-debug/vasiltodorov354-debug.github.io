import { PrimaryButton, SecondaryButton } from './Ui';

type ConfirmModalProps = {
  title: string;
  description: string;
  isOpen: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export const ConfirmModal = ({
  title,
  description,
  isOpen,
  onConfirm,
  onClose,
}: ConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-card p-6">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <p className="mt-2 text-sm text-slate-300">{description}</p>
        <div className="mt-6 flex justify-end gap-3">
          <SecondaryButton onClick={onClose}>Отказ</SecondaryButton>
          <PrimaryButton onClick={onConfirm}>Потвърди</PrimaryButton>
        </div>
      </div>
    </div>
  );
};
