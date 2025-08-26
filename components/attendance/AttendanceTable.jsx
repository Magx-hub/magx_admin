import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES, FONTS, STYLES } from '../../constants/base';

export default function AttendanceTable({ children }) {
  return (
    <View style={styles.tableContainer}>
      {/* Table Header */}
      <View style={[STYLES.tableHeader, { flexDirection: 'row' }]}>
        <View style={[STYLES.tableCell, { flex: 2 }]}>
          <Text style={STYLES.tableHeaderText}>Teacher</Text>
        </View>
        <View style={[STYLES.tableCell, { flex: 1.5 }]}>
          <Text style={STYLES.tableHeaderText}>Date</Text>
        </View>
        {/* <View style={[STYLES.tableCell, { flex: 1 }]}>
          <Text style={STYLES.tableHeaderText}>Sts</Text>
        </View>
        <View style={[STYLES.tableCell, { flex: 1 }]}>
          <Text style={STYLES.tableHeaderText}>Hrs</Text>
        </View>
        <View style={[STYLES.tableCell, { flex: 1 }]}>
          <Text style={STYLES.tableHeaderText}>Atns</Text>
        </View> */}
      </View>

      {/* Table Body */}
      <View style={styles.tableBody}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tableContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadius_md,
    overflow: 'hidden',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tableBody: {
    maxHeight: 400,
  },
});
