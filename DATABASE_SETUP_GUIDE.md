# Database Setup Guide for Digital Lock Product

## Prerequisites
1. MySQL Server 8.0+ installed and running
2. MySQL Workbench or command line access

## Step 1: Create MySQL Database
1. Open MySQL Workbench or command line
2. Run the script: `mysql_setup.sql`
   ```bash
   mysql -u root -p < mysql_setup.sql
   ```

## Step 2: Update Application Configuration
1. Open `springapp/src/main/resources/application.properties`
2. Update the MySQL password:
   ```properties
   spring.datasource.password=your_actual_mysql_password
   ```

## Step 3: Test Database Connection
1. Start the Spring Boot application
2. Check logs for successful database connection
3. Look for: "HikariPool-1 - Start completed"

## Step 4: Verify Tables Created
Run this query in MySQL to verify all tables exist:
```sql
USE digital_lock_db;
SHOW TABLES;
DESCRIBE users;
```

## Step 5: Test User Registration
1. Start both frontend (React) and backend (Spring Boot)
2. Navigate to signup page
3. Create a test user with all fields
4. Check MySQL database to verify user was created:
   ```sql
   SELECT * FROM users;
   ```

## Default Admin Account
- Email: admin@securevault.com
- Password: admin123
- Role: ROLE_ADMIN

## Troubleshooting
- If connection fails, check MySQL service is running
- Verify MySQL port (default: 3306)
- Check firewall settings
- Ensure MySQL user has proper permissions

## Database Schema
The setup creates these tables:
- `users` - User accounts with profile information
- `documents` - File storage metadata
- `folders` - Folder organization
- `refresh_tokens` - JWT refresh tokens
- `activity_logs` - User activity tracking
- `access_logs` - File access logging