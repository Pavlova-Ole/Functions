import { useState, useEffect } from 'react';
import { useLocalStorage } from '../../../shared/lib/hooks/useLocalStorage';
import { ENUM_TEXT } from '../../../shared/constants';

export function useBoards() {
  const [boards, setBoards] = useLocalStorage('kanbanBoards', [
    { id: 1, name: ENUM_TEXT.TEST_BOARD_1 },
    { id: 2, name: ENUM_TEXT.TEST_BOARD_2 },
    { id: 3, name: ENUM_TEXT.TEST_BOARD_3 }
  ]);

  const [isLoading, setIsLoading] = useState(true);

 
  useEffect(() => {
    const initializeBoardData = () => {
      boards.forEach(board => {
        const boardListsKey = `boardLists_${board.id}`;
        const existingLists = localStorage.getItem(boardListsKey);
        
        if (!existingLists && board.id === 1) {
          const initialLists = [
            { 
              id: 1, 
              name: ENUM_TEXT.LIST_1, 
              tasks: [
                { id: 1, text: ENUM_TEXT.TASK_FIRST, active: true },
                { id: 2, text: ENUM_TEXT.TASK_SECOND, active: true }
              ]
            },
            { 
              id: 2, 
              name: ENUM_TEXT.LIST_2, 
              tasks: [
                { id: 3, text: ENUM_TEXT.TASK_THIRD, active: true }
              ]
            },
            { 
              id: 3, 
              name: ENUM_TEXT.LIST_3, 
              tasks: [] 
            }
          ];
          
          localStorage.setItem(boardListsKey, JSON.stringify(initialLists));
        } else if (!existingLists) {
          localStorage.setItem(boardListsKey, JSON.stringify([]));
        }
      });
    };

    initializeBoardData();
    setIsLoading(false);
  }, []);

  const createBoard = (boardData) => {
    if (!boardData.name.trim()) return null;
    
    const newBoard = {
      id: Date.now(),
      name: boardData.name.trim()
    };

    const updatedBoards = [...boards, newBoard];
    setBoards(updatedBoards);
    
    localStorage.setItem(`boardLists_${newBoard.id}`, JSON.stringify([]));
    
    const boardNames = JSON.parse(localStorage.getItem('boardNames') || '{}');
    boardNames[newBoard.id] = newBoard.name;
    localStorage.setItem('boardNames', JSON.stringify(boardNames));
    
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
   
    localStorage.removeItem(`boardLists_${boardId}`);
    
    const boardNames = JSON.parse(localStorage.getItem('boardNames') || '{}');
    delete boardNames[boardId];
    localStorage.setItem('boardNames', JSON.stringify(boardNames));
  };

  const getBoard = (boardId) => {
    return boards.find(board => board.id === boardId);
  };

  return {
    boards,
    createBoard,
    updateBoard,
    deleteBoard,
    getBoard,
    isLoading
  };
}