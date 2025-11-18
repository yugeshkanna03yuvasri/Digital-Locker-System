# Network Error Troubleshooting Guide

## Common Causes and Solutions

### 1. Backend Server Not Running
**Problem**: Frontend can't connect to `http://localhost:8080/api`

**Solution**:
```bash
cd springapp
mvn spring-boot:run
```

### 2. MySQL Database Issues
**Problem**: Database connection failed

**Solutions**:
- Start MySQL service: `net start mysql80`
- Create database: `mysql -u root -p -e "CREATE DATABASE digitallocker;"`
- Check credentials in `application.properties`

### 3. Port Conflicts
**Problem**: Port 8080 or 3000 already in use

**Solutions**:
- Kill processes: `netstat -ano | findstr :8080`
- Change ports in configuration files

### 4. Firewall/Antivirus Blocking
**Problem**: Windows Firewall blocking connections

**Solutions**:
- Add exceptions for Java and Node.js
- Temporarily disable firewall for testing

### 5. CORS Issues
**Problem**: Cross-origin requests blocked

**Solution**: Backend should have CORS configuration (already implemented)

## Quick Fix Steps

1. **Run the fix script**: Double-click `fix_network_error.bat`

2. **Manual verification**:
   - Check MySQL: `mysql -u root -pyuvasri_05 -e "SHOW DATABASES;"`
   - Test backend: Open `http://localhost:8080/api/users` in browser
   - Check frontend: Open `http://localhost:3000`

3. **Check browser console** for detailed error messages

## Error Messages and Solutions

| Error Message | Solution |
|---------------|----------|
| "Network Error" | Backend not running - start Spring Boot |
| "Connection refused" | MySQL not running - start MySQL service |
| "Access denied" | Wrong database credentials |
| "CORS error" | Backend CORS configuration issue |
| "404 Not Found" | Wrong API endpoint URL |

## Testing Account Creation

After fixing the network issues, test with:
- **Email**: test@example.com
- **Password**: Test123!@#
- **Role**: USER (no admin code needed)

## Contact Support

If issues persist:
1. Check the browser's Network tab in Developer Tools
2. Check Spring Boot console logs
3. Verify all services are running with `netstat -an`