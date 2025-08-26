import { View, Text, ScrollView, TouchableOpacity, StatusBar, SafeAreaView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTeachers } from '../hooks/useTeachers';
import { useAttendance } from '../hooks/useAttendance';
import { useCanteen } from '../hooks/useCanteen'; // Import useCanteen
import { COLORS, SIZES, FONTS, STYLES } from '../constants/base';
import { useState, useEffect } from 'react';
import BackupButton from '../components/BackupButton';

// Canteen Report Table Component
const CanteenReportTable = ({ data, loading }) => {
  if (loading) {
    return <ActivityIndicator size="large" color={COLORS.primary} style={{ marginVertical: 20 }} />;
  }

  if (!data || data.length === 0) {
    return <Text style={STYLES.emptySubtitle}>No canteen data available for the selected period.</Text>;
  }

  return (
    <View style={[STYLES.section, { marginTop: 20 }]}>
      <Text style={STYLES.sectionTitle}>Canteen Summary (Last 30 Days)</Text>
      <View style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: SIZES.borderRadius }}>
        {/* Table Header */}
        <View style={[STYLES.tableRow, { backgroundColor: COLORS.primaryLight }]}>
          <View style={STYLES.tableCell}>
            <Text style={STYLES.tableHeaderText}>Department</Text>
          </View>
          <View style={[STYLES.tableCell, { flex: 0.5, alignItems: 'flex-end' }]}>
            <Text style={STYLES.tableHeaderText}>Total</Text>
          </View>
        </View>

        {/* Table Body */}
        {data.map((item, index) => (
          <View key={index} style={STYLES.tableRow}>
            <View style={STYLES.tableCell}>
              <Text style={STYLES.tableCellText}>{item.department}</Text>
            </View>
            <View style={[STYLES.tableCell, { flex: 0.5, alignItems: 'flex-end' }]}>
              <Text style={STYLES.tableCellText}>GH₵ {item.totalAmount.toFixed(2)}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default function Dashboard() {
  const { teachers, stats: teacherStats } = useTeachers();
  const { stats: attendanceStats } = useAttendance();
  const { aggregatedPayments, loadingAggregatedPayments, fetchAggregatedPayments } = useCanteen();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    // Fetch canteen data
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const today = new Date();
    
    fetchAggregatedPayments(
      'department',
      thirtyDaysAgo.toISOString().split('T')[0],
      today.toISOString().split('T')[0]
    );

    return () => clearInterval(timer);
  }, [fetchAggregatedPayments]);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <StatusBar backgroundColor={COLORS.accent} barStyle="light-content" />

        {/* <HorizontalTabs /> */}
        <ScrollView style={[STYLES.container, { paddingHorizontal: 20 }]}>
          {/* Welcome Section with Time */}
          <View style={STYLES.welcomeSection}>
            <View>
              <Text style={STYLES.welcomeTitle}>Welcome Back!</Text>
              <Text style={STYLES.welcomeSubtitle}>{formatDate(currentTime)}</Text>
              <Text style={STYLES.welcomeTime}>{formatTime(currentTime)}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity style={STYLES.notificationButton}>
                <Ionicons name="notifications-outline" size={24} color={COLORS.primary} />
              </TouchableOpacity>
              <BackupButton />
            </View>
          </View>

          {/* Statistics Cards */}
          <View style={STYLES.statsContainer}>
            <Text style={STYLES.sectionTitle}>Overview</Text>
            <View style={STYLES.statsGrid}>
              <View style={[STYLES.statCard, { borderLeftWidth: 4, borderLeftColor: COLORS.primary }]}>
                <Ionicons name="people" size={28} color={COLORS.primary} />
                <Text style={STYLES.statValue}>{teacherStats?.totalTeachers || 0}</Text>
                <Text style={STYLES.statLabel}>Teachers</Text>
                <Text style={STYLES.statSubtext}>Active staff</Text>
              </View>

              <View style={[STYLES.statCard, { borderLeftWidth: 4, borderLeftColor: COLORS.success }]}>
                <Ionicons name="calendar" size={28} color={COLORS.success} />
                <Text style={STYLES.statValue}>92%</Text>
                <Text style={STYLES.statLabel}>Attendance</Text>
                <Text style={STYLES.statSubtext}>This week</Text>
              </View>

              <View style={[STYLES.statCard, { borderLeftWidth: 4, borderLeftColor: COLORS.info }]}>
                <Ionicons name="business" size={28} color={COLORS.info} />
                <Text style={STYLES.statValue}>{teacherStats?.totalDepartments || 0}</Text>
                <Text style={STYLES.statLabel}>Classes</Text>
                <Text style={STYLES.statSubtext}>Active classes</Text>
              </View>

              <View style={[STYLES.statCard, { borderLeftWidth: 4, borderLeftColor: COLORS.warning }]}>
                <Ionicons name="calculator" size={28} color={COLORS.warning} />
                <Text style={STYLES.statValue}>GH₵2.4K</Text>
                <Text style={STYLES.statLabel}>Allowance</Text>
                <Text style={STYLES.statSubtext}>This month</Text>
              </View>
            </View>
          </View>

          {/* Canteen Report Table */}
          <CanteenReportTable data={aggregatedPayments} loading={loadingAggregatedPayments} />

          {/* Main Navigation Sections */}
          <View style={STYLES.sectionsContainer}>
            <Text style={STYLES.sectionTitle}>Main Sections</Text>
            
            {/* Teachers Section */}
            <TouchableOpacity 
              style={[STYLES.sectionCard, { borderLeftWidth: 4, borderLeftColor: COLORS.primary }]}
              onPress={() => router.push('/(teacher)')}
            >
              <View style={STYLES.sectionHeader}>
                <View style={[STYLES.sectionIcon, { backgroundColor: COLORS.primary }]}>
                  <Ionicons name="people" size={32} color={COLORS.white} />
                </View>
                <View style={STYLES.sectionContent}>
                  <Text style={STYLES.sectionTitle}>Teachers Management</Text>
                  <Text style={STYLES.sectionDescription}>
                    Manage teacher profiles, departments, and contact information
                  </Text>
                  <View style={STYLES.sectionStats}>
                    <Text style={STYLES.sectionStatsText}>
                      {teacherStats?.totalTeachers || 0} teachers • {teacherStats?.totalDepartments || 0} departments
                    </Text>
                  </View>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color={COLORS.gray} />
            </TouchableOpacity>

            {/* Attendance Section */}
            <TouchableOpacity 
              style={[STYLES.sectionCard, { borderLeftWidth: 4, borderLeftColor: COLORS.success }]}
              onPress={() => router.push('/(attendance)')}
            >
              <View style={STYLES.sectionHeader}>
                <View style={[STYLES.sectionIcon, { backgroundColor: COLORS.success }]}>
                  <Ionicons name="calendar" size={32} color={COLORS.white} />
                </View>
                <View style={STYLES.sectionContent}>
                  <Text style={STYLES.sectionTitle}>Attendance Tracking</Text>
                  <Text style={STYLES.sectionDescription}>
                    Track daily attendance, work hours, and generate reports
                  </Text>
                  <View style={STYLES.sectionStats}>
                    <Text style={STYLES.sectionStatsText}>
                      92% attendance rate • Week 3 of 16
                    </Text>
                  </View>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color={COLORS.gray} />
            </TouchableOpacity>

            {/* Allowance Section */}
            <TouchableOpacity 
              style={[STYLES.sectionCard, { borderLeftWidth: 4, borderLeftColor: COLORS.warning }]}
              onPress={() => router.push('/(allowance)')}
            >
              <View style={STYLES.sectionHeader}>
                <View style={[STYLES.sectionIcon, { backgroundColor: COLORS.warning }]}>
                  <Ionicons name="calculator" size={32} color={COLORS.white} />
                </View>
                <View style={STYLES.sectionContent}>
                  <Text style={STYLES.sectionTitle}>Friday Allowance</Text>
                  <Text style={STYLES.sectionDescription}>
                    Calculate weekly allowances, view history, and generate reports
                  </Text>
                  <View style={STYLES.sectionStats}>
                    <Text style={STYLES.sectionStatsText}>
                      GH₵2,450 total • 5 calculations this month
                    </Text>
                  </View>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color={COLORS.gray} />
            </TouchableOpacity>


            {/* Students Section */}
            <TouchableOpacity 
              style={[STYLES.sectionCard, { borderLeftWidth: 4, borderLeftColor: COLORS.warning }]}
              onPress={() => router.push('/(students)')}
            >
              <View style={STYLES.sectionHeader}>
                <View style={[STYLES.sectionIcon, { backgroundColor: COLORS.accent }]}>
                  <Ionicons name="person" size={32} color={COLORS.white} />
                </View>
                <View style={STYLES.sectionContent}>
                  <Text style={STYLES.sectionTitle}>Students</Text>
                  <Text style={STYLES.sectionDescription}>
                    Manage student records, attendance, and performance
                  </Text>
                  <View style={STYLES.sectionStats}>
                    <Text style={STYLES.sectionStatsText}>
                      GH₵2,450 total • 5 calculations this month
                    </Text>
                  </View>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color={COLORS.gray} />
            </TouchableOpacity>

            {/* Canteen Section */}
            <TouchableOpacity 
              style={[STYLES.sectionCard, { borderLeftWidth: 4, borderLeftColor: COLORS.warning }]}
              onPress={() => router.push('/(canteen)')}
            >
              <View style={STYLES.sectionHeader}>
                <View style={[STYLES.sectionIcon, { backgroundColor: COLORS.accent }]}>
                  <Ionicons name="restaurant" size={32} color={COLORS.white} />
                </View>
                <View style={STYLES.sectionContent}>
                  <Text style={STYLES.sectionTitle}>Canteen</Text>
                  <Text style={STYLES.sectionDescription}>
                    Manage canteen payments, inventory, and sales
                  </Text>
                  <View style={STYLES.sectionStats}>
                    <Text style={STYLES.sectionStatsText}>
                      GH₵2,450 total • 5 calculations this month
                    </Text>
                  </View>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color={COLORS.gray} />
            </TouchableOpacity>



          </View>

        </ScrollView> 
      </SafeAreaView>
  );
}

// All styles are now consolidated in constants/base.js as STYLES
// This component now uses the unified styling system
