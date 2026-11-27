# Kế hoạch tiếp theo của Bá Nguyên — 26/11/2026

> **BẢN HIỆN HÀNH: [Bá Nguyên — bắt đầu đọc tại đây](ba-nguyen-current-handoff.md).** Các hướng dẫn phía dưới được lưu theo thời điểm, không phải danh sách việc/câu hỏi hiện tại. Đặc biệt: 24/26 lượt và ba kit pH reserve đã bị thay thế; không áp lại giá hoặc gửi câu hỏi cũ.

<!-- BA-NGUYEN-HISTORY-BOUNDARY -->
<details>
<summary>Kế hoạch 26/11 đã được thay bởi các phản hồi 27/11 (lịch sử; bấm để xem)</summary>


> Đã có [kế hoạch cập nhật sau phản hồi Đạt ngày 27/11](dat-response-plan-2026-11-27.md). Lịch/scope đã được xác nhận: 6 chuyến testing chung trong 3 năm, 18 lượt kiểm trạm, gộp vệ sinh/kiểm tra hiệu chuẩn và review tháng 36. Những mục dưới đây ghi “chờ overlap” không còn là câu hỏi mở; model/threshold/operator/site/giá và thỏa thuận chi trả vẫn chờ.

Tài liệu bàn giao Đạt/Tuấn: [bảng đối chiếu final-website và bản hiện tại](final-website-vs-ba-nguyen-2026-11-26.md), gồm các mục khớp, cần sửa và chờ model/báo giá.

## Quyết định đã có và giới hạn

Akai xác nhận **3 trạm/3 năm** trong [comment PR #3](https://github.com/tuanchau832-ai/Final-Assignment/pull/3#issuecomment-7188129413). Đây là phạm vi chính để chuẩn bị bảng chi phí; bản website cuối vẫn cần Tuấn/Đạt đồng bộ. Akai giao Đạt/Tuấn xác nhận model và nguồn điện, đồng thời hỏi Thư về phần linh kiện liên quan. Akai muốn so sánh HWW với cả hai phương án thay thế, có tiêu chí và điểm số rõ ràng. Góp ý của Đạt được Bá Nguyên chuyển tiếp: **kiểm tra chức năng/bảo dưỡng 6 tháng/lần; ở năm thứ ba rà linh kiện cũ hoặc ăn mòn để quyết định thay**. Chi tiết ở [quyết định cập nhật](ba-nguyen-decisions-2026-11-25.md).

Không suy ra 26 lượt vệ sinh/năm từ hai lần kiểm tra chức năng/năm. Các bảng USD 142,50/năm, 147,50/năm, 6.105,70 và 6.155,70 là ví dụ theo lịch cũ và BOM chưa chốt; không dùng làm giá vận hành cho lịch mới. Khoản chưa có nguồn vẫn là `Quote required`.

## Giai đoạn 1 — tự làm ngay: khóa bản kiểm soát (30–60 phút)

Đã lập [bảng chi phí 1 trạm → 3 trạm → 3 năm](cost-rollup-3stations-3years-2026-11-26.md) và [CSV 28 dòng](cost-rollup-3stations-3years-2026-11-26.csv): subtotal mua ban đầu tham chiếu 41.686.398 VND cho ba trạm; dự phòng pH tùy chọn 5.050.518 VND ghi riêng; dịch vụ và linh kiện chưa giá vẫn để cần báo giá. Đây là bảng kiểm soát theo BOM hiện có, chưa khóa BOM/ngân sách cuối.

1. Ghi một bảng gốc theo **mỗi trạm × 3 trạm × 3 năm**. Tách CAPEX mua sắm/lắp đặt, OPEX mỗi năm, kiểm tra chức năng 6 tháng/lần, vệ sinh/hiệu chuẩn chưa chốt, chi phí năm thứ ba theo tình trạng, và thải bỏ. Không nhân khoản chung của hệ thống như hosting ba lần khi chưa biết cách tính.
2. Lập danh sách từng dòng BOM hiện tại và BOM Akai/Đạt: model, revision, giao tiếp, số lượng, phụ kiện, nguồn giá, VAT, vận chuyển, tình trạng xác nhận. Đánh dấu rõ những dòng phải bỏ nếu dùng LILYGO thay ESP32 + modem M.2.
3. Giữ bảng giá 19–25/11 là chứng cứ **giá niêm yết đúng model được quan sát**, không áp cho model thay thế. Kiểm lại ngày/đồng tiền/tỷ giá trước khi đưa vào bảng chính.
4. Đổi câu chữ trên phần Bá Nguyên: nêu phạm vi 3/3 là phương án chính, tách kiểm tra 6 tháng và thay theo tình trạng ở mốc 3 năm. Bảng một trạm/12 tháng hiện có chỉ là đơn vị tham chiếu, chưa là tổng pilot.

**Xong khi:** mọi dòng có trạng thái `verified listing / internal allowance / quote required / team decision pending`, không còn mô tả 26 lượt là lịch bảo dưỡng đã chốt.

## Giai đoạn 2 — chốt kỹ thuật với nhóm (cần phản hồi, làm song song với giai đoạn 1)

| Người | Cần trả lời cụ thể | Đầu ra dùng được |
| --- | --- | --- |
| Đạt + Tuấn | D2: SKU/revision và số lượng pH, DO, turbidity, nhiệt độ, board/4G; carrier/antenna, RS485; model nào bỏ/thêm khi dùng LILYGO | BOM cuối có link/datasheet và ảnh package |
| Đạt + Tuấn | D3: tải W/Wh, chu kỳ đo/gửi, panel, pin Ah/Wh, controller, converter, bảo vệ và số ngày dự phòng | Sơ đồ nguồn và danh sách mua đủ thành phần |
| Đạt | D4: vị trí, quyền lắp, tuyến cáp, kích thước hộp, gá/che chắn, chống sét, điều kiện an toàn | Scope thi công để hỏi giá |
| Đạt | D5: checklist kiểm tra sáu tháng; có cần vệ sinh/hiệu chuẩn riêng, tần suất bao nhiêu; có gộp chuyến không; sau lũ xử lý thế nào; tiêu chí thay ở năm 3 | Lịch dịch vụ và yêu cầu báo giá không đếm trùng |
| Tuấn | D1/D7: cập nhật summary, implementation và calculator 3 trạm/3 năm; port patch đúng source; gửi bản build/xem được | Website cuối cùng một phạm vi, số khớp |
| Tuấn + Akai | D8: tên/giới hạn hai phương án thay thế, tiêu chí, trọng số/điểm và bằng chứng cho kết luận HWW | Matrix so sánh có thể kiểm tra |
| Thư | Những linh kiện hoặc kết luận chi phí nào được dùng trong recommendations; phản hồi nếu phần Thư đang dùng BOM khác | Recommendations không mâu thuẫn |

Nếu chưa trả lời được, yêu cầu ghi `TBD | người phụ trách | việc phải kiểm | ngày dự kiến`, không đoán model hoặc giá.

## Giai đoạn 3 — lấy báo giá và tính lại (sau khi có D2–D5)

1. Gửi yêu cầu báo giá cho **3 trạm/3 năm**, tách giá từng model và gói đầy đủ: nguồn điện, hộp/cáp/gá, carrier/antenna, vận chuyển/VAT, lắp đặt, đào tạo, SIM/hosting.
2. Xin riêng chi phí **2 lần kiểm tra chức năng/trạm/năm** (18 lần trong 3 năm cho 3 trạm), checklist, công/đi lại, vật tư và việc nào được gộp. Xin đơn giá cho vệ sinh/hiệu chuẩn nếu Đạt xác nhận vẫn cần; không tự cộng 26 + 12 + 2 thành các chuyến độc lập.
3. Tại năm 3, ghi **chi phí đánh giá mòn/ăn mòn** và một danh mục linh kiện có thể cần thay với đơn giá, số lượng dự phòng và tiêu chí kích hoạt. Chỉ đưa chi phí thay vào tổng dự kiến nếu có giả định minh bạch; nếu chưa biết, ghi kịch bản/`Quote required`, không tuyên bố thay toàn bộ.
4. Tính lại `qty × unit price`, CAPEX, OPEX từng năm, ba năm và khoản chung; đối chiếu tất cả số trong Cost Analysis, summary, calculator và evidence register. Gắn nhãn VAT, tỷ giá/ngày, khoản loại trừ và payer đề xuất.

**Xong khi:** mỗi tổng có đủ phạm vi hoặc được gọi rõ là subtotal; cùng một scope, BOM và lịch dịch vụ ở mọi trang.

## Giai đoạn 4 — QA và bàn giao

1. Kiểm link, build, các phép tính và bảng trên desktop/mobile. Tuấn cung cấp kết quả QA của source `final-website`; Bá Nguyên rà số/câu chữ, đặc biệt summary và 3 năm OPEX.
2. Kiểm APA 7 theo tài liệu UTS cho các nguồn giá, datasheet và ảnh; thêm caption và chỉ dẫn trong bài. Lưu bảng chứng cứ, báo giá, ngày mở và ảnh prompt/output AI theo yêu cầu bài.
3. Gửi Thư và Tuấn đúng kết luận chi phí đã kiểm, kèm khoản còn thiếu; nhờ nhóm xác nhận trước khi dùng trong report cuối.

**Điều kiện hoàn tất:** không còn xung đột 3/3 với 10/1, không có giá khác model, lịch sáu tháng và năm ba được phản ánh đúng, các tổng không che khoản thiết yếu chưa báo giá.

</details>
