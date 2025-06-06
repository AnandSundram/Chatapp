import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface Chat {
  id: string;
  name: string;
  lastMessage?: string;
  timestamp: number;
  avatar: string;
}

interface ChatsContextType {
  chats: Chat[];
  addChat: (name: string) => Promise<void>;
  getChat: (id: string) => Chat | undefined;
  updateLastMessage: (chatId: string, message: string) => Promise<void>;
}

const ChatsContext = createContext<ChatsContextType | undefined>(undefined);

export function ChatsProvider({ children }: { children: React.ReactNode }) {
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      const storedChats = await AsyncStorage.getItem('chats');
      if (storedChats) {
        setChats(JSON.parse(storedChats));
      }
    } catch (error) {
      console.error('Error loading chats:', error);
    }
  };

  const saveChats = async (updatedChats: Chat[]) => {
    try {
      await AsyncStorage.setItem('chats', JSON.stringify(updatedChats));
    } catch (error) {
      console.error('Error saving chats:', error);
    }
  };

  const addChat = async (name: string) => {
    const newChat: Chat = {
      id: Date.now().toString(),
      name,
      timestamp: Date.now(),
      avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
    };

    const updatedChats = [...chats, newChat];
    setChats(updatedChats);
    await saveChats(updatedChats);
  };

  const updateLastMessage = async (chatId: string, message: string) => {
    const updatedChats = chats.map(chat => {
      if (chat.id === chatId) {
        return {
          ...chat,
          lastMessage: message,
          timestamp: Date.now(),
        };
      }
      return chat;
    });
    setChats(updatedChats);
    await saveChats(updatedChats);
  };

  const getChat = (id: string) => {
    return chats.find(chat => chat.id === id);
  };

  return (
    <ChatsContext.Provider value={{ chats, addChat, getChat, updateLastMessage }}>
      {children}
    </ChatsContext.Provider>
  );
}

export function useChats() {
  const context = useContext(ChatsContext);
  if (context === undefined) {
    throw new Error('useChats must be used within a ChatsProvider');
  }
  return context;
} 