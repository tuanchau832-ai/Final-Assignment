# Mẫu yêu cầu báo giá — Hanoi Water Watch

Ngày gửi: [dd/mm/yyyy]  
Người liên hệ: Bá Nguyên, nhóm Hanoi Water Watch  
Mục đích: khảo sát chi phí cho phương án 3 trạm giám sát chất lượng nước trong 3 năm tại Hà Nội theo phản hồi Akai; địa điểm và cấu hình cụ thể vẫn cần nhóm xác nhận. Đây chưa phải đơn đặt hàng.

**Yêu cầu sau phản hồi Tuấn 27/11:** xin hai báo giá cùng scope: A dùng ESP32 HS2250V + SIM7600G-H-M.2 HS2164V, B dùng LILYGO đúng SKU/revision nhà cung cấp đề xuất. Giữ cùng SEN0169-V2, SEN0680, SEN0710, DS18B20 tham chiếu và site cho cả hai; báo riêng module/giao tiếp/phụ kiện khác nhau. Đợt 1 giao/lắp **một trạm** để nghiệm thu; đợt 2 **hai trạm** chỉ thực hiện sau nghiệm thu và duyệt giá lại. Bảng giá 19–25/11 chỉ là điểm đối chiếu, không là quote hiện tại. Ngày vận hành/site chưa chốt nên chưa coi 108 SIM-tháng/36 hosting hoặc sáu chuyến chung là lượng thực tế không đổi.

Cập nhật scope dịch vụ 27/11: theo [phản hồi Đạt](https://github.com/tuanchau832-ai/Final-Assignment/pull/3#issuecomment-7202126238), xin giá theo **6 chuyến chung cho cả 3 trạm trong 3 năm**, tương ứng **18 lượt kiểm tra trạm**. Không nhân giá một chuyến chung thêm ba lần. [Lịch tương đối](maintenance-schedule-2026-11-27.csv) và [checklist chuẩn bị](maintenance-acceptance-template-2026-11-27.md) chưa chứa kết quả field/ngưỡng nghiệm thu đã duyệt.

Kính gửi [tên nhà cung cấp],

Nhóm cần báo giá bằng VND cho những hạng mục phù hợp **cấu hình được gửi kèm**. Vui lòng nêu rõ mã hàng, số lượng, đơn giá, tổng tiền, VAT, phí vận chuyển tới Hà Nội, thời gian giao hàng, bảo hành, thời hạn hiệu lực của báo giá và các điều kiện kỹ thuật hoặc lắp đặt đi kèm. Trước khi gửi, người phụ trách điền `[số trạm]`, `[địa điểm/site]`, `[SKU/variant]`, `[sơ đồ nguồn]` và chọn **một** trong hai phương án modem dưới đây; các ô chưa có dữ liệu thì ghi `TBD` và chỉ xin tư vấn cấu hình, chưa xin báo giá chốt.

## Nhóm A — Hộp và chống nước

1. Hộp ngoài trời IP65 hoặc cao hơn, đủ chứa controller, thiết bị 4G, bộ nguồn và đầu nối của **cấu hình đã chọn**.
2. Cable glands, gioăng, phụ kiện bịt kín và giá/bản lắp bên trong.
3. Vui lòng đề xuất kích thước phù hợp sau khi nhận sơ đồ bố trí thiết bị.

## Nhóm B — Nguồn năng lượng

1. Tấm pin năng lượng mặt trời.
2. Battery phù hợp và tuổi thọ/bảo hành.
3. Charge controller, DC converter, cầu chì/CB, chống quá áp và dây nguồn.
4. Giá đỡ, dây và phụ kiện lắp đặt.

Vui lòng ghi rõ công suất tấm pin, dung lượng battery, cấu hình tải giả định và các thành phần đã bao gồm. Nhóm sẽ cung cấp công suất tải và thông tin che bóng sau khảo sát địa điểm.

## Nhóm C — Kết nối di động

**Phương án A — cấu hình tham chiếu ESP32 riêng + SIM7600G-H-M.2, Akai rà thiết kế và Đạt kiểm field:**

1. Carrier tương thích SIM7600G-H-M.2, chuẩn M.2 B-key.
2. Anten LTE phù hợp đầu IPEX-4, dây anten và đầu nối.
3. Nguồn cấp/bộ chuyển đổi đáp ứng yêu cầu điện áp và dòng đỉnh của modem.
4. Dịch vụ kiểm tra tích hợp với ESP32, nếu có.

**Phương án B — LILYGO để so cùng scope; SKU/revision/package chờ xác nhận kỹ thuật:**

1. Board LILYGO đúng variant/revision `[SKU]`, số lượng `[số trạm]`; nêu rõ module 4G, SIM/GPS antennas, cáp nguồn và bộ sạc solar có sẵn trong gói hay phải mua riêng.
2. Nguồn/battery/panel/controller/converter tương thích board, gồm giới hạn điện áp, dòng đỉnh 4G và phụ kiện bảo vệ.
3. Dịch vụ kiểm tra giao tiếp với từng cảm biến đã chọn, gồm RS485/analog/1-Wire, nếu có.

Không báo cộng đồng thời board tích hợp và module M.2 riêng vào cùng một BOM, trừ khi nhóm yêu cầu hai phương án giá **để so sánh** và tách tổng của từng phương án.

## Nhóm D — Lắp đặt và vận hành

1. Cáp ngoài trời, đầu nối, giá/rack cảm biến và phụ kiện gá lắp.
2. Lắp đặt, commissioning, hiệu chuẩn ban đầu và nghiệm thu.
3. Testing **6 tháng/lần**, tháng 6/12/18/24/30/36: xin giá **một chuyến kiểm cả ba trạm**, hai chuyến/năm, sáu chuyến/ba năm. Mỗi chuyến gồm ba lượt kiểm trạm, vệ sinh, kiểm tra hiệu chuẩn, thử cảnh báo, cảm biến, 4G/thời gian, nguồn/pin và hộp/cáp. Xin nhà cung cấp xác nhận tính khả thi tuyến sau khi có site, nêu giá trọn scope và bảng cấu phần công/đi lại/dung dịch chuẩn/vật tư/thu gom đã bao gồm. Không cộng bảng cấu phần lần nữa vào tổng gói.
4. Đạt đã loại 24/26 lượt vệ sinh và 12 hiệu chuẩn/năm khỏi basis mới. Giữa hai lần testing chỉ xin giá phát sinh khi có drift/số đo bất thường/nghi bám bẩn hoặc sự cố. Tần suất hiệu chuẩn thêm nếu model yêu cầu vẫn cần datasheet và scope riêng; không cộng lại phần đã nằm trong chuyến testing.
5. Review mòn/ăn mòn năm 3 **gộp trong chuyến testing tháng 36** cho cả ba trạm. Không báo thêm chuyến hoặc phí review đã bao gồm. Báo riêng đơn giá từng phụ tùng/công thay ngoài scope, tiêu chí thay theo manufacturer, hiệu chuẩn lại và thu gom. Chưa có danh sách linh kiện bắt buộc thay, và lỗi sớm vẫn xử lý trước năm 3.
6. Phản ứng sau lũ/sự cố: kế hoạch yêu cầu **khắc phục trong 48 giờ từ khi nhóm vận hành tiếp nhận lỗi**. Xin nêu nhân lực/phụ tùng dự phòng, khả năng đáp ứng và phí trực/công/di chuyển/vật tư DO-pH từng sự cố, phần thuộc bảo hành hoặc thu thêm. Đây là yêu cầu xin giá, chưa là SLA/nguồn lực được ký xác nhận; quyền tiếp cận và payer allocation còn phải chốt.

7. Hiệu chuẩn theo model ngoài testing: nguồn SEN0710 khuyến nghị mỗi 90 ngày, tài liệu pH nêu mức lý tưởng hằng tháng. Xin rà procedure/site, vật tư chuẩn, scope công và các lượt cần thêm ngoài sáu chuyến cơ sở; ghi việc nào gộp được để tránh tính hai lần. Không dùng đơn giá cleaning/12 calibrations của bảng cũ làm quote mới.
8. Trước nghiệm thu trạm đầu: xin giá thuê/mượn thiết bị tham chiếu hoặc dịch vụ đối chiếu DO/độ đục quanh ngưỡng. Nêu độ không chắc chắn, chuẩn, số điểm/đợt, công/travel và báo cáo. Không giả định đã có thiết bị mượn miễn phí. Các mục tiêu 3 NTU/0,30 mg/L do Tuấn đề xuất còn cần Đạt/Akai duyệt trước thử.

## Nhóm E — Dự phòng và điều kiện hai đợt mua

1. Xin phương án **một bộ pH dùng chung**, model tương thích, bảo quản/shelf life, nơi lưu và thời gian đưa đến từng site; lead time mua bù sau khi sử dụng. Giá kit lịch sử 1.683.506 VND chưa chứng minh spare probe price hoặc khả năng đáp ứng 48 giờ.
2. Với SEN0710, xin xác nhận có áp dụng giá tier 3+ cho hợp đồng giao **1 rồi 2 sau nghiệm thu** không; điều kiện đặt cọc, giữ giá/hoàn hủy và hiệu lực. Chưa tự áp tier 222 USD vào subtotal.
3. Nếu nhóm chọn Team rule cần TDS, báo riêng SKU/giao tiếp/chuẩn/tổng bổ sung vào **cả A và B**. Nếu không cần thì ghi loại trừ có căn cứ; không coi BOM bốn cảm biến tự đủ cho rule TDS.
4. Cho giá/điều kiện thay DS18B20 bằng temperature channel sẵn trong probe nếu phù hợp; chỉ là phương án so sánh cần kỹ thuật duyệt, không tự bỏ đầu đo trong đơn giá hiện tại.

## Phụ lục hỏi giá phụ kiện — nguồn nghiên cứu ngày 27/11

[Bảng ứng viên](accessory-candidates-2026-11-27.md) và [CSV](accessory-candidates-2026-11-27.csv) chỉ để nhà cung cấp đối chiếu, chưa là danh sách đặt hàng.

1. Tách giá carrier-only cho module HS2164V khỏi full kit SIM7600G-H-M2 4G HAT SKU 21707. Full kit đã có modem/anten/cáp; không cộng lại dòng modem cũ. Xác nhận UART với ESP32, mức logic, cấp nguồn và phạm vi integration test.
2. Báo đúng cặp IPEX4 và SMA pin/socket/thread, băng tần, suy hao, chống nước, số MAIN/DIV/GNSS. Cáp HS2206V là **IPEX-1**, không chấp nhận thay trực tiếp cho IPEX4. Cáp ITSO ghi SMA đầu kim chưa chứng minh ghép được với anten TX4G-JW-5 SMA-J male.
3. Với nguồn C/D, ghi rõ biến thể, holder/adapter/cells có trong gói, chemistry và sơ đồ rails. Không ghép bình AGM 12V WP7.2-12 với bộ sạc Li-ion 3,7V C/D. Đầu ra 5V chưa thay nguồn probe 10–30V; xin quote converter, bảo vệ và kiểm tải đầy đủ.
4. Xác nhận lại giá Goldsun 20W/6V vì trang có 371.349 VND tại giá sản phẩm nhưng 279.000 VND ở mô tả. Chưa chọn panel chỉ vì đúng 20W; cần measured load, shading và autonomy trước.
5. Ghi đơn vị dây rút SSCT-304-4.6x200 theo gói 100 sợi, VAT/vận chuyển và số gói thực cần. Báo rack/gá/ốc/cáp hiện trường riêng, không coi gói dây rút là hệ gá đã hoàn chỉnh.

Vui lòng tách từng hạng mục trong báo giá thay vì báo một khoản trọn gói. Báo giá sẽ được dùng để lập ngân sách sơ bộ; không được hiểu là cam kết mua hàng.

Trân trọng,

Bá Nguyên  
Hanoi Water Watch — CITP Group 5
