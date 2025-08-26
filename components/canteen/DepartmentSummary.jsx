import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES, FONTS } from '../../constants/base';

export default function DepartmentSummary({ departmentSummary, loading }) {
  if (loading) {
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.loadingText}>Loading department summary...</Text>
      </View>
    );
  }

  if (!departmentSummary || departmentSummary.length === 0) {
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.noDataText}>No department data available</Text>
      </View>
    );
  }

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Department Summary</Text>
      {departmentSummary.map((dept, index) => (
        <View key={index} style={styles.departmentCard}>
          <Text style={styles.departmentName}>{dept.department}</Text>
          <View style={styles.departmentStats}>
            <Text style={styles.departmentStat}>
              {dept.totalPayments} payments • {formatCurrency(dept.totalAmount)}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

// Format currency helper function
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    minimumFractionDigits: 2
  }).format(amount || 0);
};

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
  departmentCard: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: SIZES.padding_sm,
  },
  departmentName: {
    ...FONTS.h6_bold,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  departmentStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  departmentStat: {
    ...FONTS.h6_regular,
    color: COLORS.gray,
  },
});
