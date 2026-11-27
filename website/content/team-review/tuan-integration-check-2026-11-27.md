# Kiểm bản tích hợp Tuấn — 27/11/2026

Source kiểm: `7208280f9e2c2064ddbab716604d871988b1016d` trên `docs/tuan-d7-maintenance`. Đã đọc diff 5 file so `final-website@a85be4e`: first-station-pilot.md, page.html, site.ts, site.css và check-embedded-simulator.mjs. Nhánh hiện tại của Bá Nguyên không được chuyển sang nhánh Tuấn.

| Kiểm tra | Kết quả thực chạy của Bá Nguyên | Giới hạn |
| --- | --- | --- |
| Snapshot | Xuất `git archive` đúng commit vào thư mục tạm ngoài repo | Không sửa source branch của Tuấn/final/main |
| Dependency/build | `npm.cmd ci --no-audit --no-fund`, `npm.cmd run build`: đạt | TypeScript/Vite của snapshot, chưa xác nhận deploy |
| Simulator | `node tests/check-embedded-simulator.mjs`: 13 scenarios đạt, kèm recovery, clamping và parent payload | Logic mô phỏng với VM/DOM giả; không phải accuracy probe/4G/SLA thực địa |
| Calculator | Chạy đoạn source BUILD/calculator trong VM với DOM giả cho bảng dưới | Không tự nhận là browser/mobile test; mobile là kết quả Tuấn báo |
| So số | 8 dòng BUILD khớp giá hồ sơ, reserve chung không nhân trạm/năm, unknown không được cộng thành 0 | Giá vẫn là hồ sơ 19–25/11; còn quote và xác nhận model cuối |

| Trạm/năm | Subtotal mua ban đầu VND | pH dùng chung tùy chọn VND | Lượt kiểm trạm | Chuyến chung hiển thị |
| --- | ---: | --- | ---: | --- |
| 1/1 | 13.895.466 | 1.683.506 | 2 | Route TBD |
| 3/1 | 41.686.398 | 1.683.506 | 6 | 2 |
| 3/3 | 41.686.398 | 1.683.506 | 18 | 6 |
| 10/1 | 138.954.660 | Stock TBD | 20 | Route TBD |

Nhận xét trước khi tích hợp final:

1. Các số giá/cách trình bày đã sửa đúng theo BOM tham chiếu; 1 + 2 đợt mua và reserve chung là phương án có thể dùng để hỏi giá, không có tổng lắp/vận hành đã chốt.
2. Calculator là **baseline số lượng**, chưa phản ánh commissioning lệch và calibration thêm theo model. Giữ nhãn planning, yêu cầu nhóm chọn kỳ dự án 36 tháng hay 36 tháng/trạm, rồi cập nhật quantities hoặc ghi rõ giới hạn ở output.
3. Ghi lịch six-month là testing cơ sở, không thay hướng dẫn hiệu chuẩn model. Nguồn hãng SEN0710 nêu 90 ngày; tài liệu pH nêu mức lý tưởng tháng. Scope và quote còn cần bổ sung.
4. Chưa có field data nên không đánh pass cho đề xuất accuracy 3 NTU/0,30 mg/L; tiêu chí <0,10 mg/L cho rule DO nhạy vẫn cần reviewer duyệt và phương pháp uncertainty.
5. AI + IoT đã xuất hiện như lựa chọn chưa chấm; không coi D8 đã hoàn tất hoặc đã chứng minh HWW thắng mọi phương án. Akai/nhóm cần chấm có căn cứ.

Nguồn đầy đủ và kế hoạch khép các điểm còn thiếu: [review/plan](../tuan-response-plan-2026-11-27.md). Báo cáo này kiểm source proposal của Tuấn, không phải xác nhận final-website đã được cập nhật.
