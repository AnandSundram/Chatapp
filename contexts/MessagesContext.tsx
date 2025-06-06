import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Message {
  id: string;
  text: string;
  timestamp: number;
  sender: 'me' | 'them';
}

interface MessagesContextType {
  messages: { [chatId: string]: Message[] };
  sendMessage: (text: string, chatId: string, sender: 'me' | 'them') => Promise<void>;
  getMessagesForChat: (chatId: string) => Message[];
}

const MessagesContext = createContext<MessagesContextType | undefined>(undefined);

export function MessagesProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<{ [chatId: string]: Message[] }>({});

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const storedMessages = await AsyncStorage.getItem('messages');
      console.log('Loading messages from storage:', storedMessages);
      if (storedMessages) {
        const parsedMessages = JSON.parse(storedMessages);
        console.log('Parsed messages:', parsedMessages);
        setMessages(parsedMessages);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const saveMessages = async (updatedMessages: { [chatId: string]: Message[] }) => {
    try {
      console.log('Saving messages:', updatedMessages);
      await AsyncStorage.setItem('messages', JSON.stringify(updatedMessages));
    } catch (error) {
      console.error('Error saving messages:', error);
    }
  };

  const sendMessage = async (text: string, chatId: string, sender: 'me' | 'them') => {
    console.log('Sending message:', { text, chatId, sender });
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      timestamp: Date.now(),
      sender,
    };

    const currentMessages = messages[chatId] || [];
    const updatedMessages = {
      ...messages,
      [chatId]: [...currentMessages, newMessage],
    };

    console.log('Updated messages:', updatedMessages);
    setMessages(updatedMessages);
    await saveMessages(updatedMessages);
  };

  const getMessagesForChat = (chatId: string) => {
    console.log('Getting messages for chat:', chatId);
    console.log('Current messages:', messages);
    const chatMessages = messages[chatId] || [];
    console.log('Chat messages:', chatMessages);
    return chatMessages;
  };

  return (
    <MessagesContext.Provider value={{ messages, sendMessage, getMessagesForChat }}>
      {children}
    </MessagesContext.Provider>
  );
}

export function useMessages() {
  const context = useContext(MessagesContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessagesProvider');
  }
  return context;
} 