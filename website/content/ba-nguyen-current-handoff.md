# Bá Nguyên — bắt đầu đọc tại đây

> **ĐÃ CÓ GÓI THAY THẾ — 28/11:** [Chi phí rút gọn, ngân sách kế hoạch 339.314.885 VND, lịch 36 chuyến và hồ sơ Word/AI](team-review/submission-closeout-2026-11-28/README.md). Những số partial, lịch và yêu cầu chờ trong tài liệu dưới đây là lịch sử khi khác gói mới; không chuyển tiếp như câu hỏi mới.


> **GÓI BÀN GIAO MỚI NHẤT:** [Số liệu, phụ kiện và patch bốn file](publication-handoff-2026-11-28.md). Phần mô tả “local/chưa publish” phía dưới ghi trạng thái lượt rà trước; dùng gói phát hành này cho bàn giao hiện tại. Không còn chờ câu trả lời mới của Akai/Đạt để hoàn thiện bản đề xuất.


**Lựa chọn mới sau người dùng giao quyền so sánh/chọn:** dùng **B — LILYGO Q190** làm cơ sở dự toán chính. [So sánh chi phí/OPEX/khả thi/ưu nhược và quyết định](controller-decision-2026-11-28.md). Thiết bị **13.933.146 VND/trạm**, hai trạm sau **27.866.292**, ba trạm + một reserve **43.482.944 VND partial**. Dùng giả định 25.940 VND/USD từ 19/11, làm tròn từng đơn giá. Chưa là đơn mua/field acceptance; **43.369.904 là case A cũ**, không còn số chính.

**Kết quả mới nhất:** [bản hoàn thiện sau tự tra nguồn](ba-nguyen-completion-2026-11-28.md), [bảng so cấu hình và scope còn thiếu](current-cost-comparison-2026-11-28.csv), [APA bổ sung](cost-apa-audit-2026-11-28.md). Đã kiểm 15 listing ngày 28/11; thêm giá ứng viên FIT0348, SIM 30 ngày và hosting. Không còn việc chờ Akai/Đạt để viết xong phân tích; quote, field evidence và cam kết thật vẫn chưa có.

Cập nhật sau phản hồi Tuấn `ea4cce0a`, 28/11/2026. **Đọc [tự trả lời từng câu hỏi](ba-nguyen-self-answers-2026-11-28.md) và [plan tự xử lý hiện hành](ba-nguyen-self-review-plan-2026-11-28.md).** Gói đã publish trước là 54d29cc2; các sửa lượt tự rà này local, chưa commit/push/đăng comment.

**Đã làm rõ tài liệu:** người dùng xác nhận Akai nói BOM trong file Expanded MD đã gửi, không có file riêng tên BOMZ. Đã đọc lại và [đối chiếu 13 dòng BOM/OPEX](akai-bom-reconciliation-2026-11-28.md); không còn chờ tìm tài liệu. BOM Akai mô tả LILYGO tích hợp và bốn kênh; SKU/package/giá còn phải phân biệt với bảng tham chiếu có nguồn.

## Cơ sở đang dùng để hoàn thiện phần chi phí

| Nội dung | Kết luận hiện tại | Giới hạn |
| --- | --- | --- |
| Phạm vi | Tối đa ba trạm trong kỳ chung 36 tháng; mua thử 1 rồi xét 2 sau nghiệm thu/duyệt quote | Basis đề xuất, không là ngày/đơn mua thật |
| Thiết bị B chọn để dự toán | 13.933.146 VND trạm đầu, 27.866.292 hai trạm sau; cộng 41.799.438 | Giá kiểm 28/11, quy đổi bằng giả định lịch sử 25.940; chưa là quote giao/lắp hoặc chứng minh exact BOM Akai |
| pH reserve chung | Một kit tùy chọn 1.683.506 VND một lần | Không nhân theo trạm/năm; chưa có kho/người trực/cam kết 48 giờ |
| Subtotal B + một reserve | **43.482.944 VND** | Không là ngân sách giao/lắp/vận hành đầy đủ; case A 43.369.904 chỉ để so |
| Ví dụ 0/6/6 | 96 SIM-tháng, 36 shared hosting, 16 kiểm/6 đợt | Ngày minh họa. 108/18 là so sánh cùng bắt đầu |
| Đóng kỳ | Rà ba trạm tuổi 36/30/30 trong ví dụ | Chỉ ST-01 đạt age36; không tự thay hết hoặc thêm chuyến trùng |
| Calibration | 96 việc pH: 16 trùng lịch testing, 80 ngoài lịch | Full calibration **báo riêng 80–96 việc**, tùy inclusions thật. Không tự trừ 16 “calibration checks” |
| SEN0710 | 32 việc trong lịch 90 ngày minh họa trước gộp sớm | Tính lại hạn sau service sớm; số việc không bằng số chuyến |
| Rule / DS18B20 / TDS | Proposal trạm đầu Report rule, giữ DS18B20, hoãn TDS; code mô phỏng khớp ý nghĩa này | BOM Akai có bốn kênh và không liệt kê TDS, nhưng không ghi exact DS18B20 hoặc SKU đầu đo |
| LILYGO R2 mới tra | Q190 4 MB 69,34 USD được chọn để lập dự toán; Q387 16 MB 94,32 USD là phương án tăng flash | Không chọn Q387 khi chưa có yêu cầu/benchmark; không phê duyệt mua. Default 65,31 USD là E-H Q210 |
| Phụ tùng pH mới tìm | FIT0348 đầu dò rời 49,50 USD | Giá đã kiểm; tương thích với exact SEN0169-V2/revision và số thay chưa chốt, không đổi reserve một kit |
| Native-currency comparison | A / B / A-kit cùng cảm biến; bảng 4a trên website, chọn B để dự toán | Không phê duyệt mua, không trộn hai tiền tệ hoặc cộng trùng modem; chưa chứng minh OPEX/TCO B thấp nhất |
| SIM/hosting ứng viên | Viettel 8.000 VND/30 ngày; Render compute 13 USD/system-month | Ví dụ ngày cần 99 chu kỳ SIM, không phải 96 chu kỳ; compute chưa gồm storage/usage/broker/support |
| Source Tuấn | PORT/CAL/EDIT đã có trong `feature/tuan-pilot-closeout@ea4cce0a` | Tự kiểm source/browser; không hỏi làm lại. final-website vẫn ee0502ca |

## File dùng để làm tiếp

| Nội dung | File |
| --- | --- |
| Quyết định và procurement chính B | [So sánh/quyết định](controller-decision-2026-11-28.md), [CSV B theo đợt](selected-procurement-2026-11-28.csv) |
| Gói port số B sang source tích hợp | [Bảng trước/sau và giới hạn](team-review/q190-integration-handoff-2026-11-28.md), [patch ba file](team-review/q190-cost-update-for-tuan-2026-11-28.patch); chưa áp nhánh Tuấn/final/main |
| Bản hoàn thiện hiện hành | [Report](ba-nguyen-completion-2026-11-28.md), [CSV so cấu hình](current-cost-comparison-2026-11-28.csv), [model](current-cost-comparison-2026-11-28.json) |
| Nguồn/ảnh giá mới và kiểm cuối | [15 listing](cost-research-2026-11-28/price-verification.csv), [ảnh dịch vụ](cost-research-2026-11-28/service-screenshots.json), [browser QA](team-review/completion-2026-11-28/browser-results.json) |
| BOM Akai đã xác định / đối chiếu | [Report](akai-bom-reconciliation-2026-11-28.md), [CSV](akai-bom-reconciliation-2026-11-28.csv), [nguồn nguyên văn](team-review/akai-design-cost-comparison-source-2026-11-28.md) |
| Tự trả lời từng AKAI/DAT và D1–D8 cũ | [Report chi tiết có nguồn](ba-nguyen-self-answers-2026-11-28.md) |
| Thứ tự công việc / ranh giới phân công | [Plan hiện hành](ba-nguyen-self-review-plan-2026-11-28.md) |
| Kiểm source mới / ảnh / giới hạn | [Review ea4cce0a](team-review/tuan-ea4cce0a-check-2026-11-28.md) |
| Listing variants mới và source checks | [CSV](self-research-2026-11-28/listing-candidates.csv), [quan sát nguồn/ảnh](self-research-2026-11-28/source-observations.json) |
| Công thức lượng và inclusions chưa biết | [Worksheet](pilot-service-basis-2026-11-28.json), [service quantities](service-rfq-quantities-2026-11-28.csv) |
| Testing/calibration minh họa | [16 checks](maintenance-common36-2026-11-28.csv), [lịch ngày](calibration-calendar-example-2026-11-28.csv), [checklist không gán tên](maintenance-acceptance-template-2026-11-27.md) |
| Giá lịch sử case A / hai đợt mua cũ | [Rollup A](cost-rollup-3stations-3years-2026-11-26.md), [staged procurement A](staged-procurement-2026-11-27.csv); không dùng làm số chính B |
| Chuẩn bị hỏi giá | [RFQ](supplier-quote-request-template.md), [thư mẫu](supplier-rfq-package-2026-11-28.md), [bảng nhận quote A/B](supplier-quote-comparison-2026-11-28.csv) |

## Những yêu cầu không tiếp tục giao cho đồng đội

- **Akai:** không yêu cầu nhận vai reviewer/nghiệm thu phần cứng; không yêu cầu nghiên cứu lại model đã chuyển đầu mối. Dùng BOM và phần thiết kế trong Expanded MD đã đọc lại.
- **Đạt:** không mặc định là operator thật hoặc giao đi đo site, tìm nhà bán, ký cam kết thay một đơn vị triển khai. Đọc và sử dụng phần kế hoạch/test đã có.
- **Tuấn:** ghi nhận phần APA/editing và việc tích hợp đã làm; không yêu cầu tự quyết funding, operator hoặc field acceptance.
- **Bá Nguyên:** tự tra giá, nguồn, quantities, uncertainty, quote scope và tổng hợp; không chuyển những việc này thành blocker của người khác.

Các lời đề xuất nhận vai trong hồ sơ cũ không trở thành nghĩa vụ. Các tin nhắn trong plan cũ đã được đánh dấu lịch sử; không forward như yêu cầu mới. Comment GitHub hiện có chưa được sửa theo yêu cầu người dùng.

## Chứng cứ chưa có, không được tự điền

| Thiếu gì | Xử lý hiện tại |
| --- | --- |
| Exact SKU/package trong BOM Akai | Tài liệu đã có; tự tra/đối chiếu phần model và quote, không chờ Akai gửi lại hoặc tự coi model suy đoán đã được chọn |
| Báo giá giao/lắp/dịch vụ | Bá Nguyên có RFQ và contact công khai tự tra; chưa có giá chính thức, không gọi listing là quote |
| Site/permission/ngày vận hành/tải/4G | Giữ Proposed/TBD; dùng ví dụ có nhãn cho dự toán. Không tạo số đo/GPS/chữ ký |
| Operator/backup/kho/signatory/payer/SLA | Vai trò triển khai thật chưa được chỉ định/nhận; không gắn tên người trong lớp |
| Phương án C AI + IoT so với matrix manual sampling | Ghi lệch nguồn trong report; không tự chấm lại thiết kế hoặc dùng score manual cho AI |

Những thiếu hụt trên giới hạn cam kết triển khai thật; vẫn có thể hoàn thiện báo cáo thiết kế đề xuất và dự toán minh bạch theo template. Chỉ sửa local `feature/ba-nguyen-cost-analysis`; không sửa source nhánh Tuấn/final/main, không gửi tin/email hoặc deploy.
