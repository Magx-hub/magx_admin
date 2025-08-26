import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../../constants/base';
import { useCanteen } from '../../hooks/useCanteen';
import CanteenDashboard from '../../components/canteen/CanteenDashboard';
import PaymentForm from '../../components/canteen/PaymentForm';
import FeeStructureManager from '../../components/canteen/FeeStructureManager';
import CanteenReports from '../../components/canteen/CanteenReports';
import CanteenSearch from '../../components/canteen/CanteenSearch';

export default function CanteenManagement() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { students, studentsLoading, studentsError } = useCanteen();

  const tabs = [
    { id: 'dashboard', title: 'Dashboard', icon: 'grid', component: CanteenDashboard },
    { id: 'payments', title: 'Record Payment', icon: 'add-circle', component: PaymentForm },
    { id: 'fees', title: 'Fee Structure', icon: 'settings', component: FeeStructureManager },
    { id: 'reports', title: 'Reports & Analytics', icon: 'document-text', component: CanteenReports },
    { id: 'search', title: 'Search Records', icon: 'search', component: CanteenSearch },
  ];

  const getCurrentComponent = () => {
    const currentTab = tabs.find(t => t.id === activeTab);
    if (!currentTab) return CanteenDashboard;
    
    const Component = currentTab.component;
    
    // Pass students as props to PaymentForm (same pattern as AttendanceForm)
    if (activeTab === 'payments') {
      return <Component students={students} />;
    }
    
    return <Component />;
  };

  const renderTabs = () => (
    <View style={styles.tabsContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContent}
      >
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tabButton, activeTab === tab.id && styles.tabButtonActive]}
            onPress={() => setActiveTab(tab.id)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={tab.icon}
              size={18}
              color={activeTab === tab.id ? COLORS.white : COLORS.gray}
            />
            <Text
              numberOfLines={1}
              style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}
            >
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.accent} barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Canteen Management</Text>
        <Text style={styles.headerSubtitle}>Daily Fee System</Text>
      </View>

      {renderTabs()}

      <View style={styles.content}> 
        {getCurrentComponent()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray_light,
  },
  header: {
    backgroundColor: COLORS.accent,
    padding: SIZES.padding,
    paddingTop: SIZES.padding * 2,
  },
  headerTitle: {
    ...FONTS.h3_bold,
    color: COLORS.white,
    marginBottom: 4,
  },
  headerSubtitle: {
    ...FONTS.h6_regular,
    color: COLORS.white,
    opacity: 0.9,
  },
  tabsContainer: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: SIZES.padding_sm,
  },
  tabsContent: {
    paddingHorizontal: SIZES.padding,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.padding_sm,
    paddingHorizontal: SIZES.padding,
    borderRadius: SIZES.borderRadius,
    backgroundColor: COLORS.gray_light,
    marginRight: 8,
  },
  tabButtonActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    ...FONTS.h6_regular,
    color: COLORS.gray,
    marginLeft: SIZES.margin_sm,
  },
  tabTextActive: {
    color: COLORS.white,
  },
  content: {
    flex: 1,
  },
});