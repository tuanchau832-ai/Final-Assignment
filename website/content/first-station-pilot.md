# Hồ sơ triển khai trạm đầu tiên của Hanoi WaterWatch

Pilot có mục tiêu 3 trạm trong 3 năm. Thử một trạm trước. Chỉ đặt mua hai trạm còn lại sau khi nghiệm thu trạm đầu và duyệt lại báo giá. Cấu hình, vị trí, gói dịch vụ và trách nhiệm vận hành được ghi nhận khi nhóm có xác nhận.

## Cấu hình và báo giá cùng phạm vi

| Hạng mục | Cấu hình tham chiếu A | Cấu hình so sánh B | Điều cần nhà cung cấp xác nhận |
| --- | --- | --- | --- |
| Board và 4G | ESP32 HS2250V và SIM7600G-H-M.2 HS2164V | LILYGO tích hợp, chờ exact SKU và revision | Package, phụ kiện, carrier nếu cần, anten và cáp anten, nguồn modem, cổng giao tiếp và tương thích nhà mạng tại điểm đặt |
| pH | SEN0169-V2 | Cùng model để so giá board | Bộ chuyển tín hiệu analog, giới hạn điện áp vào ADC, cáp, dung dịch chuẩn, mã đầu dò thay và bảo quản |
| DO | SEN0680 nước ngọt | Cùng model | Nguồn, địa chỉ và thông số RS485, phụ tùng và quy trình hiệu chuẩn |
| Độ đục | SEN0710 | Cùng model | Nguồn, địa chỉ và thông số RS485, chiều dài cáp và cách lắp tại vị trí đo |
| Nhiệt độ | DS18B20 HS2432V | Cùng model | Xác nhận chiều dài, vật liệu cáp và nếu cần đầu đo riêng sau khi so với số đo nhiệt độ từ probe DO |
| TDS | Chờ quyết định về quy tắc cảnh báo ngoài hiện trường | Cùng phạm vi khi so giá | Nếu chọn Team rule phụ thuộc TDS, bổ sung đầu đo, giao tiếp, chuẩn hiệu chuẩn và báo giá cho cả hai cấu hình |
| Giao tiếp và hộp | TTL–RS485 HS2455V, PG13.5 tạm 4 chiếc | Kiểm lại I/O và linh kiện theo board | Chốt mức tín hiệu, transceiver, đường kính ngoài của từng cáp, đầu siết, chống nước, gá, bảo vệ và phụ kiện đã có trong bộ |
| Nguồn cung cấp | Bộ nguồn theo tải đo | Bộ nguồn theo tải đo và thông số board | Panel, pin, controller, DC converter và bảo vệ. Ghi rõ phần tích hợp trên board và phần mua thêm |
| Thi công | Một trạm | Cùng phạm vi | Công lắp, đi lại, commissioning, kiểm hiệu chuẩn ban đầu, thuế, vận chuyển, thời hạn báo giá và bảo hành |

Yêu cầu hai báo giá có cùng model cảm biến, phạm vi lắp đặt và địa điểm để so tổng giá giao và lắp hoàn chỉnh. Báo tách từng hạng mục, phần bao gồm, phần phát sinh và phương án mở rộng thêm hai trạm sau nghiệm thu. Ghi lead time cho trạm đầu và linh kiện thay. Xác nhận biến thể board thay thế đáp ứng giao tiếp cảm biến, nguồn và thử 4G trước khi chọn. [Tài liệu SIMCom](https://www.simcom.com/technical_files.html?filetype=0&pro_cat=0&pro_li=156&time=0) · [Các biến thể LILYGO](https://wiki.lilygo.cc/products/t-sim-series/sim)

| Khoản | Mức tham chiếu | Cách dùng |
| --- | ---: | --- |
| Trạm đầu | 13.895.466 VND | Subtotal các hạng mục có giá niêm yết |
| Hai trạm tiếp theo | 27.790.932 VND | Subtotal tham chiếu, chỉ mua sau khi trạm đầu đạt |
| Cả ba trạm | 41.686.398 VND | Cộng hai đợt mua thiết bị đã có giá |
| Một bộ pH dự phòng chung | 1.683.506 VND | Tùy chọn, tính một lần và để riêng. Chỉ chốt khi phù hợp và đáp ứng thời gian sửa |
| Tiết kiệm nếu dùng một bộ thay cho ba bộ | 3.367.012 VND | Chênh lệch trong hai giả định dự phòng theo cùng mặt bằng giá |
| Tổng lắp đặt và vận hành ba năm | Chờ báo giá | Tách chi phí theo trạm, chi phí chung và các khoản theo sự cố |

Hai đợt mua trong bảng dùng hồ sơ giá 19–25/11 và tỷ giá quy đổi lịch sử 25.940 VND/USD. Bảng còn thiếu nguồn, carrier, anten, hộp, cáp, gá, công lắp và dịch vụ. [Bảng chi phí và căn cứ](https://github.com/tuanchau832-ai/Final-Assignment/blob/2a3fb2be9f00442dd784af2428c982e966cc9d3d/website/content/cost-rollup-3stations-3years-2026-11-26.md)

## Khảo sát vị trí và đo tải

| Thông tin ghi tại hiện trường | Điểm 1 | Điểm 2 | Điểm 3 |
| --- | --- | --- | --- |
| Vị trí, tọa độ, đơn vị quản lý và quyền tiếp cận | TBD | TBD | TBD |
| Đường vào, thời gian di chuyển, khả năng gom một chuyến | TBD | TBD | TBD |
| Mực lũ tham chiếu, độ cao gá hộp và hướng thoát nước | TBD | TBD | TBD |
| Nhà mạng, kết quả gửi lại bản tin và kết nối tại vị trí anten | TBD | TBD | TBD |
| Bóng râm, vị trí panel, thông tin nắng dùng để tính nguồn | TBD | TBD | TBD |
| Chiều dài, đường kính ngoài cáp, đầu siết, hộp, gá và chống xung | TBD | TBD | TBD |

Chốt điểm thử sau khi xác nhận quyền tiếp cận, vị trí lắp an toàn, sóng và khả năng bảo trì. Ghi điện áp tại đầu tải khi gửi 4G, công suất đỉnh và năng lượng cho một ngày chạy đại diện. Đo trong các trạng thái chờ, lấy mẫu, gửi dữ liệu thường, gửi cảnh báo và kết nối lại sau mất sóng. Lưu thời gian đo, phiên bản phần cứng, cấu hình chu kỳ và dữ liệu thô.

Tính `Wh/ngày = Σ(công suất trung bình W × thời gian h)` với các trạng thái phân bổ đủ một ngày. Đo ở đầu vào hệ thống để gồm tổn hao chuyển đổi, hoặc ghi rõ tổn hao nếu đo riêng từng tải. Tính pin theo tải đo, số ngày dự phòng, dung lượng sử dụng được và điều kiện môi trường. Dùng điều kiện nắng và bóng râm tại chỗ để kiểm panel 20 W. Pin, công suất panel và thời gian dự phòng chờ kết quả đo.

## Nghiệm thu trước khi mua hai trạm tiếp theo

| Phép thử | Bằng chứng cần lưu | Tiêu chí để quyết định mở rộng | Người phụ trách đề xuất |
| --- | --- | --- | --- |
| Cảm biến và hiệu chuẩn | Datasheet đúng SKU, chuẩn tham chiếu, số đo trước/sau vệ sinh và sai lệch | Đạt ngưỡng số đã duyệt cho từng model. Chuẩn bị quy trình hiệu chuẩn và tiêu chí drift trước khi thử | Đạt |
| 4G và tính toàn vẹn dữ liệu | Site/SIM, dấu thời gian, log lưu cục bộ và gửi lại sau mất mạng | Tái hiện được một lần gián đoạn và khôi phục. Đối chiếu bản tin thiếu hoặc lặp với ngưỡng đã chốt trước | Đạt + Tuấn |
| Nguồn | Wh/ngày, đỉnh dòng khi phát, điện áp tại modem, kết quả chạy tải | Điện áp trong giới hạn thiết bị, tải đạt mục tiêu dự phòng đã thống nhất và thiết bị ổn định khi phát 4G | Đạt |
| Cảnh báo đầu cuối | Mẫu đầu vào thử, sự kiện từ trạm đến backend, hiển thị và xác nhận người nhận | Có dấu thời gian của từng chặng, khớp trạng thái, chốt giới hạn độ trễ trước khi thử | Tuấn |
| Vận hành và duyệt chi phí | Biên bản hai tuần baseline, báo giá đã tách khoản, thời gian kiểm và thay linh kiện | Chốt operator chính, người dự phòng, cách đáp ứng yêu cầu 48 giờ và bên duyệt phát sinh trước khi mở rộng | Đạt + Tuấn, Bá Nguyên rà giá |

Phép thử nhúng hiện có 13 ca phần mềm, kiểm hai chế độ cảnh báo, phục hồi và thông báo trạng thái. Chốt quy tắc cảnh báo dùng cho trạm thực tế trước khi khóa BOM và ngưỡng nghiệm thu. Lưu kết quả thực địa theo mã trạm/ngày trong thư mục chung của nhóm. Link thư mục, reviewer phê duyệt kỹ thuật và các ngưỡng số còn TBD. [Checklist nghiệm thu và log sự cố](https://github.com/tuanchau832-ai/Final-Assignment/blob/2a3fb2be9f00442dd784af2428c982e966cc9d3d/website/content/maintenance-acceptance-template-2026-11-27.md) · [DFRobot pH](https://wiki.dfrobot.com/sen0169-v2/) · [DFRobot DO](https://wiki.dfrobot.com/sen0680/) · [DFRobot độ đục](https://www.dfrobot.com/product-3104.html)

## Vận hành chung ba trạm

- Dự trù 6 chuyến chung tại tháng 6, 12, 18, 24, 30 và 36, tương ứng 18 lượt kiểm từng trạm nếu cả ba trạm đã vận hành theo lịch. Mỗi chuyến gồm vệ sinh, kiểm tra hiệu chuẩn và cảnh báo thử. Rà mòn và ăn mòn gộp vào tháng 36. Xác nhận lại số lượt sau khi chốt ngày vận hành của từng trạm.
- Dùng một backend và cơ sở dữ liệu chung, mỗi trạm một SIM. Cơ sở xin giá là 36 tháng hosting và tối đa 108 SIM-tháng nếu mỗi trạm chạy đủ 36 tháng trong dự toán. Chốt mốc tính phí theo ngày commissioning, dung lượng bản tin, lưu trữ, backup và báo lỗi trước khi chọn gói.
- Nếu giữ một bộ pH chung, chỉ định chỗ lưu, người có quyền lấy và thời gian đưa tới từng trạm. Ghi phụ tùng đã dùng để tránh tính trùng. Log sự cố ghi lúc tiếp nhận, hạn 48 giờ, giờ phục hồi và người duyệt chi phí.
