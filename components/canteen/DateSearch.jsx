import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORS, SIZES, FONTS } from '../../constants/base';

export default function DateSearch({ startDate, endDate, onStartDateChange, onEndDateChange }) {
  return (
    <View style={styles.searchSection}>
      <Text style={styles.sectionTitle}>Search by Date Range</Text>
      
      <View style={styles.dateInputs}>
        <View style={styles.dateInputGroup}>
          <Text style={styles.dateLabel}>Start Date</Text>
          <TextInput
            style={styles.dateInput}
            value={startDate}
            onChangeText={onStartDateChange}
            placeholder="YYYY-MM-DD"
          />
        </View>
        <View style={styles.dateInputGroup}>
          <Text style={styles.dateLabel}>End Date</Text>
          <TextInput
            style={styles.dateInput}
            value={endDate}
            onChangeText={onEndDateChange}
            placeholder="YYYY-MM-DD"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  searchSection: {
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
    ...FONTS.h6_bold,
    color: COLORS.textPrimary,
    marginBottom: SIZES.margin,
  },
  dateInputs: {
    flexDirection: 'row',
    gap: SIZES.margin,
  },
  dateInputGroup: {
    flex: 1,
  },
  dateLabel: {
    ...FONTS.h6_regular,
    color: COLORS.textSecondary,
    marginBottom: SIZES.margin_sm,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.borderRadius,
    padding: SIZES.padding_sm,
    ...FONTS.h6_regular,
  },
});
