# Mẫu yêu cầu báo giá — Hanoi Water Watch

> **Cập nhật bàn giao:** Q190 4MB đã được chọn để lập dự toán; A và Q387 chỉ là phương án so sánh. Xem [gói hiện hành](publication-handoff-2026-11-28.md) và [giá phụ kiện tham chiếu](reference-cost-scenario-2026-11-28.csv). Ô báo giá nhà cung cấp để trống nghĩa là chưa nhận quotation, không có nghĩa là chưa tìm được giá niêm yết. RFQ dưới đây là bản nháp chưa gửi; khi dùng phải lấy scope hiện hành.


> **Basis chính mới:** [B — LILYGO Q190 đã được chọn để lập dự toán](controller-decision-2026-11-28.md), không là đơn mua. Xin quote B đúng variant và cùng sensor scope; A/A-kit vẫn là đối chiếu, không cộng các controller với nhau. [Lượng mua B theo đợt](selected-procurement-2026-11-28.csv) thay các số procurement A ở hồ sơ cũ. Vẫn cần quote thực và kiểm tương thích/nguồn/site trước mua.

> **Nghiên cứu mới 28/11:** đã có [listing/model và so cấu hình](ba-nguyen-completion-2026-11-28.md). FIT0348 49,50 USD là đầu dò ứng viên, không mặc định tương thích hoặc thay reserve. Connect8 tính theo 30 ngày (99 chu kỳ trong ví dụ ngày), không nhân đơn giá 30 ngày với 96 tháng lịch. Render 13 USD/system-month chỉ là phần compute; quote hosting phải gồm storage/usage/broker/support. Các nguồn này không thay supplier quotation hoặc chứng minh site/operator/payer đã cam kết. Đây là mẫu chưa gửi.

> **Basis cập nhật 28/11:** kỳ dự án **36 tháng chung từ commissioning trạm đầu** theo [proposal Tuấn 687557b1](https://github.com/tuanchau832-ai/Final-Assignment/blob/687557b1f2b50ed5ab416713706bd4221b883c2d/website/content/first-station-pilot.md). Ngày 0/6/6 là ví dụ, chưa là lịch lắp: **96 SIM-tháng, 36 hosting, 16 lượt kiểm trong 6 đợt**. Xem [khối lượng RFQ](service-rfq-quantities-2026-11-28.csv) và [plan hiện hành](ba-nguyen-next-steps-2026-11-28.md). Mốc 108 SIM-tháng/18 kiểm dưới đây chỉ áp dụng so sánh cùng bắt đầu; không dùng làm số mặc định cho mua lệch đợt.

Ngày gửi: [dd/mm/yyyy]  
Người liên hệ: Bá Nguyên, nhóm Hanoi Water Watch  
Mục đích: khảo sát chi phí cho phương án 3 trạm giám sát chất lượng nước trong 3 năm tại Hà Nội theo phản hồi Akai; địa điểm và cấu hình cụ thể vẫn cần nhóm xác nhận. Đây chưa phải đơn đặt hàng.

**Yêu cầu sau phản hồi Tuấn 27/11:** xin hai báo giá cùng scope: A dùng ESP32 HS2250V + SIM7600G-H-M.2 HS2164V, B dùng LILYGO đúng SKU/revision nhà cung cấp đề xuất. Giữ cùng SEN0169-V2, SEN0680, SEN0710, DS18B20 tham chiếu và site cho cả hai; báo riêng module/giao tiếp/phụ kiện khác nhau. Đợt 1 giao/lắp **một trạm** để nghiệm thu; đợt 2 **hai trạm** chỉ thực hiện sau nghiệm thu và duyệt giá lại. Bảng giá 19–25/11 chỉ là điểm đối chiếu, không là quote hiện tại. Ngày vận hành/site chưa chốt nên chưa coi 108 SIM-tháng/36 hosting hoặc sáu chuyến chung là lượng thực tế không đổi.

Cập nhật scope dịch vụ 28/11: giữ chu kỳ kiểm sáu tháng theo tuổi mỗi trạm mà [Đạt xác nhận](https://github.com/tuanchau832-ai/Final-Assignment/pull/3#issuecomment-7202126238), rồi tính theo ngày commissioning. Ví dụ 0/6/6 có đợt tháng 6 kiểm một trạm, các đợt tháng 12/18/24/30/36 kiểm ba trạm: **6 đợt, 16 lượt kiểm**. Xin xác nhận tuyến và giá theo scope từng đợt; không nhân giá một chuyến thêm ba lần. [Lịch 18 lượt cũ](maintenance-schedule-2026-11-27.csv) chỉ là so sánh cùng bắt đầu; [checklist](maintenance-acceptance-template-2026-11-27.md) chưa chứa kết quả field/ngưỡng đã duyệt.

Kính gửi [tên nhà cung cấp],

Nhóm cần hai báo giá A/B **tách biệt** bằng VND theo cấu hình gửi kèm, chưa chọn bên thắng trước khi so giá. Ghi model/revision, số lượng, đơn giá, tổng, VAT, giao Hà Nội, thời hạn, lead time và bảo hành. Điền `[địa điểm/site]`, `[ngày commissioning]`, `[SKU/variant]`, `[sơ đồ nguồn]`; phần thiếu ghi `TBD` và hỏi giá thiết bị hoặc đơn giá dịch vụ sơ bộ, chưa coi là quote giao/lắp chốt. Không cộng A và B thành một BOM.

## Nhóm A — Hộp và chống nước

1. Hộp ngoài trời IP65 hoặc cao hơn, đủ chứa controller, thiết bị 4G, bộ nguồn và đầu nối của **cấu hình đã chọn**.
2. Cable glands, gioăng, phụ kiện bịt kín và giá/bản lắp bên trong.
3. Vui lòng đề xuất kích thước phù hợp sau khi nhận sơ đồ bố trí thiết bị.

## Nhóm B — Nguồn năng lượng

1. Tấm pin năng lượng mặt trời.
2. Battery phù hợp và tuổi thọ/bảo hành.
3. Charge controller, DC converter, cầu chì/CB, chống quá áp và dây nguồn.
4. Giá đỡ, dây và phụ kiện lắp đặt.

Vui lòng ghi rõ công suất tấm pin, dung lượng battery, cấu hình tải giả định và các thành phần đã bao gồm. Công suất tải và che bóng chưa có số đo; cần được xác nhận trước khi báo nguồn/lắp trọn gói, không tự gán thành viên học phần đi khảo sát.

## Nhóm C — Kết nối di động

**Phương án A — cấu hình tham chiếu ESP32 riêng + SIM7600G-H-M.2; chưa gán người kiểm field:**

1. Carrier tương thích SIM7600G-H-M.2, chuẩn M.2 B-key.
2. Anten LTE phù hợp đầu IPEX-4, dây anten và đầu nối.
3. Nguồn cấp/bộ chuyển đổi đáp ứng yêu cầu điện áp và dòng đỉnh của modem.
4. Dịch vụ kiểm tra tích hợp với ESP32, nếu có.

**Phương án B — LILYGO T-SIM7600G-H R2, CH9102 (ESP32), theo proposal để so cùng scope; package/tính phù hợp chờ xác nhận:**

1. Board LILYGO T-SIM7600G-H R2 CH9102; xác nhận rõ Q190 4 MB hay Q387 16 MB (hoặc SKU đề xuất khác), không tự chọn chỉ từ chữ R2. Số lượng giao đợt 1 là một và đợt 2 là hai nếu được duyệt. Xác nhận SKU, ảnh PCB/revision và packing list; module 4G, SIM/GPS antennas, cáp nguồn, sạc và header thực có. Không tự dùng giá mặc định của biến thể khác trên cùng trang sản phẩm.
2. Nguồn/battery/panel/controller/converter tương thích board, gồm giới hạn điện áp, dòng đỉnh 4G và phụ kiện bảo vệ.
3. Dịch vụ kiểm tra giao tiếp với từng cảm biến đã chọn, gồm RS485/analog/1-Wire, nếu có.

Không báo cộng đồng thời board tích hợp và module M.2 riêng vào cùng một BOM, trừ khi nhóm yêu cầu hai phương án giá **để so sánh** và tách tổng của từng phương án.

## Nhóm D — Lắp đặt và vận hành

1. Cáp ngoài trời, đầu nối, giá/rack cảm biến và phụ kiện gá lắp.
2. Lắp đặt, commissioning, hiệu chuẩn ban đầu và nghiệm thu.
3. Testing **6 tháng/lần theo tuổi trạm**. Ví dụ 0/6/6 và đóng kỳ tháng 36: 16 lượt kiểm trong 6 đợt (1 + 3 + 3 + 3 + 3 + 3). Gói gồm vệ sinh thường lệ, kiểm hiệu chuẩn, cảnh báo thử, cảm biến, 4G/thời gian, nguồn/pin, hộp/cáp. Nêu công/đi lại/chuẩn/vật tư/thu gom đã gồm; không cộng bảng cấu phần lần nữa. Commissioning ST-02/03 nếu diễn ra cùng đợt tháng 6 là hai việc ban đầu, không tự coi là hai lượt testing sáu tháng.
4. Lịch cleaning 24/26 và các mức tiền cũ không dùng nữa. Lịch hiệu chuẩn theo model hiện xin giá **pH hằng tháng, độ đục trong 90 ngày**, kể cả không có drift. Cleaning do fouling/drift, sau lũ hoặc sửa chữa là scope phát sinh riêng. Không hiểu câu “chỉ phát sinh khi drift” là bỏ hiệu chuẩn định kỳ theo model.
5. Review mòn/ăn mòn **gộp chuyến đóng kỳ tháng 36** cho ba trạm, không thêm chuyến/phí review đã gồm. Trong ví dụ mua lệch, chỉ ST-01 đủ 36 tháng tuổi; ST-02/03 mới 30 tháng, cần ghi “project-close review” cho hai trạm này. Phụ tùng/công thay ngoài scope xin đơn giá riêng; không có danh sách bắt buộc thay hết và lỗi sớm xử lý sớm.
6. Phản ứng sau lũ/sự cố: kế hoạch yêu cầu **khắc phục trong 48 giờ từ khi nhóm vận hành tiếp nhận lỗi**. Xin nêu nhân lực/phụ tùng dự phòng, khả năng đáp ứng và phí trực/công/di chuyển/vật tư DO-pH từng sự cố, phần thuộc bảo hành hoặc thu thêm. Đây là yêu cầu xin giá, chưa là SLA/nguồn lực được ký xác nhận; quyền tiếp cận và payer allocation còn phải chốt.

7. Hiệu chuẩn: commissioning ba trạm tính riêng. Ví dụ 0/6/6 có **96 việc pH** ngoài ban đầu: 16 có thể gộp testing nếu gói thực hiện đầy đủ, còn **80 việc ngoài lịch testing**; số full calibration phải quote riêng là **80–96**, tùy số việc đầy đủ được xác nhận đã nằm trong gói. Đây không phải số chuyến. Lịch ngày minh họa cho **32 việc độ đục**, không có việc trùng đúng ngày testing trong ví dụ độc lập đó. Có thể gộp sớm đúng hạn, nhưng phải tính lại deadline từ lần đã làm. **Không quy đổi 90 ngày thành ba tháng lịch.** Xin đơn giá công/chuẩn, thể tích chuẩn, travel và phần đã gồm trong gói; không tự trừ toàn bộ 16 chỉ vì có chữ “calibration check”. Ghi phần thực sự đã bao gồm và không tính hai lần.
8. Trước nghiệm thu trạm đầu: xin giá thuê/mượn thiết bị tham chiếu hoặc dịch vụ đối chiếu DO/độ đục quanh ngưỡng. Nêu độ không chắc chắn, chuẩn, số điểm/đợt, công/travel và báo cáo. Không giả định đã có thiết bị mượn miễn phí. Các mục tiêu 3 NTU/0,30 mg/L do Tuấn đề xuất chưa có reviewer được chỉ định/nhận và chưa là ngưỡng bảo đảm từ hãng.

## Nhóm E — Dự phòng và điều kiện hai đợt mua

1. Xin phương án **một bộ pH dùng chung**, model tương thích, bảo quản/shelf life, nơi lưu và thời gian đưa đến từng site; lead time mua bù sau khi sử dụng. Giá kit lịch sử 1.683.506 VND chưa chứng minh spare probe price hoặc khả năng đáp ứng 48 giờ.
2. Với SEN0710, xin xác nhận có áp dụng giá tier 3+ cho hợp đồng giao **1 rồi 2 sau nghiệm thu** không; điều kiện đặt cọc, giữ giá/hoàn hủy và hiệu lực. Chưa tự áp tier 222 USD vào subtotal.
3. Proposal hiện dùng **Report rule cho trạm đầu và hoãn mua TDS**; hai quote chính giữ SEN0169-V2, SEN0680, SEN0710 và DS18B20. Nếu nhóm muốn xét Team rule sau này, báo TDS thành tùy chọn riêng cho **cả A và B**, không cộng vào subtotal trạm đầu hoặc coi thiết kế đã được kỹ thuật duyệt.
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
