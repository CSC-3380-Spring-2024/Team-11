// WorkoutCreator.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, StyleSheet, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Dispatch, SetStateAction } from 'react';

interface Workout {
  workoutName: string;
  requiresWeights: boolean;
  weight?: string | null;
  reps: string;
  sets: string;
  date: string;
}

interface Goal {
  id: number;
  text: string;
}

const SortTypes = {
  DATE: 'DATE',
  NAME: 'NAME',
};

const WorkoutCreator: React.FC = () => {
  const [workoutName, setWorkoutName] = useState('');
  const [requiresWeights, setRequiresWeights] = useState(false);
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [sets, setSets] = useState('');
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [sortType, setSortType] = useState(SortTypes.DATE);
  const [modalVisible, setModalVisible] = useState(false);
  const [goalText, setGoalText] = useState('');
  const [goals, setGoals] = useState<Goal[]>([]);
  
  useEffect(() => {
    loadWorkouts();
    loadGoals();
  }, []);

  const loadWorkouts = async () => {
    const storedWorkouts = await AsyncStorage.getItem('workouts');
    if (storedWorkouts) {
      setWorkouts(JSON.parse(storedWorkouts));
    }
  };

  const loadGoals = async () => {
    const storedGoals = await AsyncStorage.getItem('goals');
    if (storedGoals) {
      setGoals(JSON.parse(storedGoals));
    }
  };

  const addWorkout = async () => {
    const newWorkout: Workout = {
      workoutName,
      requiresWeights,
      weight: requiresWeights ? weight : null,
      reps,
      sets,
      date: new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    };

    const updatedWorkouts = [...workouts, newWorkout];
    setWorkouts(updatedWorkouts);

    await AsyncStorage.setItem('workouts', JSON.stringify(updatedWorkouts));

    setWorkoutName('');
    setRequiresWeights(false);
    setWeight('');
    setReps('');
    setSets('');
  };

  const removeWorkout = async (index: number) => {
    const updatedWorkouts = [...workouts];
    updatedWorkouts.splice(index, 1);
    setWorkouts(updatedWorkouts);
    await AsyncStorage.setItem('workouts', JSON.stringify(updatedWorkouts));
  };

  const handleNumericChange = (text: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
    const numericRegex = /^\d*\.?\d*$/;
    if (numericRegex.test(text)) {
      setter(text);
    }
  };

  const handleSortTypeChange = (type: string) => {
    setSortType(type);
  };

  const sortWorkouts = (workouts: Workout[]) => {
    switch (sortType) {
      case SortTypes.NAME:
        return workouts.slice().sort((a, b) => a.workoutName.localeCompare(b.workoutName));
      case SortTypes.DATE:
      default:
        return workouts.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
  };

  const setWorkoutReminder = () => {
    // Reminder logic here
  };

  const addGoal = async () => {
    const newGoal: Goal = {
      id: goals.length + 1,
      text: goalText,
    };
    const updatedGoals = [...goals, newGoal];
    setGoals(updatedGoals);
    await AsyncStorage.setItem('goals', JSON.stringify(updatedGoals));
    setGoalText('');
    setModalVisible(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : "padding"}
    >
      <ScrollView>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Workout Tracker</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.prompt}>Add New Workout</Text>
          <TextInput
            style={styles.input}
            placeholder="Insert Workout Name:"
            value={workoutName}
            onChangeText={(text) => setWorkoutName(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="# of Sets"
            value={sets}
            onChangeText={(text) => handleNumericChange(text, setSets)}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="# of Reps"
            value={reps}
            onChangeText={(text) => handleNumericChange(text, setReps)}
            keyboardType="numeric"
          />
          <Text style={styles.question}>Does this exercise require weights?</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => setRequiresWeights(true)} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20 }}>
              {requiresWeights && <Icon name="checkbox" size={20} color="black" />}
              {!requiresWeights && <Icon name="checkbox-outline" size={20} color="black" />}
              <Text style={{ marginLeft: 5, fontSize: 16, color: '#555' }}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setRequiresWeights(false)} style={{ flexDirection: 'row', alignItems: 'center' }}>
              {!requiresWeights && <Icon name="checkbox" size={20} color="black" />}
              {requiresWeights && <Icon name="checkbox-outline" size={20} color="black" />}
              <Text style={{ marginLeft: 5, fontSize: 16, color: '#555' }}>No</Text>
            </TouchableOpacity>
          </View>
          {requiresWeights && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Weight (lbs)"
                value={weight}
                onChangeText={(text) => handleNumericChange(text, setWeight)}
                keyboardType="numeric"
              />
            </>
          )}
          <TouchableOpacity style={styles.addButton} onPress={addWorkout}>
            <Text style={styles.addButtonLabel}>Add Workout</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.workoutsContainer}>
          <Text style={styles.workoutHeader}>YOUR WORKOUTS</Text>
          <View style={styles.sortOptions}>
            <Text style={styles.sortLabel}>Sort by:</Text>
            <TouchableOpacity onPress={() => handleSortTypeChange(SortTypes.DATE)} style={[styles.sortOption, sortType === SortTypes.DATE && styles.activeSortOption]}>
              <Text style={styles.sortOptionText}>Date</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSortTypeChange(SortTypes.NAME)} style={[styles.sortOption, sortType === SortTypes.NAME && styles.activeSortOption]}>
              <Text style={styles.sortOptionText}>Name</Text>
            </TouchableOpacity>
          </View>
          {workouts.length > 0 ? (
            sortWorkouts(workouts).map((workout, index) => (
              <View key={index} style={styles.workoutItem}>
                <Text style={styles.workoutDate}>{workout.date}</Text>
                <View style={styles.workoutTextContainer}>
                  <Text style={styles.workoutName}>{workout.workoutName}</Text>
                  <Text style={styles.workoutText}>Sets: {workout.sets || '-'}</Text>
                  <Text style={styles.workoutText}>Reps: {workout.reps || '-'}</Text>
                  {workout.requiresWeights && <Text style={styles.workoutText}>Weight: {workout.weight || '-'} lbs</Text>}
                </View>
                <View style={styles.workoutButtons}>
                  <TouchableOpacity onPress={() => removeWorkout(index)}>
                    <Text style={{ color: 'red' }}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text>No workouts added yet.</Text>
          )}
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
      </Modal>

    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  titleContainer: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'black',
    width: 200,
    padding: 5,
    marginVertical: 10,
  },
  prompt: {
    marginBottom: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  question: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  workoutsContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  workoutItem: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  workoutTextContainer: {
    flex: 1,
  },
  workoutHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    marginBottom: 10,
  },
  workoutDate: {
    fontSize: 14,
    color: '#555',
    position: 'absolute',
    top: 5,
    right: 10,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    marginBottom: 5,
  },
  workoutText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  workoutButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  sortOptions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sortLabel: {
    marginRight: 10,
    fontSize: 16,
    color: '#555',
  },
  sortOption: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#aaa',
    marginRight: 10,
  },
  sortOptionText: {
    fontSize: 16,
    color: '#555',
  },
  activeSortOption: {
    backgroundColor: '#eee',
  },
  addButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 30,
    marginTop: 10,
  },
  addButtonLabel: {
    color: 'white',
    fontWeight: 'bold',
  },
  goalsButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'blue',
    borderRadius: 30,
    padding: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    marginBottom: 20,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  goalInput: {
    borderWidth: 1,
    borderColor: 'black',
    width: 250,
    padding: 10,
    marginBottom: 20,
  },
  addGoalButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 20,
    width: 100,
    alignItems: 'center',
  },
  addGoalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeModalButton: {
    marginTop: 20,
  },
  closeModalButtonText: {
    color: 'blue',
    fontWeight: 'bold',
  },
});

export default WorkoutCreator;
