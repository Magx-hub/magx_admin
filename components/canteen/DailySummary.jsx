import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../../constants/base';

export default function DailySummary({ dailySummary, loading }) {
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <View style={styles.summaryContainer}>
        <Text style={styles.loadingText}>Loading summary...</Text>
      </View>
    );
  }

  if (!dailySummary) {
    return (
      <View style={styles.summaryContainer}>
        <Text style={styles.noDataText}>No data available for this date</Text>
      </View>
    );
  }

  return (
    <View style={styles.summaryContainer}>
      <Text style={styles.sectionTitle}>Daily Summary</Text>

      <View style={styles.feeBreakdown}>
        <View style={styles.feeRow}>
          <Text style={styles.feeLabel}>Students:</Text>
          <Text style={styles.feeValue}>{dailySummary.uniqueStudents || 0}</Text>
        </View>
      </View>

      <View style={styles.feeBreakdown}>
        <View style={styles.feeRow}>
          <Text style={styles.feeLabel}>Payments:</Text>
          <Text style={styles.feeValue}>{dailySummary.totalPayments || 0}</Text>
        </View>
      </View>

      <View style={styles.feeBreakdown}>
        <View style={styles.feeRow}>
          <Text style={styles.feeLabel}>Total Amount:</Text>
          <Text style={styles.feeValue}>{formatCurrency(dailySummary.totalAmount || 0)}</Text>
        </View>
      </View>

      <View style={styles.feeBreakdown}>
        <View style={styles.feeRow}>
          <Text style={styles.feeLabel}>Classes Fee:</Text>
          <Text style={styles.feeValue}>{formatCurrency(dailySummary.totalClassesFee || 0)}</Text>
        </View>
        <View style={styles.feeRow}>
          <Text style={styles.feeLabel}>Breakfast Fee:</Text>
          <Text style={styles.feeValue}>{formatCurrency(dailySummary.totalBreakfastFee || 0)}</Text>
        </View>
        <View style={styles.feeRow}>
          <Text style={styles.feeLabel}>Other Fees:</Text>
          <Text style={styles.feeValue}>{formatCurrency(dailySummary.totalOtherFee || 0)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  summaryContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadius_md,
    padding: SIZES.padding,
    marginBottom: SIZES.margin,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    ...FONTS.h5_bold,
    color: COLORS.accent,
    marginBottom: SIZES.margin,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.margin,
  },
  summaryCard: {
    flex: 1,
    alignItems: 'center',
    padding: SIZES.padding_sm,
  },
  summaryValue: {
    ...FONTS.h4_bold,
    color: COLORS.accent,
    marginTop: SIZES.margin_sm,
  },
  summaryLabel: {
    ...FONTS.h6_regular,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 4,
  },
  feeBreakdown: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SIZES.padding,
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  feeLabel: {
    ...FONTS.h6_regular,
    color: COLORS.textPrimary,
  },
  feeValue: {
    ...FONTS.h6_regular,
    color: COLORS.accent,
    fontWeight: '600',
  },
  loadingText: {
    ...FONTS.h6_regular,
    color: COLORS.gray,
    textAlign: 'center',
    padding: SIZES.padding,
  },
  noDataText: {
    ...FONTS.h6_regular,
    color: COLORS.gray,
    textAlign: 'center',
    padding: SIZES.padding,
    fontStyle: 'italic',
  },
});
