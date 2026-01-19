import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MainPage.css';

const MainPage = () => {
  const [boards, setBoards] = useState(() => {
    const savedBoards = localStorage.getItem('kanbanBoards');
    return savedBoards ? JSON.parse(savedBoards) : [
      { id: 1, name: 'Моя доска' },
      { id: 2, name: 'Моя доска 2' },
      { id: 3, name: 'Моя доска 3' }
    ];
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [editingBoardId, setEditingBoardId] = useState(null);
  const [editBoardName, setEditBoardName] = useState('');

  useEffect(() => {
    localStorage.setItem('kanbanBoards', JSON.stringify(boards));
   
    const boardNames = {};
    boards.forEach(board => {
      boardNames[board.id] = board.name;
    });
    localStorage.setItem('kanbanBoardNames', JSON.stringify(boardNames));
  }, [boards]);

  const handleCreateBoard = () => {
    if (newBoardName.trim()) {
      const newBoard = {
        id: Date.now(),
        name: newBoardName
      };
      setBoards([...boards, newBoard]);
      
      localStorage.setItem(`kanbanLists_${newBoard.id}`, JSON.stringify([]));
      
      setNewBoardName('');
      setIsModalOpen(false);
    }
  };

  const handleEditBoard = (boardId, currentName) => {
    setEditingBoardId(boardId);
    setEditBoardName(currentName);
  };

  const handleSaveEdit = (boardId) => {
    if (editBoardName.trim()) {
      const updatedBoards = boards.map(board => 
        board.id === boardId ? { ...board, name: editBoardName } : board
      );
      setBoards(updatedBoards);
      setEditingBoardId(null);
      setEditBoardName('');
    }
  };

  const handleDeleteBoard = (boardId) => {
    if (window.confirm('Вы уверены, что хотите удалить эту доску?')) {
      const updatedBoards = boards.filter(board => board.id !== boardId);
      setBoards(updatedBoards);
      
      localStorage.removeItem(`kanbanLists_${boardId}`);
    }
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
    setTimeout(() => {
      const input = document.querySelector('.modal-content .input-field');
      if (input) input.focus();
    }, 100);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewBoardName('');
  };

  return (
    <div className="main-page">
      <header className="header">
        <div className="header-content">
          <div></div>
        </div>
      </header>

      <main className="main-content">
        <div className="page-header-container">
          <div className="page-header-content">
            <div className="page-header">
              <h1>Мои доски</h1>
              <button 
                className="btn btn-primary new-board-btn"
                onClick={openModal}
              >
                Новая доска
              </button>
            </div>
          </div>
        </div>

        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Создание новой доски</h3>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="input-field"
                  placeholder="Название доски"
                  value={newBoardName}
                  onChange={(e) => setNewBoardName(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, handleCreateBoard)}
                  autoFocus
                />
              </div>
              <div className="modal-footer">
                <button 
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  Отмена
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={handleCreateBoard}
                >
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="boards-container">
          <div className="boards-grid">
            {boards.length === 0 ? (
              <div className="empty-state">
                <p>У вас пока нет досок. Создайте первую!</p>
              </div>
            ) : (
              boards.map(board => (
                <div key={board.id} className="board-card">
                  {editingBoardId === board.id ? (
                    <div className="board-edit-form">
                      <input
                        type="text"
                        className="input-field"
                        value={editBoardName}
                        onChange={(e) => setEditBoardName(e.target.value)}
                        onKeyPress={(e) => handleKeyPress(e, () => handleSaveEdit(board.id))}
                        autoFocus
                      />
                      <div className="edit-actions">
                        <button 
                          className="btn btn-secondary btn-small"
                          onClick={() => setEditingBoardId(null)}
                        >
                          Отмена
                        </button>
                        <button 
                          className="btn btn-primary btn-small"
                          onClick={() => handleSaveEdit(board.id)}
                        >
                          Сохранить
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="board-header">
                        <Link to={`/boards/${board.id}`} className="board-title">
                          {board.name}
                        </Link>
                        <div className="board-actions">
                          <button 
                            className="btn-icon"
                            onClick={() => handleEditBoard(board.id, board.name)}
                            title="Редактировать"
                          >
                            ✏️
                          </button>
                          <button 
                            className="btn-icon"
                            onClick={() => handleDeleteBoard(board.id)}
                            title="Удалить"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                      <div className="board-footer">
                        <span className="board-info">Нажмите для открытия</span>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainPage;