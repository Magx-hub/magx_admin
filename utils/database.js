import * as SQLite from 'expo-sqlite';

let db = null;

// Database migration function
async function migrateDbIfNeeded(database) {
  const DATABASE_VERSION = 7;
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fullname TEXT NOT NULL,
      department TEXT NOT NULL,
      gender TEXT,
      createdAt TEXT DEFAULT (datetime('now', 'localtime')),
      updatedAt TEXT DEFAULT (datetime('now', 'localtime'))
    );
  `);

  let { user_version: currentDbVersion } = await database.getFirstAsync(
    'PRAGMA user_version'
  );
  
  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }
  
  if (currentDbVersion === 0) {
    await database.execAsync(`
      PRAGMA journal_mode = WAL;
      
      -- Teachers table for attendance system
      CREATE TABLE IF NOT EXISTS teachers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fullname TEXT NOT NULL,
        department TEXT NOT NULL,
        createdAt TEXT DEFAULT (datetime('now', 'localtime')),
        updatedAt TEXT DEFAULT (datetime('now', 'localtime'))
      );

      -- Students table for management system
      
      -- Attendance records table
      CREATE TABLE IF NOT EXISTS attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        teacherId INTEGER NOT NULL,
        checkInTime TEXT,
        checkOutTime TEXT,
        workHours REAL,
        date TEXT NOT NULL,
        weekNum INTEGER NOT NULL,
        status TEXT NOT NULL,
        remarks TEXT,
        createdAt TEXT DEFAULT (datetime('now', 'localtime')),
        updatedAt TEXT DEFAULT (datetime('now', 'localtime')),
        FOREIGN KEY (teacherId) REFERENCES teachers (id)
      );
      
      -- Allowance calculations table
      CREATE TABLE IF NOT EXISTS calculations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        weekNumber INTEGER NOT NULL,
        creche REAL DEFAULT 0,
        nursery1 REAL DEFAULT 0,
        nursery2 REAL DEFAULT 0,
        kg1 REAL DEFAULT 0,
        kg2 REAL DEFAULT 0,
        basic1 REAL DEFAULT 0,
        basic2 REAL DEFAULT 0,
        basic3 REAL DEFAULT 0,
        basic4 REAL DEFAULT 0,
        basic5 REAL DEFAULT 0,
        basic6 REAL DEFAULT 0,
        basic7General REAL DEFAULT 0,
        basic7JHS REAL DEFAULT 0,
        basic8General REAL DEFAULT 0,
        basic8JHS REAL DEFAULT 0,
        basic9General REAL DEFAULT 0,
        basic9JHS REAL DEFAULT 0,
        numberOfTeachers INTEGER NOT NULL,
        numberOfJHSTeachers INTEGER NOT NULL,
        totalSum REAL NOT NULL,
        welfare REAL NOT NULL,
        balanceAfterWelfare REAL NOT NULL,
        office REAL NOT NULL,
        balanceAfterOffice REAL NOT NULL,
        kitchen REAL NOT NULL,
        balanceAfterKitchen REAL NOT NULL,
        eachTeacher REAL NOT NULL,
        jhsTeachersClasses REAL NOT NULL,
        eachJHSTeacher REAL NOT NULL,
        createdAt TEXT DEFAULT (datetime('now', 'localtime'))
      );
      
      -- Welfare payments table
      CREATE TABLE IF NOT EXISTS welfare_payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        amount REAL NOT NULL,
        weekNumber INTEGER NOT NULL,
        createdAt TEXT DEFAULT (datetime('now', 'localtime'))
      );

      -- Fee Structure table (Canteen fee rates per department)
      CREATE TABLE IF NOT EXISTS feeStructure (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        department TEXT NOT NULL,
        classesFee REAL NOT NULL,
        breakfastFee REAL NOT NULL,
        effectiveDate TEXT NOT NULL,
        createdAt TEXT DEFAULT (datetime('now', 'localtime')),
        UNIQUE(department, effectiveDate)
      );

      -- Daily Payments table (Canteen fee payments per student per day)
      CREATE TABLE IF NOT EXISTS dailyPayments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        studentId INTEGER NOT NULL,
        paymentDate TEXT NOT NULL DEFAULT (date('now', 'localtime')),
        classesFee REAL NOT NULL,
        breakfastFee REAL NOT NULL,
        otherFee REAL DEFAULT 0,
        totalFee REAL GENERATED ALWAYS AS (classesFee + breakfastFee + otherFee) STORED,
        paymentMethod TEXT,
        notes TEXT,
        createdAt TEXT DEFAULT (datetime('now', 'localtime')),
        updatedAt TEXT DEFAULT (datetime('now', 'localtime')),
        FOREIGN KEY (studentId) REFERENCES students(id),
        UNIQUE(studentId, paymentDate)
      );
    `);
    currentDbVersion = 1;
  }
  
  if (currentDbVersion === 1) {
    currentDbVersion = 2;
  }
  
  if (currentDbVersion === 2) {
    currentDbVersion = 3;
  }
  
  if (currentDbVersion === 3) {
    currentDbVersion = 4;
  }

  if (currentDbVersion === 4) {
    await database.execAsync(`
      ALTER TABLE students ADD COLUMN gender TEXT;
    `);
    currentDbVersion = 5;
  }

  if (currentDbVersion === 5) {
    // Remove date and timestamp columns if they exist (cleanup migration)
    try {
      await database.execAsync(`
        CREATE TABLE calculations_clean AS 
        SELECT 
          id, weekNumber, creche, nursery1, nursery2, kg1, kg2,
          basic1, basic2, basic3, basic4, basic5, basic6,
          basic7General, basic7JHS, basic8General, basic8JHS,
          basic9General, basic9JHS, numberOfTeachers, numberOfJHSTeachers,
          totalSum, welfare, balanceAfterWelfare, office, balanceAfterOffice,
          kitchen, balanceAfterKitchen, eachTeacher, jhsTeachersClasses, eachJHSTeacher,
          createdAt
        FROM calculations;
      `);
      
      await database.execAsync('DROP TABLE calculations;');
      await database.execAsync('ALTER TABLE calculations_clean RENAME TO calculations;');
      
      // console.log('Cleaned up calculations table - removed extra fields');
    } catch (e) {
      // console.log('Cleanup migration completed or not needed');
    }
    currentDbVersion = 6;
  }
  
  if (currentDbVersion === 6) {
    // Add new canteen fee management tables
    try {
      await database.execAsync(`
        -- Fee Structure table (Canteen fee rates per department)
        CREATE TABLE IF NOT EXISTS feeStructure (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          department TEXT NOT NULL,
          classesFee REAL NOT NULL,
          breakfastFee REAL NOT NULL,
          effectiveDate TEXT NOT NULL,
          createdAt TEXT DEFAULT (datetime('now', 'localtime')),
          UNIQUE(department, effectiveDate)
        );

        -- Daily Payments table (Canteen fee payments per student per day)
        CREATE TABLE IF NOT EXISTS dailyPayments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          studentId INTEGER NOT NULL,
          paymentDate TEXT NOT NULL DEFAULT (date('now', 'localtime')),
          classesFee REAL NOT NULL,
          breakfastFee REAL NOT NULL,
          otherFee REAL DEFAULT 0,
          totalFee REAL GENERATED ALWAYS AS (classesFee + breakfastFee + otherFee) STORED,
          paymentMethod TEXT,
          notes TEXT,
          createdAt TEXT DEFAULT (datetime('now', 'localtime')),
          updatedAt TEXT DEFAULT (datetime('now', 'localtime')),
          FOREIGN KEY (studentId) REFERENCES students(id),
          UNIQUE(studentId, paymentDate)
        );
      `);

      // console.log('Added canteen fee management tables');
    } catch (e) {
      // console.log('Canteen fee tables migration completed or not needed');
    }
    currentDbVersion = 7;
  }
  
  await database.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}

// Initialize database connection - now works with SQLiteProvider
export const initDatabase = async (database) => {
  try {
    // console.log('Initializing database with:', database ? 'SQLiteProvider instance' : 'fallback instance');
    
    if (database) {
      // Use the database instance provided by SQLiteProvider
      db = database;
    } else {
      // Fallback: create our own database instance
      db = await SQLite.openDatabaseAsync('magmax_admin.db');
    }
    
    // console.log('Database instance:', db);
    await migrateDbIfNeeded(db);
    // console.log('Database initialized successfully');
    return db;
  } catch (error) {
    // console.error('Error initializing database:', error);
    throw error;
  }
};

// Helper function to ensure database is initialized
const ensureDbInitialized = () => {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
};

// Close database connection
export const closeDatabase = async () => {
  try {
    if (db) {
      await db.closeAsync();
      db = null;
      // console.log('Database connection closed');
    }
  } catch (error) {
    // console.error('Error closing database:', error);
    throw error;
  }
};

// Export database instance for service layer usage
export const getDatabaseInstance = () => {
  // console.log('getDatabaseInstance called, db:', db ? 'Available' : 'Not initialized');
  
  if (!db) {
    // console.warn('Database not initialized - attempting to create fallback instance');
    // Try to create a fallback instance - this shouldn't happen in normal flow
    throw new Error('Database not initialized. Please ensure the app has started properly.');
  }
  
  return db;
};

// Check if database is ready
export const isDatabaseReady = () => {
  return db !== null;
};

// Wait for database to be ready with timeout
export const waitForDatabase = async (timeout = 5000) => {
  const startTime = Date.now();
  
  while (!db && (Date.now() - startTime) < timeout) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  if (!db) {
    throw new Error('Database initialization timeout');
  }
  
  return db;
};
