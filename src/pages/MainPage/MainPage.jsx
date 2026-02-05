import React, { useState } from 'react';
import { useBoards } from '../../features/boards/lib/useBoards';
import { useAuth } from '../../features/auth/lib/useAuth';
import { BoardCard } from '../../features/boards/ui/BoardCard/BoardCard';
import { BoardModal } from '../../features/boards/ui/BoardModal/BoardModal';
import { Button } from '../../shared/ui/Button/Button';
import { ENUM_TEXT } from '../../shared/constants';
import styles from './MainPage.module.css';

const MainPage = () => {
  const { boards, createBoard, updateBoard, deleteBoard } = useBoards();
  const { user, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBoardId, setEditingBoardId] = useState(null);

  const handleCreateBoard = (boardData) => {
    if (boardData?.name?.trim()) {
      createBoard(boardData);
      setIsModalOpen(false);
    }
  };

  const handleEditBoard = (boardId) => {
    setEditingBoardId(boardId);
  };

  const handleSaveEdit = (boardId, newName) => {
    if (newName.trim()) {
      updateBoard(boardId, { name: newName.trim() });
      setEditingBoardId(null);
    }
  };

  const handleDeleteBoard = (boardId) => {
    if (window.confirm(ENUM_TEXT.BOARD_DELETE_CONFIRM)) {
      deleteBoard(boardId);
      if (editingBoardId === boardId) {
        setEditingBoardId(null);
      }
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/auth';
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.mainPage}>
      <main className={styles.mainContent}>
        <div className={styles.pageHeaderContainer}>
          <div className={styles.pageHeader}>
            <div>
              <h1>{ENUM_TEXT.BOARD_MY_BOARDS}</h1>
              {user && (
                <p className={styles.userWelcome}>
                  Привет, {user.name || user.email || 'Пользователь'}!
                </p>
              )}
            </div>
            
            <div className={styles.headerActions}>
              <Button 
                variant="primary"
                className={styles.newBoardBtn}
                onClick={openModal}
              >
                {ENUM_TEXT.BOARD_NEW}
              </Button>
              
              <Button 
                variant="secondary"
                onClick={handleLogout}
                className={styles.logoutBtn}
              >
                Выйти
              </Button>
            </div>
          </div>
        </div>

        <BoardModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onCreateBoard={handleCreateBoard}
        />

        <div className={styles.boardsContainer}>
          <div className={styles.boardsGrid}>
            {boards.length === 0 ? (
              <div className={styles.emptyState}>
                <p>{ENUM_TEXT.BOARD_EMPTY}</p>
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