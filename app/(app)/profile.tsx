import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Avatar, List, Switch, Button, Text } from 'react-native-paper';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(false);

  const handleLogout = () => {
    // TODO: Implement logout logic
    router.replace('/login');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar.Image
          size={100}
          source={{ uri: 'https://i.pravatar.cc/150?img=1' }}
        />
        <Text variant="headlineSmall" style={styles.name}>John Doe</Text>
        <Text variant="bodyLarge" style={styles.email}>john.doe@example.com</Text>
      </View>

      <List.Section>
        <List.Subheader>Settings</List.Subheader>
        
        <List.Item
          title="Notifications"
          left={props => <List.Icon {...props} icon="bell" />}
          right={() => (
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
            />
          )}
        />
        
        <List.Item
          title="Dark Mode"
          left={props => <List.Icon {...props} icon="theme-light-dark" />}
          right={() => (
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
            />
          )}
        />
        
        <List.Item
          title="Edit Profile"
          left={props => <List.Icon {...props} icon="account-edit" />}
          onPress={() => {
            // TODO: Implement edit profile navigation
            console.log('Edit profile');
          }}
        />
        
        <List.Item
          title="Privacy Settings"
          left={props => <List.Icon {...props} icon="shield-account" />}
          onPress={() => {
            // TODO: Implement privacy settings navigation
            console.log('Privacy settings');
          }}
        />
      </List.Section>

      <View style={styles.buttonContainer}>
        <Button
          mode="outlined"
          onPress={handleLogout}
          style={styles.logoutButton}
        >
          Logout
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  name: {
    marginTop: 12,
  },
  email: {
    color: '#666',
  },
  buttonContainer: {
    padding: 16,
  },
  logoutButton: {
    borderColor: '#ff4444',
  },
}); 