# Hanoi WaterWatch: tóm tắt toàn bộ website

Báo cáo cuối kỳ của **Group One** (6 thành viên), môn *Communication for IT Professionals*, tutorial 319265, thứ Ba 9:00–11:50. Website là một trang dài, chuyển mục bằng menu, gồm 7 trang: Home (gồm cả Background và Problem), Design, Solution, Implementation, Team, References, Appendices.

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
| Chi phí thí điểm | Khoảng ₫41,7 triệu tiền thiết bị đã có giá cho 3 trạm; lắp đặt và vận hành chờ báo giá |
| Trạng thái | Prototype mô phỏng đang chạy, đang kiểm thử người dùng |

## 2. Từng trang

### Home
- Banner là bản đồ 3D các sông Hà Nội với 10 trạm: một trạm đếm 3 lần đo xấu rồi chuyển đỏ, vệt ô nhiễm chảy xuôi dòng, một điện thoại của người dân trong vòng 1 km chuyển đỏ, cảnh báo tới cơ quan và thanh tra đến lấy mẫu.
- Câu hỏi thiết kế đặt cạnh bảng tóm tắt (Problem, Solution, Who benefits, Pilot cost, Status).
- Bốn con số "vì sao quan trọng":
  - Chỉ khoảng 30% nước thải sinh hoạt hàng ngày của Hà Nội (khoảng 1 triệu m³) được xử lý.
  - Ô nhiễm nước có thể làm mất 3,5% GDP Việt Nam mỗi năm vào năm 2035.
  - ₫75.115 tỷ được duyệt năm 2026 để phục hồi riêng sông Nhuệ.
  - Mỗi năm có 10–15 đợt nước thải Hà Nội đổ xuống Hà Nam, làm chết cá nuôi.
- **Background** (nút trên footer): bản rút gọn bối cảnh các sông Tô Lịch, Kim Ngưu, Nhuệ, với hai số liệu 13 trên 15 điểm ô nhiễm nặng và Zn, Cr trong trầm tích.
- **Problem:** câu nêu nhu cầu "cần biết trong vài phút" và bốn cặp nguyên nhân, hậu quả (xét nghiệm chậm, thiếu xử lý ở cụm công nghiệp, dữ liệu nước ít công khai, nhà và nhà máy dùng chung cống).

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
- **Demo điện thoại tương tác:** nút Simulate a discharge, Single spike, Reset. Chạy cùng luật 3 lần liên tiếp; một lần tăng vọt đơn lẻ bị bỏ qua.
- **Trang demo ẩn** (nút Demo ở mục Try it, địa chỉ #solution-live): điện thoại bên trái, trạm 3D bên phải.
- **Ba prototype (làm không cần phần cứng thật):**
  - **P1 Sensor station:** mạch ESP32 trên Wokwi, đọc mỗi 2 giây, áp luật QCVN và 3 lần liên tiếp, gửi qua MQTT và báo Telegram. Kiểm thử bốn kịch bản, mỗi kịch bản 10 lần.
  - **P2 Map app:** web app mobile (HTML, JavaScript) nhận dữ liệu từ P1, song ngữ Việt–Anh, chế độ chữ lớn, đăng trên GitHub Pages. Thử với 5–8 người dùng, gồm cả người lớn tuổi, bằng 3 nhiệm vụ và bảng hỏi SUS.
  - **P3 Station model:** mô hình 3D bằng Tinkercad ghép vào ảnh bờ kè Hà Nội; hỏi 5 người trạm làm gì và họ lo gì.
- **Kiểm thử:** bình thường 5 phút (không báo), xả đột ngột (có báo, đo thời gian tới điện thoại), tăng vọt đơn lẻ (không báo), trở lại bình thường (bản đồ về xanh). Mỗi kịch bản có ô kết quả /10.
- **Hạn chế đã nêu:** simulator kiểm tra logic phát hiện và cảnh báo, không kiểm tra độ chính xác cảm biến trong nước thật. Đầu dò oxy cần hiệu chuẩn thường xuyên, cửa xả thật có bám bẩn và ngập, nên đề xuất thí điểm thực địa.

### Implementation
Trang đi theo 7 bước: Rollout plan → Operation → Cost analysis → Risks and community reaction → Life cycle → Journey map → Recommendations.

- **Phạm vi:** 3 trạm trong 3 năm. Thử trạm 1, đạt cổng nghiệm thu rồi mới mua trạm 2 và 3.
- **Vận hành (đề xuất):** 6 chuyến bảo trì chung (tháng 6–36), 18 lượt kiểm trạm, mục tiêu sửa trong 48 giờ. Hiệu chuẩn thêm theo hãng cần báo giá.
- **Chi phí đã có giá:** ₫13.895.466 mỗi trạm; ₫41.686.398 cho 3 trạm; thêm 1 bộ pH dự phòng ₫1.683.506 thành ₫43.369.904. Tỷ giá lịch sử ₫25.940/USD.
- **Chưa có giá:** nguồn điện, anten, hộp và gá, lắp đặt, SIM, hosting, chuyến bảo trì, sửa chữa, thải bỏ. Chưa có tổng ngân sách đầy đủ, chưa có bên cam kết chi trả.
- **Nguồn số liệu:** nhánh feature/ba-nguyen-cost-analysis, commit 0aa14906.

**Other considerations** (cùng trang Implementation):

- **Vòng đời (sáu giai đoạn):** vật liệu, lắp ráp (làm tại Hà Nội để giảm vận chuyển), vận chuyển (gom theo quận), lắp đặt (làm việc trên tường kè cạnh đường và nước), sử dụng (cần vệ sinh và hoá chất hiệu chuẩn), cuối vòng đời (thu hồi, tái chế). Ý chính: một cảm biến nước không nên trở thành nguồn ô nhiễm nước.
- **Rủi ro và cách ứng phó:**

| Rủi ro | Mức độ | Ứng phó |
|---|---|---|
| Số đo sai khi gần ngưỡng | Possible, tác động cao | Đối chiếu máy tham chiếu trước khi mua thêm (độ đục khoảng ±50 NTU, DO ±0,6 mg/L) |
| Đầu dò bám bẩn và trôi số đo | Likely, tác động vừa | Chổi gạt, vệ sinh theo lịch, thêm chuyến khi số đo trôi |
| Mệt mỏi vì cảnh báo | Possible, tác động cao | Luật 3 lần đo và nền riêng từng trạm |
| Mất cắp hoặc ngập | Possible, tác động vừa | Lồng khoá trên mực ngập, phường trông |
| Nhà máy phản đối | Possible, tác động cao | Lab xác nhận trước khi phạt, cụm công nghiệp dùng cảnh báo để sửa xử lý |
| Khoảng cách số | Possible, tác động vừa | SMS và loa phường, chữ lớn, nhãn tiếng Việt |

- **Hành trình người dùng:** bà Lan, 58 tuổi, nuôi cá ở Thanh Trì. 02:00 nước thải vào sông Nhuệ phía trên ao; 02:01 trạm NH-04 thấy oxy giảm 3 lần liên tiếp; 02:02 điện thoại nhận SMS "đừng bơm nước sông đêm nay"; 06:00 bà đóng cổng ao, cá sống sót; ngày 2 thanh tra lấy mẫu gửi lab để xác nhận nguồn.
- **Khuyến nghị tiếp theo:**
  - Chốt báo giá, đơn vị vận hành và bên trả phí.
  - Chứng minh một trạm chạy tốt ngoài hiện trường.
  - Thêm cảm biến amoni, dấu hiệu trực tiếp của nước thải sinh hoạt.
  - Thống nhất vai trò pháp lý của dữ liệu cảnh báo và kết quả lab.
  - Thử với người lớn tuổi.
  - Công khai dữ liệu có gắn nhãn chất lượng.
  - Liên kết với các trạm sông hiện có của thành phố để truy vết ô nhiễm xuống hạ lưu.

### Team
Sáu thành viên và mảng nghiên cứu: Nguyễn Gia Ngân (nước thải công nghiệp), Huỳnh Lâm Nguyên (độ tin cậy quan trắc), Nguyễn Ngọc Anh Thư (chính sách và ngân sách), Nguyễn Tấn Đạt (tác động kinh tế), Lê Nguyễn Bá Nguyên (cống và cửa xả), Châu Hoàng Tuấn (mảng nghiên cứu và tiểu sử còn để trống). Có bản khai đóng góp của từng người, và cả nhóm xác nhận bản khai này đúng.

### References
Theo APA 7: Adu-Manu et al. (2017), Báo Pháp Luật (2021), Dai Doan Ket (2024), Đại Hòa Phú (n.d.), DFRobot (n.d.-a đến n.d.-c, 2026), Hadj-Hammou et al. (2017), Hshop (n.d.-a đến n.d.-e), NDH (n.d.), Bộ TN&MT (2023, QCVN 08:2023/BTNMT), Nguyen (2019), Nguyen et al. (2018), Nguyet (2025), Phung et al. (2024), Pule et al. (2017), Văn Anh (2026, Đại biểu Nhân dân), Viet Nam News (2019).

### Appendices
Phụ lục không tính vào giới hạn 4.000 từ: A (điều lệ nhóm), B (biên bản họp và buổi chấm ma trận), C (khảo sát và phỏng vấn), D (dữ liệu kiểm thử prototype), E (bảng vật tư và ảnh chụp giá), F (khai báo dùng AI: Claude để thiết kế, code website, cấu trúc báo cáo, tìm nguồn và kiểm APA; ChatGPT để brainstorm; mọi nguồn được kiểm với bản gốc và nhóm duyệt mọi quyết định).

## 3. Tính năng của website

- Thanh menu gồm 6 mục (Resources có menu thả xuống: References, Appendices), chạy được bằng bàn phím, có menu hamburger trên điện thoại. Background và Problem mở từ footer; phần Considerations nằm trong trang Implementation.
- Chế độ sáng và tối.
- Thanh tiến độ cuộn, nút lên đầu trang.
- Bản đồ sông động ở banner trang chủ; hình động riêng ở đầu các trang con và cuối trang.
- Chuỗi nguyên nhân – hậu quả di chuột để theo dõi.
- Ma trận quyết định tương tác, xem điểm chi tiết của từng phương án.
- Bảng chi phí: tổng đã có giá theo hai đợt mua, danh sách thiết bị và các khoản chờ báo giá.
- Bánh xe vòng đời; ma trận rủi ro; hành trình người dùng.
- Trạm 3D tương tác, simulator ESP32, demo điện thoại, tất cả dùng chung một dữ liệu.
- Bộ đếm từ cho phần báo cáo chính (giới hạn 4.000 từ).

## 4. Chỗ còn trống và chỗ lệch cần nhóm xử lý

- **Chi phí và triển khai còn thiếu:** báo giá nguồn điện, anten, hộp, lắp đặt, SIM, hosting, bảo trì; người vận hành chính và dự phòng; bên trả phí; ngưỡng nghiệm thu.
- **Còn chỗ giữ chỗ chờ điền:** kết quả /10 của bốn kịch bản kiểm thử, kết quả SUS, phản hồi và thay đổi ở phiên bản 2, liên kết video và mạch Wokwi, tiểu sử của Châu Hoàng Tuấn, và các liên kết phụ lục còn trống.
- **Giá:** là giá niêm yết ghi ngày 19–25/11, chưa phải báo giá nhà cung cấp.
- **Giá trị demo:** số đo trong trạm 3D và simulator là ví dụ minh họa, không phải số đo thực địa.
