# CLAUDE.md — Mockup UI

บริบทของโปรเจกต์สำหรับ Claude Code (ภาษาที่ใช้คุยกับผู้ใช้: ไทย)

## ภาพรวม

Mockup UI ฝั่ง **Front end อย่างเดียว** (ไม่มี backend) ใช้ทำต้นแบบหน้าจอไว้นำเสนอ
- หน้าแรกเป็นหน้า **เลือกโปรเจกต์**: สร้าง ค้นหา และลบโปรเจกต์ได้
- แต่ละโปรเจกต์เลือก **template (หน้าตา)** และ **สีหลัก** ของตัวเองได้
- ข้อมูลทั้งหมดเป็น mock และเก็บใน `localStorage` (key: `mockup-ui.projects`)
- ข้อความบน UI เป็นภาษาไทยทั้งหมด ใช้ฟอนต์ IBM Plex Sans Thai จาก Google Fonts

## Stack

- React 19 + TypeScript 7 + Vite 8
- Tailwind CSS v4 ผ่าน `@tailwindcss/vite` (**ไม่มี** `tailwind.config.js` ตั้งค่า theme ใน `src/index.css`)
- react-router-dom v7 และ lucide-react (ไอคอน)
- Node.js 20 ขึ้นไป

## คำสั่ง

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc -b && vite build — ต้องผ่านทุกครั้งหลังแก้โค้ด
```

## โครงสร้าง

```
src/
├── main.tsx                   # BrowserRouter > ProjectProvider > App
├── App.tsx                    # routes: "/" = ProjectList, "/p/:projectId/*" = ProjectShell
├── index.css                  # Tailwind + @theme (ฟอนต์, สี brand-*)
├── components/                # ใช้ร่วมกัน: PageHeader, StatusBadge
├── projects/
│   ├── ProjectContext.tsx     # type Project, state รายการโปรเจกต์, seed 3 โปรเจกต์, add/remove/reset
│   ├── ProjectList.tsx        # หน้าแรก (การ์ดโปรเจกต์ ค้นหา ลบแบบยืนยันในการ์ด)
│   ├── CreateProjectModal.tsx # ฟอร์มสร้างโปรเจกต์ (ชื่อ คำอธิบาย template สี)
│   ├── ProjectShell.tsx       # map template → Layout และใส่ CSS vars สีของโปรเจกต์
│   ├── TemplatePreview.tsx    # ภาพย่อของแต่ละ template (วาดด้วย div)
│   ├── themes.ts              # TemplateId, ColorId, templates, colors, brandVars()
│   └── useProjectBase.ts      # คืนค่า "/p/<projectId>" สำหรับทำลิงก์ภายในโปรเจกต์
└── templates/
    ├── types.ts               # LayoutProps { project, base }
    ├── admin/                 # ระบบหลังบ้าน: Sidebar, Topbar, Dashboard, Users, UserForm, Settings, mock.ts
    ├── kanban/KanbanLayout.tsx# บอร์ดงาน ลากการ์ดด้วย HTML5 drag & drop และเพิ่มงานได้
    └── store/StoreLayout.tsx  # หน้าร้าน: banner, หมวดหมู่, กริดสินค้า, ตะกร้าแบบ drawer
```

## ระบบสีของโปรเจกต์ (สำคัญ)

- ใน template ให้ใช้คลาส `brand-50 / 100 / 500 / 600 / 700` เท่านั้น เช่น `bg-brand-600` หรือ `text-brand-700` **ห้าม hardcode** สีหลักอย่าง `indigo-600`
- `index.css` ประกาศ `--color-brand-*` ใน `@theme inline` ให้ชี้ไปที่ CSS vars `--brand-*`
- `ProjectShell` ครอบ layout ด้วย `style={brandVars(project.color)}` ค่าสีจึงเปลี่ยนตามโปรเจกต์
- หน้า ProjectList ใช้สี indigo ตายตัวเพราะอยู่นอกโปรเจกต์ ส่วนการ์ดแต่ละใบครอบด้วย `brandVars` ของโปรเจกต์นั้น
- สีที่มีตอนนี้: indigo, emerald, rose, amber, sky, violet, charcoal (เทาดำ)

## วิธีทำงานที่ทำบ่อย

**เพิ่มสี**: แก้ `src/projects/themes.ts` 2 จุด
1. เพิ่มชื่อสีใน `ColorId`
2. เพิ่มใน `colors` พร้อม `shades` 5 ค่า เรียงจากอ่อนไปเข้ม ตรงกับเฉด 50/100/500/600/700

ตัวเลือกสีในหน้าต่างสร้างโปรเจกต์จะขึ้นเอง ถ้าเป็นสีเข้ม ให้ตรวจ Sidebar ของ admin ด้วย (ตอนนี้เมนูที่เลือกมี `ring-white/20` ไว้แล้ว)

**เพิ่ม template ใหม่**
1. สร้าง `src/templates/<ชื่อ>/<ชื่อ>Layout.tsx` ที่ export default component รับ `LayoutProps`
2. เพิ่ม id ใน `TemplateId` และข้อมูลใน `templates` ที่ `themes.ts`
3. เพิ่มใน object `layouts` ที่ `ProjectShell.tsx`
4. เพิ่มภาพย่อใน `TemplatePreview.tsx`
5. ถ้ามีหลายหน้า ให้ใช้ `<Routes>` ซ้อนด้วย path แบบ relative (ดู `AdminLayout.tsx`) และทำลิงก์ด้วย `base` หรือ `useProjectBase()`
6. ทุก layout ต้องมีปุ่มกลับ `<Link to="/">`

**เพิ่มหน้าใน template admin**: สร้างไฟล์ใน `templates/admin/` แล้วเพิ่ม `<Route>` ใน `AdminLayout.tsx` และเพิ่มเมนูใน `nav` ของ `Sidebar.tsx` (ค่า `to` เป็น path ต่อท้าย `base` เช่น `'/reports'`)

**เพิ่มโปรเจกต์ตัวอย่าง**: แก้ `seed` ใน `ProjectContext.tsx` ถ้าผู้ใช้เคยเปิดเว็บแล้ว ต้องล้าง localStorage หรือลบโปรเจกต์ทั้งหมดแล้วกด "คืนค่าโปรเจกต์ตัวอย่าง" ก่อน seed ใหม่จึงจะขึ้น

## แนวทางเขียนโค้ด

- ใช้ function component + hooks และ TypeScript strict
- ใช้ Tailwind utility ใน JSX ตรง ๆ ไม่ใช้ไฟล์ CSS แยก
- ข้อความ UI และคอมเมนต์ในโค้ดเป็นภาษาไทย
- ต้องรองรับมือถือ (responsive): admin มี sidebar แบบ off-canvas ตอน < md
- mock data ให้อยู่ใกล้ template ที่ใช้ เช่น `templates/admin/mock.ts` หรือเป็นค่าคงที่ในไฟล์ layout
- ปุ่มที่ยังไม่มีฟังก์ชัน (ตัวกรอง, แก้ไข/ลบในตาราง, ชำระเงิน) เป็น placeholder ของ mockup

## สถานะและหมายเหตุ

- โฟลเดอร์ `_to_delete/` เป็นไฟล์เก่าก่อนปรับโครงสร้าง ไม่ได้ใช้แล้ว ลบทิ้งได้
- tab "รายการ" และ "ปฏิทิน" ใน kanban ยังเป็นแค่ตัวแสดง ยังไม่มีหน้าจริง
- งานที่อาจทำต่อ: แก้ไขชื่อหรือสีของโปรเจกต์หลังสร้าง, template ใหม่ (เช่น ระบบจองห้อง หรือ Landing page), ให้ข้อมูล mock ของแต่ละโปรเจกต์แยกกันและบันทึกได้, dark mode
