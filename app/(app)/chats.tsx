import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { List, Avatar, Divider, FAB } from 'react-native-paper';
import { Link } from 'expo-router';

// Mock data for chat list
const mockChats = [
  {
    id: '1',
    name: 'John Doe',
    lastMessage: 'Hey, how are you?',
    timestamp: '10:30 AM',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: '2',
    name: 'Jane Smith',
    lastMessage: 'See you tomorrow!',
    timestamp: '9:15 AM',
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  // Add more mock chats as needed
];

export default function ChatListScreen() {
  const renderChatItem = ({ item }) => (
    <Link href={`/chat/${item.id}`} asChild>
      <List.Item
        title={item.name}
        description={item.lastMessage}
        left={props => (
          <Avatar.Image
            {...props}
            source={{ uri: item.avatar }}
            size={50}
          />
        )}
        right={props => (
          <List.Subheader {...props}>{item.timestamp}</List.Subheader>
        )}
      />
    </Link>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={mockChats}
        renderItem={renderChatItem}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={() => <Divider />}
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => {
          // TODO: Implement new chat functionality
          console.log('New chat');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
}); 