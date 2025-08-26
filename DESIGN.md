## Design Features:

    Material Design inspired with clean shadows and rounded corners
    Consistent color scheme using Bootstrap-like colors
    Touch-friendly buttons and interactive elements
    Responsive layout that works on different screen sizes
    Accessibility with proper contrast and touch targets


## TeacherForm.jsx
1. Purpose: Handles creating and editing teachers
    # Features:

        Form validation with real-time error feedback
        Department dropdown with predefined options
        Support for both create and edit modes
        Keyboard-aware scrolling
        Clean, accessible UI with proper spacing

    ## Key Capabilities:

    ✅ Validates required fields
    ✅ Department selection with visual feedback
    ✅ Loading states during submission
    ✅ Responsive design for different screen sizes

## 📋 TeacherList.jsx

    Purpose: Displays and manages the list of teachers
    Features:

        Search functionality across names and departments
        Department filtering with chips
        Pull-to-refresh support
        Empty states and error handling
        Inline edit/delete actions

Key Capabilities:

✅ Real-time search and filtering
✅ Confirmation dialogs for destructive actions
✅ Statistics display (filtered count)
✅ Proper loading and error states

📱 teachers.jsx (Main Screen)
Purpose: Orchestrates the teacher management interface
Features:

Modal-based form presentation
Integrated CRUD operations
Success/error notifications
Proper state management

Key Capabilities:

✅ Modal form handling for add/edit
✅ Hooks integration with error handling
✅ User feedback with alerts
✅ Clean navigation structure