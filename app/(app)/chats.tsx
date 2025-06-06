import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, router } from 'expo-router';
import { FlatList, Pressable, StatusBar, StyleSheet, View } from 'react-native';
import { Avatar, FAB, IconButton, Surface, Text, useTheme } from 'react-native-paper';
import { useChats } from '../../contexts/ChatsContext';

export default function ChatsScreen() {
  const { chats } = useChats();
  const theme = useTheme();

  const renderChat = ({ item }: { item: any }) => (
    <Link href={`/chat/${item.id}`} asChild>
      <Pressable>
        <Surface style={styles.chatItem} elevation={2}>
          <LinearGradient
            colors={['#6200ee', '#9d46ff']}
            style={styles.avatarContainer}
          >
            <Avatar.Image 
              size={50} 
              source={{ uri: item.avatar }} 
              style={styles.avatar}
            />
          </LinearGradient>
          <View style={styles.chatInfo}>
            <View style={styles.nameContainer}>
              <Text variant="titleMedium" style={styles.chatName}>{item.name}</Text>
              <Text variant="bodySmall" style={styles.timestamp}>
                {new Date(item.timestamp).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </Text>
            </View>
            {item.lastMessage && (
              <View style={styles.messageContainer}>
                <Text variant="bodyMedium" numberOfLines={1} style={styles.lastMessage}>
                  {item.lastMessage}
                </Text>
              </View>
            )}
          </View>
        </Surface>
      </Pressable>
    </Link>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <LinearGradient
        colors={['#f5f5f5', '#ffffff']}
        style={styles.background}
      />
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.headerTitle}>Messages</Text>
        <IconButton
          icon="magnify"
          size={24}
          onPress={() => {}}
          iconColor="#6200ee"
        />
      </View>
      <FlatList
        data={chats}
        renderItem={renderChat}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="chat-outline" size={64} color="#6200ee" />
            <Text variant="titleLarge" style={styles.emptyTitle}>No Chats Yet</Text>
            <Text variant="bodyMedium" style={styles.emptyText}>
              Start a new conversation by tapping the + button
            </Text>
          </View>
        }
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push('/new-chat')}
        color="white"
        size="large"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  list: {
    padding: 16,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    borderRadius: 25,
    padding: 2,
  },
  avatar: {
    backgroundColor: 'white',
  },
  chatInfo: {
    marginLeft: 16,
    flex: 1,
    justifyContent: 'center',
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontWeight: '600',
    color: '#1a1a1a',
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastMessage: {
    color: '#666',
    flex: 1,
  },
  timestamp: {
    color: '#999',
    fontSize: 12,
  },
  unreadBadge: {
    backgroundColor: '#6200ee',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadCount: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee',
    borderRadius: 28,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    marginTop: 16,
    color: '#1a1a1a',
    fontWeight: 'bold',
  },
  emptyText: {
    marginTop: 8,
    color: '#666',
    textAlign: 'center',
  },
}); 