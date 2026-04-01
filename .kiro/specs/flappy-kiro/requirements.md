# เอกสารข้อกำหนด (Requirements Document)

## บทนำ

Flappy Kiro เป็นเกมแนว endless scroller สไตล์เรโทรที่รันบนเบราว์เซอร์ ผู้เล่นควบคุมตัวละครผี (Ghosty) ให้บินหลบท่อสีเขียวที่เลื่อนเข้ามาจากด้านขวาของหน้าจอ เกมใช้ HTML5 Canvas สำหรับการเรนเดอร์ มีเอฟเฟกต์เสียง กระดานคะแนน และกราฟิกสไตล์วาดมือ/เรโทร

## อภิธานศัพท์ (Glossary)

- **Game_Engine**: ระบบหลักที่จัดการ game loop, การอัปเดตสถานะ และการเรนเดอร์กราฟิกบน HTML5 Canvas
- **Ghosty**: ตัวละครผีที่ผู้เล่นควบคุม โหลดจากไฟล์ assets/ghosty.png
- **Pipe_Pair**: คู่ท่อสีเขียว (ท่อบนและท่อล่าง) ที่มีช่องว่างตรงกลางให้ Ghosty บินผ่าน แต่ละท่อมีหัวท่อ (cap) ที่ปลาย
- **Score_Board**: แถบแสดงคะแนนด้านล่างหน้าจอ แสดงคะแนนปัจจุบัน (Score) และคะแนนสูงสุด (High)
- **Cloud**: ก้อนเมฆสีขาวมุมมนที่ลอยเป็น decoration บนพื้นหลัง
- **Audio_Manager**: ระบบจัดการเอฟเฟกต์เสียงของเกม (jump.wav และ game_over.wav)
- **Collision_Detector**: ระบบตรวจจับการชนระหว่าง Ghosty กับ Pipe_Pair, พื้น และเพดาน
- **Input_Handler**: ระบบรับอินพุตจากผู้เล่น (คลิกเมาส์, แตะหน้าจอ, กด Spacebar)

## ข้อกำหนด (Requirements)

### ข้อกำหนดที่ 1: การเรนเดอร์พื้นหลังและ Canvas

**User Story:** ในฐานะผู้เล่น ฉันต้องการเห็นพื้นหลังสีฟ้าอ่อนสไตล์เรโทร เพื่อให้เกมมีบรรยากาศวาดมือที่น่าเล่น

#### เกณฑ์การยอมรับ (Acceptance Criteria)

1. THE Game_Engine SHALL เรนเดอร์ Canvas ที่มีพื้นหลังสีฟ้าอ่อนแบบ textured สไตล์วาดมือ
2. THE Game_Engine SHALL ปรับขนาด Canvas ให้เต็มพื้นที่หน้าต่างเบราว์เซอร์
3. THE Game_Engine SHALL เรนเดอร์เฟรมด้วย requestAnimationFrame เพื่อให้ภาพเคลื่อนไหวลื่นไหล

### ข้อกำหนดที่ 2: ตัวละคร Ghosty

**User Story:** ในฐานะผู้เล่น ฉันต้องการควบคุมตัวละครผีให้กระโดดขึ้น เพื่อหลบท่อและเล่นเกมได้

#### เกณฑ์การยอมรับ (Acceptance Criteria)

1. THE Game_Engine SHALL แสดง Ghosty โดยโหลดภาพจากไฟล์ assets/ghosty.png
2. THE Game_Engine SHALL ใช้แรงโน้มถ่วงดึง Ghosty ลงด้านล่างอย่างต่อเนื่องในแต่ละเฟรม
3. WHEN ผู้เล่นกระทำอินพุต, THE Input_Handler SHALL ให้แรงกระโดดขึ้นแก่ Ghosty ทำให้ Ghosty เคลื่อนที่ขึ้นด้านบน
4. THE Game_Engine SHALL จำกัดตำแหน่งของ Ghosty ให้อยู่ภายในขอบเขตของ Canvas (ไม่เกินเพดานและพื้น)

### ข้อกำหนดที่ 3: ระบบรับอินพุต

**User Story:** ในฐานะผู้เล่น ฉันต้องการใช้คลิกเมาส์ แตะหน้าจอ หรือกด Spacebar เพื่อควบคุม Ghosty ได้อย่างสะดวก

#### เกณฑ์การยอมรับ (Acceptance Criteria)

1. WHEN ผู้เล่นคลิกเมาส์บน Canvas, THE Input_Handler SHALL ส่งคำสั่งกระโดดไปยัง Ghosty
2. WHEN ผู้เล่นแตะหน้าจอบน Canvas, THE Input_Handler SHALL ส่งคำสั่งกระโดดไปยัง Ghosty
3. WHEN ผู้เล่นกดปุ่ม Spacebar, THE Input_Handler SHALL ส่งคำสั่งกระโดดไปยัง Ghosty
4. WHILE เกมอยู่ในสถานะ Game Over, THE Input_Handler SHALL ตีความอินพุตเป็นคำสั่งเริ่มเกมใหม่แทนคำสั่งกระโดด

### ข้อกำหนดที่ 4: ท่อ (Pipes)

**User Story:** ในฐานะผู้เล่น ฉันต้องการเห็นท่อสีเขียวเลื่อนเข้ามาเป็นอุปสรรค เพื่อให้เกมมีความท้าทาย

#### เกณฑ์การยอมรับ (Acceptance Criteria)

1. THE Game_Engine SHALL สร้าง Pipe_Pair ใหม่เป็นระยะ โดยแต่ละคู่ประกอบด้วยท่อบนและท่อล่างที่มีช่องว่างตรงกลาง
2. THE Game_Engine SHALL เรนเดอร์ Pipe_Pair เป็นสีเขียวพร้อมหัวท่อ (cap) ที่ปลายด้านที่หันเข้าหาช่องว่าง
3. THE Game_Engine SHALL เลื่อน Pipe_Pair จากขวาไปซ้ายด้วยความเร็วคงที่
4. WHEN Pipe_Pair เลื่อนออกนอกขอบซ้ายของ Canvas, THE Game_Engine SHALL ลบ Pipe_Pair นั้นออกจากหน่วยความจำ
5. THE Game_Engine SHALL สุ่มตำแหน่งแนวตั้งของช่องว่างใน Pipe_Pair แต่ละคู่ภายในขอบเขตที่เล่นได้

### ข้อกำหนดที่ 5: การตรวจจับการชน

**User Story:** ในฐานะผู้เล่น ฉันต้องการให้เกมตรวจจับการชนอย่างถูกต้อง เพื่อให้เกมยุติธรรมและสมจริง

#### เกณฑ์การยอมรับ (Acceptance Criteria)

1. WHEN Ghosty ชนกับ Pipe_Pair, THEN THE Collision_Detector SHALL แจ้ง Game_Engine ให้จบเกม
2. WHEN Ghosty ตกถึงพื้น Canvas, THEN THE Collision_Detector SHALL แจ้ง Game_Engine ให้จบเกม
3. WHEN Ghosty ชนเพดาน Canvas, THEN THE Collision_Detector SHALL แจ้ง Game_Engine ให้จบเกม
4. THE Collision_Detector SHALL ใช้ bounding box ของ Ghosty และ Pipe_Pair ในการตรวจจับการชน

### ข้อกำหนดที่ 6: ระบบคะแนน

**User Story:** ในฐานะผู้เล่น ฉันต้องการเห็นคะแนนปัจจุบันและคะแนนสูงสุด เพื่อติดตามความก้าวหน้าและท้าทายตัวเอง

#### เกณฑ์การยอมรับ (Acceptance Criteria)

1. WHEN Ghosty บินผ่าน Pipe_Pair สำเร็จ, THE Score_Board SHALL เพิ่มคะแนนปัจจุบันขึ้น 1 คะแนน
2. THE Score_Board SHALL แสดงคะแนนปัจจุบัน (Score) และคะแนนสูงสุด (High) ในแถบด้านล่างของ Canvas ด้วยพื้นหลังสีเข้ม
3. WHEN เกมจบ, THE Score_Board SHALL อัปเดตคะแนนสูงสุดหากคะแนนปัจจุบันมากกว่าคะแนนสูงสุดเดิม
4. THE Score_Board SHALL บันทึกคะแนนสูงสุดลง localStorage เพื่อให้คงอยู่เมื่อปิดเบราว์เซอร์
5. WHEN เกมเริ่มใหม่, THE Score_Board SHALL รีเซ็ตคะแนนปัจจุบันเป็น 0 และโหลดคะแนนสูงสุดจาก localStorage

### ข้อกำหนดที่ 7: เอฟเฟกต์เสียง

**User Story:** ในฐานะผู้เล่น ฉันต้องการได้ยินเสียงเอฟเฟกต์เมื่อกระโดดและเมื่อเกมจบ เพื่อให้เกมมีความสนุกและมีชีวิตชีวา

#### เกณฑ์การยอมรับ (Acceptance Criteria)

1. WHEN Ghosty กระโดด, THE Audio_Manager SHALL เล่นเสียง assets/jump.wav
2. WHEN เกมจบ, THE Audio_Manager SHALL เล่นเสียง assets/game_over.wav
3. THE Audio_Manager SHALL โหลดไฟล์เสียงล่วงหน้า (preload) เมื่อเกมเริ่มต้น

### ข้อกำหนดที่ 8: ก้อนเมฆ (Clouds)

**User Story:** ในฐานะผู้เล่น ฉันต้องการเห็นก้อนเมฆสีขาวลอยผ่านพื้นหลัง เพื่อให้เกมมีบรรยากาศสวยงามและมีชีวิตชีวา

#### เกณฑ์การยอมรับ (Acceptance Criteria)

1. THE Game_Engine SHALL เรนเดอร์ Cloud สีขาวมุมมนหลายก้อนบนพื้นหลัง
2. THE Game_Engine SHALL เลื่อน Cloud จากขวาไปซ้ายด้วยความเร็วที่ช้ากว่า Pipe_Pair เพื่อสร้างเอฟเฟกต์ parallax
3. WHEN Cloud เลื่อนออกนอกขอบซ้ายของ Canvas, THE Game_Engine SHALL สร้าง Cloud ใหม่ที่ขอบขวาด้วยตำแหน่งแนวตั้งแบบสุ่ม

### ข้อกำหนดที่ 9: สถานะเกม (Game States)

**User Story:** ในฐานะผู้เล่น ฉันต้องการให้เกมมีหน้าจอเริ่มต้นและหน้าจอ Game Over เพื่อให้ประสบการณ์การเล่นสมบูรณ์

#### เกณฑ์การยอมรับ (Acceptance Criteria)

1. WHILE เกมอยู่ในสถานะรอเริ่ม (Idle), THE Game_Engine SHALL แสดงข้อความแนะนำให้ผู้เล่นคลิก/แตะ/กด Spacebar เพื่อเริ่มเกม
2. WHEN ผู้เล่นกระทำอินพุตในสถานะ Idle, THE Game_Engine SHALL เปลี่ยนสถานะเป็น Playing และเริ่ม game loop
3. WHEN เกมจบ, THE Game_Engine SHALL เปลี่ยนสถานะเป็น Game Over และแสดงข้อความ "Game Over" บนหน้าจอ
4. WHEN ผู้เล่นกระทำอินพุตในสถานะ Game Over, THE Game_Engine SHALL รีเซ็ตเกมและเปลี่ยนสถานะเป็น Playing
