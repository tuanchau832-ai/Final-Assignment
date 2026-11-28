# Gói chuẩn bị xin hai báo giá A/B — Bá Nguyên, 28/11/2026

Mục đích: nhận giá thiết bị và dịch vụ theo cùng phạm vi cho dự toán coursework Hanoi WaterWatch. Đây là yêu cầu thông tin/báo giá, không là đơn đặt hàng, xác nhận ngân sách hoặc lịch lắp. **Bên nhận và kênh liên hệ thực tế chưa được cung cấp; gói này chưa được gửi tới nhà cung cấp.**

## File dùng khi gửi

1. [RFQ chi tiết](supplier-quote-request-template.md): cấu hình, phụ kiện, giao/lắp, dịch vụ và điều kiện loại trừ.
2. [Bảng để nhà cung cấp điền giá A/B](supplier-quote-comparison-2026-11-28.csv): hai phương án tách biệt; mọi ô giá còn trống, không phải 0.
3. [Khối lượng dịch vụ](service-rfq-quantities-2026-11-28.csv): kỳ 36 tháng chung, ví dụ 0/6/6. Số lượt công không bằng số chuyến đi.
4. [Thiết bị có giá lịch sử](staged-procurement-2026-11-27.csv) và [phụ kiện ứng viên](accessory-candidates-2026-11-27.csv): chỉ làm căn cứ đối chiếu, không thay quote của bên nhận.
5. [Lịch testing minh họa](maintenance-common36-2026-11-28.csv), [hiệu chuẩn theo ngày minh họa](calibration-calendar-example-2026-11-28.csv), [checklist nghiệm thu](maintenance-acceptance-template-2026-11-27.md).

## Nội dung có thể gửi ngay sau khi có bên nhận

**Tiêu đề:** Xin báo giá tham khảo hai cấu hình trạm giám sát nước A/B, giao theo đợt 1 + 2 tại Hà Nội

Kính gửi [tên nhà cung cấp/đơn vị tích hợp],

Tôi là Bá Nguyên, phụ trách dự toán dự án học phần Hanoi WaterWatch. Nhờ quý đơn vị báo hai phương án riêng biệt dưới đây với cùng cảm biến, phạm vi giao/lắp và dịch vụ. Giai đoạn này xin giá tham khảo và các điều kiện kỹ thuật; chưa phải đơn đặt hàng.

- **A:** ESP32 Vietduino HS2250V + SIM7600G-H-M.2 HS2164V. Báo thêm carrier, anten/cáp, nguồn modem và công kiểm tích hợp nếu chưa nằm trong gói.
- **B:** LILYGO T-SIM7600G-H R2, CH9102, bản ESP32. Xác nhận revision/package, module, anten, dây và các phần nguồn/giao tiếp thực đi kèm. Không dùng giá của biến thể khác làm giá cho R2 này.
- **Cảm biến chung:** pH SEN0169-V2, DO SEN0680 nước ngọt, độ đục SEN0710, DS18B20; RS485/interface và phụ kiện tương thích với mỗi board. Trạm đầu đề xuất dùng Report rule, chưa mua TDS.
- **Mua theo đợt:** báo riêng một trạm giao/lắp đầu tiên; hai trạm còn lại chỉ mua sau nghiệm thu và duyệt lại giá. Một pH kit tương thích dùng chung là tùy chọn báo riêng, mua một lần.
- **Nguồn/hộp/gá:** xin đầy đủ panel, battery, controller/converter, bảo vệ, hộp/seal/glands, dây, rack/cage/mounting theo tải và site xác nhận sau. Khi chưa đủ dữ liệu để báo trọn gói, xin ghi giả định và báo đơn giá thiết bị/dịch vụ trước, không tự chọn công suất chỉ vì tài liệu minh họa ghi 20 W.
- **Dịch vụ:** commissioning/hiệu chuẩn ban đầu; testing sáu tháng theo tuổi trạm; pH hằng tháng; SEN0710 trong 90 ngày từ lần hiệu chuẩn trước; trực/sửa theo yêu cầu 48 giờ; công/đi lại/chuẩn/vật tư/phụ tùng/thu gom. Ghi rõ khoản đã bao trong gói và phần còn tính thêm.
- **Khối lượng để so sánh:** ví dụ bắt đầu 0/6/6, kết thúc chung tháng 36 cho 96 SIM-tháng, 36 hosting-tháng, 16 lượt kiểm trong 6 đợt. Có 96 việc pH hằng tháng và 32 việc độ đục theo lịch ngày minh họa trước điều chỉnh gộp sớm, ngoài commissioning. Đây là cơ sở so giá, chưa là ngày đặt lịch hoặc số chuyến hiệu chuẩn thêm. Xin xác nhận phần full calibration thực sự đã nằm trong testing trước khi trừ.

Vui lòng điền model/revision, số lượng, đơn vị tính, đơn giá VND (hoặc tiền gốc được nêu rõ), VAT, phí giao/nhập khẩu, công lắp, thời hạn báo giá, lead time, bảo hành và các khoản loại trừ trong file so sánh. Nếu một dòng đã nằm trong gói khác, đánh dấu và dẫn ID dòng gói; không tính trùng. Với giá gói, vui lòng ghi dòng tổng gói riêng kèm danh sách bao gồm, không vừa tính cả gói vừa cộng các thành phần.

Site cụ thể, ngày commissioning, sơ đồ nguồn, tải/4G và người vận hành còn chờ xác nhận. Nhờ quý đơn vị nêu dữ liệu cần thêm để chuyển giá tham khảo thành báo giá giao/lắp chính thức. Chi phí trọn kỳ 36 tháng chỉ được chốt sau khi khép các khoản thiếu.

Trân trọng,

Bá Nguyên — Hanoi WaterWatch

[Email/số liên hệ do Bá Nguyên cung cấp khi gửi]

## Cách tiếp nhận và xử lý phản hồi

| Việc | Cách làm |
| --- | --- |
| Lưu chứng cứ | Giữ nguyên PDF/email báo giá có người gửi, mã báo giá, ngày, hiệu lực và phần bao gồm; không thay bằng ảnh giá trang sản phẩm |
| Điền CSV | Một dòng cho mỗi hạng mục của A hoặc B. Giữ tiền/đơn vị gốc; ghi tỷ giá có nguồn/ngày nếu cần quy đổi. Không nhập 0 khi chưa biết |
| Giá đã gồm | Nếu một dòng nằm trong gói, ghi `included_in_row_id`, chỉ cộng giá gói một lần. Nếu không phù hợp cấu hình, ghi lý do loại và vẫn giữ nguyên bản quote |
| Kiểm so cùng scope | Cùng cảm biến, hiệu chuẩn, điều kiện giao/lắp, dịch vụ, VAT/freight/warranty. Không so module-only A với full-kit B mà bỏ phụ kiện A |
| Chốt số lượng | Dùng ngày vận hành thực và phương án gộp công được xác nhận; không biến 32 việc độ đục thành 32 chuyến |
| Cập nhật ngân sách | Bá Nguyên kiểm `quantity × unit price`, tách CAPEX/OPEX/lifecycle, khoản chung/theo trạm; sửa website và evidence register sau khi có giá/phạm vi |
| Phê duyệt | Chọn phương án và đặt hàng chỉ sau kỹ thuật/nhóm và người có quyền chi chấp thuận. Tuấn rà/tích hợp website, không tự cam kết chi hoặc field SLA |

Chưa gửi RFQ cho bất kỳ bên nhận nào trong gói này. Chưa có báo giá mới để thay tổng 43.369.904 VND của thiết bị lịch sử + reserve tùy chọn; con số đó vẫn là partial subtotal.
