# Giá bổ sung và mô hình tham chiếu — 28/11/2026

Chín đơn giá dưới đây đã được mở trực tiếp bằng Chrome trên trang nhà bán. Ảnh là screenshot thật, không tạo bằng AI. [Observations](observations.json) có HTTP status, URL, ngày, hash ảnh; [price-scope](price-scope.json) có đơn giá, VAT và phạm vi. Listing không phải quotation đã nhận. Giá chưa ghi VAT không được tự coi đã gồm VAT.

| Hạng mục chọn để lập kịch bản | Đơn giá VND | Số lượng giả định | Nguồn trực tiếp |
| --- | ---: | --- | --- |
| GVA-100W panel | 850.000 | 1/trạm | [GIVASOLAR](https://givasolar.com/san-pham/tam-pin-nang-luong-mat-troi-gv-mono-100w/) |
| ST-H1210 10A | 780.000 | 1/trạm | [mayniemphat.vn](https://mayniemphat.vn/san-pham/san-pham-nang-luong-mat-troi/bo-dieu-khien-sac-nang-luong-mat-troi/bo-dieu-khien-sac-nang-luong-mat-troi-mppt-10a-co-mang-hinh-lcd.html) |
| LONG WP40-12NE AGM 12V-40Ah | 1.588.000 | 1/trạm | [VAC Technology](https://vactechnology.vn/san-pham/ac-quy-agm-vrla-long-12v-40ah-wp40-12ne) |
| PVN1777 buck 6–36V → 5V/3A USB | 35.000 | 1/trạm | [Điện Tử 360](https://dientu360.com/mach-ha-ap-5v-3a-2-cong-usb) |
| Hộp ABS W300H400D200, variation 19430 | 700.000 | 1/trạm | [Hải Đăng](https://haidanga.vn/san-pham/vo-tu-dien-bang-nhua-abs-kin-nuoc/) |
| SanDisk Ultra microSDHC 32GB SDSQUNR-032G-GN3MN | 359.000 | 1/trạm | [Phong Vũ](https://phongvu.vn/the-nho-micro-sandisk-ultra-32gb-sdsqunr-032g-gn3mn--s200801365) |
| HI7004L pH4.01, 500mL | 454.000 | 1 chai khởi đầu chung | [Đông Bắc](https://thietbi.net.vn/dung-dich-hieu-chuan-ph/dung-dich-hieu-chuan-ph-4-01--chai-500ml-hi7004l/) |
| HI7007L pH7.01, 500mL | 454.000 | 1 chai khởi đầu chung | [Đông Bắc](https://thietbi.net.vn/dung-dich-hieu-chuan-ph/dung-dich-hieu-chuan-ph-7-01--chai-500ml-hi7007l/) |
| Dung_dich_KCL_3M, 18mL | 140.000 | 1 chai khởi đầu chung | [MLAB](https://mlab.vn/3655744-dung-dich-chuan-kcl-3m-bao-ve-dien-cuc-dau-do-ph-orp.html) |

Đã chọn đúng biến thể hộp 700.000, không lấy mức đầu dải 450.000 của kích thước khác. Listing ghi VAT 10% đã gồm; không áp thuế này cho mọi món khác. Hộp này là tham chiếu cho điện tử; chưa chứng minh vừa pin 13kg, tản nhiệt hoặc độ kín sau khoan lỗ. Cần phương án hộp pin có bảo vệ thời tiết và thông khí riêng.

## Vì sao dùng bộ tham chiếu này

Thiết kế cần nguồn cho board và hai probe, nên không coi panel 20W hoặc module sạc Li-ion rời là cả hệ nguồn. Dùng một kiến trúc nguồn ngoài 12V AGM và buck 5V làm **kịch bản chi phí** tránh trộn bình AGM với cổng sạc một cell của Q190. Hãng chưa kiểm bộ kết hợp này. ST-H1210 mặc định 14,2V trong khi listing AGM ghi vùng cycle 14,4–15,0V; cần kiểm đúng manual/revision, thông số bù nhiệt và cài đặt trước khi dùng. Nhãn MPPT là mô tả nhà bán, không là kết quả đo hiệu suất. Điện áp/dòng đỉnh, chất lượng buck, bảo vệ, cầu chì, tiếp địa, chống sét và dây vẫn phải xác định.

100W/40Ah được chọn để có kịch bản có thể tính lại, không khẳng định đây là mức tối ưu kỹ thuật. [Sensitivity](../reference-cost-scenario-2026-11-28.json): giả định 50% dung lượng sử dụng và 85% delivery cho 204Wh; tải trung bình 2/4/8W cho 102/51/25,5 giờ danh định. Giả định hai/bốn giờ nắng đỉnh và hệ số 0,7 cho 140/280Wh/ngày. Đây không phải số liệu nắng Hà Nội hay số đo công suất. Trường hợp tải 8W cần 192Wh/ngày nên không đạt cân bằng năng lượng ở ví dụ hai giờ nắng. Còn sạc phục hồi, nhiệt độ, tuổi pin, chuỗi ngày mưa và dự phòng.

Thẻ 32GB có giá trực tiếp và chuẩn microSDHC rõ. Thẻ không được quảng cáo như industrial/high-endurance trong dự toán. Giả định 1KiB/mẫu mỗi hai giây trong bảy ngày là 309.657.600 byte, nhân bốn overhead thành 1.238.630.400 byte. Phép tính chỉ giúp đối chiếu dung lượng; không xác nhận firmware, tốc độ, wear, clock, lưu an toàn khi mất điện hay khôi phục gửi dữ liệu.

## Dung dịch và công hiệu chuẩn

DFRobot nêu hai buffer nominal 4.0/7.0 và KCl 3mol/L. HI7004L/HI7007L là 4.01/7.01 tại nhiệt độ ghi trên nhãn; cần dùng đúng giá trị theo lot/nhiệt độ và quy trình/firmware đã xác minh, không tự gọi hai nhãn là hoàn toàn giống nhau. Hai chai trong subtotal chỉ là stock khởi đầu. Phải dùng aliquot mới; không đổ lại chai.

Ví dụ lượng dùng 20mL/mỗi loại/mỗi việc, 96 việc định kỳ + 3 commissioning cần 1.980mL/mỗi loại. Nếu chỉ chia thể tích, cần bốn chai 500mL/mỗi loại, tức 3.632.000 VND cho cả hai loại. **Chưa tính expiry sau mở, hao hụt, cốc đủ nhúng, việc lặp hoặc thay chai theo đợt.** Không coi đó là giá vật tư ba năm đầy đủ, không cộng lại cả ví dụ lên hai chai starter đã tính. KCl 18mL cũng không là lượng ba năm; listing gợi ý 6mL/lần refill, lượng thật phụ thuộc probe/cap.

[METROTECH công khai](https://metrotech.vn/hieu-chuan-may-do-ph/) giá tham khảo 100.000–200.000 VND cho hiệu chuẩn tại cửa hàng đối với máy mua nơi khác, còn trung tâm 500.000–700.000 VND. Phạm vi đề cập bút/máy cầm tay/để bàn, **chưa xác nhận nhận SEN0169-V2 đang lắp tại trạm**. Midpoint 150.000 là phép chọn của người phân tích: 80–96 việc cho 12–14,4 triệu; biên 100–200 nghìn cho 8–19,2 triệu. Chỉ dùng sensitivity, không đưa vào tổng chính, không cộng như giá onsite/travel hoặc vừa trả gói hiệu chuẩn đã gồm vật tư vừa cộng vật tư tự làm lần nữa.

## Phạm vi còn chưa có giá phù hợp

Dây và khung theo tuyến/site, cage/wiper nếu dùng, hộp pin/thoát ẩm, backplate, bảo vệ/chống sét, tích hợp/firmware, thi công/commissioning/đào tạo, 6 đợt testing và công tại trạm, DO film/chuẩn turbidity/cleaning/rinse, sửa chữa, vận chuyển/thuế/phí, thu gom, database storage/usage/support/SMS/lab. Không có đơn giá phù hợp thì giữ unknown; không mặc định miễn phí hoặc một số tùy ý.

Một URL bảng giá cáp đã kiểm trả HTTP 404: ghi **rejected_404_no_verified_price**, không dùng giá index làm giá đã xác minh. Các phụ kiện ứng viên ngày 27/11 khác vẫn nằm trong [sổ khảo sát cũ](../accessory-candidates-2026-11-27.csv); các lựa chọn thay thế không cộng cùng nhau.

## Tái tạo

Trong website chạy node scripts/cost-additions.mjs --check và node tests/check-cost-additions.mjs. Bỏ --check chỉ khi đã cập nhật price-scope có bằng chứng. Model/CSV/bảng website lấy chung generator, starter chung không nhân theo trạm/năm. Xem [bàn giao hiện hành](../publication-handoff-2026-11-28.md).
