import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../../constants/base';

export default function DateRangeSelector({ 
  startDate, 
  endDate, 
  onStartDateChange, 
  onEndDateChange, 
  onRefresh 
}) {
  return (
    <View style={styles.dateRangeContainer}>
      <View style={styles.dateInputs}>
        <View style={styles.dateInputGroup}>
          <Text style={styles.dateLabel}>From</Text>
          <TextInput
            style={styles.dateInput}
            value={startDate}
            onChangeText={onStartDateChange}
            placeholder="YYYY-MM-DD"
          />
        </View>
        <View style={styles.dateInputGroup}>
          <Text style={styles.dateLabel}>To</Text>
          <TextInput
            style={styles.dateInput}
            value={endDate}
            onChangeText={onEndDateChange}
            placeholder="YYYY-MM-DD"
          />
        </View>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={onRefresh}
          activeOpacity={0.7}
        >
          <Ionicons name="refresh" size={16} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dateRangeContainer: {
    paddingHorizontal: SIZES.margin_sm,
    paddingBottom: SIZES.padding_sm,
  },
  dateInputs: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: SIZES.margin_sm,
  },
  dateInputGroup: {
    flex: 1,
  },
  dateLabel: {
    ...FONTS.h6_regular,
    color: COLORS.textSecondary,
    marginBottom: 4,
    fontSize: 11,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.borderRadius,
    padding: SIZES.padding_sm,
    ...FONTS.h6_regular,
    fontSize: 12,
  },
  refreshButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    padding: SIZES.padding_sm,
    borderRadius: SIZES.borderRadius,
    width: 40,
    height: 40,
  },
});
