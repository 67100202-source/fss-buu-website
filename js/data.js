/* =====================================================================
   ไฟล์: js/data.js
   ชั้นข้อมูล (Data Layer) ของเว็บไซต์
   ---------------------------------------------------------------------
   หน้าที่: เป็นจุดเดียวที่รวมข้อมูลทั้งหมดที่หน้าเว็บจะนำไปแสดง
   กติกาสำคัญจาก key.md: "ห้ามฝังข้อมูลใน HTML ข้อมูลต้องมาจากฐานข้อมูล"
   ===================================================================== */

/* ---------------------------------------------------------------------
   ระบบสลับข้อมูลอัตโนมัติ 3 สถานะ
   ---------------------------------------------------------------------
     1) ยังไม่ได้ใส่คีย์ Supabase  ->  ใช้ข้อมูลจาก js/sample-data.js
     2) ใส่คีย์แล้ว แต่ตารางยังว่าง  ->  ดึงจาก Supabase ได้ 0 แถว
        ( ให้รัน supabase/supabase_setup.sql เพื่อเติมข้อมูลเข้า DB )
     3) ใส่คีย์และมีข้อมูลใน DB  ->  ดึงข้อมูลจริงจาก Supabase
   ตรวจสถานะปัจจุบันได้ใน Console ด้วย:  getSupabase() !== null
   --------------------------------------------------------------------- */

/* ---------------------------------------------------------------------
   ตารางที่ NOT FOUND ใน supabase_setup.sql ใหม่ (แต่หน้าเว็บยังต้องใช้)
   ---------------------------------------------------------------------
   ตาราง athletes (นักกีฬาคณะ)
   ไม่มีในไฟล์ SQL ใหม่ → หน้าเว็บจะใช้เฉพาะข้อมูลตัวอย่างจาก
   sample-data.js ไปก่อน จนกว่าจะเพิ่มตารางเหล่านี้ใน SQL ภายหลัง
   --------------------------------------------------------------------- */

/* ---------------------------------------------------------------------
   ฟังก์ชันช่วยดึงข้อมูลจาก Supabase
   ---------------------------------------------------------------------
   ถ้ายังไม่ได้ตั้งค่า Supabase  -> คืน null ( ให้โค้ดใช้ข้อมูลตัวอย่างแทน )
   ถ้าตั้งค่าแล้ว               -> คืน array ของข้อมูลจากตาราง
   --------------------------------------------------------------------- */
async function queryDB(table, options = {}) {
  const sb = getSupabase();
  if (!sb) return null;   // ยังไม่ได้ตั้งค่า

  let q = sb.from(table).select("*");

  // เงื่อนไขแบบตรง ๆ เช่น { status: 'published' }
  for (const [key, value] of Object.entries(options.eq || {})) {
    q = q.eq(key, value);
  }
  // เงื่อนไขแบบ "มากกว่าเท่านี้" เช่น { deadline: "2026-01-01" }
  for (const [key, value] of Object.entries(options.gte || {})) {
    q = q.gte(key, value);
  }
  // เรียงลำดับ เช่น { created_at: "desc" }
  if (options.orderBy) {
    q = q.order(options.orderBy, { ascending: options.order === "asc" });
  }
  // จำกัดจำนวน เช่น { limit: 3 }
  if (options.limit) {
    q = q.limit(options.limit);
  }

  const { data, error } = await q;
  if (error) {
    console.error(`โหลดข้อมูลจากตาราง ${table} ไม่สำเร็จ:`, error.message);
    return null;
  }
  return data || [];
}

/* ---------------------------------------------------------------------
   ฟังก์ชันแปลงข้อมูลจากฐานข้อมูล (fields ใหม่) เป็นรูปแบบที่หน้าเว็บใช้
   --------------------------------------------------------------------- */

/** ข่าว: news_articles → รูปแบบของหน้าเว็บ
   ฟิลด์ใหม่: summary (ย่อหน้าเดียว), content (เนื้อหาเต็ม TEXT), published_date
   หมายเหตุ: ไม่มี body[] array แล้ว → ใช้ content แยกเป็นย่อหน้าโดยแบ่งจากข้อความ
   --------------------------------------------------------------------- */
function mapNewsRow(r) {
  return {
    id: r.id,
    title: r.title,
    title_en: r.title_en || "",
    category: r.category,
    excerpt: r.summary || "",
    excerpt_en: r.summary_en || "",
    body: r.content ? [r.content] : [],
    body_en: r.content_en ? [r.content_en] : [],
    image_url: r.image_url || "",
    author: r.author || "งานประชาสัมพันธ์คณะ",
    read_minutes: 2,
    theme: "green",
    is_urgent: r.is_urgent || false,
    is_sample: false,
    source_url: r.source_url || "",
    created_at: r.published_date,
  };
}

/** หลักสูตร: programs → รูปแบบของหน้าเว็บ */
function mapProgramRow(r) {
  return {
    id: r.id,
    name: r.name_th,
    name_en: r.name_en || "",
    degree: r.degree_th,
    degree_en: r.degree_en || "",
    level: r.level_th,
    level_en: r.level_en || "",
    detail: r.description_th || "",
    detail_en: r.description_en || "",
    years: r.curriculum_years,
    chairperson: r.chairperson || "",
    source_url: r.source_url || "",
  };
}

/** อาจารย์: instructors → รูปแบบของหน้าเว็บ */
function mapInstructorRow(r) {
  return {
    id: r.id,
    name: r.name_th,
    name_en: r.name_en || "",
    position: r.academic_position || "",
    position_en: r.academic_position_en || "",
    role: r.admin_role || "",
    expertise: r.department || "",
    expertise_en: r.department_en || r.expertise_en || "",
    phone: r.phone || "",
    email: r.email || "",
    source_url: r.source_url || "",
  };
}

/** ทุน: scholarships → รูปแบบของหน้าเว็บ */
function mapScholarshipRow(r) {
  return {
    id: r.id,
    title: r.title,
    title_en: r.title_en || "",
    type: r.scholarship_type,
    type_en: r.scholarship_type_en || "",
    amount: r.amount_baht,
    deadline: r.deadline,
    detail: r.eligibility || "",
    detail_en: r.eligibility_en || "",
    file_name: r.attachment_name || "",
    source_url: r.source_url || "",
  };
}

/** ผลงาน: achievements → รูปแบบของหน้าเว็บ */
function mapAchievementRow(r) {
  return {
    id: r.id,
    title: r.award_title,
    title_en: r.award_title_en || "",
    person: r.person_name,
    person_en: r.person_name_en || "",
    role: r.person_role || "",
    role_en: r.person_role_en || "",
    category: r.category || "",
    category_en: r.category_en || "",
    year: r.award_year || "",
    source_url: r.source_url || "",
  };
}

/** กิจกรรม: calendar_events → รูปแบบของหน้าเว็บ
   ฟิลด์ใหม่: start_date / end_date (ไม่มี time แยก) ใช้ time_range แทน
   --------------------------------------------------------------------- */
function mapEventRow(r) {
  return {
    id: r.id,
    title: r.title,
    title_en: r.title_en || "",
    date: r.start_date,
    end_date: r.end_date,
    time: r.time_range || "",
    end_time: "",
    location: r.location || "",
    location_en: r.location_en || "",
    category: r.event_type,
    category_en: r.event_type_en || "",
    target_year: r.target_year || "",
    detail: r.description || "",
    detail_en: r.description_en || "",
    source_url: r.source_url || "",
  };
}

/** คลังสื่อ: media_gallery → รูปแบบของหน้าเว็บ */
function mapMediaRow(r) {
  return {
    id: r.id,
    title: r.title,
    title_en: r.title_en || "",
    type: r.media_type === "video" ? "video" : "image",
    image_url: r.thumbnail_url || "",
    youtube_url: r.youtube_url || "",
    date: r.published_date,
    source_url: r.source_url || "",
  };
}

/* =====================================================================
   ส่วนที่ 2: ฟังก์ชันดึงข้อมูล ( Data Access Functions )
   ===================================================================== */

/**
 * ดึงรายการข่าวที่เผยแพร่แล้ว ( status = 'published' )
 */
async function fetchNews() {
  const db = await queryDB("news_articles", {
    eq: { status: "published" },
    orderBy: "published_date",
    order: "desc",
  });
  if (db === null) return sampleNews;
  return db.map(mapNewsRow);
}

/**
 * ดึงประกาศด่วน ( is_urgent = true )
 */
async function fetchUrgent() {
  const db = await queryDB("news_articles", {
    eq: { status: "published", is_urgent: true },
    orderBy: "published_date",
    order: "desc",
  });
  if (db === null) return sampleUrgent;
  return db.map(mapNewsRow);
}

/**
 * ดึงกิจกรรม ( จากตาราง calendar_events )
 */
async function fetchActivities() {
  const today = new Date().toISOString().slice(0, 10);
  const db = await queryDB("calendar_events", {
    eq: { status: "published" },
    gte: { start_date: today },
    orderBy: "start_date",
    order: "asc",
  });
  if (db === null) return sampleActivities;
  return db.map(mapEventRow);
}

/**
 * ดึงหลักสูตร ( จากตาราง programs )
 */
async function fetchCourses() {
  const db = await queryDB("programs", { orderBy: "id", order: "asc" });
  if (db === null) return sampleCourses;
  return db.map(mapProgramRow);
}

/**
 * ดึงรายชื่ออาจารย์ ( จากตาราง instructors )
 */
async function fetchFaculty() {
  const db = await queryDB("instructors", { orderBy: "id", order: "asc" });
  if (db === null) return sampleFaculty;
  return db.map(mapInstructorRow);
}

/**
 * ดึงประกาศทุนที่ยังไม่ปิดรับสมัคร
 */
async function fetchScholarships() {
  const today = new Date().toISOString().slice(0, 10);
  const db = await queryDB("scholarships", {
    eq: { status: "published" },
    gte: { deadline: today },
    orderBy: "deadline",
    order: "asc",
  });
  if (db === null) return sampleScholarships;
  return db.map(mapScholarshipRow);
}

/**
 * ดึงผลงานนิสิตและศิษย์เก่า
 */
async function fetchAchievements() {
  const db = await queryDB("achievements", { orderBy: "id", order: "asc" });
  if (db === null) return sampleAchievements;
  return db.map(mapAchievementRow);
}

/**
 * ดึงคลังภาพและวิดีโอ
 */
async function fetchMedia() {
  const db = await queryDB("media_gallery", {
    eq: { status: "published" },
    orderBy: "id",
    order: "asc",
  });
  if (db === null) return sampleMedia;
  return db.map(mapMediaRow);
}

/**
 * ดึงบุคลากรสำนักงานคณบดี
 */
async function fetchStaff() {
  const db = await queryDB("staff_members", { orderBy: "id", order: "asc" });
  if (db === null) return sampleStaff;
  return db.map((r) => ({
    id: r.id,
    name: r.name_th,
    position: r.position,
    phone: r.phone || "",
    email: r.email || "",
    source_url: r.source_url || "",
  }));
}

/**
 * ดึงข้อมูลติดต่อของคณะ ( จากตาราง faculty_info )
 */
async function fetchContactInfo() {
  const db = await queryDB("faculty_info", { limit: 1 });
  if (db === null || db.length === 0) return contactInfo;
  const r = db[0];
  return {
    facultyName: r.name_th || "",
    facultyName_en: r.name_en || "",
    address: r.address_th || "",
    address_en: r.address_en || "",
    phone: (r.phones && r.phones[0]) || "",
    email: r.email || "",
    facebook: r.facebook_url || "",
    youtube: r.youtube_url || "",
    tiktok: r.line_official || "",
  };
}

/**
 * ดึงข้อมูลคณะ ( ประวัติ วิสัยทัศน์ พันธกิจ ฯลฯ )
 */
async function fetchFacultyInfo() {
  const db = await queryDB("faculty_info", { limit: 1 });
  if (db === null || db.length === 0) return null;
  return db[0];
}

/**
 * ดึงคณะกรรมการและผู้บริหาร
 */
async function fetchBoardAndExecutives() {
  const db = await queryDB("board_and_executives", { orderBy: "id", order: "asc" });
  if (db === null) return [];
  return db;
}

/**
 * ดึงคำถามที่พบบ่อย (FAQ)
 */
async function fetchFAQ() {
  const db = await queryDB("faq_items", { orderBy: "id", order: "asc" });
  if (db === null) return [];
  return db;
}

/**
 * ดึงเอกสารเผยแพร่และแบบฟอร์ม
 */
async function fetchDocuments() {
  const db = await queryDB("documents_and_forms", { orderBy: "id", order: "asc" });
  if (db === null) return [];
  return db;
}

/**
 * ดึงบริการวิชาการ / ศูนย์วิสาหกิจกีฬา
 */
async function fetchServices() {
  const db = await queryDB("sport_enterprise_services", { orderBy: "id", order: "asc" });
  if (db === null) return sampleServices;
  return db.map((r) => ({
    id: r.id,
    label: r.service_name,
    label_en: r.service_name_en || "",
    url: "",
    icon: "",
    sort_order: r.id,
  }));
}

/**
 * ดึงข่าวรายฉบับเดียวตาม id ( ใช้ในหน้าอ่านข่าว )
 */
async function fetchNewsById(id) {
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("news_articles")
      .select("*")
      .eq("id", id)
      .eq("status", "published")
      .maybeSingle();
    if (!error && data) return mapNewsRow(data);
    if (error) console.error("โหลดข่าวไม่สำเร็จ:", error.message);
  }
  // ยังไม่ได้ตั้งค่า Supabase -> ใช้ข้อมูลตัวอย่าง
  const found = sampleNews.find((n) => n.id === id);
  return found || null;
}

/**
 * ดึงข่าวกีฬารายฉบับเดียวตาม id
 */
async function fetchSportsNewsById(id) {
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("news_articles")
      .select("*")
      .eq("id", id)
      .eq("status", "published")
      .maybeSingle();
    if (!error && data) return mapNewsRow(data);
    if (error) console.error("โหลดข่าวกีฬาไม่สำเร็จ:", error.message);
  }
  const found = sampleSportsNews.find((n) => n.id === id);
  return found || null;
}

/**
 * ดึงข่าวกีฬา ( กรองจากหมวด 'ข่าวกีฬาและการแข่งขัน' ในตารางเดียวกัน )
 */
async function fetchSportsNews() {
  const db = await queryDB("news_articles", {
    eq: { status: "published" },
    orderBy: "published_date",
    order: "desc",
  });
  if (db === null) {
    return sampleSportsNews;
  }
  return db
    .filter((r) => (r.category || "").includes("ข่าวกีฬา"))
    .map(mapNewsRow);
}

/**
 * ดึงผลการแข่งขัน
 * หมายเหตุ: ไม่มีตาราง match_results ใน SQL ใหม่ → ใช้ข้อมูลตัวอย่าง
 */
async function fetchMatchResults() {
  return sampleMatchResults;
}

/**
 * ดึงตารางการแข่งขันที่กำลังจะมาถึง
 * หมายเหตุ: ไม่มีตาราง match_fixtures ใน SQL ใหม่ → ใช้ข้อมูลตัวอย่าง
 */
async function fetchMatchFixtures() {
  return sampleMatchFixtures;
}

/**
 * ดึงข้อมูลนักกีฬาคณะ
 * หมายเหตุ: ไม่มีตาราง athletes ใน SQL ใหม่ → ใช้ข้อมูลตัวอย่าง
 */
async function fetchAthletes() {
  return sampleAthletes;
}

/**
 * ดึงสไลด์ Banner หน้าแรก
 * หมายเหตุ: ไม่มีตาราง banners ใน SQL ใหม่ → ใช้ข้อมูลตัวอย่าง
 */
async function fetchBanners() {
  return sampleBanners;
}

/**
 * ดึงทางลัดตามกลุ่มผู้ใช้
 * หมายเหตุ: ไม่มีตาราง quick_links ใน SQL ใหม่ → ใช้ข้อมูลตัวอย่าง
 */
async function fetchQuickLinks() {
  return sampleQuickLinks;
}

/**
 * ดึงพันธมิตร/หน่วยงานที่เกี่ยวข้อง
 * หมายเหตุ: ไม่มีตาราง partners ใน SQL ใหม่ → ใช้ข้อมูลตัวอย่าง
 */
async function fetchPartners() {
  return samplePartners;
}
