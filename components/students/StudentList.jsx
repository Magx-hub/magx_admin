
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  TextInput,
  RefreshControl,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS, STYLES } from '../../constants/base';

const StudentList = ({ 
  students, 
  loading, 
  error, 
  onEdit, 
  onDelete, 
  onRefresh,
  refreshing = false 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Get unique departments from students
  const departments = ['All', ...new Set(students.map(student => student.department))];

  // Filter students based on search and department
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === 'All' || student.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  // Handle delete with confirmation
  const handleDelete = (student) => {
    Alert.alert(
      'Delete Student',
      `Are you sure you want to delete ${student.fullname}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => onDelete(student.id)
        }
      ]
    );
  };

  // Render table header
  const renderTableHeader = () => (
    <View style={[STYLES.tableHeader, { flexDirection: 'row' }]}>
      <View style={[STYLES.tableCell, { flex: 3 }]}>
        <Text style={STYLES.tableHeaderText}>Name</Text>
      </View>
      <View style={[STYLES.tableCell, { flex: 2 }]}>
        <Text style={STYLES.tableHeaderText}>Class</Text>
      </View>
      <View style={[STYLES.tableCell, { flex: 2 }]}>
        <Text style={STYLES.tableHeaderText}>Gender</Text>
      </View>
    </View>
  );

  // Render student item as table row
  const renderStudent = ({ item }) => (
    <TouchableOpacity 
      style={[
        STYLES.tableRow, 
        selectedStudent?.id === item.id && { backgroundColor: COLORS.primaryLight }
      ]}
      onPress={() => setSelectedStudent(selectedStudent?.id === item.id ? null : item)}
      activeOpacity={0.7}
    >
      <View style={[STYLES.tableCell, { flex: 3 }]}>
        <Text style={STYLES.tableCellText}>{item.fullname}</Text>
      </View>
      <View style={[STYLES.tableCell, { flex: 2 }]}>
        <Text style={[STYLES.tableCellText, { color: COLORS.primary }]}>{item.department}</Text>
      </View>
      <View style={[STYLES.tableCell, { flex: 2 }]}>
        <Text style={STYLES.tableCellText}>{item.gender}</Text>
      </View>
    </TouchableOpacity>
  );

  // Render student details panel
  const renderStudentDetails = () => {
    if (!selectedStudent) return null;

    return (
      <View style={styles.detailsPanel}>
        <View style={styles.detailsHeader}>
          <Text style={styles.detailsTitle}>Student Details</Text>
          <TouchableOpacity 
            onPress={() => setSelectedStudent(null)}
            style={styles.closeDetailsButton}
          >
            <Ionicons name="close" size={20} color={COLORS.gray} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.detailsContent}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Full Name:</Text>
            <Text style={styles.detailValue}>{selectedStudent.fullname}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Department:</Text>
            <Text style={[styles.detailValue, { color: COLORS.primary }]}>
              {selectedStudent.department}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Gender:</Text>
            <Text style={styles.detailValue}>{selectedStudent.gender}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date Added:</Text>
            <Text style={styles.detailValue}>
              {new Date(selectedStudent.createdAt).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Text>
          </View>
        </View>
        
        <View style={styles.detailsActions}>
          <TouchableOpacity
            style={[
              STYLES.actionButton, 
              STYLES.actionButtonPrimary, 
              { flex: 1, marginRight: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }
            ]}
            onPress={() => {
              onEdit(selectedStudent);
              setSelectedStudent(null);
            }}
          >
            <Ionicons name="pencil" size={16} color={COLORS.white} style={{ marginRight: 6 }} />
            <Text style={STYLES.actionButtonText}>Edit</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              STYLES.actionButton, 
              STYLES.actionButtonDanger, 
              { flex: 1, marginLeft: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }
            ]}
            onPress={() => {
              handleDelete(selectedStudent);
              setSelectedStudent(null);
            }}
          >
            <Ionicons name="trash" size={16} color={COLORS.white} style={{ marginRight: 6 }} />
            <Text style={STYLES.actionButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Render department filter
  const renderDepartmentFilter = () => (
    <View style={styles.filterContainer}>
      <FlatList
        data={departments}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedDepartment === item && styles.selectedFilterChip
            ]}
            onPress={() => setSelectedDepartment(item)}
          >
            <Text style={[
              styles.filterChipText,
              selectedDepartment === item && styles.selectedFilterChipText
            ]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );

  // Empty state
  const renderEmptyState = () => (
    <View style={STYLES.emptyState}>
      <Ionicons name="people-outline" size={64} color={COLORS.gray} />
      <Text style={STYLES.emptyTitle}>No Students Found</Text>
      <Text style={STYLES.emptySubtitle}>
        {searchQuery || selectedDepartment !== 'All' 
          ? 'Try adjusting your search or filter criteria'
          : 'Add your first student to get started'
        }
      </Text>
    </View>
  );

  // Error state
  if (error) {
    return (
      <View style={STYLES.errorState}>
        <Ionicons name="alert-circle-outline" size={64} color={COLORS.error} />
        <Text style={STYLES.errorTitle}>Error Loading Students</Text>
        <Text style={STYLES.errorSubtitle}>{error?.message || String(error)}</Text>
        <TouchableOpacity style={STYLES.buttonPrimary} onPress={onRefresh}>
          <Text style={STYLES.buttonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Loading state
  if (loading && students.length === 0) {
    return (
      <View style={STYLES.loadingState}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={STYLES.loadingText}>Loading students...</Text>
      </View>
    );
  }

  return (
    <View style={STYLES.container}>
      <ScrollView 
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Search Bar */}
        <View style={STYLES.searchContainer}>
          <Ionicons name="search" size={20} color={COLORS.placeholder} style={styles.searchIcon} />
          <TextInput
            style={STYLES.searchInput}
            placeholder="Search students..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={COLORS.placeholder}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={COLORS.placeholder} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Department Filter */}
        {renderDepartmentFilter()}

        {/* Stats */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>
            {filteredStudents.length} of {students.length} students
          </Text>
        </View>

        {/* Students Table */}
        <View style={styles.tableContainer}>
          {filteredStudents.length > 0 && renderTableHeader()}
          <FlatList
            data={filteredStudents}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderStudent}
            ListEmptyComponent={renderEmptyState}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={[
              filteredStudents.length === 0 && styles.emptyListContainer
            ]}
            showsVerticalScrollIndicator={false}
            style={styles.tableList}
            scrollEnabled={false}
            nestedScrollEnabled={true}
          />
        </View>
        
        {/* Student Details Panel - Outside table container for proper scrolling */}
        {renderStudentDetails()}
        
        {/* Bottom spacing to ensure content is visible above tab bar */}
        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  searchIcon: {
    marginRight: 10,
  },
  filterContainer: {
    paddingHorizontal: SIZES.margin,
    marginBottom: 10,
  },
  filterChip: {
    backgroundColor: COLORS.gray_light,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  selectedFilterChip: {
    backgroundColor: COLORS.primary,
  },
  filterChipText: {
    ...FONTS.h6_regular,
    color: COLORS.textPrimary,
  },
  selectedFilterChipText: {
    color: COLORS.white,
  },
  statsContainer: {
    paddingHorizontal: SIZES.margin,
    paddingVertical: 5,
  },
  statsText: {
    ...FONTS.h6_regular,
    color: COLORS.textSecondary,
  },
  tableContainer: {
    backgroundColor: COLORS.white,
    marginHorizontal: SIZES.margin_sm,
    borderRadius: SIZES.borderRadius_md,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  tableList: {
    backgroundColor: COLORS.white,
    maxHeight: 400,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  detailsPanel: {
    backgroundColor: COLORS.gray_light,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    padding: SIZES.padding,
    marginHorizontal: SIZES.margin_sm,
    marginTop: SIZES.margin_sm,
    marginBottom: SIZES.margin,
    borderRadius: SIZES.borderRadius_md,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.margin,
  },
  detailsTitle: {
    ...FONTS.h4_bold,
    color: COLORS.accent,
  },
  closeDetailsButton: {
    padding: 4,
  },
  detailsContent: {
    marginBottom: SIZES.margin,
  },
  detailRow: {
    flexDirection: 'row',
    paddingVertical: SIZES.padding_sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  detailLabel: {
    ...FONTS.h6_regular,
    color: COLORS.textSecondary,
    width: 100,
    fontWeight: '600',
  },
  detailValue: {
    ...FONTS.h6_regular,
    color: COLORS.textPrimary,
    flex: 1,
  },
  detailsActions: {
    flexDirection: 'row',
    gap: SIZES.margin_sm,
  },
});

export default StudentList;
