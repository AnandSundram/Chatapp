import { Stack } from 'expo-router';

export default function ChatLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: true,
          title: 'Chat',
          headerBackTitle: 'Back'
        }}
      />
    </Stack>
  );
} 