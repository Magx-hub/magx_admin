import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS, STYLES } from '../constants/base';
import { useBackup } from '../hooks/useBackup';

export default function BackupManager({ visible, onClose }) {
  const {
    loading,
    backupFiles,
    loadingBackups,
    exportAndShare,
    createLocalBackup,
    exportOnly,
    loadBackupFiles,
    formatFileSize,
    formatDate,
  } = useBackup();

  const handleExportAndShare = async () => {
    const result = await exportAndShare();
    Alert.alert(result.success ? 'Success' : 'Error', result.message);
  };

  const handleCreateBackup = async () => {
    const result = await createLocalBackup();
    Alert.alert(result.success ? 'Success' : 'Error', result.message);
  };

  const handleExportOnly = async () => {
    const result = await exportOnly();
    Alert.alert(result.success ? 'Success' : 'Error', result.message);
  };

  React.useEffect(() => {
    if (visible) {
      loadBackupFiles();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Data Backup & Export</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Export Options */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Export Options</Text>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.primaryButton]} 
              onPress={handleExportAndShare}
              disabled={loading}
            >
              <View style={styles.buttonContent}>
                <Ionicons name="share-social" size={24} color={COLORS.white} />
                <View style={styles.buttonText}>
                  <Text style={styles.buttonTitle}>Export & Share to WhatsApp</Text>
                  <Text style={styles.buttonSubtitle}>Export data and share via WhatsApp</Text>
                </View>
              </View>
              {loading && <ActivityIndicator color={COLORS.white} size="small" />}
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, styles.secondaryButton]} 
              onPress={handleCreateBackup}
              disabled={loading}
            >
              <View style={styles.buttonContent}>
                <Ionicons name="save" size={24} color={COLORS.primary} />
                <View style={styles.buttonText}>
                  <Text style={[styles.buttonTitle, { color: COLORS.primary }]}>Create Local Backup</Text>
                  <Text style={[styles.buttonSubtitle, { color: COLORS.textSecondary }]}>Save backup to device</Text>
                </View>
              </View>
              {loading && <ActivityIndicator color={COLORS.primary} size="small" />}
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, styles.tertiaryButton]} 
              onPress={handleExportOnly}
              disabled={loading}
            >
              <View style={styles.buttonContent}>
                <Ionicons name="document-text" size={24} color={COLORS.info} />
                <View style={styles.buttonText}>
                  <Text style={[styles.buttonTitle, { color: COLORS.info }]}>Export Only</Text>
                  <Text style={[styles.buttonSubtitle, { color: COLORS.textSecondary }]}>Generate file without sharing</Text>
                </View>
              </View>
              {loading && <ActivityIndicator color={COLORS.info} size="small" />}
            </TouchableOpacity>
          </View>

          {/* Backup Files */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Local Backups</Text>
              <TouchableOpacity onPress={loadBackupFiles} disabled={loadingBackups}>
                <Ionicons name="refresh" size={20} color={COLORS.primary} />
              </TouchableOpacity>
            </View>

            {loadingBackups ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Loading backups...</Text>
              </View>
            ) : backupFiles.length > 0 ? (
              <View style={styles.backupList}>
                {backupFiles.map((file, index) => (
                  <View key={index} style={styles.backupItem}>
                    <View style={styles.backupInfo}>
                      <View style={styles.backupIcon}>
                        <Ionicons name="document-text" size={20} color={COLORS.primary} />
                      </View>
                      <View style={styles.backupDetails}>
                        <Text style={styles.backupName}>{file.name}</Text>
                        <Text style={styles.backupMeta}>
                          {formatFileSize(file.size)} • {formatDate(file.modificationTime)}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="folder-open" size={48} color={COLORS.gray} />
                <Text style={styles.emptyText}>No backup files found</Text>
                <Text style={styles.emptySubtext}>Create your first backup to see it here</Text>
              </View>
            )}
          </View>

          {/* Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Information</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoItem}>
                <Ionicons name="information-circle" size={16} color={COLORS.info} />
                <Text style={styles.infoText}>
                  Backups include all data: Teachers, Students, Attendance, Allowance, and Canteen records
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="shield-checkmark" size={16} color={COLORS.success} />
                <Text style={styles.infoText}>
                  Data is exported in HTML format for easy viewing and sharing
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="cloud-upload" size={16} color={COLORS.warning} />
                <Text style={styles.infoText}>
                  Local backups are stored on your device for offline access
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.margin,
    paddingVertical: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray_light,
  },
  headerTitle: {
    ...FONTS.h5_bold,
    color: COLORS.textPrimary,
  },
  closeButton: {
    padding: SIZES.padding_sm,
  },
  content: {
    flex: 1,
  },
  section: {
    marginHorizontal: SIZES.margin,
    marginVertical: SIZES.margin,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.margin,
  },
  sectionTitle: {
    ...FONTS.h5_bold,
    color: COLORS.textPrimary,
    marginBottom: SIZES.margin,
  },
  actionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    borderRadius: SIZES.borderRadius,
    marginBottom: SIZES.margin_sm,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  secondaryButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  tertiaryButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.info,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  buttonText: {
    marginLeft: SIZES.margin_sm,
    flex: 1,
  },
  buttonTitle: {
    ...FONTS.h6_bold,
    color: COLORS.white,
    marginBottom: 2,
  },
  buttonSubtitle: {
    ...FONTS.h6_regular,
    color: COLORS.white,
    fontSize: 12,
    opacity: 0.8,
  },
  backupList: {
    gap: SIZES.margin_sm,
  },
  backupItem: {
    backgroundColor: COLORS.gray_light,
    borderRadius: SIZES.borderRadius,
    padding: SIZES.padding,
  },
  backupInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backupIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.margin_sm,
  },
  backupDetails: {
    flex: 1,
  },
  backupName: {
    ...FONTS.h6_bold,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  backupMeta: {
    ...FONTS.h6_regular,
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: SIZES.margin * 2,
  },
  loadingText: {
    ...FONTS.h6_regular,
    color: COLORS.textSecondary,
    marginTop: SIZES.margin_sm,
  },
  emptyState: {
    alignItems: 'center',
    padding: SIZES.margin * 2,
  },
  emptyText: {
    ...FONTS.h6_bold,
    color: COLORS.gray,
    marginTop: SIZES.margin_sm,
  },
  emptySubtext: {
    ...FONTS.h6_regular,
    color: COLORS.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    marginTop: SIZES.margin_sm / 2,
  },
  infoCard: {
    backgroundColor: COLORS.gray_light,
    borderRadius: SIZES.borderRadius,
    padding: SIZES.padding,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SIZES.margin_sm,
  },
  infoText: {
    ...FONTS.h6_regular,
    color: COLORS.textSecondary,
    fontSize: 12,
    marginLeft: SIZES.margin_sm,
    flex: 1,
  },
});
