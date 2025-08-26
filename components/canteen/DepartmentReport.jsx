import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../../constants/base';

export default function DepartmentReport({ departmentSummary, startDate }) {
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

  if (!departmentSummary || departmentSummary.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Department Summary</Text>
          <Text style={styles.date}>{formatDate(startDate)}</Text>
        </View>
        <View style={styles.emptyState}>
          <Ionicons name="business-outline" size={32} color={COLORS.gray} />
          <Text style={styles.emptyText}>No department data available</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Department Summary</Text>
        <Text style={styles.date}>{formatDate(startDate)}</Text>
      </View>

      {/* Department List */}
      <View style={styles.departmentList}>
        {departmentSummary.map((dept, index) => (
          <View key={index} style={styles.departmentCard}>
            <View style={styles.departmentHeader}>
              <View style={styles.departmentInfo}>
                <Text style={styles.departmentName}>{dept.department}</Text>
                <Text style={styles.departmentPayments}>
                  {dept.totalPayments} payments
                </Text>
              </View>
              <Text style={styles.departmentTotal}>{formatCurrency(dept.totalAmount)}</Text>
            </View>
            
            <View style={styles.departmentBreakdown}>
              <View style={styles.breakdownItem}>
                <Text style={styles.breakdownLabel}>Classes</Text>
                <Text style={styles.breakdownValue}>{formatCurrency(dept.totalClassesFee)}</Text>
              </View>
              <View style={styles.breakdownItem}>
                <Text style={styles.breakdownLabel}>Breakfast</Text>
                <Text style={styles.breakdownValue}>{formatCurrency(dept.totalBreakfastFee)}</Text>
              </View>
              <View style={styles.breakdownItem}>
                <Text style={styles.breakdownLabel}>Other</Text>
                <Text style={styles.breakdownValue}>{formatCurrency(dept.totalOtherFee)}</Text>
              </View>
            </View>
          </View>
        ))}
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
  departmentList: {
    gap: SIZES.margin_sm,
  },
  departmentCard: {
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  departmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SIZES.margin_sm,
  },
  departmentInfo: {
    flex: 1,
  },
  departmentName: {
    ...FONTS.h6_bold,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  departmentPayments: {
    ...FONTS.h6_regular,
    color: COLORS.textSecondary,
    fontSize: 11,
  },
  departmentTotal: {
    ...FONTS.h5_bold,
    color: COLORS.accent,
  },
  departmentBreakdown: {
    backgroundColor: COLORS.gray_light,
    borderRadius: SIZES.borderRadius,
    padding: SIZES.padding_sm,
    gap: 4,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownLabel: {
    ...FONTS.h6_regular,
    color: COLORS.textSecondary,
    fontSize: 11,
  },
  breakdownValue: {
    ...FONTS.h6_bold,
    color: COLORS.textPrimary,
    fontSize: 11,
  },
});
