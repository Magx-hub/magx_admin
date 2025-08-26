import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../../constants/base';

export default function ReportTypeSelector({ reportType, onReportTypeChange }) {
  const types = [
    { 
      id: 'all', 
      title: 'All Teachers', 
      icon: 'people-outline',
      description: 'Generate report for all teachers'
    },
    { 
      id: 'teacher', 
      title: 'Specific Teacher', 
      icon: 'person-outline',
      description: 'Generate report for a specific teacher'
    },
    { 
      id: 'week', 
      title: 'Weekly Report', 
      icon: 'calendar-outline',
      description: 'Generate weekly attendance report'
    }
  ];

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Report Type</Text>
      <View style={styles.typeSelector}>
        {types.map((type) => (
          <TouchableOpacity
            key={type.id}
            style={[
              styles.typeButton, 
              reportType === type.id && styles.activeTypeButton
            ]}
            onPress={() => onReportTypeChange(type.id)}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={type.icon} 
              size={20} 
              color={reportType === type.id ? '#fff' : COLORS.gray} 
            />
            <Text style={[
              styles.typeButtonText, 
              reportType === type.id && styles.activeTypeButtonText
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
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 12,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    gap: 8,
  },
  activeTypeButton: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#495057',
  },
  activeTypeButtonText: {
    color: '#fff',
  },
});

