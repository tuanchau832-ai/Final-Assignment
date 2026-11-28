# Bá Nguyên tự trả lời các câu hỏi đã gửi Akai và Đạt

> **Cập nhật sau tự nghiên cứu:** [report hoàn thiện](ba-nguyen-completion-2026-11-28.md) đã tìm các ứng viên SEN0237-A (169 USD), SEN0189 (9,90 USD), KIT0021 (7,50 USD) và FIT0348 (49,50 USD), kèm scope/giới hạn. Khớp mô tả/giá không xác nhận đó là exact SKU Akai chọn. Những đoạn dưới nói “chưa có exact SKU” vẫn đúng ở mức lựa chọn thiết kế, nhưng không hiểu là chưa tìm thấy sản phẩm/giá nào trên thị trường.

Rà ngày 28/11/2026, sau comment Tuấn [7235294127](https://github.com/tuanchau832-ai/Final-Assignment/pull/3#issuecomment-7235294127), source `ea4cce0ab3e1c520e074b48ae703d3dfe69570fb`. Đây là kết quả đọc tài liệu và kiểm nguồn, không phải câu trả lời được viết thay rồi gán cho đồng đội. Các kết luận theo thiết kế/quote/field được phân biệt dưới đây.

## 1. Căn cứ và giới hạn

- **Phân công:** [README dòng 38–44](../../README.md): Akai so sánh phương án/ma trận/sơ đồ; Đạt prototype, phương pháp/kết quả test và kế hoạch triển khai/vận hành; Bá Nguyên giá, quantities, OPEX/lifecycle/payer; Tuấn APA, phụ lục và editing. Phần tích hợp Tuấn đã tự thực hiện được ghi nhận đúng đóng góp, không trở thành nghĩa vụ vận hành thực địa.
- **Tài liệu cũ đã đọc lại:** READMEFIRST, template chính thức, `Team confirming request - Dat.docx`, `HWW_Design_and_Cost_Comparison_Expanded.md`, phản hồi [Akai 7188129413](https://github.com/tuanchau832-ai/Final-Assignment/pull/3#issuecomment-7188129413), [Đạt 7202126238](https://github.com/tuanchau832-ai/Final-Assignment/pull/3#issuecomment-7202126238), hai proposal Tuấn và bản tích hợp mới. Hồ sơ giá 19–25/11 được giữ riêng, không tự đổi ngày.
- **BOM đã xác định:** người dùng làm rõ tên được nói là BOM, không phải file BOMZ; file chính là Expanded MD đã có. Đã đọc toàn bộ và [đối chiếu từng dòng](akai-bom-reconciliation-2026-11-28.md). Trạng thái trước đó tìm BOMZ được thay thế; không còn blocker thiếu tài liệu.
- **Tính chất bài nộp:** template yêu cầu giải pháp đề xuất, prototype/test và chi phí có nguồn; không được ghi prototype mô phỏng thành thiết bị đã lắp. Giá, site hoặc chữ ký còn thiếu được trình bày trung thực trong dự toán. Việc thiếu hợp đồng/field measurement không phải lý do để giao mọi thành viên đi thực hiện một pilot thật trước khi hoàn thiện báo cáo.

## 2. Những câu hỏi mới đã gửi Akai

### AKAI-28-RULE — Hoãn TDS, giữ DS18B20 và Report rule?

**Đã có căn cứ phạm vi trong BOM Akai: bốn kênh, không liệt kê TDS, có đầu đo nhiệt độ.** Proposal Tuấn `687557b1` ghi dùng Report rule nội bộ cho trạm đầu, giữ DS18B20 để đối chiếu nhiệt độ, hoãn mua TDS. Trong source simulator `ea4cce0a`, Report rule chỉ dùng pH, DO và turbidity để xác lập cảnh báo; điều kiện TDS/nhiệt độ nằm trong Team rule. TDS hiển thị/log trong demo là số mô phỏng, không chứng minh đã mua đầu đo thật.

DS18B20 là đầu đo nhiệt độ, TDS là thông số tổng chất rắn hòa tan; hai tên không phải hai cách gọi cùng một thiết bị. [Hướng dẫn pH DFRobot](https://wiki.dfrobot.com/sen0169-v2/docs/24420) nêu lấy nhiệt độ từ cảm biến để thực hiện bù nhiệt. Điều đó giải thích việc giữ kênh nhiệt độ trong cấu hình tham chiếu. Nhiệt độ sẵn từ probe DO có thể là phương án kỹ thuật khác, nhưng chưa chứng minh có thể bỏ DS18B20 mà không đổi vị trí đo/firmware/kiểm đối chiếu.

**Xử lý của Bá Nguyên:** giữ bốn cảm biến trong cấu hình tham chiếu A/B và TDS là tùy chọn chưa tính; không hỏi Akai nghiên cứu lại mã. File Akai không ghi model DS18B20, nên chỉ xác nhận chức năng nhiệt độ; DS18B20 cụ thể vẫn là reference model từ các nguồn prototype/proposal mới.

### AKAI-28-REVIEW — Akai nhận rà độc lập/nghiệm thu?

**Không phải nghĩa vụ từ phân công gốc; rút khỏi danh sách câu hỏi cần Akai trả lời.** README không giao Akai đo/duyệt nghiệm thu phần cứng hoặc ký acceptance. Việc Tuấn nêu tên trong proposal chỉ là đề xuất; không có phản hồi nhận vai trong các comment đã đọc. Không tự chuyển câu hỏi này sang người khác. Reviewer/signatory của một triển khai thật giữ `Not assigned`; Bá Nguyên chỉ kiểm phương pháp/ảnh hưởng chi phí trong báo cáo.

### AKAI-28-BOM — Model/interfaces/power nào dùng để tính?

**Nguồn Akai chỉ định đã được xác nhận là BOM mục 2.3 trong Expanded MD.** Akai đã trả lời D2/D3 rằng phần model do Đạt/Tuấn nghiên cứu, nên không hỏi lại Akai chọn model hoặc tổng hợp trả lời của họ. BOM này mô tả LILYGO tích hợp; bảng có giá nguồn hiện dùng ESP32/M.2 riêng làm tham chiếu. Phải gọi rõ là hai cấu hình khác nhau; file Akai chưa xác định revision/SKU LILYGO hoặc model chính xác các probe.

**Xử lý của Bá Nguyên:** ghi đúng “candidate/reference BOM”; tự kiểm model, package, giá và quan hệ thay thế; giữ toàn bộ tiền mua ban đầu hiện hành. Dùng file Akai làm căn cứ phạm vi thiết kế; tự đối chiếu model/package trước khi định giá cùng cấu hình. Phần còn thiếu là chi tiết model/quote, không còn là thiếu file hoặc một nhiệm vụ mới của Akai.

## 3. Những câu hỏi mới đã gửi Đạt

### DAT-28-START — Site và ngày vận hành?

**Đã biết kế hoạch đề xuất, chưa biết ngày/site đã được phê duyệt.** Hồ sơ cũ và mới dùng các điểm khảo sát Cầu Mới → Cầu Dậu → Cầu Thanh Liệt, ưu tiên trạm đầu gần Cầu Mới. Chưa có GPS cửa xả/tủ, văn bản quyền lắp, lịch commissioning, chiều dài cáp, mực lũ hoặc số đo tải/4G thực tế. Tra tên cầu trên bản đồ không thay được các bằng chứng đó.

Kỳ chung 36 tháng đã được Tuấn dùng cho dự toán. Với offsets minh họa 0/6/6, tự tính được:

| Chỉ số | Năm 1 | Năm 2 | Năm 3 | Tổng |
| --- | ---: | ---: | ---: | ---: |
| SIM-tháng | 24 | 36 | 36 | **96** |
| Hosting chung | 12 | 12 | 12 | **36** |
| Testing từng trạm | 4 | 6 | 6 | **16** |
| Đợt theo lịch | 2 | 2 | 2 | **6** |

ST-01 kiểm tại 6/12/18/24/30/36; ST-02/03 tại 12/18/24/30/36 của dự án. Nếu commissioning hai trạm sau ở tháng 6 thì đó là công ban đầu, không biến thành testing tuổi sáu tháng. Đóng kỳ, tuổi trạm là 36/30/30. Số 108/18 vẫn đúng cho so sánh cùng bắt đầu, không phải mặc định mua lệch đợt.

**Xử lý:** dùng offsets minh họa và site đề xuất để hoàn thiện dự toán; ngày/site/phí thi công vẫn TBD. Không tự đặt lịch thật hoặc bắt Đạt thực hiện khảo sát mới để trả câu hỏi của Bá Nguyên.

### DAT-28-CAL — Ai làm calibration; testing có bao hết không?

**Tự kiểm được quy trình/tần suất và phép tính, chưa kiểm được người thực hiện hoặc inclusions của một quote chưa tồn tại.** Đạt đã xác nhận testing sáu tháng gồm vệ sinh thường lệ, kiểm hiệu chuẩn và cảnh báo thử; cleaning giữa kỳ theo drift/fouling. Tuấn đã bổ sung lịch pH tháng và SEN0710 trong 90 ngày từ lần calibration trước. [pH hãng](https://wiki.dfrobot.com/sen0169-v2/docs/24420) nêu mức tháng lý tưởng; [SEN0710 hãng](https://www.dfrobot.com/product-3104.html) nêu 90 ngày. Đây là scope để xin giá, không phải dịch vụ đã được mua.

- pH: 36 + 30 + 30 = **96 việc** ngoài commissioning. Có 16 trùng lịch testing và 80 nằm ngoài lịch testing.
- Số **full calibration phải báo riêng** là `96 − số full calibration đã được nhà cung cấp xác nhận nằm trong testing`. Khi chưa có xác nhận, khoảng là **80–96**, không tự trừ 16 chỉ vì gói có chữ “check”.
- Độ đục: lịch ngày minh họa từ 01/01/2027 cho **32 việc**, chưa gộp sớm, không phải 32 chuyến. 90 ngày không luôn bằng ba tháng lịch; làm sớm phải tính lại hạn từ ngày làm. Số chuyến và vật tư phụ thuộc cách gộp và operator địa phương, chưa có số thực tế.
- Initial calibration ba trạm là scope riêng. Việc cuối kỳ trong worksheet cần nhà cung cấp xác nhận có thực hiện khi bàn giao/đóng kỳ hay không.

**Xử lý:** Bá Nguyên tự chuẩn bị lịch, công thức và mẫu quote; người thực hiện để vai trò chung `future service provider/operator, unassigned`, không tự gán Đạt, Akai hoặc Tuấn. Không dùng đơn giá USD 10/60 hoặc lịch cleaning 24/26 của tài liệu cũ.

### DAT-28-OPS — Operator, spare và 48 giờ?

**48 giờ là yêu cầu kế hoạch đã có; tên người, kho, trực và cam kết chi chưa có bằng chứng.** Mốc tính từ lúc nhóm vận hành tương lai nhận lỗi. Khẳng định “phải cam kết từ đầu” trong phản hồi Đạt không có nghĩa đã ký hợp đồng. Vai trò học phần không làm Đạt thành người trực phần cứng, Tuấn thành operator dữ liệu hoặc Akai thành người ký nghiệm thu.

Một kit pH chung giá lịch sử **1.683.506 VND** là reserve tùy chọn. Cần bảo quản/tương thích, quyền lấy, thời gian đến site và replenishment; nguồn công khai không thể chứng minh đã có kho hoặc người nhận việc. Một bộ chung cũng chưa chứng minh đủ khi nhiều trạm hỏng đồng thời. Giá kit không phải quote đầu dò rời và không tự chứng minh phục hồi trong 48 giờ.

**Xử lý:** báo cáo ghi yêu cầu và điều kiện triển khai chưa đáp ứng; không tự điền tên người/kho/payer, không lấy việc chốt các tên này làm điều kiện để viết xong phần dự toán của bài nộp.

### DAT-28-RFQ — Ai chọn nhà cung cấp và xin giá?

**Bá Nguyên tự xử lý tra nguồn, giá và tổng hợp; không còn yêu cầu Đạt tìm người bán cho phần chi phí.** Đã xác minh kênh công khai: [Hshop](https://hshop.vn/lien-he), email `contact.hshopvn@gmail.com` và Zalo OA trên chính trang; [LILYGO](https://lilygo.cc/en-us/products/t-sim7600), `orders@lilygo.cc` cho sản phẩm và `info@lilygo.cc` cho business. Đây là đầu mối ứng viên, không phải bên đã nhận RFQ, đồng ý làm lắp tại Hà Nội hoặc ký giá.

Gói RFQ và CSV so giá đã có. Bá Nguyên có thể chuẩn bị thư hỏi model/package/đơn giá; khi thiếu site/load thì chỉ xin giá sơ bộ hoặc đơn giá, không gọi là giá lắp hoàn chỉnh. Chưa gửi email/tin bên ngoài trong lượt này.

## 4. Tự kiểm các câu hỏi cũ để không hỏi vòng lại

| Câu hỏi cũ | Câu trả lời từ chứng cứ / giới hạn | Cách xử lý phần chi phí |
| --- | --- | --- |
| D1: 3/3 hay 10/1? | Akai đã xác nhận 3 trạm/3 năm; proposal mới dùng một kỳ chung 36 tháng, mua 1 + 2 | Không hỏi lại; giữ 10/1 là scenario cũ |
| D2: LILYGO hay ESP32/M.2? | BOM Akai dùng LILYGO tích hợp; ESP32/M.2 riêng là phương án tham chiếu so giá, không cộng hai bộ controller/modem | Không chốt người thắng khi scope/quote chưa đủ |
| D2: Giá default LILYGO có đúng R2? | Kiểm API variant của hãng: Q190 R2 4 MB **69,34 USD**; Q387 R2 16 MB **94,32 USD**; default **65,31 USD thuộc Q210 E-H** | Lưu bảng ứng viên mới; chưa đổi subtotal hoặc dùng tỷ giá cũ làm giá nhập mới |
| D2: DO USD169 / turbidity USD9,90 có cùng model không? | File cũ không cho exact SKU/link; không có căn cứ đồng nhất với SEN0680/SEN0710 | Không thay giá giữa model. SEN0710 vẫn giá lịch sử USD229 trong BOM tham chiếu |
| D2: RS485/analog/1-Wire? | Cấu hình tham chiếu có hai RS485 probes, pH analog và DS18B20; board/package đúng revision và mức điện cần đối chiếu datasheet | Không coi “có UART” là đã có transceiver RS485 hay toàn bộ nguồn probe |
| D3: 20 W đã đủ chưa? | Chỉ là giả định nguồn. Hai probe 0,2 W liên tục cho **9,6 Wh/ngày** theo thông số đã lưu, chưa có board/modem/chuyển đổi/wiper và đo tải thực | Giữ quote nguồn đầy đủ; không chọn battery/panel từ số 20 W minh họa |
| D3: Có chọn được chemistry từ kit rẻ nhất? | Không. Cell Li-ion 3,7 V và AGM12 V khác kiến trúc; board tích hợp sạc không tự là nguồn đúng mọi rail | Không cộng đồng thời hai controller hoặc ghép sai bộ sạc |
| D4: Gland PG13.5 đúng không? | Có giá 3.175 VND VAT trong ảnh; trang mâu thuẫn 7–12 với 6–12 mm, số lượng bốn còn tạm | Giữ provisional, chưa khẳng định fit nếu không có cable OD/count |
| D4: USD80 đã đủ hộp/pin/gá/cáp chưa? | Là allowance cũ gom nhiều thành phần, chưa có quote/length/spec | Không dùng thành full CAPEX. Xin tách vật tư, phần bao gồm và loại trừ |
| D5: 24/26 cleaning hay testing sáu tháng? | Phản hồi Đạt mới thay lịch cũ; testing theo tuổi trạm, cleaning/calibration phần gộp rõ | Không phục hồi giá USD60/năm của lịch cũ |
| D5: Thay hết ở năm 3? | Không: review theo tình trạng, gộp lượt cuối; lỗi sớm xử lý sớm | Parts/labour thay báo riêng, không thêm chuyến review trùng |
| D5: Chờ năm 3 mới xem màng DO/pH? | Không. Thông số vật tư và chất lượng nước có thể đòi xử lý sớm; chưa có quote phụ tùng | Giữ lifecycle consumables chưa giá, không định hạn thay đồng loạt |
| D6: Ai trả tiền? | Chưa có cam kết CAPEX/OPEX, tài trợ hoặc mức phí cộng đồng trong hồ sơ | Ghi payer đề xuất/chưa xác nhận; không nói cộng đồng chắc chắn trả 0 hoặc chính quyền đã chi |
| D8: Phương án C là AI hay manual? | Expanded MD của Akai nói AI + IoT; source mới data.ts vẫn có C manual sampling | Ghi lệch tài liệu; không lấy score manual cho AI, không tự chấm matrix hoặc giao thêm việc cho Akai |

Giá variant LILYGO được lưu cùng JSON/ảnh ở [source checks](self-research-2026-11-28/source-observations.json), [CSV ứng viên](self-research-2026-11-28/listing-candidates.csv). API công khai `/products/t-sim7600.js` cùng variant URL là nguồn nhận diện; không dùng giá mặc định chung cho một SKU khác. Hshop ESP32 195.000 và M.2 1.566.000 được thấy lại ngày 28/11, lưu quan sát riêng, không sửa ngày của chứng cứ 19/11.

## 5. Cập nhật Tuấn đã giải quyết gì?

Comment [7235294127](https://github.com/tuanchau832-ai/Final-Assignment/pull/3#issuecomment-7235294127) và diff `687557b1..ea4cce0a` cho thấy ba file Home, Implementation, References đổi. Đã có tuổi đóng kỳ, full-calibration condition, nguồn service quantities, Chau (2026) và tên tác giả Văn Anh cho dẫn chứng ngân sách. Hồ sơ planning `first-station-pilot.md` vẫn đúng phiên bản 687557b1; không đổi reference tài liệu này sang một phiên bản giả mới.

Những mục TUAN-28-PORT/CAL/EDIT được ghi **đã tích hợp vào nhánh Tuấn**, chờ Bá Nguyên tự kiểm source/browser, không hỏi Tuấn làm lại. `final-website` vẫn ee0502ca, chưa chứa ea4cce0a; không nhận là site online đã cập nhật. Bộ đếm 2.754 của app không thay kiểm từ chính thức theo template.

## 6. Điều có thể kết luận và điều không thể tự tạo

Tự khép được scope/calculation, ý nghĩa cảm biến/rule, phụ kiện cần kiểm, đơn vị quote, giá niêm yết và các câu hỏi giao vượt vai. BOM Akai đã có và đã đọc; vẫn không thể tự tạo permission, field readings, ngày lắp, giá dịch vụ chính thức, người nhận trực, chữ ký nghiệm thu hoặc cam kết funding. Các mục đó giữ nhãn thiếu chứng cứ; không viết thay câu trả lời hoặc đặt tên đồng đội để làm bảng trông hoàn chỉnh.

Không gửi câu hỏi mới, không sửa comment GitHub, không liên hệ nhà cung cấp trong lượt này. Việc tra giá/tổng hợp và xử lý chứng cứ được Bá Nguyên tự làm; chỉ sửa local trên nhánh được giao.
