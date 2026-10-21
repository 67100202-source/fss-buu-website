@echo off
:: ============================================================================
:: ไฟล์สคริปต์อัปโหลดโปรเจกต์ BUU | FSS ขึ้น GitHub (สำหรับ Windows)
:: ============================================================================
:: วิธีใช้:
::   1. คลิกขวาที่ไฟล์นี้ -> เลือก "แก้ไข" (Edit)
::   2. เปลี่ยนค่า "ชื่อผู้ใช้-github-of-cุณ" ในบรรทัดที่เขียนว่า set GITHUB_USER=
::      ให้เป็นชื่อบัญชี GitHub ของคุณจริง
::   3. บันทึกไฟล์ แล้วดับเบิลคลิกเพื่อรัน
:: ============================================================================

:: ------------------- ตั้งค่าส่วนนี้เท่านั้น -------------------
set GITHUB_USER=67100202-source
:: ------------------------------------------------------------

echo ========================================
echo  อัปโหลดโปรเจกต์ BUU | FSS ขึ้น GitHub
echo ========================================
echo.

:: ตรวจสอบว่ามี git หรือไม่
where git >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] ไม่พบ Git ในเครื่อง กรุณาติดตั้ง Git ก่อนจาก https://git-scm.com/
    pause
    exit /b 1
)

:: เข้าไปที่โฟลเดอร์โปรเจกต์ (path มีภาษาไทยและเว้นวรรค จึงต้องใส่เครื่องหมายคำพูด)
cd /d "D:\ปี3\website\website fss buu 2"

if %errorlevel% neq 0 (
    echo [ERROR] ไม่พบโฟลเดอร์โปรเจกต์ กรุณาตรวจสอบเส้นทางในไฟล์นี้
    pause
    exit /b 1
)

echo [1/6] เริ่มต้น Git repository...
git init

echo [2/6] เพิ่มไฟล์ทั้งหมดในโปรเจกต์...
git add .

echo [3/6] Commit โค้ดครั้งแรก...
git commit -m "Initial commit: BUU | FSS website prototype"

echo [4/6] ตั้งชื่อสาขาเป็น main...
git branch -M main

echo [5/6] เชื่อมต่อกับ GitHub repository...
git remote remove origin 2>nul
git remote add origin https://github.com/%GITHUB_USER%/fss-buu-website.git

echo [6/6] ส่งโค้ดขึ้น GitHub...
git push -u origin main

echo.
echo ========================================
echo  อัปโหลดเสร็จสิ้น!
echo ========================================
echo.
echo หากโหลดหน้าเว็บ GitHub ของคุณ: https://github.com/%GITHUB_USER%/fss-buu-website
echo.
pause