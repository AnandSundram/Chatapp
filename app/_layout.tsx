import { Stack } from 'expo-router';
import { AuthProvider } from '../contexts/AuthContext';
import { ChatsProvider } from '../contexts/ChatsContext';
import { MessagesProvider } from '../contexts/MessagesContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <ChatsProvider>
        <MessagesProvider>
          <Stack>
            <Stack.Screen
              name="(auth)"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="(app)"
              options={{
                headerShown: false,
              }}
            />
          </Stack>
        </MessagesProvider>
      </ChatsProvider>
    </AuthProvider>
  );
}
