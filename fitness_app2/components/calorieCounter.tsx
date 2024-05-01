import React, { useState, useEffect } from 'react';
import {Text, View, Button, TouchableOpacity, TextInput, Keyboard} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const calorieCounter: React.FC = () => {
  // Defines options for selection questions
  const selectGender = ['Male', 'Female'];
  const selectActivityLevel = ['Sedentary: little to no exercise with desk job', 'Lightly Active: light exercise 1-3 times per week', 'Moderately Active: moderate exercise 3-5 times per week', 'Very Active: hard exercise 6-7 times per week', 'Extremely Active: hard daily exercise and a physical job'];
  const selectWeightGoal = ['-20%: Lose weight', '-10%: Slowly lose weight', '0%: Maintain weight', '+10%: Slowly gain weight', '+20%: Gain weight'];

  // State to manage current question index and answers
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [gender, setGender] = useState<number | null>(null);
  const [age, setAge] = useState<string>('');
  const [heightInFeet, setHeightInFeet] = useState<string>('');
  const [inches, setInches] = useState<string>('');
  const [weightInPounds, setWeightInPounds] = useState<string>('');
  const [activityLevel, setActivityLevel] = useState<number | null>(null);
  const [weightGoals, setWeightGoals] = useState<number | null>(null);
  const [errorMessageVisible, setErrorMessageVisible] = useState(false);

  //Load stored data from AsyncStorage when components mount
  useEffect(() => {
    loadStoredData();
  }, []);

  // Load stored data from AsyncStorage
  const loadStoredData = async () => {
    try {
      // Awaits to load stored data
      const storedGender = await AsyncStorage.getItem('genderValue');
      const storedAge = await AsyncStorage.getItem('ageValue');
      const storedHeightInFeet = await AsyncStorage.getItem('heightInFeetValue');
      const storedInches = await AsyncStorage.getItem('inches');
      const storedWeightInPounds = await AsyncStorage.getItem('weightInPounds');
      const storedActivityLevel = await AsyncStorage.getItem('activityLevelValue');
      const storedWeightGoal = await AsyncStorage.getItem('weightGoalValue')

      // Set state variables with stored data if available
      if (storedGender !== null) {
        setGender(parseInt(storedGender));
      }

      if (storedAge !== null) {
        setAge(storedAge);
      }

      if (storedHeightInFeet !== null) {
        setHeightInFeet(storedHeightInFeet);
      }

      if (storedInches !== null) {
        setInches(storedInches);
      }

      if (storedWeightInPounds !== null) {
        setWeightInPounds(storedWeightInPounds);
      }

      if (storedActivityLevel !== null) {
        setActivityLevel(parseInt(storedActivityLevel));
      }

      if (storedWeightGoal !== null) {
        setWeightGoals(parseInt(storedWeightGoal));
      }

    } catch (error) {
      console.log('Error loading data: ', error);
    }
  };

  // Functions to store user data in AsyncStorage
  const storeGenderData = async () => {
    try {
      if (gender !== null) {
        await AsyncStorage.setItem('genderValue', gender.toString());
      }
    } catch (error) {
      alert(error);
    }
  };

  const storeAgeData = async () => {
    try {
      await AsyncStorage.setItem('ageValue', age);
    } catch (error) {
      alert(error);
    }
  };

  const storeHeightInFeetData = async () => {
    try {
      await AsyncStorage.setItem('heightInFeetValue', heightInFeet);
    } catch (error) {
      alert(error);
    }
  };

  const storeInches = async () => {
    try {
      await AsyncStorage.setItem('inches', inches);
    } catch (error) {
      alert(error);
    }
  };

  const storeWeightInPounds = async () => {
    try {
      await AsyncStorage.setItem('weightInPounds', weightInPounds);
    } catch (error) {
      alert(error);
    }
  };

  const storeActivityLevel = async () => {
    try {
      if (activityLevel !== null) {
        await AsyncStorage.setItem('activityLevel', activityLevel.toString());
      }
    } catch (error) {
      alert(error);
    }
  };

  const storeWeightGoal = async () => {
    try {
      if (weightGoals !== null) {
        await AsyncStorage.setItem('weightGoalValue', weightGoals.toString());
      }
    } catch (error) {
      alert(error);
    }
  };

  const storeDailyGoalData = async (dailyGoalValue: number) => {
    try {
      await AsyncStorage.setItem('calculateDailyCalories', dailyGoalValue.toString());
    } catch (error) {
      alert(error);
    }
  };

  // Handles user input, sets everything to default until user does something
  const handleGenderSelection = (index: number) => {
    setGender(index);
    setErrorMessageVisible(false);
  };

  const handleAgeInput = (text: string) => {
    setAge(text);
    setErrorMessageVisible(false);
  };

  const handleHeightInFeetInput = (text: string) => {
    setHeightInFeet(text);
    setErrorMessageVisible(false);
  };

  const handleInches = (text: string) => {
    setInches(text);
    setErrorMessageVisible(false);
  };

  const handleWeightInPounds = (text: string) => {
    setWeightInPounds(text);
    setErrorMessageVisible(false);
  };

  const handleActivityLevel = (index: number) => {
    setActivityLevel(index);
    setErrorMessageVisible(false);
  };

  const handleWeightGoal = (index: number) => {
    setWeightGoals(index);
    setErrorMessageVisible(false);
  }

  // Calculates daily calorie goal based on user input
  const calculateDailyCalories = () => {
    const totalHeight = (12 * parseInt(heightInFeet)) + parseInt(inches);
    const inchesToCentimeters = totalHeight * 2.54;
    const poundsToKilograms = parseInt(weightInPounds) / 2.205;
    const ageInYears = parseInt(age);

    let BMR = 0;
    if (gender === 0) { // Male
      BMR = (9.99 * poundsToKilograms) + (6.25 * inchesToCentimeters) - (4.92 * ageInYears) + 5;
    }
    else if (gender === 1) { // Female
      BMR = (9.99 * poundsToKilograms) + (6.25 * inchesToCentimeters) - (4.92 * ageInYears) - 161;
    }

    const activityFactors = [1.2, 1.375, 1.55, 1.725, 1.9]; // Activity level values
    const factorActivity = activityLevel !== null ? activityFactors[activityLevel] : 0; // Sets activity levels equal to values, with null check
    const TDEE = BMR * factorActivity;

    const weightGoalPercentageFactors = [-0.2, -0.1, 0, 0.1, 0.2]; // Weight percentage values
    const factorWeightGoal = weightGoals !== null ? weightGoalPercentageFactors[weightGoals] : 0;  // Sets weight goals equal to percentage values, with null check
    const dailyGoal = TDEE * (1 + factorWeightGoal);

    console.log('heightInFeet:', heightInFeet);
    console.log('inches:', inches);
    console.log('weightInPounds:', weightInPounds);
    console.log('age:', age);
    console.log('gender:', gender);
    console.log('activityLevel:', activityLevel);
    console.log('weightGoals:', weightGoals);

    // Perform calculations...

    console.log('BMR:', BMR);
    console.log('TDEE:', TDEE);
    console.log('dailyGoal:', dailyGoal);

    return dailyGoal;
  }

  // Function for entering daily consumed calories
  const EnterCaloriesConsumed = ({ dailyGoal }: { dailyGoal: number }) => {
    // Variables for entering calories
    const [mealCalories, setMealCalories] = useState('');
    const [totalCaloriesConsumed, setTotalCaloriesConsumed] = useState(0);
    const [goalReached, setGoalReached] = useState(false);

    // Defines daily goal from daily calorie calculation
    dailyGoal = Math.round(calculateDailyCalories());

    // Functions for entering calories
    const handleEnteredCalories = () => {
      const calories = parseInt(mealCalories);
      if (!isNaN(calories)) {
        const newTotalCalories = totalCaloriesConsumed + calories;
        setTotalCaloriesConsumed(newTotalCalories);
        if (newTotalCalories >= dailyGoal) {
          setGoalReached(true);
          Keyboard.dismiss();
        }
        setMealCalories('');
      }
    };

    // Returns interaction for user to enter calories
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
          Enter calories as you eat throughout the day
        </Text>
        <TextInput
          style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1, marginBottom: 20, paddingHorizontal: 10 }}
          keyboardType="numeric"
          onChangeText={text => setMealCalories(text)}
          value={mealCalories}
        />
        <Button title="Add Calories" onPress={handleEnteredCalories} />
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 20 }}>
          {totalCaloriesConsumed}/{dailyGoal}
        </Text>
        {goalReached && (
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 20, color: 'green' }}>
          You have reached your daily goal!
        </Text>
      )}
      </View>
    );
  };

  // Function to handle Next button
  const handleNext = () => 
  {
    if (currentQuestionIndex === 0) {
    // Check if an option is selected
      if (gender != null) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        // Reset selected option index for the next question (if needed)
        //setGender(null);
      } 
      else {
        // Show an alert or perform some action to inform the user to select an option
        setErrorMessageVisible(true);
      }
    }

    else if (currentQuestionIndex === 1) {
      const ageNumber = parseInt(age);
      if (!isNaN(ageNumber)) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        //setAge('');
      } 
      else {
        setErrorMessageVisible(true);
        Keyboard.dismiss();
      }
    }

    else if (currentQuestionIndex === 2) {
      const heightNumber = parseInt(heightInFeet);
      const Inches = parseInt(inches);
      if (!isNaN(heightNumber) && !isNaN(Inches) && Inches >= 0 && Inches <= 11) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        //setHeightInFeet('');
        //setInches('');
      } 
      else {
        setErrorMessageVisible(true);
        Keyboard.dismiss();
      }
    }

    else if (currentQuestionIndex === 3) {
      const weightNumber = parseInt(weightInPounds);
      if (!isNaN(weightNumber)) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        //setWeightInPounds('');
      } 
      else {
        setErrorMessageVisible(true);
        Keyboard.dismiss();
      }
    }

    else if (currentQuestionIndex === 4) {
      // Check if an option is selected
        if (activityLevel != null) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          // Reset selected option index for the next question
          //setActivityLevel(null);
        } 
        else {
          // Show an alert or perform some action to inform the user to select an option
          setErrorMessageVisible(true);
        }
      }

      else if (currentQuestionIndex === 5) {
        if (weightGoals != null) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          //setWeightGoals(null);
        }
        else {
          setErrorMessageVisible(true);
        }
      }

      else {
        const calculatedDailyGoal = calculateDailyCalories();
        storeDailyGoalData(calculatedDailyGoal);
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
  };
  // Function to render current question
  const renderCurrentQuestion = () =>
  {
    // Switch statement to render different questions

    switch (currentQuestionIndex)
    {
      case 0:
        return(
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>Select your gender:</Text>
            {selectGender.map((option, index) => (
              <TouchableOpacity key={index} onPress={() => handleGenderSelection(index)}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 20,
                marginVertical: 5,
                backgroundColor: gender === index ? 'lightblue' : 'transparent',
              }}>
                <Text style={{ fontSize: 18 }}>{option}</Text>
              </TouchableOpacity>
            ))}
            <Button title="Next" onPress={handleNext} />
            {errorMessageVisible && (
              <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 20, color: 'red'}}>Please answer the question</Text>
            )}
          </View>
        );
      case 1:
        return(
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>Enter your age in years as a number:</Text>
            <TextInput
              style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1, marginBottom: 20, paddingHorizontal: 10 }}
              keyboardType="numeric"
              onChangeText={handleAgeInput}
              value={age}
            />
            <Button title="Next" onPress={handleNext} />
            {errorMessageVisible && (
              <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 20, color: 'red'}}>Please answer the question</Text>
            )}
          </View>
        );
      case 2:
        return(
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>Enter your height, feet in top box, inches in bottom:</Text>
            <TextInput
              style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1, marginBottom: 20, paddingHorizontal: 10 }}
              keyboardType="numeric"
              onChangeText={handleHeightInFeetInput}
              value={heightInFeet}
            />
            <TextInput
              style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1, marginBottom: 20, paddingHorizontal: 10 }}
              keyboardType="numeric"
              onChangeText={handleInches}
              value={inches}
            />
            <Button title="Next" onPress={handleNext} />
            {errorMessageVisible && (
              <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 20, color: 'red'}}>Please answer the question</Text>
            )}
          </View>
        );
      case 3:
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>Enter your weight in pounds:</Text>
            <TextInput
              style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1, marginBottom: 20, paddingHorizontal: 10 }}
              keyboardType="numeric"
              onChangeText={handleWeightInPounds}
              value={weightInPounds}
            />
            <Button title="Next" onPress={handleNext} />
            {errorMessageVisible && (
              <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 20, color: 'red'}}>Please answer the question</Text>
            )}
          </View>
        );
      case 4:
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>Select your activity level:</Text>
            {selectActivityLevel.map((option, index) => (
              <TouchableOpacity key={index} onPress={() => handleActivityLevel(index)}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 20,
                marginVertical: 5,
                backgroundColor: activityLevel === index ? 'lightblue' : 'transparent',
              }}>
                <Text style={{ fontSize: 14 }}>{option}</Text>
              </TouchableOpacity>
            ))}
            <Button title="Next" onPress={handleNext} />
            {errorMessageVisible && (
              <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 20, color: 'red'}}>Please answer the question</Text>
            )}
          </View>
        );
      case 5:
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>What are your goals?</Text>
            {selectWeightGoal.map((option, index) => (
              <TouchableOpacity key={index} onPress={() => handleWeightGoal(index)}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 20,
                marginVertical: 5,
                backgroundColor: weightGoals === index ? 'lightblue' : 'transparent',
              }}>
                <Text style={{ fontSize: 18 }}>{option}</Text>
              </TouchableOpacity>
            ))}
            <Button title="Next" onPress={handleNext} />
            {errorMessageVisible && (
              <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 20, color: 'red'}}>Please answer the question</Text>
            )}
          </View>
        );
      case 6:
        const calcDailyCalories = calculateDailyCalories();
        const roundedDailyCalories = Math.round(calcDailyCalories);
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>Your daily calorie goal:</Text>
            <Text style={{ fontSize: 18 }}>{roundedDailyCalories}</Text>
            <Button title="Next" onPress={handleNext} />
          </View>
        );
      default:
        
        return (
          <>
          <EnterCaloriesConsumed dailyGoal={calculateDailyCalories()} />
          </>
        );
    }
  };

  // Return rendered question or calorie entry page
  return (
    <View style={{flex: 1}}>
      {renderCurrentQuestion()}
    </View>
  );
};

export default calorieCounter;

function alert(error: unknown) {
  throw new Error('Function not implemented.');
}
