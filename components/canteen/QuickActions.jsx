import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../../constants/base';

export default function QuickActions() {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickActionsGrid}>
        <TouchableOpacity style={styles.quickActionCard}>
          <Ionicons name="add-circle" size={32} color={COLORS.success} />
          <Text style={styles.quickActionText}>Record Payment</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickActionCard}>
          <Ionicons name="settings" size={32} color={COLORS.primary} />
          <Text style={styles.quickActionText}>Fee Structure</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickActionCard}>
          <Ionicons name="document-text" size={32} color={COLORS.accent} />
          <Text style={styles.quickActionText}>Reports</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickActionCard}>
          <Ionicons name="search" size={32} color={COLORS.info} />
          <Text style={styles.quickActionText}>Search</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

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
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: COLORS.gray_light,
    borderRadius: SIZES.borderRadius,
    padding: SIZES.padding,
    alignItems: 'center',
    marginBottom: SIZES.margin_sm,
  },
  quickActionText: {
    ...FONTS.h6_regular,
    color: COLORS.textPrimary,
    marginTop: SIZES.margin_sm,
    textAlign: 'center',
  },
});
