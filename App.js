import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, FlatList, TextInput, 
  TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ActivityIndicator 
} from 'react-native';
// Correct the path based on your folder structure
import { get_users, add_user } from './api_connector'; 

export  default async function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');

  //bro just use this
  const user = await get_user(2);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await get_users();
      setUsers(Array.isArray(data) ? data : []);
    } catch (e) {
      console.log("Connection Error:", e);
    } finally {
      setLoading(false);
    }
  };

  const renderUser = ({ item }) => (
    <View style={styles.userCard}>
      <View style={styles.userIcon}>
        <Text style={styles.userIconText}>{item.username[0].toUpperCase()}</Text>
      </View>
      <View>
        <Text style={styles.userName}>{item.username}</Text>
        <Text style={styles.userStatus}>Active Resident</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.brand}>SMART HOME</Text>
        <Text style={styles.title}>Residents</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4A90E2" style={{marginTop: 50}} />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderUser}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>No residents found.</Text>}
        />
      )}

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.inputCard}>
          <TextInput 
            style={styles.input}
            placeholder="New Resident Name"
            value={name}
            onChangeText={setName}
          />
          <TouchableOpacity style={styles.button} onPress={loadData}>
            <Text style={styles.buttonText}>Add Resident</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { padding: 25, backgroundColor: '#1A1A1A' },
  brand: { color: '#4A90E2', fontWeight: 'bold', letterSpacing: 2, fontSize: 12 },
  title: { color: '#FFF', fontSize: 28, fontWeight: '700' },
  list: { padding: 20 },
  userCard: { 
    backgroundColor: '#FFF', padding: 15, borderRadius: 15, marginBottom: 12,
    flexDirection: 'row', alignItems: 'center', elevation: 2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4
  },
  userIcon: { 
    width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#E1F0FF', 
    justifyContent: 'center', alignItems: 'center', marginRight: 15 
  },
  userIconText: { color: '#4A90E2', fontWeight: 'bold', fontSize: 18 },
  userName: { fontSize: 18, fontWeight: '600', color: '#333' },
  userStatus: { fontSize: 12, color: '#AAA' },
  inputCard: { padding: 20, backgroundColor: '#FFF', borderTopLeftRadius: 25, borderTopRightRadius: 25 },
  input: { backgroundColor: '#F1F3F5', padding: 15, borderRadius: 10, marginBottom: 10 },
  button: { backgroundColor: '#4A90E2', padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#FFF', fontWeight: 'bold' },
  empty: { textAlign: 'center', color: '#999', marginTop: 40 }
});