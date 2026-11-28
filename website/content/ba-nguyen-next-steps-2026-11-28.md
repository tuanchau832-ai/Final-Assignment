# Bá Nguyên — công việc sau phản hồi Tuấn ngày 28/11

> **GÓI BÀN GIAO MỚI NHẤT:** [Số liệu, phụ kiện và patch bốn file](publication-handoff-2026-11-28.md). Phần mô tả “local/chưa publish” phía dưới ghi trạng thái lượt rà trước; dùng gói phát hành này cho bàn giao hiện tại. Không còn chờ câu trả lời mới của Akai/Đạt để hoàn thiện bản đề xuất.


> **Thay bằng bản tự rà sau ea4cce0a:** đọc [plan hiện hành](ba-nguyen-self-review-plan-2026-11-28.md) và [tự trả lời các câu hỏi](ba-nguyen-self-answers-2026-11-28.md). Những mẫu tin gộp Đạt/Akai, yêu cầu Akai nhận vai nghiệm thu hoặc gán operator/signatory cho đồng đội trong lịch sử bên dưới không tiếp tục sử dụng. Tuấn đã xử lý PORT/CAL/EDIT; không hỏi làm lại. BOM đã xác định là mục 2.3 của Expanded MD; xem [đối chiếu mới](akai-bom-reconciliation-2026-11-28.md), không còn chờ file BOMZ.

<details>
<summary>Lịch sử trước điều chỉnh phân công — không dùng để giao việc mới</summary>

Đọc cùng [bản bàn giao hiện hành](ba-nguyen-current-handoff.md). Phản hồi mới: [Tuấn trên PR #3](https://github.com/tuanchau832-ai/Final-Assignment/pull/3#issuecomment-7232184967), [bản lưu](team-review/tuan-response-2026-11-28.json). Đã rà toàn bộ 18 mục trong timeline PR; có một comment mới sau gói 0aa14906, chưa có phản hồi mới của Đạt/Akai trong timeline này. Source giao diện mới là `final-website@ee0502ca`; Tuấn bổ sung bốn file tại `feature/tuan-pilot-closeout@687557b1`. Commit đó chưa nằm trong final-website.

## Kết luận đủ điều kiện làm tiếp

Đủ để cập nhật cơ sở dự toán, worksheet dịch vụ, phạm vi RFQ, trích dẫn kế hoạch và nội dung website. Chưa đủ để chốt giá giao/lắp, ngân sách đủ ba năm, ngày thi công, nghiệm thu phần cứng hoặc cam kết chi/48 giờ. Bá Nguyên xác nhận phép tính và phạm vi hỏi giá; không ký thay người phụ trách kỹ thuật hoặc bên chi trả.

| Thứ tự | Việc cụ thể | Kết quả / điều kiện xong |
| --- | --- | --- |
| 1 | Đọc phản hồi và đối chiếu cả final-website mới lẫn proposal Tuấn | Ghi đúng commit và phần đã cập nhật; không tiếp tục nói final còn ở a85be4e |
| 2 | Kiểm kỳ 36 tháng chung và mua 1 + 2 | 0/6/6 là ví dụ: 96 SIM-tháng, 36 hosting, 16 lượt kiểm/6 đợt; bảng theo năm và tuổi trạm ở đóng kỳ |
| 3 | Tách hiệu chuẩn khỏi testing | 96 việc pH hằng tháng; 16 việc có thể gộp testing, 80 ngoài testing. Ví dụ ngày cho 32 việc độ đục/90 ngày; không biến số việc thành số chuyến |
| 4 | Sửa RFQ A/B và các khoản chưa giá | B dùng LILYGO T-SIM7600G-H R2 CH9102 đúng proposal; cùng bốn cảm biến, hoãn TDS; giá giao/lắp/dịch vụ vẫn trống/chờ quote |
| 5 | Sửa source website phần chi phí/đối chiếu rollout | Trang Implementation và Cost Analysis trên nhánh Bá Nguyên cập nhật; chuẩn bị patch hẹp cho cấu trúc mới của Tuấn, kiểm trên bản sao đúng commit |
| 6 | Build, test số lượng và trình duyệt; bàn giao | Có bằng chứng kiểm viewport, số tiền, điều hướng/References; phản hồi soạn sẵn và bảng chờ đúng người |

Các bước trên đã được thực hiện và Bá Nguyên cho phép công bố gói lên nhánh `feature/ba-nguyen-cost-analysis`, cập nhật PR #3 và thông báo cho Tuấn/Đạt/Akai ngày 28/11. Chi tiết kiểm và patch nằm ở [review 28/11](team-review/tuan-closeout-review-2026-11-28.md). [Gói RFQ sẵn để gửi](supplier-rfq-package-2026-11-28.md) và [CSV so giá](supplier-quote-comparison-2026-11-28.csv) đã chuẩn bị; bên nhận/kênh liên hệ chưa được cung cấp. Không coi việc publish hồ sơ là website cuối đã deploy.

## Cơ sở số lượng đã tự kiểm

| Khoản trong ví dụ 0/6/6 | Năm 1 | Năm 2 | Năm 3 | Cả kỳ |
| --- | ---: | ---: | ---: | ---: |
| SIM-tháng | 24 | 36 | 36 | 96 |
| Hosting-tháng chung | 12 | 12 | 12 | 36 |
| Lượt testing trạm | 4 | 6 | 6 | 16 |
| Đợt testing theo lịch | 2 | 2 | 2 | 6 |

Tháng 6 chỉ ST-01 đến hạn testing; nếu cùng ngày commissioning ST-02/03 thì đó là công ban đầu phải ghi riêng, không tự đếm thành testing sáu tháng. Tháng 12/18/24/30/36 có ba lượt kiểm mỗi đợt. Đóng dự án tháng 36 rà ba trạm, trong đó ST-01 tuổi 36 tháng và ST-02/03 tuổi 30 tháng. Không bắt buộc thay toàn bộ linh kiện. Mốc 108/18 vẫn đúng cho so sánh cùng bắt đầu, không làm mặc định cho 0/6/6.

[Worksheet có thể tính lại](pilot-service-basis-2026-11-28.json), [lịch hiệu chuẩn minh họa](calibration-calendar-example-2026-11-28.csv), [bảng khối lượng hỏi giá](service-rfq-quantities-2026-11-28.csv). Ngày 01/01/2027 trong lịch chỉ là gốc kiểm phép tính, không được nhóm chọn. Khi ngày thực tế thay đổi, tính lại; không đặt lịch nhà cung cấp từ file minh họa.

## Việc còn chờ và tin nhắn có thể gửi

| Chờ ai | Cần gì | Bá Nguyên làm tiếp khi nhận |
| --- | --- | --- |
| Đạt, phối hợp Akai | Ngày commissioning/site được phép, tuyến đi, tải/4G đo, người làm hiệu chuẩn tại chỗ, operator chính/dự phòng | Tính lại quantities và scope lắp/đi lại; không cần hỏi lại lịch sáu tháng đã trả |
| Akai/nhóm kỹ thuật, Đạt | Duyệt Report rule/hoãn TDS, DS18B20, BOM/interfaces/nguồn; tiêu chí và người ký nghiệm thu | Đóng hai BOM có cùng sensor scope; giữ hold cho đợt mua 2 nếu chưa đạt |
| Nhà cung cấp do nhóm giao cho Bá Nguyên liên hệ | Hai báo giá A/B cùng site và scope, số lượng 1 + 2, lịch hiệu chuẩn, VAT/freight, lead time, warranty | Tính landed/installed CAPEX, OPEX từng năm và tổng có quote; chưa gửi tin nhà cung cấp trong lượt này |
| Tuấn | Review/port patch đúng kiến trúc mới; rà APA và word count chung; xác nhận source/preview sau tích hợp | Bá Nguyên rà số và chữ trên bản final đã tích hợp; Tuấn không phải người tự phê duyệt kỹ thuật/payer |
| Nhóm/bên được ủy quyền | Người duyệt chi, cam kết nguồn lực sửa 48 giờ và phê duyệt mua sau nghiệm thu | Đổi nhãn Proposed thành Confirmed chỉ khi có bằng chứng |

**Gửi Tuấn:** “Mình đã rà 687557b1. Kỳ 36 tháng chung và ví dụ 0/6/6 khớp 96 SIM-tháng, 36 hosting, 16 lượt kiểm trong 6 đợt. Chốt kỳ chung làm basis hỏi giá; ngày 0/6/6 vẫn minh họa. Mình đã tách khối lượng hiệu chuẩn và cập nhật RFQ A/B. 90 ngày không luôn bằng ba tháng lịch, nên không coi 32 việc độ đục là 32 chuyến hoặc số chốt khi gộp sớm. File review/patch mới có trong gói này; mình chưa thay nhánh bạn/final/main. Sau khi bạn nhận gói và port source, gửi commit để mình kiểm lại.”

**Gửi Đạt/Akai:** “Mình đã cập nhật basis kỳ 36 tháng theo proposal mới, không cần hai bạn trả lại phần testing sáu tháng đã xác nhận. Nhờ xác nhận phần còn thiếu: ngày vận hành/site và tuyến thực tế; người làm hiệu chuẩn hằng tháng/90 ngày; operator chính/dự phòng; duyệt Report rule và BOM bốn cảm biến A/B trước xin giá chốt. Đợt 0/6/6 chỉ là ví dụ để tính, chưa là lịch thi công.”

**Gửi đầu mối xin giá (sau khi được giao liên hệ):** “Nhờ báo A ESP32 + M.2 và B LILYGO T-SIM7600G-H R2 CH9102, giữ cùng bốn cảm biến và phạm vi giao/lắp. Tách giá trạm đầu và hai trạm sau nghiệm thu; một pH kit chung tùy chọn; công/chuẩn/đi lại hiệu chuẩn và testing theo worksheet. Ghi rõ phần đã nằm trong gói để không cộng lại, cùng VAT, freight, hiệu lực, bảo hành và thời gian giao.”

## Cách sửa website

Source được sửa trong lượt này là website trên nhánh được giao. Bản final mới dùng `src/content/pages/implementation.html`, `src/content/data.ts` và các stylesheet tách nhỏ, khác kiến trúc nhánh Bá Nguyên. Bản sao local đúng 687557b1 dùng để kiểm và tạo patch; không chuyển nhánh hoặc áp lên source đồng đội. Chỉnh DOM trong DevTools không lưu được vào website cho mọi người. Bản online chỉ nhận thay đổi sau khi source được tích hợp và triển khai từ đúng nhánh hosting. Người dùng yêu cầu dựa source đã pull; không có URL deploy được cung cấp hoặc xác nhận trong lượt này.

</details>
