import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Surface, Text, TextInput } from 'react-native-paper';
import { useChats } from '../../contexts/ChatsContext';

export default function NewChatScreen() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { addChat } = useChats();

  const handleCreateChat = async () => {
    if (!name.trim()) {
      return;
    }

    try {
      setLoading(true);
      await addChat(name.trim());
      router.back();
    } catch (error) {
      console.error('Error creating chat:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Surface style={styles.surface} elevation={2}>
        <Text variant="headlineMedium" style={styles.title}>New Chat</Text>
        
        <TextInput
          label="Chat Name"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
          disabled={loading}
        />
        
        <Button
          mode="contained"
          onPress={handleCreateChat}
          style={styles.button}
          loading={loading}
          disabled={loading || !name.trim()}
        >
          Create Chat
        </Button>
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  surface: {
    padding: 20,
    borderRadius: 10,
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
}); 