import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS, STYLES } from '../../constants/base';

export default function TeacherSummaryCard({ summary }) {
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

  const attendancePercentage = summary.totalDays > 0 ? ((summary.presentDays / summary.totalDays) * 100).toFixed(1) : '0.0';
  const avgHoursPerDay = summary.presentDays > 0 ? (summary.totalWorkHours / summary.presentDays).toFixed(1) : '0.0';

  return (
    <View style={[STYLES.card, styles.summaryCard]}>
      {/* Header Section */}
      <View style={styles.cardHeader}>
        <View style={styles.teacherInfo}>
          <Text style={styles.teacherName}>{summary.fullname}</Text>
          <Text style={styles.department}>{summary.department}</Text>
        </View>
        <View style={[styles.ratingBadge, { backgroundColor: getRatingColor(summary.attendanceRating) }]}>
          <Text style={styles.ratingText}>
            {summary.attendanceRating?.toFixed(1) || 'N/A'}%
          </Text>
        </View>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {/* Attendance Days */}
        <View style={styles.statItem}>
          <View style={styles.statIconContainer}>
            <Ionicons name="calendar-outline" size={20} color={COLORS.primary} />
          </View>
          <View style={styles.statContent}>
            <Text style={styles.statValue}>
              {summary.presentDays}/{summary.totalDays}
            </Text>
            <Text style={styles.statLabel}>Days Present</Text>
            <Text style={styles.statPercentage}>{attendancePercentage}%</Text>
          </View>
        </View>

        {/* Work Hours */}
        <View style={styles.statItem}>
          <View style={styles.statIconContainer}>
            <Ionicons name="time-outline" size={20} color={COLORS.info} />
          </View>
          <View style={styles.statContent}>
            <Text style={styles.statValue}>
              {summary.totalWorkHours?.toFixed(1) || 'N/A'}
            </Text>
            <Text style={styles.statLabel}>Total Hours</Text>
            <Text style={styles.statPercentage}>Avg: {avgHoursPerDay}h/day</Text>
          </View>
        </View>
      </View>

      {/* Issues Row */}
      <View style={styles.issuesRow}>
        <View style={styles.issueItem}>
          <View style={[styles.issueIcon, { backgroundColor: COLORS.warning + '20' }]}>
            <Ionicons name="time" size={16} color={COLORS.warning} />
          </View>
          <View style={styles.issueContent}>
            <Text style={styles.issueValue}>{summary.lateCount || 0}</Text>
            <Text style={styles.issueLabel}>Late</Text>
          </View>
        </View>

        <View style={styles.issueItem}>
          <View style={[styles.issueIcon, { backgroundColor: COLORS.error + '20' }]}>
            <Ionicons name="close-circle" size={16} color={COLORS.error} />
          </View>
          <View style={styles.issueContent}>
            <Text style={styles.issueValue}>{summary.absentCount || 0}</Text>
            <Text style={styles.issueLabel}>Absent</Text>
          </View>
        </View>

        {/* Rating Label */}
        <View style={styles.ratingContainer}>
          <Text style={[styles.ratingLabel, { color: getRatingColor(summary.attendanceRating) }]}>
            {getRatingText(summary.attendanceRating || 0)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    marginHorizontal: SIZES.margin,
    marginBottom: SIZES.margin,
    padding: SIZES.padding,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SIZES.margin,
  },
  teacherInfo: {
    flex: 1,
  },
  teacherName: {
    ...FONTS.h4_bold,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  department: {
    ...FONTS.h6_regular,
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  ratingBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: SIZES.borderRadius,
    minWidth: 60,
    alignItems: 'center',
  },
  ratingText: {
    ...FONTS.h6_regular,
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 13,
  },
  statsGrid: {
    flexDirection: 'row',
    marginBottom: SIZES.margin,
    gap: SIZES.margin_sm,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray_light,
    borderRadius: SIZES.borderRadius,
    padding: SIZES.padding_sm,
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.margin_sm,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    ...FONTS.h5_regular,
    color: COLORS.textPrimary,
    fontWeight: '600',
    marginBottom: 2,
  },
  statLabel: {
    ...FONTS.h6_regular,
    color: COLORS.textSecondary,
    fontSize: 12,
    marginBottom: 1,
  },
  statPercentage: {
    ...FONTS.h6_regular,
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '500',
  },
  issuesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  issueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  issueIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.margin_sm / 2,
  },
  issueContent: {
    alignItems: 'center',
  },
  issueValue: {
    ...FONTS.h6_regular,
    fontWeight: '600',
    color: COLORS.textPrimary,
    fontSize: 14,
  },
  issueLabel: {
    ...FONTS.h6_regular,
    color: COLORS.textSecondary,
    fontSize: 11,
  },
  ratingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  ratingLabel: {
    ...FONTS.h6_regular,
    fontWeight: '600',
    fontSize: 13,
  },
});
