import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS, STYLES } from '../../constants/base';

export default function StudentSummary({ studentSummary, departmentStats }) {
  const getGenderPercentage = (count, total) => {
    return total > 0 ? ((count / total) * 100).toFixed(1) : '0.0';
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Overall Statistics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Overall Statistics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: COLORS.primary + '20' }]}>
              <Ionicons name="people" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statValue}>{studentSummary.totalStudents || 0}</Text>
              <Text style={styles.statLabel}>Total Students</Text>
            </View>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: COLORS.success + '20' }]}>
              <Ionicons name="business" size={24} color={COLORS.success} />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statValue}>{studentSummary.totalDepartments || 0}</Text>
              <Text style={styles.statLabel}>Departments</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Gender Breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Gender Distribution</Text>
        <View style={styles.genderContainer}>
          <View style={styles.genderCard}>
            <View style={[styles.genderIcon, { backgroundColor: COLORS.info + '20' }]}>
              <Ionicons name="male" size={20} color={COLORS.info} />
            </View>
            <View style={styles.genderContent}>
              <Text style={styles.genderValue}>{studentSummary.maleCount || 0}</Text>
              <Text style={styles.genderLabel}>Male</Text>
              <Text style={styles.genderPercentage}>
                {getGenderPercentage(studentSummary.maleCount, studentSummary.totalStudents)}%
              </Text>
            </View>
          </View>

          <View style={styles.genderCard}>
            <View style={[styles.genderIcon, { backgroundColor: COLORS.warning + '20' }]}>
              <Ionicons name="female" size={20} color={COLORS.warning} />
            </View>
            <View style={styles.genderContent}>
              <Text style={styles.genderValue}>{studentSummary.femaleCount || 0}</Text>
              <Text style={styles.genderLabel}>Female</Text>
              <Text style={styles.genderPercentage}>
                {getGenderPercentage(studentSummary.femaleCount, studentSummary.totalStudents)}%
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Department Breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Department Breakdown</Text>
        <View style={styles.departmentList}>
          {departmentStats && departmentStats.length > 0 ? (
            departmentStats.map((dept, index) => (
              <View key={index} style={styles.departmentCard}>
                <View style={styles.departmentHeader}>
                  <View style={[styles.departmentIcon, { backgroundColor: COLORS.primary + '20' }]}>
                    <Ionicons name="school" size={16} color={COLORS.primary} />
                  </View>
                  <Text style={styles.departmentName}>{dept.department}</Text>
                  <Text style={styles.departmentCount}>{dept.studentCount}</Text>
                </View>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { 
                        width: `${studentSummary.totalStudents > 0 ? (dept.studentCount / studentSummary.totalStudents) * 100 : 0}%`,
                        backgroundColor: COLORS.primary
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.departmentPercentage}>
                  {studentSummary.totalStudents > 0 ? ((dept.studentCount / studentSummary.totalStudents) * 100).toFixed(1) : '0.0'}%
                </Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="school-outline" size={48} color={COLORS.gray} />
              <Text style={styles.emptyText}>No departments found</Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  section: {
    marginHorizontal: SIZES.margin,
    marginBottom: SIZES.margin * 1.5,
  },
  sectionTitle: {
    ...FONTS.h5_bold,
    color: COLORS.textPrimary,
    marginBottom: SIZES.margin,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: SIZES.margin_sm,
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray_light,
    borderRadius: SIZES.borderRadius,
    padding: SIZES.padding,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.margin_sm,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    ...FONTS.h4_bold,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  statLabel: {
    ...FONTS.h6_regular,
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  genderContainer: {
    flexDirection: 'row',
    gap: SIZES.margin_sm,
  },
  genderCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray_light,
    borderRadius: SIZES.borderRadius,
    padding: SIZES.padding,
  },
  genderIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.margin_sm,
  },
  genderContent: {
    flex: 1,
  },
  genderValue: {
    ...FONTS.h5_bold,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  genderLabel: {
    ...FONTS.h6_regular,
    color: COLORS.textSecondary,
    fontSize: 12,
    marginBottom: 1,
  },
  genderPercentage: {
    ...FONTS.h6_regular,
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '600',
  },
  departmentList: {
    gap: SIZES.margin_sm,
  },
  departmentCard: {
    backgroundColor: COLORS.gray_light,
    borderRadius: SIZES.borderRadius,
    padding: SIZES.padding,
  },
  departmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.margin_sm,
  },
  departmentIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.margin_sm,
  },
  departmentName: {
    ...FONTS.h6_bold,
    color: COLORS.textPrimary,
    flex: 1,
  },
  departmentCount: {
    ...FONTS.h6_bold,
    color: COLORS.primary,
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.gray,
    borderRadius: 3,
    marginBottom: SIZES.margin_sm / 2,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  departmentPercentage: {
    ...FONTS.h6_regular,
    color: COLORS.textSecondary,
    fontSize: 12,
    textAlign: 'right',
  },
  emptyState: {
    alignItems: 'center',
    padding: SIZES.margin * 2,
  },
  emptyText: {
    ...FONTS.h6_regular,
    color: COLORS.gray,
    marginTop: SIZES.margin_sm,
  },
});
