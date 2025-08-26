import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORS, SIZES, FONTS } from '../../constants/base';

export default function FeeDetails({ 
  classesFee, 
  breakfastFee, 
  otherFee, 
  onClassesFeeChange, 
  onBreakfastFeeChange, 
  onOtherFeeChange 
}) {
  const totalFee = classesFee + breakfastFee + otherFee;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Fee Details</Text>
      
      <View style={styles.feeRow}>
        <Text style={styles.feeLabel}>Classes Fee (GH₵)</Text>
        <TextInput
          style={styles.feeInput}
          value={classesFee.toString()}
          onChangeText={(text) => onClassesFeeChange(parseFloat(text) || 0)}
          keyboardType="numeric"
          placeholder="0.00"
        />
      </View>
      
      <View style={styles.feeRow}>
        <Text style={styles.feeLabel}>Breakfast Fee (GH₵)</Text>
        <TextInput
          style={styles.feeInput}
          value={breakfastFee.toString()}
          onChangeText={(text) => onBreakfastFeeChange(parseFloat(text) || 0)}
          keyboardType="numeric"
          placeholder="0.00"
        />
      </View>
      
      <View style={styles.feeRow}>
        <Text style={styles.feeLabel}>Other Fee (GH₵)</Text>
        <TextInput
          style={styles.feeInput}
          value={otherFee.toString()}
          onChangeText={(text) => onOtherFeeChange(parseFloat(text) || 0)}
          keyboardType="numeric"
          placeholder="0.00"
        />
      </View>
      
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total Fee</Text>
        <Text style={styles.totalValue}>GH₵{totalFee.toFixed(2)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
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
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.margin_sm,
  },
  feeLabel: {
    ...FONTS.h6_regular,
    color: COLORS.textPrimary,
    flex: 1,
  },
  feeInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.borderRadius,
    padding: SIZES.padding_sm,
    width: 120,
    textAlign: 'right',
    ...FONTS.h6_regular,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SIZES.padding,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginTop: SIZES.margin_sm,
  },
  totalLabel: {
    ...FONTS.h6_bold,
    color: COLORS.textPrimary,
  },
  totalValue: {
    ...FONTS.h5_bold,
    color: COLORS.accent,
  },
});
