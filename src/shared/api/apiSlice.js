import { createApi } from '@reduxjs/toolkit/query/react';
import axiosInstance from './axiosInstance';

const axiosBaseQuery = () => async ({ url, method, data, params }) => {
  try {
    const result = await axiosInstance({ url, method, data, params });
    return { data: result.data };
  } catch (axiosError) {
    return {
      error: {
        status: axiosError.response?.status,
        data: axiosError.response?.data || axiosError.message,
      },
    };
  }
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Board', 'List', 'Task'],
  endpoints: (builder) => ({
    getBoards: builder.query({
      query: () => ({ url: '/board/boards', method: 'GET' }),
      providesTags: ['Board'],
    }),
    createBoard: builder.mutation({
      query: (name) => ({ url: '/board/createBoard', method: 'POST', data: { name } }),
      invalidatesTags: ['Board'],
    }),
    editBoard: builder.mutation({
      query: ({ boardId, name }) => ({ url: '/board/editBoard', method: 'PUT', data: { boardId, name } }),
      invalidatesTags: ['Board'],
    }),
    deleteBoard: builder.mutation({
      query: (boardId) => ({ url: '/board/deleteBoard', method: 'DELETE', params: { boardId } }),
      invalidatesTags: ['Board'],
    }),
    getLists: builder.query({
      query: (boardId) => ({ url: '/list/list', method: 'GET', params: { boardId } }),
      providesTags: ['List'],
    }),
    createList: builder.mutation({
      query: ({ boardId, name }) => ({ url: '/list/createList', method: 'POST', data: { boardId, name } }),
      invalidatesTags: ['List'],
    }),
    editList: builder.mutation({
      query: ({ boardId, listId, name }) => ({ url: '/list/editList', method: 'PUT', data: { boardId, listId, name } }),
      invalidatesTags: ['List'],
    }),
    deleteList: builder.mutation({
      query: ({ boardId, listId }) => ({ url: '/list/deleteList', method: 'DELETE', params: { boardId, listId } }),
      invalidatesTags: ['List', 'Task'],
    }),

    getTasks: builder.query({
      query: ({ boardId, listId }) => ({ url: '/task/task', method: 'GET', params: { boardId, listId } }),
      providesTags: (result, error, { listId }) => [{ type: 'Task', id: listId }, 'Task'],
    }),
    createTask: builder.mutation({
      query: ({ listId, name }) => ({ url: '/task/createTask', method: 'POST', data: { listId, name } }),
      invalidatesTags: (result, error, { listId }) => [{ type: 'Task', id: listId }, 'Task'],
    }),
    editTask: builder.mutation({
      query: ({ boardId, listId, taskId, name, isActive }) => ({
        url: '/task/editTask',
        method: 'PUT',
        data: { boardId, listId, taskId, name, isActive }
      }),
      invalidatesTags: (result, error, { listId }) => [{ type: 'Task', id: listId }, 'Task'],
    }),
    deleteTask: builder.mutation({
      query: ({ boardId, listId, taskId }) => ({
        url: '/task/deleteTask',
        method: 'DELETE',
        params: { boardId, listId, taskId }
      }),
      invalidatesTags: (result, error, { listId }) => [{ type: 'Task', id: listId }, 'Task'],
    }),

    reorderTask: builder.mutation({
      query: ({ boardId, taskId, order, newListId }) => ({
        url: '/task/reorderTask',
        method: 'PUT',
        data: { boardId, taskId, order, newListId }
      }),
      invalidatesTags: ['Task'],
    }),

    reorderList: builder.mutation({
      query: ({ boardId, listId, order }) => ({
        url: '/list/reorderList',
        method: 'PUT',
        data: { boardId, listId, order }
      }),
      invalidatesTags: ['List'],
    }),

    reorderBoard: builder.mutation({
      query: ({ boardId, order }) => ({
        url: '/board/reorderBoard',
        method: 'PUT',
        data: { boardId, order }
      }),
      invalidatesTags: ['Board'],
    }),
  }),
});

export const {
  useGetBoardsQuery, useCreateBoardMutation, useEditBoardMutation, useDeleteBoardMutation,
  useGetListsQuery, useCreateListMutation, useEditListMutation, useDeleteListMutation,
  useGetTasksQuery, useCreateTaskMutation, useEditTaskMutation, useDeleteTaskMutation,
  useReorderTaskMutation, useReorderListMutation, useReorderBoardMutation
} = apiSlice;
