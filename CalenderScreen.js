import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ImageBackground } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Button } from 'react-native'; // Keep Button for now to show the deprecation fix in the provided solution

const CalendarScreen = ({ navigation }) => {
  // Get the current date in YYYY-MM-DD format
  const currentDate = new Date().toISOString().split('T')[0];

  const handleDatePress = (todayDate) => {
    // Navigate to the prayer screen when a date is pressed
    navigation.navigate('Prayer', todayDate);
  };
  const handlePreviousRecord = () => {
    // Navigate to the previous record screen
    navigation.navigate('Record');
  };

  return (
    <ImageBackground
      source={require('./assets/bg2.jpg')} // Path to your calendar background image
      style={styles.backgroundImage}
      resizeMode="cover" // Cover the entire background
    >
      <View style={styles.container}>
        <Calendar
          markedDates={{
            [currentDate]: { selected: true, marked: true, selectedColor: 'black', textColor: 'white' },
          }}
          theme={{
            backgroundColor: 'transparent', // Make calendar background transparent to show ImageBackground
            calendarBackground: 'transparent', // Make calendar background transparent
            textSectionTitleColor: '#b6c1cd',
            dayTextColor: 'black',
            textDisabledColor: '#d9e1e8',
            arrowColor: '#00adf5',
            monthTextColor: '#000000',
            textMonthFontWeight: 'bold',
            textDayFontFamily: 'monospace',
            textMonthFontFamily: 'monospace',
            textDayHeaderFontFamily: 'monospace',
            textDayFontSize: 16,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 16,
          }}
          onDayPress={(day) => handleDatePress(day.dateString)}
        />
        <View style={styles.buttonContainer}>
          {/* Replaced Button with TouchableOpacity for better styling and to address deprecation */}
          <TouchableOpacity style={styles.recordButton} onPress={handlePreviousRecord}>
            <Text style={styles.recordButtonText}>Previous Record</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.7)', // Semi-transparent white overlay for readability
    paddingTop: 50, // Adjust as needed for spacing
  },
  buttonContainer: {
    width: 200,
    marginVertical: 20,
    alignSelf: 'center',
  },
  recordButton: {
    backgroundColor: 'purple',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 20,
  },
  recordButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CalendarScreen;