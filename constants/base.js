import { Dimensions, StatusBar, Platform } from "react-native";
const scrW = Dimensions.get("window").width;
const scrH = Dimensions.get("window").height;

// Professional Educational Admin Color Theme
const COLORS = {
    // Primary brand colors - Blue-Green Professional Palette
    primary: '#1E88E5',           // Professional Blue - main brand color
    primaryDark: '#1565C0',       // Dark Blue - darker variant
    primaryLight: '#E3F2FD',      // Light Blue - lighter variant
    secondary: '#2E7D32',         // Forest Green - secondary actions
    accent: '#1565C0',            // Dark Blue - text and accents
    
    // Status colors
    success: '#388E3C',           // Green - positive outcomes
    warning: '#F57C00',           // Orange - warnings and alerts
    error: '#D32F2F',             // Red - errors and critical issues
    info: '#1976D2',              // Blue - information and guidance
    
    // Text colors
    textPrimary: '#263238',       // Dark Blue Gray - primary text
    textSecondary: '#546E7A',     // Medium Blue Gray - secondary text
    
    // Neutral colors
    white: '#FFFFFF',
    black: '#000000', 
    gray: '#9E9E9E',              // Neutral gray
    gray_light: '#F5F5F5',        // Light gray
    gray_dark: '#424242',         // Dark gray
    
    // UI elements
    border: '#E0E0E0',            // Light border
    placeholder: '#9E9E9E',       // Neutral placeholder
    backdrop: 'rgba(21,101,192,0.5)', // Blue backdrop
    
    // Legacy support (gradual migration)
    secondary_light: '#E8F5E8',   // Light Green
    secondary_dark: '#1B5E20',    // Dark Green
}

const SIZES = {
    // Spacing
    padding: 20,
    margin: 15,
    padding_sm: 10,
    margin_sm: 8,
    
    // Border radius
    borderRadius: 6,
    borderRadius_md: 12,
    borderRadius_lg: 25,
    textBoxRadius: 25,
    
    // Font sizes
    h1: 32,
    h2: 28,
    h3: 24,
    h4: 20,
    h5: 18,
    h6: 15,
    default: 14,
    
    // Icon sizes
    icon_sm: 20,
    icon_md: 24,
    icon_lg: 32,
    
    // Button sizes
    buttonHeight: 48,
    inputHeight: 48,
    
    // Screen dimensions
    windowWidth: scrW,
    windowHeight: scrH,
    statusBarHeight: StatusBar.currentHeight || 24,
}

const FONTS = {
    // Arima Madurai font family
    h1_bold: { fontSize: SIZES.h1, fontFamily: "ArimaMadurai_700Bold" },
    h2_bold: { fontSize: SIZES.h2, fontFamily: "ArimaMadurai_700Bold" },
    h2_semibold: { fontSize: SIZES.h2, fontFamily: "ArimaMadurai_500Medium" },
    h3_semibold: { fontSize: SIZES.h3, fontFamily: "ArimaMadurai_500Medium" },
    h4_regular: { fontSize: SIZES.h4, fontFamily: "ArimaMadurai_400Regular" },
    h4_bold: { fontSize: SIZES.h4, fontFamily: "ArimaMadurai_500Medium" },
    h5_regular: { fontSize: SIZES.h5, fontFamily: "ArimaMadurai_500Medium" },
    h6_regular: { fontSize: SIZES.h6, fontFamily: "ArimaMadurai_400Regular" },
    h4_custom: { fontSize: SIZES.h4, fontFamily: "ArimaMadurai_700Bold" },
    custom_header: { fontSize: 20, fontFamily: 'ArimaMadurai_800ExtraBold' },
    bottom_nav_text: { fontSize: 15, fontFamily: 'ArimaMadurai_500Medium' },
    
    // Dancing Script font family (for menus)
    menu_sm: { fontSize: SIZES.h6, fontFamily: "DancingScript_400Regular" },
    menu_md: { fontSize: SIZES.h5, fontFamily: "DancingScript_500Medium" },
    menu_lg: { fontSize: SIZES.h5, fontFamily: "DancingScript_600SemiBold" },
    menu_hg: { fontSize: SIZES.h3, fontFamily: "DancingScript_600SemiBold" },
    menu_custom: { fontSize: SIZES.h5, fontFamily: "DancingScript_700Bold" },
    
    // Button text
    buttonText: { fontSize: SIZES.h5, fontFamily: "ArimaMadurai_600SemiBold" },
    buttonText_sm: { fontSize: SIZES.h6, fontFamily: "ArimaMadurai_500Medium" },
}

const STYLES = {
    // Basic layouts
    container: {
        flex: 1,
        backgroundColor: COLORS.gray_light,
        padding: SIZES.padding,
    },
    
    screenContainer: {
        flex: 1,
        backgroundColor: COLORS.gray_light,
        paddingHorizontal: SIZES.padding,
        paddingTop: Platform.OS === 'android' ? SIZES.statusBarHeight : 0,
    },
    
    center_align: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: SIZES.padding,
        width: '100%'
    },
    
    // Text styles
    paragraph: {
        marginVertical: 8,
        lineHeight: 20,
    },
    
    // Divider
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: COLORS.secondary_dark,
        marginVertical: SIZES.margin_sm,
    },
    
    // Form elements
    inputContainer: {
        marginBottom: SIZES.margin,
    },
    
    header: {
        backgroundColor: COLORS.accent,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },

    inputLabel: {
        ...FONTS.h5_regular,
        marginBottom: 4,
        color: COLORS.accent,
    },
    
    textInput: {
        height: SIZES.inputHeight,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: SIZES.borderRadius,
        paddingHorizontal: SIZES.padding_sm,
        backgroundColor: COLORS.white,
        ...FONTS.h6_regular,
    },
    
    // Buttons
    buttonPrimary: {
        height: SIZES.buttonHeight,
        borderRadius: SIZES.borderRadius,
        backgroundColor: COLORS.accent,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: SIZES.margin_sm,
    },
    
    buttonSecondary: {
        height: SIZES.buttonHeight,
        borderRadius: SIZES.borderRadius,
        backgroundColor: COLORS.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: SIZES.margin_sm,
    },
    
    buttonText: {
        ...FONTS.buttonText,
        color: COLORS.white,
    },
    
    buttonTextSecondary: {
        ...FONTS.buttonText,
        color: COLORS.accent,
    },
    
    // Cards
    card: {
        backgroundColor: COLORS.white,
        borderRadius: SIZES.borderRadius_md,
        padding: SIZES.padding_sm,
        marginBottom: SIZES.margin_sm,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    
    // List items
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SIZES.padding_sm,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    
    // Modal styles
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.backdrop,
    },
    
    modalContent: {
        backgroundColor: COLORS.white,
        borderRadius: SIZES.borderRadius_md,
        padding: SIZES.padding_sm,
        width: scrW * 0.9,
        maxHeight: '80%',
    },
    
    headerTitle: {
        ...FONTS.h3_semibold,
        color: COLORS.white,
    },
    
    // Search styles
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SIZES.margin,
    },
    
    searchInput: {
        flex: 1,
        height: SIZES.inputHeight,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: SIZES.borderRadius,
        paddingHorizontal: SIZES.padding_sm,
        backgroundColor: COLORS.white,
        marginRight: SIZES.margin_sm,
        ...FONTS.h5_regular,
    },
    
    searchButton: {
        width: 60,
        height: SIZES.inputHeight,
        backgroundColor: COLORS.accent,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: SIZES.borderRadius,
    },
    
    searcButtonText: {
        ...FONTS.buttonText_sm,
        color: COLORS.white,
    },
    
    // Summary/Stats card styles
    summaryCard: {
        backgroundColor: COLORS.secondary,
        borderRadius: SIZES.borderRadius_md,
        padding: SIZES.padding_sm,
        marginBottom: SIZES.margin_sm,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        alignItems: 'center',
    },
    
    summaryTitle: {
        ...FONTS.h6_regular,
        color: COLORS.gray,
        marginBottom: 4,
        textAlign: 'center',
    },
    
    summaryValue: {
        ...FONTS.h4_bold,
        color: COLORS.accent,
        textAlign: 'center',
    },
    
    summaryValueSmall: {
        ...FONTS.h5_regular,
        color: COLORS.accent,
        textAlign: 'center',
        fontWeight: '600',
    },
    
    // Section styles
    section: {
        backgroundColor: COLORS.white,
        borderRadius: SIZES.borderRadius_md,
        padding: SIZES.padding,
        marginBottom: SIZES.margin,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    
    sectionTitle: {
        ...FONTS.h4_bold,
        color: COLORS.accent,
        marginBottom: SIZES.margin_sm,
    },
    
    // Empty state styles
    emptyState: {
        alignItems: 'center',
        paddingVertical: 60,
        paddingHorizontal: SIZES.padding,
    },
    
    emptyTitle: {
        ...FONTS.h4_bold,
        color: COLORS.gray,
        marginTop: 16,
        marginBottom: 8,
        textAlign: 'center',
    },
    
    emptySubtitle: {
        ...FONTS.h5_regular,
        color: COLORS.gray_light,
        textAlign: 'center',
        lineHeight: 24,
    },
    
    // Error state styles
    errorState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SIZES.padding * 2,
    },
    
    errorTitle: {
        ...FONTS.h4_bold,
        color: COLORS.error,
        marginTop: 16,
        marginBottom: 8,
        textAlign: 'center',
    },
    
    errorSubtitle: {
        ...FONTS.h5_regular,
        color: COLORS.gray,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 20,
    },
    
    // Loading state styles
    loadingState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    loadingText: {
        ...FONTS.h5_regular,
        color: COLORS.gray,
        marginTop: 16,
    },
    
    // Danger button styles
    buttonDanger: {
        height: SIZES.buttonHeight,
        borderRadius: SIZES.borderRadius,
        backgroundColor: COLORS.error,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: SIZES.margin_sm,
    },
    
    buttonDangerText: {
        ...FONTS.buttonText,
        color: COLORS.white,
    },
    
    // Dashboard specific styles
    welcomeSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
        paddingVertical: 10,
    },
    
    welcomeTitle: {
        ...FONTS.h2_bold,
        color: COLORS.textPrimary,
    },
    
    welcomeSubtitle: {
        ...FONTS.h5_regular,
        color: COLORS.textSecondary,
        marginTop: 4,
    },
    
    welcomeTime: {
        fontSize: 14,
        color: COLORS.primary,
        marginTop: 2,
        fontFamily: 'ArimaMadurai_500Medium',
    },
    
    notificationButton: {
        backgroundColor: COLORS.white,
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    
    // Stats and Cards
    statsContainer: {
        marginBottom: 30,
    },
    
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 2,
    },
    
    statCard: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 18,
        width: '47%',
        minHeight: 120,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: 12,
    },
    
    statValue: {
        ...FONTS.h2_bold,
        marginVertical: 8,
        color: COLORS.textPrimary,
    },
    
    statLabel: {
        ...FONTS.h5_regular,
        color: COLORS.textSecondary,
    },
    
    statSubtext: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: 2,
        fontFamily: 'ArimaMadurai_400Regular',
    },
    
    // Section Cards
    sectionsContainer: {
        marginBottom: 30,
    },
    
    sectionCard: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    
    sectionIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    
    sectionContent: {
        flex: 1,
    },
    
    sectionDescription: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginTop: 4,
        lineHeight: 20,
        fontFamily: 'ArimaMadurai_400Regular',
    },
    
    sectionStats: {
        marginTop: 8,
    },
    
    sectionStatsText: {
        fontSize: 12,
        color: COLORS.textSecondary,
        fontFamily: 'ArimaMadurai_400Regular',
    },
    
    // Form layouts
    formRow: {
        flexDirection: 'row',
        gap: SIZES.margin,
    },
    
    formColumn: {
        flex: 1,
    },
    
    formButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: SIZES.margin,
        marginTop: SIZES.margin,
    },
    
    // Status indicators
    statusPresent: {
        backgroundColor: COLORS.success,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    
    statusAbsent: {
        backgroundColor: COLORS.error,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    
    statusLate: {
        backgroundColor: COLORS.warning,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    
    statusText: {
        ...FONTS.buttonText_sm,
        color: COLORS.white,
        textAlign: 'center',
    },
    
    // Table styles
    tableHeader: {
        backgroundColor: COLORS.primaryLight,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    
    tableHeaderText: {
        ...FONTS.h6_regular,
        color: COLORS.accent,
        fontWeight: '600',
    },
    
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        alignItems: 'center',
    },
    
    tableCell: {
        flex: 1,
        paddingRight: 8,
    },
    
    tableCellText: {
        ...FONTS.h6_regular,
        color: COLORS.textPrimary,
    },
    
    // Action buttons
    actionButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        marginLeft: 4,
    },
    
    actionButtonPrimary: {
        backgroundColor: COLORS.primary,
    },
    
    actionButtonSecondary: {
        backgroundColor: COLORS.gray_light,
    },
    
    actionButtonDanger: {
        backgroundColor: COLORS.error,
    },
    
    actionButtonText: {
        ...FONTS.buttonText_sm,
        color: COLORS.white,
    },
    
    actionButtonTextSecondary: {
        ...FONTS.buttonText_sm,
        color: COLORS.textPrimary,
    },
    
    // Tab styles
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        borderRadius: SIZES.borderRadius,
        marginBottom: SIZES.margin,
        overflow: 'hidden',
    },
    
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        backgroundColor: COLORS.gray_light,
    },
    
    tabActive: {
        backgroundColor: COLORS.primary,
    },
    
    tabText: {
        ...FONTS.h6_regular,
        color: COLORS.textSecondary,
    },
    
    tabTextActive: {
        ...FONTS.h6_regular,
        color: COLORS.white,
    },
    
    // Quick Actions
    quickActionsContainer: {
        marginBottom: 30,
    },
    
    quickActionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
    },
    
    quickActionCard: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 16,
        width: '48%',
        alignItems: 'center',
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: COLORS.gray + '15',
    },
    
    quickActionText: {
        marginTop: 8,
        fontSize: 14,
        textAlign: 'center',
        color: COLORS.textPrimary,
        fontFamily: 'ArimaMadurai_500Medium',
    },
}

// CRUD Utility Functions
const DB_UTILS = {
    // Create operation
    createItem: async (tableName, data) => {
        try {
            // Implementation for SQLite database
            // Example: return await db.transaction(tx => tx.executeSql(...))
            console.log(`Creating item in ${tableName}`, data);
            return { success: true, id: Date.now() }; // Mock response
        } catch (error) {
            console.error(`Error creating item in ${tableName}:`, error);
            return { success: false, error };
        }
    },
    
    // Read operation (single item)
    getItem: async (tableName, id) => {
        try {
            // Implementation for your database
            console.log(`Fetching item ${id} from ${tableName}`);
            return { success: true, data: {} }; // Mock response
        } catch (error) {
            console.error(`Error fetching item from ${tableName}:`, error);
            return { success: false, error };
        }
    },
    
    // Read operation (multiple items)
    getItems: async (tableName, query = {}) => {
        try {
            // Implementation for your database
            console.log(`Fetching items from ${tableName} with query`, query);
            return { success: true, data: [] }; // Mock response
        } catch (error) {
            console.error(`Error fetching items from ${tableName}:`, error);
            return { success: false, error };
        }
    },
    
    // Update operation
    updateItem: async (tableName, id, data) => {
        try {
            // Implementation for your database
            console.log(`Updating item ${id} in ${tableName}`, data);
            return { success: true }; // Mock response
        } catch (error) {
            console.error(`Error updating item in ${tableName}:`, error);
            return { success: false, error };
        }
    },
    
    // Delete operation
    deleteItem: async (tableName, id) => {
        try {
            // Implementation for your database
            console.log(`Deleting item ${id} from ${tableName}`);
            return { success: true }; // Mock response
        } catch (error) {
            console.error(`Error deleting item from ${tableName}:`, error);
            return { success: false, error };
        }
    },
    
    // Batch operations
    batchInsert: async (tableName, items) => {
        try {
            console.log(`Batch inserting ${items.length} items to ${tableName}`);
            return { success: true, count: items.length };
        } catch (error) {
            console.error(`Error batch inserting to ${tableName}:`, error);
            return { success: false, error };
        }
    },
}

// Navigation Utilities
const NAV_UTILS = {
    // Standard header options
    headerOptions: {
        headerStyle: {
            backgroundColor: COLORS.primary,
            shadowColor: 'transparent',
            elevation: 0,
        },
        headerTitleStyle: {
            ...FONTS.custom_header,
            color: COLORS.accent,
        },
        headerTintColor: COLORS.accent,
    },
    
    // Tab bar options
    tabBarOptions: {
        activeTintColor: COLORS.accent,
        inactiveTintColor: COLORS.gray,
        labelStyle: {
            ...FONTS.bottom_nav_text,
            marginBottom: 4,
        },
        style: {
            backgroundColor: COLORS.primary,
            borderTopWidth: 1,
            borderTopColor: COLORS.secondary_light,
            height: 60,
            paddingBottom: 4,
        },
    },
}

// Form Validation Utilities
const VALIDATION = {
    required: (value) => {
        if (!value || value.trim() === '') {
            return 'This field is required';
        }
        return null;
    },
    
    email: (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            return 'Please enter a valid email address';
        }
        return null;
    },
    
    minLength: (min) => (value) => {
        if (value.length < min) {
            return `Must be at least ${min} characters`;
        }
        return null;
    },
    
    match: (fieldName) => (value, allValues) => {
        if (value !== allValues[fieldName]) {
            return 'Values do not match';
        }
        return null;
    },
}

export {
    COLORS,
    SIZES,
    FONTS,
    STYLES,
    DB_UTILS,
    NAV_UTILS,
    VALIDATION
}