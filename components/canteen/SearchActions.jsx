import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../../constants/base';

export default function SearchActions({ onSearch, onClear, loading }) {
  return (
    <View style={styles.searchActions}>
      <TouchableOpacity
        style={styles.searchButton}
        onPress={onSearch}
        disabled={loading}
        activeOpacity={0.7}
      >
        {loading ? (
          <Text style={styles.searchButtonText}>Searching...</Text>
        ) : (
          <>
            <Ionicons name="search" size={20} color={COLORS.white} />
            <Text style={styles.searchButtonText}>Search</Text>
          </>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.clearButton}
        onPress={onClear}
        activeOpacity={0.7}
      >
        <Ionicons name="close" size={20} color={COLORS.gray} />
        <Text style={styles.clearButtonText}>Clear</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  searchActions: {
    flexDirection: 'row',
    gap: SIZES.margin,
    marginBottom: SIZES.margin,
  },
  searchButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.success,
    padding: SIZES.padding,
    borderRadius: SIZES.borderRadius_md,
  },
  searchButtonText: {
    ...FONTS.h6_bold,
    color: COLORS.white,
    marginLeft: SIZES.margin_sm,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.gray_light,
    padding: SIZES.padding,
    borderRadius: SIZES.borderRadius_md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  clearButtonText: {
    ...FONTS.h6_bold,
    color: COLORS.gray,
    marginLeft: SIZES.margin_sm,
  },
});
