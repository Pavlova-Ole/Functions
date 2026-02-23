import React, { useState } from 'react';
import { Button } from '../../../../shared/ui/Button/Button';
import { Input } from '../../../../shared/ui/Input/Input';
import styles from './AddListButton.module.css';

export const AddListButton = ({ onCreateList }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [listName, setListName] = useState('');

  const handleCreate = () => {
    if (listName.trim()) {
      onCreateList(listName.trim());
      setListName('');
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    setListName('');
    setIsCreating(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleCreate();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isCreating) {
    return (
      <div className={styles.newListForm}>
        <Input
          type="text"
          placeholder="Введите название списка..."
          value={listName}
          onChange={(e) => setListName(e.target.value)}
          onKeyPress={handleKeyDown}
          autoFocus
          fullWidth
        />
        <div className={styles.formActions}>
          <Button 
            variant="primary"
            onClick={handleCreate}
            disabled={!listName.trim()}
          >
            Сохранить
          </Button>
          <Button 
            variant="secondary"
            onClick={handleCancel}
          >
            Отмена
          </Button>
        </div>
      </div>
    );
  }

  return (
    <button 
      className={styles.addListButton}
      onClick={() => setIsCreating(true)}
    >
      <span>Добавить список</span>
    </button>
  );
};