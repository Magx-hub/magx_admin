import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../../constants/base';

export default function SelectedStudentCard({ student, onRemove }) {
  return (
    <View style={styles.selectedStudentCard}>
      <View style={styles.selectedStudentHeader}>
        <Ionicons name="person-circle" size={40} color={COLORS.primary} />
        <View style={styles.selectedStudentInfo}>
          <Text style={styles.selectedStudentName}>{student.fullname}</Text>
          <Text style={styles.selectedStudentDepartment}>{student.department}</Text>
        </View>
        <TouchableOpacity
          onPress={onRemove}
          style={styles.removeStudentButton}
        >
          <Ionicons name="close-circle" size={24} color={COLORS.error} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  selectedStudentCard: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: SIZES.borderRadius,
    padding: SIZES.padding,
  },
  selectedStudentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedStudentInfo: {
    flex: 1,
    marginLeft: SIZES.margin_sm,
  },
  selectedStudentName: {
    ...FONTS.h6_bold,
    color: COLORS.textPrimary,
  },
  selectedStudentDepartment: {
    ...FONTS.h6_regular,
    color: COLORS.gray,
    marginTop: 2,
  },
  removeStudentButton: {
    padding: SIZES.padding_sm,
  },
});
