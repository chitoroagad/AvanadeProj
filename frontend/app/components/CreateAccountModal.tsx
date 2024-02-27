import React, { ReactNode } from 'react';
import styles from './CreateAccountModal.module.css'; 

interface ModalProps {
  show: boolean;

  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ show, children }) => {
  if (!show) {
    return null;
  }

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        {children}
      </div>
    </div>
  );
};

export default Modal;
