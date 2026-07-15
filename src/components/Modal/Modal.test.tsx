import { describe, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../../store/store';
import { Modal } from './Modal';

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>{' '}
    </Provider>,
  );
};

describe('Modal', () => {
  beforeEach(() => {
    const modalRoot = document.createElement('div');
    modalRoot.setAttribute('id', 'modal-root');
    document.body.append(modalRoot);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders modal content', () => {
    renderWithRouter(
      <Modal isOpen={true} onClose={vi.fn()}>
        <p>Modal content</p>
      </Modal>,
    );

    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    renderWithRouter(
      <Modal isOpen={false} onClose={vi.fn()}>
        <p>Modal content</p>
      </Modal>,
    );

    expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
  });

  it('calls onClose when close button clicked', () => {
    const onClose = vi.fn();

    renderWithRouter(
      <Modal isOpen={true} onClose={onClose}>
        <p>Modal content</p>
      </Modal>,
    );

    fireEvent.click(screen.getByRole('button'));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape pressed', () => {
    const onClose = vi.fn();

    renderWithRouter(
      <Modal isOpen={true} onClose={onClose}>
        <p>Modal content</p>
      </Modal>,
    );

    fireEvent.keyDown(document, {
      key: 'Escape',
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when overlay clicked', () => {
    const onClose = vi.fn();

    renderWithRouter(
      <Modal isOpen={true} onClose={onClose}>
        <p>Modal content</p>
      </Modal>,
    );

    const overlay = screen.getByText('Modal content').closest('.overlay');

    expect(overlay).not.toBeNull();

    if (!overlay) {
      return;
    }

    fireEvent.click(overlay);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not close when modal content clicked', () => {
    const onClose = vi.fn();

    renderWithRouter(
      <Modal isOpen={true} onClose={onClose}>
        <p>Modal content</p>
      </Modal>,
    );

    fireEvent.click(screen.getByText('Modal content'));

    expect(onClose).not.toHaveBeenCalled();
  });
});
