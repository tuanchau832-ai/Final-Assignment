# Bá Nguyên — bắt đầu đọc tại đây

Cập nhật 28/11/2026, giờ Việt Nam. Đọc [plan và việc đã làm 28/11](ba-nguyen-next-steps-2026-11-28.md), [review source mới](team-review/tuan-closeout-review-2026-11-28.md) và [khối lượng RFQ](service-rfq-quantities-2026-11-28.csv). Bá Nguyên đã cho phép commit/push gói này lên nhánh được giao và thông báo trên [PR #3](https://github.com/tuanchau832-ai/Final-Assignment/pull/3); việc tích hợp/deploy website cuối vẫn tách riêng.

## Số liệu và cách hiểu đang dùng

| Nội dung | Cơ sở hiện tại | Trạng thái |
| --- | --- | --- |
| Quy mô | Tối đa 3 trạm trong **một kỳ 36 tháng chung từ trạm đầu**, mua 1 rồi xem xét 2 sau nghiệm thu/duyệt giá | Tuấn đã chọn basis dự toán ở 687557b1; ngày thực tế, BOM và duyệt triển khai còn chờ |
| Thiết bị có giá | 13.895.466 VND/trạm; đợt 1 là 13.895.466; đợt 2 là 27.790.932; cộng 41.686.398 | Giá lịch sử 19–25/11; chưa đủ CAPEX |
| pH dự phòng | Một kit chung tùy chọn 1.683.506 VND, một lần | Không nhân trạm/năm; storage/48 giờ chưa xác nhận |
| Thiết bị + reserve chung | **43.369.904 VND** | Partial subtotal, chưa là ngân sách giao/lắp/vận hành đủ |
| SIM / hosting | Ví dụ 0/6/6: **96 SIM-tháng, 36 hosting-tháng chung** | 108 SIM-tháng là so sánh cùng bắt đầu; ngày 0/6/6 chưa được đặt |
| Testing | Ví dụ 0/6/6: **6 đợt, 16 lượt kiểm trạm** | Đợt tháng 6 kiểm một trạm; các đợt 12/18/24/30/36 kiểm ba trạm; route/giá còn chờ |
| Đóng kỳ | Ba project-close reviews gộp lượt cuối | Chỉ ST-01 tuổi 36 tháng; ST-02/03 tuổi 30 trong ví dụ. Thay theo tình trạng, lỗi sớm xử lý sớm |
| Hiệu chuẩn | pH hằng tháng, SEN0710 trong 90 ngày, ngoài commissioning | Ví dụ 96 việc pH, trong đó 16 có thể gộp testing, 80 ngoài testing; lịch ngày minh họa có 32 việc độ đục trước gộp sớm. Không phải số chuyến |
| Rule / TDS | Proposal trạm đầu dùng Report rule, hoãn TDS, giữ DS18B20 | Kỹ thuật/nhóm còn duyệt; không phải field acceptance |
| Tỷ giá trong subtotal | 25.940 VND/USD, basis lịch sử 19/11 | Không phải tỷ giá mua USD hiện tại; không đổi giá chỉ vì ngày review mới |
| Phụ kiện mới | 14 dòng ứng viên trong hồ sơ 27/11 | Chưa tự chọn hoặc cộng vào BOM |

## File dùng để làm tiếp

| Cần xem | File |
| --- | --- |
| Plan, kết quả đã làm, chờ đúng người và tin nhắn soạn sẵn | [Plan 28/11](ba-nguyen-next-steps-2026-11-28.md) |
| Review diff / giao diện mới | [Review/QA 687557b1](team-review/tuan-closeout-review-2026-11-28.md), [patch đúng kiến trúc mới](team-review/tuan-closeout-followup-2026-11-28.patch) |
| Bảng giá từng trạm / ba trạm | [Rollup giá lịch sử](cost-rollup-3stations-3years-2026-11-26.md), [CSV 30 dòng: số lượng dịch vụ cùng bắt đầu](cost-rollup-3stations-3years-2026-11-26.csv) |
| Mua 1 + 2 / một reserve chung | [Staged procurement](staged-procurement-2026-11-27.csv) |
| Khối lượng theo kỳ chung, không dùng nhầm baseline | [RFQ quantities](service-rfq-quantities-2026-11-28.csv), [worksheet tính lại](pilot-service-basis-2026-11-28.json) |
| Testing theo offset / hiệu chuẩn theo ngày minh họa | [16 lượt kiểm](maintenance-common36-2026-11-28.csv), [lịch calibration](calibration-calendar-example-2026-11-28.csv) |
| Checklist / mẫu xin giá | [Checklist](maintenance-acceptance-template-2026-11-27.md), [RFQ A/B](supplier-quote-request-template.md) |
| Gói chuẩn bị gửi nhà cung cấp | [Nội dung thư và file đính kèm](supplier-rfq-package-2026-11-28.md), [CSV để điền/so giá A/B](supplier-quote-comparison-2026-11-28.csv); bên nhận chưa được cung cấp |
| APA phần chi phí | [Audit 27/11](cost-apa-audit-2026-11-27.md); reference kế hoạch trên website đã trỏ 687557b1 ngày 28/11 |
| Phụ kiện/ảnh nguồn | [Bảng đọc nhanh](accessory-candidates-2026-11-27.md), [CSV](accessory-candidates-2026-11-27.csv), [ảnh và hash](cost-evidence/accessories-2026-11-27/README.md) |

Ngày 01/01/2027 trong lịch hiệu chuẩn chỉ là gốc kiểm phép tính, không phải lịch triển khai. 90 ngày không luôn bằng ba tháng lịch; gộp sớm phải tính lại hạn. Phần đã bao trong quote testing chỉ được trừ khi nhà cung cấp xác nhận thực hiện đầy đủ công/chuẩn đó. Không giả định mượn thiết bị tham chiếu miễn phí.

## Những hướng dẫn đã được thay thế

| Nội dung cũ | Cách đọc hiện tại |
| --- | --- |
| 24/26 cleaning, 12 calibration và USD 142,50/147,50; tổng USD 6.105,70/6.155,70 | Kịch bản BOM/lịch cũ, không dùng giá này cho lịch mới. Lịch pH tháng hiện có căn cứ hãng/RFQ riêng |
| Ba reserve pH 5.050.518; subtotal 46.736.916 | Kịch bản dự phòng cũ. **5.050.518 cho ba kit pH lắp ban đầu vẫn đúng**, không nhầm với reserve |
| 108 SIM-tháng / 18 kiểm là mặc định cho mua lệch đợt | Chỉ đúng cùng bắt đầu; ví dụ 0/6/6 trong kỳ chung là 96/16 |
| Chờ Tuấn chọn common horizon | Đã có lựa chọn 36 tháng chung cho dự toán; chỉ còn ngày thực tế/duyệt scope |
| Patch summary 556fb6e hoặc calculator 7208280 | Chỉ cho source cũ. final mới ee0502ca/687557b1 dùng thẻ chi phí tĩnh; patch calculator không áp |
| Tất cả ba trạm đủ 36 tháng tuổi tại đóng dự án | Không đúng cho 0/6/6; hai trạm mới 30 tháng |
| Tuấn tự chốt BOM/site/operator/payer | Không phải phân công gốc. Akai thiết kế, Đạt triển khai, Bá Nguyên chi phí; Tuấn references/editing và tích hợp/data do bạn ấy đề xuất |

Các file work-plan/decisions/handoff cũ có khối lịch sử thu gọn; đọc chỉ mục này trước. [Comparison 26/11](final-website-vs-ba-nguyen-2026-11-26.md) kiểm snapshot a85be4e, không phải trạng thái final mới ee0502ca. [QA calculator 27/11](team-review/browser-qa-2026-11-27.md) giữ làm bằng chứng lịch sử.

## Việc còn chờ

| Đầu mối | Cần cung cấp |
| --- | --- |
| Đạt, phối hợp Akai | Ngày commissioning/site được phép, tuyến, tải/4G đo, lịch ngày calibration, operator chính/dự phòng; không hỏi lại D5 đã trả |
| Akai / nhóm kỹ thuật | Duyệt Report rule và BOM/interfaces/nguồn, ngưỡng/tiêu chí/người ký nghiệm thu. Những phân vai mới chưa được người nhận xác nhận |
| Bá Nguyên + đầu mối nhà cung cấp được giao | Quote A/B cùng scope, VAT/freight/lead time/warranty, công/chuẩn/travel và điều kiện giao 1 + 2 |
| Tuấn | Rà/port patch đúng cấu trúc mới, APA/word count chung, gửi commit/bản xem sau tích hợp; không áp patch calculator cũ |
| Nhóm/bên có quyền cam kết | Payer, nguồn lực và cam kết 48 giờ, duyệt mua đợt 2 sau nghiệm thu |

Chỉ sửa nhánh **feature/ba-nguyen-cost-analysis**. Website của nhánh cá nhân được sửa trực tiếp; source Tuấn/final/main không bị sửa. Bản sao local đúng 687557b1 dùng để kiểm và chuẩn bị patch. Không có URL deploy được xác nhận; không coi preview local là website đã publish.
