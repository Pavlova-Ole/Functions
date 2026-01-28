import React, { useState } from 'react';
import { useBoards } from '../../features/boards/lib/useBoards';
import { BoardCard } from '../../features/boards/ui/BoardCard/BoardCard';
import { BoardModal } from '../../features/boards/ui/BoardModal/BoardModal';
import { Button } from '../../shared/ui/Button/Button';
import styles from './MainPage.module.css';

const MainPage = () => {
  const { boards, createBoard, updateBoard, deleteBoard } = useBoards();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBoardId, setEditingBoardId] = useState(null);

  const handleCreateBoard = (boardData) => {
    createBoard(boardData);
  };

  const handleEditBoard = (boardId) => {
    setEditingBoardId(boardId);
  };

  const handleSaveEdit = (boardId, newName) => {
    updateBoard(boardId, { name: newName });
    setEditingBoardId(null);
  };

  const handleDeleteBoard = (boardId) => {
    if (window.confirm('Вы уверены, что хотите удалить эту доску?')) {
      deleteBoard(boardId);
      if (editingBoardId === boardId) {
        setEditingBoardId(null);
      }
    }
  };

  return (
    <div className={styles.mainPage}>
      <main className={styles.mainContent}>
        <div className={styles.pageHeaderContainer}>
          <div className={styles.pageHeader}>
            <h1>Мои доски</h1>
            <Button 
              variant="primary"
              className={styles.newBoardBtn}
              onClick={() => setIsModalOpen(true)}
            >
              Новая доска
            </Button>
          </div>
        </div>

        <BoardModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreateBoard={handleCreateBoard}
        />

        <div className={styles.boardsContainer}>
          <div className={styles.boardsGrid}>
            {boards.length === 0 ? (
              <div className={styles.emptyState}>
                <p>У вас пока нет досок. Создайте первую!</p>
              </div>
            ) : (
              boards.map(board => (
                <BoardCard
                  key={board.id}
                  board={board}
                  onEdit={handleEditBoard}
                  onDelete={handleDeleteBoard}
                  onSaveEdit={handleSaveEdit}
                  isEditing={editingBoardId === board.id}
                />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainPage;