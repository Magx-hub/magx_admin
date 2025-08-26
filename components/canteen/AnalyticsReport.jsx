import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../../constants/base';

export default function AnalyticsReport({ paymentHistory, startDate, endDate }) {
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

  // Calculate totals from payment history
  const calculateHistoryTotals = () => {
    if (!paymentHistory || paymentHistory.length === 0) return null;

    const totals = paymentHistory.reduce((acc, payment) => {
      acc.totalPayments++;
      acc.totalClassesFee += payment.classesFee || 0;
      acc.totalBreakfastFee += payment.breakfastFee || 0;
      acc.totalOtherFee += payment.otherFee || 0;
      acc.totalAmount += payment.totalFee || 0;
      return acc;
    }, {
      totalPayments: 0,
      totalClassesFee: 0,
      totalBreakfastFee: 0,
      totalOtherFee: 0,
      totalAmount: 0,
    });

    return totals;
  };

  const totals = calculateHistoryTotals();

  if (!totals) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Analytics</Text>
          <Text style={styles.date}>{formatDate(startDate)} - {formatDate(endDate)}</Text>
        </View>
        <View style={styles.emptyState}>
          <Ionicons name="analytics-outline" size={32} color={COLORS.gray} />
          <Text style={styles.emptyText}>No data available for analytics</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Analytics</Text>
        <Text style={styles.date}>{formatDate(startDate)} - {formatDate(endDate)}</Text>
      </View>

      {/* Key Metrics */}
      <View style={styles.metricsSection}>
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <View style={styles.metricIcon}>
              <Ionicons name="cash" size={20} color={COLORS.accent} />
            </View>
            <View style={styles.metricContent}>
              <Text style={styles.metricValue}>{formatCurrency(totals.totalAmount)}</Text>
              <Text style={styles.metricLabel}>Total Revenue</Text>
            </View>
          </View>
          <View style={styles.metricCard}>
            <View style={styles.metricIcon}>
              <Ionicons name="receipt" size={20} color={COLORS.primary} />
            </View>
            <View style={styles.metricContent}>
              <Text style={styles.metricValue}>{totals.totalPayments}</Text>
              <Text style={styles.metricLabel}>Transactions</Text>
            </View>
          </View>
          <View style={styles.metricCard}>
            <View style={styles.metricIcon}>
              <Ionicons name="calculator" size={20} color={COLORS.success} />
            </View>
            <View style={styles.metricContent}>
              <Text style={styles.metricValue}>
                {totals.totalAmount > 0 ? formatCurrency(totals.totalAmount / totals.totalPayments) : 'N/A'}
              </Text>
              <Text style={styles.metricLabel}>Avg Transaction</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Revenue Breakdown Chart */}
      <View style={styles.chartSection}>
        <Text style={styles.chartTitle}>Revenue Breakdown</Text>
        <View style={styles.chartContainer}>
          <View style={styles.chartBar}>
            <View style={styles.chartBarHeader}>
              <Text style={styles.chartLabel}>Classes</Text>
              <Text style={styles.chartValue}>{formatCurrency(totals.totalClassesFee)}</Text>
            </View>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${totals.totalAmount > 0 ? (totals.totalClassesFee / totals.totalAmount) * 100 : 0}%`,
                    backgroundColor: COLORS.primary
                  }
                ]} 
              />
            </View>
            <Text style={styles.chartPercentage}>
              {totals.totalAmount > 0 ? ((totals.totalClassesFee / totals.totalAmount) * 100).toFixed(1) : '0.0'}%
            </Text>
          </View>

          <View style={styles.chartBar}>
            <View style={styles.chartBarHeader}>
              <Text style={styles.chartLabel}>Breakfast</Text>
              <Text style={styles.chartValue}>{formatCurrency(totals.totalBreakfastFee)}</Text>
            </View>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${totals.totalAmount > 0 ? (totals.totalBreakfastFee / totals.totalAmount) * 100 : 0}%`,
                    backgroundColor: COLORS.success
                  }
                ]} 
              />
            </View>
            <Text style={styles.chartPercentage}>
              {totals.totalAmount > 0 ? ((totals.totalBreakfastFee / totals.totalAmount) * 100).toFixed(1) : '0.0'}%
            </Text>
          </View>

          <View style={styles.chartBar}>
            <View style={styles.chartBarHeader}>
              <Text style={styles.chartLabel}>Other</Text>
              <Text style={styles.chartValue}>{formatCurrency(totals.totalOtherFee)}</Text>
            </View>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${totals.totalAmount > 0 ? (totals.totalOtherFee / totals.totalAmount) * 100 : 0}%`,
                    backgroundColor: COLORS.warning
                  }
                ]} 
              />
            </View>
            <Text style={styles.chartPercentage}>
              {totals.totalAmount > 0 ? ((totals.totalOtherFee / totals.totalAmount) * 100).toFixed(1) : '0.0'}%
            </Text>
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
  metricsSection: {
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  metricsGrid: {
    flexDirection: 'row',
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
  chartSection: {
    padding: SIZES.padding,
  },
  chartTitle: {
    ...FONTS.h6_bold,
    color: COLORS.textPrimary,
    marginBottom: SIZES.margin,
  },
  chartContainer: {
    gap: SIZES.margin,
  },
  chartBar: {
    gap: SIZES.margin_sm,
  },
  chartBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chartLabel: {
    ...FONTS.h6_regular,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  chartValue: {
    ...FONTS.h6_bold,
    color: COLORS.accent,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  chartPercentage: {
    ...FONTS.h6_regular,
    color: COLORS.textSecondary,
    fontSize: 11,
    textAlign: 'right',
  },
});
