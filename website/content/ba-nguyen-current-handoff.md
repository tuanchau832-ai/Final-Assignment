# Bá Nguyên — bắt đầu đọc tại đây

Cập nhật 27/11/2026, giờ Việt Nam. Đây là trang chỉ mục hiện hành cho phần chi phí. Tài liệu lịch sử được giữ để truy vết; không dùng các hướng dẫn cũ để đặt hàng hoặc ghi ngân sách mới.

## Số liệu và cách hiểu đang dùng

| Nội dung | Cơ sở hiện tại | Trạng thái |
| --- | --- | --- |
| Quy mô | 3 trạm / 3 năm; mua thử 1 rồi xem xét 2 trạm sau nghiệm thu và duyệt lại giá | Working plan; kỳ kết thúc chung hay 36 tháng/trạm còn chờ |
| Thiết bị đã có giá | 13.895.466 VND/trạm; đợt 1 là 13.895.466; đợt 2 là 27.790.932; cộng 41.686.398 | Giá lịch sử 19–25/11; chưa đủ CAPEX |
| Dự phòng pH | **1 kit chung**, tùy chọn, 1.683.506 VND một lần | Không nhân ba trạm hoặc ba năm; storage/48 giờ chờ xác nhận |
| Thiết bị ba trạm + reserve chung | **43.369.904 VND** | Partial subtotal; không phải ngân sách lắp/vận hành đầy đủ |
| Testing | Baseline 6 chuyến chung / 18 lượt kiểm trạm trong ba năm | Route, giá và commissioning thực tế còn cần kiểm |
| Năm thứ ba | Review mòn/ăn mòn gộp lượt cuối; thay theo tình trạng, lỗi sớm xử lý sớm | Không phải thay toàn bộ linh kiện hoặc thêm một chuyến riêng |
| Hiệu chuẩn | Phải xét hướng dẫn model ngoài testing cơ sở | Không tự gán lịch/đơn giá; không coi sáu chuyến đã bao hết |
| Tỷ giá dùng trong subtotal | **25.940 VND/USD**, basis lịch sử 19/11 | Không phải tỷ giá mua USD hiện tại; đã lưu ảnh hàng lịch sử khi mở NDH 27/11 |
| Giá phụ kiện mới | Bảng ứng viên riêng ngày 27/11 | Chưa được chọn hoặc cộng vào BOM/tổng tiền |

## File dùng để làm tiếp

| Cần xem | File hiện hành |
| --- | --- |
| Phân tích phản hồi Tuấn, quyết định và người còn phải xác nhận | [Plan/review 27/11](tuan-response-plan-2026-11-27.md) |
| Giá theo 1 trạm → 3 trạm → 3 năm | [Rollup](cost-rollup-3stations-3years-2026-11-26.md), [CSV 30 dòng](cost-rollup-3stations-3years-2026-11-26.csv) |
| Hai đợt mua và dự phòng chung | [CSV 1 + 2](staged-procurement-2026-11-27.csv) |
| Kỳ vận hành khi mua lệch đợt | [Ba ví dụ commissioning](commissioning-cost-basis-2026-11-27.csv), chỉ để kiểm logic |
| Lịch baseline và biên bản dự kiến | [18 lượt kiểm](maintenance-schedule-2026-11-27.csv), [checklist](maintenance-acceptance-template-2026-11-27.md) |
| Chuẩn bị hỏi nhà cung cấp | [RFQ cùng phạm vi A/B](supplier-quote-request-template.md) |
| Rà APA riêng phần chi phí | [Danh sách lỗi và sửa đổi](cost-apa-audit-2026-11-27.md) |
| Kiểm giao diện và calculator | [Báo cáo kèm ảnh](team-review/browser-qa-2026-11-27.md) |
| Giá/phạm vi phụ kiện mới | [Bảng đọc nhanh](accessory-candidates-2026-11-27.md), [CSV nguồn](accessory-candidates-2026-11-27.csv) |

## Những nội dung đã bị thay thế

| Nội dung cũ | Cách đọc hiện tại |
| --- | --- |
| 24/26 lượt vệ sinh + 12 hiệu chuẩn được tính như lịch vận hành | Lịch/kịch bản cũ; không dùng làm scope hoặc giá mới. Tần suất hiệu chuẩn cuối vẫn cần xét model |
| USD 142,50 / 147,50 mỗi trạm/năm; các tổng USD 6.105,70 / 6.155,70 | Ví dụ BOM/lịch cũ, không phải OPEX hoặc tổng của phương án hiện tại |
| 3 kit pH reserve = 5.050.518 VND; subtotal 46.736.916 VND | Kịch bản dự phòng cũ; case mới là một kit chung. **5.050.518 VND cho ba kit pH lắp ban đầu vẫn là dòng hợp lệ**, không nhầm với reserve |
| Bản patch summary trỏ commit 556fb6e | Bằng chứng sửa logic lịch sử; proposal Tuấn 7208280 là bản đã review mới hơn. Không áp patch cũ máy móc |
| Chờ Đạt trả lời gộp cleaning/review | Đạt đã trả lời; chỉ hỏi các thông số, giá và nguồn lực còn thiếu |
| Tuấn tự chốt BOM/site/operator/payer | Không phải phân công gốc. Akai phụ trách thiết kế, Đạt triển khai, Bá Nguyên chi phí; Tuấn references/editing và phần tích hợp/data do bạn ấy đề xuất |

Các file `ba-nguyen-work-plan.md`, `cost-analysis-handoff.md`, `ba-nguyen-decisions-2026-11-25.md`, `ba-nguyen-next-steps-2026-11-26.md` và `team-replies-ready-2026-11-25.md` có khối lịch sử được thu gọn. `cost-scenarios-2026-11-25.csv` và patch cũ giữ nguyên làm chứng cứ lịch sử; không dùng để chốt chi phí mới.

## Việc đã làm và phần còn chờ

Bốn việc độc lập ngày 27/11 đã thực hiện: sửa APA/citation phần chi phí; kiểm Chrome thật với màn hình giả lập; đánh dấu lịch sử; tìm và lưu giá/phạm vi phụ kiện. Kết quả kiểm và giới hạn nằm ở các báo cáo tương ứng. Không có giá mới nào tự động thay subtotal hiện tại.

Kiểm source cuối: `check:links` đạt 12 routes; TypeScript/Vite build đạt; 15 Reference IDs khớp citation và suffix. Kiểm tương tác/bề rộng ở năm cấu hình trình duyệt đạt; xem ảnh phát hiện chữ số calculator desktop bị tách dòng. Bản vá CSS riêng đạt 12/12 ca trước/sau và `git apply --check`, chưa được tích hợp vào source Tuấn. Hồ sơ giá/rollup/đợt mua/horizon CSV hiện tại được giữ nguyên.

| Đầu mối | Cần cung cấp để khép phần chi phí |
| --- | --- |
| Akai / nhóm thiết kế | BOM/rule cuối, TDS có cần không, connector/interfaces và suitability; lựa chọn A/B sau so cùng phạm vi |
| Đạt, phối hợp Akai về model | Site/permission, tải điện đo, commissioning/horizon, lịch hiệu chuẩn và thresholds; operator/backup |
| Bá Nguyên + nhà cung cấp được giao | Quote giao/lắp/dịch vụ cùng scope, phụ kiện đúng đầu nối, VAT/phí vận chuyển, điều kiện mua 1 + 2 |
| Tuấn | Rà APA/word count chung; port metadata, review/áp [patch số tiền xuống dòng](team-review/tuan-calculator-number-wrap.patch), cập nhật link hồ sơ cũ; không coi QA bản sao là đã deploy |
| Nhóm / bên có quyền cam kết | Payer, nguồn lực và SLA 48 giờ; duyệt mua sau acceptance |

Chỉ chỉnh source nhánh `feature/ba-nguyen-cost-analysis`. Bá Nguyên đã cho phép commit/push gói audit này và thông báo cho Tuấn, Akai, Đạt trong PR #3. Bản vá calculator là đề xuất để Tuấn review/tích hợp; không sửa các nhánh Tuấn, final-website hoặc main và không coi website live đã nhận các sửa đổi.
