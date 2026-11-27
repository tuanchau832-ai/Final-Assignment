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

### Giá công khai và khoản cần xin giá trọn bộ

| Hạng mục | Mức đang hiển thị | Điều kiện so sánh |
| --- | --- | --- |
| ESP32 HS2250V + SIM7600G-H-M.2 HS2164V | 195.000 + 1.566.000 = **1.761.000 VND**, giá hai linh kiện tại Hshop | Cộng carrier, anten/cáp, nguồn modem, công tích hợp, giao hàng và chi phí thay sớm. [ESP32](https://hshop.vn/mach-phat-trien-vietduino-esp32) · [Modem M.2](https://hshop.vn/mach-sim7600g-h-m-2-simcom-original-4g-lte-cat-4-module-global-coverage-gnss-m-2-connector) |
| LILYGO T-SIM7600E/G/SA-H | Trang họ sản phẩm hiển thị **65,31 USD** trước khi xác nhận biến thể và kho | Hỏi bản T-SIM7600G-H R2 cụ thể, anten LTE, revision, tồn kho, giá giao Việt Nam, thuế và bảo hành. Cộng các phần nguồn và giao tiếp còn thiếu. [LILYGO](https://lilygo.cc/en-us/products/t-sim7600) |
| DO SEN0680 | **4.428.000 VND** tại Hshop | Xin giá và thời gian giao màng quang thay thế. Ưu tiên đo đối chiếu quanh ngưỡng DO trước khi đặt thêm. [Hshop](https://hshop.vn/cam-bien-oxy-hoa-tan-dfrobot-rs485-fluorescence-dissolved-oxygen-sensor-freshwater) |
| Độ đục SEN0710 | **229 USD** một chiếc trên trang DFRobot, **222 USD/chiếc** từ ba chiếc | Hỏi có giữ được giá cho lịch giao 1 rồi 2 chiếc sau nghiệm thu không. Chênh lệch niêm yết khi mua đủ ba là 21 USD. Chờ kiểm sai số quanh ngưỡng trước khi cam kết số lượng. [DFRobot](https://www.dfrobot.com/product-3104.html) |

Bá Nguyên có thể dùng cùng một yêu cầu để nhận hai báo giá có thể so trực tiếp. Yêu cầu báo **một trạm giao và lắp hoàn chỉnh**, giá riêng cho hai trạm sau nghiệm thu và sáu chuyến bảo trì cả tuyến. Mỗi báo giá cần model, revision, vật tư đi kèm, giá sau thuế, phí giao, thời hạn, lead time, điều kiện bảo hành và các khoản tính theo lượt hoặc phát sinh. Tổng tiền cần xem gồm mua, lắp, chi phí vận hành và thay thế trong ba năm. Giá công khai ở trên là các điểm đối chiếu theo nguồn và tiền tệ gốc. Báo giá trọn bộ vẫn đang chờ.

## Khảo sát vị trí và đo tải

### Tuyến khảo sát ưu tiên

Đề xuất khảo sát **Cầu Mới → Cầu Dậu → khu vực Cầu Thanh Liệt** trên cùng tuyến sông Tô Lịch. Ưu tiên kiểm Cầu Mới trước vì nhóm đã dùng khu vực này làm bối cảnh thiết kế. Đây là danh sách khảo sát bờ sông gần ba mốc, với vị trí gắn trạm và cửa xả cụ thể chờ xác minh. Hồ sơ cải tạo hai bờ xác nhận tên các cầu. Công trình điều tiết, thu gom và bổ cập nước có thể ảnh hưởng đến vị trí và cách đọc baseline, nhất là khu vực Thanh Liệt. Xin đơn vị quản lý xác nhận hiện trạng cửa xả, quyền tiếp cận và điều kiện thi công trước khi chốt. [Hồ sơ đánh giá tác động môi trường tuyến sông](https://sonnmt.hanoi.gov.vn/images/2026/DTM%20Sng%20T%20Lch%20np%20online.pdf) · [Cổng thông tin Hà Nội về vận hành và bổ cập sông Tô Lịch](https://hanoi.gov.vn/tin-dia-phuong/nuoc-song-to-lich-duoc-cai-thien-dang-ke-co-the-nhin-thay-day-4250906071249244.htm)

Tọa độ trong registry của app được đánh dấu là minh họa. Giữ nguyên các trạm demo. Ghi tọa độ GPS của **cửa xả** và **vị trí tủ** khi khảo sát, kèm ảnh, hướng dòng chảy và khoảng cách giữa tủ và đầu đo. [Registry trạm Tô Lịch](https://github.com/tuanchau832-ai/Final-Assignment/blob/a85be4edbfc09033910461d1b3c9f6ece5919274/HanoiWaterWatch/shared/registry/HWW-TLH-001.json)

| Thông tin ghi tại hiện trường | Điểm 1 | Điểm 2 | Điểm 3 |
| --- | --- | --- | --- |
| Khu vực khảo sát | Cầu Mới | Cầu Dậu | Cầu Thanh Liệt |
| Vị trí, tọa độ, đơn vị quản lý và quyền tiếp cận | TBD | TBD | TBD |
| Đường vào, thời gian di chuyển, khả năng gom một chuyến | TBD | TBD | TBD |
| Mực lũ tham chiếu, độ cao gá hộp và hướng thoát nước | TBD | TBD | TBD |
| Nhà mạng, kết quả gửi lại bản tin và kết nối tại vị trí anten | TBD | TBD | TBD |
| Bóng râm, vị trí panel, thông tin nắng dùng để tính nguồn | TBD | TBD | TBD |
| Chiều dài, đường kính ngoài cáp, đầu siết, hộp, gá và chống xung | TBD | TBD | TBD |

Chốt điểm thử sau khi xác nhận quyền tiếp cận, vị trí lắp an toàn, sóng và khả năng bảo trì. Ghi điện áp tại đầu tải khi gửi 4G, công suất đỉnh và năng lượng cho một ngày chạy đại diện. Đo trong các trạng thái chờ, lấy mẫu, gửi dữ liệu thường, gửi cảnh báo và kết nối lại sau mất sóng. Lưu thời gian đo, phiên bản phần cứng, cấu hình chu kỳ và dữ liệu thô.

Tính `Wh/ngày = Σ(công suất trung bình W × thời gian h)` với các trạng thái phân bổ đủ một ngày. Đo ở đầu vào hệ thống để gồm tổn hao chuyển đổi, hoặc ghi rõ tổn hao nếu đo riêng từng tải. Tính pin theo tải đo, số ngày dự phòng, dung lượng sử dụng được và điều kiện môi trường. Dùng điều kiện nắng và bóng râm tại chỗ để kiểm panel 20 W. Pin, công suất panel và thời gian dự phòng chờ kết quả đo.

### Dự toán nguồn trước khi đo

DO SEN0680 và độ đục SEN0710 đều công bố **0,2 W** và dải cấp nguồn **10–30 V DC**. Nếu cấp điện liên tục thì riêng hai cảm biến dùng khoảng **9,6 Wh/ngày** theo datasheet. Khi thử tải, đo thêm board, pH, modem trong lúc phát và kết nối lại, chuyển đổi nguồn và các phụ kiện. Ưu tiên giữ nhịp đo tại trạm, gom các bản tin thường để giảm tải truyền và gửi cảnh báo ngay. Kiểm tác động đến độ trễ và số bản tin sau mất mạng trước khi chọn chu kỳ. [SEN0680](https://wiki.dfrobot.com/sen0680) · [SEN0710](https://www.dfrobot.com/product-3104.html) · [SIM7600 M.2](https://en.simcom.com/product/SIM7600X-H-M2.html)

Dữ liệu khí hậu NASA POWER 2001–2025 tại điểm tham chiếu 21,00°N, 105,81°E cho bức xạ ngang trung bình thấp nhất vào **tháng 1, 2,24 kWh/m²/ngày**. Tháng 12 là 2,54 và trung bình năm là 3,74 kWh/m²/ngày. Dùng tháng thấp cho dự toán và ghi bóng râm tại điểm lắp. Đây là dữ liệu khí hậu theo ô lưới. Tải hệ thống và sản lượng ở vị trí panel cần đo riêng. [Dữ liệu NASA POWER](https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=ALLSKY_SFC_SW_DWN&community=RE&longitude=105.81&latitude=21.00&format=JSON) · [Phương pháp NASA POWER](https://power.larc.nasa.gov/docs/methodology/data/sources_hydrology/)

Bảng độ nhạy sau dùng **2 giờ nắng đỉnh tương đương/ngày**, thấp hơn mức trung bình tháng 1 ở ô lưới, với hiệu suất tổng **70%**, dự phòng **2 ngày** và pin sử dụng được **80%**. Các giá trị này là giả định tính thử. Dùng số đo tải và điều kiện nắng tại điểm lắp để duyệt cấu hình.

| Tải trung bình giả định | Năng lượng mỗi ngày | Panel tối thiểu theo phép tính | Pin danh định tối thiểu | Quy đổi ở 12 V |
| ---: | ---: | ---: | ---: | ---: |
| 1 W | 24 Wh | 17,1 W | 60 Wh | 5 Ah |
| 2 W | 48 Wh | 34,3 W | 120 Wh | 10 Ah |
| 3 W | 72 Wh | 51,4 W | 180 Wh | 15 Ah |

Theo giả định trên, panel **20 W chỉ cấp khoảng 28 Wh/ngày**. Nếu tải đo được vượt mức này thì tăng sản lượng khả dụng hoặc giảm tải rồi đo lại. Cần thêm biên để nạp lại pin sau ngày thiếu nắng. Dùng `Wh/ngày ÷ (giờ nắng đỉnh × hiệu suất)` cho panel và `Wh/ngày × ngày dự phòng ÷ phần pin dùng được` cho pin. Đối chiếu thêm điện áp tối thiểu tại modem và các lần reset khi phát. [Bức xạ tham khảo theo vùng](https://globalsolaratlas.info/map?c=16.056371%2C105.79834%2C6&r=VNM)

## Nghiệm thu trước khi mua hai trạm tiếp theo

| Phép thử | Bằng chứng cần lưu | Tiêu chí để quyết định mở rộng | Người phụ trách đề xuất |
| --- | --- | --- | --- |
| Cảm biến và hiệu chuẩn | Datasheet đúng SKU, chuẩn tham chiếu, số đo trước/sau vệ sinh và sai lệch | Đạt ngưỡng số đã duyệt cho từng model. Chuẩn bị quy trình hiệu chuẩn và tiêu chí drift trước khi thử | Đạt |
| 4G và tính toàn vẹn dữ liệu | Site/SIM, dấu thời gian, log lưu cục bộ và gửi lại sau mất mạng | Tái hiện được một lần gián đoạn và khôi phục. Đối chiếu bản tin thiếu hoặc lặp với ngưỡng đã chốt trước | Đạt + Tuấn |
| Nguồn | Wh/ngày, đỉnh dòng khi phát, điện áp tại modem, kết quả chạy tải | Điện áp trong giới hạn thiết bị, tải đạt mục tiêu dự phòng đã thống nhất và thiết bị ổn định khi phát 4G | Đạt |
| Cảnh báo đầu cuối | Mẫu đầu vào thử, sự kiện từ trạm đến backend, hiển thị và xác nhận người nhận | Có dấu thời gian của từng chặng, khớp trạng thái, chốt giới hạn độ trễ trước khi thử | Tuấn |
| Vận hành và duyệt chi phí | Biên bản hai tuần baseline, báo giá đã tách khoản, thời gian kiểm và thay linh kiện | Chốt operator chính, người dự phòng, cách đáp ứng yêu cầu 48 giờ và bên duyệt phát sinh trước khi mở rộng | Đạt + Tuấn, Bá Nguyên rà giá |

Phép thử nhúng hiện có 13 ca phần mềm, kiểm hai chế độ cảnh báo, phục hồi và thông báo trạng thái. Chốt quy tắc cảnh báo dùng cho trạm thực tế trước khi khóa BOM và ngưỡng nghiệm thu. Lưu kết quả thực địa theo mã trạm/ngày trong thư mục chung của nhóm. Link thư mục, reviewer phê duyệt kỹ thuật và các ngưỡng số còn TBD. [Checklist nghiệm thu và log sự cố](https://github.com/tuanchau832-ai/Final-Assignment/blob/2a3fb2be9f00442dd784af2428c982e966cc9d3d/website/content/maintenance-acceptance-template-2026-11-27.md) · [DFRobot pH](https://wiki.dfrobot.com/sen0169-v2/) · [DFRobot DO](https://wiki.dfrobot.com/sen0680/) · [DFRobot độ đục](https://www.dfrobot.com/product-3104.html)

### Kiểm độ phù hợp của cảm biến trước khi mua

- **Độ đục:** SEN0710 công bố sai số ±5% toàn thang 0–1.000 NTU ở 25 °C, tương đương **±50 NTU** theo thông số đó. Độ phân giải 0,1 NTU chỉ cho biết bước hiển thị. Đối chiếu với máy tham chiếu ở các mức quanh 50, 57 và 75 NTU, cùng một điểm cao đại diện. Nếu sai số đo được vượt giới hạn nhóm duyệt, chọn đầu đo có thông số tốt hơn trong vùng 40–80 NTU hoặc xử lý số sát ngưỡng bằng kiểm tra xác nhận. Có thể xin giá hoặc hỏi mượn thiết bị tham chiếu. OBS-3+ là một dòng để so độ chính xác và chi phí cả bộ, gồm giao tiếp và lắp đặt. [SEN0710](https://www.dfrobot.com/product-3104.html) · [Campbell Scientific OBS-3+](https://us.campbellsci.com/obs-3plus)
- **DO:** SEN0680 công bố ±3% toàn thang 0–20 mg/L, tương đương **±0,6 mg/L**. Khoảng giữa 4,00 và 4,20 mg/L của logic mô phỏng chỉ là 0,20 mg/L. Kiểm bằng máy DO tham chiếu quanh vùng này trước khi dùng số đo để đổi ngưỡng độ đục. pH, DO và độ đục có thời gian đáp ứng riêng. Chốt thời gian phản hồi cảnh báo theo phép thử trên cả chuỗi thiết bị. [SEN0680](https://wiki.dfrobot.com/sen0680) · [SEN0169-V2](https://wiki.dfrobot.com/sen0169-v2/) · [SEN0710](https://www.dfrobot.com/product-3104.html)
- **Pilot tiết kiệm:** Đề xuất chạy Report rule ở chế độ cảnh báo nội bộ trong giai đoạn đo đối chiếu. Cân nhắc mua đầu TDS sau khi nhóm chọn Team rule và xác nhận TDS có ích trên dữ liệu tại điểm đặt. Đề nghị mượn thiết bị tham chiếu từ đơn vị có thiết bị và quy trình phù hợp, hoặc hỏi Trung tâm Quan trắc môi trường miền Bắc về phạm vi phép đo và phí. [Trung tâm Quan trắc môi trường miền Bắc](https://cem.gov.vn/gioi-thieu)

Mục tiêu thử đề xuất cho trạm đầu là sai lệch độ đục tối đa **3 NTU** quanh ngưỡng 57 NTU, và sai lệch DO tối đa **0,30 mg/L** quanh 4,00 mg/L khi dùng Report rule. Đạt và reviewer cần duyệt trước khi thử, sau khi xét sai số của máy tham chiếu. Các mẫu trong vùng không chắc chắn cần kiểm tra lại. Nếu định dùng điều kiện DO 4,00/4,20 để đổi ngưỡng ở Team rule, cần độ không chắc chắn nhỏ hơn **0,10 mg/L** quanh hai mốc hoặc thay cách ra quyết định. Những giá trị này là mục tiêu nghiệm thu đề xuất của dự án. Các ca mô phỏng dùng dữ liệu thử đã biết nên cần thêm phép đối chiếu cảm biến lặp lại ở trạm.

### Đề xuất phân vai nghiệm thu

| Vai trò | Đầu mối đề xuất | Trách nhiệm |
| --- | --- | --- |
| Thực hiện phần cứng và khảo sát | Đạt | Xác minh điểm, đo tải, đối chiếu đầu đo và ký phần đo thực địa |
| Thực hiện phần mềm và quản lý bằng chứng | Tuấn | Kiểm nhật ký, dữ liệu đến, mất mạng và khôi phục, cảnh báo đầu cuối và tính đầy đủ biên bản |
| Rà độc lập | Akai | Đối chiếu ngưỡng đã chốt, đọc log thô và ghi nhận điều kiện đạt hoặc cần sửa |
| Rà chi phí | Bá Nguyên | So báo giá cùng phạm vi, kiểm khoản đã gồm và phát sinh trước khi đề xuất chi |
| Quyết định triển khai thêm | Nhóm và người có quyền duyệt chi | Ký biên bản đạt của trạm đầu, xác nhận quyền lắp hai trạm sau và duyệt báo giá đã cập nhật |

Các vai trò trên chờ từng người xác nhận. Biên bản cần ghi ngày, mã trạm, model/revision, simulator hoặc firmware version, ngưỡng duyệt trước phép thử, dữ liệu thô và chữ ký. Operator chính, backup, bên trả phí và cơ chế đáp ứng 48 giờ do nhóm và đơn vị vận hành xác nhận.

## Vận hành chung ba trạm

- Dự trù 6 chuyến chung tại tháng 6, 12, 18, 24, 30 và 36, tương ứng 18 lượt kiểm từng trạm nếu cả ba trạm đã vận hành theo lịch. Mỗi chuyến gồm vệ sinh, kiểm tra hiệu chuẩn và cảnh báo thử. Rà mòn và ăn mòn gộp vào tháng 36. Xác nhận lại số lượt sau khi chốt ngày vận hành của từng trạm.
- Dùng một backend và cơ sở dữ liệu chung, mỗi trạm một SIM. Cơ sở xin giá là 36 tháng hosting và tối đa 108 SIM-tháng nếu mỗi trạm chạy đủ 36 tháng trong dự toán. Chốt mốc tính phí theo ngày commissioning, dung lượng bản tin, lưu trữ, backup và báo lỗi trước khi chọn gói.
- Nếu giữ một bộ pH chung, chỉ định chỗ lưu, người có quyền lấy và thời gian đưa tới từng trạm. Ghi phụ tùng đã dùng để tránh tính trùng. Log sự cố ghi lúc tiếp nhận, hạn 48 giờ, giờ phục hồi và người duyệt chi phí.
