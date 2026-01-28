import { useState, useEffect } from 'react';

export function useBoards() {
  const [boards, setBoards] = useState(() => {
    const savedBoards = localStorage.getItem('kanbanBoards');
    return savedBoards ? JSON.parse(savedBoards) : [
      { id: 1, name: 'Моя доска' },
      { id: 2, name: 'Моя доска 2' },
      { id: 3, name: 'Моя доска 3' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('kanbanBoards', JSON.stringify(boards));
    
    const boardNames = {};
    boards.forEach(board => {
      boardNames[board.id] = board.name;
    });
    localStorage.setItem('kanbanBoardNames', JSON.stringify(boardNames));
  }, [boards]);

  const createBoard = (boardData) => {
    if (!boardData.name.trim()) return null;
    
    const newBoard = {
      id: Date.now(),
      name: boardData.name.trim()
    };

    const updatedBoards = [...boards, newBoard];
    setBoards(updatedBoards);
    
    localStorage.setItem(`kanbanLists_${newBoard.id}`, JSON.stringify([]));
    
    return newBoard;
  };

  const updateBoard = (boardId, updateData) => {
    const updatedBoards = boards.map(board => 
      board.id === boardId 
        ? { ...board, ...updateData }
        : board
    );
    setBoards(updatedBoards);
  };

  const deleteBoard = (boardId) => {
    const updatedBoards = boards.filter(board => board.id !== boardId);
    setBoards(updatedBoards);
    localStorage.removeItem(`kanbanLists_${boardId}`);
  };

  const getBoard = (boardId) => {
    return boards.find(board => board.id === boardId);
  };

  return {
    boards,
    createBoard,
    updateBoard,
    deleteBoard,
    getBoard
  };
}