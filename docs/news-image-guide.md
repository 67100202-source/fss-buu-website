# คู่มือรูปภาพสำหรับข่าวสาร (News Image Guide) — BUU | FSS

**วัตถุประสงค์:** ให้ข่าวสารแต่ละรายการมีรูปภาพประกอบ (image_url)  
**สถานะปัจจุบัน:** Frontend พร้อมแสดงรูปแล้ว (app.js, news.js) — รอรูปภาพจริง

---

## แหล่งรูปภาพสำหรับแต่ละข่าว (10 ข่าว)

| # | ข่าว | แหล่งรูป (ดาวน์โหลดจาก) | หมายเหตุ |
|---|---|---|---|
| 1 | **เปิดพื้นที่ FSS Co-Working Space** | Facebook คณะ: https://www.facebook.com/Buusportsci/posts/1826612419011505 | รูปพื้นที่ Co-Working Space |
| 2 | **กิจกรรม "รุ่นพี่ พบรุ่นน้อง"** | Facebook คณะ: https://www.facebook.com/Buusportsci/posts/1832721828400564 | รูปบรรยากาศกิจกรรม |
| 3 | **มุทิตาจิต รศ.ดร.ธนิดา จุลวนิชย์พงษ์** | เว็บคณะ: https://fss.buu.ac.th/news/frontend/detail/MTZ8fFl6WXN8Qmtz หรือ Facebook คณะ | รูปพิธีมุทิตาจิต |
| 4 | **วันสถาปนามหาวิทยาลัยบูรพา ครบรอบ 71 ปี** | เว็บ ม.บูรพา: https://www.buu.ac.th/news/ปลุกพลังชาวเทา-ทอง-ม-บูรพา-จัดเต็ม-วิ่งประเพณีเขาสามมุข | รูปงานสถาปนา |
| 5 | **MOU Danang Sport University** | เว็บคณะ: https://fss.buu.ac.th/news/frontend/detail/MTZ8fFl6WXB8Qmtz หรือ Facebook คณะ | รูปพิธีลงนาม MOU |
| 6 | **นายเกียรติศักดิ์ สิงหพงษ์ คว้า Suzuka 4 Hours** | thairath.co.th/sports/2805732 หรือ matichon.co.th/sport/news_4715606 | รูปนักแข่ง + รถแข่ง |
| 7 | **ดอกจานบ้านเชียงเกมส์ (นักกีฬา ม.บูรพา)** | Facebook มหาวิทยาลัย: https://www.facebook.com/buu.ac.th/posts/5986629924708842 | รูปนักกีฬา + เหรียญ |
| 8 | **BUU House (ศูนย์บริการวิทยาศาสตร์การกีฬา)** | เว็บคณะ: https://fss.buu.ac.th/news/frontend/detail/MTZ8fFl6WXB8Qmtz หรือ Facebook คณะ | รูปศูนย์ BUU House |
| 9 | **Sport Science Games (การแข่งขันกีฬาภายใน)** | Facebook คณะ: https://www.facebook.com/Buusportsci (ค้นหา "Sport Science Games") | รูปการแข่งขัน |
| 10 | **BUU Night Run + วิ่งเขาสามมุข** | เว็บ ม.บูรพา: https://www.buu.ac.th/news/ปลุกพลังชาวเทา-ทอง-ม-บูรพา-จัดเต็ม-วิ่งประเพณีเขาสามมุข | รูปงานวิ่ง |

---

## วิธีใส่รูป (2 ทางเลือก)

### ทางเลือก A: วางไฟล์ในโปรเจกต์ (ง่าย, แนะนำสำหรับ prototype)
1. ดาวน์โหลดรูปจากแหล่งด้านบน
2. วางในโฟลเดอร์ `image/news/` (สร้างโฟลเดอร์ใหม่)
3. ตั้งชื่อไฟล์ตาม id ข่าว เช่น `1.jpg`, `2.jpg`, ..., `10.jpg`
4. อัปเดต DB:
   ```sql
   UPDATE news_articles SET image_url = 'image/news/1.jpg' WHERE id = 1;
   UPDATE news_articles SET image_url = 'image/news/2.jpg' WHERE id = 2;
   -- ... ทำซ้ำสำหรับทุกข่าว
   ```
5. หรือให้ผมเขียน script อัปเดต DB image_url ตาม id (ถ้าบอกชื่อไฟล์)

### ทางเลือก B: อัปโหลดไป Supabase Storage (แนะนำสำหรับ production)
1. อัปโหลดรูปไป bucket `fss-media` ใน Supabase Storage (ผ่าน Dashboard หรือ Admin panel)
2. ได้ public URL เช่น `https://wssrecnfyljacgyejpfj.supabase.co/storage/v1/object/public/fss-media/news/1.jpg`
3. อัปเดต DB:
   ```sql
   UPDATE news_articles SET image_url = 'https://.../news/1.jpg' WHERE id = 1;
   ```
4. หรือใช้ Admin CRUD (ถ้าเพิ่มฟิลด์ image upload ใน admin/news.html)

---

## Frontend พร้อมแสดงรูปแล้ว ✅
- `js/app.js` `renderNews()` — แสดง `image_url` ในการ์ดข่าวหน้าแรก (ถ้ามี)
- `js/news.js` `buildNewsCard()` — แสดง `image_url` ในการ์ดรายการข่าว (ถ้ามี)
- `js/news.js` `initNewsDetailPage()` — แสดง `image_url` ในหน้าอ่านข่าว (ถ้ามี)

**หมายเหตุ:** ถ้า `image_url` เป็น null/ว่าง → แสดง placeholder (สีตามหมวด / ข้อความหมวดหมู่) ตามเดิม

---

## ตัวเลือกเพิ่มเติม
- **ใช้รูป placeholder ทั่วไป** (เช่น picsum.photos) สำหรับ demo → ไม่แนะนำ (ไม่ใช่รูปข่าวจริง)
- **ให้ Admin อัปโหลดรูป** → ต้องเพิ่มฟิลด์ image upload ใน admin/news.html (ทำได้ถ้าต้องการ)
- **ให้ tôi ช่วยอัปเดต DB** → บอกชื่อไฟล์/URL ที่ใช้ → 我จะเขียน script อัปเดต image_url ตาม id

ต้องการให้ทำอะไรเพิ่มเติมไหมครับ? (เช่น เพิ่มฟิลด์ image upload ใน Admin, หรือสั่งステ็ปถัดไป)
