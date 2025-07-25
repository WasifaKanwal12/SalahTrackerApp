import React, { useEffect, useCallback } from 'react';
import { View, StyleSheet, Text, Dimensions, ImageBackground, TouchableOpacity } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Svg, { Rect, Line, Text as SvgText } from 'react-native-svg';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPrayerRecords } from './actions/recordActions';
import { useNavigation } from '@react-navigation/native';


const Tab = createMaterialTopTabNavigator();
const screenWidth = Dimensions.get('window').width;

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
    const availableWidthForBars = chartWidth - (2 * padding);

    let barWidth;
    let barSpacing;

    if (numBars > 0) {
      const totalBarSpaceRatio = 0.7;
      barWidth = (availableWidthForBars * totalBarSpaceRatio) / numBars;

      if (barWidth < 5) {
          barWidth = 5;
      }
      barSpacing = numBars > 1 ? (availableWidthForBars - (barWidth * numBars)) / (numBars - 1) : 0;

      if (barSpacing < 0) {
          barSpacing = 0;
      }
    } else {

      barWidth = 0;
      barSpacing = 0;
    }


    const yScale = (value) => {

      if (maxExpected === 0) return chartHeight - padding;
      const safeValue = value || 0;
      return chartHeight - padding - (safeValue / maxExpected) * (chartHeight - (2 * padding));
    };

    const xScale = (index) => {
      const safeBarWidth = isNaN(barWidth) ? 0 : barWidth;
      const safeBarSpacing = isNaN(barSpacing) ? 0 : barSpacing;
      return padding + (index * (safeBarWidth + safeBarSpacing)) + (safeBarWidth / 2);
    };

    const bars = rawData.map((value, index) => {
      const x = padding + (index * (barWidth + barSpacing));
      const y = yScale(value);
      const height = chartHeight - padding - y;
      const color = barColors[index % barColors.length];
      const displayHeight = height > 0 ? height : 1;
      const displayY = height > 0 ? y : chartHeight - padding - 1;


      return (
        <Rect
          key={`bar-${index}`}
          x={isNaN(x) ? 0 : x}
          y={isNaN(displayY) ? chartHeight - padding - 1 : displayY}
          width={isNaN(barWidth) ? 0 : barWidth}
          height={isNaN(displayHeight) ? 1 : displayHeight}
          fill={color}
          rx={3}
          ry={3}
        />
      );
    });

    const xAxisLabels = prayerLabels.map((label, index) => (
      <SvgText
        key={`x-label-${index}`}
        x={isNaN(xScale(index)) ? 0 : xScale(index)}
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
    for (let i = 0; i <= maxExpected; i++) {
      const yPos = yScale(i);
      yAxisLines.push(
        <Line
          key={`y-line-${i}`}
          x1={padding}
          y1={isNaN(yPos) ? chartHeight - padding : yPos}
          x2={chartWidth - padding}
          y2={isNaN(yPos) ? chartHeight - padding : yPos}
          stroke="lightgrey"
          strokeWidth="0.5"
          strokeDasharray="2,2"
        />
      );
      yAxisLabels.push(
        <SvgText
          key={`y-label-${i}`}
          x={padding - 10}
          y={isNaN(yPos) ? chartHeight - padding + 3 : yPos + 3}
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
          screenOptions={{
            tabBarActiveTintColor: 'white',
            tabBarInactiveTintColor: 'black',
            tabBarLabelStyle: { fontSize: 16, fontWeight: 'bold' },
            tabBarStyle: {
              marginTop: 20,
              backgroundColor: 'white',
              borderRadius: 30,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
              marginHorizontal: 20,
              overflow: 'hidden',
              height: 50,
            },
            tabBarIndicatorStyle: {
              backgroundColor: '#7b1385ff',
              height: '100%',
              borderRadius: 30,
              zIndex: -1,
            },
            tabBarPressColor: 'rgba(116, 36, 112, 0.2)',
          }}
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

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    flexDirection: 'column',
  },
   backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
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
});

export default PreviousRecordScreen;
