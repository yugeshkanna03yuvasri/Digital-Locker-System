@echo off
echo Fixing Network Error for Digital Lock Application...
echo.

echo Step 1: Starting MySQL Service...
net start mysql80
if %errorlevel% neq 0 (
    echo MySQL service failed to start. Please check if MySQL is installed.
    echo You can install MySQL from: https://dev.mysql.com/downloads/installer/
    pause
    exit /b 1
)

echo Step 2: Creating database if it doesn't exist...
mysql -u root -pyuvasri_05 -e "CREATE DATABASE IF NOT EXISTS digitallocker;"
if %errorlevel% neq 0 (
    echo Failed to create database. Please check MySQL credentials.
    pause
    exit /b 1
)

echo Step 3: Starting Spring Boot Backend...
cd springapp
start "Backend Server" cmd /k "mvn spring-boot:run"

echo Step 4: Waiting for backend to start...
timeout /t 10

echo Step 5: Starting React Frontend...
cd ..\reactapp
start "Frontend Server" cmd /k "npm start"

echo.
echo ✅ Both servers should be starting now!
echo ✅ Backend: http://localhost:8080
echo ✅ Frontend: http://localhost:3000
echo.
echo If you still get network errors:
echo 1. Check if MySQL is running: services.msc
echo 2. Verify database credentials in application.properties
echo 3. Check Windows Firewall settings
echo 4. Try restarting both servers
echo.
pause