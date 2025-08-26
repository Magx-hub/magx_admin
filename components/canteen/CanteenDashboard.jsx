import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { COLORS, SIZES } from '../../constants/base';
import { useCanteen } from '../../hooks/useCanteen';
import DateNavigation from './DateNavigation';
import DailySummary from './DailySummary';
import DepartmentSummary from './DepartmentSummary';
import RecentPayments from './RecentPayments';
import QuickActions from './QuickActions';

export default function CanteenDashboard() {
  const {
    dailyPayments,
    currentDate,
    dailySummary,
    departmentSummary,
    loadingDailyPayments,
    loadingDailySummary,
    loadingDepartmentSummary,
    goToPreviousDay,
    goToNextDay,
    goToToday,
  } = useCanteen();

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Date Navigation */}
        <DateNavigation
          currentDate={currentDate}
          onPreviousDay={goToPreviousDay}
          onNextDay={goToNextDay}
          onToday={goToToday}
        />
        
        {/* Daily Summary */}
        <DailySummary
          dailySummary={dailySummary}
          loading={loadingDailySummary}
        />
        
        {/* Department Summary */}
        <DepartmentSummary
          departmentSummary={departmentSummary}
          loading={loadingDepartmentSummary}
        />
        
        {/* Recent Payments */}
        <RecentPayments
          dailyPayments={dailyPayments}
          loading={loadingDailyPayments}
        />
        
        {/* Quick Actions */}
        <QuickActions />
        
        {/* Bottom Spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray_light,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: SIZES.padding,
  },
});
