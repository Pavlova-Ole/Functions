import React, { useState } from 'react';
import { Modal } from '../../../../shared/ui/Modal/Modal';
import { Input } from '../../../../shared/ui/Input/Input';
import { Button } from '../../../../shared/ui/Button/Button';
import styles from './BoardModal.module.css';

export const BoardModal = ({ isOpen, onClose, onCreateBoard }) => {
  const [boardName, setBoardName] = useState('');

  const handleSubmit = () => {
    if (boardName.trim()) {
      onCreateBoard({ name: boardName.trim() });
      setBoardName('');
      onClose();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Создание новой доски"
    >
      <div className={styles.modalBody}>
        <Input
          type="text"
          placeholder="Название доски"
          value={boardName}
          onChange={(e) => setBoardName(e.target.value)}
          onKeyPress={handleKeyPress}
          autoFocus
          fullWidth
        />
      </div>
      <div className={styles.modalFooter}>
        <Button variant="secondary" onClick={onClose}>
          Отмена
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Сохранить
        </Button>
      </div>
    </Modal>
  );
};