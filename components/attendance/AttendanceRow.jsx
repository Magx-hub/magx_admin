import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS, STYLES } from '../../constants/base';

export default function AttendanceRow({ 
  item, 
  onEdit, 
  onDelete, 
  onSelect, 
  isSelected 
}) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Present': return COLORS.success;
      case 'Absent': return COLORS.error;
      case 'Late': return COLORS.warning;
      case 'Half Day': return COLORS.info;
      default: return COLORS.gray;
    }
  };

  const formatTime = (time) => {
    if (!time) return 'N/A';
    return time.substring(0, 5); // Format HH:MM
  };

  const calculateWorkHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 'N/A';
    
    const start = new Date(`2000-01-01T${checkIn}`);
    const end = new Date(`2000-01-01T${checkOut}`);
    const diffMs = end - start;
    const diffHours = diffMs / (1000 * 60 * 60);
    
    return diffHours.toFixed(1);
  };

  return (
    <TouchableOpacity
      style={[
        STYLES.tableRow,
        isSelected && styles.selectedRow
      ]}
      onPress={() => onSelect(item)}
      activeOpacity={0.7}
    >
      <View style={[STYLES.tableCell, { flex: 2 }]}>
        <Text style={styles.teacherName}>{item.fullname}</Text>
        <Text style={styles.department}>{item.department}</Text>
      </View>
      
      <View style={[STYLES.tableCell, { flex: 1.5 }]}>
        <Text style={styles.dateText}>
          {new Date(item.date).toLocaleDateString('en-GB')}
        </Text>
        <Text style={styles.timeText}>
          {formatTime(item.checkInTime)} - {formatTime(item.checkOutTime)}
        </Text>
      </View>
      
      <View style={[STYLES.tableCell, { flex: 1 }]}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      
      {/* <View style={[STYLES.tableCell, { flex: 1 }]}>
        <Text style={styles.hoursText}>
          {calculateWorkHours(item.checkInTime, item.checkOutTime)}
        </Text>
      </View>
      
      <View style={[STYLES.tableCell, { flex: 1 }]}>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onEdit(item)}
            activeOpacity={0.7}
          >
            <Ionicons name="create" size={16} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onDelete(item)}
            activeOpacity={0.7}
          >
            <Ionicons name="trash" size={16} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      </View> */}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  selectedRow: {
    backgroundColor: COLORS.primaryLight,
  },
  teacherName: {
    ...FONTS.h6_bold,
    color: COLORS.textPrimary,
  },
  department: {
    ...FONTS.h6_regular,
    color: COLORS.gray,
    fontSize: 12,
    marginTop: 2,
  },
  dateText: {
    ...FONTS.h6_regular,
    color: COLORS.textPrimary,
  },
  timeText: {
    ...FONTS.h6_regular,
    color: COLORS.gray,
    fontSize: 12,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: SIZES.padding_sm,
    paddingVertical: 4,
    borderRadius: SIZES.borderRadius,
    alignSelf: 'flex-start',
  },
  statusText: {
    ...FONTS.h6_regular,
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  hoursText: {
    ...FONTS.h6_regular,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SIZES.margin_sm,
  },
  actionButton: {
    padding: SIZES.padding_sm,
    borderRadius: SIZES.borderRadius,
    backgroundColor: COLORS.gray_light,
  },
});
