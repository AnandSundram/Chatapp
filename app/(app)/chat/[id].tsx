import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, FlatList, Platform, Keyboard, SafeAreaView, Dimensions } from 'react-native';
import { TextInput, IconButton, Avatar, Text, Surface } from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';

// Mock messages data
const mockMessages = [
  {
    id: '1',
    text: 'Hey, how are you?',
    sender: 'them',
    timestamp: '10:30 AM',
  },
  {
    id: '2',
    text: 'I\'m good, thanks! How about you?',
    sender: 'me',
    timestamp: '10:31 AM',
  },
  {
    id: '3',
    text: 'Doing great! Want to catch up later?',
    sender: 'them',
    timestamp: '10:32 AM',
  },
];

export default function ChatRoomScreen() {
  const { id } = useLocalSearchParams();
  const [message, setMessage] = useState('');
  const flatListRef = useRef(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

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

  const sendMessage = () => {
    if (message.trim()) {
      // TODO: Implement message sending logic
      console.log('Sending message:', message);
      setMessage('');
      Keyboard.dismiss();
    }
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === 'me' ? styles.myMessage : styles.theirMessage,
      ]}
    >
      {item.sender === 'them' && (
        <Avatar.Image
          size={30}
          source={{ uri: 'https://i.pravatar.cc/150?img=1' }}
          style={styles.avatar}
        />
      )}
      <Surface style={styles.messageBubble} elevation={1}>
        <Text>{item.text}</Text>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </Surface>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <FlatList
          ref={flatListRef}
          data={mockMessages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={[
            styles.messagesList,
            { paddingBottom: keyboardHeight > 0 ? keyboardHeight + 80 : 80 }
          ]}
          inverted={false}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
        <View style={[styles.inputContainer, { bottom: keyboardHeight }]}>
          <TextInput
            mode="outlined"
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message..."
            style={styles.input}
            right={
              <TextInput.Icon
                icon="send"
                onPress={sendMessage}
                disabled={!message.trim()}
              />
            }
          />
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
  container: {
    flex: 1,
    position: 'relative',
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
  avatar: {
    marginRight: 8,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    maxWidth: '80%',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  inputContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  input: {
    backgroundColor: '#fff',
  },
}); 