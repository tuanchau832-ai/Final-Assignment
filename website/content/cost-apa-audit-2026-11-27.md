# Rà APA phần Cost Analysis — 27/11/2026

Phạm vi: `08-cost-analysis.ts`, các References được phần này dùng và cách renderer hiển thị chúng. Đã đọc trực tiếp file UTS người dùng cung cấp: `C:\Users\admin\Downloads\Documents\APA Interactive Guide_2.pdf`, 154 trang. Số trang dưới đây là số trang PDF, trùng số in tại các mục được dùng. Không coi báo cáo này là duyệt APA toàn bộ bài của nhóm.

## Quy tắc áp dụng từ tài liệu UTS

| Trang / mục | Áp dụng |
| --- | --- |
| 44–45, 3.01–3.02 | Dẫn đúng tác giả, ngày trang, title và URL; không dùng copyright footer làm ngày xuất bản; nguồn thay đổi cần retrieval date; không lặp website khi trùng tác giả |
| 49, 3.06 | Comment có thể truy xuất: tên tác giả như hiển thị, ngày, 20 từ đầu nếu không có title và link đúng comment |
| 125, 11.05; 144, 14.02 | Đảo họ/chữ viết tắt với tác giả cá nhân; username được ghi cùng tên thật khi đã biết |
| 127, 11.07 | Cùng tác giả/cùng năm hoặc n.d. phải phân biệt a/b/c theo title; nhãn trong bài và danh mục phải khớp |
| 131, 12.02 | Nguồn trong cùng ngoặc theo thứ tự tác giả; nhóm nguồn cùng tác giả và giữ liên kết tới từng entry |
| 141, 13.02; 143, 14.01 | Alphabetical list, sentence case, thụt treo 1,27 cm; URL đúng nguồn. Không tự tạo DOI cho trang bán hàng |

## Lỗi / thiếu bằng chứng và cách sửa

| ID | Trước khi rà | Đã sửa / giới hạn |
| --- | --- | --- |
| APA-01 | Nguồn hiệu chuẩn pH mới chưa có entry và citation | Thêm `dfrobot-ph-calibration`, ngày **24/06/2026** theo Last revision; retrieval 27/11; cite ở đoạn lịch hiệu chuẩn |
| APA-02 | Tuổi thọ film DO dựa nguồn bán; chưa nối tới thông số hãng đã kiểm | Thêm `dfrobot-do-specifications`; nối claim tới manufacturer wiki; giữ nguồn Hshop cho giá mua |
| APA-03 | Thêm DFRobot cùng n.d. có thể làm suffix sai | DFRobot: pH listing n.d.-a; DO specifications n.d.-b; turbidity n.d.-c. Nguồn pH calibration có năm 2026 riêng; citation lấy chung Reference object |
| APA-04 | Nhiều nguồn cùng tác giả lặp tên với dấu chấm phẩy | Renderer nhóm cùng tác giả, phân cách năm bằng dấu phẩy; tác giả khác bằng dấu chấm phẩy; vẫn link riêng mỗi entry |
| APA-05 | NDH được đặt tên như bài cố định ngày 19/11, nhưng URL hiện hiển thị ngày 27/11 | Đổi entry thành bảng tỷ giá cập nhật, n.d. với retrieval 27/11. Văn bản nêu rõ phép tính dùng **hàng lịch sử ngày 19/11**, không giả ngày xuất bản hoặc thay tỷ giá |
| APA-06 | Tài liệu nội bộ mang title tổng hợp nhưng không có đường dẫn truy xuất | Dùng đúng README `Hanoi WaterWatch`, link immutable commit 22ef8234; ghi rõ simulated prototype |
| APA-07 | Lịch/scope bảo trì, dự phòng chung và điều kiện mua 1 + 2 không có trích dẫn gần claim | Cite comment Đạt và tài liệu trạm đầu của Tuấn tại các đoạn tương ứng. Các nguồn này là **team planning**, không phải báo giá hoặc field acceptance |
| APA-08 | Bibliography chưa có thụt treo; thêm entry dễ mất alphabetical order | Thêm CSS 1,27 cm; sắp danh mục theo author/date, no-date trước dated; title sentence case, giữ mã hàng và acronym |
| APA-09 | Tên “Tu dien nhua Viger” mất dấu; title Hshop DO thiếu phần tên đang hiển thị | Sửa title và tên Đại Hòa Phú theo nguồn; giữ ổn định ID để không gãy anchor |

Ngày comment Đạt trong entry là **26/11 theo timestamp UTC của GitHub**, tương ứng 27/11 tại Việt Nam. Tác giả `Nguyễn, T. Đ. [terrydatnguyen]` dùng tên nhóm đã cung cấp; entry Tuấn dùng `Chau, H. T. [tuanchau832-ai]` theo tên profile GitHub. Phần citation chỉ hiện họ, không lặp username. Tuấn có thể chuẩn hóa cách viết dấu tên cá nhân khi biên tập chung, không cần thay ID/URL.

Với turbidity, retrieval 27/11 phản ánh lần dùng trang cho hướng dẫn hiệu chuẩn mới. Giá 229 USD trong unit register vẫn ghi checked 19/11; hai trường ngày không đồng nghĩa. [Ảnh tỷ giá lịch sử](cost-evidence/accessories-2026-11-27/fx-history.png) chứng minh hàng 19/11 đã mở; đây vẫn là nguồn NDH dẫn lại ngân hàng, không phải quote FX trực tiếp từ Vietcombank.

## Kiểm tra và bàn giao

- Citation trong Cost Analysis phải có đúng một entry tương ứng; không có ID trùng, entry undefined hoặc anchor thiếu. Suffix Hshop a–e giữ thứ tự theo các title sau sửa.
- [Browser QA](team-review/browser-qa-2026-11-27.md) kiểm link citation tới nguồn pH mới, focus target, hiển thị thụt treo và bề rộng References ở 320/390/1440 px.
- `npm.cmd run check:links` và `npm.cmd run build` kiểm source sửa cuối; xem báo cáo bàn giao hiện hành cho kết quả.
- Các placeholder ở References/những section khác vẫn là việc biên tập toàn nhóm của Tuấn. Không lấy audit phần chi phí làm xác nhận đủ nguồn/4.000 từ toàn website.

Kiểm source sau sửa: **15 Reference IDs** đều được phần chi phí dùng và có entry/anchor tương ứng; không có undefined/ID trùng; suffix DFRobot/Hshop theo title đạt. Đếm thô theo khoảng trắng: **675 từ đoạn văn**, **1.243 từ bảng/caption/column labels**. Đây là số hỗ trợ Tuấn biên tập, chưa phải cách tính chính thức của học phần hoặc tổng từ của website cuối.

Tuấn cần port metadata/citation tương ứng sang `page.html/site.ts` của website cuối. Source proposal 7208280 chưa có các sửa APA này; các link evidence ở đó vẫn trỏ commit cũ 2a3fb2be. Không tự sửa nhánh Tuấn hoặc coi phiên bản live đã cập nhật.
