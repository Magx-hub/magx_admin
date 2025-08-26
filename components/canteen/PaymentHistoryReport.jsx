import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../../constants/base';

export default function PaymentHistoryReport({ paymentHistory, startDate, endDate, loading }) {
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

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Payment History</Text>
          <Text style={styles.date}>{formatDate(startDate)} - {formatDate(endDate)}</Text>
        </View>
        <View style={styles.loadingState}>
          <Ionicons name="refresh" size={32} color={COLORS.gray} />
          <Text style={styles.loadingText}>Loading payment history...</Text>
        </View>
      </View>
    );
  }

  if (!totals) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Payment History</Text>
          <Text style={styles.date}>{formatDate(startDate)} - {formatDate(endDate)}</Text>
        </View>
        <View style={styles.emptyState}>
          <Ionicons name="time-outline" size={32} color={COLORS.gray} />
          <Text style={styles.emptyText}>No payment history available for selected period</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Payment History</Text>
        <Text style={styles.date}>{formatDate(startDate)} - {formatDate(endDate)}</Text>
      </View>

      {/* Summary Metrics */}
      <View style={styles.summarySection}>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <Ionicons name="receipt" size={20} color={COLORS.primary} />
            </View>
            <View style={styles.summaryContent}>
              <Text style={styles.summaryValue}>{totals.totalPayments}</Text>
              <Text style={styles.summaryLabel}>Payments</Text>
            </View>
          </View>
          <View style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <Ionicons name="cash" size={20} color={COLORS.accent} />
            </View>
            <View style={styles.summaryContent}>
              <Text style={styles.summaryValue}>{formatCurrency(totals.totalAmount)}</Text>
              <Text style={styles.summaryLabel}>Total</Text>
            </View>
          </View>
        </View>

        {/* Fee Breakdown */}
        <View style={styles.breakdownSection}>
          <Text style={styles.breakdownTitle}>Fee Breakdown</Text>
          <View style={styles.breakdownGrid}>
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>Classes</Text>
              <Text style={styles.breakdownValue}>{formatCurrency(totals.totalClassesFee)}</Text>
            </View>
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>Breakfast</Text>
              <Text style={styles.breakdownValue}>{formatCurrency(totals.totalBreakfastFee)}</Text>
            </View>
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>Other</Text>
              <Text style={styles.breakdownValue}>{formatCurrency(totals.totalOtherFee)}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Recent Payments */}
      <View style={styles.paymentsSection}>
        <Text style={styles.sectionTitle}>Recent Payments</Text>
        <View style={styles.paymentsList}>
          {paymentHistory.slice(0, 8).map((payment, index) => (
            <View key={index} style={styles.paymentItem}>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentName}>{payment.studentName}</Text>
                <Text style={styles.paymentDepartment}>{payment.studentDepartment}</Text>
              </View>
              <View style={styles.paymentDetails}>
                <Text style={styles.paymentAmount}>{formatCurrency(payment.totalFee)}</Text>
                <Text style={styles.paymentDate}>{formatDate(payment.paymentDate)}</Text>
              </View>
            </View>
          ))}
        </View>
        {paymentHistory.length > 8 && (
          <Text style={styles.moreText}>
            And {paymentHistory.length - 8} more payments...
          </Text>
        )}
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
  loadingState: {
    alignItems: 'center',
    padding: SIZES.padding * 2,
  },
  loadingText: {
    ...FONTS.h6_regular,
    color: COLORS.gray,
    marginTop: SIZES.margin_sm,
    textAlign: 'center',
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
  summarySection: {
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: SIZES.margin_sm,
    marginBottom: SIZES.margin,
  },
  summaryCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray_light,
    padding: SIZES.padding_sm,
    borderRadius: SIZES.borderRadius,
    gap: SIZES.margin_sm,
  },
  summaryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryContent: {
    flex: 1,
  },
  summaryValue: {
    ...FONTS.h5_bold,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  summaryLabel: {
    ...FONTS.h6_regular,
    color: COLORS.textSecondary,
    fontSize: 11,
  },
  breakdownSection: {
    marginTop: SIZES.margin,
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
  paymentsSection: {
    padding: SIZES.padding,
  },
  sectionTitle: {
    ...FONTS.h6_bold,
    color: COLORS.textPrimary,
    marginBottom: SIZES.margin_sm,
  },
  paymentsList: {
    gap: SIZES.margin_sm,
  },
  paymentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.padding_sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentName: {
    ...FONTS.h6_bold,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  paymentDepartment: {
    ...FONTS.h6_regular,
    color: COLORS.textSecondary,
    fontSize: 11,
  },
  paymentDetails: {
    alignItems: 'flex-end',
  },
  paymentAmount: {
    ...FONTS.h6_bold,
    color: COLORS.success,
    marginBottom: 2,
  },
  paymentDate: {
    ...FONTS.h6_regular,
    color: COLORS.textSecondary,
    fontSize: 11,
  },
  moreText: {
    ...FONTS.h6_regular,
    color: COLORS.primary,
    textAlign: 'center',
    padding: SIZES.padding,
    fontStyle: 'italic',
  },
});
