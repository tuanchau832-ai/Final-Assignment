# Phụ kiện ứng viên — giá và phạm vi đã kiểm ngày 27/11/2026

Đã tìm thêm carrier/antenna, nguồn, pin, panel, cáp và phụ kiện gá cho cấu hình tham chiếu ESP32 + SIM7600 M.2. [CSV 14 dòng](accessory-candidates-2026-11-27.csv) ghi model, nhà bán, URL trực tiếp, giá gốc, đơn vị, VAT, giao hàng, phần gồm/thiếu và tình trạng. Đây là nghiên cứu ứng viên; **không thay BOM hoặc cộng vào subtotal 43.369.904 VND**.

## Giá có thể truy xuất và điều chưa đủ

| ID / sản phẩm | Giá quan sát | Phạm vi và kết luận |
| --- | ---: | --- |
| 001 — [Waveshare SIM7600G-H-M2 4G HAT, SKU 21707](https://www.waveshare.com/sim7600g-h-m2-4g-hat.htm) | **113,99 USD/kit** | Browser mở trực tiếp cho giá này; kết quả search cũ 95,99 USD không dùng. Gồm carrier, modem, hai anten, hai cáp IPEX và phụ kiện USB/GPS. **Đã có modem**, nếu chọn phải thay dòng module cũ, không mua cộng hai modem. Chưa kiểm ESP32 UART/power thực tế. |
| 002 — [Solar Power Manager D Acce A, SKU 26363](https://www.waveshare.com/solar-power-manager-d.htm?sku=26363) | **12,99 USD/module + holder** | Đúng biến thể có holder. Không có cells, panel hoặc hệ nguồn ngoài trời hoàn chỉnh; đầu ra 5V/3A chưa cấp trực tiếp cho probe 10–30V. |
| 003 — [Solar Power Manager C, HS2381V](https://hshop.vn/waveshare-solar-power-manager-c-supports-3x-18650-batteries-multi-protection-circuits) | **729.000 VND/gói**, VAT gồm | Listing ghi module + adapter; ba cell 18650 không kèm. C là phương án thay D, không tự mua cả hai. Cần xác nhận adapter đi kèm và rail cho probe. |
| 004 — [EVE ICR 18650/26V, 3,6V 2550mAh](https://store.potech.vn/san-pham/cell-pin-li-ion-eve-18650-26v-3-6v-2550mah/) | **41.040 VND/cell**, VAT gồm | Giá một cell, chưa là pack/BMS/holder/thiết kế dự phòng. Phí vận chuyển chưa gồm. Chưa duyệt số cell hoặc autonomy. |
| 005 — [LONG WP7.2-12, 12V 7,2Ah](https://bcavn.com/bca/dich-vu-sua-chua/binh-ac-quy-long-12v72ah-8748.html) | **320.000 VND/bình**, VAT gồm | Listing cũ năm 2021 vẫn hiển thị giá này khi mở 27/11; tồn kho chưa được nhà bán xác nhận. Là phương án AGM khác; **không ghép với sạc Li-ion C/D** thành gói đã hợp lệ. |
| 006 — [Goldsun 20W Poly, 6V](https://thietbidiengoldsun.com.vn/san-pham/tam-pin-nang-luong-mat-troi-20w-poly/) | **371.349 VND/tấm hiển thị** | Nội dung dưới trang lại ghi **279.000 VND**: đã lưu cả mâu thuẫn, cần quote sửa rõ. Panel rời, chưa có battery/controller/gá site; 20W chưa được sizing và 6V không tự thành panel sạc AGM 12V. |
| 007 — [Cáp IPEX4 → SMA đầu kim, 30cm](https://itso.vn/day-noi-dai-ipex4-danh-cho-card-wifi-m2-chan-cam-sma-dau-kim-dai-30cm/) | **25.000 VND/cáp**, VAT gồm | Listing dùng cho Wi-Fi; cần kiểm suy hao/băng tần LTE, giới tính/chân SMA và sealing. Không kết luận ghép được với anten SMA-J male chỉ vì đều ghi SMA. |
| 008 — [Ziisor TX4G-JW-5, HS2211V](https://hshop.vn/anten-4g-3dbi-50mm-sma-j-male-tx4g-jw-5-glue-rod-antenna-ziisor) | **25.000 VND/anten**, VAT gồm | LTE 690–960/1700–2700MHz theo listing; SMA-J male, không cắm trực tiếp IPEX4 của module. Chưa chốt số anten MAIN/DIV, pigtail đúng đầu và cách chống nước. |
| 009 — [Cáp XC-IPX-SMA13F-15, HS2206V](https://hshop.vn/dau-chuyen-ket-noi-sma-k-female-1-3-to-ipex-adapter-15cm-xc-ipx-sma13f-15-ziisor) | **25.000 VND/cáp**, VAT gồm | **Loại khỏi kết nối trực tiếp modem:** nguồn ghi IPEX-1, module cần IPEX4. Ghi lại để tránh mua nhầm. |
| 010 — [Viger PVN457, nhiều kích thước](https://vinadenki.vn/tu-dien-nhua-vo-hop-dau-noi-cap) | **305.000 VND**, chưa VAT | Recheck tham chiếu đang có. Chưa chọn đúng size/lid/holes; vẫn không cộng vào tổng. |
| 011 — [Upun PG13.5](https://daihoaphu.vn/cable-gland-upun-pg135) | **3.175 VND/gland**, sau VAT | Đã có bốn gland tạm tính trong BOM. Không cộng thêm bốn lần nữa. Mâu thuẫn đường kính 7–12/D6–12mm và số lượng cần chốt. |
| 012 — [SSCT-304-4.6x200, dây rút inox](https://store.potech.vn/san-pham/day-rut-inox-304-tu-khoa-4-6x200-mm/) | **151.200 VND/gói** | Quy cách 100 sợi/bịch; không coi giá này là mỗi sợi. Chưa phải rack/gá chịu lực hoàn chỉnh; kích thước/số lượng và đơn vị quote cần xác nhận. |
| 013–014 — carrier mua riêng, cáp/gá/rail nguồn đầy đủ | **Cần báo giá** | Chưa có giá carrier riêng kiểm được; không lấy giá kit trừ module khác nhà bán để suy ra. Cáp hiện trường/gá/nguồn hoàn chỉnh cần bản vẽ và scope site. |

USD giữ nguyên đồng tiền gốc; chưa quy đổi hoặc đưa vào ngân sách. Khi so quote, chọn tỷ giá có ngày/cơ sở và ghi phép nhân, phí chuyển tiền, nhập khẩu, VAT, freight. Không dùng lại tỷ giá 19/11 rồi gọi là giá giao đến Hà Nội ngày 27/11.

## Bằng chứng và giới hạn

[Ảnh + SHA-256](cost-evidence/accessories-2026-11-27/README.md) lưu giá và package. Có [JSON quan sát trực tiếp](cost-evidence/accessories-2026-11-27/source-observations.json). Web reader bị 403 ở Waveshare nhưng Chrome đã mở được HTTP 200; giá mới lấy từ browser và ảnh, không lấy search snippet. Link Hshop Solar D cũ vẫn 404 khi mở trực tiếp; giá 252.000 VND trên search **không được hồi sinh làm evidence dùng được**. Solar C và D không phải cùng model.

Các listing có thể thay đổi sau ngày kiểm. Tồn kho, warranty tại Việt Nam, chi phí giao/lắp và tính tương thích chưa được nhà bán cam kết. Không có supplier RFQ, tin nhắn đặt hàng hoặc mua hàng được gửi trong đợt này.

## Nội dung đã thêm vào RFQ

Nhà cung cấp cần tách **carrier-only** và **full kit đã có modem**; xác nhận UART/power/đầu IPEX4, bộ anten MAIN/DIV và đúng đầu SMA. Nhánh nguồn phải thống nhất chemistry/voltage; báo đủ panel, cells/battery, charger, converter 10–30V, modem supply, protective parts, cáp và gá. Giải thích mâu thuẫn giá panel, đơn vị gói dây rút và loại adapter đi kèm Solar C. Báo giá các dịch vụ lắp, hiệu chuẩn, testing, hosting và disposal vẫn còn thiếu.
