import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES, FONTS } from '../../constants/base';

export default function ReportStats({ reportStats, reportType }) {
  if (!reportStats) return null;

  const getStatValue = (key) => {
    switch (key) {
      case 'total':
        return reportStats.totalRecords || reportStats.totalTeachers || 0;
      case 'present':
        return reportStats.presentCount || reportStats.totalPresentDays || 0;
      case 'absent':
        return reportStats.absentCount || 0;
      case 'rate':
        return reportStats.attendanceRate || 0;
      default:
        return 0;
    }
  };

  const getStatLabel = (key) => {
    switch (key) {
      case 'total':
        return reportType === 'week' ? 'Teachers' : 'Records';
      case 'present':
        return 'Present';
      case 'absent':
        return 'Absent';
      case 'rate':
        return 'Rate';
      default:
        return '';
    }
  };

  const stats = [
    { key: 'total', color: COLORS.textPrimary },
    { key: 'present', color: COLORS.success },
    { key: 'absent', color: COLORS.error },
    { key: 'rate', color: COLORS.warning }
  ];

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Report Summary</Text>
      <View style={styles.statsGrid}>
        {stats.map((stat) => (
          <View key={stat.key} style={styles.statCard}>
            <Text style={[styles.statValue, { color: stat.color }]}>
              {getStatValue(stat.key)}{stat.key === 'rate' ? '%' : ''}
            </Text>
            <Text style={styles.statLabel}>
              {getStatLabel(stat.key)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'center',
  },
});

