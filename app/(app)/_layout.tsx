import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs, useLocalSearchParams } from 'expo-router';
import { useChats } from '../../contexts/ChatsContext';

export default function AppLayout() {
  const { id } = useLocalSearchParams();
  const { getChat } = useChats();
  const chat = getChat(id as string);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#6200ee',
        headerShown: true,
        tabBarStyle: {
          justifyContent: 'space-around',
        },
        tabBarItemStyle: {
          flex: 1,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: 'Chats',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chat" size={size} color={color} />
          ),
          tabBarBadge: undefined,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="new-chat"
        options={{
          title: 'New Chat',
          tabBarButton: () => null,
          headerShown: true,
        }}
      />
      <Tabs.Screen
        name="chat/[id]"
        options={{
          tabBarButton: () => null,
          headerShown: false,
        }}
      />
    </Tabs>
  );
} 