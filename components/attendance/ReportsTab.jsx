// ============================================================================
// components/attendance/ReportsTab.jsx
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../../constants/base';
import { generatePdf } from '../../utils/pdfGenerator';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import ReportTypeSelector from './ReportTypeSelector';
import DateFilters from './DateFilters';
import TeacherFilter from './TeacherFilter';
import WeekFilter from './WeekFilter';
import ReportStats from './ReportStats';
import ActionButtons from './ActionButtons';

const ReportsTab = ({ 
  attendances, 
  teachers, 
  loading, 
  error,
  getAttendanceByDateRange,
  getWeeklyAttendanceStats,
  getAllTeachersAttendanceSummary
}) => {
  const [reportType, setReportType] = useState('all'); // 'all', 'teacher', 'week'
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [generatingReport, setGeneratingReport] = useState(false);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [showWeekModal, setShowWeekModal] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [reportStats, setReportStats] = useState(null);

  // Get unique weeks from attendances
  const weeks = [...new Set(attendances.map(item => item.weekNum))].sort((a, b) => a - b);

  // Get current date for default date range
  useEffect(() => {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    
    setStartDate(lastMonth.toISOString().split('T')[0]);
    setEndDate(today.toISOString().split('T')[0]);
  }, []);

  // Filter data based on report type and filters
  useEffect(() => {
    filterData();
  }, [reportType, selectedTeacher, selectedWeek, startDate, endDate, attendances]);

  const filterData = async () => {
    try {
      let data = [];
      let stats = null;

      switch (reportType) {
        case 'all':
          if (startDate && endDate) {
            data = await getAttendanceByDateRange(startDate, endDate);
            stats = calculateStats(data);
          }
          break;
        
        case 'teacher':
          if (selectedTeacher && startDate && endDate) {
            data = await getAttendanceByDateRange(startDate, endDate, { teacherId: selectedTeacher.id });
            stats = calculateStats(data);
          }
          break;
        
        case 'week':
          if (selectedWeek) {
            data = await getWeeklyAttendanceStats(selectedWeek);
            stats = calculateWeekStats(data);
          }
          break;
      }

      setFilteredData(data || []);
      setReportStats(stats);
    } catch (error) {
      console.error('Error filtering data:', error);
    }
  };

  const calculateStats = (data) => {
    if (!data || data.length === 0) return null;

    const totalRecords = data.length;
    const presentCount = data.filter(item => item.status === 'Present').length;
    const absentCount = data.filter(item => item.status === 'Absent').length;
    const lateCount = data.filter(item => item.status === 'Late').length;
    const halfDayCount = data.filter(item => item.status === 'Half Day').length;
    const avgWorkHours = totalRecords > 0 ? data.reduce((sum, item) => sum + (item.workHours || 0), 0) / totalRecords : 0;

    return {
      totalRecords,
      presentCount,
      absentCount,
      lateCount,
      halfDayCount,
      avgWorkHours,
      attendanceRate: totalRecords > 0 ? Math.round((presentCount / totalRecords) * 100) : 0
    };
  };

  const calculateWeekStats = (data) => {
    if (!data || data.length === 0) return null;

    const totalTeachers = data.length;
    const totalDaysTracked = data.reduce((sum, item) => sum + (item.daysTracked || 0), 0);
    const totalPresentDays = data.reduce((sum, item) => sum + (item.presentDays || 0), 0);
    const totalWorkHours = data.reduce((sum, item) => sum + (item.totalWorkHours || 0), 0);
    const avgWorkHours = totalDaysTracked > 0 ? totalWorkHours / totalDaysTracked : 0;

    return {
      totalTeachers,
      totalDaysTracked,
      totalPresentDays,
      totalWorkHours,
      avgWorkHours,
      attendanceRate: totalDaysTracked > 0 ? Math.round((totalPresentDays / totalDaysTracked) * 100) : 0
    };
  };

  const generateReport = async () => {
    if (!filteredData || filteredData.length === 0) {
      Alert.alert('No Data', 'No data available for the selected filters');
      return;
    }

    setGeneratingReport(true);
    try {
      const filters = {
        startDate: startDate || 'N/A',
        endDate: endDate || 'N/A',
        teacherId: selectedTeacher?.id,
        weekNum: selectedWeek,
        reportType
      };

      const pdfUri = await generatePdf(filteredData, filters);
      
      // Share the PDF
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(pdfUri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Share Attendance Report'
        });
      } else {
        // Fallback: print the PDF
        await Print.printAsync({ uri: pdfUri });
      }

      Alert.alert('Success', 'Report generated and shared successfully!');
    } catch (error) {
      console.error('Error generating report:', error);
      Alert.alert('Error', 'Failed to generate report. Please try again.');
    } finally {
      setGeneratingReport(false);
    }
  };

  const resetFilters = () => {
    setReportType('all');
    setSelectedTeacher(null);
    setSelectedWeek(null);
    setStartDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    setEndDate(new Date().toISOString().split('T')[0]);
  };

  const canGenerateReport = () => {
    switch (reportType) {
      case 'all':
        return startDate && endDate;
      case 'teacher':
        return selectedTeacher && startDate && endDate;
      case 'week':
        return selectedWeek;
      default:
        return false;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.accent} />
        <Text style={styles.loadingText}>Loading reports...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color={COLORS.error} />
        <Text style={styles.errorTitle}>Error Loading Reports</Text>
        <Text style={styles.errorSubtitle}>{error?.message || String(error)}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Report Type Selector */}
      <ReportTypeSelector 
        reportType={reportType} 
        onReportTypeChange={setReportType} 
      />

      {/* Date Filters */}
      <DateFilters 
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
      />

      {/* Teacher Filter */}
      {reportType === 'teacher' && (
        <TeacherFilter
          selectedTeacher={selectedTeacher}
          onTeacherSelect={setSelectedTeacher}
          teachers={teachers}
          showModal={showTeacherModal}
          onCloseModal={() => setShowTeacherModal(false)}
          onOpenModal={() => setShowTeacherModal(true)}
        />
      )}

      {/* Week Filter */}
      {reportType === 'week' && (
        <WeekFilter
          selectedWeek={selectedWeek}
          onWeekSelect={setSelectedWeek}
          weeks={weeks}
          showModal={showWeekModal}
          onCloseModal={() => setShowWeekModal(false)}
          onOpenModal={() => setShowWeekModal(true)}
        />
      )}

      {/* Report Summary */}
      <ReportStats 
        reportStats={reportStats} 
        reportType={reportType} 
      />

      {/* Action Buttons */}
      <ActionButtons
        onReset={resetFilters}
        onGenerate={generateReport}
        canGenerate={canGenerateReport}
        generatingReport={generatingReport}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6c757d',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#dc3545',
    marginTop: 16,
    marginBottom: 8,
  },
  errorSubtitle: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default ReportsTab;

