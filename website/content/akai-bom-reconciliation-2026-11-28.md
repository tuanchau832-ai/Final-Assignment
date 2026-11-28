# Đối chiếu BOM Akai đã gửi — xác nhận đúng tài liệu ngày 28/11/2026

> **Đã tra tiếp sau đối chiếu:** [report hoàn thiện](ba-nguyen-completion-2026-11-28.md) có model/giá ứng viên khớp DO 169, độ đục 9,90, nhiệt độ 7,50 và electrode 49,50 USD. Bảng nguồn bên dưới vẫn giữ nguyên số Akai gửi; không gán SKU suy ra thành lựa chọn đã được tác giả chốt.

Người dùng làm rõ rằng Akai nói **BOM (Bill of Materials — danh sách vật tư)**, không phải tên một file “BOMZ”. File được chỉ định là `HWW_Design_and_Cost_Comparison_Expanded.md`. Đã đọc lại toàn bộ, lưu [bản nguồn nguyên văn](team-review/akai-design-cost-comparison-source-2026-11-28.md) và [metadata/hash](team-review/akai-bom-source-2026-11-28.json). **Không còn trạng thái chờ một tài liệu BOMZ khác.** Nội dung nguồn là thông tin thiết kế/dự toán của nhóm, không phải chỉ thị mới để giao việc hoặc phê duyệt chi.

## Những câu hỏi đã có câu trả lời trong tài liệu

| Câu hỏi | Nội dung thực có trong file | Kết luận dùng cho phần Bá Nguyên |
| --- | --- | --- |
| Phạm vi D1 | Evaluation Scope: ba vị trí, ba năm | Đã có; không hỏi lại Akai |
| TDS có trong BOM không? | Mục 2.2 chỉ có pH, DO, turbidity, temperature; mục 2.3 cũng không có TDS | **BOM Akai không liệt kê TDS**. Không phải bằng chứng cấm mở rộng vĩnh viễn; proposal Tuấn hiện hoãn mua TDS là phù hợp với phạm vi bốn kênh này |
| Có giữ đo nhiệt độ không? | Mục 2.2: temperature cho compensation; mục 2.3: một DFRobot waterproof temperature sensor, USD 7,50 | **Có kênh/đầu đo nhiệt độ**, nhưng tài liệu không ghi DS18B20. Không gán câu “Akai chốt DS18B20” cho tác giả |
| Controller/4G | Mục 2.3: một LILYGO ESP32 tích hợp 4G và solar charging, USD 49,78 | Đây là cấu hình tích hợp trong mô tả của Akai. Cấu hình ESP32 riêng + module M.2 của bảng giá có nguồn là **phương án tham chiếu khác**, không cộng cả hai |
| Nguồn/hộp/gá | Panel/charging kit 20 W; battery/enclosure/cage/wiper/cables nằm trong một gói USD 80 | Có phạm vi vật tư, chưa có capacity, exact package hoặc quote từng phần; 20 W không được coi là công suất đã kiểm đủ tải |
| Phương án thứ ba D8 | Mục 3 so AI + IoT, cùng sensing infrastructure và phần AI thêm | Đã biết Akai dùng AI + IoT; không hỏi lại. Không lấy điểm manual sampling trên website gán cho AI |
| Ai chịu nhiệm vụ field/reviewer? | Có vai trò cơ quan/nhóm/lab/ward ở mức proposed; không có Akai nhận vai nghiệm thu độc lập | Yêu cầu AKAI-28-REVIEW vẫn là việc hỏi vượt phân công và không tiếp tục sử dụng |

## Đối chiếu từng dòng BOM, không thay giá giữa các model

[CSV 13 dòng](akai-bom-reconciliation-2026-11-28.csv) lưu tám dòng mua/lắp và năm dòng OPEX đúng số trong tài liệu. Các số này là **giá trị dự toán nguồn cũ**, không là giá vừa xác minh từ nhà bán ngày 28/11.

| Dòng mục 2.3 | USD trong file | Bảng tham chiếu có nguồn hiện tại | Điều còn thiếu / cách xử lý |
| --- | ---: | --- | --- |
| LILYGO ESP32 + 4G + sạc | 49,78 | ESP32 HS2250V 195.000 VND + M.2 HS2164V 1.566.000 VND, carrier/anten chưa giá; LILYGO R2 là ứng viên so sánh | Akai không ghi revision/SKU. Q190/Q387 vừa tra là ứng viên, chưa được chứng minh là biến thể đứng sau USD49,78 |
| DFRobot industrial pH probe | 64,90 | SEN0169-V2 kit, USD64,90 lịch sử | Khớp giá và mô tả gần nhau chưa tự xác nhận exact SKU/kit contents hoặc đầu dò rời USD49,50 |
| DFRobot DO probe | 169,00 | RS485 fluorescence SEN0680, 4.428.000 VND | Không có SKU cho USD169 trong file; không đồng nhất công nghệ/giao tiếp hoặc consumables chỉ theo tên DO |
| DFRobot turbidity sensor | 9,90 | Industrial RS485 SEN0710, USD229 lịch sử | Hai mức giá/model khác nhau. Không giảm giá SEN0710 xuống USD9,90 hoặc đổi model chỉ vì trùng giá một listing khác |
| DFRobot waterproof temperature | 7,50 | DS18B20 HS2432V, 35.000 VND | Chỉ xác nhận chức năng nhiệt độ; exact SKU/cáp/package chưa có trong file |
| 20 W solar panel + charging kit | 46,99 | Bộ nguồn đầy đủ vẫn quote-required | Không coi panel/charging kit đã gồm battery/converter/protection hoặc không trùng sạc trên board |
| Battery, enclosure, cage, wiper, cables | 80,00 | Các dòng nguồn/hộp/gá/cáp chưa quote; glands tạm bốn chiếc có giá riêng | Khoản gom tạm tính. Phải tách/ghi phần đã gồm để không cộng battery/charger/glands hai lần |
| Installation labour | 40,00 | Công lắp/commissioning/initial calibration chưa quote | Giữ là giả định trong tài liệu nguồn, không đổi thành quote thi công Hà Nội |

## Kiểm số học của nguồn

- Thiết bị/vật tư: `49,78 + 64,90 + 169 + 9,90 + 7,50 + 46,99 + 80 = 428,07 USD/trạm`.
- Cộng lắp giả định USD40: **468,07 USD/trạm**; ba trạm **1.404,21 USD**.
- OPEX cũ: `49,50 + 60 + 18 + 10 + 5 = 142,50 USD/trạm/năm`; ba trạm **427,50 USD/năm**.
- Năm 1 ba trạm: `1.404,21 + 427,50 = 1.831,71 USD`.
- Ba năm ba trạm: `1.404,21 + 3 × 427,50 = 2.686,71 USD`.

Phép cộng của file **đúng theo đầu vào**, nhưng model, giá, scope dịch vụ và chi phí loại trừ chưa được xác minh đầy đủ. Không dùng 2.686,71 USD như ngân sách ba năm đã chốt. Community USD1.740 và AI+IoT USD4.006,71 là các kịch bản giả định nguồn, không quote hoặc bằng chứng điểm thiết kế.

## Nội dung đã được phản hồi mới thay thế

File Akai dùng cleaning hai tuần/24 lượt, OPEX USD60 và USD10/năm. Phản hồi Đạt mới chuyển sang testing sáu tháng, cleaning/check phần gộp, review theo tình trạng ở cuối kỳ; proposal Tuấn bổ sung full calibration theo model. Vì vậy không áp nguyên OPEX USD142,50 của file cũ cho lịch hiện hành.

Hiện worksheet dùng kỳ chung 36 tháng và ví dụ 0/6/6: 96 SIM-tháng, 36 hosting, 16 testing/6 đợt; pH 96 việc, full calibration báo riêng 80–96 tùy inclusions; độ đục 32 việc trong lịch ngày minh họa trước gộp sớm. Đây là cập nhật có nguồn mới hơn, không phải Akai cần tính lại hộ Bá Nguyên.

## Việc tiếp tục do Bá Nguyên tự xử lý

1. Dùng BOM Akai làm căn cứ **phạm vi thiết kế tích hợp và bốn kênh**; các model/package còn thiếu là phần tra cứu/đối chiếu của Bá Nguyên, không yêu cầu Akai nghiên cứu lại.
2. Giữ bảng giá có nguồn hiện tại dưới nhãn phương án tham chiếu khác. **43.369.904 VND** vẫn chỉ là thiết bị của phương án đó + reserve chung; không gọi là giá của BOM tích hợp trong file Akai.
3. So giá hoàn chỉnh A/B cùng cảm biến/giao/lắp và dịch vụ. Listing Q190/Q387 lưu riêng; không thay USD49,78 bằng một giá khác variant hoặc trộn FX cũ thành quote mới.
4. Không đổi số chỉ để hai bảng nhìn giống nhau. Khi chưa chứng minh exact model/package thì giữ unknown, ghi rõ phạm vi, không tạo giá/nguồn hoặc cam kết.
5. Không hỏi lại Akai D1, TDS có trong danh sách, có đo nhiệt độ, dùng integrated board hay phương án thứ ba. File đã trả lời mức này. Không gán Akai vai field reviewer, Đạt operator thật hoặc Tuấn payer.

Đã sửa ghi chú chờ sai tên trong các tài liệu hiện hành. Không sửa file gốc của Akai, comment GitHub, nhánh đồng đội; chưa commit/push hoặc gửi nhà cung cấp.
