import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, Switch, TouchableOpacity } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import { db } from './firebase'; // Import Firestore configuration
import { collection, addDoc, doc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskStatus, setTaskStatus] = useState('due');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'tasks'), (snapshot) => {
      const tasksArray = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTasks(tasksArray);
    });

    return () => unsubscribe();
  }, []);

  const addTask = async () => {
    if (taskTitle.trim() !== '') {
      await addDoc(collection(db, 'tasks'), {
        title: taskTitle,
        status: taskStatus === 'done',
      });

      setTaskTitle('');
      setTaskStatus('due');
    }
  };

  const toggleTaskStatus = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, { status: !task.status });
    }
  };

  const deleteTask = async (taskId) => {
    const taskRef = doc(db, 'tasks', taskId);
    await deleteDoc(taskRef);
  };

  const renderTask = ({ item }) => (
    <ListItem bottomDivider>
      <TouchableOpacity onPress={() => toggleTaskStatus(item.id)}>
        <Text style={{ color: item.status ? 'green' : 'red' }}>
          {item.status ? 'Done' : 'Due'}
        </Text>
      </TouchableOpacity>
      <ListItem.Content>
        <ListItem.Title>{item.title}</ListItem.Title>
      </ListItem.Content>
      <Switch
        value={item.status}
        onValueChange={() => toggleTaskStatus(item.id)}
      />
      <Icon
        name='delete'
        color='red'
        onPress={() => deleteTask(item.id)}
      />
    </ListItem>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tasks ToDo App</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Task Title"
          value={taskTitle}
          onChangeText={setTaskTitle}
        />
        <Picker
          selectedValue={taskStatus}
          style={styles.picker}
          onValueChange={(itemValue) => setTaskStatus(itemValue)}
        >
          <Picker.Item label="Due" value="due" />
          <Picker.Item label="Done" value="done" />
        </Picker>
        <Button title="Add Task" onPress={addTask} disabled={taskTitle.trim() === ''} />
      </View>
      <FlatList
        keyExtractor={item => item.id}
        data={tasks}
        renderItem={renderTask}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginRight: 10,
  },
  picker: {
    height: 50,
    width: 150,
    marginRight: 10,
  },
});
