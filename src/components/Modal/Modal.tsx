import { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './Modal.css';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const activeElement = document.activeElement;

    if (activeElement instanceof HTMLElement) {
      previousFocus.current = activeElement;
    }

    return () => {
      previousFocus.current?.focus();
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  if (!isOpen) {
    return null;
  }

  const modalRoot = document.getElementById('modal-root');

  if (!modalRoot) {
    return null;
  }

  return createPortal(
    <div className="overlay" onClick={onClose}>
      <div ref={modalRef} className="modal" onClick={(event) => event.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          X
        </button>

        {children}
      </div>
    </div>,
    modalRoot,
  );
};
