# BUU | FSS — คณะวิทยาศาสตร์การกีฬา มหาวิทยาลัยบูรพา

เว็บไซต์ต้นแบบสำหรับคณะวิทยาศาสตร์การกีฬา มหาวิทยาลัยบูรพา (BUU | FSS) พัฒนาด้วย HTML, CSS, JavaScript และเชื่อมต่อกับ Supabase เป็นฐานข้อมูล

## โครงสร้างโปรเจกต์

```
website fss buu 2/
├── index.html              # หน้าแรก (Landing Page)
├── css/
│   └── style.css           # Design System และสไตล์ทั้งหมด
├── js/
│   ├── supabase-config.js  # คอนฟิก Supabase (คีย์ — ห้าม commit จริงขึ้น GitHub)
│   ├── layout.js           # สร้าง Header / Footer อัตโนมัติ
│   ├── sample-data.js      # ข้อมูลตัวอย่าง
│   ├── data.js             # ชั้นข้อมูล (Data Layer)
│   ├── app.js              # ตรรกะหน้าแรก
│   └── news.js             # ตรรกะหน้าข่าว
├── supabase/               # ไฟล์ตั้งค่าและ seed SQL สำหรับ Supabase
├── admin/                  # หน้าจัดการหลังบ้าน (login, dashboard, ฯลฯ)
├── docs/                   # เอกสารประกอบ (style_guide.md, sitemap.md ฯลฯ)
├── image/                  # รูปภาพประกอบ
└── README.md               # เอกสารนี้
```

## วิธีรันในเครื่อง

1. โคลนโปรเจกต์:
   ```bash
   git clone https://github.com/67100202-source/fss-buu-website.git
   cd fss-buu-website
   ```
2. เปิดไฟล์ `index.html` ด้วยเบราว์เซอร์ หรือใช้ **Live Server** ใน VS Code
3. ถ้าต้องการเชื่อม Supabase ให้ตั้งค่าใน `js/supabase-config.js` (ห้ามนำคีย์จริง commit ขึ้น GitHub)

## ⚠️ ข้อห้ามสำคัญ (กฎเหล็ก)

- **ห้ามลบหรือแก้ไข** ค่า `SUPABASE_URL`, `SUPABASE_ANON_KEY` หรือฟังก์ชันดึงข้อมูลจาก Supabase เดิมเด็ดขาด
- **แก้ไขเฉพาะส่วนการแสดงผล (HTML/CSS/UI Component) เท่านั้น**
- ห้าม commit ไฟล์ที่มี API Key หรือรหัสลับจริงขึ้น GitHub

## การทำงานร่วมกัน (Git Workflow)

ให้ทุกคนทำงานบน **feature branch** แยกกัน ไม่ควร push ตรงลง `main` เว้นแต่จะผ่านการ review แล้ว

```bash
# 1. สร้าง branch ใหม่จาก main
git checkout main
git pull origin main
git checkout -b feature/ชื่อฟีเจอร์

# 2. แก้ไขโค้ด แล้วทดสอบ

# 3. Commit และ push
git add .
git commit -m "feat: รายละเอียดสิ่งที่ทำ"
git push origin feature/ชื่อฟีเจอร์

# 4. สร้าง Pull Request บน GitHub → ให้ตรวจสอบโค้ด → แล้วค่อย merge เข้า main
```

## สถานะปัจจุบัน

- `main` — ブランช์หลัก (ใช้สำหรับโค้ดที่เสร็จสมบูรณ์แล้ว)
- `feature/ui-redesign-pharm-buu` — ブランช์สำหรับปรับปรุง UX/UI ทีละส่วน (สเต็ปที่ 1–นับถัดไป)