# Bảng chi phí mỗi trạm → 3 trạm → 3 năm

Lập ngày 26/11/2026 bởi Bá Nguyên. Đơn vị: VND, trừ giá gốc USD ghi riêng. [CSV chi tiết mở bằng Excel](cost-rollup-3stations-3years-2026-11-26.csv) gồm 28 dòng, có số lượng từng năm, giá, cách phân bổ, nguồn/ngày, người cần xác nhận và khoản bao gồm/loại trừ.

## Phạm vi và cách đọc

- Phạm vi làm việc: 3 trạm trong 36 tháng theo phản hồi Akai. BOM ESP32 + modem M.2 và cảm biến dưới đây là cấu hình tham chiếu có chứng cứ giá, chưa được Đạt/Tuấn chốt. Nếu chọn LILYGO hoặc cảm biến khác phải thay dòng và tính lại; không cộng hai cấu hình.
- **Giá có nguồn:** dùng hồ sơ và ảnh ngày 19–25/11, chưa kiểm lại giá ngày 26/11. USD quy đổi theo cơ sở lịch sử 25.940 VND/USD; không trộn với basis 26.000 trong scenario cũ. Không tự thêm chiết khấu số lượng.
- **Giả định:** số lượng BOM tham chiếu, 4 glands/trạm, một dịch vụ hosting chung và dự phòng pH đều cần xác nhận. Giá có nguồn không có nghĩa cấu hình/số lượng đã được duyệt.
- **Cần báo giá:** ô tiền trống trong CSV là chưa biết. Không dùng SUM của các số đã biết để gọi là tổng ngân sách đầy đủ. Dòng có số lượng 0 chỉ là năm chưa lên lịch mua/kiểm tra, không phải dịch vụ miễn phí.
- Năm 1 gồm mua ban đầu ở tháng 0 và 12 tháng vận hành. CAPEX mua một lần, không nhân thêm 3 theo thời gian. Kiểm tra chức năng ở tháng 6, 12, 18, 24, 30, 36; tại tháng 36 rà thêm độ mòn/ăn mòn để quyết định thay theo tình trạng.

## 1. Giá có nguồn — mua ban đầu của BOM tham chiếu

| Hạng mục / ID nguồn | SL/trạm | Đơn giá | 1 trạm/năm 1 | 3 trạm/năm 1 | 1 trạm/3 năm: chỉ mua ban đầu | 3 trạm/3 năm: chỉ mua ban đầu |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| ESP32 HS2250V / price-001 | 1 | 195.000 | 195.000 | 585.000 | 195.000 | 585.000 |
| pH SEN0169-V2 / price-002 | 1 | 1.683.506 | 1.683.506 | 5.050.518 | 1.683.506 | 5.050.518 |
| DO SEN0680 / price-003 | 1 | 4.428.000 | 4.428.000 | 13.284.000 | 4.428.000 | 13.284.000 |
| Turbidity SEN0710 / price-004 | 1 | 5.940.260 | 5.940.260 | 17.820.780 | 5.940.260 | 17.820.780 |
| DS18B20 HS2432V / price-005 | 1 | 35.000 | 35.000 | 105.000 | 35.000 | 105.000 |
| TTL–RS485 HS2455V / price-006 | 1 | 35.000 | 35.000 | 105.000 | 35.000 | 105.000 |
| SIM7600G-H-M.2 HS2164V / price-007 | 1 | 1.566.000 | 1.566.000 | 4.698.000 | 1.566.000 | 4.698.000 |
| Gland PG13.5 / price-009 | 4 tạm tính | 3.175 | 12.700 | 38.100 | 12.700 | 38.100 |
| **Subtotal mua ban đầu đã có giá** | | | **13.895.466** | **41.686.398** | **13.895.466** | **41.686.398** |

pH: 64,90 USD × 25.940 = 1.683.506 VND; turbidity: 229 USD × 25.940 = 5.940.260 VND. Cột ba năm chỉ chuyển tiền mua ban đầu sang cùng kỳ đánh giá; chưa bao gồm vận hành, thay thế hoặc các thiết bị thiết yếu chưa có giá.

Giá Viger PVN457 305.000 VND chưa VAT được lưu trong CSV như tham chiếu **không cộng** vì chưa chọn kích thước. Các dòng Hshop có VAT theo hồ sơ; gland 3.175 VND đã VAT. DFRobot chưa rõ VAT/import/freight/phí đổi tiền. Gland còn mâu thuẫn đường kính 7–12 và 6–12 mm; cần Đạt xác nhận fit và số lượng.

## 2. Giả định dự phòng — trình bày riêng

| Khoản | Cách tính | 1 trạm | 3 trạm | Xử lý trong kỳ ba năm |
| --- | --- | ---: | ---: | --- |
| Một bộ pH SEN0169-V2 dự phòng/trạm | 1 × 1.683.506 | 1.683.506 | 5.050.518 | Giữ một bộ ngay đầu kỳ theo kịch bản; không tự nhân 3 theo số năm |
| **Subtotal mua sắm + dự phòng tùy chọn** | 13.895.466 + 1.683.506 mỗi trạm | **15.578.972** | **46.736.916** | Vẫn thiếu vận hành và các khoản cần báo giá |

Giá kit có nguồn nhưng quyết định dự phòng là giả định nội bộ. Chưa có giá riêng đầu dò thay thế và chưa xác nhận thời hạn lưu kho. Đây không là lịch thay sáu tháng hoặc ba năm. Khi sử dụng bộ dự phòng không cộng lại tiền chính bộ đó vào chi phí thay thế. Khoản này chưa đại diện đủ cho toàn bộ dự phòng ba năm.

## 3. Khoản cần báo giá và quy tắc nhân

**Toàn bộ tiền ở bảng này: Cần báo giá.** Số lượng có thể tính trước theo lịch hoặc chỉ là cơ sở xin báo giá; CSV ghi rõ trạng thái từng dòng.

| ID / Khoản | 1 trạm/năm 1 | 3 trạm/năm 1 | 1 trạm/3 năm | 3 trạm/3 năm | Chờ ai |
| --- | --- | --- | --- | --- | --- |
| quote-01: Hộp, đầu vào cáp và seals đã chọn | 1 bộ | 3 bộ | 1 bộ | 3 bộ | Đạt/Tuấn |
| quote-02: Panel, battery, controller, converter, bảo vệ | 1 hệ nguồn | 3 hệ nguồn | 1 hệ nguồn mua ban đầu | 3 hệ nguồn mua ban đầu | Đạt/Tuấn |
| quote-03: Carrier, antenna, nguồn modem, test tích hợp | 1 bộ | 3 bộ | 1 bộ | 3 bộ | Đạt/Tuấn |
| quote-04: Cáp, gá/rack/cage, bảo vệ và chống xung | 1 bộ/site | 3 bộ/site | 1 bộ/site | 3 bộ/site | Đạt |
| quote-05: Lắp, commissioning, hiệu chuẩn ban đầu | 1 dịch vụ | 3 dịch vụ | 1 dịch vụ | 3 dịch vụ | Đạt/nhà cung cấp |
| quote-06: Đào tạo, chuẩn bị triển khai | 1 chương trình chung | 1 chương trình chung | 1 chương trình chung | 1 chương trình chung | Đạt/Tuấn |
| quote-07: SIM data | 12 SIM-tháng | 36 SIM-tháng | 36 SIM-tháng | 108 SIM-tháng | Đạt/nhà mạng |
| quote-08: Hosting/database/support | 12 tháng chung | 12 tháng chung | 36 tháng chung | 36 tháng chung | Tuấn/nhà cung cấp |
| quote-09: Kiểm tra chức năng 6 tháng/lần | 2 lượt cho 1 trạm | 6 lượt kiểm tra trạm (2 mỗi trạm) | 6 lượt cho 1 trạm | 18 lượt kiểm tra trạm (6 mỗi trạm) | Đạt/nhà cung cấp |
| quote-10: Vệ sinh, hiệu chuẩn và vật tư ngoài scope kiểm tra | TBD | TBD | TBD | TBD | Đạt/nhà cung cấp |
| quote-11: Sau lũ, phản ứng sự cố và sửa nhỏ | TBD | TBD | TBD | TBD | Đạt/nhà cung cấp |
| quote-12: Màng/vật tư DO và cảm biến | TBD theo model | TBD | TBD | TBD | Đạt/Tuấn/nhà cung cấp |
| quote-13: Rà mòn/ăn mòn năm 3 | Chưa đến mốc | Chưa đến mốc | 1 rà soát | 3 rà soát | Đạt/nhà cung cấp |
| quote-14: Thay theo tình trạng, công và hiệu chuẩn lại | TBD | TBD | TBD | TBD | Đạt/Tuấn/nhà cung cấp |
| quote-15: Thu gom, vận chuyển và thải bỏ | TBD theo tuyến chung | TBD | TBD | TBD | Đạt/nhà cung cấp |
| quote-16: Lab, training bổ sung, SMS, software | TBD theo dịch vụ chung | TBD | TBD | TBD | Đạt/Tuấn |
| quote-17: Vận chuyển, import, payment, thuế bổ sung | TBD theo đơn hàng | TBD | TBD | TBD | Bá Nguyên/nhà cung cấp |
| quote-18: Permission, civil works, insurance, thiệt hại | TBD theo site/phạm vi | TBD | TBD | TBD | Đạt/Tuấn |

- SIM tạm tính một SIM/trạm. Hosting tạm tính một hệ thống chung: 36 tháng trong ba năm, không nhân lên 108 nếu nhà cung cấp tính chung. Nếu họ tính theo thiết bị/dung lượng phải đổi cách phân bổ theo báo giá.
- 18 lượt kiểm tra là số lượt **từng trạm**, chưa chắc là 18 chuyến đi: một tuyến có thể kiểm cả ba trạm. Báo giá công di chuyển cần nêu đơn vị chuyến và phạm vi gộp.
- Ba rà soát ở tháng 36 có thể gộp với đợt kiểm tra chức năng cuối. Chỉ cộng công bổ sung ngoài checklist đã bao gồm; tránh tính hai lần.
- Vệ sinh/hiệu chuẩn và vật tư thay vẫn cần lịch phù hợp model/site. Không suy ra chỉ cần vệ sinh sáu tháng/lần, hoặc phải chờ ba năm mới thay linh kiện hỏng. Không cộng 24/26 lượt vệ sinh và 12 hiệu chuẩn cũ khi Đạt chưa xác nhận.
- Không cộng đồng thời enclosure tham chiếu và enclosure đã chọn; gói waterproofing cần loại trừ glands đã mua hoặc thay hẳn dòng glands. Gói nguồn/modem/lắp phải nêu thành phần bao gồm để tránh lặp giá. Khoản lab/SMS/software phải tách từng dòng khi có scope/giá cụ thể.
- Thải bỏ theo lúc thay/đóng pilot; không mặc định tháo bỏ cả hệ thống ở tháng 36. Khoản quote-18 nằm ngoài register cũ, cần nhóm quyết định phạm vi trước khi loại trừ hoặc tính giá.

## 4. Kiểm soát theo năm và tổng đầy đủ

| Nhóm | Năm 1: 3 trạm | Năm 2: 3 trạm | Năm 3: 3 trạm | Tổng ba năm |
| --- | --- | --- | --- | --- |
| Mua ban đầu đã có giá, BOM tham chiếu | 41.686.398 | Không lặp tiền mua ban đầu | Không lặp tiền mua ban đầu | 41.686.398 |
| Dự phòng pH tùy chọn | 5.050.518 | Không tự thêm bộ | Không tự thêm bộ | 5.050.518 |
| Kiểm tra chức năng | 6 lượt, cần báo giá | 6 lượt, cần báo giá | 6 lượt, cần báo giá | 18 lượt, cần báo giá |
| SIM / hosting | 36 SIM-tháng / 12 tháng chung | Như năm 1 | Như năm 1 | 108 SIM-tháng / 36 tháng chung; cần báo giá |
| Rà mòn/ăn mòn năm 3 | Chưa đến mốc | Chưa đến mốc | 3 rà soát, kiểm tra phần gộp tháng 36 | Cần báo giá phần tăng thêm |
| Mua/lắp, vệ sinh, hiệu chuẩn, thay thế và dịch vụ chưa giá | Cần báo giá | Cần báo giá | Cần báo giá | Cần báo giá |
| **Tổng ngân sách đầy đủ** | **Chưa xác định** | **Chưa xác định** | **Chưa xác định** | **Chưa xác định** |

Công thức khi đủ dữ liệu: **CAPEX ban đầu cho 3 trạm + OPEX năm 1 + OPEX năm 2 + OPEX năm 3 + rà soát/thay thế/thải bỏ ngoài các gói đã tính + chi phí dùng chung chưa nằm trong những nhóm trên**. Mỗi khoản chỉ xuất hiện ở một nhóm; không cộng khấu hao kế toán thêm vào tiền mua thiết bị. Dự phòng đã mua chỉ tính một lần.

Đây là phép tính danh nghĩa theo giá lịch sử. Chưa chọn tỷ lệ tăng giá, lạm phát, discount rate hoặc contingency; chưa tự thêm phần trăm. Khi có báo giá cần ghi thời hạn hiệu lực và năm áp dụng trước khi gọi là dự báo chi phí ba năm.

## 5. Nguồn và bước cập nhật

- [CSV giá gốc](cost-price-evidence.csv), [audit/ảnh 25/11](live-price-audit-2026-11-25.csv), [manifest ảnh](cost-evidence/README.md). CSV rollup lưu URL trực tiếp, ngày, ảnh và hạn chế của từng dòng có giá.
- [Quyết định cập nhật](ba-nguyen-decisions-2026-11-25.md), [kế hoạch tiếp theo](ba-nguyen-next-steps-2026-11-26.md), [mẫu yêu cầu báo giá](supplier-quote-request-template.md).
- Các scenario USD 142,50/147,50 mỗi năm trong bảng 25/11 thuộc lịch/BOM cũ; không dùng làm OPEX cho lịch mới hoặc cộng vào bảng VND này.
- Khi Đạt/Tuấn chốt SKU và scope, thay giá/quantity đúng dòng; nếu mua theo gói, ghi những dòng được thay thế. Cập nhật đồng thời subtotal, evidence register và số sử dụng trên website cuối.
