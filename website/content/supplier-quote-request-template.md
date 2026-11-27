# Mẫu yêu cầu báo giá — Hanoi Water Watch

Ngày gửi: [dd/mm/yyyy]  
Người liên hệ: Bá Nguyên, nhóm Hanoi Water Watch  
Mục đích: khảo sát chi phí cho phương án 3 trạm giám sát chất lượng nước trong 3 năm tại Hà Nội theo phản hồi Akai; địa điểm và cấu hình cụ thể vẫn cần nhóm xác nhận. Đây chưa phải đơn đặt hàng.

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

**Phương án A — chỉ dùng nếu Đạt/Tuấn xác nhận ESP32 riêng + SIM7600G-H-M.2:**

1. Carrier tương thích SIM7600G-H-M.2, chuẩn M.2 B-key.
2. Anten LTE phù hợp đầu IPEX-4, dây anten và đầu nối.
3. Nguồn cấp/bộ chuyển đổi đáp ứng yêu cầu điện áp và dòng đỉnh của modem.
4. Dịch vụ kiểm tra tích hợp với ESP32, nếu có.

**Phương án B — chỉ dùng nếu Đạt/Tuấn xác nhận board LILYGO tích hợp:**

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

Vui lòng tách từng hạng mục trong báo giá thay vì báo một khoản trọn gói. Báo giá sẽ được dùng để lập ngân sách sơ bộ; không được hiểu là cam kết mua hàng.

Trân trọng,

Bá Nguyên  
Hanoi Water Watch — CITP Group 5
