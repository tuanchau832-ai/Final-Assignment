# Rà soát phản hồi Đạt và Akai — Bá Nguyên

Ngày rà soát: **25/11/2026**. Đây là hồ sơ đối chiếu nội bộ, không phải báo giá hoặc biên bản duyệt ngân sách.

## 1. Kết luận về điều kiện làm tiếp

**Đủ thông tin để tiếp tục phân tích, lập kịch bản, sửa cách trình bày và chuẩn bị yêu cầu báo giá. Chưa đủ để khóa BOM, công bố tổng chi phí đầy đủ hoặc chốt khả năng chi trả.**

Hai phản hồi giúp xác định các việc còn thiếu; chúng không chứng minh đã có giấy phép, hợp đồng bảo trì, tài trợ hay thiết bị lắp thực tế. Nhãn “Confirmed (report)” trong file Đạt được hiểu là nội dung đã có trong báo cáo, không phải cam kết đã được bên ngoài xác nhận.

Câu trong file Akai rằng bản so sánh đã được thu về ba trạm “at the user's request” là lời mô tả của tài liệu. Yêu cầu hiện tại của Bá Nguyên là rà soát và lập kế hoạch; không coi câu đó là chỉ thị mới cho agent tự đổi scope toàn dự án sang ba trạm.

## 2. Tài liệu và phiên bản đã kiểm tra

| Nguồn | Dùng để làm gì | Giới hạn |
| --- | --- | --- |
| `C:/Users/admin/OneDrive/Desktop/Team confirming request - Dat.docx` | Trích toàn bộ nội dung phần văn bản và bảng trong `word/document.xml`; kiểm tra có comments XML hay không | Không có hợp đồng, báo giá hoặc hồ sơ khảo sát đính kèm trong phần nội dung đã đọc |
| `C:/Users/admin/Downloads/HWW_Design_and_Cost_Comparison_Expanded.md` | Phản hồi Akai: 3 phương án, BOM USD và chi phí 3 trạm/3 năm | Không ghi SKU đầy đủ hoặc link giá trực tiếp cho từng hàng; các khoản community/AI được ghi là giả định minh họa |
| `website/README.md`, `TEAM_README.md`, `08-cost-analysis.ts`, CSV nguồn giá, evidence register và handoff | Nhiệm vụ Bá Nguyên, dữ liệu đang có trên nhánh cá nhân | Giá và tỷ giá cũ được ghi ngày 19/11; không coi là mới kiểm tra ngày 25/11 |
| `origin/final-website`, commit `556fb6e92d5f1abc34b70d7711ab5ffd36da25a0` | Đọc trực tiếp bằng `git show`, nhất là `website/src/page.html` và `website/src/site.ts` | Chỉ đọc; nhánh này có kiến trúc khác, chưa nằm trong nhánh cá nhân |
| Registry `HWW-KNG-001.json` và firmware implementation | Xác nhận prototype là mô phỏng; kiểm tra khác biệt với mô tả nhóm | Mô phỏng không xác nhận độ chính xác cảm biến, nguồn điện hay độ bền ngoài hiện trường |
| PR #3 | Kiểm tra trạng thái và phản hồi | Lúc kiểm tra vẫn Draft/open; chỉ thấy comment nhắc đồng đội, chưa có câu trả lời nội dung mới trên PR |

Nhánh làm việc được xác nhận là `feature/ba-nguyen-cost-analysis`, HEAD `ce75170122902cdbf92f3b6081c7c00483ff2486`; trạng thái ban đầu sạch. `origin/main` trỏ `8886aa2e6ab38d99283c5f14a83b08b6f70360ef`. Việc pull/fetch của người dùng đã làm xuất hiện các remote refs; chưa làm cho nguồn `final-website` trở thành website đang chạy trên nhánh cá nhân. Không suy ra nhánh cá nhân đã có mã website cuối chỉ từ việc `git pull` thành công.

## 3. Lỗi chi phí trong summary: xác định được gì?

Tin nhắn Đạt nói có một chỗ lệch chi phí trong summary nhưng không chỉ rõ con số. Có thể kiểm chứng các điểm sau trong snapshot `final-website`:

| Vị trí | Đang ghi | Phép đối chiếu / xử lý |
| --- | --- | --- |
| `page.html:97` và `:104` | Khoảng US$6,100 cho 10 trạm trong năm đầu | `10 × (468.07 + 142.50) = 6,105.70`. US$6,100 là làm tròn, **không phải lỗi cộng** |
| `page.html:567` | “About US$430 to build a station” | Hardware/materials = 428.07; cộng installation 40 = **468.07**. Tiêu đề cần nêu rõ equipment hay installed để thống nhất với biểu đồ |
| `site.ts:39–54`, `:113–124` | BUILD và RUN cộng đúng, calculator làm tròn USD đến số nguyên | Giữ cách cộng; summary và heading nên lấy cùng dữ liệu, hiển thị cents nhất quán |
| Summary và calculator | “Pilot cost”, “Total cost” cùng so sánh “tiny fraction” ngân sách sông Nhuệ | Chưa có tổng đủ phạm vi hay BOM được duyệt. Đổi nhãn thành **provisional scenario subtotal** và nêu phần chưa tính; phép so với ngân sách phục hồi sông không chứng minh affordability |
| File Akai | 3 trạm/3 năm; HWW năm đầu 1,831.71, 3 năm 2,686.71 | Đúng số học với các đầu vào Akai cung cấp, nhưng khác phạm vi 10 trạm/1 năm ở summary |

Không khẳng định tiêu đề US$430 chính là lỗi cụ thể Đạt định nói nếu Đạt chưa chỉ đúng dòng. Đây là điểm không nhất quán tìm được qua đối chiếu. Không thay summary bằng 15,578,972 VND hoặc 1,831.71 USD vì hai số này thuộc phạm vi và/hoặc BOM khác.

**Bản vá đã chuẩn bị:** `team-review/final-website-cost-summary.patch`. Bản vá giữ các đầu vào USD của nhóm như một kịch bản chưa duyệt, đồng bộ summary/heading/calculator từ cùng BUILD và RUN, hỗ trợ chọn 3 trạm và ghi rõ các khoản chưa tính. Không xác nhận giá cũ là giá hiện hành. Patch dành cho snapshot `final-website`, không thể áp dụng trực tiếp lên mã React hiện tại vì thiếu hai file đích. Chưa sửa website hosted, chưa sửa nhánh của đồng đội.

## 4. Ma trận xác nhận: có gì và còn thiếu gì?

| Mục | Đã có từ phản hồi | Trạng thái / thông tin còn thiếu | Người cần trả lời |
| --- | --- | --- | --- |
| Số trạm, thời hạn | Đạt: 10 trạm/1 năm; Akai: 3 trạm/3 năm; Bá Nguyên: đơn vị 1 trạm/12 tháng | **Mâu thuẫn cần chốt**. Một trạm là đơn vị tính, không phải bằng chứng nhóm đã duyệt pilot một trạm | Akai + Đạt + Tuấn |
| Phương án thứ ba | File Akai dùng AI + IoT; `final-website` vẫn dùng “More frequent manual sampling” và OPTS C là manual sampling | Bảng chi phí và decision matrix chưa cùng bộ phương án. Akai phải cập nhật mô tả/matrix/rationale và nhóm đánh giá lại; không gán điểm manual sampling cho AI | Akai + nhóm + Tuấn |
| Địa điểm | Nhuệ/Tô Lịch; NH-04 là ví dụ ở báo cáo mới | GPS, chủ vị trí, loại dòng thải, quyền tiếp cận và giấy phép chưa có; registry cũ dùng mã demo khác | Đạt |
| Bốn kênh cảm biến | pH, DO, turbidity, temperature | Đồng ý về kênh đo, chưa đồng ý thiết bị thương mại và giao tiếp | Akai |
| Controller/modem | Akai đề xuất LILYGO ESP32 + 4G + solar charging | Chốt T-SIM7600 E/G/SA, revision, bộ phụ kiện, giao tiếp, giá variant. Không cộng thêm ESP32 + M.2 nếu thay bằng board tích hợp | Akai |
| pH | Giá kit 64.90 USD; OPEX electrode 49.50 USD | Chốt SKU kit/electrode tương thích; 49.50 chưa có nguồn cụ thể. Không coi >4,380 giờ là hạn thay bắt buộc | Akai + Bá Nguyên |
| DO | Akai 169 USD; bảng cũ fluorescence SEN0680 4,428,000 VND | Chưa có SKU cho 169 USD. Phân biệt loại điện hóa và fluorescence; không áp chung chu kỳ màng/electrolyte | Akai |
| Turbidity | Akai 9.90 USD; bảng cũ SEN0710 229 USD | Giá khớp hai sản phẩm khác nhau; cần chọn SKU và kiểm tra immersion, range, interface, độ bền | Akai |
| Temperature | Akai DFRobot 7.50 USD; cũ Hshop DS18B20 35,000 VND | Chưa chứng minh cùng model, chiều dài cáp và vật liệu | Akai |
| Solar | Đạt/Akai đề xuất 20 W; panel/charging kit 46.99 USD | Chưa có Wh/ngày, upload interval, battery Ah/Wh, autonomy, sơ đồ 12 V → board, controller/converter/protection. 20 W là đề xuất, chưa được tính đủ tải | Akai + Đạt |
| Vỏ/gá/cáp | Box khóa trên flood line, cage inox và wiper | Kích thước box, IP với lỗ cáp, flood level, chiều dài cáp, vật liệu gá, wiper model chưa có | Đạt + nhà cung cấp |
| Tiếp địa/chống xung | Đạt chỉ ra chưa nằm trong register nhóm | Thêm scope báo giá riêng; cần thiết kế điện phù hợp site | Đạt + đơn vị điện |
| Vệ sinh | Đạt: hai tuần/lần và 24 lượt/năm; Akai giữ 24 lượt | **Bá Nguyên chọn 26 lượt/12 tháng/trạm làm lịch lập kế hoạch** để khớp mỗi 14 ngày. Đạt xác nhận khả thi và báo giá; lượt sau lũ tách riêng | Bá Nguyên + Đạt |
| Calibration | Hàng tháng = 12 lần/năm | Giá 10 USD/năm chỉ là solutions allowance; chưa đủ service, labour, travel, reference meter/lab | Đạt + báo giá |
| Repair | Mục tiêu 48 giờ, dùng spare units | Chưa có số spare, SLA, phí standby và người trực; chưa phải cam kết hợp đồng | Đạt |
| Commissioning | Hai tuần baseline, so chuẩn/lab, thử alert/tamper, bàn giao | Ngưỡng pass/fail và chi phí chưa có. Thử tín hiệu/sự kiện mô phỏng hoặc mẫu chuẩn có kiểm soát; không hiểu “test discharge” là xả chất ô nhiễm vào sông | Đạt + Akai |
| Operator/responder | Đề xuất nhóm vận hành, Department nhận alert, lab xác minh, ward truyền thông | Chưa có tên người trực, giờ trực, escalation hoặc văn bản chấp thuận | Đạt |
| Funding/payer | Vai trò và nguồn tài trợ dự kiến | Chủ sở hữu dự kiến không đồng nghĩa bên đã đồng ý trả CAPEX/OPEX. Chưa có cam kết city/grant/sponsor hay phí cư dân | Đạt + Tuấn |

## 5. Kiểm tra giá/model trực tiếp ngày 25/11/2026

Kết quả chi tiết: `team-price-source-checks-2026-11-25.csv`. Những lần mở này không tự cập nhật toàn bộ bảng giá cũ và không xác nhận giá giao tại Hà Nội.

- [DFRobot pH SEN0169-V2](https://www.dfrobot.com/product-2069.html): 64.90 USD; tài liệu ghi tuổi thọ trên 4,380 giờ, phụ thuộc chất lượng nước. Kit không phải báo giá riêng cho replacement electrode 49.50 USD.
- [DFRobot SEN0710](https://www.dfrobot.com/product-3104.html): 229 USD/đơn chiếc; trang còn có mức giá theo lượng mua. Không nhân giá đơn chiếc thành đơn hàng 3/10 trạm nếu chưa chốt volume tier, VAT và freight.
- [DFRobot SEN0189](https://www.dfrobot.com/product-1394.html): 9.90 USD, analog/digital 5 V, không phải SEN0710 RS485. Sự trùng giá gợi ý model Akai dùng; **không đủ để kết luận Akai đã chọn SKU này**. Kiểm tra suitability và giao tiếp ESP32 trước khi dùng.
- [LILYGO T-SIM7600](https://lilygo.cc/products/t-sim7600): trang hiển thị 65.31 USD và nhiều variant; lần mở này không tái tìm thấy 49.78 USD. Shipping list của các variant được mô tả có SIM/GPS antennas và power cable. Chốt đúng variant rồi xác minh giá và phụ kiện; không thay thẳng 49.78 bằng 65.31 khi chưa biết cùng cấu hình.

Không dùng tỷ giá 25,940 hoặc 26,000 như một tỷ giá mới ngày 25/11. Khi chốt bảng VND mới, lưu nguồn ngân hàng/đơn vị đổi tiền, loại tỷ giá, ngày/giờ và phí.

## 6. Đối chiếu số học file Akai

| Phép tính | Kết quả USD | Kết luận |
| --- | ---: | --- |
| Cộng 8 hàng installed BOM | 468.07 | Đúng |
| Installed trừ installation 40 | 428.07 | Đúng equipment/materials |
| 49.50 + 60 + 18 + 10 + 5 | 142.50 | Đúng OPEX giả định/năm/trạm |
| 3 × (468.07 + 142.50) | 1,831.71 | Đúng năm đầu 3 trạm |
| 3 × (468.07 + 3 × 142.50) | 2,686.71 | Đúng 3 năm theo mô hình OPEX cố định |
| Community: 300 + 3 × 480 | 1,740.00 | Đúng với giả định nội bộ |
| AI: 2,004.21 + 3 × 667.50 | 4,006.71 | Đúng với giả định nội bộ |
| 60 / 24 hoặc 60 / 26 | 2.50 hoặc khoảng 2.31 | Giá/lượt rất thấp; chưa có chứng cứ contractor cung cấp với mức này |

Số học đúng không chứng minh ngân sách đầy đủ. Chưa phân biệt chi phí dùng chung (app/cloud/training) với chi phí mỗi trạm; chưa có xét price tier, transport theo tuyến, lạm phát/chiết khấu, các replacement lớn hoặc downtime. Ba năm phải có lịch thay thế và tuổi thọ đúng model, không chỉ nhân OPEX năm đầu.

## 7. Scope phải báo giá hoặc ghi chưa tính

1. Tách gói 80 USD thành battery, vỏ, cage/arm, wiper và cáp. Ghi số lượng, kích thước và chiều dài; không tự điền độ dài “short cable”.
2. Kiểm chứng power chain và modem variant; báo giá converter, fuse, grounding/surge, antenna/mount nếu không đi kèm.
3. Installation 40 USD cần gồm access gần nước/đường, nhân công, di chuyển, PPE và commissioning; thêm permission/survey nếu áp dụng.
4. Làm rõ 24/26 visits, calibration 12 lần, travel/labour, post-flood visits, consumables đúng loại DO, pH spare, nguồn/pin và spare units cho repair target.
5. SIM volume/carrier, cloud/database/retention, software development/support, SMS, sample/lab confirmation, training, disposal và fees/shipping/tax còn thiếu.
6. Xác định thời điểm bắt đầu tính OPEX: 12 tháng vận hành mỗi trạm hay năm lịch pilot có lắp đặt giai đoạn tháng 3–9; tránh áp 12 tháng rồi gọi đó là cashflow thực tế của năm đầu.

## 8. Việc đã sửa và giới hạn bàn giao

- Chỉnh bản Cost Analysis đang chạy trên nhánh cá nhân: gọi BOM là candidate, 1 trạm là đơn vị tính, không khẳng định rollout đã thống nhất; sửa cách diễn đạt tuổi thọ pH và ghi rõ mâu thuẫn 24/26 lượt.
- Không đổi giá, tỷ giá hoặc subtotal cũ bằng các giá khác model trong file Akai.
- Chuẩn bị patch cho summary/heading/calculator của `final-website`, kiểm tra patch trên bản sao tạm; xem hướng dẫn trong `team-review/README.md`.
- Cập nhật kế hoạch cá nhân, evidence register và handoff; các việc cần nhóm/báo giá được liệt kê cụ thể, gồm cả việc thống nhất phương án C với decision matrix.
- Đợt này không chứng nhận toàn bộ APA, toàn bộ nội dung final website hay kết quả field test. Mobile thực và ảnh nguồn/AI log vẫn cần hoàn tất theo kế hoạch.
