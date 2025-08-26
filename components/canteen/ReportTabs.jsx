import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../../constants/base';

export default function ReportTabs({ selectedReport, onTabChange }) {
  const tabs = [
    { id: 'daily', title: 'Daily', icon: 'calendar' },
    { id: 'department', title: 'Department', icon: 'business' },
    { id: 'history', title: 'History', icon: 'time' },
    { id: 'analytics', title: 'Analytics', icon: 'analytics' },
  ];

  return (
    <View style={styles.reportTabsContainer}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[
            styles.reportTab,
            selectedReport === tab.id && styles.activeReportTab
          ]}
          onPress={() => onTabChange(tab.id)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={tab.icon}
            size={18}
            color={selectedReport === tab.id ? COLORS.white : COLORS.gray}
          />
          <Text
            numberOfLines={1}
            style={[
              styles.reportTabText,
              selectedReport === tab.id && styles.activeReportTabText
            ]}
          >
            {tab.title}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  reportTabsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.gray_light,
    margin: SIZES.margin_sm,
    borderRadius: SIZES.borderRadius,
    padding: 2,
  },
  reportTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.padding_sm,
    paddingHorizontal: SIZES.padding_sm,
    borderRadius: SIZES.borderRadius - 2,
    gap: 4,
  },
  activeReportTab: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  reportTabText: {
    ...FONTS.h6_regular,
    color: COLORS.gray,
    fontSize: 12,
    fontWeight: '500',
  },
  activeReportTabText: {
    color: COLORS.white,
    fontWeight: '600',
  },
});
