import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Modal } from './components/Modal/Modal';
import './App.css';
import { UncontrolledForm } from './components/Forms/UncontrolledForm';
import { HookForm } from './components/Forms/HookForm';
import { RootState } from './store/store';
import { Card } from './components/Card/Card';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formType, setFormType] = useState<'uncontrolled' | 'rhf' | null>(null);
  const submissions = useSelector((state: RootState) => state.forms.submissions);

  const openModal = (type: 'uncontrolled' | 'rhf') => {
    setFormType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormType(null);
  };

  return (
    <main>
      <div className="container">
        <h1>React Forms</h1>

        <button className="left-button" onClick={() => openModal('uncontrolled')}>
          Uncontrolled Form
        </button>

        <button className="right-button" onClick={() => openModal('rhf')}>
          React Hook Form
        </button>

        <div className="cards">
          {submissions.map((item) => (
            <Card key={item.id} {...item} />
          ))}
        </div>

        <Modal isOpen={isModalOpen} onClose={closeModal}>
          {formType === 'uncontrolled' && <UncontrolledForm onClose={closeModal} />}
          {formType === 'rhf' && <HookForm onClose={closeModal} />}
        </Modal>
      </div>
    </main>
  );
}

export default App;
