// ============================================================================
// components/attendance/TeacherAttendanceSummary.jsx
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Alert,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS, STYLES } from '../../constants/base';
import ReportsTab from './ReportsTab';
import AttendanceTabs from './AttendanceTabs';
import SearchAndFilters from './SearchAndFilters';
import AttendanceTable from './AttendanceTable';
import AttendanceRow from './AttendanceRow';
import TeacherSummaryRow from './TeacherSummaryRow';
import TeacherSummaryCard from './TeacherSummaryCard';
import PaginationControls from './PaginationControls';

const TeacherAttendanceSummary = ({ 
  attendances, 
  loading, 
  error, 
  onEdit, 
  onDelete, 
  onRefresh,
  refreshing = false,
  getAllTeachersAttendanceSummary,
  onTabChange,
  teachers,
  getAttendanceByDateRange,
  getWeeklyAttendanceStats
}) => {
  const [activeTab, setActiveTab] = useState('records'); // 'records', 'summaries', or 'reports'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [teacherSummaries, setTeacherSummaries] = useState([]);
  const [summariesLoading, setSummariesLoading] = useState(false);
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

  // Pagination calculations for records tab
  const totalItems = filteredAttendances.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAttendances = filteredAttendances.slice(startIndex, endIndex);

  // Filter teacher summaries based on search
  const filteredSummaries = teacherSummaries.filter(summary => {
    return summary.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
           summary.department.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Load teacher summaries when summaries tab is active
  useEffect(() => {
    if (activeTab === 'summaries' && teacherSummaries.length === 0) {
      loadTeacherSummaries();
    }
  }, [activeTab]);

  const loadTeacherSummaries = async () => {
    setSummariesLoading(true);
    try {
      const summaries = await getAllTeachersAttendanceSummary();
      setTeacherSummaries(summaries || []);
    } catch (error) {
      console.error('Error loading teacher summaries:', error);
      Alert.alert('Error', 'Failed to load teacher summaries');
    } finally {
      setSummariesLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchQuery(''); // Clear search when switching tabs
    setCurrentPage(1); // Reset pagination
    setSelectedAttendance(null); // Clear selection
    if (onTabChange) {
      onTabChange(tab);
    }
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

  // Render attendance details panel for records tab
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
        
        <View style={styles.detailsActions}>
          <TouchableOpacity
            style={[
              STYLES.actionButton, 
              STYLES.actionButtonPrimary, 
              { flex: 1, marginRight: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }
            ]}
            onPress={() => {
              onEdit(selectedAttendance);
              setSelectedAttendance(null);
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
              handleDelete(selectedAttendance);
              setSelectedAttendance(null);
            }}
          >
            <Ionicons name="trash" size={16} color={COLORS.white} style={{ marginRight: 6 }} />
            <Text style={STYLES.actionButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
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

  // Empty state
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons 
        name={
          activeTab === 'records' ? "calendar-outline" : 
          activeTab === 'summaries' ? "analytics-outline" : 
          "document-text-outline"
        } 
        size={64} 
        color="#ccc" 
      />
      <Text style={styles.emptyTitle}>
        {
          activeTab === 'records' ? 'No Attendance Records' : 
          activeTab === 'summaries' ? 'No Teacher Summaries' :
          'No Reports Available'
        }
      </Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery 
          ? 'Try adjusting your search criteria'
          : activeTab === 'records' 
            ? 'Add your first attendance record to get started'
            : activeTab === 'summaries'
              ? 'No teacher data available'
              : 'Configure filters to generate reports'
        }
      </Text>
    </View>
  );

  // Error state
  if (error) {
    return (
      <View style={styles.errorState}>
        <Ionicons name="alert-circle-outline" size={64} color={COLORS.error} />
        <Text style={styles.errorTitle}>Error Loading Data</Text>
        <Text style={styles.errorSubtitle}>{error?.message || String(error)}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Loading state
  if ((loading && attendances.length === 0) || (summariesLoading && teacherSummaries.length === 0)) {
    return (
      <View style={styles.loadingState}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>
          {
            activeTab === 'records' ? 'Loading records...' : 
            activeTab === 'summaries' ? 'Loading summaries...' :
            'Loading reports...'
          }
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <AttendanceTabs activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Search and Filters */}
      <SearchAndFilters
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        selectedStatus={selectedStatus}
        onStatusChange={handleStatusChange}
        statuses={statuses}
      />

      {/* Stats */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          {activeTab === 'records' 
            ? `${totalItems} records found`
            : `${filteredSummaries.length} of ${teacherSummaries.length} teachers`
          }
        </Text>
      </View>

      {/* Content List */}
      {activeTab === 'reports' ? (
        <ReportsTab
          attendances={attendances}
          teachers={teachers}
          loading={loading}
          error={error}
          getAttendanceByDateRange={getAttendanceByDateRange}
          getWeeklyAttendanceStats={getWeeklyAttendanceStats}
          getAllTeachersAttendanceSummary={getAllTeachersAttendanceSummary}
        />
      ) : activeTab === 'records' ? (
        <ScrollView 
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Attendance Table */}
          <AttendanceTable>
            {paginatedAttendances.map((item) => (
              <AttendanceRow
                key={item.id}
                item={item}
                onEdit={onEdit}
                onDelete={handleDelete}
                onSelect={setSelectedAttendance}
                isSelected={selectedAttendance?.id === item.id}
              />
            ))}
          </AttendanceTable>
          
          {/* Pagination Controls */}
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
          
          {/* Attendance Details Panel */}
          {renderAttendanceDetails()}
          
          {/* Bottom spacing */}
          <View style={{ height: 120 }} />
        </ScrollView>
      ) : (
        <FlatList
          data={filteredSummaries}
          renderItem={({ item }) => (
            <TeacherSummaryCard summary={item} />
          )}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.cardListContainer}
          refreshControl={
            <RefreshControl
              refreshing={summariesLoading}
              onRefresh={loadTeacherSummaries}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
          ListEmptyComponent={renderEmptyState}
          ListFooterComponent={<View style={{ height: 100 }} />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  statsContainer: {
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  statsText: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '500',
  },
  // Details panel styles for Records tab
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
  detailsActions: {
    flexDirection: 'row',
    gap: SIZES.margin_sm,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginBottom: 5
  },
  statusText:{
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold'
  },
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
  errorState: {
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
  loadingState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6c757d',
  },
  cardListContainer: {
    paddingTop: SIZES.margin_sm,
    paddingBottom: SIZES.margin,
  },
});

export default TeacherAttendanceSummary;
