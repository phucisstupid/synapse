import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;

  createConversation: () => string;
  deleteConversation: (id: string) => void;
  setActiveConversation: (id: string | null) => void;
  addMessage: (
    conversationId: string,
    message: Omit<Message, "id" | "timestamp">,
  ) => string;
  updateMessage: (
    conversationId: string,
    messageId: string,
    content: string,
  ) => void;
  getActiveConversation: () => Conversation | undefined;
  clearConversations: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeConversationId: null,

      createConversation: () => {
        const id = crypto.randomUUID();
        const conversation: Conversation = {
          id,
          title: "New Chat",
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set((state) => ({
          conversations: [conversation, ...state.conversations],
          activeConversationId: id,
        }));
        return id;
      },

      deleteConversation: (id) =>
        set((state) => ({
          conversations: state.conversations.filter((c) => c.id !== id),
          activeConversationId:
            state.activeConversationId === id
              ? null
              : state.activeConversationId,
        })),

      setActiveConversation: (id) => set({ activeConversationId: id }),

      addMessage: (conversationId, message) => {
        const messageId = crypto.randomUUID();
        const newMessage: Message = {
          ...message,
          id: messageId,
          timestamp: Date.now(),
        };

        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  messages: [...c.messages, newMessage],
                  updatedAt: Date.now(),
                  title:
                    c.messages.length === 0 && message.role === "user"
                      ? message.content.slice(0, 50) +
                        (message.content.length > 50 ? "..." : "")
                      : c.title,
                }
              : c,
          ),
        }));

        return messageId;
      },

      updateMessage: (conversationId, messageId, content) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === messageId ? { ...m, content } : m,
                  ),
                }
              : c,
          ),
        })),

      getActiveConversation: () => {
        const state = get();
        return state.conversations.find(
          (c) => c.id === state.activeConversationId,
        );
      },

      clearConversations: () =>
        set({ conversations: [], activeConversationId: null }),
    }),
    {
      name: "synapse-chat",
    },
  ),
);
