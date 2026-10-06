# Mockup UI

Mockup ฝั่ง Front end สร้างด้วย **React + TypeScript + Vite + Tailwind CSS**

หน้าแรกเป็นหน้าเลือกโปรเจกต์ สร้างโปรเจกต์ใหม่ได้ และแต่ละโปรเจกต์เลือกหน้าตา (template) กับสีหลักของตัวเองได้

## วิธีรัน

ต้องติดตั้ง [Node.js](https://nodejs.org) (เวอร์ชัน 20 ขึ้นไป) ก่อน แล้วเปิด Terminal ในโฟลเดอร์นี้

```bash
npm install     # ติดตั้ง package (ทำครั้งแรกครั้งเดียว)
npm run dev     # เปิดเซิร์ฟเวอร์ แล้วเข้า http://localhost:5173
```

## Template ที่มีให้เลือก

| Template | หน้าตา |
|---|---|
| `admin`  | ระบบหลังบ้าน: เมนูด้านข้าง แดชบอร์ด ตารางผู้ใช้ ฟอร์ม ตั้งค่า |
| `kanban` | บอร์ดจัดการงาน: ลากการ์ดย้ายคอลัมน์ได้ เพิ่มงานได้ |
| `store`  | หน้าร้านออนไลน์: กริดสินค้า หมวดหมู่ ตะกร้าสินค้า |

โปรเจกต์ที่สร้างจะถูกเก็บไว้ใน localStorage ของเบราว์เซอร์ (ยังไม่มี backend)

## โครงสร้าง

```
src/
├── App.tsx                    # routing: "/" = เลือกโปรเจกต์, "/p/:projectId/*" = ภายในโปรเจกต์
├── projects/
│   ├── ProjectList.tsx        # หน้าแรก เลือก/ค้นหา/ลบโปรเจกต์
│   ├── CreateProjectModal.tsx # หน้าต่างสร้างโปรเจกต์ใหม่
│   ├── ProjectContext.tsx     # เก็บรายการโปรเจกต์ + โปรเจกต์ตัวอย่าง
│   ├── ProjectShell.tsx       # เลือก layout ตาม template ของโปรเจกต์
│   ├── TemplatePreview.tsx    # ภาพย่อของแต่ละ template
│   └── themes.ts              # รายชื่อ template และชุดสี
├── templates/
│   ├── admin/                 # template ระบบหลังบ้าน
│   ├── kanban/                # template บอร์ดงาน
│   └── store/                 # template หน้าร้าน
└── components/                # component ที่ใช้ร่วมกัน
```

## เพิ่ม template ใหม่

1. สร้างโฟลเดอร์ใน `src/templates/` พร้อมไฟล์ layout ที่รับ `LayoutProps`
2. เพิ่มชื่อใน `TemplateId` และ `templates` ที่ `src/projects/themes.ts`
3. ผูก layout ใน `layouts` ที่ `src/projects/ProjectShell.tsx`
4. (ไม่บังคับ) เพิ่มภาพย่อใน `TemplatePreview.tsx`

ใช้คลาส `bg-brand-600`, `text-brand-700` ฯลฯ เพื่อให้สีเปลี่ยนตามที่โปรเจกต์เลือก
