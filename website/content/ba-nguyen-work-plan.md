# Kế hoạch phần việc Bá Nguyên — Cost Analysis

Cập nhật: 19/11/2026. Nhánh làm việc: `feature/ba-nguyen-cost-analysis`. Tài liệu này là kế hoạch cá nhân; mọi thay đổi hiện ở máy, chưa được duyệt để đăng.

## Phạm vi được giao

Theo `website/README.md`, Bá Nguyên xác nhận danh mục thiết bị với Akai, đối chiếu kế hoạch triển khai với Đạt và viết chi phí mua sắm, vận hành, bảo trì, thay thế, số lượng, đơn giá, nguồn, ngày kiểm tra và bên dự kiến chi trả. Chuyển nguồn và bằng chứng cho Tuấn; chuyển các kết luận chi phí đã xác nhận cho Thư.

## Tình trạng hiện tại

| Việc | Trạng thái | Bằng chứng / giới hạn |
| --- | --- | --- |
| Bản nháp Cost Analysis, bảng BOM và ghi chú nguồn | Đã có ở máy | `src/content/sections/08-cost-analysis.ts`, `content/cost-price-evidence.csv`, `content/evidence-register.csv` |
| Kiểm tra giá niêm yết và phép tính | Đã làm bước đầu | 13.895.466 VND mua sắm đã có giá và 15.578.972 VND gồm provision pH. Đây là subtotal chưa gồm các khoản thiết yếu khác. |
| Kiểm tra link, TypeScript và build | Đã chạy, đạt | Kết quả lưu trong `content/cost-analysis-handoff.md`; chạy lại sau mọi sửa đổi tiếp theo. |
| Độ dài phần văn xuôi Cost Analysis | Đã rút gọn | 363 từ theo đếm tự động; gần mục tiêu 350 từ, không tính bảng hay references. |
| Giả lập màn hình điện thoại 390 × 844 | Đã chạy, đạt | Chưa thay thế được phép thử trên điện thoại thật. |
| Manifest nguồn giá | Đã có ở máy | `content/cost-evidence/README.md` liên kết từng mã hàng, URL, giá, VAT và dòng CSV tương ứng. |
| Ảnh trang giá và ảnh prompt/output AI | Chưa tập hợp | Manifest ghi đúng tên ảnh cần lưu, nhưng chưa có bộ ảnh/PDF lưu kèm. |
| Cấu hình vật lý, báo giá nhà cung cấp và người trả tiền | Chờ nhóm và nhà cung cấp | Không gọi subtotal là tổng CAPEX/OPEX hoặc tổng chi phí thí điểm. |

## Team confirmation requests — please comment in this file

### Akai — detailed design and hardware

1. Confirm the final sensor BOM: retain, remove or replace pH SEN0169-V2, DO SEN0680, turbidity SEN0710, DS18B20, ESP32 and the TTL-to-RS485 converter.
2. Confirm whether SIM7600G-H-M.2 is the intended modem. If yes, provide the compatible M.2 B-key carrier, LTE antenna connector/type and modem power requirement. If no, provide the final modem board/model and its included accessories.
3. Confirm whether the station uses mains power or solar. For solar, state the minimum panel, battery, controller and DC-conversion requirement once the expected load is known.
4. Identify any component that must be added to the physical BOM and any simulation-only item that must be excluded.

### Dat — implementation and operations

1. State the proposed site or the assumptions required to select it, including permission and safe access for installation and maintenance.
2. State the enclosure location, cable-route length, sensor mounting method, exposure to water/corrosion and any grounding or protection requirement.
3. Confirm the proposed power option, expected shading if solar is used, signal-coverage check and commissioning/acceptance activities.
4. Propose the 12-month inspection, cleaning and calibration frequency, including who operates the station and who responds to incidents.
5. Identify what installation, field work, training or maintenance work must be obtained as a supplier quotation.

Please reply below the relevant question with either a confirmed choice, a source/model or the label `TBD` plus the information needed to decide. Bá Nguyên will update the cost register after the response is recorded.

## Buổi 1 — Khóa danh mục và sửa bằng chứng (ưu tiên cao, 1–2 giờ)

1. Xác nhận nhánh bằng `git status --short` và `git branch --show-current` trước khi sửa; giữ toàn bộ thay đổi chưa commit.
2. Gửi Akai danh mục pH SEN0169-V2, DO SEN0680, turbidity SEN0710, DS18B20, ESP32, RS485, SIM7600 M.2. Hỏi mã hàng nào được chốt, nguồn cấp và giao tiếp từng phần, và SIM7600 M.2 có thực sự phù hợp ESP32 không.
3. Gửi Đạt câu hỏi về địa điểm được phép lắp, chiều dài dây, cách gá, điện lưới hay solar, số lần hiệu chuẩn/kiểm tra, quy trình nghiệm thu và người vận hành.
4. Rà lại giá 305.000 VND của hộp Viger: trang có nhiều kích cỡ. Việc này đã được thực hiện: giá chuyển thành tham khảo chưa cộng vào subtotal. Chỉ cộng sau khi xác định được biến thể chính xác. Xác nhận bốn cable glands PG13.5 có đúng đường kính và số đường cáp.
5. Chụp trang từng giá đang dùng (mã hàng, giá, VAT, ngày/giờ), lưu thành bằng chứng cá nhân có tên khớp `price-001`...`price-009`; với giá USD lưu cả tỷ giá và phép nhân. Nếu trang không còn hiển thị giá, đổi trạng thái nguồn thay vì giữ nhãn đã kiểm chứng.

Đầu ra: BOM được Akai đối chiếu, câu hỏi kỹ thuật cho Đạt và bộ ảnh nguồn giá. Có thể tự làm bước 1, 4, 5 ngay; bước 2–3 cần câu trả lời nhóm.

## Buổi 2 — Thu đủ giá và báo giá (2–4 giờ tìm kiếm, thời gian chờ báo giá riêng)

1. Sau khi có công suất và địa điểm, chọn đúng model panel, battery, charge controller, DC converter, bảo vệ nguồn, hộp, dây, đầu nối và gá. Ghi từng thành phần; không gọi các linh kiện rời là “solar kit” hoàn chỉnh.
2. Xác định carrier tương thích M.2 B-key, anten đầu nối phù hợp và nguồn đáp ứng dòng modem, hoặc xin Akai duyệt một modem dạng board đã gồm carrier và anten. Không cộng đồng thời module M.2 và board thay thế.
3. Xin ít nhất hai báo giá khả thi cho các nhóm quan trọng: nguồn, modem/phụ kiện, lắp đặt/hiệu chuẩn và bảo trì. Xin thêm phí SIM, hosting, vật tư thay DO, thu gom/thải bỏ. Yêu cầu rõ đơn vị, số lượng, VAT, giao hàng, lắp đặt, bảo hành và hạn giá.
4. Cập nhật `cost-price-evidence.csv` theo trạng thái: giá niêm yết, báo giá nhận được, ước tính nội bộ hoặc chưa có giá. Lưu file báo giá và ngày nhận; giữ những khoản không có căn cứ ở trạng thái “cần báo giá”.

Đầu ra: bảng giá kiểm tra lại được và danh sách khoản vẫn chưa báo giá. Việc tìm sản phẩm và soạn yêu cầu báo giá có thể tự làm; cấu hình cuối cùng phụ thuộc Akai/Đạt và nhà cung cấp.

## Buổi 3 — Hoàn thiện bài viết và rubric (1–2 giờ sau khi có thông tin)

1. Đối chiếu từng hàng `số lượng × đơn giá`, chi phí tháng × 12, số lần kiểm tra × số lượt; tính CAPEX, OPEX và lifecycle chỉ khi phạm vi chi phí đã đủ. Đồng bộ mọi số trong văn bản, bảng và evidence register.
2. Viết lại phần Cost Analysis gần mục tiêu 350 từ cho phần văn xuôi, nếu cách loại trừ bảng được tài liệu chính thức cho phép; rà giới hạn 4.000 từ toàn báo cáo với Tuấn.
3. Kiểm APA 7 theo tài liệu UTS: tên tác giả/tổ chức, ngày, URL trực tiếp, chữ nghiêng, trích dẫn trong bài và danh mục. Đảm bảo mỗi con số và thông số quan trọng truy về đúng nguồn.
4. So rubric Excellent: cấu trúc, nghiên cứu, câu chữ, quá trình thiết kế; nối chi phí với tiêu chí cộng đồng, thiết kế của Akai, kế hoạch Đạt và khuyến nghị Thư. Giữ mọi cam kết tài trợ ở dạng đề xuất tới khi được xác nhận.

Đầu ra: bản Cost Analysis có các tổng có phạm vi chính xác, danh sách kiểm rubric và danh sách vấn đề còn mở. Nếu thiếu báo giá, giữ subtotal hiện có với giới hạn nêu rõ.

## Buổi 4 — Kiểm tra và bàn giao (1–2 giờ)

1. Chạy `npm.cmd run check:links` và `npm.cmd run build` từ `website` sau sửa đổi cuối.
2. Thử `/pages/cost-analysis` trên điện thoại thật cùng Wi-Fi. Ghi tên máy, trình duyệt, kích thước màn hình, khả năng cuộn đủ cột của bảng, mức đọc của chữ/số, tràn ngang toàn trang, menu và liên kết References; chụp lỗi nếu có. Địa chỉ IP/port cần lấy lại từ `ipconfig` và Vite vào lúc thử, không dùng địa chỉ cũ như địa chỉ cố định.
3. Gửi Tuấn `cost-analysis-handoff.md`, CSV nguồn giá, ảnh giá, các báo giá, kết quả test và ảnh prompt/output AI. Gửi Thư các con số đã được nhóm duyệt và các giới hạn cần nhắc trong Recommendations.
4. Chạy `git diff --check`, `git status --short`, `git diff --stat`; rà chỉ có file thuộc phần việc. Đợi Bá Nguyên cho phép trước mọi commit, push, PR hoặc xuất bản.

Đầu ra: gói bàn giao có thể kiểm tra và danh sách việc vẫn cần quyết định từ nhóm.

## Thứ tự nếu chỉ có một giờ

Kiểm tra nhánh → hỏi Akai về modem và danh mục → xác minh biến thể/giá hộp Viger → chụp ba giá đắt nhất (turbidity, DO, pH) → gửi Đạt danh sách thông số địa điểm còn thiếu.
