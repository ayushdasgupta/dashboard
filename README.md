# 🌍 Geo-Temporal Weather Dashboard

An interactive, map-based dashboard built with **React / Next.js + TypeScript** that allows users to:

- Select time ranges using a timeline slider
- Draw polygonal regions on a map
- Visualize and color-code weather data from Open-Meteo API
- Explore insights using dynamic charts and graphs

> Inspired by: [lighthearted-strudel-97caae.netlify.app](https://lighthearted-strudel-97caae.netlify.app)

---

## 📦 Features

### 🕒 1. Timeline Slider (30-Day Window)
- Select a specific **hour** or a **range of hours**
- 15 days before and after today (hourly resolution)
- Drag handles to change the time selection
- Triggers dynamic map and chart updates

---

### 🗺️ 2. Interactive Map
- Built with **Leaflet** or **Mapbox GL**
- Fixed zoom resolution (~2 sq. km)
- Draw polygons with:
  - Minimum 3 points, maximum 12
  - Color rules per polygon
  - Polygons persist when panning
- Optional features:
  - Edit polygon vertices
  - Rename polygons

---

### 📊 3. Data Visualizations (Charts)
All charts shown in the [reference site](https://lighthearted-strudel-97caae.netlify.app) are supported:

- ✅ Line Chart
- ✅ Bar Chart
- ✅ Stacked Bar Chart
- ✅ Area Chart
- ✅ Stacked Area Chart
- ✅ Radar Chart
- ✅ Donut / Pie Chart
- ✅ Gauge / Circular Progress
- ✅ Time-Series Temperature Chart

Charts update in real time when timeline or data changes.

---

### 🧪 4. Weather Data Source (Open-Meteo API)
- Fetch hourly weather data using the [Open-Meteo Archive API](https://open-meteo.com/en/docs)
- Query by polygon **centroid** or **bounding box**
- Supports field: `temperature_2m` (by default)
- Example API:
[reference api](https://archive-api.open-meteo.com/v1/archive?latitude=22.57&longitude=88.36&start_date=2025-07-18&end_date=2025-08-01&hourly=temperature_2m)


---

### 🎛️ 5. Sidebar Controls
- Select data source (e.g., `temperature_2m`)
- Add custom **threshold color rules** per polygon:
- Example: `temperature > 35 → red`
- Choose color with a visual picker
- Excel/Sheets-like rule management

---

### ♻️ 6. Dynamic Updates
- Any change in:
- Timeline range
- Polygon draw/edit/delete
- Color thresholds
- Triggers:
- Data fetching
- Rule evaluation
- Map and chart re-render

---

## 🔁 Bonus Features (Optional Enhancements)
| Feature | Description |
|--------|-------------|
| 🌀 Timeline Animation | Animate polygon color changes as the slider moves |
| 🧠 Persist State | Save drawn polygons and thresholds in localStorage |
| ⚡ API Caching | Avoid redundant fetches with a smart cache |
| 💬 Tooltips & Legends | Show temperature value on hover + color legend |
| 🌐 Multiple Data Sources | Add support for other fields like `humidity`, `wind_speed`, etc. |
| 📱 Responsive Design | Works on both desktop and mobile |

---

## 🧱 Tech Stack

| Area | Stack |
|------|-------|
| Framework |  [Next.js](https://nextjs.org/), [TypeScript](https://www.typescriptlang.org/) |
| Maps | [React Leaflet](https://react-leaflet.js.org/) |
| Charts | [Recharts](https://recharts.org/)|
| UI | [Tailwind CSS](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/) |
| Data | [Open-Meteo API](https://open-meteo.com/) |
| Fetching | [React Query](https://tanstack.com/query/v4) |

---

## Demo

[Live Link](https://dashboard-seven-eosin-28.vercel.app/)


## 🚀 Getting Started

```bash
git clone https://github.com/ayushdasgupta/dashboard
cd dashboard
pnpm install
pnpm dev
```
- Visit http://localhost:3000
- Start drawing polygons and visualizing weather!

## Author
- [@ayushdasgupta](https://www.github.com/ayushdasgupta)
- Backend Developer | Frontend Developer  |  Fullstack Engineer

