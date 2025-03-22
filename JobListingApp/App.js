import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AuthSession from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

const DEFAULT_JOBS = [
  { id: '1', title: 'Software Engineer', description: 'Develop and maintain web applications.', company: 'TechCorp', location: 'New York, USA' },
  { id: '2', title: 'Frontend Developer', description: 'Design and implement UI components.', company: 'InnovateTech', location: 'Berlin, Germany' },
  { id: '3', title: 'Backend Developer', description: 'Build and maintain server-side applications.', company: 'CloudX', location: 'Toronto, Canada' },
  { id: '4', title: 'Mobile App Developer', description: 'Develop and optimize mobile applications.', company: 'AppFlow', location: 'San Francisco, USA' },
  { id: '5', title: 'DevOps Engineer', description: 'Manage CI/CD pipelines and cloud infrastructure.', company: 'CloudOps', location: 'London, UK' }
];

export default function App() {
  const [user, setUser] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '684907437642-jqq5nrn5g0b7eqg1qque18ks5nmu2rcl.apps.googleusercontent.com',
    androidClientId: '684907437642-fjv2fev19cbmkbbnrr8hkce47l7mcii0.apps.googleusercontent.com',
    redirectUri,
  });

  useEffect(() => {
    checkStoredUser();
  }, []);

  useEffect(() => {
    if (response?.type === 'success' && response.authentication?.accessToken) {
      fetchUserInfo(response.authentication.accessToken);
    }
  }, [response]);

  async function fetchUserInfo(token) {
    try {
      const res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userInfo = await res.json();
      setUser(userInfo);
      await AsyncStorage.setItem('user', JSON.stringify(userInfo));
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch user information.');
      console.error(error);
    }
  }

  async function checkStoredUser() {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
    }
  }

  async function handleLogout() {
    setUser(null);
    setSelectedJob(null);
    await AsyncStorage.removeItem('user');
  }

  return (
    <View style={styles.container}>
      {user ? (
        <>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.userInfo}>
              <Image source={{ uri: user.picture }} style={styles.userImage} />
              <Text style={styles.userName}>{user.name}</Text>
            </View>
            <Button title="Logout" onPress={handleLogout} color="#ff3b30" />
          </View>

          {/* Job Listings */}
          <View style={styles.jobContainer}>
            {selectedJob ? (
              <View style={styles.jobDetails}>
                <Text style={styles.jobTitle}>{selectedJob.title}</Text>
                <Text style={styles.jobCompany}>{selectedJob.company}</Text>
                <Text style={styles.jobLocation}>{selectedJob.location}</Text>
                <Text style={styles.jobDescription}>{selectedJob.description}</Text>
                <Button title="Back to Listings" onPress={() => setSelectedJob(null)} color="#007AFF" />
              </View>
            ) : (
              <FlatList
                data={DEFAULT_JOBS}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => setSelectedJob(item)} style={styles.jobItem}>
                    <Text style={styles.jobItemTitle}>{item.title}</Text>
                    <Text style={styles.jobItemSubtitle}>{item.company} - {item.location}</Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </>
      ) : (
        <Button title="Sign in" onPress={() => promptAsync()} disabled={!request} color="#007AFF" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  jobContainer: {
    flex: 1,
    alignItems: 'center',
  },
  jobItem: {
    width: '90%',
    backgroundColor: '#ffffff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  jobItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  jobItemSubtitle: {
    fontSize: 14,
    color: '#555',
  },
  jobDetails: {
    alignItems: 'center',
    padding: 20,
  },
  jobTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  jobCompany: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  jobLocation: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  jobDescription: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
    marginBottom: 20,
  },
});
