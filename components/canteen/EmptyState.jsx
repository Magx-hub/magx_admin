import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../../constants/base';

export default function EmptyState({ onAddNew }) {
  return (
    <View style={styles.emptyContainer}>
      <Ionicons name="settings-outline" size={64} color={COLORS.gray} />
      <Text style={styles.emptyTitle}>No Fee Structures</Text>
      <Text style={styles.emptySubtitle}>
        Add fee structures for different departments to get started
      </Text>
      <TouchableOpacity
        style={styles.emptyAddButton}
        onPress={onAddNew}
        activeOpacity={0.7}
      >
        <Text style={styles.emptyAddButtonText}>Add First Structure</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding * 2,
  },
  emptyTitle: {
    ...FONTS.h5_bold,
    color: COLORS.gray,
    marginTop: SIZES.margin,
    marginBottom: SIZES.margin_sm,
  },
  emptySubtitle: {
    ...FONTS.h6_regular,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: SIZES.margin,
  },
  emptyAddButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding_sm,
    borderRadius: SIZES.borderRadius,
  },
  emptyAddButtonText: {
    ...FONTS.h6_bold,
    color: COLORS.white,
  },
});
