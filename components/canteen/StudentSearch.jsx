import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../../constants/base';

export default function StudentSearch({ 
  searchQuery, 
  onSearchQueryChange, 
  filteredStudents, 
  onStudentSelect, 
  selectedStudent, 
  onRemoveStudent 
}) {
  return (
    <View style={styles.searchSection}>
      <Text style={styles.sectionTitle}>Search by Student</Text>
      
      <View style={styles.searchInputContainer}>
        <Ionicons name="search" size={20} color={COLORS.gray} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search students by name or department..."
          value={searchQuery}
          onChangeText={onSearchQueryChange}
          autoCapitalize="words"
        />
      </View>

      {searchQuery.length > 0 && (
        <View style={styles.studentSuggestions}>
          {filteredStudents.slice(0, 5).map((student) => (
            <TouchableOpacity
              key={student.id}
              style={styles.studentSuggestion}
              onPress={() => onStudentSelect(student)}
              activeOpacity={0.7}
            >
              <View style={styles.studentSuggestionInfo}>
                <Text style={styles.studentSuggestionName}>{student.fullname}</Text>
                <Text style={styles.studentSuggestionDepartment}>{student.department}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={COLORS.gray} />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {selectedStudent && (
        <View style={styles.selectedStudentCard}>
          <View style={styles.selectedStudentHeader}>
            <Ionicons name="person-circle" size={32} color={COLORS.primary} />
            <View style={styles.selectedStudentInfo}>
              <Text style={styles.selectedStudentName}>{selectedStudent.fullname}</Text>
              <Text style={styles.selectedStudentDepartment}>{selectedStudent.department}</Text>
            </View>
            <TouchableOpacity
              onPress={onRemoveStudent}
              style={styles.removeStudentButton}
            >
              <Ionicons name="close-circle" size={24} color={COLORS.error} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchSection: {
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
    ...FONTS.h6_bold,
    color: COLORS.textPrimary,
    marginBottom: SIZES.margin,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.borderRadius,
    paddingHorizontal: SIZES.padding_sm,
  },
  searchInput: {
    flex: 1,
    padding: SIZES.padding_sm,
    marginLeft: SIZES.margin_sm,
    ...FONTS.h6_regular,
  },
  studentSuggestions: {
    marginTop: SIZES.margin_sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.borderRadius,
    backgroundColor: COLORS.white,
  },
  studentSuggestion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SIZES.padding_sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  studentSuggestionInfo: {
    flex: 1,
  },
  studentSuggestionName: {
    ...FONTS.h6_bold,
    color: COLORS.textPrimary,
  },
  studentSuggestionDepartment: {
    ...FONTS.h6_regular,
    color: COLORS.gray,
    marginTop: 2,
  },
  selectedStudentCard: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: SIZES.borderRadius,
    padding: SIZES.padding,
    marginTop: SIZES.margin_sm,
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
