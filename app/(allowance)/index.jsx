import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Animated,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { COLORS, SIZES, FONTS, STYLES } from '../../constants/base';
import { useAllowance } from '../../hooks/useAllowance';

export default function AllowanceDashboard() {
  const [summary, setSummary] = useState(null);
  const [recentCalculations, setRecentCalculations] = useState([]);
  const [fadeAnim] = useState(new Animated.Value(0));
  const { allowances, fetchAllowances } = useAllowance();

  useEffect(() => {
    loadDashboardData();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (allowances.length > 0) {
      updateDashboardData();
    }
  }, [allowances]);

  const loadDashboardData = async () => {
    try {
      await fetchAllowances();
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const updateDashboardData = () => {
    try {
      if (allowances.length > 0) {
        setRecentCalculations(allowances.slice(0, 5));
        
        // Calculate summary
        const totalCalculations = allowances.length;
        const totalAmount = allowances.reduce((sum, calc) => sum + calc.totalSum, 0);
        const totalTeachers = allowances.reduce((sum, calc) => sum + calc.numberOfTeachers, 0);
        
        setSummary({
          totalCalculations,
          totalAmount,
          averagePerTeacher: totalTeachers > 0 ? totalAmount / totalTeachers : 0,
          lastCalculation: (() => {
            if (allowances[0]?.createdAt) {
              try {
                const date = new Date(allowances[0].createdAt);
                if (!isNaN(date.getTime())) {
                  return date.toLocaleDateString();
                }
              } catch (e) {
                console.log('Error parsing date:', allowances[0].createdAt, e);
              }
            }
            return 'Never';
          })()
        });
      }
    } catch (error) {
      console.error('Error updating dashboard data:', error);
    }
  };

  const clearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to delete all calculations? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            // Note: This would need to be implemented to clear the database
            // For now, just clear the local state
            setSummary(null);
            setRecentCalculations([]);
            Alert.alert('Info', 'Database clearing functionality needs to be implemented');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.gray_light }}>
      <StatusBar backgroundColor={COLORS.accent} barStyle="light-content" />
       
      {/* Header */}
      <View style={STYLES.header}>
        <Text style={STYLES.headerTitle}>Allowance Dashboard</Text>
        <TouchableOpacity 
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            width: 44,
            height: 44,
            borderRadius: 22,
            justifyContent: 'center',
            alignItems: 'center',
          }} 
          onPress={() => router.push('/')}
        >
          <Ionicons name="home" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <ScrollView 
          style={{ flex: 1 }} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View style={STYLES.container}>
            {/* Summary Statistics */}
            <View style={STYLES.statsContainer}>
              <View style={STYLES.statsGrid}>
                <View style={STYLES.statCard}>
                  <Ionicons name="calculator-outline" size={SIZES.icon_lg} color={COLORS.primary} />
                  <Text style={STYLES.statValue}>{summary?.totalCalculations || 0}</Text>
                  <Text style={STYLES.statLabel}>Total Calculations</Text>
                </View>
                
                <View style={STYLES.statCard}>
                  <Ionicons name="cash-outline" size={SIZES.icon_lg} color={COLORS.success} />
                  <Text style={STYLES.statValue}>₵{summary?.totalAmount?.toFixed(0) || '0'}</Text>
                  <Text style={STYLES.statLabel}>Total Amount</Text>
                  <Text style={STYLES.statSubtext}>GHS</Text>
                </View>
                
                <View style={STYLES.statCard}>
                  <Ionicons name="people-outline" size={SIZES.icon_lg} color={COLORS.info} />
                  <Text style={STYLES.statValue}>₵{summary?.averagePerTeacher?.toFixed(0) || '0'}</Text>
                  <Text style={STYLES.statLabel}>Avg Per Teacher</Text>
                  <Text style={STYLES.statSubtext}>GHS</Text>
                </View>
                
                <View style={STYLES.statCard}>
                  <Ionicons name="time-outline" size={SIZES.icon_lg} color={COLORS.warning} />
                  <Text style={[STYLES.statLabel, { marginTop: 8, fontSize: 12 }]}>
                    Last Calculation
                  </Text>
                  <Text style={[STYLES.statSubtext, { marginTop: 4, fontSize: 11, textAlign: 'center' }]}>
                    {summary?.lastCalculation || 'Never'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Quick Actions */}
            <View style={STYLES.quickActionsContainer}>
              <Text style={STYLES.sectionTitle}>Quick Actions</Text>
              <View style={STYLES.quickActionsGrid}>
                <TouchableOpacity 
                  style={STYLES.quickActionCard}
                  onPress={() => router.push('/(allowance)/calculator')}
                  activeOpacity={0.7}
                >
                  <View style={[
                    STYLES.sectionIcon,
                    { backgroundColor: COLORS.primary + '15' }
                  ]}>
                    <Ionicons name="calculator-outline" size={28} color={COLORS.primary} />
                  </View>
                  <Text style={STYLES.quickActionText}>Calculator</Text>
                  <Text style={STYLES.sectionDescription}>Create new allowance calculations</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={STYLES.quickActionCard}
                  onPress={() => router.push('/(allowance)/history')}
                  activeOpacity={0.7}
                >
                  <View style={[
                    STYLES.sectionIcon,
                    { backgroundColor: COLORS.info + '15' }
                  ]}>
                    <Ionicons name="time-outline" size={28} color={COLORS.info} />
                  </View>
                  <Text style={STYLES.quickActionText}>History</Text>
                  <Text style={STYLES.sectionDescription}>View past calculations</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={STYLES.quickActionCard}
                  onPress={() => router.push('/(allowance)/reports')}
                  activeOpacity={0.7}
                >
                  <View style={[
                    STYLES.sectionIcon,
                    { backgroundColor: COLORS.success + '15' }
                  ]}>
                    <Ionicons name="document-text-outline" size={28} color={COLORS.success} />
                  </View>
                  <Text style={STYLES.quickActionText}>Reports</Text>
                  <Text style={STYLES.sectionDescription}>Generate PDF reports</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Recent Calculations */}
            <View style={STYLES.sectionsContainer}>
              <Text style={STYLES.sectionTitle}>Recent Calculations</Text>
              {recentCalculations.length === 0 ? (
                <View style={STYLES.emptyState}>
                  <Ionicons name="calculator-outline" size={64} color={COLORS.gray} />
                  <Text style={STYLES.emptyTitle}>No calculations yet</Text>
                  <Text style={STYLES.emptySubtitle}>Use the Calculator above to start creating allowance calculations</Text>
                </View>
              ) : (
                recentCalculations.map((calc, index) => (
                  <View key={index} style={STYLES.sectionCard}>
                    <View style={STYLES.sectionHeader}>
                      <View style={[
                        STYLES.sectionIcon,
                        { backgroundColor: COLORS.accent + '15' }
                      ]}>
                        <Ionicons name="calendar" size={24} color={COLORS.accent} />
                      </View>
                      <View style={STYLES.sectionContent}>
                        <Text style={[STYLES.sectionTitle, { marginBottom: 0 }]}>Week {calc.weekNumber}</Text>
                        <Text style={STYLES.sectionDescription}>
                          {(() => {
                            if (calc.createdAt) {
                              try {
                                const date = new Date(calc.createdAt);
                                if (!isNaN(date.getTime())) {
                                  return date.toLocaleDateString();
                                }
                              } catch (e) {
                                console.log('Error parsing date:', calc.createdAt, e);
                              }
                            }
                            return 'N/A';
                          })()}
                        </Text>
                        <View style={STYLES.sectionStats}>
                          <Text style={STYLES.sectionStatsText}>
                            {calc.numberOfTeachers} Teachers • GH₵{calc.totalSum.toFixed(2)}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
                  </View>
                ))
              )}
            </View>

            {/* Danger Zone */}
            <View style={STYLES.section}>
              <Text style={[STYLES.sectionTitle, { color: COLORS.error }]}>Danger Zone</Text>
              <TouchableOpacity 
                style={[
                  STYLES.buttonDanger,
                  { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }
                ]} 
                onPress={clearAllData}
                activeOpacity={0.8}
              >
                <Ionicons name="trash-outline" size={SIZES.icon_sm} color={COLORS.white} style={{ marginRight: 8 }} />
                <Text style={STYLES.buttonDangerText}>Clear All Data</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}
