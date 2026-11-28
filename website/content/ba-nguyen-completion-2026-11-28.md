# Bá Nguyên — kết quả hoàn thiện phần chi phí ngày 28/11/2026

> **ĐÃ CÓ GÓI THAY THẾ — 28/11:** [Chi phí rút gọn, ngân sách kế hoạch 339.314.885 VND, lịch 36 chuyến và hồ sơ Word/AI](team-review/submission-closeout-2026-11-28/README.md). Những số partial, lịch và yêu cầu chờ trong tài liệu dưới đây là lịch sử khi khác gói mới; không chuyển tiếp như câu hỏi mới.


> **GÓI BÀN GIAO MỚI NHẤT:** [Số liệu, phụ kiện và patch bốn file](publication-handoff-2026-11-28.md). Phần mô tả “local/chưa publish” phía dưới ghi trạng thái lượt rà trước; dùng gói phát hành này cho bàn giao hiện tại. Không còn chờ câu trả lời mới của Akai/Đạt để hoàn thiện bản đề xuất.


**Quyết định mới nhất:** người dùng yêu cầu tự so và chọn phương án có lợi nhất. Đã chọn **LILYGO Q190 làm cơ sở dự toán** sau [so chi phí, OPEX, khả thi và ưu/nhược](controller-decision-2026-11-28.md). Số chính hiện hành: **13.933.146 VND/trạm; 43.482.944 VND/ba trạm + một reserve (partial)**. [Procurement B](selected-procurement-2026-11-28.csv). Các số A phía dưới là đối chiếu lịch sử, không thay số chính B. Chưa phê duyệt mua hoặc chứng minh TCO thấp nhất.

Đây là bản đọc hiện hành sau khi người dùng xác định BOM trong file Akai đã gửi và yêu cầu tự nghiên cứu, không chờ Akai/Đạt. Đã đọc lại READMEFIRST, phân công README, tài liệu UTS APA, hồ sơ nguồn cũ và toàn bộ 22 comment của PR #3. Phản hồi mới nhất vẫn là Tuấn [7235294127](https://github.com/tuanchau832-ai/Final-Assignment/pull/3#issuecomment-7235294127). Không phát sinh yêu cầu mới cho đồng đội.

Mục tiêu đã thực hiện là hoàn thiện **báo cáo thiết kế và dự toán có nguồn**, không chứng nhận một pilot đã lắp hoặc tự tạo hợp đồng/nguồn tài trợ. Mọi sửa đổi trong lượt này vẫn local trên `feature/ba-nguyen-cost-analysis`.

## Kết quả theo thứ tự công việc

| Việc | Kết quả |
| --- | --- |
| Đọc đúng BOM | [Đã lưu nguồn và đối chiếu](akai-bom-reconciliation-2026-11-28.md); không còn chờ “BOMZ” |
| Tìm model/giá thay vì hỏi lại | 15 listing đã mở trực tiếp trên Chrome, đối chiếu giá và mã hàng/variant; [CSV](cost-research-2026-11-28/price-verification.csv), [JSON và hash ảnh](cost-research-2026-11-28/price-verification.json) |
| Tách cấu hình để tránh cộng trùng | Ba phương án cùng bộ cảm biến, giữ hai tiền tệ riêng: [CSV](current-cost-comparison-2026-11-28.csv), [JSON công thức/giới hạn](current-cost-comparison-2026-11-28.json) |
| Làm rõ OPEX | Đã tìm giá công khai Viettel và Render; tính riêng chu kỳ 30 ngày, hosting chung và scope chưa bao gồm |
| Sửa nội dung website | Bảng 4 cập nhật nguồn/giới hạn; thêm bảng 4a so cấu hình; giá lịch sử VND không bị thay sang giá của BOM Akai |
| APA | Bổ sung năm nguồn, sửa suffix DFRobot và ngày truy xuất của giá đã kiểm; [audit mới](cost-apa-audit-2026-11-28.md) |
| Kiểm tra | Kết quả build/link/math và [browser evidence](team-review/completion-2026-11-28/browser-results.json) ghi riêng; không coi giả lập màn hình là test điện thoại thật |

## Những câu hỏi về BOM đã tự nghiên cứu được

| Số trong file Akai | Nguồn nhà sản xuất đã tìm | Kết luận và tác động chi phí |
| --- | --- | --- |
| DO 169 USD | [SEN0237-A](https://www.dfrobot.com/product-1628.html) | Khớp giá và loại thiết bị nên là **ứng viên suy ra**, chưa chứng minh exact SKU Akai đã chọn. Đây là galvanic/analog, khác SEN0680 fluorescence/RS485. Cần dung dịch nạp không có trong kit; hãng nêu thay dung dịch mỗi tháng và màng thường xuyên hơn trong nước bẩn. Không dùng lịch consumables của cảm biến optical cho nó |
| Độ đục 9,90 USD | [SEN0189](https://www.dfrobot.com/product-1394.html) | Khớp giá; đầu trên probe không chống nước, đầu ra analog/digital; không coi tương đương SEN0710 IP68 ngâm lâu dài. Không thay giá SEN0710 bằng 9,90 USD |
| Nhiệt độ 7,50 USD | [KIT0021](https://www.dfrobot.com/product-1354.html) | Kit gồm DFR0198 DS18B20, adapter và cáp. Có cơ sở nhận diện ứng viên chứa DS18B20, **không gán tác giả đã chốt SKU**. Dây kit hãng ghi 4 mm: nếu chọn kit này thì không mặc định PG13.5 có dải 6/7–12 mm sẽ kín. Không áp thông số dây KIT0021 sang probe Hshop chưa có OD |
| pH electrode 49,50 USD | [FIT0348](https://www.dfrobot.com/product-1074.html) | Đã tìm được giá đầu dò rời và package H-101, không còn là “chưa tìm thấy bất kỳ giá đầu dò rời”. Chưa chứng minh tương thích đúng transmitter/revision SEN0169-V2, lead time hoặc số lần thay; giữ ứng viên, không tự thay reserve một kit thành đầu dò rời |
| LILYGO 49,78 USD | [Variant Q190](https://lilygo.cc/en-us/products/t-sim7600?variant=42358717972661) | Không tìm được căn cứ coi 49,78 là giá hiện hành của R2 cụ thể. Q190 4 MB đang 69,34 USD, Q387 16 MB 94,32 USD; chọn đúng variant, không dùng giá default E-H. Hai mức mới là listing, chưa là quote giao Hà Nội |
| Solar kit 46,99 USD; gói pin/hộp/gá/cáp 80 USD; công 40 USD | Nguồn Akai chưa có exact SKU/quote | Giữ **giả định nguồn cũ**. Các ứng viên nguồn/hộp/cáp đã nghiên cứu ở [bảng phụ kiện](accessory-candidates-2026-11-27.csv) không được cộng thành bộ nguồn hoàn chỉnh khi thiếu rail/capacity hoặc khác chemistry |

### Giới hạn nguồn điện và phụ kiện đã kiểm được từ hãng

[Tài liệu hãng LILYGO](https://github.com/Xinyuan-LilyGO/LilyGo-Modem-Series/blob/main/docs/en/esp32/sim7600-esp32/README.MD) nêu USB-C 5 V, solar 5–6 V, sạc tối đa 500 mA và pin một cell Li-ion/LiPo 3,7 V, đầy 4,2 V. Solar sạc pin, không cấp board qua cổng này khi thiếu pin. Không đấu bình AGM12 V hoặc nguồn khác chemistry vào cổng sạc đó; không coi board cung cấp sẵn rail 10–30 V cho hai probe RS485.

Panel 20 W mới là đề xuất; nameplate không thay được tính tải, giới hạn sạc, tổn hao, che bóng và autonomy. Hai probe 0,2 W đã cần 9,6 Wh/ngày nếu chạy liên tục; còn board/modem, chuyển nguồn và thiết bị khác. Không chọn dung lượng pin hoặc cam kết vận hành từ mỗi thông số panel.

Trang LILYGO liệt kê board, một SIM antenna, một GPS antenna, power cable và headers; cell/panel không nằm trong danh sách đó. Không tự cộng lại modem/board rời, cũng không coi antenna trong kit đã là bộ anten ngoài trời/diversity đầy đủ.

## Mỗi trạm → ba trạm → kỳ ba năm

Các giá dưới đây kiểm 28/11, chưa chiết khấu, giữ VND và USD riêng; dấu “+” là hai phần của cùng một khoản, **không phải hai báo giá thay thế**. Các trạm dùng cùng SEN0169-V2, SEN0680, SEN0710, DS18B20 Hshop, một RS485 converter tham chiếu và bốn glands tạm tính.

| Cấu hình so sánh | Thiết bị có giá / trạm | Thiết bị có giá / ba trạm | Giới hạn chính |
| --- | ---: | ---: | --- |
| A: ESP32 + module M.2 | 6.271.700 VND + 293,90 USD | 18.815.100 VND + 881,70 USD | Chưa carrier/antennas và scope chung bên dưới |
| B: LILYGO Q190 tích hợp — chọn để dự toán | 4.510.700 VND + 363,24 USD | 13.532.100 VND + 1.089,72 USD | Thay cả board và modem rời; vẫn thiếu nguồn probe, housing và tích hợp |
| A-kit: ESP32 + Waveshare 21707 | 4.705.700 VND + 407,89 USD | 14.117.100 VND + 1.223,67 USD | Full kit thay module/carrier/antennas; không cộng lại HS2164V. UART với ESP32/nguồn vẫn phải kiểm |
| Reserve tùy chọn | Một kit 64,90 USD | Vẫn một kit 64,90 USD cho cả dự án | Không nhân ba trạm hoặc ba năm; không cộng đồng thời FIT0348 như reserve đã mua |

**CAPEX không nhân ba năm.** Đối chiếu lịch sử riêng: A tại 25.940 VND/USD ngày 19/11 cho 13.895.466 VND/trạm; ba trạm và một kit dự phòng bằng **43.369.904 VND**. Tỷ giá đó không được gọi là tỷ giá ngày 28/11. Không áp số này cho B hoặc gọi nó là tổng triển khai.

Phần chưa giá gồm hộp/độ kín sau gia công, nguồn đầy đủ, cáp/gá/cage/wiper theo site, giao hàng/thuế/phí, lắp/commissioning/đào tạo, calibration công/vật tư/di chuyển, bảo trì, consumables, ứng phó sự cố, software/SMS/lab và thải bỏ. `totalInstalledCapex` và `totalThreeYearLifecycleCost` trong model giữ **null**, không phải 0.

## Giá vận hành có nguồn và cách tính đúng đơn vị

[Trang Viettel IoT](https://iot.viettel.vn/) công khai Connect8, mã M8_64KB: **8.000 VND/30 ngày**, tốc độ 64/64 Kbps; còn có Connect18/25. Chưa xác minh điều kiện thuê bao, VAT, phí kích hoạt, khả năng truyền tải/tín hiệu tại site; chưa chọn plan.

Ví dụ ngày gốc **01/01/2027**, trạm sau **01/07/2027**, đóng kỳ **01/01/2030**; đây không phải lịch thi công:

| Đại lượng | Năm 1 | Năm 2 | Năm 3 | Tổng |
| --- | ---: | ---: | ---: | ---: |
| Tháng lịch hoạt động cộng các SIM | 24 | 36 | 36 | **96** |
| Chu kỳ 30 ngày mua đầu kỳ theo ví dụ | 27 | 36 | 36 | **99** |
| Tiền listing Connect8 nếu chọn và mua liên tục | 216.000 | 288.000 | 288.000 | **792.000 VND** |
| Tháng hosting dùng chung | 12 | 12 | 12 | **36** |
| Testing từng trạm / số đợt | 4 / 2 | 6 / 2 | 6 / 2 | **16 / 6** |

ST-01 hoạt động 1.096 ngày cần 37 chu kỳ; ST-02/03 mỗi trạm 915 ngày cần 31 chu kỳ. Công thức `ceil(số ngày hoạt động / 30)` giả định thanh toán trước cả chu kỳ, không hoàn phần thừa; billing/activation thật cần điều kiện nhà cung cấp. Không thay “96 tháng lịch” bằng “99 tháng”; hai đơn vị khác nhau.

[Render pricing](https://render.com/pricing) niêm yết compute web 0.5C-512MB **7 USD/tháng** và Postgres 0.1C-256MB **6 USD/tháng**: phần compute **13 USD/hệ thống/tháng**, **468 USD/36 tháng**. Chưa gồm database storage, egress/usage, MQTT broker nếu riêng, support, thuế/phí; chưa kiểm tải/retention nên không chọn tier hoặc hứa tổng hosting chỉ 13 USD. Không nhân shared hosting ba lần. [Bằng chứng package/dịch vụ](cost-research-2026-11-28/package-service-observations.json), [ảnh giá](cost-research-2026-11-28/service-screenshots.json).

Lịch pH vẫn 96 việc, 16 trùng testing: báo riêng **80–96 full calibrations** theo phần nhà cung cấp thực sự bao gồm; 32 việc SEN0710 là lịch 90 ngày minh họa trước gộp sớm, không là 32 chuyến. Ba review đóng kỳ tuổi 36/30/30 gộp testing cuối; thay linh kiện theo tình trạng, lỗi sớm xử lý sớm. Không quay lại 24/26 chuyến cleaning hoặc 142,50 USD/năm của nguồn cũ.

## Phần không thể xác minh bằng tìm kiếm công khai

Không còn việc chờ Akai hay Đạt để hoàn thiện bản phân tích này. Những điểm sau là **giới hạn của triển khai thật**, không được biến thành câu hỏi mới giao sai vai:

- Báo giá giao/lắp/dịch vụ theo site, phụ tùng optical DO, công hiệu chuẩn, disposal và SLA: chưa có quote; đã chuẩn bị [RFQ](supplier-quote-request-template.md) và [bảng nhận quote](supplier-quote-comparison-2026-11-28.csv). Giá ứng viên không điền vào cột supplier quotation.
- GPS cửa xả/quyền lắp, mực lũ, che bóng, cable schedule và tải/4G thực: chưa có chứng cứ được phép dùng; không giả số đo từ dữ liệu bản đồ.
- Operator, kho reserve, người ký nghiệm thu và payer: chưa có cam kết. Không tự gán tên người trong lớp hoặc nhận tài trợ thay họ.
- Phê duyệt mua hàng và xuất bản repo: chưa được yêu cầu trong lượt này. Không commit/push/comment/deploy; không sửa main hoặc nhánh đồng đội.
- AI record hiện là [log tóm tắt](ai-use-self-review-2026-11-28.md); chưa có ảnh giao diện toàn bộ cuộc trò chuyện/prompt-output. Không dùng ảnh trang giá hoặc ảnh website thay ảnh prompt/output mà môn yêu cầu.

## Kiểm tra và cách tái tạo bảng

Chạy trong `website`:

```powershell
node scripts/current-cost-comparison.mjs --check
node tests/check-current-cost-comparison.mjs
node tests/check-pilot-service-basis.mjs
npm.cmd run check:links
npm.cmd run build
```

Generator đọc các giá `verified_listing`, giữ tiền theo cents nguyên, tách currencies, loại việc cộng hai modem và giữ unknown totals. Native comparison không quy đổi; lựa chọn B có phép quy đổi giả định lịch sử riêng, làm tròn đơn giá trước khi nhân. `--check` xác nhận hai CSV/JSON/bảng website khớp dữ liệu, không ghi file. Lệnh không có `--check` tái tạo bốn file đầu ra khi cập nhật nguồn đã được kiểm.

Browser mới kiểm riêng source nhánh Bá Nguyên với hai bảng 10/6 cột, citation và menu; xem [kết quả và hash ảnh](team-review/completion-2026-11-28/browser-results.json). Kiểm calculator của source Tuấn `ea4cce0a` đã có ở [report trước](team-review/tuan-ea4cce0a-check-2026-11-28.md); lượt này không sửa hoặc nhận bản live/nhánh của Tuấn đã chứa dữ liệu mới.
