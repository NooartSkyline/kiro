---
inclusion: auto
---

# Flappy Kiro — Tech Stack และคำสั่ง

## ภาษาและรันไทม์

- JavaScript (Vanilla) — ไม่มี framework, ไม่มี bundler, ไม่มี transpiler
- HTML5 Canvas API สำหรับ rendering
- CommonJS module format (`module.exports` / `require`) ใน game.js
- ESM import ในไฟล์เทสต์ (vitest รองรับทั้งสองแบบ)

## Dependencies

- ไม่มี production dependencies
- Dev dependencies:
  - `vitest` ^3.2.1 — test runner
  - `fast-check` ^4.1.1 — property-based testing

## คำสั่งที่ใช้บ่อย

| คำสั่ง | คำอธิบาย |
|--------|----------|
| `npm test` | รันเทสต์ทั้งหมด (`vitest --run`, single execution) |

## การรันเกม

เปิด `index.html` ในเบราว์เซอร์โดยตรง — ไม่ต้อง build, ไม่ต้อง dev server

## การ Export สำหรับเทสต์

ใช้ conditional export ที่ท้ายไฟล์ `game.js`:

```javascript
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, GameState, updateGhosty, ... };
}
```

ฟังก์ชันใหม่ที่ต้องการเทสต์ **ต้อง** เพิ่มใน `module.exports` ด้วย

## แนวทางการเทสต์

- ไฟล์เทสต์อยู่ใน `tests/` ตั้งชื่อตาม `{module}.test.js`
- ใช้ `import { ... } from '../game.js'` ในไฟล์เทสต์
- ใช้ `describe` / `it` / `expect` จาก vitest (globals: true)
- ใช้ `fast-check` (`fc`) สำหรับ property-based testing — อย่างน้อย 100 iterations ต่อ property
- Mock localStorage เองในเทสต์ที่ต้องการ (ดูตัวอย่างใน `score.test.js`)
- vitest config: `globals: true`, include pattern `tests/**/*.test.js`
- ใช้ dual testing approach: unit tests สำหรับ edge cases + property-based tests สำหรับ universal properties
