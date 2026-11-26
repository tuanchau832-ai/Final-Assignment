# Đạt/Tuấn đối chiếu: final-website và phần Bá Nguyên — 26/11/2026

## Phạm vi xác nhận

Đã đọc source `final-website` tại commit **`a85be4edbfc09033910461d1b3c9f6ece5919274`**, gồm [page.html](https://github.com/tuanchau832-ai/Final-Assignment/blob/a85be4edbfc09033910461d1b3c9f6ece5919274/website/src/page.html) và [site.ts](https://github.com/tuanchau832-ai/Final-Assignment/blob/a85be4edbfc09033910461d1b3c9f6ece5919274/website/src/site.ts). Đây là đối chiếu source nhánh GitHub theo yêu cầu, chưa xác nhận bản deploy/live. Nội dung bảng này chưa được port vào `final-website`.

Phần Bá Nguyên hiện dùng [bảng 1 trạm → 3 trạm → 3 năm](cost-rollup-3stations-3years-2026-11-26.md), [CSV 28 dòng](cost-rollup-3stations-3years-2026-11-26.csv), [giá/ảnh đã kiểm 25/11](live-price-audit-2026-11-25.csv) và [quyết định cập nhật](ba-nguyen-decisions-2026-11-25.md). Giá là hồ sơ ngày 19–25/11, không được gắn nhãn vừa kiểm lại giá ngày 26/11.

**Xác nhận của Bá Nguyên:** Phép cộng BUILD/RUN trên web cũ đúng theo chính các đầu vào của nó; phạm vi, một số nhãn và lịch dịch vụ chưa khớp bản làm việc hiện tại. Giá khác chưa đồng nghĩa giá sai: hai bản dùng BOM khác nhau và BOM cuối vẫn chờ Đạt/Tuấn. Chỉ những khoản có đủ model/package/source mới được chuyển sang ngân sách đã chốt.

## 1. Các số đang khớp hoặc đúng theo phép tính cũ

| ID | Trên final-website | Phần Bá Nguyên đối chiếu | Kết luận / việc Đạt cần làm |
| --- | --- | --- | --- |
| MATCH-01 | `BUILD`: pH kit **64,90 USD** (`site.ts` dòng 41) | SEN0169-V2 **64,90 USD**; × 25.940 = **1.683.506 VND**, có ảnh `price-002` | **Khớp giá gốc**. Web chưa ghi SKU; chỉ bổ sung SEN0169-V2 khi Đạt/Tuấn xác nhận đúng kit. Chưa chứng minh giá đầu dò rời 49,50 USD. |
| MATCH-02 | Các hàng BUILD cộng **468,07 USD**, gồm installation labour **40 USD** | Cộng lại đúng; bỏ riêng labour thì equipment/materials là **428,07 USD** | **Đúng phép cộng của BOM web cũ**, chưa là giá lắp đặt được báo. Heading 430 cần sửa cách ghi theo FIX-02. |
| MATCH-03 | RUN: 49,50 + 60 + 18 + 10 + 5 | Tổng **142,50 USD/trạm/năm** | **Đúng phép cộng đầu vào cũ**. Tần suất, model phụ tùng và các allowance chưa thành OPEX được duyệt; xem MODEL-08 và FIX-04. |
| MATCH-04 | Summary khoảng **6.100 USD**; calculator làm tròn **6.106 USD**, **159 triệu VND** | `10 × (468,07 + 142,50) = 6.105,70 USD`; × 26.000 = **158.748.200 VND** | **Đúng số học và làm tròn cho 10 trạm/1 năm theo BOM cũ**. Chưa khớp scope mới; không gọi tổng pilot đầy đủ. |
| MATCH-05 | Công thức `n × (buildSum + runSum × y)` (`site.ts` dòng 119) | CAPEX mua ban đầu tính một lần, phần vận hành nhân theo năm | **Khớp nguyên tắc CAPEX không nhân theo số năm**. Công thức hiện coi toàn bộ RUN tính theo từng trạm và chưa có unknown/lifecycle/shared costs; phải mở rộng theo FIX-07. |

## 2. Nội dung cần sửa hoặc làm rõ trên website

| ID / vị trí source | Trên final-website | Bản làm việc hiện tại của Bá Nguyên | Đề nghị chỉnh / người phụ trách |
| --- | --- | --- | --- |
| FIX-01 — `page.html` dòng 97, 104, 535, 544; `site.ts` dòng 25 | Summary và rollout ghi **10 trạm/1 năm**; scale từ năm 2 | Akai xác nhận **3 trạm/3 năm** trên [PR #3](https://github.com/tuanchau832-ai/Final-Assignment/pull/3#issuecomment-7188129413) | Đạt/Tuấn đồng bộ summary, header, rollout và mặc định calculator về scope 3/3. Mốc chuẩn bị/pilot/evaluation cần nhóm xác nhận lại cho kỳ 36 tháng; scale năm 2 chỉ là lựa chọn có điều kiện, không tự coi nằm ngoài hoặc trong pilot. Chốt mốc bắt đầu OPEX (commissioning hay mốc khác). |
| FIX-02 — `page.html` dòng 567; `site.ts` dòng 25 | Heading **About US$430 to build a station** | Web tính equipment/materials **428,07 USD** và installed **468,07 USD**; bản Bá Nguyên dùng BOM tham chiếu khác | Trong lúc giữ BOM cũ, có thể ghi rõ **Provisional equipment/materials subtotal: US$428.07; including estimated installation: US$468.07 per station**. Không gắn 430 với nhãn installed. Sau D2 phải lấy số từ BOM đã chọn, không coi 468,07 là chi phí cuối. |
| FIX-03 — `page.html` dòng 578–581 | Slider trạm `min=5`, `step=5`, mặc định 10; năm mặc định 1 | Cần xem được **1 trạm**, **3 trạm** và **3 năm** | Tuấn đổi điều khiển hỗ trợ chính xác 1 và 3 trạm, default 3 trạm/3 năm; giữ scenario 10/1 chỉ khi có nhãn so sánh. Kiểm 1/1, 3/1, 3/3; không chỉ đổi text output mà bỏ input/logic cũ. |
| FIX-04 — `page.html` dòng 560; `site.ts` dòng 51 | Vệ sinh hai tuần/lần, hiệu chuẩn tháng; RUN tính **24 lượt/năm**, **60 USD/năm** | Góp ý Đạt do Bá Nguyên chuyển: **testing/bảo dưỡng 6 tháng/lần**. Vệ sinh/hiệu chuẩn riêng còn chờ xác nhận | Thêm testing: 2 lượt/trạm/năm, 6 lượt/trạm/3 năm, **18 lượt kiểm tra từng trạm cho 3 trạm/3 năm**, giá `Quote required`. Không thay 24 bằng 2 rồi giữ giá vệ sinh 60 USD. Đạt xác nhận vệ sinh/hiệu chuẩn có còn cần, tần suất theo model/site và phần gộp chuyến. Hai tuần/lần khoảng 26, không phải 24; cả 24/26 là kịch bản lịch cũ nếu chưa được xác nhận lại. |
| FIX-05 — lifecycle chưa có dòng rà năm 3 | End of life khoảng **5 năm**, disposal **10 USD/trạm** (`page.html` dòng 574; `site.ts` LIFE) | **Mốc năm 3 rà mòn/ăn mòn**, thay theo tình trạng; chưa có giá; chưa xác nhận tuổi thọ cả hệ thống hoặc ngày tháo bỏ | Đạt thêm rà soát năm 3 (**3 lượt rà cho 3 trạm**), cho biết gộp testing tháng 36 hay tính phần tăng thêm. Giữ việc thay sớm theo lỗi/hướng dẫn kỹ thuật. Năm 3 không có nghĩa thải bỏ toàn hệ thống; 5 năm/10 USD chỉ được giữ như giả định có nhãn, không là tuổi thọ/quote đã xác minh. |
| FIX-06 — `page.html` dòng 582; `site.ts` dòng 121–124 | Calculator ghi **Total cost**, so với ngân sách phục hồi sông để nói rất rẻ | Còn thiết bị, lắp đặt, vận hành, thay/thải bỏ chưa báo giá | Đổi thành **Provisional scenario subtotal** và liệt kê khoản chưa tính. Unknown hiển thị `Quote required`, không coi là 0. Không suy ra affordability/funding từ subtotal chưa đầy đủ hoặc từ so ngân sách khác mục đích. |
| FIX-07 — `site.ts` dòng 54, 119 | Cloud hosting share **5 USD/trạm/năm** rồi nhân `n × y` | Giá chưa chốt; giả định tạm một gói hosting chung **36 tháng hệ thống**; một SIM/trạm là **108 SIM-tháng** | Tuấn xác nhận provider tính chung, per-device hay usage. Nếu chung, không nhân khoản chung thêm 3. RUN cần tách per-station và shared; các khoản lab/training/SMS/disposal cũng xác nhận basis trước khi nhân. |
| FIX-08 — `page.html` dòng 567; `site.ts` dòng 116 | Tỷ giá minh họa **26.000 VND/USD** | Bảng giá tham chiếu dùng cơ sở lịch sử **25.940 VND/USD** | Hai basis khác nhau, không phải lỗi phép nhân. Ghi nguồn/ngày và tính lại toàn bộ trên một basis khi hợp nhất. Không gọi 25.940 là tỷ giá mới 26/11 hoặc trộn hai basis trong cùng tổng. |
| FIX-09 — `page.html` dòng 555–589 | Ownership/service contract/payer mô tả như đã có thỏa thuận | Vai trò và nguồn tiền hiện chỉ là **đề xuất** nếu chưa có bằng chứng cam kết | Đạt/Tuấn gắn nhãn proposed cho owner/operator/funder; chỉ dùng confirmed khi có nguồn. Điều này không được suy ra từ việc component có giá niêm yết. |
| FIX-10 — `page.html` dòng 545, 560 | So mọi alert với lab sample; repair within **48h** bằng spare units | Chưa có số mẫu, scope lab, spare stock, nhân công/travel, người chịu trách nhiệm hay quote | Đạt xác nhận đây là mục tiêu hay cam kết; cấp scope để tính lab, phụ tùng và phản ứng sự cố. Chưa cộng một số có vẻ hợp lý vào OPEX. |

## 3. BOM và giá: chưa được thay số trực tiếp giữa hai cấu hình

| ID / hạng mục | Giá/giả định trên web (`site.ts` BUILD/RUN) | Hồ sơ Bá Nguyên hiện dùng | Mức khớp và hành động cần làm |
| --- | --- | --- | --- |
| MODEL-01 — Controller/4G | LILYGO tích hợp board + modem + solar charging **49,78 USD** | ESP32 **195.000 VND** + SIM7600G-H-M.2 module-only **1.566.000 VND**; carrier/antenna/power chưa giá | **Khác cấu hình**. Đạt/Tuấn chốt SKU/revision/package. Nếu chọn LILYGO, bỏ/thay các dòng riêng tương ứng, kiểm phụ kiện có sẵn; không cộng cả hai. |
| MODEL-02 — DO | Unnamed DO kit **169 USD** | RS485 fluorescence SEN0680 **4.428.000 VND**, nguồn Hshop `price-003` | **Chưa chứng minh cùng model**. Xin SKU/link của kit 169 USD; không thay giá chỉ bằng đổi tiền. Vật tư DO cũng phải theo đúng model. |
| MODEL-03 — Turbidity | Unnamed sensor **9,90 USD** | SEN0710 RS485 **229 USD** = **5.940.260 VND** (`price-004`) | **Không khớp mức giá/model**. SEN0189 9,90 USD chỉ là khả năng cần xác nhận, không là SEN0710. Chốt interface, immersion suitability và model trước khi đổi BOM/tổng. |
| MODEL-04 — Nhiệt độ | Unnamed waterproof sensor **7,50 USD** | DS18B20 HS2432V **35.000 VND** (`price-005`) | **Chưa chứng minh cùng sản phẩm/cáp**. Xin SKU/package/chiều dài và tính phù hợp field. |
| MODEL-05 — Nguồn | Panel 20 W + controller **46,99 USD**, eBay | Chưa chốt tải/pin/controller/converter/protection; `quote-02` | **Chưa đủ cơ sở gọi hệ nguồn hoàn chỉnh**. Chốt sơ đồ, Wh/ngày, battery và autonomy; kiểm controller có bị tính lặp với board không. |
| MODEL-06 — Enclosure, battery, cage, wiper, cables | Gói **80 USD**, team estimate | Ghi từng scope cần quote; enclosure PVN457 **305.000 VND chưa VAT** chỉ là tham chiếu và **không cộng** | **Allowance khác với báo giá**. Tách thành phần/số lượng/bao gồm/loại trừ; không cộng 80 USD với từng component cùng gói khi hợp nhất. |
| MODEL-07 — Installation | **40 USD**, team estimate | `quote-05`, **chưa có giá lắp/commissioning/site-specific** | **Chưa được xác nhận giá**. Có thể giữ historical scenario có nhãn estimate; chi phí chính phải có scope/quote hoặc để unknown. |
| MODEL-08 — pH thay/dự phòng | RUN **49,50 USD/năm** cho replacement electrode | Một **kit** SEN0169-V2 dự phòng/trạm **1.683.506 VND**, tùy chọn một lần cho cả horizon; chưa có spare-probe price | **Khác hàng và tần suất**. Chốt electrode SKU/giá riêng và có cần reserve không. Không cộng tiền cùng bộ dự phòng lần nữa khi dùng; không tự thay mỗi năm chỉ vì RUN hiện nhân theo năm. |
| MODEL-09 — RS485, glands, companion equipment | Chưa tách thành dòng trong BUILD | TTL–RS485 **35.000 VND**; PG13.5 **3.175 VND/chiếc × 4 tạm/trạm**; carrier/antenna quote riêng | **Chưa rõ có bị thiếu hoặc nằm trong bundle**. Đạt/Tuấn xác nhận kiến trúc, bus và danh mục cáp, fit gland (trang bán ghi 7–12 và D6–12 mm). Nếu gói đã gồm thì không cộng lặp. |
| MODEL-10 — Giá RUN khác | SIM **18 USD**, calibration solutions **10 USD**, hosting **5 USD** mỗi năm đều team estimate | Các dòng SIM/hosting/calibration/testing hiện **Quote required** | **Ước tính cũ chưa phải nguồn giá được duyệt**. Xác nhận scope, provider, quantity/basis và VAT/travel trước khi điền vào bảng chính. |

## 4. Các tổng Bá Nguyên đang xác nhận được — giới hạn sử dụng

| Khoản | 1 trạm | 3 trạm | Cách dùng trên website |
| --- | ---: | ---: | --- |
| Mua ban đầu đã có giá của BOM tham chiếu | **13.895.466 VND** | **41.686.398 VND** | Subtotal các dòng giá niêm yết; chưa gồm enclosure đã chọn, nguồn, carrier/antenna, cáp/gá/site, công lắp và vận hành. Không coi là installed cost. |
| Dự phòng pH tùy chọn | **1.683.506 VND** | **5.050.518 VND** | Giả định giữ một bộ/trạm một lần, không nhân 3 theo năm, chưa phải lịch thay được duyệt. |
| Mua ban đầu + dự phòng tùy chọn | **15.578.972 VND** | **46.736.916 VND** | Subtotal có giả định riêng, chưa phải tổng một năm hoặc ba năm đầy đủ. |
| Tổng ngân sách đầy đủ 3 năm | **Chưa xác định** | **Chưa xác định** | Chờ model/scope/quote. Không thay thẳng số 6.100 USD bằng 41.686.398 hoặc 46.736.916 VND vì khác BOM và phạm vi tính. |

Phép tính cũ nếu chỉ đổi n/y thành 3/3 cho ra `3 × (468,07 + 142,50 × 3) = 2.686,71 USD` (69.854.460 VND ở 26.000 VND/USD). **Đây chỉ là điểm kiểm logic trên BOM/lịch cũ**, không là tổng mới Bá Nguyên xác nhận. Slider hiện tại chưa chọn được 3 trạm.

## 5. Đạt/Tuấn thực hiện theo thứ tự

1. Sửa scope và nhãn: dùng phương án làm việc 3 trạm/3 năm theo Akai; phân biệt subtotal/estimate/quote-required; calculator chọn được 1 và 3 trạm. Khi chưa có BOM/giá cuối, không tạo một tổng pilot giả đầy đủ.
2. Cập nhật D5: testing 6 tháng/lần và review mòn/ăn mòn năm 3; Đạt trả checklist, cleaning/calibration overlap, scope gói và quote. Không biến testing thành lịch vệ sinh hoặc hạn thay mọi linh kiện.
3. Chốt D2/D3 theo bảng MODEL: chọn một cấu hình, ghi SKU/package/quantity/link/nguồn điện và điều chỉnh các dòng cùng gói. Sau đó Bá Nguyên cập nhật giá, shared/per-station và chi phí theo năm.
4. Tuấn port sang source cuối; cập nhật `BUILD`, `RUN`, calculator, summary, design affordability, rollout, maintenance và lifecycle cùng version. [Patch 25/11](team-review/README.md) là tham khảo logic cho snapshot cũ, chưa giải quyết toàn bộ bảng này và không được apply mù vào source mới.
5. Gửi link commit/preview để Bá Nguyên rà số. Kiểm scenario 1/1, 3/1, 3/3; CAPEX không lặp theo năm; khoản chung không nhân theo trạm; unknown không bằng 0; hiển thị số và nhãn thống nhất. Chạy build và kiểm bảng trên desktop/mobile sau tích hợp.

Mẫu phản hồi cho Đạt/Tuấn ngay trên PR: `ID (FIX-/MODEL-) | đã sửa / Confirmed / Proposed / TBD | câu trả lời + link commit/nguồn | người phụ trách | ngày`. Mục chưa biết ghi ai kiểm tra và ngày dự kiến. Bá Nguyên đã xác nhận phép tính/giới hạn trong bảng này; **BOM cuối và ngân sách đầy đủ vẫn cần nhóm và nguồn giá xác nhận**.

## 6. Tài liệu nên đọc

| Tài liệu | Mục đích |
| --- | --- |
| [Rollup 1 trạm/3 trạm/3 năm](cost-rollup-3stations-3years-2026-11-26.md) và [CSV](cost-rollup-3stations-3years-2026-11-26.csv) | Số, quantity, công thức phân bổ, nguồn/ngày và các khoản chưa có giá |
| [Quyết định D1/D5/D7 cập nhật](ba-nguyen-decisions-2026-11-25.md) | Scope, lịch kiểm tra và trách nhiệm tích hợp; phần 25/11 được giữ làm lịch sử |
| [Kế hoạch tiếp theo](ba-nguyen-next-steps-2026-11-26.md) | Ai cung cấp model/site/quote và điều kiện hoàn tất |
| [Audit giá 25/11](live-price-audit-2026-11-25.csv), [manifest ảnh](cost-evidence/README.md) | Chứng cứ giá đúng model; không là báo giá nhà cung cấp |
| [Yêu cầu báo giá](supplier-quote-request-template.md) | Scope cần điền sau D2–D5; tránh gộp thiếu thành phần hoặc đếm trùng |
