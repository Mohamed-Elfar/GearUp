import { create } from "zustand";
import { supabase, handleSupabaseError } from "../lib/supabase";

export const useChatStore = create((set) => ({
  // State
  conversations: [],
  currentConversation: null,
  messages: [],
  loadingChat: false,
  loadingMessages: false,
  errorChat: null,
  typingUsers: [],

  // Actions
  fetchConversations: async (userId) => {
    set({ loadingChat: true, errorChat: null });

    try {
      const { data, error } = await supabase
        .from("conversations")
        .select(
          `
          *,
          customer:users!conversations_customer_id_fkey(*),
          seller:users!conversations_seller_id_fkey(*)
        `
        )
        .or(`customer_id.eq.${userId},seller_id.eq.${userId}`)
        .order("created_at", { ascending: false });

      if (error) throw error;

      set({ conversations: data || [], loadingChat: false });
      return { data, error: null };
    } catch (error) {
      const errorMessage = handleSupabaseError(error);
      set({ errorChat: errorMessage, loadingChat: false });
      return { data: null, error: errorMessage };
    }
  },

  createConversation: async (customerId, sellerId) => {
    try {
      // Check if conversation already exists
      const { data: existing, error: existingError } = await supabase
        .from("conversations")
        .select("*")
        .eq("customer_id", customerId)
        .eq("seller_id", sellerId)
        .single();

      if (existingError && existingError.code !== "PGRST116") {
        throw existingError;
      }

      if (existing) {
        return { data: existing, error: null };
      }

      // Create new conversation
      const { data, error } = await supabase
        .from("conversations")
        .insert({
          customer_id: customerId,
          seller_id: sellerId,
        })
        .select(
          `
          *,
          customer:users!conversations_customer_id_fkey(*),
          seller:users!conversations_seller_id_fkey(*)
        `
        )
        .single();

      if (error) throw error;

      // Update local state
      set((state) => ({
        conversations: [data, ...state.conversations],
      }));

      return { data, error: null };
    } catch (error) {
      const errorMessage = handleSupabaseError(error);
      return { data: null, error: errorMessage };
    }
  },

  fetchMessages: async (conversationId) => {
    set({ loadingMessages: true });

    try {
      const { data, error } = await supabase
        .from("messages")
        .select(
          `
          *,
          sender:users(*)
        `
        )
        .eq("conversation_id", conversationId)
        .order("sent_at", { ascending: true });

      if (error) throw error;

      set({ messages: data || [], loadingMessages: false });
      return { data, error: null };
    } catch (error) {
      const errorMessage = handleSupabaseError(error);
      set({ loadingMessages: false });
      return { data: null, error: errorMessage };
    }
  },

  sendMessage: async (conversationId, senderId, content) => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .insert({
          conversation_id: conversationId,
          sender_id: senderId,
          content,
        })
        .select(
          `
          *,
          sender:users(*)
        `
        )
        .single();

      if (error) throw error;

      // Update local state
      set((state) => ({
        messages: [...state.messages, data],
      }));

      return { data, error: null };
    } catch (error) {
      const errorMessage = handleSupabaseError(error);
      return { data: null, error: errorMessage };
    }
  },

  setCurrentConversation: (conversation) => {
    set({ currentConversation: conversation, messages: [] });
  },

  clearCurrentConversation: () => {
    set({ currentConversation: null, messages: [] });
  },

  // Real-time subscriptions
  subscribeToMessages: (conversationId) => {
    const channel = supabase
      .channel(`messages-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {
          // Fetch the complete message with sender info
          const { data: messageWithSender } = await supabase
            .from("messages")
            .select(
              `
              *,
              sender:users(*)
            `
            )
            .eq("id", payload.new.id)
            .single();

          if (messageWithSender) {
            set((state) => ({
              messages: [...state.messages, messageWithSender],
            }));
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  },

  subscribeToConversations: (userId) => {
    const channel = supabase
      .channel(`conversations-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "conversations",
          filter: `customer_id=eq.${userId}`,
        },
        async (payload) => {
          if (payload.eventType === "INSERT") {
            // Fetch the complete conversation with user info
            const { data: conversationWithUsers } = await supabase
              .from("conversations")
              .select(
                `
                *,
                customer:users!conversations_customer_id_fkey(*),
                seller:users!conversations_seller_id_fkey(*)
              `
              )
              .eq("id", payload.new.id)
              .single();

            if (conversationWithUsers) {
              set((state) => ({
                conversations: [conversationWithUsers, ...state.conversations],
              }));
            }
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "conversations",
          filter: `seller_id=eq.${userId}`,
        },
        async (payload) => {
          if (payload.eventType === "INSERT") {
            // Fetch the complete conversation with user info
            const { data: conversationWithUsers } = await supabase
              .from("conversations")
              .select(
                `
                *,
                customer:users!conversations_customer_id_fkey(*),
                seller:users!conversations_seller_id_fkey(*)
              `
              )
              .eq("id", payload.new.id)
              .single();

            if (conversationWithUsers) {
              set((state) => ({
                conversations: [conversationWithUsers, ...state.conversations],
              }));
            }
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  },

  // Typing indicators
  setTyping: (conversationId, userId, isTyping) => {
    set((state) => {
      const updatedTyping = isTyping
        ? [
            ...state.typingUsers.filter((u) => u.userId !== userId),
            { userId, conversationId },
          ]
        : state.typingUsers.filter((u) => u.userId !== userId);

      return { typingUsers: updatedTyping };
    });
  },

  getTypingUsers: (conversationId) => {
    const { typingUsers } = useChatStore.getState();
    return typingUsers.filter((u) => u.conversationId === conversationId);
  },

  // Message status
  markMessageAsRead: async (messageId) => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .update({ read_at: new Date().toISOString() })
        .eq("id", messageId)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      const errorMessage = handleSupabaseError(error);
      return { data: null, error: errorMessage };
    }
  },

  markConversationAsRead: async (conversationId, userId) => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .update({ read_at: new Date().toISOString() })
        .eq("conversation_id", conversationId)
        .neq("sender_id", userId)
        .is("read_at", null)
        .select();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      const errorMessage = handleSupabaseError(error);
      return { data: null, error: errorMessage };
    }
  },

  // Search messages
  searchMessages: async (conversationId, searchTerm) => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select(
          `
          *,
          sender:users(*)
        `
        )
        .eq("conversation_id", conversationId)
        .ilike("content", `%${searchTerm}%`)
        .order("sent_at", { ascending: false });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      const errorMessage = handleSupabaseError(error);
      return { data: null, error: errorMessage };
    }
  },

  // Delete conversation
  deleteConversation: async (conversationId) => {
    try {
      const { error } = await supabase
        .from("conversations")
        .delete()
        .eq("id", conversationId);

      if (error) throw error;

      // Update local state
      set((state) => ({
        conversations: state.conversations.filter(
          (conv) => conv.id !== conversationId
        ),
        currentConversation:
          state.currentConversation?.id === conversationId
            ? null
            : state.currentConversation,
        messages:
          state.currentConversation?.id === conversationId
            ? []
            : state.messages,
      }));

      return { error: null };
    } catch (error) {
      const errorMessage = handleSupabaseError(error);
      return { error: errorMessage };
    }
  },

  // Clear errors
  clearError: () => {
    set({ errorChat: null });
  },
}));

// Selectors
export const useUnreadConversations = () => {
  const { conversations } = useChatStore();
  return conversations.filter((conv) => conv.has_unread); // You'd need to add this field
};

export const useConversationWithUser = (userId) => {
  const { conversations } = useChatStore();
  return conversations.find(
    (conv) => conv.customer_id === userId || conv.seller_id === userId
  );
};
