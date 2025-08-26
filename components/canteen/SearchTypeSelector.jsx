import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../../constants/base';

export default function SearchTypeSelector({ searchType, onSearchTypeChange }) {
  const searchTypes = [
    { id: 'student', title: 'By Student', icon: 'person' },
    { id: 'date', title: 'By Date', icon: 'calendar' },
    { id: 'general', title: 'General', icon: 'search' },
  ];

  return (
    <View style={styles.searchTypeContainer}>
      <Text style={styles.sectionTitle}>Search Type</Text>
      <View style={styles.searchTypeButtons}>
        {searchTypes.map((type) => (
          <TouchableOpacity
            key={type.id}
            style={[
              styles.searchTypeButton,
              searchType === type.id && styles.activeSearchTypeButton
            ]}
            onPress={() => onSearchTypeChange(type.id)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={type.icon}
              size={20}
              color={searchType === type.id ? COLORS.white : COLORS.gray}
            />
            <Text style={[
              styles.searchTypeButtonText,
              searchType === type.id && styles.activeSearchTypeButtonText
            ]}>
              {type.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  searchTypeContainer: {
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
  searchTypeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  searchTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.padding_sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.borderRadius,
    marginHorizontal: 2,
  },
  activeSearchTypeButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  searchTypeButtonText: {
    ...FONTS.h6_regular,
    color: COLORS.gray,
    marginLeft: SIZES.margin_sm,
  },
  activeSearchTypeButtonText: {
    color: COLORS.white,
  },
});
