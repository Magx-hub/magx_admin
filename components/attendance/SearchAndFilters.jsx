import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../../constants/base';

export default function SearchAndFilters({ 
  searchQuery, 
  onSearchChange, 
  selectedStatus, 
  onStatusChange, 
  statuses 
}) {
  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={COLORS.gray} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or department..."
          value={searchQuery}
          onChangeText={onSearchChange}
          autoCapitalize="words"
        />
      </View>

      {/* Status Filter */}
      <View style={styles.statusFilterContainer}>
        <Text style={styles.filterLabel}>Status:</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statusButtons}
        >
          {statuses.map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.statusButton,
                selectedStatus === status && styles.activeStatusButton
              ]}
              onPress={() => onStatusChange(status)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.statusButtonText,
                  selectedStatus === status && styles.activeStatusButtonText
                ]}
              >
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.borderRadius,
    paddingHorizontal: SIZES.padding_sm,
    marginBottom: SIZES.margin,
  },
  searchInput: {
    flex: 1,
    padding: SIZES.padding_sm,
    marginLeft: SIZES.margin_sm,
    ...FONTS.h6_regular,
  },
  statusFilterContainer: {
    marginBottom: SIZES.margin_sm,
  },
  filterLabel: {
    ...FONTS.h6_bold,
    color: COLORS.textPrimary,
    marginBottom: SIZES.margin_sm,
  },
  statusButtons: {
    flexDirection: 'row',
    gap: SIZES.margin_sm,
  },
  statusButton: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding_sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.borderRadius,
    backgroundColor: COLORS.white,
  },
  activeStatusButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  statusButtonText: {
    ...FONTS.h6_regular,
    color: COLORS.gray,
  },
  activeStatusButtonText: {
    color: COLORS.white,
  },
});
