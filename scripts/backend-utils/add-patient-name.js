require('dotenv').config();
const { pool } = require('./config/database');

async function addPatientNameColumn() {
  try {
    console.log('Checking if patient_name column exists...');
    
    // patient_name 컬럼이 이미 있는지 확인
    const [columns] = await pool.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? 
      AND TABLE_NAME = 'diagnoses' 
      AND COLUMN_NAME = 'patient_name'
    `, [process.env.DB_NAME]);
    
    if (columns.length > 0) {
      console.log('✓ patient_name column already exists!');
      process.exit(0);
      return;
    }
    
    console.log('Adding patient_name column to diagnoses table...');
    
    // patient_name 컬럼 추가
    await pool.query(`
      ALTER TABLE diagnoses 
      ADD COLUMN patient_name VARCHAR(255) AFTER patient_id
    `);
    
    console.log('✓ patient_name column added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error adding patient_name column:', error);
    process.exit(1);
  }
}

addPatientNameColumn();
