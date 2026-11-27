# Hanoi WaterWatch: tổng quan toàn bộ website

Cập nhật ngày 28/11/2026, theo code trong thư mục `website/` trên máy (nhánh `final-website`, gồm cả các thay đổi chưa commit).

## Mục lục

1. [Giới thiệu](#1-giới-thiệu)
2. [Chạy, build và deploy](#2-chạy-build-và-deploy)
3. [Cấu trúc thư mục](#3-cấu-trúc-thư-mục)
4. [Sơ đồ trang và đường dẫn](#4-sơ-đồ-trang-và-đường-dẫn)
5. [Nội dung từng trang](#5-nội-dung-từng-trang)
6. [Live demo](#6-live-demo)
7. [Tính năng giao diện và tương tác](#7-tính-năng-giao-diện-và-tương-tác)
8. [Thiết kế hình ảnh](#8-thiết-kế-hình-ảnh)
9. [Kiến trúc kỹ thuật](#9-kiến-trúc-kỹ-thuật)
10. [Cách sửa nội dung](#10-cách-sửa-nội-dung)
11. [Tình trạng hiện tại và việc còn lại](#11-tình-trạng-hiện-tại-và-việc-còn-lại)

## 1. Giới thiệu

| Mục | Thông tin |
|---|---|
| Tên dự án | Hanoi WaterWatch |
| Loại | Website báo cáo cuối kỳ, kèm demo tương tác |
| Nhóm | Group One, 6 thành viên |
| Môn học | Communication for IT Professionals, tutorial 319265, thứ Ba 9:00–11:50 |
| Ngôn ngữ trên web | Tiếng Anh (trạm 3D mở riêng có thêm tiếng Việt) |
| Giới hạn độ dài | Báo cáo chính 4.000 từ; hiện khoảng 2.625 từ |

**Câu hỏi thiết kế:** *How might we detect untreated wastewater discharges into Hanoi's rivers in real time?*

**Giải pháp:** trạm cảm biến chạy năng lượng mặt trời đặt tại cửa xả cống, đo pH, oxy hoà tan (DO), độ đục và nhiệt độ mỗi 2 giây. Ba lần đo liên tiếp vượt ngưỡng thì báo cho cơ quan môi trường và người dân gần đó. Thanh tra lấy mẫu gửi phòng thí nghiệm trước khi phạt.

> Mọi số đo trong trạm 3D, simulator và demo điện thoại là **dữ liệu mô phỏng**, không phải số đo thực địa.

## 2. Chạy, build và deploy

Yêu cầu Node.js 22.12 trở lên và có Internet (font và three.js tải từ CDN).

```sh
cd website
npm ci
npm run dev        # http://localhost:5173
npm run build      # kiểm tra kiểu (tsc) rồi build ra website/dist/
npm run preview    # xem thử bản build
```

**Deploy trên Vercel:** đặt Root Directory là `website`, preset Vite. File [vercel.json](website/vercel.json) đã khai báo lệnh cài, lệnh build, thư mục `dist` và rewrite mọi đường dẫn về `index.html`.

## 3. Cấu trúc thư mục

### Toàn repo

| Thư mục | Nội dung |
|---|---|
| `website/` | Website báo cáo (tài liệu này nói về phần này) |
| `HanoiWaterWatch/` | Prototype nền tảng giám sát riêng: backend FastAPI, frontend, firmware, mô hình 3D, simulator độc lập. Website không cần thư mục này để chạy |
| `docs/website/` | Tóm tắt nội dung web ([summary.md](docs/website/summary.md)) và hai sổ đăng ký bằng chứng, hình ảnh |
| `docs/team/` | Quy trình làm việc với nhánh và pull request |
| `docs/archive/` | Ghi chú và bản nháp cũ, không còn mô tả code hiện tại |

Repository: `tuanchau832-ai/Final-Assignment`.

### Bên trong `website/`

```text
website/
  index.html              Điểm vào: font, mô tả trang, favicon, nạp theme đã lưu
  src/
    main.tsx, App.tsx     Gắn trang vào DOM, gọi initSite() rồi initUx()
    content/
      layout/             header.html (menu), footer.html (CTA, footer, nút lên đầu trang)
      pages/              mỗi trang một file HTML (sửa chữ ở đây)
      data.ts             tiêu chí, phương án, thiết bị và giá, vòng đời, thành viên
      index.ts            ghép layout và các trang theo thứ tự đọc
    scripts/
      site.ts             định tuyến, menu, hiệu ứng, biểu đồ, trung tâm live demo
      ux.ts               skip link, theme, thanh mục lục, trạng thái demo, tìm tài liệu, phóng hình
    scenes/
      mapScene.ts         bản đồ sông 3D ở banner trang chủ (canvas)
      riverScene.ts       hình động sông và đường chân trời ở đầu trang con, cuối trang
    styles/               index.css nạp các file CSS theo thứ tự
  public/
    embed/simulator/      simulator cảm biến ESP32
    embed/station/        trạm 3D (three.js)
    img/app-v1.jpg        mock-up app (Figure 2)
    favicon.svg
```

## 4. Sơ đồ trang và đường dẫn

Website là một trang duy nhất, chuyển mục bằng hash (`#trang` hoặc `#trang-mục`).

| Trang | Đường dẫn | Các mục bên trong |
|---|---|---|
| Home | `#home` | `#home-summary`, `#home-background`, `#home-problem` |
| Design | `#design` | `#design-criteria`, `#design-options`, `#design-selection` |
| Solution | `#solution` | `#solution-how`, `#solution-station`, `#solution-rules`, `#solution-demo`, `#solution-prototypes`, `#solution-testing` |
| Implementation | `#implementation` | `#implementation-plan`, `-owners`, `-cost`, `-risks`, `-lifecycle`, `-journey`, `-recommendations` |
| Team | `#team` | `#team-members`, `#team-declaration` |
| References | `#references` | |
| Appendices | `#appendices` | |
| Demo toàn màn hình | `#solution-live` | Chỉ hiện điện thoại và trạm 3D |

- **Menu trên cùng:** Home, Design, Solution, Implementation, Team, Resources (gồm References, Appendices).
- **Footer:** ba cột Report, Project, Course. Background và Problem mở từ đây.

## 5. Nội dung từng trang

### 5.1 Home

1. **Banner:** tên dự án, câu khẳng định, hai nút (Read the summary, Try the live demo), bốn số nhanh (3 trạm thí điểm, 2 giây mỗi lần đo, 3 lần xấu thì báo, lab kiểm trước khi phạt). Phía sau là bản đồ 3D: Sông Hồng, Đuống, Nhuệ, Tô Lịch, Kim Ngưu và 10 trạm minh hoạ. Lần lượt từng trạm phát hiện xả thải, chuyển đỏ, hiện vòng 1 km, điện thoại người dân đỏ lên, cơ quan nhận tin, thanh tra đi lấy mẫu, sông sạch lại.
2. **Summary:** câu hỏi thiết kế và bảng Problem, Solution, Who benefits, Pilot cost, Status.
3. **Why it matters:** bốn con số
   - 30% nước thải sinh hoạt hằng ngày của Hà Nội được xử lý (VnExpress, 2024)
   - 3,5% GDP Việt Nam có thể mất mỗi năm vào 2035 do ô nhiễm nước (Viet Nam News, 2019)
   - ₫75.115 tỷ được duyệt năm 2026 để phục hồi sông Nhuệ (Đại biểu Nhân dân, 2026)
   - 10–15 đợt nước thải Hà Nội xuống Hà Nam mỗi năm (Báo Pháp Luật, 2021)
4. **Background:** các sông Tô Lịch, Kim Ngưu, Nhuệ đang làm cống hở; 13/15 điểm quan trắc ô nhiễm nặng ở lưu vực Nhuệ–Đáy; kim loại Zn, Cr trong trầm tích.
5. **Problem:** câu nêu nhu cầu và bốn cặp nguyên nhân, hậu quả:

| Nguyên nhân | Hậu quả |
|---|---|
| Xét nghiệm định kỳ và chậm | Phát hiện ô nhiễm quá muộn |
| Cụm công nghiệp thiếu xử lý | Kim loại tích tụ trong sông |
| Dữ liệu nước ít công khai | Người dân dùng nước bẩn |
| Nhà và nhà máy chung cống | Cộng đồng gánh chi phí |

### 5.2 Design

**Design criteria** (6 tiêu chí, hiện dạng vòng tròn trọng số):

| Tiêu chí | Trọng số | Ý nghĩa |
|---|---|---|
| Timely | 25% | Phát hiện và báo trong vài phút, ngày lẫn đêm |
| Traceable | 20% | Mỗi số đo gắn với một cửa xả, thời gian và hồ sơ hiệu chuẩn |
| Reliable | 20% | Ít báo giả, đánh dấu số đo lỗi hoặc thiếu |
| Clear for residents | 15% | Tiếng Việt, màu kèm chữ và ký hiệu, người lớn tuổi đọc được |
| Durable | 10% | Chịu nước bẩn, rác, ngập; chạy điện mặt trời; lưu offline |
| Affordable | 10% | Đủ rẻ để phủ nhiều cửa xả, tính cả bảo trì |

**Solution options và Design selection** (điểm 1–5 nhân trọng số, tổng /100, thứ tự điểm theo bảng trên):

| Phương án | Điểm | Tổng | Ưu | Nhược |
|---|---|---|---|---|
| **A. Trạm cảm biến (được chọn)** | 5, 5, 4, 4, 3, 3 | **85** | Thời gian thực, truy được đến cửa xả | Chi phí đầu cao, đầu dò cần vệ sinh |
| B. Bộ test của dân và app | 2, 2, 2, 4, 5, 4 | 56 | Rẻ, dân tham gia | Không liên tục, chất lượng không đều |
| C. Lấy mẫu thủ công nhiều hơn | 1, 3, 5, 2, 4, 2 | 55 | Chính xác, được pháp lý chấp nhận | Tốn người, chậm |

Nhóm giữ lại ý hay của hai phương án còn lại: dân báo ô nhiễm bằng ảnh (từ B), mọi cảnh báo được lab xác nhận trước khi phạt (từ C). Người xem bấm từng phương án để xem điểm và lý do của từng tiêu chí.

### 5.3 Solution

| Mục | Nội dung |
|---|---|
| Detailed design | Năm bước: Sense → Check → Send → Alert → Confirm |
| Inside a station | Trạm 3D và 5 bộ phận: pin mặt trời 20 W; hộp điều khiển ESP32 + 4G; lồng đầu dò inox có chổi gạt; hộp khoá trên mực ngập; biển ID và mã QR |
| Alert rules | Ngưỡng theo QCVN 08:2023/BTNMT, kèm simulator cảm biến |
| Live demo | Demo điện thoại, ô trạng thái, nút điều khiển, nhật ký |
| Prototyping | Ba tab: P1 Sensor station (ESP32 trên Wokwi), P2 Map app (web app mobile, Việt–Anh, chữ lớn), P3 Station model (Tinkercad ghép ảnh bờ kè) |
| Testing | Bốn kịch bản: nước bình thường, xả đột ngột, một đột biến giả, trở lại bình thường; phần phản hồi và hạn chế |

| Chỉ số | Ngưỡng trên web |
|---|---|
| pH | Ngoài 6.0–8.5 |
| DO | Dưới 4 mg/L |
| Độ đục | Tăng 50% so với nền (QCVN không có giới hạn độ đục) |
| Nhiệt độ | Chỉ ghi lại để hiệu chỉnh |

Trong hai tuần đầu, mỗi trạm tự học mức nền của mình. Hạn chế được nêu rõ: simulator kiểm tra logic phát hiện, không kiểm tra độ chính xác cảm biến trong nước thật.

### 5.4 Implementation

| # | Mục | Nội dung chính |
|---|---|---|
| 1 | Rollout plan | Khảo sát và xin báo giá → lắp và thử trạm 1 → mua trạm 2, 3 nếu đạt → vận hành đến năm 3. Có cổng nghiệm thu 5 điều kiện |
| 2 | Operation | Đơn vị chủ quản, đơn vị vận hành, lab, phường và dân. 6 chuyến bảo trì chung, 18 lượt kiểm trạm, mục tiêu sửa 48 giờ |
| 3 | Cost analysis | Giá thiết bị đã có, danh sách còn chờ báo giá, link bằng chứng |
| 4 | Risks and community reaction | Số đo sai gần ngưỡng, bám bẩn và trôi, mệt mỏi cảnh báo, mất cắp hoặc ngập, nhà máy phản đối, khoảng cách số |
| 5 | Life cycle | Bánh xe 6 giai đoạn: Materials, Assembly, Transport, Installation, Use, End of life; mỗi giai đoạn có tác động, bên liên quan, cách ứng phó |
| 6 | Journey map | Kịch bản bà Lan, 58 tuổi, nuôi cá ở Thanh Trì: 02:00 xả thải → 02:01 phát hiện → 02:02 nhận SMS → 06:00 giữ được cá → ngày 2 lấy mẫu |
| 7 | Recommendations | Chốt báo giá và bên trả phí; thử 1 trạm ngoài thực địa; thống nhất vai trò pháp lý của dữ liệu; thử với người lớn tuổi; thêm cảm biến amoni; công khai và liên kết dữ liệu |

**Chi phí thiết bị cho một trạm** (giá niêm yết ghi ngày 19–25/11/2026, USD đổi theo ₫25.940):

| Thiết bị | Giá (₫) |
|---|---:|
| Cảm biến độ đục (SEN0710) | 5.940.260 |
| Cảm biến oxy hoà tan (SEN0680) | 4.428.000 |
| Bộ đầu dò pH công nghiệp (SEN0169-V2) | 1.683.506 |
| Modem 4G (SIM7600G-H-M.2) | 1.566.000 |
| Board ESP32 | 195.000 |
| Cảm biến nhiệt độ (DS18B20) | 35.000 |
| Bộ chuyển RS485 | 35.000 |
| Bốn đầu siết cáp | 12.700 |
| **Tổng một trạm** | **13.895.466** |

| Tổng hợp | Giá (₫) |
|---|---:|
| Trạm 2 và 3 | 27.790.932 |
| Một bộ pH dự phòng dùng chung | 1.683.506 |
| **Đã có giá (3 trạm + dự phòng)** | **43.369.904** |

Đây chưa phải ngân sách đầy đủ: nguồn điện, anten, hộp, lắp đặt, SIM, hosting, bảo trì, sửa chữa và thải bỏ chưa có giá.

### 5.5 Team

| Thành viên | Mảng nghiên cứu |
|---|---|
| Nguyễn Gia Ngân | Industrial wastewater |
| Huỳnh Lâm Nguyên | Monitoring reliability |
| Nguyễn Ngọc Anh Thư | Policy and budgets |
| Nguyễn Tấn Đạt | Economic impact |
| Lê Nguyễn Bá Nguyên | Drains and outfalls |
| Châu Hoàng Tuấn | Chưa điền |

Có thêm phần Teamwork declaration (ai làm gì).

### 5.6 References và Appendices

- **References:** 24 nguồn theo APA 7, link bấm được, có ô tìm kiếm.
- **Appendices** (không tính vào giới hạn từ):

| Phụ lục | Nội dung |
|---|---|
| A | Điều lệ nhóm |
| B | Biên bản họp và buổi chấm ma trận |
| C | Khảo sát và phỏng vấn |
| D | Dữ liệu kiểm thử prototype |
| E | Bảng vật tư và ảnh chụp giá (đã có link) |
| F | Khai báo dùng AI (Claude, ChatGPT) và nhật ký prompt |

## 6. Live demo

Ba thành phần trên trang Solution dùng chung một trạm mô phỏng **NH-04, sông Nhuệ**. Simulator là nguồn dữ liệu duy nhất.

```text
 Nút Discharge / Spike / Reset ──sim-cmd──► Simulator ESP32 (iframe)
                                                 │ station-state
                                                 ▼
                                          Trang chính (site.ts)
          ┌───────────────┬───────────────┬──────┴────────┬──────────────┐
          ▼               ▼               ▼               ▼              ▼
     Thẻ ngưỡng     Demo điện thoại     Nhật ký     Ô trạng thái     Trạm 3D (iframe)
```

### Simulator (`public/embed/simulator/Simulation.html`)

| Đầu vào | Giá trị bình thường | Giá trị khi xả thải |
|---|---|---|
| pH | 7.2 | 9.7 |
| Độ đục (NTU) | 38 | 158 |
| DO (mg/L) | 5.1 | 2.1 |
| TDS (ppm) | 400 | 1400 |
| Nhiệt độ (°C) | 27.4 | 29.5 |

- Đọc mỗi 2 giây; gửi MQTT giả lập mỗi 15 giây lên topic `ww/NH-04/readings`.
- Chế độ: Normal, Spill, Random, Manual (kéo thanh trượt hoặc gõ số). Tốc độ x1, x3, x10. Có Pause, Reset, Serial Monitor, tab MQTT.
- Lần đo vượt ngưỡng thứ 1 và 2 là cảnh báo vàng, lần thứ 3 liên tiếp là báo đỏ. Một lần đo trong ngưỡng sẽ đưa bộ đếm về 0.

| Luật | Điều kiện vượt ngưỡng |
|---|---|
| **Report rule** (mặc định, giống nội dung web) | pH ngoài 6.0–8.5, DO < 4, độ đục > 57 NTU (nền 38 + 50%) |
| **Team rule** (thử nghiệm) | Thêm TDS > 500, nhiệt độ > 35 °C; giới hạn độ đục 75 NTU khi DO ≥ 4.2 và TDS ≤ 400, ngược lại 50 NTU |

### Trạm 3D (`public/embed/station/`)

- Trên web mở với `?embed=1`: chỉ hiện mô hình, nhãn bộ phận, nút Focus on station và bảng Status, Over limit in a row.
- Bấm một bộ phận trong danh sách thì camera bay đến đó; bấm trên mô hình thì danh sách sáng theo.
- Mở riêng (không có `?embed=1`) có thêm EN/VI, thanh trượt mức xả thải, phần Play: how it works và bảng chi tiết.

### Giao tiếp giữa trang và iframe (`postMessage`)

| Chiều | Loại tin | Dữ liệu |
|---|---|---|
| Trang → Simulator | `sim-cmd` | `cmd`: `discharge`, `spike`, `reset` (simulator còn nhận `rule`, trang chưa dùng) |
| Simulator → Trang | `station-state` | giá trị đo, cờ vượt ngưỡng, `cnt`, `alert`, giới hạn, luật, chế độ, thời gian |
| Simulator → Trang | `sim-height` | chiều cao để chỉnh iframe |
| Trang → Trạm 3D | `station-state` | chuyển tiếp nguyên trạng |
| Trang → Trạm 3D | `station-focus` | số thứ tự bộ phận |
| Trạm 3D → Trang | `station-part` | bộ phận vừa được bấm |

Trang chỉ nhận tin khi `event.source` đúng là iframe tương ứng.

## 7. Tính năng giao diện và tương tác

| Nhóm | Tính năng |
|---|---|
| Điều hướng | Menu đánh dấu trang đang mở; menu hamburger trên điện thoại (đổi thành ✕); thanh mục lục dính dưới menu, tô sáng mục đang đọc (Design, Solution, Implementation, Team); thanh tiến độ cuộn; nút lên đầu trang |
| Giao diện | Chế độ sáng và tối, nhớ lựa chọn (chưa áp vào bên trong iframe); hiệu ứng hiện dần, đếm số, thanh chạy |
| Nội dung tương tác | Chuỗi nguyên nhân – hậu quả; điểm chi tiết từng phương án; biểu đồ chi phí; bánh xe vòng đời; tab prototype; phụ lục đóng mở |
| Demo | Ô trạng thái Water normal / Checking 1–2 of 3 / Alert sent; nút bị khoá đến khi simulator sẵn sàng; Full-screen demo, thoát bằng Esc |
| Tiện ích | Tìm trong References (gõ không dấu vẫn ra); phóng to hình mock-up; bộ đếm từ ở chân trang |
| Trợ năng | Skip to content; dùng được bằng bàn phím; viền focus rõ; nhãn ARIA; chuyển trang thì đưa focus vào tiêu đề; tôn trọng chế độ giảm chuyển động |
| Hiệu năng | Canvas chỉ chạy khi đang nhìn thấy và tab đang mở; iframe chỉ tải khi vào trang Solution; hình mock-up tải trễ |

## 8. Thiết kế hình ảnh

Ý tưởng: một trạm đo ngoài hiện trường bên cửa xả, nước sông tối, số đo kiểu thiết bị.

| Màu | Mã | Dùng cho |
|---|---|---|
| River | `#0b2238` | Nền tối chủ đạo, menu |
| Nền giấy | `#f2f5f8` (tối: `#08131f`) | Vùng đọc |
| Lime | `#c8f169` | An toàn, nút chính |
| Coral | `#ff6b57` | Cảnh báo |
| Amber | `#f2a541` | Đang kiểm tra, chỗ chờ điền |
| Teal | `#7fd6e8` | Hỗ trợ, viền focus |
| Blue | `#4a9fd8` | Liên kết, điểm nhấn |

| Font | Dùng cho |
|---|---|
| Oswald | Tiêu đề |
| Source Serif 4 | Văn bản đọc |
| Public Sans | Giao diện |
| IBM Plex Mono | Số đo |

Biến màu nằm trong [base.css](website/src/styles/base.css).

| Điểm gãy bố cục | Thay đổi chính |
|---|---|
| ≤ 1100px | Menu và lưới thu gọn |
| ≤ 980px | Menu hamburger, bố cục hai cột thành một |
| ≤ 860px | Banner và demo toàn màn hình xếp dọc |
| ≤ 720px | Phần lớn lưới thành một cột, timeline xếp dọc |
| ≤ 360px | Thu nhỏ tiêu đề trang |

## 9. Kiến trúc kỹ thuật

- **Công nghệ:** React 19, TypeScript 5.9, Vite 7. `react-router` có trong dependencies nhưng code không dùng; `site.ts` tự định tuyến bằng hash.
- **Cách dựng trang:** các file HTML được nạp dạng chuỗi (`?raw`), ghép lại và chèn vào DOM một lần. Sau đó `initSite()` gắn hành vi, rồi `initUx()` thêm lớp tiện ích.
- **Không bọc `StrictMode`:** hai hàm khởi tạo chỉ được chạy một lần.
- **Kiểu dữ liệu:** `App.tsx`, `main.tsx`, `ux.ts` kiểm tra kiểu chặt; `site.ts`, `data.ts` và hai file scene được chuyển từ bản mẫu nên có `// @ts-nocheck`.
- **Phụ thuộc ngoài:** Google Fonts; three.js r128 và OrbitControls từ CDN cho trạm 3D. Mất mạng thì trạm 3D không hiện.
- **Lưu trữ:** website tĩnh, không có backend; chỉ lưu lựa chọn theme trong `localStorage`.

## 10. Cách sửa nội dung

| Muốn sửa | Mở file |
|---|---|
| Chữ trên một trang | `src/content/pages/<trang>.html` |
| Menu | `src/content/layout/header.html` |
| Footer và khối kêu gọi cuối trang | `src/content/layout/footer.html` |
| Tiêu chí, điểm, giá, vòng đời, thành viên | `src/content/data.ts` |
| Màu, font | `src/styles/base.css` |
| Luật và số liệu simulator | `public/embed/simulator/Simulation.html` |
| Trạm 3D | `public/embed/station/` |

**Thêm một mục vào trang có sẵn:** tạo `<section id="<trang>-<tên>">` có `<p class="kicker">`, rồi thêm link cùng tên vào `<nav class="subnav">` của trang. Thanh mục lục tự cập nhật.

**Thêm một trang mới:** tạo file trong `pages/` với `<article class="page" id="p-<trang>" data-page="<trang>">`, import trong `index.ts`, thêm vào `PAGES` và `GROUP` trong `site.ts`, thêm link vào menu.

**Lưu ý:**
- Giá và điểm trong `data.ts` được tính tổng tự động, nhưng một số con số cũng viết sẵn trong HTML (ví dụ ₫41,7 triệu ở trang chủ). Đổi giá thì sửa cả hai nơi.
- Chỉ các trang có `data-count` (Home, Design, Solution, Implementation) được tính vào số từ.

## 11. Tình trạng hiện tại và việc còn lại

### Chỗ còn chờ điền

| Trang | Cần bổ sung |
|---|---|
| Solution, Prototyping | Kết quả và thay đổi phiên bản 2 của cả ba prototype; link mạch Wokwi; video demo; điểm SUS |
| Solution, Testing | Kết quả /10 của bốn kịch bản (kịch bản xả đột ngột thêm số giây); danh sách phản hồi và thay đổi |
| Team | Ảnh thành viên; vai trò trong báo cáo; bản khai đóng góp; mảng nghiên cứu và tiểu sử của Châu Hoàng Tuấn |
| Appendices | Link cho A, B, C, D, F |
| Implementation | Báo giá còn thiếu; người vận hành chính và dự phòng; bên trả phí; ngưỡng nghiệm thu |
| `docs/website/registers/` | Hai file CSV mới có dòng tiêu đề |

### Điểm nên xem lại

- Footer có link "Considerations" (trỏ tới mục 4) và chưa có link Recommendations.
- Teamwork declaration đã bỏ khỏi menu Resources, vẫn còn ở trang Team và footer.
- Journey map hiện là dòng thời gian 5 mốc, chưa có hành động, điểm tiếp xúc, cảm xúc, khó khăn, cơ hội.
- Bản đồ trang chủ vẽ 10 trạm trong khi thí điểm là 3 trạm; nên nói rõ là minh hoạ nếu bị hỏi.
- Trên điện thoại, nhãn trong trạm 3D đè lên nhau.
- Trong `nav.css` còn hai dòng hiệu ứng menu bị comment; kiểu đang dùng nằm ở `ux.css`.
- [summary.md](docs/website/summary.md) còn mô tả cũ ở phần demo (nút "Demo" ở mục "Try it") và danh sách tính năng.

### Kỹ thuật và bảo mật

- **Cần kiểm tra sớm:** hai file `.env` và `.env.local` ở gốc repo đang được Git theo dõi và có trên nhánh `origin/final-website`, dù `.gitignore` đã liệt kê chúng. Nếu bên trong có mật khẩu hoặc khoá, cần đổi chúng và gỡ file khỏi Git.
- Thay đổi gần đây trong `website/` và `docs/` chưa được commit.
- Máy đang dùng Node 22.11.0, thấp hơn mức 22.12 mà dự án yêu cầu (build vẫn chạy, có cảnh báo).
- Website chưa có bộ test tự động trong repo. Giao diện mới được thử bằng Edge ở chế độ không cửa sổ; chưa thử trên điện thoại thật, Safari hay Firefox.
