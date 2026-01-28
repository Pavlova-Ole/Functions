import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../../../shared/ui/Button/Button';
import { Input } from '../../../../shared/ui/Input/Input';
import { IconButton } from '../../../../shared/ui/IconButton/IconButton';
import styles from './BoardCard.module.css';
import { EditIcon, DeleteIcon } from '../../../../shared/ui/Icon/index';

export const BoardCard = ({ 
  board, 
  onEdit, 
  onDelete, 
  onSaveEdit,
  isEditing = false
}) => {
  const [editName, setEditName] = useState(board.name);

  const handleSave = () => {
    if (editName.trim()) {
      onSaveEdit(board.id, editName.trim());
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSave();
  };

  const handleCardClick = (e) => {

    if (e.target.closest(`.${styles.boardActions}`)) {
      return;
    }
  };
  const handleIconClick = (e, action) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    action();
  };

  if (isEditing) {
    return (
      <div className={styles.boardCard}>
        <div className={styles.boardEditForm}>
          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onKeyPress={handleKeyPress}
            autoFocus
            fullWidth
          />
          <div className={styles.editActions}>
            <Button 
              variant="secondary"
              onClick={() => onEdit(null)}
              className={styles.btnSmall}
            >
              Отмена
            </Button>
            <Button 
              variant="primary"
              onClick={handleSave}
              className={styles.btnSmall}
            >
              Сохранить
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link 
      to={`/boards/${board.id}`} 
      className={styles.boardCardLink}
      onClick={handleCardClick}
    >
      <div className={styles.boardCard}>
        <div className={styles.boardHeader}>
          <h3 className={styles.boardTitle}>{board.name}</h3>
          <div className={styles.boardActions}>
          <IconButton 
              onClick={(e) => handleIconClick(e, () => onEdit(board.id))} 
              title="Редактировать"
            >
              <EditIcon size={18} />
            </IconButton>

            <IconButton 
              onClick={(e) => handleIconClick(e, () => onDelete(board.id))} 
              title="Удалить"
            >
              <DeleteIcon size={18} />
          </IconButton>
          </div>
        </div>
        <div className={styles.boardFooter}>
          <span className={styles.boardInfo}>Нажмите для открытия</span>
        </div>
      </div>
    </Link>
  );
};