import { createSlice, nanoid } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
}

interface ChatState {
  messages: ChatMessage[];
}

const initialState: ChatState = {
  messages: [],
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: {
      prepare: (
        msg: Omit<ChatMessage, 'id' | 'createdAt'> & { id?: string }
      ) => ({
        payload: {
          id: msg.id ?? nanoid(),
          role: msg.role,
          content: msg.content,
          createdAt: Date.now(),
        } as ChatMessage,
      }),
      reducer: (state, action: PayloadAction<ChatMessage>) => {
        state.messages.push(action.payload);
      },
    },
    updateMessageContent: (
      state,
      action: PayloadAction<{ id: string; content: string }>
    ) => {
      const m = state.messages.find((x) => x.id === action.payload.id);
      if (m) m.content = action.payload.content;
    },
    appendMessageContent: (
      state,
      action: PayloadAction<{ id: string; chunk: string }>
    ) => {
      const m = state.messages.find((x) => x.id === action.payload.id);
      if (m) m.content = (m.content ?? '') + action.payload.chunk;
    },
    clearMessages(state) {
      state.messages = [];
    },
  },
});

export const {
  addMessage,
  updateMessageContent,
  appendMessageContent,
  clearMessages,
} = chatSlice.actions;

export default chatSlice.reducer;

// Selectors
export const selectMessages = (s: { chat: ChatState }) => s.chat.messages;
