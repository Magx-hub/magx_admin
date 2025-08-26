import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { COLORS, SIZES } from '../../constants/base';
import { useCanteen } from '../../hooks/useCanteen';
import ReportTabs from './ReportTabs';
import DateRangeSelector from './DateRangeSelector';
import DailySummaryReport from './DailySummaryReport';
import DepartmentReport from './DepartmentReport';
import PaymentHistoryReport from './PaymentHistoryReport';
import AnalyticsReport from './AnalyticsReport';

export default function CanteenReports() {
  const {
    dailySummary,
    departmentSummary,
    fetchDailySummary,
    fetchDepartmentSummary,
    fetchPaymentHistory,
    currentDate,
    changeCurrentDate,
  } = useCanteen();

  // State
  const [selectedReport, setSelectedReport] = useState('daily');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Set default dates
  useEffect(() => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    
    setStartDate(firstDay.toISOString().split('T')[0]);
    setEndDate(today.toISOString().split('T')[0]);
  }, []);

  // Load data when dates change
  useEffect(() => {
    if (startDate && endDate) {
      fetchDailySummary(startDate);
      fetchDepartmentSummary(startDate);
      loadPaymentHistory();
    }
  }, [startDate, endDate]);

  // Load payment history
  const loadPaymentHistory = async () => {
    if (!startDate || !endDate) return;
    
    try {
      setLoadingHistory(true);
      const history = await fetchPaymentHistory(startDate, endDate);
      setPaymentHistory(history);
    } catch (error) {
      console.error('Error loading payment history:', error);
      Alert.alert('Error', 'Failed to load payment history');
    } finally {
      setLoadingHistory(false);
    }
  };

  // Render current report content
  const renderCurrentReport = () => {
    switch (selectedReport) {
      case 'daily':
        return (
          <DailySummaryReport
            dailySummary={dailySummary}
            startDate={startDate}
          />
        );
      case 'department':
        return (
          <DepartmentReport
            departmentSummary={departmentSummary}
            startDate={startDate}
          />
        );
      case 'history':
        return (
          <PaymentHistoryReport
            paymentHistory={paymentHistory}
            startDate={startDate}
            endDate={endDate}
            loading={loadingHistory}
          />
        );
      case 'analytics':
        return (
          <AnalyticsReport
            paymentHistory={paymentHistory}
            startDate={startDate}
            endDate={endDate}
          />
        );
      default:
        return (
          <DailySummaryReport
            dailySummary={dailySummary}
            startDate={startDate}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      {/* Compact Header with Tabs and Date Range */}
      <View style={styles.header}>
        <ReportTabs
          selectedReport={selectedReport}
          onTabChange={setSelectedReport}
        />
        <DateRangeSelector
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onRefresh={loadPaymentHistory}
        />
      </View>
      
      {/* Report Content */}
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {renderCurrentReport()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray_light,
  },
  header: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: SIZES.padding_sm,
  },
});
