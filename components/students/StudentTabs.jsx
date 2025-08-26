import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SIZES, FONTS } from '../../constants/base';

export default function StudentTabs({ activeTab, onTabChange }) {
  const tabs = [
    { key: 'students', label: 'Students', icon: 'people' },
    { key: 'summaries', label: 'Summaries', icon: 'stats-chart' }
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[
            styles.tab,
            activeTab === tab.key && styles.activeTab
          ]}
          onPress={() => onTabChange(tab.key)}
        >
          <Text style={[
            styles.tabText,
            activeTab === tab.key && styles.activeTabText
          ]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.gray_light,
    marginHorizontal: SIZES.margin,
    marginVertical: SIZES.margin,
    borderRadius: SIZES.borderRadius,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: SIZES.padding_sm,
    paddingHorizontal: SIZES.padding,
    borderRadius: SIZES.borderRadius - 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    ...FONTS.h6_regular,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});
