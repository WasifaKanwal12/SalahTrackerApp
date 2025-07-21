import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import Svg, { Circle, Text as SvgText, Defs } from 'react-native-svg';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStreakData } from './actions/streakActions'; // Corrected path

const StreakScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const streakCount = useSelector(state => state.streak.streakCount);

  useEffect(() => {
    dispatch(fetchStreakData());
  }, [dispatch]);

  return (
    <ImageBackground
      source={require('./assets/bg2.jpg')} // Path to your streak background image
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        {/* Menu Button - Ensure it's interactive if intended */}
        <TouchableOpacity style={styles.menuButton} onPress={() => console.log('Menu button pressed')}>
          <View style={styles.menuBar}></View>
          <View style={styles.menuBar}></View>
          <View style={styles.menuBar}></View>
        </TouchableOpacity>

        {/* Circle with Streak */}
        <View style={styles.circleContainer}>
          <Svg height="200" width="200">
            <Defs>
              <filter id="shadowOuter">
                <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="darkgrey" />
              </filter>
            </Defs>
            <Circle cx="100" cy="100" r="80" fill="white" stroke="#E5E4E2" strokeWidth="11" filter="url(#shadowOuter)" />
            <SvgText
              x="50%"
              y="50%"
              textAnchor="middle"
              fill="grey"
              fontSize={15}
              fontWeight="bold"
              dx="-3"
              dy="3"
            >
              Streak
            </SvgText>
            <SvgText
              x="50%"
              y="50%"
              textAnchor="middle"
              fill="black"
              fontSize={30}
              fontWeight="bold"
              dx="-5"
              dy="35"
            >
              {streakCount}
            </SvgText>
          </Svg>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)', // Semi-transparent white overlay for readability
  },
  menuButton: {
    position: 'absolute',
    top: 50, // Adjusted top for better spacing
    right: 20,
    padding: 10, // Increased padding for easier touch
    zIndex: 1, // Ensure it's on top
  },
  menuBar: {
    width: 25, // Slightly wider
    height: 3,
    backgroundColor: 'black',
    marginVertical: 3, // Increased margin
  },
  circleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
});

export default StreakScreen;