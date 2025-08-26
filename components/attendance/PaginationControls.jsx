import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../../constants/base';

export default function PaginationControls({ 
  currentPage, 
  totalPages, 
  onPageChange 
}) {
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const handlePrevious = () => {
    if (canGoPrevious) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <View style={styles.container}>
      <View style={styles.paginationInfo}>
        <Text style={styles.infoText}>
          Page {currentPage} of {totalPages}
        </Text>
      </View>
      
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.navButton, !canGoPrevious && styles.disabledButton]}
          onPress={handlePrevious}
          disabled={!canGoPrevious}
          activeOpacity={0.7}
        >
          <Ionicons 
            name="chevron-back" 
            size={20} 
            color={canGoPrevious ? COLORS.primary : COLORS.gray} 
          />
        </TouchableOpacity>

        <View style={styles.pageNumbers}>
          {getPageNumbers().map((page, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.pageButton,
                page === currentPage && styles.activePageButton,
                page === '...' && styles.ellipsisButton
              ]}
              onPress={() => typeof page === 'number' && handlePageClick(page)}
              disabled={page === '...'}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.pageButtonText,
                  page === currentPage && styles.activePageButtonText,
                  page === '...' && styles.ellipsisText
                ]}
              >
                {page}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.navButton, !canGoNext && styles.disabledButton]}
          onPress={handleNext}
          disabled={!canGoNext}
          activeOpacity={0.7}
        >
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color={canGoNext ? COLORS.primary : COLORS.gray} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadius_md,
    padding: SIZES.padding,
    marginBottom: SIZES.margin,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  paginationInfo: {
    alignItems: 'center',
    marginBottom: SIZES.margin,
  },
  infoText: {
    ...FONTS.h6_regular,
    color: COLORS.gray,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SIZES.margin_sm,
  },
  navButton: {
    padding: SIZES.padding_sm,
    borderRadius: SIZES.borderRadius,
    backgroundColor: COLORS.gray_light,
  },
  disabledButton: {
    opacity: 0.5,
  },
  pageNumbers: {
    flexDirection: 'row',
    gap: 4,
  },
  pageButton: {
    minWidth: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZES.borderRadius,
    backgroundColor: COLORS.gray_light,
  },
  activePageButton: {
    backgroundColor: COLORS.primary,
  },
  ellipsisButton: {
    backgroundColor: 'transparent',
  },
  pageButtonText: {
    ...FONTS.h6_regular,
    color: COLORS.gray,
  },
  activePageButtonText: {
    color: COLORS.white,
  },
  ellipsisText: {
    color: COLORS.gray,
  },
});
