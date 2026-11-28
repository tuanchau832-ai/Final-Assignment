# AI use — bản ghi cho phần Bá Nguyên tự rà, 28/11/2026

## Lượt bàn giao và nghiên cứu phụ kiện

Người dùng yêu cầu đưa gói cập nhật lên branch Bá Nguyên và tự tìm/chọn giá, model thay vì chờ phản hồi. AI đã đọc source/comment cũ, tra trực tiếp các listing, chọn chín dòng giá tham chiếu, thêm bảng 4b và References, ghi sensitivity cho nguồn/buffer/calibration. AI sửa nội dung chi phí trên nhánh được giao, chuẩn bị hai patch bốn file cho source chung, build và kiểm browser 11 trường hợp; chuẩn bị commit/push theo yêu cầu. Không merge, không sửa nhánh khác, không gửi RFQ/đặt hàng hay tự gán operator/payer. Kết quả 420 từ/29 citation thay số 335/20 trước đó. Đây vẫn là log tóm tắt, chưa là ảnh/transcript giao diện đầy đủ.


## Bổ sung lượt hoàn thiện sau khi xác định đúng BOM

Sau đó người dùng yêu cầu: “Bạn hãy so sánh tổng quan các tiêu chí như về chi phí vận hành, mức độ khả thi, ưu điểm và nhược điểm của từng phương án. Phương án nào cho kết quả lợi nhất và tốt nhất thì chọn phương án đó”. AI đã so nguồn/giới hạn và chọn **Q190 để dự toán**, cập nhật [quyết định có căn cứ](controller-decision-2026-11-28.md), model/procurement/website. Không coi lựa chọn dự toán là lệnh mua hoặc bằng chứng có TCO thực thấp nhất; không còn chờ người dùng chọn A/B.

Prompt người dùng:

> Hãy thực hiện tiếp tục các công việc tiếp theo cho tôi, không cần chờ Akai hay Đạt nữa, nếu có câu hỏi nào thì tự tìm hiểu trên mạng và làm cho tôi luôn nhé. Hoàn thành hết các công việc cho tôi nhé. Nếu có gì cần tôi xác nhận thì phải hỏi tôi.

AI đọc lại phân công, tài liệu nguồn, UTS APA và 22 comment; mở trực tiếp 15 listing bằng Chrome; đối chiếu package và tra dịch vụ Viettel/Render, tài liệu nguồn điện hãng. AI soạn [report hoàn thiện](ba-nguyen-completion-2026-11-28.md), model/CSV/nguồn bảng 4a, năm entry References, sửa prose còn **335 từ** và cập nhật hồ sơ giá/chứng cứ. Ảnh mới là screenshot nguồn và browser QA, không phải ảnh tạo bằng AI. Kết quả test được dẫn ở report, không dùng thay chứng cứ field hoặc báo giá đã nhận.

Không chọn đơn hàng, không gán người vận hành/người trả tiền, không gửi RFQ hoặc comment, không commit/push/deploy. Nội dung bên dưới giữ làm lịch sử lượt tự rà trước; số 346 từ đã được số 335 từ thay thế. Bản ghi này vẫn chưa phải transcript/ảnh giao diện prompt-output đầy đủ.

Đây là bản ghi hoạt động để bổ sung prompt log của nhóm, **không phải transcript đầy đủ hoặc ảnh prompt/output đã chụp**. Công cụ sử dụng: Codex/ChatGPT. Chưa có tên reviewer đã nhận kiểm nội dung; không tự gán Tuấn hoặc Akai làm người bảo chứng.

## Yêu cầu người dùng

Người dùng yêu cầu tự tìm hiểu và trả lời chi tiết các câu hỏi đã gửi Akai/Đạt, đọc cập nhật/comments mới của Tuấn, lập plan rồi thực hiện. Các ràng buộc trực tiếp:

> Đọc tài liệu và câu trả lời cũ trước khi hỏi. Chỉ hỏi đúng nội dung thuộc phần việc người đó được giao. Không tự giao vai trò mới từ một đề xuất chưa được người nhận đồng ý. Phần tính giá, tìm nguồn và tổng hợp chi phí tôi tự xử lý cho Bá Nguyên.

Điều chỉnh trong lượt làm:

> Tôi đang đợi Akai phản hồi hãy làm những phần khác mà không liên quan tới cái BOMZ này trước nhé.

## AI đã làm gì

- Đọc tài liệu/phản hồi, tìm nguồn truy cập được và so source Tuấn ea4cce0a; không tạo câu trả lời rồi gán cho đồng đội.
- Soạn [bản tự trả lời](ba-nguyen-self-answers-2026-11-28.md) và [plan](ba-nguyen-self-review-plan-2026-11-28.md), chỉnh nội dung hiện hành để bỏ yêu cầu vượt phân công.
- Rút lại lời diễn giải tiếng Anh trong `08-cost-analysis.ts` còn 346 từ; các đoạn này có AI hỗ trợ viết và biên tập. Không tự nhận toàn bộ prose là tác giả con người.
- Viết/kiểm hàm coverage full calibration 80–96; cập nhật worksheet, RFQ và evidence register. Giá lịch sử không đổi, không tạo quote mới.
- Tra đúng variant LILYGO và contact công khai; [source observations](self-research-2026-11-28/source-observations.json) chứa ảnh/metadata. Ảnh nguồn và QA là ảnh chụp trình duyệt, không phải ảnh AI tạo.
- Chạy build/link/math tests, kiểm local Chrome và lưu [kết quả/giới hạn](team-review/tuan-ea4cce0a-check-2026-11-28.md).

## Giới hạn và việc lưu chứng cứ

Ở thời điểm tự rà ban đầu, chưa xác định tài liệu theo tên BOMZ. Người dùng sau đó làm rõ là BOM trong Expanded MD đã gửi; đã đọc lại, gỡ blocker sai tên và đối chiếu từng dòng. Không có dữ liệu đo field, quote chính thức, thỏa thuận chi/SLA hoặc người nhận vai triển khai mới. Không gửi tin/email, chỉnh comment, commit/push hay deploy. Câu trích dẫn trước đó được giữ nguyên làm lịch sử prompt, không còn là chỉ dẫn tạm dừng hiện hành.

Để đáp ứng yêu cầu prompt log đầy đủ của template, cần lưu/export nguyên cuộc trao đổi này cùng các prompt/output và ảnh thực từ giao diện. Bản ghi này chỉ tóm tắt hoạt động và dẫn artefacts, không thay các chứng cứ gốc đó.
