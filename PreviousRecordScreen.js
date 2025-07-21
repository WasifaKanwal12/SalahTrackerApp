import React, { useEffect, useCallback } from 'react';
import { View, StyleSheet, Text, Dimensions, ImageBackground, TouchableOpacity } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Svg, { Rect, Line, Text as SvgText } from 'react-native-svg';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPrayerRecords } from './actions/recordActions';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient for the CustomTabBar

const Tab = createMaterialTopTabNavigator();
const screenWidth = Dimensions.get('window').width;

// --- Content Components for Each Tab (defined outside PreviousRecordScreen) ---
function Last7DaysTabContent({ renderChart, prayerCountsLast7Days, TotalOfferdPrayerLast7Days, maxCounts, prayerNames, prayerColors }) {
  return (
    <View style={styles.tabContentContainer}>
      {renderChart(prayerCountsLast7Days, maxCounts.last7Days, prayerNames, prayerColors)}
      <View style={styles.prayerNamesContainer}>
        {prayerNames.map((prayer, index) => (
          <View key={index} style={styles.prayerNameItem}>
            <View style={[styles.prayerColorBox, { backgroundColor: prayerColors[index] }]} />
            <Text style={styles.prayerNameText}>{prayer}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.offeredPrayersText}>Offered - {TotalOfferdPrayerLast7Days}/35 prayers</Text>
    </View>
  );
}

function MonthlyTabContent({ renderChart, prayerCountsMonth, TotalOfferdPrayerMonth, maxCounts, prayerNames, prayerColors }) {
  return (
    <View style={styles.tabContentContainer}>
      {renderChart(prayerCountsMonth, maxCounts.monthly, prayerNames, prayerColors)}
      <View style={styles.prayerNamesContainer}>
        {prayerNames.map((prayer, index) => (
          <View key={index} style={styles.prayerNameItem}>
            <View style={[styles.prayerColorBox, { backgroundColor: prayerColors[index] }]} />
            <Text style={styles.prayerNameText}>{prayer}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.offeredPrayersText}>Offered - {TotalOfferdPrayerMonth}/150 prayers</Text>
    </View>
  );
}

function TodayTabContent({ renderChart, prayerCountsToday, TotalOfferdPrayerToday, maxCounts, prayerNames, prayerColors }) {
  return (
    <View style={styles.tabContentContainer}>
      {renderChart(prayerCountsToday, maxCounts.today, prayerNames, prayerColors)}
      <View style={styles.prayerNamesContainer}>
        {prayerNames.map((prayer, index) => (
          <View key={index} style={styles.prayerNameItem}>
            <View style={[styles.prayerColorBox, { backgroundColor: prayerColors[index] }]} />
            <Text style={styles.prayerNameText}>{prayer}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.offeredPrayersText}>Offered - {TotalOfferdPrayerToday}/5 prayers</Text>
    </View>
  );
}
// --- End Content Components ---

// --- Custom Tab Bar Component (copied and adapted from ExampleTabsScreen) ---
const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabItem}
          >
            {isFocused && (
              <LinearGradient
                colors={['#742470ff', '#cc87c6da', '#7b1385ff']} // Gradient for active tab
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.tabIndicatorGradient}
              />
            )}
            <Text
              style={[
                styles.tabLabel,
                { color: isFocused ? 'white' : 'black' } // Dynamic text color
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
// --- End Custom Tab Bar Component ---


function PreviousRecordScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {
    prayerCountsToday,
    prayerCountsLast7Days,
    prayerCountsMonth,
    TotalOfferdPrayerToday,
    TotalOfferdPrayerLast7Days,
    TotalOfferdPrayerMonth,
  } = useSelector(state => state.records);

  useEffect(() => {
    dispatch(fetchPrayerRecords());
  }, [dispatch]);

  console.log('Redux State - prayerCountsLast7Days:', prayerCountsLast7Days);
  console.log('Redux State - TotalOfferdPrayerLast7Days:', TotalOfferdPrayerLast7Days);
  console.log('Redux State - prayerCountsMonth:', prayerCountsMonth);
  console.log('Redux State - TotalOfferdPrayerMonth:', TotalOfferdPrayerMonth);
  console.log('Redux State - prayerCountsToday:', prayerCountsToday);
  console.log('Redux State - TotalOfferdPrayerToday:', TotalOfferdPrayerToday);

  const maxCounts = {
    today: 5,
    last7Days: 7,
    monthly: 31,
  };

  const prayerNames = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  const prayerColors = ['#db6244ff', '#e9c03cff', '#bd5874ff', '#698edfff', '#d17acdff'];

  const renderChart = useCallback((rawData, maxExpected, prayerLabels, barColors) => {
    const chartWidth = screenWidth - 80;
    const chartHeight = 220;
    const padding = 20;

    if (!rawData || rawData.length === 0) {
      return (
        <Svg width={chartWidth} height={chartHeight}>
          <SvgText
            x={chartWidth / 2}
            y={chartHeight / 2}
            fontSize="14"
            fill="grey"
            textAnchor="middle"
          >
            No data available
          </SvgText>
        </Svg>
      );
    }

    const numBars = rawData.length;
    const availableWidthForBars = chartWidth - 2 * padding;
    const barWidth = availableWidthForBars / (numBars * 1.5);
    const barSpacing = numBars > 1 ? (availableWidthForBars - (barWidth * numBars)) / (numBars - 1) : 0;

    const yScale = (value) => {
      return chartHeight - padding - (value / maxExpected) * (chartHeight - 2 * padding);
    };

    const xScale = (index) => {
      return padding + (index * (barWidth + barSpacing)) + (barWidth / 2);
    };

    const bars = rawData.map((value, index) => {
      const x = padding + (index * (barWidth + barSpacing));
      const y = yScale(value);
      const height = chartHeight - padding - y;
      const color = barColors[index % barColors.length];

      return (
        <Rect
          key={`bar-${index}`}
          x={x}
          y={y}
          width={barWidth}
          height={height}
          fill={color}
        />
      );
    });

    const xAxisLabels = prayerLabels.map((label, index) => (
      <SvgText
        key={`x-label-${index}`}
        x={xScale(index)}
        y={chartHeight - padding + 15}
        fontSize="10"
        fill="black"
        textAnchor="middle"
      >
        {label}
      </SvgText>
    ));

    const yAxisLines = [];
    const yAxisLabels = [];
    const numberOfTicks = maxExpected + 1;

    for (let i = 0; i <= maxExpected; i++) {
      const yPos = yScale(i);
      yAxisLines.push(
        <Line
          key={`y-line-${i}`}
          x1={padding}
          y1={yPos}
          x2={chartWidth - padding}
          y2={yPos}
          stroke="lightgrey"
          strokeWidth="0.5"
        />
      );
      yAxisLabels.push(
        <SvgText
          key={`y-label-${i}`}
          x={padding - 10}
          y={yPos + 3}
          fontSize="10"
          fill="grey"
          textAnchor="end"
        >
          {i}
        </SvgText>
      );
    }

    return (
      <View style={styles.chartContainer}>
        <Svg width={chartWidth} height={chartHeight}>
          {yAxisLines}
          {bars}
          {xAxisLabels}
          {yAxisLabels}
          <Line
            x1={padding}
            y1={chartHeight - padding}
            x2={chartWidth - padding}
            y2={chartHeight - padding}
            stroke="black"
            strokeWidth="1"
          />
          <Line
            x1={padding}
            y1={padding}
            x2={padding}
            y2={chartHeight - padding}
            stroke="black"
            strokeWidth="1"
          />
        </Svg>
      </View>
    );
  }, [screenWidth]);

  return (
    <ImageBackground
      source={require('./assets/bg2.jpg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Tab.Navigator
          // FIX: Use the CustomTabBar component here
          tabBar={props => <CustomTabBar {...props} />}
        >
          <Tab.Screen
            name="Last 7 Days"
            options={{ tabBarLabel: 'Last 7 Days' }}
            component={({ navigation: tabNavigation, route }) => (
              <Last7DaysTabContent
                navigation={tabNavigation}
                route={route}
                renderChart={renderChart}
                prayerCountsLast7Days={prayerCountsLast7Days}
                TotalOfferdPrayerLast7Days={TotalOfferdPrayerLast7Days}
                maxCounts={maxCounts}
                prayerNames={prayerNames}
                prayerColors={prayerColors}
              />
            )}
          />
          <Tab.Screen
            name="Monthly"
            options={{ tabBarLabel: 'Monthly' }}
            component={({ navigation: tabNavigation, route }) => (
              <MonthlyTabContent
                navigation={tabNavigation}
                route={route}
                renderChart={renderChart}
                prayerCountsMonth={prayerCountsMonth}
                TotalOfferdPrayerMonth={TotalOfferdPrayerMonth}
                maxCounts={maxCounts}
                prayerNames={prayerNames}
                prayerColors={prayerColors}
              />
            )}
          />
          <Tab.Screen
            name="Today"
            options={{ tabBarLabel: 'Today' }}
            component={({ navigation: tabNavigation, route }) => (
              <TodayTabContent
                navigation={tabNavigation}
                route={route}
                renderChart={renderChart}
                prayerCountsToday={prayerCountsToday}
                TotalOfferdPrayerToday={TotalOfferdPrayerToday}
                maxCounts={maxCounts}
                prayerNames={prayerNames}
                prayerColors={prayerColors}
              />
            )}
          />
        </Tab.Navigator>

       

      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    flexDirection: 'column',
  },
  tabContentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 20,
  },
  chartContainer: {
    marginVertical: 8,
    borderRadius: 16,
    backgroundColor: 'white',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    width: screenWidth - 40,
    height: 220,
  },
  prayerNamesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  prayerNameItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 5,
  },
  prayerColorBox: {
    width: 10,
    height: 10,
    marginRight: 5,
  },
  prayerNameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  offeredPrayersText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 20,
  },
  navigateButton: {
    marginTop: 30,
    marginBottom: 20,
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 25,
    backgroundColor: '#6200ee',
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  navigateButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Styles for CustomTabBar - copied from ExampleTabsScreen
  tabBarContainer: {
    flexDirection: 'row',
    marginTop: 20,
    backgroundColor: 'white', // Background of the entire tab bar strip
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginHorizontal: 20, // Add some horizontal margin for the tab bar itself
    overflow: 'hidden', // Ensures the inner elements respect the border radius
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50, // Height of your individual tab item
    borderRadius: 30, // Apply border radius to each tab item for consistent look
    overflow: 'hidden', // Crucial for gradient to respect border radius
  },
  tabLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    zIndex: 1, // IMPORTANT: Ensure text is above the gradient
    // The color is set dynamically in the component
  },
  tabIndicatorGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 30, // Match the border radius of the tabItem
    zIndex: 0, // IMPORTANT: Ensure the gradient is behind the text
  },
});

export default PreviousRecordScreen;
