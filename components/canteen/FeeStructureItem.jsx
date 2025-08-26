import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../../constants/base';

export default function FeeStructureItem({ structure, onEdit, onDelete }) {
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

  return (
    <View style={styles.structureItem}>
      <View style={styles.structureHeader}>
        <Text style={styles.departmentName}>{structure.department}</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onEdit(structure)}
            activeOpacity={0.7}
          >
            <Ionicons name="create" size={16} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onDelete(structure)}
            activeOpacity={0.7}
          >
            <Ionicons name="trash" size={16} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.feeDetails}>
        <View style={styles.feeRow}>
          <Text style={styles.feeLabel}>Classes Fee:</Text>
          <Text style={styles.feeValue}>{formatCurrency(structure.classesFee)}</Text>
        </View>
        <View style={styles.feeRow}>
          <Text style={styles.feeLabel}>Breakfast Fee:</Text>
          <Text style={styles.feeValue}>{formatCurrency(structure.breakfastFee)}</Text>
        </View>
        <View style={styles.feeRow}>
          <Text style={styles.feeLabel}>Total:</Text>
          <Text style={styles.totalValue}>
            {formatCurrency(structure.classesFee + structure.breakfastFee)}
          </Text>
        </View>
      </View>
      
      <View style={styles.effectiveDate}>
        <Text style={styles.dateLabel}>Effective: {formatDate(structure.effectiveDate)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  structureItem: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadius_md,
    padding: SIZES.padding,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  structureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.margin,
  },
  departmentName: {
    ...FONTS.h6_bold,
    color: COLORS.textPrimary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: SIZES.margin_sm,
  },
  actionButton: {
    padding: SIZES.padding_sm,
    borderRadius: SIZES.borderRadius,
    backgroundColor: COLORS.gray_light,
  },
  feeDetails: {
    marginBottom: SIZES.margin,
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  feeLabel: {
    ...FONTS.h6_regular,
    color: COLORS.textSecondary,
  },
  feeValue: {
    ...FONTS.h6_regular,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  totalValue: {
    ...FONTS.h6_bold,
    color: COLORS.accent,
  },
  effectiveDate: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SIZES.padding_sm,
  },
  dateLabel: {
    ...FONTS.h6_regular,
    color: COLORS.gray,
    fontSize: 12,
  },
});
