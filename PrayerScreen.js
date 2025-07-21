import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground } from 'react-native';
import CheckBox from 'expo-checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { setSelection } from './actions/prayerActions'; // Corrected path

function PrayerScreen({ navigation, route }) {
  const date = route.params;
  const dispatch = useDispatch();
  const { prayerData, selections } = useSelector((state) => state.prayer);

  useEffect(() => {
    // Save to local storage
    try {
      AsyncStorage.getItem('prayerDates').then((dates) => {
        let prayerDates = {};
        if (dates !== null) {
          prayerDates = JSON.parse(dates);
        }

        // Update or insert new prayer data for the current date
        prayerDates[date] = prayerData;

        // Sort the prayer dates
        const sortedDates = Object.keys(prayerDates).sort((a, b) => new Date(a) - new Date(b));

        // Create a new object with sorted keys
        const sortedPrayerDates = {};
        sortedDates.forEach((key) => {
          sortedPrayerDates[key] = prayerDates[key];
        });

        AsyncStorage.setItem('prayerDates', JSON.stringify(sortedPrayerDates));
        console.log('Date and prayer data added to local storage in sorted order');
      });
    } catch (error) {
      console.log('Error in saving dates', error);
    }
  }, [prayerData, date]); // Added date as a dependency for useEffect

  const handleNavigateToStreak = () => {
    navigation.navigate('Streak');
  };

  const renderPrayer = (prayer, prayerNameUrdu, prayerNameEnglish) => (
    <View style={[styles.prayerContainer, { width: '80%' }]} key={prayer}>
      <View style={styles.leftContent}>
        <Text style={styles.urduText}>{prayerNameUrdu}</Text>
        <Text style={styles.englishText}>{prayerNameEnglish}</Text>
      </View>
      <View style={styles.rightContent}>
        <View style={styles.checkboxContainer}>
          <CheckBox
            value={selections[prayer].individual}
            onValueChange={(value) => {
              dispatch(setSelection({ prayer, type: 'individual', value }));
            }}
            style={styles.checkbox}
          />
        </View>
        {/* Corrected image path and added resizeMode prop */}
        <Image style={styles.icon} source={require('./assets/individual.png')} resizeMode="contain" />
        <View style={styles.checkboxContainer}>
          <CheckBox
            value={selections[prayer].jammat}
            onValueChange={(value) => {
              dispatch(setSelection({ prayer, type: 'jammat', value }));
            }}
            style={styles.checkbox}
          />
        </View>
        {/* Corrected image path and added resizeMode prop */}
        <Image style={[styles.icon, { height: 60 }]} source={require('./assets/Jamat.png')} resizeMode="contain" />
      </View>
    </View>
  );

  return (
    <ImageBackground
      source={require('./assets/bg2.jpg')} // Path to your prayer background image
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        {renderPrayer('fajr', 'فجر', 'Fajr')}
        {renderPrayer('dhuhr', 'ظہر', 'Dhuhr')}
        {renderPrayer('asr', 'عصر', 'Asr')}
        {renderPrayer('maghrib', 'مغرب', 'Maghrib')}
        {renderPrayer('isha', 'عشاء', 'Isha')}
        <TouchableOpacity style={styles.streakButton} onPress={handleNavigateToStreak}>
          <Text style={styles.streakButtonText}>Go to Streak Page</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)', // Semi-transparent white overlay for readability
    paddingTop: 20, // Adjust as needed
  },
  prayerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderRadius: 10,
    padding: 10,
    backgroundColor: 'white', // Prayer containers remain white
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  leftContent: {
    marginRight: 10,
  },
  urduText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  englishText: {
    fontSize: 12,
    color: 'gray',
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 50,
  },
  icon: {
    width: 50,
    height: 70,
    marginHorizontal: 5,
  },
  checkbox: {
    marginRight: 5,
  },
  streakButton: {
    backgroundColor: 'purple',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20, // Added margin for spacing
  },
  streakButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white', // Changed to white for better visibility on purple
  },
});

export default PrayerScreen;