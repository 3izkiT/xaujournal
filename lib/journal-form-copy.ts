/** Trader-focused journal form copy (Thai + short English where useful). */

export const JOURNAL_FORM_INTRO =
  "บันทึกหลังปิดออเดอร์ — กรอกเฉพาะสิ่งที่นักเทรดส่วนใหญ่ใช้รีวิว: เมื่อไหร่ · ผลเทรด · วินัย · เหตุผล · บทเรียน";

export const JOURNAL_SECTIONS = {
  trade: {
    title: "1 · เทรดนี้",
    description: "เมื่อไหร่ · ทิศทาง · ช่วงตลาด (Session)",
  },
  outcome: {
    title: "2 · ผลลัพธ์",
    description: "กำไร/ขาดทุน · R · ราคาเข้า–ออก (อ้างอิงจากแพลตฟอร์ม)",
  },
  discipline: {
    title: "3 · วินัยก่อนเข้า",
    description: "ตอบตามความจริงตอนกดเข้า — ใช้คำนวณคะแนนวินัย",
  },
  context: {
    title: "4 · เหตุผล & อารมณ์",
    description: "เซ็ตอัปที่ใช้ + อารมณ์ตอนเทรด (ช่วยดู pattern ใน Analytics)",
  },
  notes: {
    title: "5 · บันทึกหลังเทรด",
    description: "ไม่บังคับ แต่แนะนำ — สั้นๆ ก็พอ ถ้ากรอกต้องอย่างน้อย 3 ตัวอักษร",
  },
  advanced: {
    title: "ข้อมูลเพิ่มเติม (ไม่บังคับ)",
    description: "MAE/MFE จาก MT5 หรือ TradingView — ส่วนใหญ่ข้ามได้",
  },
  charts: {
    title: "รูปชาร์ต (ไม่บังคับ)",
    description: "แนวตั้ง/แนวนอนจากมือถือได้ · อัปโหลดหรือวางลิงก์ https",
  },
} as const;
