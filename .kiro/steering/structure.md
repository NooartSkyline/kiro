---
inclusion: auto
---

# Flappy Kiro — โครงสร้างโปรเจกต์

```
.
├── game.js              # ซอร์สโค้ดเกมทั้งหมด (single-file architecture)
├── index.html           # HTML host — โหลด Canvas และ game.js
├── assets/              # เสียงและสไปรท์
│   ├── ghosty.png       # สไปรท์ตัวละคร Ghosty
│   ├── jump.wav         # เสียงกระโดด
│   └── game_over.wav    # เสียง Game Over
├── img/                 # ภาพประกอบ (screenshot, UI mockup)
├── tests/               # ไฟล์เทสต์ vitest — flat structure, ไม่มี subdirectory
│   ├── setup.test.js    # ตรวจสอบ infrastructure (import, fast-check)
│   ├── ghosty.test.js   # ฟิสิกส์ตัวละคร
│   ├── pipes.test.js    # ระบบท่อ
│   ├── collision.test.js# การตรวจจับการชน
│   ├── score.test.js    # ระบบคะแนน
│   ├── clouds.test.js   # ระบบเมฆ
│   └── state.test.js    # State machine / input handling
├── .kiro/
│   ├── specs/           # Spec documents สำหรับฟีเจอร์ต่าง ๆ
│   └── steering/        # Steering rules สำหรับ AI assistant
└── vitest.config.js     # Vitest configuration
```

## สถาปัตยกรรม

- **Single-file architecture** — โค้ดเกมทั้งหมดอยู่ใน `game.js` ไฟล์เดียว
- แบ่งเป็น section ด้วย comment block `// ============================================================`
- Section หลักตามลำดับ:
  1. Constants & State (`CONFIG`, `GameState`)
  2. Ghosty Physics
  3. Gravity Controller (Impossible Mode)
  4. Pipe System
  5. Collision Detection
  6. Score System
  7. Cloud System
  8. Input Handler
  9. Audio Manager
  10. Rendering
  11. Game Update
  12. Game Initialization & Loop

## หลักการจัดระเบียบ

- เทสต์แยกตาม domain/module — ชื่อไฟล์ตรงกับ section ใน game.js
- ฟังก์ชันใหม่เพิ่มใน section ที่เกี่ยวข้องภายใน `game.js`
- ค่าคงที่ใหม่เพิ่มใน `CONFIG` object ที่ด้านบนไฟล์
- Asset ใหม่ (รูป/เสียง) ใส่ใน `assets/`
- ไม่สร้าง subdirectory ใหม่ใน `tests/` — ใช้ flat structure
