import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../../constants/base';

export default function DateNavigation({ 
  currentDate, 
  onPreviousDay, 
  onNextDay, 
  onToday 
}) {
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <View style={styles.dateNavigation}>
      <TouchableOpacity 
        style={styles.dateButton} 
        onPress={onPreviousDay}
        activeOpacity={0.7}
      >
        <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.currentDateButton} 
        onPress={onToday}
        activeOpacity={0.7}
      >
        <Text style={styles.currentDateText}>{formatDate(currentDate)}</Text>
        <Text style={styles.todayText}>Tap to go to today</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.dateButton} 
        onPress={onNextDay}
        activeOpacity={0.7}
      >
        <Ionicons name="chevron-forward" size={24} color={COLORS.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  dateNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  dateButton: {
    padding: SIZES.padding_sm,
    borderRadius: SIZES.borderRadius,
    backgroundColor: COLORS.gray_light,
  },
  currentDateButton: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: SIZES.margin_sm,
  },
  currentDateText: {
    ...FONTS.h5_bold,
    color: COLORS.accent,
    textAlign: 'center',
  },
  todayText: {
    ...FONTS.h6_regular,
    color: COLORS.gray,
    fontSize: 12,
    textAlign: 'center',
  },
});
