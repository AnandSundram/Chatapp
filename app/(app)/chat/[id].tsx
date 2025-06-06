import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, FlatList, Keyboard, Platform, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Avatar, Divider, IconButton, Surface, Text, TextInput, useTheme } from 'react-native-paper';
import { useChats } from '../../../contexts/ChatsContext';
import { useMessages } from '../../../contexts/MessagesContext';

// Predefined bot responses
const BOT_RESPONSES = [
  "That's interesting! Tell me more.",
  "I understand what you mean.",
  "How does that make you feel?",
  "That's a great point!",
  "I'm here to help.",
  "Let's explore that further.",
  "What are your thoughts on that?",
  "That's a fascinating perspective.",
  "I'm listening.",
  "Could you elaborate on that?",
];

export default function ChatRoomScreen() {
  const { id } = useLocalSearchParams();
  const [message, setMessage] = useState('');
  const flatListRef = useRef(null);
  const inputRef = useRef(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const { messages, sendMessage, getMessagesForChat } = useMessages();
  const { chats, getChat, updateLastMessage } = useChats();
  const chat = getChat(id as string);
  const theme = useTheme();

  const chatMessages = getMessagesForChat(id as string);

  // Debug logs
  useEffect(() => {
    console.log('Chat Screen - Current chat ID:', id);
    console.log('Chat Screen - All messages:', messages);
    console.log('Chat Screen - Chat messages:', chatMessages);
    console.log('Chat Screen - Current chat:', chat);
  }, [id, messages, chatMessages, chat]);

  // Animation values
  const typingAnimation = useRef(new Animated.Value(0)).current;
  const messageAnimations = useRef({}).current;

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );
    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (flatListRef.current && chatMessages.length > 0) {
      console.log('Scrolling to bottom, messages count:', chatMessages.length);
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [chatMessages]);

  // Typing animation
  useEffect(() => {
    if (isTyping) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(typingAnimation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(typingAnimation, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      typingAnimation.setValue(0);
    }
  }, [isTyping]);

  const handleSendMessage = async () => {
    if (message.trim()) {
      try {
        console.log('Sending message:', message);
        // Send user message
        await sendMessage(message.trim(), id as string, 'me');
        // Update last message in chat list
        await updateLastMessage(id as string, message.trim());
        console.log('Message sent successfully');
        setMessage('');
        Keyboard.dismiss();

        // Show typing indicator
        setIsTyping(true);

        // Simulate bot response after a short delay
        setTimeout(async () => {
          setIsTyping(false);
          const randomResponse = BOT_RESPONSES[Math.floor(Math.random() * BOT_RESPONSES.length)];
          console.log('Sending bot response:', randomResponse);
          await sendMessage(randomResponse, id as string, 'them');
          // Update last message with bot response
          await updateLastMessage(id as string, randomResponse);
          console.log('Bot response sent successfully');
        }, 2000);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleKeyPress = (e: any) => {
    if (e.nativeEvent.key === 'Enter' && !e.nativeEvent.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getMessageAnimation = (messageId: string) => {
    if (!messageAnimations[messageId]) {
      messageAnimations[messageId] = new Animated.Value(0);
      Animated.spring(messageAnimations[messageId], {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();
    }
    return messageAnimations[messageId];
  };

  const renderMessage = ({ item }) => {
    console.log('Rendering message:', item);
    const animation = getMessageAnimation(item.id);
    return (
      <Animated.View
        style={[
          styles.messageContainer,
          item.sender === 'me' ? styles.myMessage : styles.theirMessage,
          {
            opacity: animation,
            transform: [
              {
                translateY: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          },
        ]}
      >
        {item.sender === 'them' && (
          <LinearGradient
            colors={['#6200ee', '#9d46ff']}
            style={styles.avatarContainer}
          >
            <Avatar.Image
              size={30}
              source={{ uri: 'https://i.pravatar.cc/150?img=1' }}
              style={styles.avatar}
            />
          </LinearGradient>
        )}
        <Surface 
          style={[
            styles.messageBubble,
            item.sender === 'me' ? styles.myBubble : styles.theirBubble
          ]} 
          elevation={1}
        >
          <Text style={item.sender === 'me' ? styles.myMessageText : styles.theirMessageText}>
            {item.text}
          </Text>
          <View style={styles.messageFooter}>
            <Text style={[
              styles.timestamp,
              item.sender === 'me' ? styles.myTimestamp : styles.theirTimestamp
            ]}>
              {new Date(item.timestamp).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </Text>
            {item.sender === 'me' && (
              <MaterialCommunityIcons 
                name="check-all" 
                size={16} 
                color="#6200ee" 
                style={styles.messageStatus}
              />
            )}
          </View>
        </Surface>
      </Animated.View>
    );
  };

  const renderTypingIndicator = () => {
    if (!isTyping) return null;

    return (
      <View style={styles.typingContainer}>
        <LinearGradient
          colors={['#6200ee', '#9d46ff']}
          style={styles.avatarContainer}
        >
          <Avatar.Image
            size={30}
            source={{ uri: 'https://i.pravatar.cc/150?img=1' }}
            style={styles.avatar}
          />
        </LinearGradient>
        <Surface style={styles.typingBubble} elevation={1}>
          <View style={styles.typingDots}>
            <Animated.View
              style={[
                styles.typingDot,
                {
                  transform: [
                    {
                      translateY: typingAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -4],
                      }),
                    },
                  ],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.typingDot,
                {
                  transform: [
                    {
                      translateY: typingAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -4],
                      }),
                    },
                  ],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.typingDot,
                {
                  transform: [
                    {
                      translateY: typingAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -4],
                      }),
                    },
                  ],
                },
              ]}
            />
          </View>
        </Surface>
      </View>
    );
  };

  const renderChatItem = (chatItem) => {
    const isActive = chatItem.id === id;
    const lastMessage = chatItem.lastMessage || 'No messages yet';
    const timestamp = chatItem.timestamp ? new Date(chatItem.timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    }) : '';

    return (
      <TouchableOpacity
        key={chatItem.id}
        onPress={() => router.push(`/(app)/chat/${chatItem.id}`)}
        style={[
          styles.chatItem,
          isActive && styles.activeChatItem
        ]}
      >
        <LinearGradient
          colors={['#6200ee', '#9d46ff']}
          style={styles.chatAvatarContainer}
        >
          <Avatar.Image
            size={40}
            source={{ uri: 'https://i.pravatar.cc/150?img=1' }}
            style={styles.chatAvatar}
          />
        </LinearGradient>
        <View style={styles.chatInfo}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatName}>{chatItem.name}</Text>
            <Text style={styles.chatTime}>{timestamp}</Text>
          </View>
          <Text 
            style={styles.chatLastMessage}
            numberOfLines={1}
          >
            {lastMessage}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen 
        options={{
          headerShown: false,
        }} 
      />
      <LinearGradient
        colors={['#f5f5f5', '#ffffff']}
        style={styles.background}
      />
      <View style={styles.container}>
        <Surface style={styles.chatListContainer} elevation={2}>
          <View style={styles.chatListHeader}>
            <Text style={styles.chatListTitle}>Conversations</Text>
            <IconButton
              icon="plus"
              size={24}
              onPress={() => router.push('/(app)/new-chat')}
              iconColor="#6200ee"
            />
          </View>
          <Divider />
          <ScrollView style={styles.chatList}>
            {chats.map(renderChatItem)}
          </ScrollView>
        </Surface>

        <View style={styles.mainContent}>
          <View style={styles.chatHeader}>
            <View style={styles.chatHeaderLeft}>
              <IconButton
                icon="arrow-left"
                onPress={() => router.push('/(app)/chats')}
                iconColor="#6200ee"
              />
              <Text style={styles.chatTitle}>{chat?.name || 'Chat'}</Text>
            </View>
            <Avatar.Image
              size={32}
              source={{ uri: 'https://i.pravatar.cc/150?img=1' }}
              style={styles.headerAvatar}
            />
          </View>
          <FlatList
            ref={flatListRef}
            data={chatMessages}
            renderItem={renderMessage}
            keyExtractor={item => item.id}
            contentContainerStyle={[
              styles.messagesList,
              { paddingBottom: keyboardHeight > 0 ? keyboardHeight + 80 : 80 }
            ]}
            inverted={false}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={() => {
              console.log('Content size changed, scrolling to bottom');
              flatListRef.current?.scrollToEnd({ animated: true });
            }}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={renderTypingIndicator}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Start chatting!</Text>
                <Text style={styles.emptySubText}>Type something to begin</Text>
              </View>
            )}
          />
          <Surface style={[styles.inputContainer, { bottom: keyboardHeight }]} elevation={4}>
            <TextInput
              ref={inputRef}
              mode="outlined"
              value={message}
              onChangeText={setMessage}
              placeholder="Type a message..."
              style={styles.input}
              multiline
              maxLength={500}
              right={
                <TextInput.Icon
                  icon="send"
                  onPress={handleSendMessage}
                  disabled={!message.trim()}
                  color="#6200ee"
                />
              }
              outlineColor="transparent"
              activeOutlineColor="#6200ee"
              onKeyPress={handleKeyPress}
            />
          </Surface>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  chatListContainer: {
    width: 300,
    backgroundColor: '#fff',
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
  },
  chatListHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  chatListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  chatList: {
    flex: 1,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activeChatItem: {
    backgroundColor: '#f5f5f5',
  },
  chatAvatarContainer: {
    borderRadius: 20,
    padding: 1,
    marginRight: 12,
  },
  chatAvatar: {
    backgroundColor: 'white',
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  chatTime: {
    fontSize: 12,
    color: '#666',
  },
  chatLastMessage: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  mainContent: {
    flex: 1,
    position: 'relative',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  chatHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 8,
  },
  headerAvatar: {
    marginRight: 8,
  },
  messagesList: {
    padding: 16,
    flexGrow: 1,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  myMessage: {
    justifyContent: 'flex-end',
  },
  theirMessage: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    borderRadius: 15,
    padding: 1,
    marginRight: 8,
  },
  avatar: {
    backgroundColor: 'white',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 20,
    maxWidth: '80%',
  },
  myBubble: {
    backgroundColor: '#6200ee',
    borderBottomRightRadius: 4,
  },
  theirBubble: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 4,
  },
  myMessageText: {
    color: 'white',
  },
  theirMessageText: {
    color: '#000',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  timestamp: {
    fontSize: 12,
  },
  myTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  theirTimestamp: {
    color: '#666',
  },
  messageStatus: {
    marginLeft: 4,
  },
  inputContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  input: {
    backgroundColor: '#fff',
    maxHeight: 100,
  },
  typingContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  typingBubble: {
    padding: 12,
    borderRadius: 20,
    backgroundColor: 'white',
    borderBottomLeftRadius: 4,
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 20,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#6200ee',
    marginHorizontal: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
  },
}); 