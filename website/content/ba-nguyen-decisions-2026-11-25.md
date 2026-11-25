# Bá Nguyên chốt D5 và D7 — 25/11/2026

Đây là quyết định cho **bản kế hoạch chi phí** và cách phối hợp tích hợp website. Nó không xác nhận BOM, báo giá, địa điểm triển khai hoặc ngân sách pilot cuối cùng. Draft PR #3 là nơi ghi phản hồi của nhóm.

## D5 — lịch vệ sinh và kiểm tra hiện trường

- Chọn **mỗi 14 ngày, dự trù 26 lượt vệ sinh/kiểm tra định kỳ cho mỗi trạm trong 12 tháng**. Không gọi 24 lượt là “mỗi hai tuần”; 24 lượt là hai lần mỗi tháng và chỉ giữ làm kịch bản so sánh lịch sử.
- Dự trù **12 lần hiệu chuẩn theo tháng**. Lập lịch cùng 12 trong 26 lượt hiện trường khi quy trình và thời gian làm việc cho phép; nếu cần chuyến riêng, Đạt phải báo số lượt và xin báo giá bổ sung.
- Lượt sau mưa lũ, sửa chữa bất thường, vật tư pH/DO, đi lại, nhân công, mẫu chuẩn và phòng thí nghiệm là các dòng riêng cần phạm vi hoặc báo giá. Không gộp mặc định vào 26 lượt.
- Trong bảng Akai, mức 142,50 USD/năm đang dựa trên 24 lượt. Nếu chỉ dùng **giả định nội bộ** 2,50 USD/lượt để thử độ nhạy, thêm hai lượt cho 147,50 USD/năm/trạm. Đây không phải báo giá dịch vụ hay OPEX được duyệt. Bảng chi phí của Bá Nguyên tiếp tục ghi `Quote required` cho dịch vụ hiện trường.
- Đạt xác nhận tính khả thi tại site, việc gộp hiệu chuẩn và phạm vi báo giá. Bá Nguyên sẽ cập nhật giá sau khi có nguồn đủ kiểm tra.

## D7 — tích hợp patch summary và calculator

- Bá Nguyên đồng ý **Tuấn là người tích hợp** [patch](team-review/final-website-cost-summary.patch) vào source website cuối `final-website`. Patch hiện chỉ là bản đề xuất trên nhánh `feature/ba-nguyen-cost-analysis`; quyết định này không có nghĩa patch đã được áp dụng hoặc website đã được triển khai.
- Trước khi áp dụng, Tuấn kiểm tra bản source đích và thay đổi chưa commit. Patch được soạn cho snapshot `556fb6e92d5f1abc34b70d7711ab5ffd36da25a0`. Nếu source khác, đọc từng thay đổi và port phù hợp; không ép patch, reset hoặc tự merge PR #3 vào `main`.
- Sau tích hợp, Tuấn chạy build và kiểm tra summary/heading/calculator trên các kịch bản **1, 3, 10 trạm × 1, 3 năm**. Điểm đối chiếu cũ: thiết bị/vật tư **428,07 USD**; cộng lắp đặt giả định 40 USD thành **468,07 USD/trạm**; 10 trạm × (468,07 + 142,50) = **6.105,70 USD** cho kịch bản cũ 24 lượt. Với lịch 26 lượt và cùng giả định nội bộ 2,50 USD/lượt, subtotal minh họa là **6.155,70 USD**; không đưa số này thành tổng pilot đã duyệt.
- Kiểm tra phần cost/summary trên desktop và điện thoại: bảng không mất cột khi cuộn ngang, toàn trang không tràn ngang, menu và link nguồn hoạt động. Bá Nguyên đối chiếu số/câu chữ sau khi Tuấn có bản tích hợp để xem. Chưa dùng kết quả build của website React để tuyên bố `final-website` đã được kiểm.
- D1 (số trạm/thời hạn) và D2 (BOM) vẫn chờ nhóm chốt. Summary phải giữ nhãn `provisional scenario subtotal` và nêu khoản chưa tính cho tới khi các quyết định và báo giá đầy đủ.

Mẫu xác nhận từ Đạt/Tuấn trên PR: `D5 hoặc D7 | đã thực hiện / cần điều chỉnh / TBD | bằng chứng hoặc link | người phụ trách | ngày`.
