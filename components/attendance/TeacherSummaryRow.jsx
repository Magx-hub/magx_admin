import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES, FONTS, STYLES } from '../../constants/base';

export default function TeacherSummaryRow({ summary }) {
  const getRatingColor = (rating) => {
    if (rating >= 90) return COLORS.success;
    if (rating >= 75) return COLORS.warning;
    return COLORS.error;
  };

  const getRatingText = (rating) => {
    if (rating >= 90) return 'Excellent';
    if (rating >= 75) return 'Good';
    if (rating >= 60) return 'Fair';
    return 'Poor';
  };

  return (
    <View style={STYLES.tableRow}>
      <View style={[STYLES.tableCell, { flex: 2 }]}>
        <Text style={styles.teacherName}>{summary.fullname}</Text>
        <Text style={styles.department}>{summary.department}</Text>
      </View>
      
      <View style={[STYLES.tableCell, { flex: 1 }]}>
        <Text style={styles.daysText}>
          {summary.presentDays}/{summary.totalDays}
        </Text>
        <Text style={styles.percentageText}>
          {summary.totalDays > 0 ? ((summary.presentDays / summary.totalDays) * 100).toFixed(1) : '0.0'}%
        </Text>
      </View>
      
      <View style={[STYLES.tableCell, { flex: 1 }]}>
        <Text style={styles.hoursText}>
          {summary.totalWorkHours?.toFixed(1) || 'N/A'}
        </Text>
        <Text style={styles.avgText}>
          Avg: {summary.presentDays > 0 ? (summary.totalWorkHours / summary.presentDays).toFixed(1) : '0.0'}h
        </Text>
      </View>
      
      <View style={[STYLES.tableCell, { flex: 1 }]}>
        <View style={[styles.ratingBadge, { backgroundColor: getRatingColor(summary.attendanceRating) }]}>
          <Text style={styles.ratingText}>
            {summary.attendanceRating?.toFixed(1) || 'N/A'}%
          </Text>
        </View>
        <Text style={styles.ratingLabel}>
          {getRatingText(summary.attendanceRating || 0)}
        </Text>
      </View>
      
      <View style={[STYLES.tableCell, { flex: 1 }]}>
        <Text style={styles.lateText}>
          {summary.lateCount || 0}
        </Text>
        <Text style={styles.lateLabel}>Late</Text>
      </View>
      
      <View style={[STYLES.tableCell, { flex: 1 }]}>
        <Text style={styles.absentText}>
          {summary.absentCount || 0}
        </Text>
        <Text style={styles.absentLabel}>Absent</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  teacherName: {
    ...FONTS.h6_bold,
    color: COLORS.textPrimary,
  },
  department: {
    ...FONTS.h6_regular,
    color: COLORS.gray,
    fontSize: 12,
    marginTop: 2,
  },
  daysText: {
    ...FONTS.h6_bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  percentageText: {
    ...FONTS.h6_regular,
    color: COLORS.gray,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 2,
  },
  hoursText: {
    ...FONTS.h6_bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  avgText: {
    ...FONTS.h6_regular,
    color: COLORS.gray,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 2,
  },
  ratingBadge: {
    paddingHorizontal: SIZES.padding_sm,
    paddingVertical: 4,
    borderRadius: SIZES.borderRadius,
    alignSelf: 'center',
    marginBottom: 4,
  },
  ratingText: {
    ...FONTS.h6_regular,
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  ratingLabel: {
    ...FONTS.h6_regular,
    color: COLORS.gray,
    fontSize: 12,
    textAlign: 'center',
  },
  lateText: {
    ...FONTS.h6_bold,
    color: COLORS.warning,
    textAlign: 'center',
  },
  lateLabel: {
    ...FONTS.h6_regular,
    color: COLORS.gray,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 2,
  },
  absentText: {
    ...FONTS.h6_bold,
    color: COLORS.error,
    textAlign: 'center',
  },
  absentLabel: {
    ...FONTS.h6_regular,
    color: COLORS.gray,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 2,
  },
});
