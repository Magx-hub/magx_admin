import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../../constants/base';

export default function AttendanceTabs({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'records', title: 'Lists', icon: 'list' },
    { id: 'summaries', title: 'Sums', icon: 'analytics' },
    { id: 'reports', title: 'Reports', icon: 'document-text' },
  ];

  return (
    <View style={styles.tabsContainer}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[
            styles.tab,
            activeTab === tab.id && styles.activeTab
          ]}
          onPress={() => onTabChange(tab.id)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={tab.icon}
            size={20}
            color={activeTab === tab.id ? COLORS.white : COLORS.gray}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === tab.id && styles.activeTabText
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
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadius_md,
    padding: SIZES.padding_sm,
    marginBottom: SIZES.margin,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.padding_sm,
    paddingHorizontal: SIZES.padding,
    borderRadius: SIZES.borderRadius,
    marginHorizontal: 2,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    ...FONTS.h6_regular,
    color: COLORS.gray,
    marginLeft: SIZES.margin_sm,
  },
  activeTabText: {
    color: COLORS.white,
  },
});
