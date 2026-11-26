# Bản vá summary và chi phí cho website cuối

> **Cập nhật 26/11:** Đọc [bảng đối chiếu mới dành cho Đạt/Tuấn](../final-website-vs-ba-nguyen-2026-11-26.md) trước khi dùng patch. Scope làm việc là 3 trạm/3 năm; testing 6 tháng/lần và review mòn/ăn mòn năm 3. Các số 10/1, 24/26 lượt và hướng dẫn lịch bên dưới là lịch sử của patch ngày 25/11. Patch không tự giải quyết BOM/báo giá, scope hoặc lịch mới; source cuối đã đổi snapshot nên phải review/port từng thay đổi phù hợp.

Ngày chuẩn bị: 25/11/2026. Bản vá: [final-website-cost-summary.patch](final-website-cost-summary.patch).

## Vì sao là patch?

Nhánh được phép `feature/ba-nguyen-cost-analysis` vẫn dùng `src/content/sections/08-cost-analysis.ts` và router React. Summary Đạt nhắc nằm ở `website/src/page.html` trên `origin/final-website`; nhánh cá nhân không có `page.html` hoặc `site.ts` đó. Pull chưa tích hợp kiến trúc này vào nhánh cá nhân.

Patch ghi đúng thay đổi trên snapshot `556fb6e92d5f1abc34b70d7711ab5ffd36da25a0`. Source được đọc bằng `git show`; không checkout/merge branch khác. File hosted chưa thay đổi. Không thêm source không được app sử dụng rồi gọi là đã sửa website.

## Nội dung sửa

- Summary ghi 6,105.70 USD cho scenario 10 trạm × 12 tháng, lấy cùng BUILD/RUN với calculator; bỏ suy luận affordability từ việc so ngân sách sông Nhuệ.
- Heading phân biệt equipment/materials 428.07 USD và installed 468.07 USD; tính từ BOM thay câu cứng “About US$430”.
- Calculator chọn được 3 trạm và hiển thị cents. Summary giữ scenario minh họa 10 trạm, không tự đổi scope theo slider.
- Nhãn provisional scenario subtotal; giá/cấu hình cần kiểm chứng, phần chưa tính và tỷ giá 26,000 chỉ minh họa được ghi rõ. Sửa hiển thị không phải xác minh supplier prices.
- Disposal 10 USD/5 năm được nêu là giả định cũ chưa có quotation và không nằm trong calculator.

Patch không chọn thay nhóm 3 hay 10 trạm, không thay giá LILYGO bằng giá khác variant và chưa hoàn tất BOM/báo giá. Xem [review](../team-confirmation-review-2026-11-25.md) và [plan](../ba-nguyen-work-plan.md).

## Kiểm tra

- `git apply --check` trên bản sao tạm của hai file tại đúng commit: pass.
- Áp patch trên bản sao tạm, so với nội dung dự kiến: pass.
- Chạy logic với DOM giả lập: heading, hai summary copies và scenario 1 trạm/1 năm; 3/1; 3/3; 10/1; 10/3; 3/5: pass.
- Đổi giá board +1 USD, kiểm lại các vị trí và sáu scenario: pass.

Đây là kiểm patch/logic, **chưa phải full build hoặc browser/mobile test của `final-website`**. Build/link của website React được ghi riêng trong handoff.

## Tích hợp do Tuấn phụ trách theo quyết định D7

Bá Nguyên đã đồng ý Tuấn tích hợp patch trên source website cuối `final-website` theo [quyết định D7](../ba-nguyen-decisions-2026-11-25.md). Hướng dẫn dưới đây dành cho người phụ trách trên checkout được phép và đã có hai file đích; agent chưa áp các bước này lên source nhóm. Lịch vận hành được chọn là 26 lượt/năm; các tổng 24 lượt trong patch vẫn là kịch bản cũ và cần giữ nhãn giả định hoặc cập nhật sau khi có báo giá.

1. Xác nhận branch/snapshot, giữ thay đổi chưa commit; không yêu cầu Bá Nguyên chuyển sang nhánh đồng đội.
2. Từ repository root, chạy `git apply --check` với đường dẫn thực tới patch. Nguồn đã thay đổi thì port từng hunk sau khi đọc; không ép apply hoặc reset.
3. Khi patch có tại cùng đường dẫn trong checkout đích và đã được phép:

   ```powershell
   git apply --check website/content/team-review/final-website-cost-summary.patch
   git apply website/content/team-review/final-website-cost-summary.patch
   cd website
   npm.cmd run build
   npm.cmd run dev -- --host 0.0.0.0
   ```

4. Kiểm `#home-summary` và `#implementation-cost`, 3/10 trạm, 1/3 năm, desktop/mobile. Snapshot `final-website` không có script `check:links`; chỉ chạy nếu đã bổ sung script phù hợp.
5. Đổi summary theo final scope sau D1; chỉ gọi tổng đầy đủ khi BOM/quote đủ. Mỗi commit/push/PR/merge/publish phải có quyền từ người dùng.
