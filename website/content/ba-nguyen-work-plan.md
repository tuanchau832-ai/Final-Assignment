# Kế hoạch phần việc Bá Nguyên — Cost Analysis

**Cập nhật 27/11: [phản hồi Đạt, plan và kết quả thực hiện](dat-response-plan-2026-11-27.md)** là trạng thái hiện tại. Scope testing/cleaning/calibration-check và review tháng 36 đã được Đạt xác nhận gộp; basis xin giá là 6 chuyến chung cả 3 trạm, bao gồm 18 lượt kiểm trạm. [Lịch CSV](maintenance-schedule-2026-11-27.csv) và [checklist/log](maintenance-acceptance-template-2026-11-27.md) đã chuẩn bị. Chờ model, threshold, operator/site, giá và cam kết thực tế; không hỏi lại các ý scope Đạt đã trả lời. Các mốc 25–26/11 bên dưới giữ làm hồ sơ lịch sử.

**Đạt/Tuấn bắt đầu tại [bảng final-website đối chiếu với Bá Nguyên](final-website-vs-ba-nguyen-2026-11-26.md):** có ID các số khớp, mục cần sửa, model cần xác nhận và giới hạn của các subtotal. Đây là bản đối chiếu 26/11 để tích hợp, thay cho việc lấy lịch/số cũ bên dưới làm kết luận hiện tại.

Bảng làm việc hiện tại: [chi phí mỗi trạm → 3 trạm → 3 năm](cost-rollup-3stations-3years-2026-11-26.md), kèm CSV giá có nguồn, dự phòng riêng và các khoản cần báo giá. Mục tiêu tiếp theo là xác nhận BOM và scope để điền các dòng còn thiếu, không dùng subtotal làm tổng ngân sách.

> **Cập nhật 26/11/2026:** Akai đã trả lời D1 là 3 trạm/3 năm; D2/D3 chuyển Đạt/Tuấn; D8 cần so sánh HWW với cả hai phương án. Theo góp ý Đạt do Bá Nguyên chuyển, kiểm tra chức năng/bảo dưỡng 6 tháng/lần và rà mòn/ăn mòn ở năm thứ ba để thay theo tình trạng. Các đoạn bên dưới ghi 26 lượt vệ sinh + 12 hiệu chuẩn là kế hoạch ngày 25/11, **chưa phải lịch bảo dưỡng mới được xác nhận**. Xem [kế hoạch tiếp theo](ba-nguyen-next-steps-2026-11-26.md) và [quyết định cập nhật](ba-nguyen-decisions-2026-11-25.md) trước khi dùng số hoặc gửi báo giá.

Cập nhật: **25/11/2026**, sau phản hồi Đạt/Akai, kiểm chứng ảnh giá và quyết định D5/D7. Nhánh làm việc: `feature/ba-nguyen-cost-analysis`; xem PR #3 để biết commit và trao đổi mới nhất. Không tự merge hoặc chuyển nhánh. [Quyết định D5/D7](ba-nguyen-decisions-2026-11-25.md) ghi lịch và trách nhiệm tích hợp.

## Kết luận và tổng quan công việc tiếp theo

**Đủ thông tin để tiếp tục rà soát, sửa cách trình bày, lập kịch bản và chuẩn bị báo giá. Chưa đủ để khóa BOM và ngân sách cuối.** Bản rà soát chi tiết nằm ở [team-confirmation-review-2026-11-25.md](team-confirmation-review-2026-11-25.md); nguồn mới ở [CSV kiểm tra giá](team-price-source-checks-2026-11-25.csv); bản vá summary ở [team-review/README.md](team-review/README.md).

Đã làm thêm ngày 25/11: mở lại chín URL trong bảng giá và ghi [live-price-audit-2026-11-25.csv](live-price-audit-2026-11-25.csv); phát hiện mô tả đường kính cable gland trên chính trang bán không thống nhất nên sửa hàng bảng thành cần xác nhận fit. Đã lập [kịch bản chi phí có công thức](cost-scenarios-2026-11-25.csv), [bảng đầu vào nguồn điện](power-sizing-inputs-2026-11-25.csv) và [tin nhắn gửi từng người](team-replies-ready-2026-11-25.md). Những số và giả định chờ nhóm vẫn để nguyên trạng thái chờ.

Đã chụp và xem bằng mắt sáu trang giá rõ thông tin; Bá Nguyên gửi thêm bốn ảnh gốc từ thư mục Desktop. Đã sao chép nguyên bản bốn ảnh vào [manifest ảnh](cost-evidence/README.md) và đối chiếu SHA-256: pH SEN0169-V2 giá 64,90 USD, turbidity SEN0710 giá 229 USD và hai ảnh cable gland PG13.5 chứng minh giá sau VAT 3.175 VND cùng mâu thuẫn đường kính cáp 7–12/D6–12 mm. Cả chín dòng giá hiện có ảnh local đọc được; ảnh không thay báo giá và chưa xác nhận BOM. [Mẫu xin báo giá](supplier-quote-request-template.md) tách phương án ESP32 + M.2 và LILYGO tích hợp; lịch chính là 26 lượt vệ sinh/năm, còn 24 lượt chỉ là phương án so sánh. Chỉ gửi phần cấu hình phù hợp sau khi Akai/Đạt xác nhận.

Bá Nguyên chịu trách nhiệm chi phí mua sắm, lắp đặt, vận hành, bảo trì, thay thế và thải bỏ; mỗi dòng cần quantity, unit price, source, date, inclusions và proposed payer. Akai chốt cấu hình; Đạt chốt triển khai/vận hành; Tuấn nhận evidence và kiểm toàn báo cáo; Thư dùng kết luận được duyệt cho recommendations.

| Mốc | Trạng thái ngày 25/11 | Điều kiện qua mốc |
| --- | --- | --- |
| A. Đọc phản hồi, tìm lệch summary | Đã thực hiện | Số làm tròn và equipment/installed đã được phân biệt; patch đã kiểm trên bản sao |
| B. Thống nhất scope và BOM | Chưa đạt | Có bản ghi chung số trạm, thời gian, SKU, nguồn và phụ kiện |
| C. Bổ sung giá/báo giá | Chưa đạt | Mỗi dòng có evidence hoặc ghi rõ chưa có giá; không coi unknown là 0 |
| D. Hoàn thiện Cost Analysis | Đang sửa phần có bằng chứng | Summary/design/implementation/cost/recommendations cùng scope và version |
| E. QA, bàn giao, review | Chờ hoàn thiện | Có calculation/link/build/mobile/APA/AI records; Bá Nguyên duyệt trước publishing |

**Chờ ai, chờ gì:** Akai: D1–D3/D8, SKU và nguồn của BOM, sơ đồ nguồn, chọn phương án C. Đạt: D1/D4–D6, site/permission, xác nhận khả thi lịch 26 lượt và gộp 12 lần hiệu chuẩn, vai trò và scope thi công. Tuấn: D1/D8, kiểm source rồi tích hợp patch theo D7 đã phân công, xác nhận APA/word count/AI evidence. Nhà cung cấp: báo giá có VAT/phụ kiện/công lắp/dịch vụ sau khi nhóm cho đủ model và site. Thư: nhận kết luận chi phí sau khi nhóm chốt, hiện chưa phải blocker để Bá Nguyên tiếp tục rà giá. Mẫu tin nhắn cụ thể ở file trên.

## Quyết định phải chốt trước tiên

| ID | Quyết định | Còn thiếu hoặc mâu thuẫn | Ai chốt |
| --- | --- | --- | --- |
| D1 | Số trạm, thời hạn, thời điểm tính OPEX | Akai: 3 trạm/3 năm; Đạt/final website: 10 trạm/1 năm. Bảng cá nhân: đơn vị 1 trạm/12 tháng | Akai + Đạt + Tuấn |
| D2 | Final hardware | LILYGO thay ESP32/M.2? DO 169 USD SKU nào? Turbidity 9.90 USD hay SEN0710 229 USD? pH electrode 49.50 có tương thích? | Akai |
| D3 | Power chain | 20 W là đề xuất; thiếu load, upload interval, battery Wh/Ah, autonomy, sơ đồ 12 V tới board và converter/protection | Akai + Đạt |
| D4 | Site/lắp đặt | GPS, permission, flood line, box size, chiều dài cáp, cage/arm/wiper và grounding/surge | Đạt + đơn vị thi công |
| D5 | Maintenance/service | Bá Nguyên chọn 26 lượt định kỳ/năm/trạm; 12 lần hiệu chuẩn dự kiến gộp. Đạt xác nhận khả thi, chuyến riêng, sau lũ và báo giá | Bá Nguyên chốt lịch; Đạt xác nhận vận hành |
| D6 | Shared costs, payer/operator | Vai trò trong report chưa phải hợp đồng/tài trợ; cloud/app/training/lab/SMS chưa đủ scope | Đạt + Tuấn |
| D7 | Tích hợp website cuối | Bá Nguyên đồng ý Tuấn tích hợp patch trên `final-website` sau khi kiểm snapshot; chưa áp patch hay sửa nhánh Tuấn | Tuấn tích hợp; Bá Nguyên rà số |
| D8 | Cùng bộ phương án so sánh | File Akai: AI + IoT; final website và matrix OPTS C: manual sampling | Akai + nhóm + Tuấn |

## Buổi 1 — Tiếp nhận phản hồi và sửa sai lệch có căn cứ (1–2 giờ)

**Đã làm trong lượt này:**

1. Kiểm branch/status: đúng `feature/ba-nguyen-cost-analysis`, ban đầu sạch; không checkout/merge branch khác.
2. Đọc hai file gửi kèm; đối chiếu mọi hàng BOM/OPEX của Akai với Đạt, section/CSV đang có và source `final-website` bằng `git show`.
3. Kiểm `10 × (468.07 + 142.50) = 6,105.70 USD`: summary “about 6,100” là làm tròn. Equipment 428.07 khác installed 468.07; heading 430 cần làm rõ phạm vi.
4. Chuẩn bị patch đồng bộ summary/heading/calculator và gắn nhãn scenario chưa đầy đủ. Patch đã kiểm trên bản sao tạm; chưa áp lên website cuối vì nhánh cá nhân thiếu hai file đích.
5. Sửa section đang có: candidate BOM, một trạm là đơn vị tính; pH reserve không phải lịch thay bắt buộc; ghi rõ lịch chọn 26 lượt/năm và giá dịch vụ vẫn cần báo giá. Không thay subtotal cũ bằng số khác model trong file Akai.
6. Kiểm trực tiếp pH/turbidity/LILYGO và lưu CSV riêng ngày 25/11; không gắn ngày mới cho những giá chưa mở lại.

**Đầu ra:** review, source-check CSV, patch và plan cập nhật. Chi tiết phương pháp và giới hạn nằm trong review.

## Buổi 2 — Khóa scope và thông số ảnh hưởng tiền (45–90 phút chủ động; thời gian chờ riêng)

1. Các câu hỏi D1–D8 đã đăng trong PR #3. Gửi thêm quyết định D5/D7, rồi theo dõi phản hồi theo từng ID.
2. Chốt một bản ghi có ngày: số trạm, evaluation period, thời điểm bắt đầu OPEX và shared/per-station costs. Nếu dùng 3/3, sửa summary/implementation/recommendations cùng scope; nếu giữ 10/1 thì 3/3 chỉ là comparison scenario có nhãn.
3. Akai cung cấp exact SKU/revision, LILYGO E/G/SA variant, package/accessories, sensor interfaces và danh sách linh kiện bỏ/thêm khi dùng board tích hợp. Không cộng hai cấu hình ESP32/M.2 và LILYGO.
4. Đạt xác nhận 24 hoặc 26 visits, calibration overlap, flood extras, spare/48h repair, enclosure/cable/site/protection và acceptance criteria. Mục chưa khảo sát ghi TBD kèm người thu thập, cách thu thập và thời điểm dự kiến.
5. Chốt power diagram, battery Wh/Ah, autonomy, upload duty cycle và measured/estimated load tách bạch trước khi gọi 20 W là đủ. Không coi mô phỏng là số đo tải thực.
6. Tuấn xác nhận cách đưa patch/cost register vào website cuối; chưa tự merge kiến trúc mới chỉ để sửa summary.

**Tự làm trước:** bảng quyết định, bảng đối chiếu và worksheet tải `Wh/ngày = Σ(W × giờ/ngày)` với ô chưa biết để trống. **Cần nhóm:** chọn scope, BOM, site và trách nhiệm. **Qua buổi khi:** từng mục đã trả lời hoặc có TBD cụ thể, mọi mâu thuẫn còn mở được ghi lại.

## Buổi 3 — Thu giá và báo giá đúng model (2–4 giờ chủ động; chờ supplier riêng)

1. Theo BOM đã chọn, mở URL trực tiếp từng sản phẩm; ghi SKU/variant/qty/unit, giá gốc/currency, ngày/giờ, VAT, freight/import/payment fees, stock, warranty và included accessories. Chụp giá/model, đặt tên file khớp evidence ID. Không dùng snippet tìm kiếm thay trang đích.
2. Xin nguồn/variant cho LILYGO 49.78 USD: lần mở 25/11 thấy 65.31 USD trên family page, chưa chứng minh cùng package. Không thay thẳng giá family vào BOM.
3. Với DO 169 USD và pH electrode 49.50 USD, tìm đúng SKU/datasheet tương thích. Phân biệt DO điện hóa và fluorescence; không áp chung electrolyte/membrane interval.
4. Chốt turbidity 9.90 USD là model nào, suitability ngâm liên tục, range, interface và mức analog output; SEN0189 và SEN0710 không hoán đổi. Temperature 7.50 USD cũng cần SKU, chiều dài và vật liệu cáp.
5. Tách gói 80 USD thành battery, enclosure, cage/arm, wiper và cable/connectors. Ghi quantity/spec; chưa khảo sát thì không tự gán “short cable” bằng một chiều dài bịa.
6. Soạn quote request từ `supplier-quote-request-template.md` cho power/protection, housing/mounting, installation/commissioning, cleaning/calibration/travel, SIM/hosting, pH/DO consumables, spare units, training/lab/SMS/software support/disposal. Lấy hai quote cho bundle quan trọng khi khả thi; nếu ít hơn ghi rõ giới hạn.
7. Lưu provider/quote number/date/validity, quantity, VAT, freight, labour/travel, warranty và exclusions. Agent có thể soạn yêu cầu; việc gửi tới supplier/nhóm cần Bá Nguyên thực hiện hoặc ủy quyền riêng.
8. Khi đổi sang VND, lưu nguồn và loại tỷ giá, ngày/giờ, fees, phép nhân và rounding. 26,000 của scenario và 25,940 của register cũ là hai basis, không trộn và không gọi là tỷ giá mới 25/11.

**Đầu ra:** CSV giá cập nhật sau xác nhận, evidence screenshots/quotes và danh sách chính xác khoản chưa có giá. **Điều kiện:** unknown ghi `Quote required`; allowance nội bộ phải có nhãn, không gọi là supplier quote.

## Buổi 4 — Tính CAPEX/OPEX/lifecycle cùng phạm vi (1–2 giờ)

1. Tạo bảng đủ `cost_id`, SKU/service, qty/trạm, qty/pilot, unit price/currency, subtotal, basis/source/date, frequency, payer và exclusions.
2. Tách CAPEX một lần, OPEX tháng/lượt/năm, replacement và end-of-life đúng thời điểm. Cloud/app/training dùng chung hay per-station phải ghi rõ; không nhân mọi dòng theo số trạm.
3. Với scenario đơn giản dùng `n × installed_unit + n × annual_unit × y + shared_costs + replacements + disposal`. Chỉ cộng hạng mục chưa nằm trong installed/annual; tránh tính đôi pH reserve hoặc labour/service.
4. Kiểm từng phép `qty × price`, month × 12, visits × rate và station-years. Nếu triển khai tháng 3–9, tính cashflow theo thời điểm lắp hoặc ghi rõ 12 tháng vận hành đầy đủ; không coi hai cách là cùng năm đầu.
5. Tạo sensitivity 24/26 visits, model turbidity/DO, power/spares và volume tiers. Nếu dùng 2.50 USD/lượt thì thêm hai lượt là +5 USD/năm/trạm chỉ là sensitivity, không phải báo giá mới.
6. Với 3 năm, bổ sung lịch thay pH/DO/battery/spares và support/disposal đúng model. Nếu chưa có inflation/discount/failure evidence, giữ constant nominal assumptions có nhãn, không tự đoán phần trăm.
7. Đồng bộ prose/table/evidence register/summary/calculator/handoff. 15,578,972 VND là subtotal candidate cũ, không phải giá pilot LILYGO. Khi còn essential cost chưa tính, mọi tổng vẫn ghi partial/scenario.

**Đầu ra:** bảng tính kiểm lại được, có version và inclusions/exclusions. **Qua buổi khi:** mỗi tổng có công thức, đầu vào và scope; người đọc phân biệt scenario với ngân sách được quote đầy đủ.

## Buổi 5 — Nội dung cuối, APA và rubric (1–2 giờ)

1. Hoàn thiện prose quanh mục tiêu 350 từ sau khi Tuấn xác nhận cách đếm theo template; không tự coi bảng được miễn. Toàn báo cáo 4,000 từ, chỉ loại các phần tài liệu chính thức cho phép.
2. Nối chi phí với community/design criteria: probe durability/fouling, tiếp cận bảo trì, alert/lab confirmation, nguồn phụ thuộc load/shade, proposed payer và không tự áp phí cư dân.
3. Rà APA theo `APA Interactive Guide_2.pdf` của UTS: tác giả/ngày hoặc n.d., title, direct product URL, retrieval date với giá thay đổi, a/b suffix và in-text/reference khớp. File nhóm là internal evidence, không phải supplier quotation; nhờ Tuấn chuẩn hóa cách dẫn/đính kèm để truy xuất.
4. Đổi các câu “complete cost”, “affordable”, “tiny fraction” khi scope/bằng chứng chưa đủ; funding proposal khác committed funding. Chỉ giữ ý có căn cứ.
5. Rà rubric: đủ mua/lắp/vận hành/bảo trì/thay/thải; trade-off có nguồn; timeline/owner/site khả thi; bảng/caption/citation dễ đọc; không biến simulated tests thành field results.
6. Bàn giao Thư các số được duyệt và limitations để cập nhật Recommendations. Không cam kết điểm Excellent khi quote/site/test còn thiếu.
7. Nhờ Akai chốt D8: nếu đổi manual sampling sang AI + IoT, cập nhật mô tả/options và decision matrix rồi nhóm đánh giá lại theo tiêu chí thống nhất; không tái dùng điểm manual sampling cho AI. Bá Nguyên chỉ đồng bộ bảng chi phí sau quyết định.

**Đầu ra:** nội dung thống nhất, APA checklist và evidence gaps; Tuấn kiểm chung word count, sources và appendix/AI records.

## Buổi 6 — Website QA, bàn giao và duyệt Git (1–2 giờ)

1. Kiểm branch/status trước sửa, giữ thay đổi chưa commit. `final-website` chưa tích hợp thì dùng patch phối hợp Tuấn, không tự switch/merge.
2. Trong **website hiện tại** chạy `npm.cmd run check:links` và `npm.cmd run build`. Snapshot `final-website` chưa có script `check:links`; không ghi kết quả scaffold như test của website cuối.
3. Khi được phép áp patch: reviewer dùng `git apply --check`, xem diff, áp trên checkout được phép rồi build/test `#home-summary` và `#implementation-cost`. Kiểm 1/3/10 trạm, 1/3 năm, heading/summary và đổi một giá BOM để thử mọi số có cập nhật.
4. Desktop + phone thật: bảng đủ cột/cuộn ngang; toàn trang không tràn ngang; chữ/số đọc được; menu/References đúng. Dùng port Vite và IPv4 từ `ipconfig` lúc test, không dùng IP cũ như cố định. Ghi device/browser/viewport/date/result/screenshot lỗi. Emulation không thay phone thật.
5. Bàn giao Tuấn: review, BOM/cost CSV, nguồn/quotes, patch/handoff, build/link/mobile, APA notes và screenshots prompt/output AI. Chỉ ghi contribution thật và approvals có bằng chứng.
6. Cuối cùng chạy `git diff --check`, `git status --short`, `git diff --stat`, rà file. Chỉ commit/push/cập nhật PR khi Bá Nguyên cho phép; không merge/publish. Không coi trạng thái PR là bằng chứng ngân sách đã đủ hoặc nội dung đã được nhóm duyệt.

**Đầu ra:** gói review được; các quyết định chưa có evidence tiếp tục ở TBD, không điền số giả để hoàn thành bảng.

## Team confirmation requests — các câu hỏi còn cần sau hai phản hồi

### Akai — detailed design and hardware

1. **D1:** Main pilot là 3 trạm/3 năm hay 10 trạm/1 năm? Nếu dùng cả hai, đâu là scenario so sánh?
2. **D2:** Chốt exact SKU/revision của từng sensor và LILYGO variant E/G/SA; gửi link/ảnh giá và included accessories. Xác nhận bỏ/thêm các row ESP32/M.2/RS485 nào.
3. **D2:** DO 169 USD là model nào? Turbidity 9.90 USD có phải SEN0189 hay model khác? Temperature 7.50 USD SKU nào? Giao tiếp/độ bền dùng ngoài hiện trường đã được kiểm chưa?
4. **D3:** Gửi sơ đồ panel/controller/battery/DC/board, battery Wh/Ah, autonomy, load và upload interval. 20 W đã có tính tải hay mới là đề xuất?
5. **D2/D5:** Electrode 49.50 USD có SKU/link tương thích pH kit không? Consumables/interval đúng DO model và thiết bị còn thiếu là gì?
6. **D8:** Phương án C cuối là AI + IoT hay manual sampling? Ai cập nhật matrix/rationale và khi nào nhóm đánh giá lại?

### Đạt — implementation and operations

1. **D1/D4:** Đồng ý scope nào? Sites/GPS/permissions nào vẫn TBD, ai khảo sát flood/cable/shade/signal và dự kiến khi nào có?
2. **D4:** Có thông số hoặc cách thu thập enclosure/cable/arm/cage/wiper/grounding/surge chưa? Gói 80 USD gồm những gì và chưa gồm gì?
3. **D5:** Bá Nguyên chọn 26 lượt vệ sinh/kiểm tra định kỳ mỗi 14 ngày trong 12 tháng; nhờ Đạt xác nhận khả thi. Có thể gộp 12 lần hiệu chuẩn với 12 lượt này không? Flood extra/spares/48h repair và báo giá tính thế nào?
4. **D5/D6:** Operator/responder/payer vẫn là đề xuất hay có thỏa thuận? Acceptance criteria và travel/lab/training/SMS cần quotation nào?
5. **Summary:** Review cho thấy 6,100 là làm tròn của 6,105.70; header 430 chưa gồm labour 40 và khác installed 468.07. Nếu lỗi bạn nói là con số khác, chỉ đúng dòng hoặc giá trị để đối chiếu tiếp.

### Tuấn — integration and final review

1. Thống nhất D1 xuyên suốt report; một trạm chỉ là unit-cost.
2. **D7:** Bá Nguyên đồng ý Tuấn tích hợp patch vào source `final-website` sau khi kiểm snapshot; Tuấn báo link bản tích hợp và kết quả build/QA để Bá Nguyên rà số. PR #3 target `main` chưa có source này nên không dùng merge PR làm bước tích hợp.
3. Nhận evidence để kiểm APA, word count, appendix và AI log; tách payer proposal với commitment.

Mẫu trả lời ngay trong PR #3: `Decision ID | Confirmed / Proposed / TBD | lựa chọn + SKU/scope | source/ảnh/quote | người quyết định | ngày | thông tin còn cần`. “Confirmed in report” không đồng nghĩa đã có giấy phép, quotation hoặc hợp đồng.

## Nếu hôm nay chỉ có một giờ

1. **10 phút:** đọc review, phân biệt các tổng khác scope.
2. **15 phút:** nhờ Akai/Đạt/Tuấn chốt D1–D3, nhất là số trạm và LILYGO/turbidity/DO SKU.
3. **20 phút:** tập hợp evidence của sensor và LILYGO đúng variant; chưa có model thì không thay giá.
4. **15 phút:** gửi quyết định D7 cho Tuấn và lịch 26 lượt D5 cho Đạt; lấy phản hồi về kết quả tích hợp, khả thi và báo giá. Chưa có câu trả lời thì giữ unknown đúng trạng thái.

<details>
<summary>Kế hoạch 19/11 — lưu lịch sử, đã được kế hoạch 25/11 phía trên thay thế</summary>

## Phạm vi được giao

Theo `website/README.md`, Bá Nguyên xác nhận danh mục thiết bị với Akai, đối chiếu kế hoạch triển khai với Đạt và viết chi phí mua sắm, vận hành, bảo trì, thay thế, số lượng, đơn giá, nguồn, ngày kiểm tra và bên dự kiến chi trả. Chuyển nguồn và bằng chứng cho Tuấn; chuyển các kết luận chi phí đã xác nhận cho Thư.

## Tình trạng hiện tại

| Việc | Trạng thái | Bằng chứng / giới hạn |
| --- | --- | --- |
| Bản nháp Cost Analysis, bảng BOM và ghi chú nguồn | Đã có ở máy | `src/content/sections/08-cost-analysis.ts`, `content/cost-price-evidence.csv`, `content/evidence-register.csv` |
| Kiểm tra giá niêm yết và phép tính | Đã làm bước đầu | 13.895.466 VND mua sắm đã có giá và 15.578.972 VND gồm provision pH. Đây là subtotal chưa gồm các khoản thiết yếu khác. |
| Kiểm tra link, TypeScript và build | Đã chạy, đạt | Kết quả lưu trong `content/cost-analysis-handoff.md`; chạy lại sau mọi sửa đổi tiếp theo. |
| Độ dài phần văn xuôi Cost Analysis | Đã rút gọn | 363 từ theo đếm tự động; gần mục tiêu 350 từ, không tính bảng hay references. |
| Giả lập màn hình điện thoại 390 × 844 | Đã chạy, đạt | Chưa thay thế được phép thử trên điện thoại thật. |
| Manifest nguồn giá | Đã có ở máy | `content/cost-evidence/README.md` liên kết từng mã hàng, URL, giá, VAT và dòng CSV tương ứng. |
| Ảnh trang giá và ảnh prompt/output AI | Ảnh giá đã tập hợp; ảnh AI còn thiếu | Mười ảnh trang giá rõ đã lưu local cho chín dòng giá; bốn ảnh do Bá Nguyên cung cấp đã được sao chép nguyên bản và kiểm hash. Ảnh prompt/output AI vẫn chưa tập hợp. |
| Cấu hình vật lý, báo giá nhà cung cấp và người trả tiền | Chờ nhóm và nhà cung cấp | Không gọi subtotal là tổng CAPEX/OPEX hoặc tổng chi phí thí điểm. |

## Team confirmation requests — please comment in this file

### Akai — detailed design and hardware

1. Confirm the final sensor BOM: retain, remove or replace pH SEN0169-V2, DO SEN0680, turbidity SEN0710, DS18B20, ESP32 and the TTL-to-RS485 converter.
2. Confirm whether SIM7600G-H-M.2 is the intended modem. If yes, provide the compatible M.2 B-key carrier, LTE antenna connector/type and modem power requirement. If no, provide the final modem board/model and its included accessories.
3. Confirm whether the station uses mains power or solar. For solar, state the minimum panel, battery, controller and DC-conversion requirement once the expected load is known.
4. Identify any component that must be added to the physical BOM and any simulation-only item that must be excluded.

### Dat — implementation and operations

1. State the proposed site or the assumptions required to select it, including permission and safe access for installation and maintenance.
2. State the enclosure location, cable-route length, sensor mounting method, exposure to water/corrosion and any grounding or protection requirement.
3. Confirm the proposed power option, expected shading if solar is used, signal-coverage check and commissioning/acceptance activities.
4. Propose the 12-month inspection, cleaning and calibration frequency, including who operates the station and who responds to incidents.
5. Identify what installation, field work, training or maintenance work must be obtained as a supplier quotation.

Please reply below the relevant question with either a confirmed choice, a source/model or the label `TBD` plus the information needed to decide. Bá Nguyên will update the cost register after the response is recorded.

## Buổi 1 — Khóa danh mục và sửa bằng chứng (ưu tiên cao, 1–2 giờ)

1. Xác nhận nhánh bằng `git status --short` và `git branch --show-current` trước khi sửa; giữ toàn bộ thay đổi chưa commit.
2. Gửi Akai danh mục pH SEN0169-V2, DO SEN0680, turbidity SEN0710, DS18B20, ESP32, RS485, SIM7600 M.2. Hỏi mã hàng nào được chốt, nguồn cấp và giao tiếp từng phần, và SIM7600 M.2 có thực sự phù hợp ESP32 không.
3. Gửi Đạt câu hỏi về địa điểm được phép lắp, chiều dài dây, cách gá, điện lưới hay solar, số lần hiệu chuẩn/kiểm tra, quy trình nghiệm thu và người vận hành.
4. Rà lại giá 305.000 VND của hộp Viger: trang có nhiều kích cỡ. Việc này đã được thực hiện: giá chuyển thành tham khảo chưa cộng vào subtotal. Chỉ cộng sau khi xác định được biến thể chính xác. Xác nhận bốn cable glands PG13.5 có đúng đường kính và số đường cáp.
5. Chụp trang từng giá đang dùng (mã hàng, giá, VAT, ngày/giờ), lưu thành bằng chứng cá nhân có tên khớp `price-001`...`price-009`; với giá USD lưu cả tỷ giá và phép nhân. Nếu trang không còn hiển thị giá, đổi trạng thái nguồn thay vì giữ nhãn đã kiểm chứng.

Đầu ra: BOM được Akai đối chiếu, câu hỏi kỹ thuật cho Đạt và bộ ảnh nguồn giá. Có thể tự làm bước 1, 4, 5 ngay; bước 2–3 cần câu trả lời nhóm.

## Buổi 2 — Thu đủ giá và báo giá (2–4 giờ tìm kiếm, thời gian chờ báo giá riêng)

1. Sau khi có công suất và địa điểm, chọn đúng model panel, battery, charge controller, DC converter, bảo vệ nguồn, hộp, dây, đầu nối và gá. Ghi từng thành phần; không gọi các linh kiện rời là “solar kit” hoàn chỉnh.
2. Xác định carrier tương thích M.2 B-key, anten đầu nối phù hợp và nguồn đáp ứng dòng modem, hoặc xin Akai duyệt một modem dạng board đã gồm carrier và anten. Không cộng đồng thời module M.2 và board thay thế.
3. Xin ít nhất hai báo giá khả thi cho các nhóm quan trọng: nguồn, modem/phụ kiện, lắp đặt/hiệu chuẩn và bảo trì. Xin thêm phí SIM, hosting, vật tư thay DO, thu gom/thải bỏ. Yêu cầu rõ đơn vị, số lượng, VAT, giao hàng, lắp đặt, bảo hành và hạn giá.
4. Cập nhật `cost-price-evidence.csv` theo trạng thái: giá niêm yết, báo giá nhận được, ước tính nội bộ hoặc chưa có giá. Lưu file báo giá và ngày nhận; giữ những khoản không có căn cứ ở trạng thái “cần báo giá”.

Đầu ra: bảng giá kiểm tra lại được và danh sách khoản vẫn chưa báo giá. Việc tìm sản phẩm và soạn yêu cầu báo giá có thể tự làm; cấu hình cuối cùng phụ thuộc Akai/Đạt và nhà cung cấp.

## Buổi 3 — Hoàn thiện bài viết và rubric (1–2 giờ sau khi có thông tin)

1. Đối chiếu từng hàng `số lượng × đơn giá`, chi phí tháng × 12, số lần kiểm tra × số lượt; tính CAPEX, OPEX và lifecycle chỉ khi phạm vi chi phí đã đủ. Đồng bộ mọi số trong văn bản, bảng và evidence register.
2. Viết lại phần Cost Analysis gần mục tiêu 350 từ cho phần văn xuôi, nếu cách loại trừ bảng được tài liệu chính thức cho phép; rà giới hạn 4.000 từ toàn báo cáo với Tuấn.
3. Kiểm APA 7 theo tài liệu UTS: tên tác giả/tổ chức, ngày, URL trực tiếp, chữ nghiêng, trích dẫn trong bài và danh mục. Đảm bảo mỗi con số và thông số quan trọng truy về đúng nguồn.
4. So rubric Excellent: cấu trúc, nghiên cứu, câu chữ, quá trình thiết kế; nối chi phí với tiêu chí cộng đồng, thiết kế của Akai, kế hoạch Đạt và khuyến nghị Thư. Giữ mọi cam kết tài trợ ở dạng đề xuất tới khi được xác nhận.

Đầu ra: bản Cost Analysis có các tổng có phạm vi chính xác, danh sách kiểm rubric và danh sách vấn đề còn mở. Nếu thiếu báo giá, giữ subtotal hiện có với giới hạn nêu rõ.

## Buổi 4 — Kiểm tra và bàn giao (1–2 giờ)

1. Chạy `npm.cmd run check:links` và `npm.cmd run build` từ `website` sau sửa đổi cuối.
2. Thử `/pages/cost-analysis` trên điện thoại thật cùng Wi-Fi. Ghi tên máy, trình duyệt, kích thước màn hình, khả năng cuộn đủ cột của bảng, mức đọc của chữ/số, tràn ngang toàn trang, menu và liên kết References; chụp lỗi nếu có. Địa chỉ IP/port cần lấy lại từ `ipconfig` và Vite vào lúc thử, không dùng địa chỉ cũ như địa chỉ cố định.
3. Gửi Tuấn `cost-analysis-handoff.md`, CSV nguồn giá, ảnh giá, các báo giá, kết quả test và ảnh prompt/output AI. Gửi Thư các con số đã được nhóm duyệt và các giới hạn cần nhắc trong Recommendations.
4. Chạy `git diff --check`, `git status --short`, `git diff --stat`; rà chỉ có file thuộc phần việc. Đợi Bá Nguyên cho phép trước mọi commit, push, PR hoặc xuất bản.

Đầu ra: gói bàn giao có thể kiểm tra và danh sách việc vẫn cần quyết định từ nhóm.

## Thứ tự nếu chỉ có một giờ

Kiểm tra nhánh → hỏi Akai về modem và danh mục → xác minh biến thể/giá hộp Viger → chụp ba giá đắt nhất (turbidity, DO, pH) → gửi Đạt danh sách thông số địa điểm còn thiếu.

</details>
