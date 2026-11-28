# Chọn controller cho dự toán — Bá Nguyên, 28/11/2026

**Chọn B: LILYGO T-SIM7600G-H R2 4MB Q190 làm cơ sở dự toán chính.** Người dùng đã yêu cầu tự so chi phí, khả thi, ưu/nhược điểm rồi chọn phương án có lợi nhất. Đây là lựa chọn cho báo cáo; chưa là phê duyệt mua hàng, thiết kế đã nghiệm thu hoặc bằng chứng có tổng lifecycle thấp nhất.

So ba biến thể controller của **cùng giải pháp HWW**, giữ SEN0169-V2, SEN0680, SEN0710, DS18B20 tham chiếu, RS485 converter và glands tạm tính như nhau. Không thay ma trận community/HWW/AI của phần thiết kế, không tự chấm thêm điểm thiết kế cho Akai.

## So sánh tổng quan

| Tiêu chí | A: ESP32 + module M.2 riêng | B: LILYGO Q190 tích hợp — chọn để dự toán | A-kit: ESP32 + Waveshare 21707 |
| --- | --- | --- | --- |
| Phần thiết bị niêm yết / trạm | 6.271.700 VND + 293,90 USD; chưa carrier/antennas | 4.510.700 VND + 363,24 USD; board và package antenna cơ bản tích hợp | 4.705.700 VND + 407,89 USD; full HAT đã có module và bộ antenna/cáp theo packing list |
| Quy đổi so cùng giả định 25.940, làm tròn từng đơn vị | **13.895.466 VND**, chưa đủ controller package | **13.933.146 VND**, chưa power/site/installed scope | **15.286.367 VND**, chưa power/site/installed scope |
| OPEX | Cùng calibration/sensor consumables, SIM và backend; không có số đo điện/công sửa để so khác biệt | **Chưa chứng minh OPEX thấp hơn A/A-kit**; dùng cùng service quantities và không cộng giá tiết kiệm giả định | Cùng base OPEX; fan/rail/thiết bị phụ chỉ được tính sau xác định cấu hình sử dụng |
| Khả năng tích hợp | Cần carrier đúng M.2, mức UART/nguồn, antenna IPEX4 và kiểm modem; module rời chưa là hệ hoàn chỉnh | Hãng đã tích hợp ESP32/modem, holder/sạc và đưa hướng dẫn/ sơ đồ. Vẫn cần sensor rails 10–30 V, RS485, analog pH và 1-Wire, kiểm firmware/pinmap | Carrier/modem package rõ hơn A, có UART trong tài liệu; vẫn phải tích hợp với ESP32, không coi Raspberry Pi HAT đã tự chạy với mọi MCU |
| Sửa chữa | Có thể thay riêng board/module nếu đúng phụ kiện; nhiều điểm nối, công và spare chưa định giá | Ít phần rời ở controller; lỗi board có thể phải thay cả cụm. Không khẳng định 48 giờ khi chưa có kho/service | Module M.2 có thể thay riêng; assembly lớn/phụ kiện nhiều hơn và phần controller niêm yết cao hơn |
| Nguồn điện | Cần nguồn/cấp modem đủ dòng đỉnh và nguồn probe; chưa sizing | Solar sạc 5–6 V/500 mA, cell Li-ion/LiPo một cell; không là nguồn 10–30 V cho probe hoặc full solar kit | Cần nguồn đúng HAT/ESP32/probes; gói giao tiếp không thay solar/battery |
| Ưu điểm | Board ESP32 địa phương rẻ; tách phần hỏng có thể thuận tiện | Khớp kiểu kiến trúc tích hợp trong BOM Akai; giảm việc tìm/lắp carrier riêng; giá niêm yết thấp hơn A-kit ở cả hai phần tiền tệ | Package carrier/module/antenna rõ, giữ tính module và có hướng dẫn hãng |
| Nhược điểm/rủi ro | Giá subtotal có vẻ thấp vì thiếu thiết bị thiết yếu; tăng việc tích hợp và tiếp xúc | Nhập khẩu/lead time, pinmap và flash/buffering phải kiểm; chỉ một LTE antenna trong listing, chưa chứng minh đủ coverage/diversity ngoài trời | Giá cao hơn, package có thành phần chưa chắc cần; không có bằng chứng đổi lại OPEX thấp hơn hoặc nghiệm thu tốt hơn |

Nguồn trực tiếp: [Hshop ESP32](https://hshop.vn/mach-phat-trien-vietduino-esp32), [module M.2](https://hshop.vn/mach-sim7600g-h-m-2-simcom-original-4g-lte-cat-4-module-global-coverage-gnss-m-2-connector), [LILYGO đúng Q190](https://lilygo.cc/en-us/products/t-sim7600?variant=42358717972661), [Waveshare 21707](https://www.waveshare.com/sim7600g-h-m2-4g-hat.htm), [Waveshare UART/wiki](https://www.waveshare.com/wiki/SIM7600G-H-M2_4G_HAT), [LILYGO hardware](https://github.com/Xinyuan-LilyGO/LilyGo-Modem-Series/blob/main/docs/en/esp32/sim7600-esp32/README.MD). Giá/package được mở trực tiếp ngày 28/11; [nguồn và ảnh](cost-research-2026-11-28/README.md).

## Vì sao chọn B

1. **So giá theo scope, không chỉ tổng thiếu phụ kiện.** B cao hơn subtotal A **37.680 VND/trạm** tại giả định tỷ giá này, nhưng A chưa có carrier/antennas. A chỉ rẻ hơn đầy đủ nếu phần chênh chi phí phụ kiện/tích hợp của A so với B không vượt 37.680; chưa có quote để chứng minh điều đó. Không tự đặt giá carrier hoặc khẳng định B chắc chắn rẻ hơn A đã lắp.
2. **B thấp hơn A-kit 1.353.221 VND/trạm ở phần thiết bị đã định giá**, tương đương 4.059.663 VND cho ba trạm. So native currency: B thấp hơn 195.000 VND và 44,65 USD/trạm. Hai packing list khác nhau về số antenna/tiện ích; nếu site thực cần diversity/đồ bảo vệ thì phải báo thêm, không coi mọi chức năng tương đương.
3. **Ít bước tích hợp controller hơn là ưu thế khả thi ở mức thiết kế.** Kết luận này là suy luận từ package của hãng, không phải kết quả đo thời gian lắp hoặc tỷ lệ hỏng. Các cảm biến, firmware và nguồn thực vẫn phải kiểm trước khi mở rộng.
4. **Không dùng OPEX giả để tạo người thắng.** Cả ba dùng cùng bộ sensor, cùng lịch pH/độ đục/testing và backend. Không có dữ liệu current draw, failure rate, chi phí công hoặc supplier service quote theo controller để tính TCO khác nhau. B được chọn vì cân bằng bằng chứng về package/giá/khối lượng tích hợp hiện có.

Q387 16MB hiện 94,32 USD, cao hơn Q190 **24,98 USD**; chưa có firmware/storage benchmark yêu cầu thêm flash nên không trả thêm chỉ để có con số lớn hơn. Nếu thử nghiệm chứng minh Q190 không đủ buffering/firmware hoặc pinmap/nguồn không đạt thì mở lại lựa chọn, không tự ghi đã pass.

## Ngân sách chính đã cập nhật

| Hạng mục | VND theo giả định quy đổi |
| --- | ---: |
| Một trạm B, phần thiết bị có giá | **13.933.146** |
| Hai trạm sau | **27.866.292** |
| Ba trạm, phần thiết bị có giá | **41.799.438** |
| Một kit pH reserve tùy chọn dùng chung | **1.683.506** |
| Đợt một + reserve | **15.616.652** |
| Ba trạm + một reserve | **43.482.944** |

USD kiểm 28/11 quy đổi bằng **giả định ngân sách 25.940 VND/USD từ nguồn ngày 19/11**, không là tỷ giá giao dịch hiện tại. Quy đổi và làm tròn từng đơn giá VND trước khi nhân lượng; không làm tròn tổng USD sau cùng rồi coi đó là cùng một phép tính. Q190: 69,34 × 25.940 = 1.798.679,60 → **1.798.680 VND/board**.

43.369.904 VND là **case A cũ** với một reserve, giữ để đối chiếu; không còn là số chính của B. 43.482.944 vẫn là **subtotal chưa đầy đủ**, không bao đủ power/site/giao-lắp/dịch vụ/thuế/phí/replacement. CAPEX và lifecycle đầy đủ giữ chưa xác định. Không nhân thiết bị ba lần cho ba năm.

[CSV procurement B có công thức/nguồn](selected-procurement-2026-11-28.csv), [model và giả định](current-cost-comparison-2026-11-28.json), [bản tổng hợp](ba-nguyen-completion-2026-11-28.md). Không sửa nhánh Tuấn/final/main, gửi tin hoặc publish; bản họ đang có chưa tự đổi sang số mới của B.
