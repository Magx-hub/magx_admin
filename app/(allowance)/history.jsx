// app/(allowance)/history.jsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS, STYLES } from '../../constants/base';
import { useAllowance } from '../../hooks/useAllowance';

export default function AllowanceHistory() {
  const [activeTab, setActiveTab] = useState('history');
  const [welfareRecords, setWelfareRecords] = useState([]);
  const [selectedCalculation, setSelectedCalculation] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const { fetchWelfareRecords, fetchAllowances, deleteAllowance, loading, allowances } = useAllowance();

  useEffect(() => {
    loadCalculations();
    loadWelfareRecords();
  }, []);

  const loadWelfareRecords = async () => {
    try {
      console.log('Loading welfare records...');
      const records = await fetchWelfareRecords();
      console.log('Welfare records received:', records);
      if (records) {
        setWelfareRecords(records);
        console.log('Welfare records set to state:', records.length);
      } else {
        console.log('No welfare records received');
        setWelfareRecords([]);
      }
    } catch (error) {
      console.error('Error loading welfare records:', error);
      setWelfareRecords([]);
    }
  };

  const loadCalculations = async () => {
    try {
      console.log('Loading calculations from database...');
      await fetchAllowances();
      // The allowances are managed by the useAllowance hook
    } catch (error) {
      console.error('Error loading calculations:', error);
    }
  };

  const deleteCalculation = (calculationToDelete) => {
    Alert.alert(
      'Delete Calculation',
      `Are you sure you want to delete Week ${calculationToDelete.weekNumber} calculation? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const success = await deleteAllowance(calculationToDelete.id);
              if (success) {
                setSelectedCalculation(null);
                Alert.alert('Success', 'Calculation deleted successfully');
              } else {
                Alert.alert('Error', 'Failed to delete calculation');
              }
            } catch (error) {
              console.error('Error deleting calculation:', error);
              Alert.alert('Error', 'Failed to delete calculation');
            }
          }
        }
      ]
    );
  };

  const handleEdit = (calculation) => {
    // Placeholder for edit functionality
    Alert.alert(
      'Edit Calculation',
      'Edit functionality would be implemented here. This would navigate to an edit screen.',
      [{ text: 'OK' }]
    );
  };

  // Render table header
  const renderTableHeader = () => (
    <View style={[STYLES.tableHeader, { flexDirection: 'row' }]}>
      <View style={[STYLES.tableCell, { flex: 1 }]}>
        <Text style={STYLES.tableHeaderText}>Week</Text>
      </View>
      <View style={[STYLES.tableCell, { flex: 2 }]}>
        <Text style={STYLES.tableHeaderText}>Date</Text>
      </View>
      <View style={[STYLES.tableCell, { flex: 1.5 }]}>
        <Text style={STYLES.tableHeaderText}>Amount</Text>
      </View>
      <View style={[STYLES.tableCell, { flex: 1 }]}>
        <Text style={STYLES.tableHeaderText}>Teachers</Text>
      </View>
    </View>
  );

  // Render calculation item as table row
  const renderCalculationItem = ({ item }) => (
    <TouchableOpacity 
      style={[
        STYLES.tableRow, 
        selectedCalculation?.id === item.id && { backgroundColor: COLORS.primaryLight }
      ]}
      onPress={() => {
        const newSelection = selectedCalculation?.id === item.id ? null : item;
        setSelectedCalculation(newSelection);
      }}
      activeOpacity={0.7}
    >
      <View style={[STYLES.tableCell, { flex: 1 }]}>
        <Text style={STYLES.tableCellText}>{item.weekNumber}</Text>
      </View>
      <View style={[STYLES.tableCell, { flex: 2 }]}>
        <Text style={STYLES.tableCellText}>
          {(() => {
            if (item.createdAt) {
              try {
                const date = new Date(item.createdAt);
                if (!isNaN(date.getTime())) {
                  return date.toLocaleDateString();
                }
              } catch (e) {
                console.log('Error parsing date:', item.createdAt, e);
              }
            }
            return 'N/A';
          })()}
        </Text>
      </View>
      <View style={[STYLES.tableCell, { flex: 1.5 }]}>
        <Text style={[STYLES.tableCellText, { color: COLORS.success, fontWeight: '600' }]}>₵{item.totalSum.toFixed(2)}</Text>
      </View>
      <View style={[STYLES.tableCell, { flex: 1 }]}>
        <Text style={STYLES.tableCellText}>{item.numberOfTeachers}</Text>
      </View>
    </TouchableOpacity>
  );

  // Render calculation details panel
  const renderCalculationDetails = () => {
    if (!selectedCalculation) {
      return null;
    }

    return (
      <View style={styles.detailsPanel}>
        <View style={styles.detailsHeader}>
          <Text style={styles.detailsTitle}>Week {selectedCalculation.weekNumber} Details</Text>
          <TouchableOpacity 
            onPress={() => setSelectedCalculation(null)}
            style={styles.closeDetailsButton}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          style={styles.detailsContent}
          contentContainerStyle={styles.detailsContentContainer}
          showsVerticalScrollIndicator={true}
          scrollEnabled={true}
          nestedScrollEnabled={true}
          keyboardShouldPersistTaps="handled"
        >
          {/* Summary */}
          <View style={styles.summarySection}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Amount:</Text>
              <Text style={styles.summaryValue}>GH₵{selectedCalculation.totalSum?.toFixed(2) || '0.00'}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Teachers:</Text>
              <Text style={styles.summaryValue}>{selectedCalculation.numberOfTeachers || 0}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Per Teacher:</Text>
              <Text style={styles.summaryValue}>GH₵{selectedCalculation.eachTeacher?.toFixed(2) || '0.00'}</Text>
            </View>
          </View>

          {/* Class Breakdown */}
          <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}>Class Amounts</Text>
            <View style={styles.breakdownTable}>
              {[
                { key: 'creche', label: 'Creche' },
                { key: 'nursery1', label: 'Nursery 1' },
                { key: 'nursery2', label: 'Nursery 2' },
                { key: 'kg1', label: 'KG 1' },
                { key: 'kg2', label: 'KG 2' },
                { key: 'basic1', label: 'Basic 1' },
                { key: 'basic2', label: 'Basic 2' },
                { key: 'basic3', label: 'Basic 3' },
                { key: 'basic4', label: 'Basic 4' },
                { key: 'basic5', label: 'Basic 5' },
                { key: 'basic6', label: 'Basic 6' },
                { key: 'basic7General', label: 'Basic 7 (General)' },
                { key: 'basic7JHS', label: 'Basic 7 (JHS)' },
                { key: 'basic8General', label: 'Basic 8 (General)' },
                { key: 'basic8JHS', label: 'Basic 8 (JHS)' },
                { key: 'basic9General', label: 'Basic 9 (General)' },
                { key: 'basic9JHS', label: 'Basic 9 (JHS)' },
              ].map(({ key, label }) => (
                <View key={key} style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>{label}</Text>
                  <Text style={styles.breakdownValue}>GH₵{(selectedCalculation[key] || 0).toFixed(2)}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Deductions */}
          <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}>Deductions</Text>
            <View style={styles.breakdownTable}>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Welfare Deduction</Text>
                <Text style={[styles.breakdownValue, { color: COLORS.error }]}>-GH₵{selectedCalculation.welfare?.toFixed(2) || '0.00'}</Text>
              </View>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Office (5%)</Text>
                <Text style={[styles.breakdownValue, { color: COLORS.error }]}>-GH₵{selectedCalculation.office?.toFixed(2) || '0.00'}</Text>
              </View>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Kitchen (5%)</Text>
                <Text style={[styles.breakdownValue, { color: COLORS.error }]}>-GH₵{selectedCalculation.kitchen?.toFixed(2) || '0.00'}</Text>
              </View>
              <View style={[styles.breakdownRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Balance After Deductions</Text>
                <Text style={styles.totalValue}>GH₵{selectedCalculation.balanceAfterKitchen?.toFixed(2) || '0.00'}</Text>
              </View>
            </View>
          </View>
        </ScrollView>
        
        <View style={styles.detailsActions}>
          <TouchableOpacity
            style={[
              STYLES.actionButton, 
              STYLES.actionButtonPrimary, 
              { flex: 1, marginRight: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }
            ]}
            onPress={() => handleEdit(selectedCalculation)}
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
            onPress={() => deleteCalculation(selectedCalculation)}
          >
            <Ionicons name="trash" size={16} color={COLORS.white} style={{ marginRight: 6 }} />
            <Text style={STYLES.actionButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>

        {/* Additional Close Button */}
        <View style={styles.additionalCloseSection}>
          <TouchableOpacity
            style={styles.additionalCloseButton}
            onPress={() => setSelectedCalculation(null)}
            activeOpacity={0.7}
          >
            <Ionicons name="close-circle" size={24} color={COLORS.gray} />
            <Text style={styles.additionalCloseText}>Close Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Render welfare table header
  const renderWelfareTableHeader = () => (
    <View style={[STYLES.tableHeader, { flexDirection: 'row' }]}>
      <View style={[STYLES.tableCell, { flex: 1 }]}>
        <Text style={STYLES.tableHeaderText}>Week</Text>
      </View>
      <View style={[STYLES.tableCell, { flex: 1.5 }]}>
        <Text style={STYLES.tableHeaderText}>Welfare</Text>
      </View>
      <View style={[STYLES.tableCell, { flex: 2 }]}>
        <Text style={STYLES.tableHeaderText}>Date Paid</Text>
      </View>
    </View>
  );

  // Render welfare record item as table row
  const renderWelfareItem = ({ item }) => (
    <View style={STYLES.tableRow}>
      <View style={[STYLES.tableCell, { flex: 1 }]}>
        <Text style={STYLES.tableCellText}>{item.weekNumber}</Text>
      </View>
      <View style={[STYLES.tableCell, { flex: 1.5 }]}>
        <Text style={[STYLES.tableCellText, { color: COLORS.success, fontWeight: '600' }]}>₵{item.welfare.toFixed(2)}</Text>
      </View>
      <View style={[STYLES.tableCell, { flex: 2 }]}>
        <Text style={STYLES.tableCellText}>{item.datePaid}</Text>
      </View>
    </View>
  );

  // Render tabs
  const renderTabs = () => (
    <View style={STYLES.tabContainer}>
      <TouchableOpacity
        style={[STYLES.tab, activeTab === 'history' && STYLES.tabActive]}
        onPress={() => setActiveTab('history')}
      >
        <Text style={[STYLES.tabText, activeTab === 'history' && STYLES.tabTextActive]}>History</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[STYLES.tab, activeTab === 'welfares' && STYLES.tabActive]}
        onPress={() => setActiveTab('welfares')}
      >
        <Text style={[STYLES.tabText, activeTab === 'welfares' && STYLES.tabTextActive]}>Welfares</Text>
      </TouchableOpacity>
    </View>
  );

  // Render empty state
  const renderEmptyState = (type = 'calculations') => (
    <View style={STYLES.emptyState}>
      <Ionicons 
        name={type === 'welfares' ? "wallet-outline" : "calculator-outline"} 
        size={64} 
        color={COLORS.gray} 
      />
      <Text style={STYLES.emptyTitle}>
        {type === 'welfares' ? 'No Welfare Records Yet' : 'No Calculations Yet'}
      </Text>
      <Text style={STYLES.emptySubtitle}>
        {type === 'welfares' 
          ? 'Welfare records will appear here after calculations with welfare deductions are made'
          : 'Calculations will appear here after you create them using the Calculator'
        }
      </Text>
    </View>
  );

  // Render welfare empty state
  const renderWelfareEmptyState = () => renderEmptyState('welfares');

  // Render content based on active tab
  const renderTabContent = () => {
    if (activeTab === 'history') {
      return (
        <>
          <View style={styles.tableContainer}>
            {allowances.length > 0 && renderTableHeader()}
            <FlatList
              data={allowances}
              keyExtractor={(item, index) => `${item.id}-${index}`}
              renderItem={renderCalculationItem}
              ListEmptyComponent={() => renderEmptyState('calculations')}
              contentContainerStyle={[
                allowances.length === 0 && styles.emptyListContainer
              ]}
              showsVerticalScrollIndicator={false}
              style={styles.tableList}
              scrollEnabled={false}
              nestedScrollEnabled={true}
            />
          </View>
          {renderCalculationDetails()}
        </>
      );
    } else {
      return (
        <View style={styles.tableContainer}>
          {welfareRecords.length > 0 && renderWelfareTableHeader()}
          <FlatList
            data={welfareRecords}
            keyExtractor={(item, index) => `${item.weekNumber}-${index}`}
            renderItem={renderWelfareItem}
            ListEmptyComponent={renderWelfareEmptyState}
            contentContainerStyle={[
              welfareRecords.length === 0 && styles.emptyListContainer
            ]}
            showsVerticalScrollIndicator={false}
            style={styles.tableList}
            scrollEnabled={false}
            nestedScrollEnabled={true}
          />
        </View>
      );
    }
  };

  // Removed early return for empty calculations to show tabs always

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.gray_light }}>
      <StatusBar backgroundColor={COLORS.accent} barStyle="light-content" />
      
      {/* Header */}
      <View style={STYLES.header}>
        <Text style={STYLES.headerTitle}>Calculation History</Text>
        <View style={styles.headerStats}>
          <Text style={styles.headerStatsText}>
            {activeTab === 'history' ? `${allowances.length} records` : `${welfareRecords.length} welfare records`}
          </Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsWrapper}>
        {renderTabs()}
      </View>

      <ScrollView 
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
      >
        {/* Tab Content */}
        {renderTabContent()}
        
        {/* Bottom spacing */}
        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerStats: {
    alignItems: 'flex-end',
  },
  headerStatsText: {
    ...FONTS.h6_regular,
    color: COLORS.white,
    opacity: 0.9,
  },
  tableContainer: {
    backgroundColor: COLORS.white,
    marginHorizontal: SIZES.margin_sm,
    marginTop: SIZES.margin,
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
    maxHeight: 300, // Reduced height to make room for details panel
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  detailsPanel: {
    backgroundColor: COLORS.white,
    marginHorizontal: SIZES.margin_sm,
    marginTop: SIZES.margin_sm,
    marginBottom: SIZES.margin,
    borderRadius: SIZES.borderRadius_md,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    maxHeight: '80%', // Use percentage instead of fixed height
    minHeight: 400, // Add minimum height
    overflow: 'hidden',
    zIndex: 1000, // Ensure it's on top
    position: 'relative', // Ensure proper positioning
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.white,
    minHeight: 60, // Ensure header has proper height
  },
  detailsTitle: {
    ...FONTS.h4_bold,
    color: COLORS.accent,
    flex: 1, // Allow title to take available space
  },
  closeDetailsButton: {
    padding: 8,
    backgroundColor: COLORS.error,
    borderRadius: 20,
    minWidth: 40,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContent: {
    flex: 1,
    minHeight: 300, // Increase minimum height
  },
  detailsContentContainer: {
    padding: SIZES.padding,
    paddingBottom: SIZES.padding * 2, // Add more bottom padding for scrolling
  },
  summarySection: {
    marginBottom: SIZES.margin,
    backgroundColor: COLORS.primaryLight,
    padding: SIZES.padding_sm,
    borderRadius: SIZES.borderRadius,
  },
  detailSection: {
    marginBottom: SIZES.margin,
  },
  sectionTitle: {
    ...FONTS.h5_regular,
    color: COLORS.accent,
    marginBottom: SIZES.margin_sm,
    fontWeight: '600',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  summaryLabel: {
    ...FONTS.h6_regular,
    color: COLORS.textPrimary,
  },
  summaryValue: {
    ...FONTS.h6_regular,
    color: COLORS.accent,
    fontWeight: '600',
  },
  breakdownTable: {
    backgroundColor: COLORS.gray_light,
    borderRadius: SIZES.borderRadius,
    padding: SIZES.padding_sm,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.padding_sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  breakdownLabel: {
    ...FONTS.h6_regular,
    color: COLORS.textPrimary,
    flex: 1,
  },
  breakdownValue: {
    ...FONTS.h6_regular,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 2,
    borderTopColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
    marginTop: SIZES.margin_sm,
    borderRadius: SIZES.borderRadius,
  },
  totalLabel: {
    ...FONTS.h6_regular,
    color: COLORS.accent,
    fontWeight: '600',
    flex: 1,
  },
  totalValue: {
    ...FONTS.h6_regular,
    color: COLORS.accent,
    fontWeight: 'bold',
  },
  detailsActions: {
    flexDirection: 'row',
    padding: SIZES.padding,
    gap: SIZES.margin_sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  tabsWrapper: {
    paddingHorizontal: SIZES.margin_sm,
    paddingVertical: SIZES.margin_sm,
  },
  additionalCloseSection: {
    alignItems: 'center',
    marginTop: SIZES.margin_sm,
    paddingBottom: SIZES.margin,
  },
  additionalCloseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray_light,
    paddingVertical: SIZES.padding_sm,
    paddingHorizontal: SIZES.padding,
    borderRadius: SIZES.borderRadius_sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  additionalCloseText: {
    ...FONTS.h6_regular,
    color: COLORS.textPrimary,
    marginLeft: SIZES.margin_sm,
  },
});
