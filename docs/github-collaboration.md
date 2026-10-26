# วิธีให้เพื่อนร่วมงานบน GitHub (BUU | FSS)

เอกสารนี้สำหรับเพื่อนร่วมทีมที่ต้องการ clone โปรเจกต์และส่งงานผ่าน GitHub  
**หมายเหตุ:** ไฟล์นี้เป็นเอกสารประกอบ (docs) ไม่ได้แสดงในเมนูเว็บไซต์

## 1) เจ้าของ repo เชิญเพื่อน

1. เปิด repo: `https://github.com/67100202-source/fss-buu-website`
2. ไปที่ **Settings → Collaborators → Add people**
3. พิมพ์ username หรือ email ของเพื่อน แล้วส่งคำเชิญ
4. เพื่อนรับคำเชิญจากอีเมล/หน้า GitHub

## 2) เพื่อน clone โปรเจกต์

```bash
git clone https://github.com/67100202-source/fss-buu-website.git
cd fss-buu-website
```

## 3) เพื่อนสร้าง branch ของตัวเอง

```bash
git checkout main
git pull origin main
git checkout -b feature/ชื่อฟีเจอร์
```

## 4) แก้ไข → ทดสอบ → commit → push

```bash
# แก้ไขโค้ด แล้วทดสอบบนเบราว์เซอร์
git add .
git commit -m "feat: รายละเอียดสิ่งที่ทำ"
git push origin feature/ชื่อฟีเจอร์
```

## 5) สร้าง Pull Request (PR)

1. ไปที่ GitHub → จะมีปุ่ม **Compare & pull request**
2. เลือก `base: main` และ `compare: feature/...`
3. ใส่คำอธิบายสิ่งที่ทำ → **Create pull request**
4. เจ้าของ repo ตรวจโค้ด → Merge

## กฎที่ต้องทำตาม (ห้ามละเมิด)

- อย่า commit ไฟล์ที่มี API Key หรือรหัสลับ (เช่น `js/supabase-config.js`)
- อย่า push ตรงลง `main` ถ้ายังไม่ผ่าน review
- ทำงานบน feature branch เท่านั้น
- ทดสอบบนมือถือ 375px ก่อน commit
- แก้เฉพาะไฟล์ที่เกี่ยวข้อง (Surgical Edits)

## ถ้า push ไม่ได้

- เช็กว่าได้รับ invite แล้ว
- เช็กว่าใช้บัญชี GitHub ที่ถูกเชิญ
- ลอง `git remote -v` ว่าชี้ไป repo ที่ถูกต้อง
- ถ้ามี conflict ให้ `git pull origin main` แล้วแก้ conflict ก่อน push