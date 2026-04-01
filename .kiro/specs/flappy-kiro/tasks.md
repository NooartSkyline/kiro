# แผนการ Implement: Flappy Kiro

## ภาพรวม

Implement เกม Flappy Kiro เป็น vanilla HTML/CSS/JS บน HTML5 Canvas โดยแบ่งงานเป็นขั้นตอนที่ต่อเนื่องกัน เริ่มจากโครงสร้างโปรเจกต์และ core logic ไปจนถึงการ wire ทุกอย่างเข้าด้วยกัน ใช้ Vitest + fast-check สำหรับ property-based testing

## Tasks

- [x] 1. ตั้งค่าโครงสร้างโปรเจกต์และ game constants
  - [x] 1.1 สร้างไฟล์ `index.html` พร้อม canvas element และโหลด `game.js`
    - สร้าง HTML boilerplate ที่มี `<canvas>` เต็มหน้าจอ
    - ตั้งค่า CSS ให้ canvas เต็มพื้นที่หน้าต่าง (margin: 0, overflow: hidden)
    - _Requirements: 1.1, 1.2_
  - [x] 1.2 สร้างไฟล์ `game.js` พร้อม game constants (CONFIG) และ GameState enum
    - กำหนดค่าคงที่ทั้งหมดตาม design: GRAVITY, FLAP_STRENGTH, PIPE_WIDTH, PIPE_GAP, PIPE_SPEED ฯลฯ
    - กำหนด GameState object: IDLE, PLAYING, GAME_OVER
    - Export ฟังก์ชันที่จำเป็นสำหรับ testing
    - _Requirements: 9.1_
  - [x] 1.3 ตั้งค่า Vitest และ fast-check สำหรับ testing
    - สร้าง `package.json` พร้อม devDependencies: vitest, fast-check
    - สร้าง `vitest.config.js`
    - สร้างโครงสร้างโฟลเดอร์ `tests/`
    - _Requirements: ทุกข้อ (testing infrastructure)_

- [x] 2. Implement Ghosty physics (ฟิสิกส์ตัวละคร)
  - [x] 2.1 Implement ฟังก์ชัน `updateGhosty`, `flapGhosty`, `clampGhosty`
    - `updateGhosty(ghosty, gravity)`: เพิ่ม gravity เข้า velocity แล้วเพิ่ม velocity เข้า y
    - `flapGhosty(ghosty, flapStrength)`: ตั้ง velocity เป็น flapStrength (ค่าลบ)
    - `clampGhosty(ghosty, canvasHeight, scoreBarHeight)`: จำกัด y ให้อยู่ในขอบเขต [0, canvasHeight - scoreBarHeight - height]
    - _Requirements: 2.2, 2.3, 2.4_
  - [ ]* 2.2 เขียน property test: แรงโน้มถ่วงเพิ่ม velocity ลงเสมอ
    - **Property 1: แรงโน้มถ่วงเพิ่ม velocity ลงเสมอ**
    - **Validates: Requirements 2.2**
  - [ ]* 2.3 เขียน property test: Flap ตั้งค่า velocity เป็นค่าลบ
    - **Property 2: Flap ตั้งค่า velocity เป็นค่าลบ**
    - **Validates: Requirements 2.3**
  - [ ]* 2.4 เขียน property test: Clamp จำกัด Ghosty ในขอบเขต Canvas
    - **Property 3: Clamp จำกัด Ghosty ในขอบเขต Canvas**
    - **Validates: Requirements 2.4**

- [x] 3. Implement ระบบท่อ (Pipe System)
  - [x] 3.1 Implement ฟังก์ชัน `createPipe`, `updatePipes`, `removeOffscreenPipes`
    - `createPipe(canvasWidth, canvasHeight, gapHeight, scoreBarHeight)`: สร้าง PipePair ใหม่ที่ขอบขวา สุ่ม gapY ในขอบเขตที่เล่นได้
    - `updatePipes(pipes, speed, deltaTime)`: ลด x ของทุก pipe ตาม speed * deltaTime
    - `removeOffscreenPipes(pipes)`: กรอง pipe ที่ x + width < 0 ออก
    - _Requirements: 4.1, 4.3, 4.4, 4.5_
  - [ ]* 3.2 เขียน property test: Pipe gap อยู่ในขอบเขตที่เล่นได้
    - **Property 5: Pipe gap อยู่ในขอบเขตที่เล่นได้**
    - **Validates: Requirements 4.1, 4.5**
  - [ ]* 3.3 เขียน property test: Pipe เลื่อนซ้ายตาม speed
    - **Property 6: Pipe เลื่อนซ้ายตาม speed**
    - **Validates: Requirements 4.3**
  - [ ]* 3.4 เขียน property test: Pipe นอกจอถูกลบออก
    - **Property 7: Pipe นอกจอถูกลบออก**
    - **Validates: Requirements 4.4**

- [x] 4. Implement Collision Detection (ตรวจจับการชน)
  - [x] 4.1 Implement ฟังก์ชัน `boxesOverlap` และ `checkCollision`
    - `boxesOverlap(a, b)`: ตรวจสอบ AABB overlap ระหว่าง 2 bounding box
    - `checkCollision(ghosty, pipes, canvasHeight, scoreBarHeight)`: ตรวจสอบการชนกับท่อ, พื้น, และเพดาน
    - _Requirements: 5.1, 5.2, 5.3, 5.4_
  - [ ]* 4.2 เขียน property test: Bounding box collision detection ถูกต้อง
    - **Property 8: Bounding box collision detection ถูกต้อง**
    - **Validates: Requirements 5.1, 5.4**

- [x] 5. Implement ระบบคะแนน (Score System)
  - [x] 5.1 Implement ฟังก์ชัน `createScoreBoard`, `incrementScore`, `updateHighScore`, `resetScore`, `saveHighScore`, `loadHighScore`
    - `incrementScore(scoreBoard)`: เพิ่มคะแนน +1
    - `updateHighScore(scoreBoard)`: ตั้ง highScore = Math.max(score, highScore)
    - `saveHighScore(highScore)`: บันทึกลง localStorage ด้วย key `flappyKiroHighScore`
    - `loadHighScore()`: โหลดจาก localStorage, คืน 0 ถ้าไม่มีหรือเสียหาย
    - `resetScore(scoreBoard)`: ตั้ง score = 0, คง highScore
    - _Requirements: 6.1, 6.3, 6.4, 6.5_
  - [ ]* 5.2 เขียน property test: คะแนนเพิ่มขึ้นทีละ 1
    - **Property 9: คะแนนเพิ่มขึ้นทีละ 1**
    - **Validates: Requirements 6.1**
  - [ ]* 5.3 เขียน property test: High score เป็นค่า max เสมอ
    - **Property 10: High score เป็นค่า max เสมอ**
    - **Validates: Requirements 6.3**
  - [ ]* 5.4 เขียน property test: High score round trip ผ่าน localStorage
    - **Property 11: High score round trip ผ่าน localStorage**
    - **Validates: Requirements 6.4**
  - [ ]* 5.5 เขียน property test: Reset คะแนนเป็น 0 และคง high score
    - **Property 12: Reset คะแนนเป็น 0 และคง high score**
    - **Validates: Requirements 6.5**

- [x] 6. Checkpoint — ตรวจสอบ core logic
  - ตรวจสอบว่า test ทั้งหมดผ่าน, ถามผู้ใช้หากมีข้อสงสัย

- [x] 7. Implement ระบบเมฆ (Cloud System)
  - [x] 7.1 Implement ฟังก์ชัน `createCloud`, `updateClouds`, `renderCloud`
    - `createCloud(canvasWidth, canvasHeight)`: สร้างเมฆใหม่ สุ่มตำแหน่ง/ขนาด/ความเร็ว กำหนด opacity ตามความเร็ว
    - `updateClouds(clouds, deltaTime, canvasWidth, canvasHeight)`: เลื่อนเมฆ + สร้างใหม่แทนเมฆที่ออกนอกจอ
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_
  - [ ]* 7.2 เขียน property test: Cloud opacity สัมพันธ์กับความเร็ว และน้อยกว่า 1
    - **Property 13: Cloud opacity สัมพันธ์กับความเร็ว และน้อยกว่า 1**
    - **Validates: Requirements 8.1, 8.4**
  - [ ]* 7.3 เขียน property test: Cloud เคลื่อนที่ช้ากว่า Pipe
    - **Property 14: Cloud เคลื่อนที่ช้ากว่า Pipe**
    - **Validates: Requirements 8.3**
  - [ ]* 7.4 เขียน property test: จำนวน Cloud คงที่หลัง update
    - **Property 15: จำนวน Cloud คงที่หลัง update**
    - **Validates: Requirements 8.5**

- [x] 8. Implement State Machine และ Input Handler
  - [x] 8.1 Implement ฟังก์ชัน state transition: `handleInput` ที่จัดการ Idle→Playing, Playing→flap, GameOver→reset
    - ใน Idle: เปลี่ยนเป็น Playing
    - ใน Playing: เรียก flapGhosty + เล่นเสียง jump
    - ใน GameOver: เรียก resetGame + เปลี่ยนเป็น Playing
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 9.2, 9.3, 9.4_
  - [x] 8.2 Implement `setupInputHandlers` สำหรับ click, touch, spacebar
    - ลงทะเบียน event listeners: mousedown, touchstart, keydown (Spacebar)
    - ทุก event เรียก `handleInput` callback เดียวกัน
    - _Requirements: 3.1, 3.2, 3.3_
  - [ ]* 8.3 เขียน property test: State machine transitions ถูกต้อง
    - **Property 4: State machine transitions ถูกต้อง**
    - **Validates: Requirements 3.4, 9.2, 9.3, 9.4**

- [x] 9. Implement Audio Manager
  - [x] 9.1 Implement ฟังก์ชัน `createAudioManager`, `playJumpSound`, `playGameOverSound`
    - Preload เสียง jump.wav และ game_over.wav
    - ใช้ try-catch และ .catch() สำหรับ error handling
    - _Requirements: 7.1, 7.2, 7.3_

- [x] 10. Implement Rendering (การวาดกราฟิก)
  - [x] 10.1 Implement ฟังก์ชัน render หลัก: วาดพื้นหลัง, เมฆ, ท่อ, Ghosty, Score Board
    - วาดพื้นหลังสีฟ้าอ่อน (#87CEEB)
    - วาดเมฆ semi-transparent มุมมน
    - วาดท่อสีเขียวพร้อมหัวท่อ (cap)
    - วาด Ghosty จากรูปภาพ (fallback เป็นวงกลมขาว)
    - วาดแถบคะแนนด้านล่าง
    - _Requirements: 1.1, 2.1, 4.2, 6.2, 8.1_
  - [x] 10.2 Implement หน้าจอ Idle และ Game Over
    - Idle: แสดงข้อความ "Click / Tap / Space to Start"
    - Game Over: แสดงข้อความ "Game Over" + คะแนน
    - _Requirements: 9.1, 9.3_

- [x] 11. Wire ทุกอย่างเข้าด้วยกัน — Game Loop
  - [x] 11.1 Implement `initGame` และ `gameLoop` ใน game.js
    - `initGame()`: สร้าง canvas, โหลด assets, ตั้งค่า input handlers, สร้าง initial state
    - `gameLoop(timestamp)`: คำนวณ deltaTime, เรียก update + render, เรียก requestAnimationFrame
    - ปรับขนาด canvas เมื่อ window resize
    - _Requirements: 1.2, 1.3_
  - [x] 11.2 Implement `update` function ที่ประสานทุก system
    - อัปเดต Ghosty physics
    - สร้างท่อใหม่ตาม interval, เลื่อนท่อ, ลบท่อนอกจอ
    - ตรวจจับการชน → เปลี่ยนสถานะเป็น Game Over
    - ตรวจสอบ scoring (Ghosty ผ่านท่อ)
    - อัปเดตเมฆ
    - _Requirements: 2.2, 4.1, 4.3, 5.1, 6.1, 8.3_

- [x] 12. Checkpoint สุดท้าย — ตรวจสอบทุกอย่าง
  - ตรวจสอบว่า test ทั้งหมดผ่าน, ถามผู้ใช้หากมีข้อสงสัย

## หมายเหตุ

- Task ที่มีเครื่องหมาย `*` เป็น optional สามารถข้ามได้สำหรับ MVP ที่เร็วขึ้น
- ทุก task อ้างอิง requirements เฉพาะเพื่อให้ตรวจสอบย้อนกลับได้
- Checkpoint ช่วยให้ตรวจสอบความถูกต้องเป็นระยะ
- Property tests ตรวจสอบ universal correctness properties
- Unit tests ตรวจสอบตัวอย่างเฉพาะและ edge cases
