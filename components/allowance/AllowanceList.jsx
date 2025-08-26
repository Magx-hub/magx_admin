
// ============================================================================
// components/allowance/AllowanceList.jsx
// ============================================================================

import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS, STYLES } from '../../constants/base';
import { formatCurrency } from '../../services/allowanceService';

const AllowanceList = ({ 
  allowances, 
  loading, 
  error, 
  onEdit, 
  onDelete, 
  onRefresh,
  refreshing = false 
}) => {

  // Handle delete with confirmation
  const handleDelete = (item) => {
    Alert.alert(
      'Delete Allowance Record',
      `Are you sure you want to delete the record for week ${item.weekNumber}?`,
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

  // Render allowance item
  const renderAllowance = ({ item }) => (
    <View style={STYLES.card}>
      <View style={STYLES.header}>
        <Text style={STYLES.headerTitle}>Week {item.weekNumber}</Text>
        <Text style={{...FONTS.h4_bold, color: COLORS.success}}>{formatCurrency(item.totalSum)}</Text>
      </View>
      <View style={{marginVertical: SIZES.margin_sm}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4}}>
            <Text style={{...FONTS.h6_regular, color: COLORS.gray_dark}}>Allowance per Teacher:</Text>
            <Text style={{...FONTS.h6_regular, color: COLORS.accent, fontWeight: '500'}}>{formatCurrency(item.eachTeacher)}</Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4}}>
            <Text style={{...FONTS.h6_regular, color: COLORS.gray_dark}}>Allowance per JHS Teacher:</Text>
            <Text style={{...FONTS.h6_regular, color: COLORS.accent, fontWeight: '500'}}>{formatCurrency(item.eachJHSTeacher)}</Text>
        </View>
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'flex-end', gap: SIZES.margin_sm, marginTop: SIZES.margin_sm}}>
        <TouchableOpacity
          style={{width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.success}}
          onPress={() => onEdit(item)}
        >
          <Ionicons name="pencil" size={18} color={COLORS.white} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={{width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.error}}
          onPress={() => handleDelete(item)}
        >
          <Ionicons name="trash" size={18} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </View>
  );

  // Empty state
  const renderEmptyState = () => (
    <View style={STYLES.emptyState}>
      <Ionicons name="calculator-outline" size={64} color={COLORS.gray_light} />
      <Text style={STYLES.emptyTitle}>No Allowance Records</Text>
      <Text style={STYLES.emptySubtitle}>
        Add your first allowance calculation to get started
      </Text>
    </View>
  );

  // Error state
  if (error) {
    return (
      <View style={STYLES.errorState}>
        <Ionicons name="alert-circle-outline" size={64} color={COLORS.error} />
        <Text style={STYLES.errorTitle}>Error Loading Records</Text>
        <Text style={STYLES.errorSubtitle}>{error?.message || String(error)}</Text>
        <TouchableOpacity style={STYLES.buttonPrimary} onPress={onRefresh}>
          <Text style={STYLES.buttonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Loading state
  if (loading && allowances.length === 0) {
    return (
      <View style={STYLES.loadingState}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={STYLES.loadingText}>Loading records...</Text>
      </View>
    );
  }

  return (
    <View style={STYLES.container}>
      <FlatList
        data={allowances}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderAllowance}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={[
          {padding: SIZES.padding},
          allowances.length === 0 && {flex: 1, justifyContent: 'center'}
        ]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default AllowanceList;
