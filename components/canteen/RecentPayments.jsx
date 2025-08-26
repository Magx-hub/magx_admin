import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../../constants/base';

export default function RecentPayments({ dailyPayments, loading }) {
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
      <View style={styles.sectionContainer}>
        <Text style={styles.loadingText}>Loading payments...</Text>
      </View>
    );
  }

  if (!dailyPayments || dailyPayments.length === 0) {
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.noDataText}>No payments recorded for this date</Text>
      </View>
    );
  }

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Recent Payments</Text>
      {dailyPayments.slice(0, 5).map((payment, index) => (
        <View key={index} style={styles.paymentCard}>
          <View style={styles.paymentHeader}>
            <Text style={styles.studentName}>{payment.studentName}</Text>
            <Text style={styles.paymentAmount}>{formatCurrency(payment.totalFee)}</Text>
          </View>
          <Text style={styles.studentDepartment}>{payment.studentDepartment}</Text>
          <View style={styles.paymentDetails}>
            <Text style={styles.paymentDetail}>
              Classes: {formatCurrency(payment.classesFee)}
            </Text>
            <Text style={styles.paymentDetail}>
              Breakfast: {formatCurrency(payment.breakfastFee)}
            </Text>
            {payment.otherFee > 0 && (
              <Text style={styles.paymentDetail}>
                Other: {formatCurrency(payment.otherFee)}
              </Text>
            )}
          </View>
        </View>
      ))}
      
      {dailyPayments.length > 5 && (
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View All {dailyPayments.length} Payments</Text>
          <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
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
  paymentCard: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: SIZES.padding_sm,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  studentName: {
    ...FONTS.h6_bold,
    color: COLORS.textPrimary,
  },
  paymentAmount: {
    ...FONTS.h6_bold,
    color: COLORS.success,
  },
  studentDepartment: {
    ...FONTS.h6_regular,
    color: COLORS.gray,
    marginBottom: 4,
  },
  paymentDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.margin_sm,
  },
  paymentDetail: {
    ...FONTS.h6_regular,
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.padding,
    marginTop: SIZES.margin_sm,
  },
  viewAllText: {
    ...FONTS.h6_regular,
    color: COLORS.primary,
    marginRight: SIZES.margin_sm,
  },
});
