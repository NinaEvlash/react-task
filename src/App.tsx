import { useState } from 'react';
import { Modal } from './components/Modal/Modal';
import './App.css';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <main>
      <div className="container">
        <h1>React Forms</h1>

        <button onClick={openModal}>Open Modal</button>

        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <h2>Test Modal</h2>

          <p>If you can see this text, it means the portal is working correctly.</p>
        </Modal>
      </div>
    </main>
  );
}

export default App;
