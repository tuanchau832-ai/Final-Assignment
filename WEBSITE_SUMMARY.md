# Hanoi WaterWatch: tóm tắt toàn bộ website

Báo cáo cuối kỳ của **Group One** (6 thành viên), môn *Communication for IT Professionals*, tutorial 319265, thứ Ba 9:00–11:50. Website là một trang dài, chuyển mục bằng menu, gồm 10 trang: Home, Background, Problem, Design, Solution, Implementation, Considerations, Team, References, Appendices.

## 1. Ý tưởng chính

**Câu hỏi thiết kế:** làm sao phát hiện nước thải chưa xử lý đổ vào sông Hà Nội theo thời gian thực, để cơ quan chức năng hành động nhanh và người dân tự bảo vệ được.

**Giải pháp:** các trạm cảm biến chạy bằng năng lượng mặt trời, đặt tại những cửa xả cống có nguy cơ cao. Trạm đo pH, oxy hoà tan (DO), độ đục và nhiệt độ. Khi số đo vượt giới hạn QCVN, hệ thống báo cho cơ quan môi trường, chuyển cửa xả đó sang đỏ trên bản đồ công khai và cảnh báo người dân gần đó. Trước khi phạt, thanh tra lấy mẫu gửi phòng thí nghiệm tại đúng cửa xả đó.

**Ba bước:** Sense (đo mỗi 2 giây) → Show (bản đồ xanh/vàng/đỏ) → Alert (cảnh báo cho cơ quan và dân, lab xác nhận).

**Tóm tắt trong báo cáo:**

| Mục | Nội dung |
|---|---|
| Vấn đề | Xả thải bị phát hiện chậm vài ngày và không truy ra được nguồn |
| Giải pháp | Trạm cảm biến ở cửa xả, bản đồ màu và cảnh báo tức thời |
| Ai hưởng lợi | Dân ven sông, cơ quan môi trường, nông dân hạ lưu |
| Chi phí thí điểm | Khoảng US$6,100 cho 10 trạm trong năm đầu |
| Trạng thái | Prototype mô phỏng đang chạy, đang kiểm thử người dùng |

## 2. Từng trang

### Home
- Hero là cảnh sông động lúc hoàng hôn: cống xả bắt đầu đổ nước đen, vệt ô nhiễm lan ra, trạm đếm 3 lần đo xấu rồi chuyển đỏ và gửi cảnh báo.
- Bốn con số "vì sao quan trọng":
  - Chỉ khoảng 30% nước thải sinh hoạt hàng ngày của Hà Nội (khoảng 1 triệu m³) được xử lý.
  - Ô nhiễm nước có thể làm mất 3,5% GDP Việt Nam mỗi năm vào năm 2035.
  - ₫75.115 tỷ được duyệt năm 2026 để phục hồi riêng sông Nhuệ.
  - Mỗi năm có 10–15 đợt nước thải Hà Nội đổ xuống Hà Nam, làm chết cá nuôi.
- Executive summary, thông tin dự án, nhóm bên liên quan (dân, cơ quan môi trường, nhà máy, nông dân hạ lưu, cảnh sát môi trường, nhà nghiên cứu).
- Cộng đồng mục tiêu: dân và nông dân dọc sông Tô Lịch, Kim Ngưu, Nhuệ.

### Background
- **Bối cảnh:** sông nội đô hoạt động như cống hở. Nước thải sinh hoạt và công nghiệp đều là nguồn gây ô nhiễm chính. Nước thải nhà máy gắn với COD và BOD₅ cao ở sông Tô Lịch, kẽm và crom trong trầm tích 4 con sông đô thị có rủi ro sinh thái đáng kể. Nước thải Cụm công nghiệp Thanh Oai năm 2024 không đạt chuẩn, dân báo nước tưới bị ô nhiễm và ngứa da. Trong 15 điểm quan trắc ô nhiễm nặng của các lưu vực chính, 13 điểm nằm ở hệ thống Nhuệ–Đáy.
- **Các bên liên quan:** 8 nhóm, mỗi nhóm có nhu cầu và mức ảnh hưởng. Ví dụ cơ quan môi trường cần bằng chứng tin cậy để thanh tra, người dân cần biết nước gần nhà có an toàn không, nhà máy cần cảnh báo sớm khi hệ thống xử lý hỏng.
- **Giải pháp hiện có và khoảng trống:**
  - Thanh tra định kỳ: lấy mẫu tay, riêng xét nghiệm BOD₅ cần 5 ngày, bỏ sót xả đêm và mưa lớn.
  - Trạm cố định trên sông: đo nước sông đã trộn nên không biết nguồn.
  - Dự án phục hồi: sửa thiệt hại sau khi xảy ra, không chỉ ra ai xả và lúc nào.
- **Tiếng nói cộng đồng:** khảo sát online và 5 buổi phỏng vấn (còn chỗ trống chờ biểu đồ và trích dẫn).

### Problem
- **Chuỗi sự việc:** 02:00 xả thải ban đêm → lần ghé tới thanh tra lấy mẫu tay → +5 ngày có kết quả BOD₅ → quá muộn, nước đã xuống hạ lưu.
- **Nguyên nhân và hậu quả (bốn cặp):**
  - Xét nghiệm định kỳ và chậm → ô nhiễm bị phát hiện muộn.
  - Cụm công nghiệp thiếu xử lý → kim loại tích tụ trong sông.
  - Dữ liệu nước ít công khai → dân dùng nước nhiễm bẩn.
  - Nhà và nhà máy dùng chung cống → khó xác định người xả, ngân sách thành phố và nông dân phải trả.
- **Trạng thái lý tưởng:** từ "phát hiện sau vài ngày, không biết cửa xả nào" sang "phát hiện trong vài phút tại đúng cửa xả, cử thanh tra kèm giờ và địa điểm, dân được cảnh báo trước khi dùng nước, người gây ô nhiễm trả tiền và dữ liệu mở tạo niềm tin".

### Design
- **Sáu tiêu chí và trọng số:**

| Tiêu chí | Trọng số |
|---|---|
| Timely (kịp thời) | 25% |
| Traceable (truy vết được) | 20% |
| Reliable (đáng tin) | 20% |
| Clear for residents (dễ hiểu với dân) | 15% |
| Durable (bền) | 10% |
| Affordable (rẻ) | 10% |

- **Ba phương án:**
  - **A. Trạm cảm biến tự động** (được chọn): thời gian thực ngày đêm, truy được tới một cửa xả; nhược điểm là chi phí đầu cao và đầu dò cần vệ sinh.
  - **B. Bộ test của dân và app:** rẻ, tạo sự tham gia, nhưng không liên tục và chất lượng dữ liệu không đều.
  - **C. Lấy mẫu thủ công thường xuyên hơn:** chính xác và được pháp lý chấp nhận, nhưng tốn nhân công và vẫn chậm vài giờ đến vài ngày.
- **Ma trận quyết định (điểm 1–5 nhân trọng số, tổng /100):**

| Phương án | Điểm chi tiết (6 tiêu chí theo thứ tự trên) | Tổng |
|---|---|---|
| A. Trạm cảm biến | 5, 5, 4, 4, 3, 3 | **85** |
| B. Bộ test và app | 2, 2, 2, 4, 5, 4 | 56 |
| C. Lấy mẫu thủ công | 1, 3, 5, 2, 4, 2 | 55 |

- A thắng vì là phương án duy nhất điểm cao ở cả hai tiêu chí nặng nhất (kịp thời và truy vết). Nhóm giữ lại ý hay của hai phương án kia: từ B, người dân báo ô nhiễm bằng ảnh trong app; từ C, mọi cảnh báo được xác nhận bằng mẫu lab trước khi phạt.

### Solution
- **Cách hoạt động, 5 bước:** Sense (đầu dò đọc mỗi 2 giây) → Check (3 lần liên tiếp ngoài giới hạn thì báo) → Send (4G, ghi kèm giờ và nơi) → Alert (dashboard và app chuyển đỏ, dân nhận cảnh báo) → Confirm (thanh tra lấy mẫu, kết quả lab có trước khi phạt).
- **Bên trong một trạm (trạm 3D tương tác):**
  - Pin mặt trời 20 W kèm pin sạc.
  - Hộp điều khiển ESP32 với modem 4G, lưu số đo offline khi mất mạng.
  - Cage đầu dò bằng inox có chổi gạt chống bám bẩn, chứa 4 đầu dò pH, DO, độ đục, nhiệt độ.
  - Hộp có khoá, bắt vào tường kè phía trên mực ngập.
  - Biển số cửa xả và mã QR để dân xem tình trạng trực tiếp.
- **Luật cảnh báo (theo QCVN 08:2023/BTNMT):**

| Chỉ số | Ngưỡng |
|---|---|
| pH | 6.0–8.5 (ngoài khoảng là mức chất lượng thấp nhất, D) |
| Oxy hoà tan | dưới 4 mg/L (dưới mức tối thiểu của nước loại C) |
| Độ đục | tăng +50% so với nền (QCVN không có giới hạn độ đục) |
| Nhiệt độ | chỉ ghi lại, dùng hiệu chỉnh pH và oxy |

  Trong 2 tuần đầu, mỗi trạm tự học mức nền của mình, nên sông vốn đã ô nhiễm vẫn thấy được thay đổi đột ngột.
- **Sensor simulator (ESP32):** mô phỏng 5 đầu vào, hai bộ luật (Report rule và Team rule), Serial Monitor, tab MQTT.
- **Câu hỏi của cộng đồng (5 câu):**
  - Báo sai thì sao? Cần 3 lần liên tiếp, đầu dò lỗi được gắn cờ, thông báo ghi "phát hiện, đang kiểm tra", mẫu lab xác nhận trước khi phạt.
  - Mất cắp hoặc ngập? Hộp khoá trong lồng thép trên mực ngập, cán bộ phường hỗ trợ trông.
  - Cha mẹ không dùng smartphone? Có SMS và loa phường.
  - App có thu thập dữ liệu cá nhân không? Không cần tài khoản, vị trí ở lại trên điện thoại, chỉ công bố dữ liệu nước.
  - Nhà máy có can thiệp được không? Số đo được ký, lưu log thô, mở hộp sẽ gửi cảnh báo phá hoại.
- **Demo điện thoại tương tác:** nút Simulate a discharge, Single spike, Reset. Chạy cùng luật 3 lần liên tiếp; một lần tăng vọt đơn lẻ bị bỏ qua.
- **Ba prototype (làm không cần phần cứng thật):**
  - **P1 Sensor station:** mạch ESP32 trên Wokwi, đọc mỗi 2 giây, áp luật QCVN và 3 lần liên tiếp, gửi qua MQTT và báo Telegram. Kiểm thử bốn kịch bản, mỗi kịch bản 10 lần.
  - **P2 Map app:** web app mobile (HTML, JavaScript) nhận dữ liệu từ P1, song ngữ Việt–Anh, chế độ chữ lớn, đăng trên GitHub Pages. Thử với 5–8 người dùng, gồm cả người lớn tuổi, bằng 3 nhiệm vụ và bảng hỏi SUS.
  - **P3 Station model:** mô hình 3D bằng Tinkercad ghép vào ảnh bờ kè Hà Nội; hỏi 5 người trạm làm gì và họ lo gì.
- **Kiểm thử:** bình thường 5 phút (không báo), xả đột ngột (có báo, đo thời gian tới điện thoại), tăng vọt đơn lẻ (không báo), trở lại bình thường (bản đồ về xanh). Mỗi kịch bản có ô kết quả /10.
- **Hạn chế đã nêu:** simulator kiểm tra logic phát hiện và cảnh báo, không kiểm tra độ chính xác cảm biến trong nước thật. Đầu dò oxy cần hiệu chuẩn thường xuyên, cửa xả thật có bám bẩn và ngập, nên đề xuất thí điểm thực địa.

### Implementation
- **Kế hoạch triển khai:**
  - Tháng 0–3, Chuẩn bị: thống nhất địa điểm và quy trình cảnh báo với Sở Nông nghiệp và Môi trường, xin quyền tiếp cận từ công ty thoát nước, đào tạo thanh tra và cán bộ phường.
  - Tháng 3–9, Thí điểm: lắp 10 trạm ở các cửa xả nguy cơ cao trên sông Nhuệ và Tô Lịch, chạy baseline 2 tuần, mở app ở 2 phường.
  - Tháng 9–12, Đánh giá: so từng cảnh báo với mẫu lab, đo thời gian phát hiện, báo động giả, mức dùng app, công bố kết quả.
  - Từ năm 2: mở rộng sang cụm công nghiệp như Thanh Oai, cổng dữ liệu công khai, bàn giao vận hành hằng ngày cho thành phố.
- **Ai sở hữu và vận hành:** Sở Nông nghiệp và Môi trường sở hữu trạm và dữ liệu, nhận cảnh báo, cử thanh tra. Nhóm xây, lắp, bảo trì theo hợp đồng dịch vụ và vận hành nền tảng. Phòng lab được công nhận kiểm tra mẫu xác nhận. UBND phường chia sẻ cảnh báo tại chỗ và thu phản hồi. Người dân báo ô nhiễm bằng ảnh và giúp trông trạm.
- **Bảo trì:** vệ sinh đầu dò 2 tuần/lần, hiệu chuẩn hằng tháng, sửa trong 48 giờ bằng thiết bị dự phòng.
- **Chi phí (tương tác, có máy tính):**

| Xây dựng, mỗi trạm | US$ |
|---|---|
| Bo ESP32 kèm 4G và sạc mặt trời (LILYGO) | 49.78 |
| Bộ đầu dò pH công nghiệp (DFRobot) | 64.90 |
| Bộ đầu dò oxy hoà tan (DFRobot) | 169.00 |
| Cảm biến độ đục (DFRobot) | 9.90 |
| Cảm biến nhiệt độ chống nước (DFRobot) | 7.50 |
| Pin mặt trời 20 W kèm bộ sạc (eBay) | 46.99 |
| Hộp, pin, lồng thép, chổi gạt, cáp (ước tính nhóm) | 80.00 |
| Nhân công lắp đặt (ước tính nhóm) | 40.00 |
| **Tổng** | **468.07** |

| Vận hành, mỗi trạm mỗi năm | US$ |
|---|---|
| Điện cực pH thay thế | 49.50 |
| 24 lần vệ sinh | 60.00 |
| Gói dữ liệu 4G | 18.00 |
| Dung dịch hiệu chuẩn | 10.00 |
| Chia sẻ chi phí cloud | 5.00 |
| **Tổng** | **142.50** |

  - 10 trạm, 1 năm: **US$6,106**, tương đương khoảng ₫159 triệu (tỷ giá khoảng ₫26.000/USD), chiếm một phần nhỏ trong ngân sách ₫75.115 tỷ phục hồi sông Nhuệ.
  - Cuối vòng đời (khoảng 5 năm): thu hồi bo mạch và pin cho nhà tái chế rác điện tử, tái sử dụng lồng; khoảng US$10 mỗi trạm (ước tính).
  - Nguồn tiền: ngân sách môi trường thành phố, người gây ô nhiễm trả (phạt và phí nước thải), cụm công nghiệp trả cho cảnh báo sớm, quỹ phát triển quốc tế.

### Considerations
- **Vòng đời (sáu giai đoạn):** vật liệu, lắp ráp (làm tại Hà Nội để giảm vận chuyển), vận chuyển (gom theo quận), lắp đặt (làm việc trên tường kè cạnh đường và nước), sử dụng (cần vệ sinh và hoá chất hiệu chuẩn), cuối vòng đời (thu hồi, tái chế). Ý chính: một cảm biến nước không nên trở thành nguồn ô nhiễm nước.
- **Rủi ro và cách ứng phó:**

| Rủi ro | Mức độ | Ứng phó |
|---|---|---|
| Đầu dò bám bẩn và trôi số đo | Likely, tác động vừa | Chổi gạt, vệ sinh 2 tuần/lần, gắn cờ khi trôi |
| Mệt mỏi vì cảnh báo | Possible, tác động cao | Luật 3 lần đo và nền riêng từng trạm |
| Mất cắp hoặc ngập | Possible, tác động vừa | Lồng khoá trên mực ngập, linh kiện giá trị thấp, phường trông |
| Nhà máy phản đối | Possible, tác động cao | Lab xác nhận trước khi phạt, cụm công nghiệp dùng cảnh báo để sửa xử lý |
| Mất mạng | Unlikely, tác động vừa | Lưu offline, gửi khi có sóng lại |
| Khoảng cách số | Possible, tác động vừa | SMS và loa phường, chữ lớn, nhãn tiếng Việt |

- **Hành trình người dùng:** bà Lan, 58 tuổi, nuôi cá ở Thanh Trì. 02:00 nước thải vào sông Nhuệ phía trên ao; 02:01 trạm NH-04 thấy oxy giảm 3 lần liên tiếp; 02:02 điện thoại nhận SMS "đừng bơm nước sông đêm nay"; 06:00 bà đóng cổng ao, cá sống sót; ngày 2 lab xác nhận nguồn và nhà máy bị phạt.
- **Khuyến nghị tiếp theo:**
  - Thí điểm thực địa với cảm biến thật tại một cửa xả.
  - Thêm cảm biến amoni, dấu hiệu trực tiếp của nước thải sinh hoạt.
  - Thống nhất vai trò pháp lý của dữ liệu cảnh báo và kết quả lab.
  - Thử với người lớn tuổi.
  - Công khai dữ liệu có gắn nhãn chất lượng.
  - Liên kết với các trạm sông hiện có của thành phố để truy vết ô nhiễm xuống hạ lưu.

### Team
Sáu thành viên và mảng nghiên cứu: Nguyễn Gia Ngân (nước thải công nghiệp), Huỳnh Lâm Nguyên (độ tin cậy quan trắc), Nguyễn Ngọc Anh Thư (chính sách và ngân sách), Nguyễn Tấn Đạt (tác động kinh tế), Lê Nguyễn Bá Nguyên (cống và cửa xả), Châu Hoàng Tuấn (mảng nghiên cứu và tiểu sử còn để trống). Có bản khai đóng góp của từng người, và cả nhóm xác nhận bản khai này đúng.

### References
15 nguồn theo APA 7: Adu-Manu et al. (2017), Báo Pháp Luật (2021), Dai Doan Ket (2024), DFRobot (2026), eBay (2026), Hadj-Hammou et al. (2017), LILYGO (2026), Bộ TN&MT (2023, QCVN 08:2023/BTNMT), Nguyen (2019), Nguyen et al. (2018), Nguyet (2025), Phung et al. (2024), Pule et al. (2017), Văn Anh (2026, Đại biểu Nhân dân), Viet Nam News (2019).

### Appendices
Phụ lục không tính vào giới hạn 4.000 từ: A (điều lệ nhóm), B (biên bản họp và buổi chấm ma trận), C (khảo sát và phỏng vấn), D (dữ liệu kiểm thử prototype), E (bảng vật tư và ảnh chụp giá), F (khai báo dùng AI: Claude để thiết kế, code website, cấu trúc báo cáo, tìm nguồn và kiểm APA; ChatGPT để brainstorm; mọi nguồn được kiểm với bản gốc và nhóm duyệt mọi quyết định).

## 3. Tính năng của website

- Menu thả xuống, chạy được bằng bàn phím, có menu hamburger trên điện thoại.
- Chế độ sáng và tối.
- Thanh tiến độ cuộn, nút lên đầu trang.
- Cảnh sông động ở đầu trang và cuối trang.
- Thẻ các bên liên quan bấm được; chuỗi nguyên nhân – hậu quả di chuột để theo dõi.
- Ma trận quyết định tương tác, xem điểm chi tiết của từng phương án.
- Máy tính chi phí: chọn số trạm và số năm, ra tổng bằng USD, VND và tỷ lệ so với ngân sách sông Nhuệ.
- Bánh xe vòng đời; ma trận rủi ro; hành trình người dùng.
- Trạm 3D tương tác, simulator ESP32, demo điện thoại, tất cả dùng chung một dữ liệu.
- Bộ đếm từ cho phần báo cáo chính (giới hạn 4.000 từ).

## 4. Chỗ còn trống và chỗ lệch cần nhóm xử lý

- **Lệch số trong phần chi phí:** tiêu đề ghi "About US$430 to build a station", nhưng bảng vật tư cộng lại là US$468.07. Con số 430 khớp với tổng chưa tính nhân công lắp đặt (428.07). Tổng US$6,106 của 10 trạm lại dùng 468.07 (10 × (468.07 + 142.50)). Cần sửa tiêu đề thành khoảng US$470, hoặc ghi rõ "chưa gồm lắp đặt".
- **Còn chỗ giữ chỗ chờ điền:** một câu về kết quả kiểm thử prototype (sau tuần 10), biểu đồ khảo sát (chờ đủ 30 phản hồi), 2–3 trích dẫn phỏng vấn, kết quả /10 của bốn kịch bản kiểm thử, kết quả SUS, phản hồi và thay đổi ở phiên bản 2, liên kết video và mạch Wokwi, tiểu sử của Châu Hoàng Tuấn, và các liên kết phụ lục A–F.
- **Giá và số liệu mang tính ước tính:** các dòng màu hổ phách trong bảng chi phí là ước tính của nhóm, chưa phải báo giá nhà cung cấp.
- **Giá trị demo:** số đo trong trạm 3D và simulator là ví dụ minh họa, không phải số đo thực địa.
