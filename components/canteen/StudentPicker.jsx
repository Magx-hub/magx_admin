import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../../constants/base';

export default function StudentPicker({ 
  students, 
  searchQuery, 
  onSearchQueryChange, 
  onStudentSelect, 
  onClose 
}) {
  // Filter students based on search query (robust against nulls)
  const normalize = (v) => (v ?? '').toString().toLowerCase();
  const q = normalize(searchQuery);
  const filteredStudents = (students || []).filter((student) => {
    const name = normalize(student?.fullname);
    const dept = normalize(student?.department);
    return name.includes(q) || dept.includes(q);
  });

  return (
    <View style={styles.studentPicker}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={COLORS.gray} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search students by name or department..."
          value={searchQuery}
          onChangeText={onSearchQueryChange}
          autoFocus={false}
        />
        <TouchableOpacity 
          onPress={onClose}
          style={styles.closeButton}
        >
          <Ionicons name="close" size={20} color={COLORS.gray} />
        </TouchableOpacity>
      </View>
      
      {filteredStudents.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            No students found.
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.studentList}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled
          contentContainerStyle={styles.studentListContent}
        >
          {filteredStudents.map((student) => (
            <TouchableOpacity
              key={student.id}
              style={styles.studentItem}
              onPress={() => onStudentSelect(student)}
              activeOpacity={0.7}
            >
              <View style={styles.studentInfo}>
                <Text style={styles.studentName}>{student.fullname}</Text>
                <Text style={styles.studentDepartment}>{student.department}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={COLORS.gray} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  studentPicker: {
    flex: 1,
    minHeight: 200,
    justifyContent: 'flex-start',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: SIZES.margin_sm,
    padding: SIZES.padding_sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.borderRadius,
    ...FONTS.h6_regular,
  },
  closeButton: {
    padding: SIZES.padding_sm,
    marginLeft: SIZES.margin_sm,
  },
  studentList: {
    maxHeight: 300,
    minHeight: 100,
  },
  studentListContent: {
    paddingBottom: SIZES.padding,
  },
  studentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    ...FONTS.h6_bold,
    color: COLORS.textPrimary,
  },
  studentDepartment: {
    ...FONTS.h6_regular,
    color: COLORS.gray,
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.padding,
    gap: 8,
  },
  emptyText: {
    ...FONTS.h6_regular,
    color: COLORS.gray,
  },
});
