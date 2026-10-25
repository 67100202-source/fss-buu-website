# AI Log — BUU | FSS เว็บไซต์คณะวิทยาศาสตร์การกีฬา ม.บูรพา

**โปรเจกต์:** เว็บไซต์ต้นแบบคณะวิทยาศาสตร์การกีฬา มหาวิทยาลัยบูรพา (BUU | FSS)  
**รายวิชา:** 85336164 การสร้างสรรค์เว็บไซต์สำหรับงานกีฬา  
**กำหนดนำเสนอ:** 28 ตุลาคม 2569  
**ผู้จัดทำบันทึก:** ทีมพัฒนา (5 คน)  
**เครื่องมือ AI ที่ใช้:** OpenCode (Beam Free) — ช่วยเขียนโค้ด, ออกแบบ UI, สรุปข้อมูล, แก้ไข bug

---

## หลักการใช้ AI อย่างมีวิจารณญาณ (AI Usage Guidelines)

1. AI ใช้เป็น **ผู้ช่วย (Assistant)** ไม่ใช่ผู้ตัดสินใจ — ทุกผลลัพธ์จาก AI ต้องตรวจสอบก่อนนำไปใช้
2. สมาชิกทุกคนต้อง **อธิบายโค้ดในส่วนของตนเองได้** ในวันนำเสนอ
3. ตรวจสอบความถูกต้องของข้อมูล (ชื่ออาจารย์, ทุน, เบอร์โทร) กับเว็บคณะจริง (fss.buu.ac.th)
4. ไม่ใส่ service_role key หรือรหัสผ่านในโค้ด (ใช้เฉพาะ anon key)

---

## บันทึกการใช้ AI ตามステ็ป

### สเต็ป 1: โครงสร้างโปรเจกต์และ Layout (Header/Footer)
- **เครื่องมือ AI:** OpenCode
- **プロンプト:** "สร้าง Header/Footer กลางสำหรับเว็บ 9 หน้า ตาม sitemap.md เมนู 7 รายการ"
- **ผลลัพธ์:** ไฟล์ `js/layout.js` (MENU_ITEMS, buildHeaderHTML, buildFooterHTML)
- **การตรวจสอบ:** ตรวจสอบว่าเมนู 7 รายการตรงกับ sitemap, ปุ่ม ≥44px, mobile-first 375px
- **การแก้ไข:** ปรับ class CSS, เพิ่ม data-i18n สำหรับ 2 ภาษา

### สเต็ป 2: เชื่อมต่อ Supabase (Data Layer)
- **เครื่องมือ AI:** OpenCode
- **プロンプト:** "สร้าง data.js ดึงข้อมูลจาก Supabase พร้อม fallback sample-data.js"
- **ผลลัพธ์:** ไฟล์ `js/data.js` (queryDB, map*Row, fetch* functions)
- **การตรวจสอบ:** ทดสอบ getSupabase() !== null, ตรวจสอบ mapping ฟิลด์ DB → frontend
- **การแก้ไข:** เพิ่ม try/catch, fallback sample data, แก้ mapping ฟิลด์ (published_date, start_date ฯลฯ)

### สเต็ป 3: หน้าแรก (Homepage)
- **เครื่องมือ AI:** OpenCode
- **プロンプト:** "สร้าง app.js โหลดข้อมูลทั้งหมดของหน้าแรกตาม sitemap zone 1-6"
- **ผลลัพธ์:** ไฟล์ `js/app.js` (loadHomepage, renderNews, renderActivities, renderCourses, renderFaculty, renderScholarships, renderAchievements, renderMedia, renderUrgent, renderServices, renderPartners, initHeroSlider, initSearch, initMenuDrawer, initLangToggle)
- **การตรวจสอบ:** ตรวจสอบ Mobile-First 375px, ไม่มี horizontal scroll, ปุ่ม ≥44px
- **การแก้ไข:** เพิ่ม defensive coding (null check), แก้ render ให้รองรับ EN fields

### สเต็ป 4: หน้าข่าวสาร (News & Sports News)
- **เครื่องมือ AI:** OpenCode
- **プロンプト:** "สร้าง news.js สำหรับ news.html, news-detail.html, sports-news.html"
- **ผลลัพธ์:** ไฟล์ `js/news.js` (initNewsListPage, initNewsDetailPage, initSportsPage, buildNewsCard, renderPagination, buildShareBox, initTabs)
- **การตรวจสอบ:** ทดสอบ pagination, filter หมวดหมู่, แชร์โซเชียล, related news
- **การแก้ไข:** แก้ sports news filter (category includes "ข่าวกีฬา"), แก้ related news URL

### สเต็ป 5: หน้าหลักสูตรและอาจารย์ (Curriculum & Faculty)
- **เครื่องมือ AI:** OpenCode
- **プロンプト:** "สร้าง curriculum.js โหลดหลักสูตรและอาจารย์ + ค้นหาอาจารย์ภาษาไทย"
- **ผลลัพธ์:** ไฟล์ `js/curriculum.js` (initCurriculumPage, renderCourses, renderFacultyList)
- **การตรวจสอบ:** ทดสอบค้นหาชื่ออาจารย์/สาขาวิชา ด้วยภาษาไทย
- **การแก้ไข:** แยกหน้าอาจารย์ (faculty.html) ออกจากหลักสูตร, จัดกลุ่มตามสาขา, เพิ่มแท็บระดับการศึกษา

### สเต็ป 6: หน้าทุน/ผลงาน/คลังสื่อ/ติดต่อ (Scholarships, Achievements, Gallery, Contact)
- **เครื่องมือ AI:** OpenCode
- **プロンプト:** "สร้าง scholarships.js, achievements.js, gallery.js, contact.js"
- **ผลลัพธ์:** ไฟล์ทั้ง 4 + หน้า HTML ที่เกี่ยวข้อง
- **การตรวจสอบ:** ทดสอบ CRUD ผ่าน Admin, ทดสอบ lightbox ภาพ/วิดีโอ, ทดสอบฟอร์มติดต่อ
- **การแก้ไข:** แก้ gallery.js syntax error + เพิ่ม lightbox, แก้ contact.js form submission

### สเต็ป 7: ปฏิทินกิจกรรม (Calendar)
- **เครื่องมือ AI:** OpenCode
- **プロンプト:** "สร้าง calendar.html + calendar.js ปฏิทินรายเดือน + popup รายละเอียด"
- **ผลลัพธ์:** ไฟล์ `calendar.html`, `js/calendar.js`
- **การตรวจสอบ:** ทดสอบ grid 7 คอลัมน์, คลิกวัน, เปลี่ยนเดือน, ไฮไลต์วันนี้, Google Calendar link
- **การแก้ไข:** แก้ badge ล้นขอบ, เปลี่ยนรายละเอียดจากด้านล่างเป็น popup

### สเต็ป 8: ระบบ Admin (Route Guard + Dashboard + CRUD)
- **เครื่องมือ AI:** OpenCode
- **プロンプト:** "สร้าง js/admin.js (route guard + logout) และ wire กับทุกหน้า admin/"
- **ผลลัพธ์:** ไฟล์ `js/admin.js`, แก้ `admin/*.html` ทั้ง 7 หน้า
- **การตรวจสอบ:** ทดสอบล็อกอิน/ออกจากระบบ, route guard (redirect ไป login ถ้าไม่ได้ล็อกอิน), Dashboard counts
- **การแก้ไข:** ลบ duplicate admin users, เพิ่มบัญชี 67100202@go.buu.ac.th

### สเต็ป 9: ระบบ 2 ภาษา (Bilingual)
- **เครื่องมือ AI:** OpenCode
- **プロンプト:** "เพิ่มระบบ 2 ภาษา (TH/EN) ด้วย data-i18n + I18N dictionary + applyLanguage"
- **ผลลัพธ์:** แก้ `js/layout.js`, `js/app.js`, `js/curriculum.js`, `js/news.js`, `js/contact.js`, `js/scholarships.js`, `js/achievements.js`, `js/gallery.js`, `js/calendar.js`, `js/faculty.js`, `js/staff.js`
- **การตรวจสอบ:** ทดสอบ toggle TH/EN บนทุกหน้า, ตรวจสอบ instant re-render
- **การแก้ไข:** เพิ่มฟิลด์ EN ใน DB (title_en, summary_en, name_en, expertise_en ฯลฯ), สร้าง `supabase/update_english.sql`, แก้ sample-data.js

### สเต็ป 10: แชทบอท FAQ
- **เครื่องมือ AI:** OpenCode
- **プロンプト:** "สร้าง js/chatbot.js แชทบอท FAQ 12 คำถาม รองรับ 2 ภาษา + keyword matching"
- **ผลลัพธ์:** ไฟล์ `js/chatbot.js`, เพิ่ม script tag ในทุกหน้า HTML
- **การตรวจสอบ:** ทดสอบคำถาม 12 ข้อ ทั้งไทย/อังกฤษ, ทดสอบ fallback
- **การแก้ไข:** ปรับ weighted scoring (kw.length), ลบ generic keywords, เพิ่ม "เพนกวิน" → "น่ารักที่สุดในโลก"

### สเต็ป 11: คู่มือ Admin
- **เครื่องมือ AI:** OpenCode
- **プロンプต:** "สร้าง admin/manual.html คู่มือการใช้งาน Admin 8 หัวข้อ + พิมพ์เป็น PDF"
- **ผลลัพธ์:** ไฟล์ `admin/manual.html`, เพิ่มลิงก์ใน footer และ dashboard
- **การตรวจสอบ:** ตรวจสอบเนื้อหาครบ, ปุ่มพิมพ์ทำงาน

### สเต็ป 12: Deployment (Cloudflare Pages/Workers)
- **เครื่องมือ AI:** OpenCode
- **プロンプト:** "จัดการ deploy ด้วย Cloudflare"
- **ผลลัพธ์:** สร้าง `_headers`, deploy สำเร็จที่ `https://fss-buu-website.67100202.workers.dev`
- **การตรวจสอบ:** ทดสอบ URL, หน้าแรกโหลดได้ (200 OK)

---

## สรุปการใช้ AI

| ด้าน | คะแนนเต็ม | ประเมิน |
|---|---|---|
| การวิเคราะห์ความต้องการ | 15 | ใช้ผลแบบสอบถาม, จัดลำดับตามคะแนน |
| การออกแบบ UX/UI | 20 | Mobile-First, เมนู 7 รายการ, ≤3 คลิก |
| ฟีเจอร์และระบบ Admin | 25 | ฟีเจอร์บังคับ 4 + เสริม 2 + Admin CRUD |
| เนื้อหาและข่าวกีฬา | 15 | 9 หน้าบังคับ + ข่าวกีฬา 5 ข่าว |
| การทดสอบกับผู้ใช้ | 10 | ยังไม่ทำ (ต้องทดสอบ ≥5 คน) |
| การใช้ AI อย่างมีวิจารณญาณ | 5 | บันทึก AI Log ครบ, ตรวจสอบผลลัพธ์ |
| การนำเสนอและเอกสาร | 10 | คู่มือ Admin พร้อม, นำเสนอ 28 ต.ค. |

**รวม:** ~85/100 (ขาด Usability Testing 10 คะแนน)

---

## ความรับผิดชอบของสมาชิก (ตัวอย่าง)

| สมาชิก | ส่วนที่รับผิดชอบ | ไฟล์หลัก |
|---|---|---|
| สมาชิก 1 | Layout, CSS Design System, 2 ภาษา | `js/layout.js`, `css/style.css` |
| สมาชิก 2 | Data Layer, Supabase, Admin CRUD | `js/data.js`, `js/admin.js`, `admin/*.html` |
| สมาชิก 3 | หน้าแรก, ข่าวสาร, ปฏิทิน | `js/app.js`, `js/news.js`, `js/calendar.js` |
| สมาชิก 4 | หลักสูตร, อาจารย์, ทุน, ผลงาน, คลังสื่อ, ติดต่อ | `js/curriculum.js`, `js/faculty.js`, `js/staff.js`, `js/scholarships.js`, `js/achievements.js`, `js/gallery.js`, `js/contact.js` |
| สมาชิก 5 | Chatbot, คู่มือ Admin, Deployment | `js/chatbot.js`, `admin/manual.html`, Cloudflare |

*หมายเหตุ: สมาชิกทุกคนต้องสามารถอธิบายโค้ดในส่วนของตนเองได้ในวันนำเสนอ*
