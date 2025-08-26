
// ============================================================================
// components/attendance/AttendanceList.jsx
// ============================================================================

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

const AttendanceList = ({ 
  attendances, 
  loading, 
  error, 
  onEdit, 
  onDelete, 
  onRefresh,
  refreshing = false 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Get unique statuses from attendances
  const statuses = ['All', ...new Set(attendances.map(item => item.status))];

  // Filter attendances based on search and status
  const filteredAttendances = attendances.filter(item => {
    const matchesSearch = item.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Pagination calculations
  const totalItems = filteredAttendances.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAttendances = filteredAttendances.slice(startIndex, endIndex);

  // Handle delete with confirmation
  const handleDelete = (item) => {
    Alert.alert(
      'Delete Attendance Record',
      `Are you sure you want to delete this record for ${item.fullname}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => onDelete(item.id)
        }
      ]
    );
  };

  // Handle search and filter changes (reset to page 1)
  const handleSearchChange = (text) => {
    setSearchQuery(text);
    setCurrentPage(1);
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  const getStatusColor = (status) => {
    switch (status) {
        case 'Present': return COLORS.success;
        case 'Absent': return COLORS.error;
        case 'Late': return COLORS.warning;
        case 'Half Day': return COLORS.info;
        default: return COLORS.gray;
    }
  };

  // Render attendance item as card
  const renderAttendance = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.attendanceCard, 
        selectedAttendance?.id === item.id && styles.selectedCard
      ]}
      onPress={() => setSelectedAttendance(selectedAttendance?.id === item.id ? null : item)}
      activeOpacity={0.7}
    >
      {/* Row 1: Teacher, Date, Status */}
      <View style={styles.attendanceRowTop}>
        <View style={{ flex: 2 }}>
          <Text style={styles.teacherName}>{item.fullname}</Text>
          <Text style={styles.teacherDepartment}>{item.department}</Text>
        </View>
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <Text style={styles.dateText}>{new Date(item.date).toLocaleDateString()}</Text>
          <View style={[styles.statusBadge, {backgroundColor: getStatusColor(item.status), marginTop: 2}]}> 
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
      </View>

      {/* Row 2: Time and Hours */}
      <View style={styles.attendanceRowMiddle}>
        <Text style={styles.timeText}>{(item.checkInTime || '--:--') + ' - ' + (item.checkOutTime || '--:--')}</Text>
        <Text style={styles.hoursText}>{item.workHours?.toFixed(1) || '0.0'}h</Text>
      </View>

      {/* Row 3: Actions */}
      <View style={styles.attendanceRowBottom}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => onEdit(item)}
          activeOpacity={0.7}
        >
          <Ionicons name="pencil" size={16} color={COLORS.white} />
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDelete(item)}
          activeOpacity={0.7}
        >
          <Ionicons name="trash" size={16} color={COLORS.white} />
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  // Render attendance details panel
  const renderAttendanceDetails = () => {
    if (!selectedAttendance) return null;

    return (
      <View style={styles.detailsPanel}>
        <View style={styles.detailsHeader}>
          <Text style={styles.detailsTitle}>Attendance Details</Text>
          <TouchableOpacity 
            onPress={() => setSelectedAttendance(null)}
            style={styles.closeDetailsButton}
          >
            <Ionicons name="close" size={20} color={COLORS.gray} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.detailsContent}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Teacher:</Text>
            <Text style={styles.detailValue}>{selectedAttendance.fullname}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Department:</Text>
            <Text style={[styles.detailValue, { color: COLORS.primary }]}>
              {selectedAttendance.department}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date:</Text>
            <Text style={styles.detailValue}>
              {new Date(selectedAttendance.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Status:</Text>
            <View style={[styles.statusBadge, {backgroundColor: getStatusColor(selectedAttendance.status)}]}>
              <Text style={styles.statusText}>{selectedAttendance.status}</Text>
            </View>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Check In:</Text>
            <Text style={styles.detailValue}>{selectedAttendance.checkInTime || 'N/A'}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Check Out:</Text>
            <Text style={styles.detailValue}>{selectedAttendance.checkOutTime || 'N/A'}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Work Hours:</Text>
            <Text style={styles.detailValue}>{selectedAttendance.workHours?.toFixed(2) || '0.00'} hours</Text>
          </View>
        </View>
      </View>
    );
  };

  // Render pagination controls
  const renderPaginationControls = () => {
    if (totalPages <= 1) return null;

    return (
      <View style={styles.paginationContainer}>
        <TouchableOpacity
          style={[styles.paginationButton, currentPage === 1 && styles.paginationButtonDisabled]}
          onPress={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          <Ionicons name="chevron-back" size={16} color={currentPage === 1 ? COLORS.gray : COLORS.primary} />
          <Text style={[styles.paginationButtonText, currentPage === 1 && styles.paginationButtonTextDisabled]}>Previous</Text>
        </TouchableOpacity>
        
        <View style={styles.paginationInfo}>
          <Text style={styles.paginationText}>Page {currentPage} of {totalPages}</Text>
          <Text style={styles.paginationSubText}>
            {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems}
          </Text>
        </View>
        
        <TouchableOpacity
          style={[styles.paginationButton, currentPage === totalPages && styles.paginationButtonDisabled]}
          onPress={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          <Text style={[styles.paginationButtonText, currentPage === totalPages && styles.paginationButtonTextDisabled]}>Next</Text>
          <Ionicons name="chevron-forward" size={16} color={currentPage === totalPages ? COLORS.gray : COLORS.primary} />
        </TouchableOpacity>
      </View>
    );
  };

  // Render status filter
  const renderStatusFilter = () => (
    <View style={styles.filterContainer}>
      <FlatList
        data={statuses}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedStatus === item && styles.selectedFilterChip
            ]}
            onPress={() => handleStatusChange(item)}
          >
            <Text style={[
              styles.filterChipText,
              selectedStatus === item && styles.selectedFilterChipText
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
    <View style={styles.emptyState}>
      <Ionicons name="calendar-outline" size={64} color={COLORS.gray} />
      <Text style={styles.emptyTitle}>No Attendance Records</Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery || selectedStatus !== 'All' 
          ? 'Try adjusting your search or filter criteria'
          : 'Add your first attendance record to get started'
        }
      </Text>
    </View>
  );

  // Error state
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color={COLORS.error} />
        <Text style={styles.errorTitle}>Error Loading Records</Text>
        <Text style={styles.errorSubtitle}>{error?.message || String(error)}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Loading state
  if (loading && attendances.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading records...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={COLORS.placeholder} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or department..."
            value={searchQuery}
            onChangeText={handleSearchChange}
            placeholderTextColor={COLORS.placeholder}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => handleSearchChange('')}>
              <Ionicons name="close-circle" size={20} color={COLORS.placeholder} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Status Filter */}
        {renderStatusFilter()}

        {/* Stats */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>
            {totalItems} records found
          </Text>
        </View>

        {/* Attendance List */}
        <View style={styles.listContainer}>
          <FlatList
            data={paginatedAttendances}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderAttendance}
            ListEmptyComponent={renderEmptyState}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={[
              paginatedAttendances.length === 0 && styles.emptyListContainer
            ]}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            nestedScrollEnabled={true}
          />
        </View>
        
        {/* Pagination Controls */}
        {renderPaginationControls()}
        
        {/* Attendance Details Panel */}
        {renderAttendanceDetails()}
        
        {/* Bottom spacing to ensure content is visible above tab bar */}
        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  attendanceRowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
    gap: SIZES.margin_sm,
  },
  attendanceRowMiddle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
    paddingHorizontal: 2,
  },
  timeText: {
    ...FONTS.h6_regular,
    color: COLORS.textSecondary,
  },
  attendanceRowBottom: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: SIZES.margin_sm,
    marginTop: 4,
  },
  infoColumn: {
    flexDirection: 'column',
    gap: SIZES.margin_sm,
    marginTop: SIZES.margin_sm,
    marginBottom: SIZES.margin_sm,
  },
  infoRowSingle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.padding_sm,
    borderBottomWidth: 0,
  },
  actionsColumn: {
    flexDirection: 'column',
    gap: SIZES.margin_sm,
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: SIZES.margin,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadius_md,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding_sm,
    marginBottom: SIZES.margin,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: SIZES.margin_sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  filterContainer: {
    marginBottom: SIZES.margin,
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
    marginBottom: SIZES.margin,
  },
  statsText: {
    ...FONTS.h6_regular,
    color: COLORS.textSecondary,
  },
  listContainer: {
    marginBottom: SIZES.margin,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  // New card-based layout styles
  attendanceCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadius_md,
    padding: SIZES.padding,
    marginBottom: SIZES.margin_sm,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedCard: {
    backgroundColor: COLORS.primaryLight,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  teacherInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SIZES.margin_sm,
  },
  teacherInfo: {
    flex: 1,
  },
  teacherName: {
    ...FONTS.h6_bold,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  teacherDepartment: {
    ...FONTS.h6_regular,
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  dateText: {
    ...FONTS.h6_regular,
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.padding_sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoLabel: {
    ...FONTS.h6_regular,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    minWidth: 80,
    alignItems: 'center',
  },
  statusText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  hoursText: {
    ...FONTS.h6_bold,
    color: COLORS.primary,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SIZES.margin_sm,
    marginTop: SIZES.margin_sm,
    paddingTop: SIZES.margin_sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.padding_sm,
    paddingHorizontal: SIZES.padding,
    borderRadius: SIZES.borderRadius,
    gap: 6,
  },
  editButton: {
    backgroundColor: COLORS.success,
  },
  deleteButton: {
    backgroundColor: COLORS.error,
  },
  actionButtonText: {
    ...FONTS.h6_regular,
    color: COLORS.white,
    fontWeight: '600',
  },
  // Details panel styles
  detailsPanel: {
    backgroundColor: COLORS.gray_light,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    padding: SIZES.padding,
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
    alignItems: 'center',
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
  // Pagination styles
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
    backgroundColor: COLORS.white,
    marginBottom: SIZES.margin,
    borderRadius: SIZES.borderRadius_md,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  paginationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding_sm,
    borderRadius: SIZES.borderRadius_sm,
    backgroundColor: COLORS.primaryLight,
  },
  paginationButtonDisabled: {
    backgroundColor: COLORS.gray_light,
  },
  paginationButtonText: {
    ...FONTS.h6_regular,
    color: COLORS.primary,
    marginHorizontal: 4,
  },
  paginationButtonTextDisabled: {
    color: COLORS.gray,
  },
  paginationInfo: {
    alignItems: 'center',
  },
  paginationText: {
    ...FONTS.h6_bold,
    color: COLORS.textPrimary,
  },
  paginationSubText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  // State styles
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#495057',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 24,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#dc3545',
    marginTop: 16,
    marginBottom: 8,
  },
  errorSubtitle: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6c757d',
  },
});

export default AttendanceList;
