# แผนการ Implement: Impossible Mode

## ภาพรวม

เพิ่มระบบ Impossible Mode ให้กับ Flappy Kiro — Red Gate (ท่อสีแดง) ที่สุ่มเกิดแทนท่อเขียวปกติ เมื่อ Ghosty ผ่าน Red Gate แรงโน้มถ่วงจะกลับทิศเป็นเวลา 10 วินาที พร้อม countdown timer แสดงที่มุมซ้ายบน โค้ดทั้งหมดอยู่ใน `game.js` ไฟล์เดียว ใช้ Vitest + fast-check สำหรับ testing

## Tasks

- [x] 1. เพิ่ม CONFIG constants ใหม่สำหรับ Impossible Mode
  - เพิ่มค่าคงที่ใน CONFIG object ที่มีอยู่แล้วใน `game.js`:
    - `RED_GATE_PROBABILITY: 0.15` — ความน่าจะเป็นที่ท่อจะเป็น Red Gate
    - `REVERSE_GRAVITY_DURATION: 10` — ระยะเวลา reverse gravity (วินาที)
    - `RED_GATE_COLOR: '#B22222'` — สีตัวท่อ Red Gate
    - `RED_GATE_CAP_COLOR: '#DC143C'` — สีหัวท่อ Red Gate
    - `TIMER_FONT_SIZE: 28` — ขนาดฟอนต์ countdown timer
    - `TIMER_COLOR: '#FF4444'` — สีตัวอักษร countdown timer
    - `TIMER_X: 16` — ตำแหน่ง X ของ timer
    - `TIMER_Y: 36` — ตำแหน่ง Y ของ timer
  - _Requirements: 1.1, 1.2, 3.3_

- [x] 2. Implement Gravity Controller (ระบบควบคุมแรงโน้มถ่วง)
  - [x] 2.1 Implement ฟังก์ชัน `createGravityController`, `activateReverseGravity`, `updateGravityController`, `resetGravityController`
    - `createGravityController()`: คืน `{ reversed: false, timer: 0 }`
    - `activateReverseGravity(gc, duration)`: ตั้ง `reversed=true`, `timer=duration`
    - `updateGravityController(gc, deltaTime)`: ลด timer ตาม deltaTime, clamp เป็น 0 ถ้าติดลบ, คืน `reversed=false` เมื่อ timer ถึง 0
    - `resetGravityController(gc)`: ตั้ง `reversed=false`, `timer=0`
    - _Requirements: 2.1, 2.2, 4.1, 6.1, 6.2, 7.1_
  - [x] 2.2 Implement ฟังก์ชัน `getEffectiveGravity`, `getEffectiveFlapStrength`, `getTimerDisplay`
    - `getEffectiveGravity(gc, baseGravity)`: คืน `-baseGravity` ถ้า reversed, มิฉะนั้นคืน `baseGravity`
    - `getEffectiveFlapStrength(gc, baseFlapStrength)`: คืน `-baseFlapStrength` ถ้า reversed, มิฉะนั้นคืน `baseFlapStrength`
    - `getTimerDisplay(gc)`: คืน `Math.ceil(gc.timer)` ถ้า timer > 0, มิฉะนั้นคืน 0
    - _Requirements: 2.3, 2.4, 3.2, 3.4, 4.2, 4.3_

- [x] 3. Implement Red Gate Spawning (ระบบสร้าง Red Gate)
  - [x] 3.1 Implement ฟังก์ชัน `createRedGate` และ `shouldSpawnRedGate`
    - `createRedGate(canvasWidth, canvasHeight, gapHeight, scoreBarHeight)`: เหมือน `createPipe` แต่เพิ่ม `isRedGate: true`
    - `shouldSpawnRedGate(probability)`: คืน `true` ด้วยความน่าจะเป็นที่กำหนด (0.0 ถึง 1.0)
    - _Requirements: 1.1, 1.3, 1.4, 1.5_

- [ ]* 4. เขียน property tests สำหรับ Gravity Controller
  - [ ]* 4.1 เขียน property test: Activate reverse gravity sets state correctly
    - สร้างไฟล์ `tests/gravity.test.js`
    - **Property 2: Activate reverse gravity sets state correctly**
    - **Validates: Requirements 2.1, 2.2**
  - [ ]* 4.2 เขียน property test: Effective gravity reflects reversal state
    - **Property 3: Effective gravity reflects reversal state**
    - **Validates: Requirements 2.3, 4.2**
  - [ ]* 4.3 เขียน property test: Effective flap strength reflects reversal state
    - **Property 4: Effective flap strength reflects reversal state**
    - **Validates: Requirements 2.4, 4.3**
  - [ ]* 4.4 เขียน property test: Timer display is ceiling of remaining seconds
    - **Property 5: Timer display is ceiling of remaining seconds**
    - **Validates: Requirements 3.2, 3.4**
  - [ ]* 4.5 เขียน property test: Timer expiry restores normal gravity
    - **Property 6: Timer expiry restores normal gravity**
    - **Validates: Requirements 4.1, 7.1**
  - [ ]* 4.6 เขียน property test: Reset gravity controller restores initial state
    - **Property 7: Reset gravity controller restores initial state**
    - **Validates: Requirements 6.1, 6.2**

- [ ]* 5. เขียน property test สำหรับ Red Gate
  - [ ]* 5.1 เขียน property test: Red Gate structural invariants
    - สร้างไฟล์ `tests/red-gate.test.js`
    - **Property 1: Red Gate structural invariants**
    - **Validates: Requirements 1.1, 1.3, 1.4**

- [x] 6. Checkpoint — ตรวจสอบ core logic ใหม่
  - ตรวจสอบว่า test ทั้งหมดผ่าน, ถามผู้ใช้หากมีข้อสงสัย

- [x] 7. แก้ไขฟังก์ชันที่มีอยู่เพื่อรองรับ Impossible Mode
  - [x] 7.1 แก้ไขฟังก์ชัน `update` ใน `game.js`
    - ใช้ `getEffectiveGravity()` แทน `CONFIG.GRAVITY` ตรงๆ
    - เรียก `updateGravityController()` ทุกเฟรม
    - ตรวจจับเมื่อ Ghosty ผ่าน Red Gate → เรียก `activateReverseGravity()`
    - _Requirements: 2.1, 2.3, 4.1, 5.1, 5.2, 5.3, 5.4, 5.5_
  - [x] 7.2 แก้ไขฟังก์ชัน `handleInput` ใน `game.js`
    - ส่ง effective flap strength จาก gravity controller แทน `CONFIG.FLAP_STRENGTH` ตรงๆ
    - _Requirements: 2.4, 4.3_
  - [x] 7.3 แก้ไขฟังก์ชัน `resetGame` (ภายใน `initGame`) ใน `game.js`
    - เรียก `resetGravityController()` เมื่อ reset เกม
    - _Requirements: 6.1, 6.2, 6.3_
  - [x] 7.4 แก้ไขฟังก์ชัน `renderPipe` ใน `game.js`
    - ตรวจสอบ `pipe.isRedGate` เพื่อเลือกสี red หรือ green
    - ใช้ `CONFIG.RED_GATE_COLOR` และ `CONFIG.RED_GATE_CAP_COLOR` สำหรับ Red Gate
    - _Requirements: 1.2_
  - [x] 7.5 แก้ไข pipe spawning ในฟังก์ชัน `update`
    - ใช้ `shouldSpawnRedGate(CONFIG.RED_GATE_PROBABILITY)` เพื่อตัดสินใจว่าจะสร้าง Red Gate หรือท่อปกติ
    - เรียก `createRedGate()` หรือ `createPipe()` ตามผลลัพธ์
    - _Requirements: 1.1, 1.5_

- [x] 8. เพิ่ม Countdown Timer Rendering
  - [x] 8.1 Implement ฟังก์ชัน `renderCountdownTimer` ใน `game.js`
    - วาด countdown timer ที่มุมซ้ายบนเมื่อ `gravityController.reversed === true`
    - ใช้ `getTimerDisplay()` เพื่อแสดงจำนวนวินาทีที่เหลือ (ปัดขึ้น)
    - ใช้ `CONFIG.TIMER_FONT_SIZE`, `CONFIG.TIMER_COLOR`, `CONFIG.TIMER_X`, `CONFIG.TIMER_Y`
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  - [x] 8.2 แก้ไขฟังก์ชัน `render` ใน `game.js`
    - เรียก `renderCountdownTimer()` เมื่อ gravity reversed
    - _Requirements: 3.1, 3.4_

- [x] 9. Wire ทุกอย่างเข้าด้วยกัน
  - [x] 9.1 เพิ่ม `gravityController` เข้า game state ใน `initGame`
    - สร้าง `gravityController` ด้วย `createGravityController()` และเพิ่มเข้า game object
    - _Requirements: 6.3_
  - [x] 9.2 อัปเดต `module.exports` ให้ export ฟังก์ชันใหม่ทั้งหมด
    - เพิ่ม `createGravityController`, `activateReverseGravity`, `updateGravityController`, `resetGravityController`, `getEffectiveGravity`, `getEffectiveFlapStrength`, `getTimerDisplay`, `createRedGate`, `shouldSpawnRedGate` เข้า exports
    - _Requirements: ทุกข้อ (testing infrastructure)_

- [x] 10. Checkpoint สุดท้าย — ตรวจสอบทุกอย่าง
  - ตรวจสอบว่า test ทั้งหมดผ่าน, ถามผู้ใช้หากมีข้อสงสัย

## หมายเหตุ

- Task ที่มีเครื่องหมาย `*` เป็น optional สามารถข้ามได้สำหรับ MVP ที่เร็วขึ้น
- ทุก task อ้างอิง requirements เฉพาะเพื่อให้ตรวจสอบย้อนกลับได้
- Checkpoint ช่วยให้ตรวจสอบความถูกต้องเป็นระยะ
- Property tests ตรวจสอบ universal correctness properties
- Unit tests ตรวจสอบตัวอย่างเฉพาะและ edge cases
