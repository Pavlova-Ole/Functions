import React, { useState } from 'react';
import { useAuth } from '../../features/auth/lib/useAuth';
import { BoardCard } from '../../features/boards/ui/BoardCard/BoardCard';
import { BoardModal } from '../../features/boards/ui/BoardModal/BoardModal';
import { Button } from '../../shared/ui/Button/Button';
import { ENUM_TEXT } from '../../shared/constants';
import styles from './MainPage.module.css';
import {
  useGetBoardsQuery,
  useCreateBoardMutation,
  useEditBoardMutation,
  useDeleteBoardMutation,
  useReorderBoardMutation
} from '../../shared/api/apiSlice';

const MainPage = () => {
  const { user, logout } = useAuth();
  const { data: boards = [], isLoading } = useGetBoardsQuery();

  const [createBoard] = useCreateBoardMutation();
  const [editBoard] = useEditBoardMutation();
  const [deleteBoard] = useDeleteBoardMutation();
  const [reorderBoard] = useReorderBoardMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBoardId, setEditingBoardId] = useState(null);

  const handleCreateBoard = async (boardData) => {
    if (boardData?.name?.trim()) {
      await createBoard(boardData.name.trim());
      setIsModalOpen(false);
    }
  };

  const handleEditBoard = (boardId) => {
    setEditingBoardId(boardId);
  };

  const handleSaveEdit = async (boardId, newName) => {
    if (newName.trim()) {
      await editBoard({ boardId, name: newName.trim() });
      setEditingBoardId(null);
    }
  };

  const handleDeleteBoard = async (boardId) => {
    if (window.confirm(ENUM_TEXT.BOARD_DELETE_CONFIRM)) {
      await deleteBoard(boardId);
      if (editingBoardId === boardId) {
        setEditingBoardId(null);
      }
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/auth';
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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
              <Button variant="primary" className={styles.newBoardBtn} onClick={openModal}>
                {ENUM_TEXT.BOARD_NEW}
              </Button>
              <Button variant="secondary" onClick={handleLogout} className={styles.logoutBtn}>
                Выйти
              </Button>
            </div>
          </div>
        </div>

        <BoardModal isOpen={isModalOpen} onClose={closeModal} onCreateBoard={handleCreateBoard} />

        <div className={styles.boardsContainer}>
          {isLoading ? (
             <p>Загрузка досок...</p>
          ) : (
            <div className={styles.boardsGrid}>
              {boards.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>{ENUM_TEXT.BOARD_EMPTY}</p>
                </div>
              ) : (
                boards.map((board, index) => (
                  <div
                    key={board.id}
                    draggable="true"
                    style={{ cursor: 'grab' }}
                    onDragStart={(e) => {
                      e.dataTransfer.setData('type', 'board');
                      e.dataTransfer.setData('boardId', board.id);
                      setTimeout(() => e.target.style.opacity = '0.5', 0);
                    }}
                    onDragEnd={(e) => {
                      e.target.style.opacity = '1';
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={async (e) => {
                      e.preventDefault();
                      const type = e.dataTransfer.getData('type');
                      if (type !== 'board') return;
                      
                      const draggedBoardId = e.dataTransfer.getData('boardId');
                      if (draggedBoardId && draggedBoardId !== board.id) {
                        try {
                          await reorderBoard({ 
                            boardId: draggedBoardId, 
                            order: index 
                          }).unwrap();
                        } catch (error) {
                          console.error('Ошибка сортировки досок:', error);
                        }
                      }
                    }}
                  >
                    <BoardCard
                      board={board}
                      onEdit={handleEditBoard}
                      onDelete={handleDeleteBoard}
                      onSaveEdit={handleSaveEdit}
                      isEditing={editingBoardId === board.id}
                    />
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MainPage;
