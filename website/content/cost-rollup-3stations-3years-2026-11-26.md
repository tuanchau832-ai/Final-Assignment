# Bảng chi phí mỗi trạm → 3 trạm → 3 năm

Lập ngày 26/11/2026, cập nhật sau phản hồi Tuấn ngày 27/11. Đơn vị: VND, trừ giá gốc USD ghi riêng. [CSV chi tiết mở bằng Excel](cost-rollup-3stations-3years-2026-11-26.csv) hiện gồm **30 dòng**, thêm cột hai đợt mua và scope máy tham chiếu/TDS có điều kiện.

**Phương án hiện tại:** [mua 1 trạm trước rồi 2 trạm sau](staged-procurement-2026-11-27.csv), khi trạm đầu đạt và báo giá được duyệt. Dự phòng pH tùy chọn đổi từ ba bộ sang **một bộ dùng chung 1.683.506 VND**, tính riêng một lần; chưa xác nhận storage/48 giờ. [Review/plan mới](tuan-response-plan-2026-11-27.md) ghi các phần đã đủ và còn thiếu. Subtotal mua ban đầu không đổi; không có giá lắp/vận hành mới.

**Cập nhật scope dịch vụ 27/11:** theo [Đạt trả lời](https://github.com/tuanchau832-ai/Final-Assignment/pull/3#issuecomment-7202126238), gộp vệ sinh/kiểm tra hiệu chuẩn vào testing và review năm 3 vào tháng 36. Xin giá **6 chuyến chung cả ba trạm**, không phải 18 đơn giá chuyến riêng. Khối lượng kỹ thuật vẫn là 18 lượt kiểm từng trạm. [Lịch/checklist và kế hoạch xử lý](dat-response-plan-2026-11-27.md) ghi phần đã xác nhận và các ngưỡng/người/giá còn thiếu. Giá mua ban đầu không được kiểm lại hoặc thay đổi trong cập nhật này.

## Phạm vi và cách đọc

- Phạm vi làm việc: 3 trạm trong 36 tháng theo phản hồi Akai. BOM ESP32 + modem M.2 và cảm biến dưới đây là cấu hình tham chiếu có chứng cứ giá, chưa được Akai/Đạt chốt. Nếu chọn LILYGO hoặc cảm biến khác phải thay dòng và tính lại; không cộng hai cấu hình.
- **Giá có nguồn:** dùng hồ sơ và ảnh ngày 19–25/11, chưa kiểm lại giá ngày 26/11. USD quy đổi theo cơ sở lịch sử 25.940 VND/USD; không trộn với basis 26.000 trong scenario cũ. Không tự thêm chiết khấu số lượng.
- **Giả định:** số lượng BOM tham chiếu, 4 glands/trạm, một dịch vụ hosting chung và dự phòng pH đều cần xác nhận. Giá có nguồn không có nghĩa cấu hình/số lượng đã được duyệt.
- **Cần báo giá:** ô tiền trống trong CSV là chưa biết. Không dùng SUM của các số đã biết để gọi là tổng ngân sách đầy đủ. Dòng có số lượng 0 chỉ là năm chưa lên lịch mua/kiểm tra, không phải dịch vụ miễn phí.
- CAPEX tính theo đợt, không nhân thêm 3 theo thời gian. Ngày mua/commissioning trạm 2/3 chưa chốt. Các cột số lượng một/ba năm và bảng theo năm bên dưới là **baseline đủ ba trạm từ đầu kỳ**, không là lịch chi tiền thực tế đã duyệt; [worksheet commissioning](commissioning-cost-basis-2026-11-27.csv) chỉ ra khi nào phải đổi 108 SIM-tháng, 36 tháng hosting, 6 chuyến/18 kiểm và review tháng 36.

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
| Một bộ pH SEN0169-V2 dự phòng dùng chung | 1 × 1.683.506 cho cả pilot | 1.683.506 | **1.683.506** | Một bộ chung tối đa ba trạm; không nhân theo trạm/năm |
| **Subtotal mua sắm + dự phòng tùy chọn** | Thiết bị tương ứng + 1 kit chung | **15.578.972** | **43.369.904** | Vẫn thiếu vận hành và các khoản cần báo giá |

Giá kit có nguồn nhưng dùng một reserve chung là đề xuất Tuấn được đưa vào phương án hỏi giá; cần Akai/Đạt rà tương thích, nơi lưu, bảo quản, quyền lấy và vận chuyển để đáp ứng 48 giờ. Chưa có giá riêng đầu dò, shelf life hoặc cam kết đáp ứng. Khi dùng reserve không tính lại tiền cùng bộ; phí replenishment chưa có giá. Giả định cũ ba reserve là **5.050.518 VND**; chênh **3.367.012 VND** giữa hai phương án chỉ do số lượng, không là khoản tiết kiệm đã có quote.

### Mua hai đợt, chưa phải lệnh mua

| Đợt | Thiết bị đã có giá | Dự phòng tùy chọn | Subtotal có reserve | Điều kiện |
| --- | ---: | ---: | ---: | --- |
| 1: trạm đầu | 13.895.466 | 1.683.506 chung | 15.578.972 | Chốt site/BOM/quote và duyệt thử; còn thiếu máy tham chiếu, nguồn/lắp/dịch vụ |
| 2: hai trạm sau | 27.790.932 | Không tự mua thêm reserve | 27.790.932 | Trạm đầu đạt, giá/site/nguồn lực được duyệt lại |
| Toàn bộ nếu triển khai đủ | **41.686.398** | **1.683.506 chung** | **43.369.904** | Chưa là tổng lifecycle đầy đủ |

## 3. Khoản cần báo giá và quy tắc nhân

**Tiền dịch vụ/thiết bị chưa có giá ở bảng này cần báo giá.** Riêng quote-13 là scope review đã gộp trong quote-09, không là một khoản thu độc lập. Số lượng có thể tính trước theo lịch hoặc chỉ là cơ sở xin báo giá; CSV ghi rõ trạng thái từng dòng.

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
| quote-09: Testing, vệ sinh và kiểm tra hiệu chuẩn trong chuyến chung | Có 2 lần kiểm kỹ thuật/trạm; chưa có đơn giá một trạm | 2 chuyến chung × 3 trạm = 6 lượt kiểm trạm | Có 6 lần kiểm kỹ thuật/trạm; chưa chia giá chuyến | **6 chuyến chung**, gồm **18 lượt kiểm trạm** | Đạt/nhà cung cấp |
| quote-10: Vệ sinh phát sinh và hiệu chuẩn thêm theo model | TBD khi drift/nghi bám bẩn hoặc model yêu cầu | TBD | TBD | TBD | Đạt/nhà cung cấp |
| quote-11: Sau lũ, phản ứng sự cố và sửa nhỏ | TBD | TBD | TBD | TBD | Đạt/nhà cung cấp |
| quote-12: Màng/vật tư DO và cảm biến | TBD theo model | TBD | TBD | TBD | Đạt/Tuấn/nhà cung cấp |
| quote-13: Rà mòn/ăn mòn năm 3, scope đã gộp | Chưa đến mốc | Chưa đến mốc | 1 rà soát trong kiểm tháng 36 | 3 rà soát **trong chuyến tháng 36**, không thêm chuyến/phí review đã bao gồm | Đạt/nhà cung cấp |
| quote-14: Thay theo tình trạng, công và hiệu chuẩn lại | TBD | TBD | TBD | TBD | Đạt/Tuấn/nhà cung cấp |
| quote-15: Thu gom, vận chuyển và thải bỏ | TBD theo tuyến chung | TBD | TBD | TBD | Đạt/nhà cung cấp |
| quote-16: Lab, training bổ sung, SMS, software | TBD theo dịch vụ chung | TBD | TBD | TBD | Đạt/Tuấn |
| quote-17: Vận chuyển, import, payment, thuế bổ sung | TBD theo đơn hàng | TBD | TBD | TBD | Bá Nguyên/nhà cung cấp |
| quote-18: Permission, civil works, insurance, thiệt hại | TBD theo site/phạm vi | TBD | TBD | TBD | Đạt/Tuấn |
| quote-19: Thuê/mượn máy tham chiếu hoặc dịch vụ đối chiếu | TBD theo acceptance gate | TBD | TBD | TBD | Bá Nguyên xin giá; Đạt test; Akai rà |
| quote-20: TDS nếu field rule yêu cầu | TBD model/quantity | TBD | TBD | TBD | Akai chọn rule/thiết kế; Đạt field |

- SIM tạm tính một SIM/trạm. Hosting tạm tính một hệ thống chung: 36 tháng trong ba năm, không nhân lên 108 nếu nhà cung cấp tính chung. Nếu họ tính theo thiết bị/dung lượng phải đổi cách phân bổ theo báo giá.
- Đạt chọn basis xin giá theo chuyến kiểm cả ba trạm: 2 chuyến/năm × 3 năm = **6 chuyến**; mỗi chuyến 3 lượt kiểm trạm, tổng **18 lượt kiểm trạm**. Tuyến/site và năng lực nhà cung cấp còn chờ xác nhận. CSV quote-09 là `shared_system`, giá chuyến cả nhóm chưa được tự chia thành giá một trạm.
- Đạt đã xác nhận gộp ba rà soát tháng 36 vào chuyến testing cuối. quote-13 là **scope memo nằm trong quote-09**, không cộng đơn giá review độc lập hoặc chuyến thứ 7. Phụ tùng/công thay ngoài gói tính ở quote-14, trừ reserve đã mua nếu dùng.
- Đạt gộp vệ sinh/kiểm tra hiệu chuẩn vào testing, giữa kỳ chỉ xử lý khi có drift/số đo bất thường/nghi fouling hoặc sự cố và tính thêm. Tần suất hiệu chuẩn bổ sung theo model vẫn TBD; không suy ra mọi model chỉ cần hiệu chuẩn sáu tháng/lần. Không dùng 24/26 lượt vệ sinh hoặc 12 hiệu chuẩn làm basis mới.
- Yêu cầu khắc phục 48 giờ tính từ lúc nhóm vận hành tiếp nhận lỗi, chưa là khả năng/SLA được ký. Payer phải có cam kết trước triển khai theo yêu cầu Đạt; hiện chưa có văn bản/phân bổ chi trả, không coi là đã có tài trợ.
- Hiệu chuẩn thêm cần báo giá: [SEN0710](https://www.dfrobot.com/product-3104.html) khuyến nghị 90 ngày; [tài liệu pH](https://wiki.dfrobot.com/sen0169-v2/docs/24420) nêu mức lý tưởng tháng. Sáu chuyến testing chỉ là lịch cơ sở; chưa xác định phần công/vật tư/đi lại bổ sung. Không áp lại đơn giá calibration cũ hoặc coi extra calibration bằng 0.
- Không cộng đồng thời enclosure tham chiếu và enclosure đã chọn; gói waterproofing cần loại trừ glands đã mua hoặc thay hẳn dòng glands. Gói nguồn/modem/lắp phải nêu thành phần bao gồm để tránh lặp giá. Khoản lab/SMS/software phải tách từng dòng khi có scope/giá cụ thể.
- Thải bỏ theo lúc thay/đóng pilot; không mặc định tháo bỏ cả hệ thống ở tháng 36. Khoản quote-18 nằm ngoài register cũ, cần nhóm quyết định phạm vi trước khi loại trừ hoặc tính giá.

## 4. Baseline theo năm nếu đủ ba trạm cùng đầu kỳ; tổng đầy đủ còn chờ

| Nhóm | Năm 1: 3 trạm | Năm 2: 3 trạm | Năm 3: 3 trạm | Tổng ba năm |
| --- | --- | --- | --- | --- |
| Mua ban đầu đã có giá, BOM tham chiếu | 41.686.398 | Không lặp tiền mua ban đầu | Không lặp tiền mua ban đầu | 41.686.398 |
| Một dự phòng pH chung tùy chọn | 1.683.506 | Không tự thêm bộ | Không tự thêm bộ | 1.683.506 |
| Chuyến testing chung, gồm vệ sinh/kiểm tra hiệu chuẩn | 2 chuyến, gồm 6 lượt kiểm trạm | 2 chuyến, gồm 6 lượt kiểm trạm | 2 chuyến, gồm 6 lượt kiểm trạm và review năm 3 | **6 chuyến / 18 lượt kiểm trạm**, cần báo giá |
| SIM / hosting | 36 SIM-tháng / 12 tháng chung | Như năm 1 | Như năm 1 | 108 SIM-tháng / 36 tháng chung; cần báo giá |
| Rà mòn/ăn mòn năm 3 | Chưa đến mốc | Chưa đến mốc | 3 rà soát đã gộp chuyến tháng 36 | Không cộng phí review đã gồm; quote riêng phụ tùng/công thay ngoài gói |
| Mua/lắp, vệ sinh, hiệu chuẩn, thay thế và dịch vụ chưa giá | Cần báo giá | Cần báo giá | Cần báo giá | Cần báo giá |
| **Tổng ngân sách đầy đủ** | **Chưa xác định** | **Chưa xác định** | **Chưa xác định** | **Chưa xác định** |

Công thức khi đủ dữ liệu: **CAPEX ban đầu cho 3 trạm + OPEX năm 1 + OPEX năm 2 + OPEX năm 3 + rà soát/thay thế/thải bỏ ngoài các gói đã tính + chi phí dùng chung chưa nằm trong những nhóm trên**. Mỗi khoản chỉ xuất hiện ở một nhóm; không cộng khấu hao kế toán thêm vào tiền mua thiết bị. Dự phòng đã mua chỉ tính một lần.

Đây là phép tính danh nghĩa theo giá lịch sử. Chưa chọn tỷ lệ tăng giá, lạm phát, discount rate hoặc contingency; chưa tự thêm phần trăm. Khi có báo giá cần ghi thời hạn hiệu lực và năm áp dụng trước khi gọi là dự báo chi phí ba năm.

## 5. Nguồn và bước cập nhật

- [CSV giá gốc](cost-price-evidence.csv), [audit/ảnh 25/11](live-price-audit-2026-11-25.csv), [manifest ảnh](cost-evidence/README.md). CSV rollup lưu URL trực tiếp, ngày, ảnh và hạn chế của từng dòng có giá.
- [Quyết định cập nhật](ba-nguyen-decisions-2026-11-25.md), [kế hoạch tiếp theo](ba-nguyen-next-steps-2026-11-26.md), [mẫu yêu cầu báo giá](supplier-quote-request-template.md).
- Các scenario USD 142,50/147,50 mỗi năm trong bảng 25/11 thuộc lịch/BOM cũ; không dùng làm OPEX cho lịch mới hoặc cộng vào bảng VND này.
- Khi Đạt/Tuấn chốt SKU và scope, thay giá/quantity đúng dòng; nếu mua theo gói, ghi những dòng được thay thế. Cập nhật đồng thời subtotal, evidence register và số sử dụng trên website cuối.
