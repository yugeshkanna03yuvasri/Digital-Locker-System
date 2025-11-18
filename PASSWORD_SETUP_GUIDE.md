# Password Protection Setup Guide

## 🔒 Complete Password Protection System

This guide will help you set up the password protection feature for both files and folders.

## 📋 Prerequisites

1. **MySQL Database** running on localhost:3306
2. **Java 17** installed
3. **Node.js** installed
4. **Maven** installed

## 🗄️ Database Setup

1. **Run the SQL script** to add password protection columns:
   ```sql
   -- Execute this in your MySQL database
   ALTER TABLE documents ADD COLUMN is_password_protected BOOLEAN DEFAULT FALSE;
   ALTER TABLE documents ADD COLUMN password_hash VARCHAR(255);
   ALTER TABLE folders ADD COLUMN is_password_protected BOOLEAN DEFAULT FALSE;
   ALTER TABLE folders ADD COLUMN password_hash VARCHAR(255);
   
   -- Update existing records
   UPDATE documents SET is_password_protected = FALSE WHERE is_password_protected IS NULL;
   UPDATE folders SET is_password_protected = FALSE WHERE is_password_protected IS NULL;
   ```

2. **Or use the provided script:**
   ```bash
   mysql -u your_username -p your_database < database_update.sql
   ```

## 🚀 Starting the Application

### Method 1: Using Batch Scripts
```bash
# Start backend (in one terminal)
start_backend.bat

# Start frontend (in another terminal)  
start_frontend.bat
```

### Method 2: Manual Start
```bash
# Backend
cd springapp
mvn spring-boot:run

# Frontend (in new terminal)
cd reactapp
npm start
```

## 🔧 How Password Protection Works

### For Files:
1. **Set Password**: Click file → View Details → Lock icon → Set password
2. **Access Protected File**: Click protected file → Enter password → File opens
3. **Remove Password**: File Details → Lock icon → Remove Password

### For Folders:
1. **Set Password**: Right-click folder → Three dots → Set Password
2. **Access Protected Folder**: Click protected folder → Enter password → Folder opens
3. **Remove Password**: Folder context menu → Update Password → Remove

## 🔍 Visual Indicators

- **Lock Icons**: 🔒 appear on protected files and folders
- **Red Lock Badge**: Shows on folder icons when protected
- **Activity Logs**: All password operations are logged

## 🛠️ Backend API Endpoints

### Document Password Protection:
- `PUT /api/documents/{id}/password` - Set password
- `DELETE /api/documents/{id}/password` - Remove password
- `POST /api/documents/{id}/verify-password` - Verify password

### Folder Password Protection:
- `PUT /api/folders/{id}/password` - Set password
- `DELETE /api/folders/{id}/password` - Remove password
- `POST /api/folders/{id}/verify-password` - Verify password

## 🔐 Security Features

- **BCrypt Hashing**: All passwords are hashed using BCrypt
- **Database Storage**: Passwords stored securely in MySQL
- **Session-less**: Password required every time for access
- **Activity Logging**: All security operations logged
- **Offline Fallback**: Works offline with localStorage

## 🐛 Troubleshooting

### Password Not Setting:
1. Check browser console for errors
2. Verify backend is running on port 8081
3. Check database connection
4. Ensure database columns exist

### Backend Connection Issues:
1. Verify MySQL is running
2. Check application.properties database config
3. Ensure JWT token is valid
4. Check CORS configuration

### Frontend Issues:
1. Clear browser cache
2. Check React console for errors
3. Verify API endpoints are accessible
4. Test with browser network tab

## 📊 Database Schema

```sql
-- Documents table additions
is_password_protected BOOLEAN DEFAULT FALSE
password_hash VARCHAR(255)

-- Folders table additions  
is_password_protected BOOLEAN DEFAULT FALSE
password_hash VARCHAR(255)
```

## ✅ Testing the Feature

1. **Upload a file**
2. **Click file → View Details**
3. **Click lock icon → Set password**
4. **Verify lock icon appears**
5. **Click file again → Should ask for password**
6. **Enter correct password → File should open**

## 🎯 Key Features

- ✅ File password protection
- ✅ Folder password protection  
- ✅ BCrypt password hashing
- ✅ Database persistence
- ✅ Visual lock indicators
- ✅ Activity logging
- ✅ Offline mode support
- ✅ Professional UI/UX

## 📞 Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify backend logs for API errors
3. Ensure database schema is updated
4. Test backend connectivity

The password protection system is now fully integrated and ready to use! 🔒✨