import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/base';
import BackupManager from './BackupManager';

export default function BackupButton() {
  const [backupModalVisible, setBackupModalVisible] = useState(false);

  const openBackupModal = () => {
    setBackupModalVisible(true);
  };

  const closeBackupModal = () => {
    setBackupModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity style={styles.backupButton} onPress={openBackupModal}>
        <Ionicons name="cloud-upload" size={20} color={COLORS.white} />
      </TouchableOpacity>

      <BackupManager 
        visible={backupModalVisible} 
        onClose={closeBackupModal} 
      />
    </>
  );
}

const styles = StyleSheet.create({
  backupButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SIZES.margin_sm,
  },
});
