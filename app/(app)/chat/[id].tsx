import React, { useState } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
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

  const sendMessage = () => {
    if (message.trim()) {
      // TODO: Implement message sending logic
      console.log('Sending message:', message);
      setMessage('');
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <FlatList
        data={mockMessages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        inverted={false}
      />
      <View style={styles.inputContainer}>
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messagesList: {
    padding: 16,
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
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  input: {
    backgroundColor: '#fff',
  },
}); 