# Bá Nguyên — gói bàn giao chi phí hiện hành, 28/11/2026

> **ĐÃ CÓ GÓI THAY THẾ — 28/11:** [Chi phí rút gọn, ngân sách kế hoạch 339.314.885 VND, lịch 36 chuyến và hồ sơ Word/AI](team-review/submission-closeout-2026-11-28/README.md). Những số partial, lịch và yêu cầu chờ trong tài liệu dưới đây là lịch sử khi khác gói mới; không chuyển tiếp như câu hỏi mới.


Người dùng đã yêu cầu bàn giao, đưa gói cập nhật lên branch Bá Nguyên và tự tìm/chọn số tham chiếu thay vì chờ Akai/Đạt. Gói này chỉ dành cho **feature/ba-nguyen-cost-analysis**; không thay main, final-website hoặc nhánh Tuấn, không merge/deploy hay đặt hàng. Không phát sinh câu hỏi mới giao cho đồng đội.

## Đọc và dùng đúng số

| Phạm vi | VND | Cách dùng |
| --- | ---: | --- |
| Thiết bị gốc Q190 / trạm | **13.933.146** | Số chính của bảng BOM và bộ tính gốc |
| Thiết bị gốc / hai trạm sau | **27.866.292** | Chỉ mua sau kiểm thử/duyệt lại giá |
| Ba trạm gốc | **41.799.438** | Dùng ở Home nếu chưa cộng reserve |
| Một kit pH dự phòng tùy chọn, chung dự án | **1.683.506** | Một lần; không nhân ba trạm/ba năm |
| Ba trạm gốc + một reserve | **43.482.944** | Subtotal gốc; không phải ngân sách đầy đủ |
| Sáu phụ kiện/nguồn tham chiếu bổ sung / trạm | **4.312.000** | Bảng 4b riêng; không thay subtotal gốc |
| Ba bộ phụ kiện/nguồn tham chiếu | **12.936.000** | Không nhân thêm ba năm |
| Ba chai dung dịch khởi đầu dùng chung | **1.048.000** | Hai buffer 500mL + một KCl 18mL; chưa đủ toàn kỳ |
| Thiết bị gốc + reserve + phụ kiện + dung dịch khởi đầu | **57.466.944** | Một kịch bản phần cứng đã định giá; chưa đủ CAPEX lắp đặt |
| Cùng kịch bản + SIM minh họa + hosting compute | **70.398.864** | Các phần đã có giá trong ví dụ 36 tháng; **chưa đủ lifecycle cost** |

Hai tổng 57.466.944 và 70.398.864 **đã chứa** 43.482.944; không cộng các tổng này với nhau. Tỷ giá 25.940 VND/USD là giả định ngân sách lịch sử ngày 19/11, không gọi là tỷ giá giao dịch ngày 28/11. Phép đổi làm tròn từng đơn giá trước khi nhân lượng.

## File dùng ngay

- [Bảng so và quyết định Q190](controller-decision-2026-11-28.md).
- [CSV thiết bị gốc theo đợt](selected-procurement-2026-11-28.csv).
- [Nghiên cứu bổ sung, nguồn và giới hạn](cost-additions-2026-11-28/README.md), [chín dòng giá và phạm vi](cost-additions-2026-11-28/price-scope.json).
- [CSV phụ kiện theo đợt](reference-cost-scenario-2026-11-28.csv), [model, công thức và sensitivity](reference-cost-scenario-2026-11-28.json).
- [Gói tích hợp website chung](team-review/cost-release-2026-11-28/README.md): hai patch theo đúng base, bốn file nguồn đã sửa, manifest/hash và kết quả trình duyệt.
- [Bàn giao cũ ba file](team-review/q190-integration-handoff-2026-11-28.md) chỉ là lịch sử; gói mới sửa thêm Home và bổ sung bảng tham chiếu.

## Đã tự chốt để lập dự toán

1. Q190 4MB là cấu hình chính; A/A-kit chỉ dùng so sánh. Không cộng thêm ESP32 hoặc modem rời.
2. Chọn bộ thành phần nguồn tham chiếu 100W / AGM 12V-40Ah / ST-H1210 / buck 5V, một hộp điện tử W300H400D200 và thẻ 32GB. Đây là lựa chọn dự toán, chưa là thiết kế đã test hoặc kit lắp hoàn chỉnh.
3. Dùng Connect8 và Render 7+6 USD làm **kịch bản giá**; chưa đăng ký dịch vụ. Ví dụ ngày cần 99 chu kỳ SIM 30 ngày, vẫn là 96 SIM-tháng lịch và 36 tháng hosting chung.
4. Giữ testing sáu tháng theo tuổi trạm; ví dụ 0/6/6 có 16 lượt kiểm/6 đợt, tuổi đóng kỳ 36/30/30. Giữ 96 việc pH ngoài commissioning; 80–96 báo riêng tùy full calibration thật sự bao trong testing. Có 32 việc độ đục theo lịch ngày trước gộp sớm; việc không bằng chuyến.
5. Không dùng giá hiệu chuẩn tại cửa hàng làm giá onsite. Không nhận công miễn phí, tài trợ, người vận hành, site permission hoặc SLA thay người khác.

## Những số không thể xác nhận bằng tra web

Ngân sách lắp đặt và lifecycle đầy đủ vẫn chưa xác định do thiếu giá đúng scope cho bảo vệ/khung/gá/cáp theo tuyến, hộp pin, thi công/đi lại, hiệu chuẩn và vật tư bổ sung, thay thế/sửa chữa, thu gom, thuế/phí giao hàng cụ thể và toàn bộ hosting. Các dòng này giữ **chưa xác định**, không đặt bằng 0 và không tạo một “mức trần” giả.

Chưa có số đo tải, nắng/che bóng, 4G hoặc nghiệm thu thực tế; các phép thử trên web là mô phỏng. Không cần chờ câu trả lời mới của Akai/Đạt để công bố bản dự toán đề xuất có nhãn và giới hạn này. Một báo giá hoặc kết quả thử thật xuất hiện sau sẽ là đầu vào cập nhật, không là nghĩa vụ mới của đồng đội.

Hồ sơ AI hiện có log tóm tắt, chưa có bản xuất/ảnh giao diện toàn bộ prompt/output. Không dùng screenshot trang giá thay bằng chứng cuộc trò chuyện.
