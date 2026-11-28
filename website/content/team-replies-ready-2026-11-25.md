# Tin nhắn chờ xác nhận — Bá Nguyên

> **BẢN HIỆN HÀNH: [Bá Nguyên — bắt đầu đọc tại đây](ba-nguyen-current-handoff.md).** Các hướng dẫn phía dưới được lưu theo thời điểm, không phải danh sách việc/câu hỏi hiện tại. Đặc biệt: 24/26 lượt và ba kit pH reserve đã bị thay thế; không áp lại giá hoặc gửi câu hỏi cũ.

<!-- BA-NGUYEN-HISTORY-BOUNDARY -->
<details>
<summary>Tin nhắn dự thảo 25/11 — không gửi lại như câu hỏi hiện tại (lịch sử; bấm để xem)</summary>


> **Lưu trữ câu hỏi 25/11.** Trạng thái hiện tại và yêu cầu sửa source nằm trong [bảng đối chiếu 26/11](final-website-vs-ba-nguyen-2026-11-26.md). Akai đã trả lời 3 trạm/3 năm và chuyển D2/D3 cho Đạt/Tuấn; D5 mới tách testing 6 tháng/lần với review năm 3. Không gửi lại nguyên văn lịch 26 lượt hoặc câu hỏi D1 cũ dưới đây như thể chưa có cập nhật. Các câu hỏi bổ sung đã đăng trong PR #3 ngày 26/11.

Soạn ngày 25/11/2026. Đây là bản câu hỏi chi tiết để đối chiếu với các comment gửi trong PR #3. D5/D7 đã có [quyết định của Bá Nguyên](ba-nguyen-decisions-2026-11-25.md); phần còn lại vẫn chờ nhóm. Mỗi người có thể trả lời ngay dưới comment gắn tên mình bằng ID D1–D8. Nếu chưa chốt, xin ghi `TBD + ai kiểm tra + khi nào + tài liệu cần có` để không tự điền số. Bằng chứng giá mới và ảnh gốc nằm trong [cost-evidence/README.md](cost-evidence/README.md).

## Akai — cấu hình, phạm vi và phương án so sánh

> Akai ơi, mình đã đọc `HWW_Design_and_Cost_Comparison_Expanded.md` và đang khớp bảng Cost Analysis với thiết kế của bạn. Nhờ bạn trả lời theo từng mục, kèm SKU/link hoặc ảnh nguồn nếu có:
>
> **D1:** Pilot chính của nhóm là **3 trạm/3 năm** hay **10 trạm/1 năm**? Nếu cả hai, bản nào là phạm vi chính và bản nào chỉ là kịch bản so sánh?
>
> **D2:** Chốt exact model/revision của LILYGO (E/G/SA) và bốn sensor pH, DO, turbidity, temperature. DO **169 USD** và pH electrode **49.50 USD** là SKU/link nào? Turbidity **9.90 USD** có phải SEN0189 không? Mình thấy SEN0189 là analog/digital, còn SEN0710 RS485 là **229 USD**, nên cần biết model dùng ngoài hiện trường. Nếu chọn LILYGO tích hợp, các dòng ESP32 riêng, SIM7600 M.2, carrier, antenna, RS485 nào cần bỏ/thêm?
>
> **D3:** 20 W panel và board solar charging có sơ đồ điện phù hợp chưa? Cho mình battery Wh/Ah, controller/converter/protection, tải đo hoặc datasheet, 4G upload interval và số ngày autonomy mong muốn. Nếu chưa có, ghi TBD và cách đo.
>
> **D8:** Phương án C cuối cùng là **AI + IoT** hay **manual sampling**? Website cuối hiện vẫn ghi manual sampling và matrix chưa có AI. Ai sẽ cập nhật matrix và khi nào nhóm chấm lại?
>
> Bạn trả lời `D1/D2/D3/D8 | lựa chọn/TBD | nguồn | ngày` là mình cập nhật bảng chi phí được ngay. Cảm ơn bạn.

## Đạt — triển khai, lịch dịch vụ và lỗi summary

> Đạt ơi, mình đã đọc `Team confirming request - Dat.docx`. Mình cần chốt các giả định triển khai để không cộng thiếu hoặc cộng sai:
>
> **D1/D4:** Pilot chính 3 hay 10 trạm? Cho biết site nào chỉ là ví dụ, ai xác nhận GPS/permission, flood line, cable length, shade và 4G coverage. Hộp, cage/arm, wiper, grounding/surge sẽ được khảo sát hoặc thiết kế bởi ai? Gói **80 USD** đang bao gồm chính xác vật tư nào, có quote chưa?
>
> **D5:** Mình chọn **26 lượt/năm/trạm (mỗi 14 ngày)** làm lịch lập kế hoạch; 24 lượt chỉ là kịch bản so sánh. Nhờ bạn xác nhận site có khả thi không, 12 lần hiệu chuẩn có đi cùng 12 lượt vệ sinh không, và xin báo giá cho lượt định kỳ, sau mưa lũ, di chuyển, vật tư DO/pH và phụ tùng cho mục tiêu sửa trong 48h.
>
> **D6:** Người vận hành/nhận cảnh báo/bên trả tiền đã có thỏa thuận hay mới là đề xuất trong report? Chốt acceptance criteria và những công việc cần báo giá: lắp đặt, an toàn gần nước/đường, training, lab, SMS, bảo trì.
>
> Về lỗi summary bạn báo: mình tính `10 × (468.07 + 142.50) = 6,105.70 USD`, nên “about 6,100” là làm tròn. Nhưng heading ghi **430 USD để xây** trong khi equipment = **428.07 USD**, installed = **468.07 USD**. Mình đã chuẩn bị patch đồng bộ. Nếu bạn phát hiện lỗi **khác** chỗ này, gửi đúng dòng hoặc số để mình sửa tiếp nhé.
>
> Bạn trả lời theo ID; mục chưa biết ghi `TBD + người đo/xin + ngày dự kiến` là đủ.

## Tuấn — scope toàn bài và tích hợp website cuối

> Tuấn ơi, mình đã rà hai phản hồi của Akai/Đạt. Hiện scope **3 trạm/3 năm** trong file Akai khác **10 trạm/1 năm** trong implementation/summary website cuối. Nhờ bạn cùng nhóm chốt D1 trước khi mình đưa tổng chi phí vào bài. Ngoài ra phương án C trong file Akai là **AI + IoT**, nhưng website cuối vẫn là **manual sampling** (D8), nên matrix cần được nhóm đánh giá lại nếu đổi phương án.
>
> **D7:** Mình đồng ý để bạn tích hợp bản sửa summary/calculator tại `website/content/team-review/final-website-cost-summary.patch` vào source `final-website`, sau khi kiểm tra snapshot và thay đổi đang có. Source này khác cấu trúc React ở PR #3, nên không dùng merge PR #3 để áp patch. Nhờ bạn gửi link bản tích hợp và kết quả build/QA để mình rà lại số.
>
> Nhờ bạn xác nhận cách đếm **4.000 từ**, vị trí evidence/báo giá và prompt log/AI screenshots theo template; payer trong report vẫn là đề xuất nếu chưa có bên tài trợ cam kết. Sau khi D1/D2 chốt, mình sẽ gửi CSV giá và bảng cost mới để bạn kiểm APA.
>
> Bạn phản hồi D1/D7/D8 và đầu mối review giúp mình nhé.

## Thư — thông báo sớm, chưa cần chốt số

> Thư ơi, phần chi phí hiện có hai nguồn dùng **BOM và phạm vi khác nhau** nên mình đang rà với Akai/Đạt/Tuấn. Trong Recommendations, nhờ bạn giữ chi phí/payer ở dạng **đề xuất hoặc cần báo giá**, chưa gọi là ngân sách đủ hay nguồn tài trợ đã cam kết. Mình sẽ gửi con số và giới hạn đã được nhóm chốt ngay sau khi D1/D2 cùng các báo giá quan trọng được xác nhận.

## Nhà cung cấp/đơn vị thi công — chỉ gửi khi đã có cấu hình và site tối thiểu

> Chào anh/chị, nhóm đang lập dự toán cho trạm theo dõi chất lượng nước ngoài trời tại Hà Nội. Xin báo giá bằng văn bản cho **[số trạm, vị trí/địa chỉ, model và sơ đồ đính kèm]**, tách từng dòng và số lượng: (1) panel/battery/controller/DC/protection và phụ kiện lắp; (2) hộp IP, cáp/gland, cage/arm/wiper, chống ăn mòn và tiếp địa/chống xung; (3) lắp đặt gần nước/đường, commissioning, hiệu chuẩn ban đầu; (4) bảo trì/vệ sinh **26 lượt/năm (mỗi 14 ngày)**, nếu được thì thêm mức so sánh 24 lượt/năm, hiệu chuẩn 12 lần/năm và lượt sau mưa lũ; (5) vật tư thay pH/DO, thu hồi/thải bỏ. Xin ghi rõ model, điều kiện địa điểm, VAT, giao hàng, công đi lại, bảo hành, loại trừ, thời gian giao và hiệu lực báo giá. Nếu không cung cấp được mục nào, xin đánh dấu rõ để nhóm xin nhà cung cấp khác. Xin cảm ơn.

Mẫu quote đầy đủ còn ở [supplier-quote-request-template.md](supplier-quote-request-template.md). Không gửi yêu cầu có ô `[...]` cho nhà cung cấp trước khi người phụ trách kỹ thuật xác nhận dữ liệu.

</details>
