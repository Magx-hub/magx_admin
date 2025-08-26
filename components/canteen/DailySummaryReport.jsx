import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../../constants/base';

export default function DailySummaryReport({ dailySummary, startDate }) {
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (!dailySummary) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Daily Summary</Text>
          <Text style={styles.date}>{formatDate(startDate)}</Text>
        </View>
        <View style={styles.emptyState}>
          <Ionicons name="document-text-outline" size={32} color={COLORS.gray} />
          <Text style={styles.emptyText}>No data available for selected date</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Daily Summary</Text>
        <Text style={styles.date}>{formatDate(startDate)}</Text>
      </View>

      {/* Key Metrics */}
      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <View style={styles.metricIcon}>
            <Ionicons name="people" size={20} color={COLORS.primary} />
          </View>
          <View style={styles.metricContent}>
            <Text style={styles.metricValue}>{dailySummary.uniqueStudents || 0}</Text>
            <Text style={styles.metricLabel}>Students</Text>
          </View>
        </View>

        <View style={styles.metricCard}>
          <View style={styles.metricIcon}>
            <Ionicons name="receipt" size={20} color={COLORS.success} />
          </View>
          <View style={styles.metricContent}>
            <Text style={styles.metricValue}>{dailySummary.totalPayments || 0}</Text>
            <Text style={styles.metricLabel}>Payments</Text>
          </View>
        </View>

        <View style={styles.metricCard}>
          <View style={styles.metricIcon}>
            <Ionicons name="cash" size={20} color={COLORS.accent} />
          </View>
          <View style={styles.metricContent}>
            <Text style={styles.metricValue}>{formatCurrency(dailySummary.totalAmount || 0)}</Text>
            <Text style={styles.metricLabel}>Total</Text>
          </View>
        </View>
      </View>

      {/* Fee Breakdown */}
      <View style={styles.breakdownSection}>
        <Text style={styles.breakdownTitle}>Fee Breakdown</Text>
        <View style={styles.breakdownGrid}>
          <View style={styles.breakdownItem}>
            <Text style={styles.breakdownLabel}>Classes</Text>
            <Text style={styles.breakdownValue}>{formatCurrency(dailySummary.totalClassesFee || 0)}</Text>
          </View>
          <View style={styles.breakdownItem}>
            <Text style={styles.breakdownLabel}>Breakfast</Text>
            <Text style={styles.breakdownValue}>{formatCurrency(dailySummary.totalBreakfastFee || 0)}</Text>
          </View>
          <View style={styles.breakdownItem}>
            <Text style={styles.breakdownLabel}>Other</Text>
            <Text style={styles.breakdownValue}>{formatCurrency(dailySummary.totalOtherFee || 0)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadius,
    marginBottom: SIZES.margin_sm,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    ...FONTS.h5_bold,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  date: {
    ...FONTS.h6_regular,
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  emptyState: {
    alignItems: 'center',
    padding: SIZES.padding * 2,
  },
  emptyText: {
    ...FONTS.h6_regular,
    color: COLORS.gray,
    marginTop: SIZES.margin_sm,
    textAlign: 'center',
  },
  metricsGrid: {
    flexDirection: 'row',
    padding: SIZES.padding,
    gap: SIZES.margin_sm,
  },
  metricCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray_light,
    padding: SIZES.padding_sm,
    borderRadius: SIZES.borderRadius,
    gap: SIZES.margin_sm,
  },
  metricIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricContent: {
    flex: 1,
  },
  metricValue: {
    ...FONTS.h5_bold,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  metricLabel: {
    ...FONTS.h6_regular,
    color: COLORS.textSecondary,
    fontSize: 11,
  },
  breakdownSection: {
    padding: SIZES.padding,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  breakdownTitle: {
    ...FONTS.h6_bold,
    color: COLORS.textPrimary,
    marginBottom: SIZES.margin_sm,
  },
  breakdownGrid: {
    gap: SIZES.margin_sm,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  breakdownLabel: {
    ...FONTS.h6_regular,
    color: COLORS.textSecondary,
  },
  breakdownValue: {
    ...FONTS.h6_bold,
    color: COLORS.accent,
  },
});
