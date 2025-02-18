# 📌 Expense Tracker API

API สำหรับจัดการรายรับรายจ่าย พัฒนาโดยใช้ **Node.js**, **MongoDB** และ **Docker**

---

## 📌 Requirements

ก่อนเริ่มต้นใช้งาน ต้องมีเครื่องมือต่อไปนี้ติดตั้งไว้บนเครื่อง:
- **Docker** 
- **Node.js** 
- **MongoDB** 

---

## ⚡ Setup & Installation

### **1️⃣ Clone Repository**
ดาวน์โหลดซอร์สโค้ดจาก GitHub
```sh
git clone <repository-url>
cd <project-folder>
```

### **2️⃣ ติดตั้ง Dependencies**
```sh
npm install
```

### **3️⃣ ตั้งค่า Environment Variables**
#### 🔹 **สร้างไฟล์ `.env`**
คัดลอกไฟล์ `.env.example` และเปลี่ยนชื่อเป็น `.env` จากนั้นแก้ไขค่าภายในให้เหมาะสมกับการใช้งาน
```sh
cp .env.example .env
```

#### 🔹 **(สำหรับการทดสอบ) สร้างไฟล์ `.env.test`**
หากต้องการทดสอบ **Unit Test** ให้สร้างไฟล์ `.env.test` และใช้ค่าเดียวกันกับ `.env.example` หรือ `.env`
```sh
cp .env.example .env.test
```

---

### **4️⃣ เริ่มต้นใช้งาน**
รันโปรเจกต์โดยใช้ **Docker Compose**
```sh
docker-compose up
```

หรือหากต้องการรันใน background mode:
```sh
docker-compose up -d
```

รันโปรเจกต์บน Local:
หากต้องการรันโดยไม่ใช้ Docker สามารถใช้คำสั่งนี้ได้:
```sh
npm run dev
```

---

## 🚀 API Usage
หลังจากรันสำเร็จแล้ว API จะพร้อมใช้งานที่:
🔗 `http://localhost:3000`

สามารถทดสอบ API ผ่าน **Postman** หรือ **cURL** ได้เลย ซึ่งผมได้เตรียมไฟล์ Postman ที่ชื่อว่า `ExpenseTrackerAPI.postman_collection` เอาไว้ให้แล้ว สามารถนำไปใช้ได้เลยครับ

---

## 🧪 Running Tests
หากต้องการทดสอบโค้ด (Unit Test) ให้ใช้คำสั่งนี้:
```sh
npm test
```

---

## 🛑 Stopping the Server
หากต้องการหยุดเซิร์ฟเวอร์ที่รันผ่าน Docker Compose:
```sh
docker-compose down
```

---

## 📌 หมายเหตุ
- หากมีปัญหาเกี่ยวกับ Docker ให้ลองรันคำสั่ง `docker-compose down` ก่อน แล้วลองใหม่

