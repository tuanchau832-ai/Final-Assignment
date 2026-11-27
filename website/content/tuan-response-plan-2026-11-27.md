# Phản hồi Tuấn: kiểm tra, kế hoạch và việc thực hiện — 27/11/2026

## Trạng thái GitHub và thông tin đã đủ

Đã đọc [comment Tuấn](https://github.com/tuanchau832-ai/Final-Assignment/pull/3#issuecomment-7221973174), [hồ sơ trạm đầu](https://github.com/tuanchau832-ai/Final-Assignment/blob/7208280f9e2c2064ddbab716604d871988b1016d/website/content/first-station-pilot.md) và diff của cả 5 file trên **`docs/tuan-d7-maintenance@7208280f9e2c2064ddbab716604d871988b1016d`**. [Bản lưu comment](team-review/tuan-response-2026-11-27.json) ghi nguồn/ngày.

Trong checkout Bá Nguyên, `HEAD` lúc bắt đầu vẫn là `2a3fb2be`; thao tác pull đã làm nhánh remote của Tuấn có sẵn để đọc, **không merge code Tuấn vào nhánh Bá Nguyên**. `final-website` vẫn ở `a85be4e`. Vì vậy “đã tích hợp” trong comment là trên nhánh đề xuất của Tuấn, chưa phải final-website/live.

**Đủ để làm tiếp:** đối chiếu và nhận xét D7; lập phương án mua 1 + 2; tính một bộ pH dự phòng chung như kịch bản làm việc; chuẩn bị yêu cầu báo giá A/B cùng scope; ghi đề xuất site, power và acceptance vào hồ sơ với trạng thái đúng.

**Chưa đủ để khóa ngân sách/triển khai:** quote giao/lắp đầy đủ, carrier/antenna/nguồn, SKU LILYGO/package, site/quyền lắp, tải đo, ngày commissioning từng trạm, hiệu chuẩn theo model, operator/backup, quyết định ngưỡng/rule và cam kết payer. Hai điều kiện mới cần giải quyết là thời gian vận hành khi mua lệch đợt và nhu cầu hiệu chuẩn ngoài sáu chuyến testing cơ sở.

## Đối chiếu thay đổi và quyết định của phần chi phí

| Mục | Tuấn đã làm/đề xuất | Kết quả Bá Nguyên kiểm tra và cách dùng |
| --- | --- | --- |
| D1/D7 | 3 trạm/3 năm; mua một trạm trước, nghiệm thu rồi mới mua hai trạm | Nhận làm **working procurement plan có điều kiện**, không là lệnh mua. Cần xác định kỳ 36 tháng của dự án hay 36 tháng cho từng trạm. |
| Giá mua | 13.895.466 + 27.790.932 = 41.686.398 VND | Khớp hồ sơ 8 dòng giá đã có. CAPEX tính một lần; không nhân theo năm. Báo giá hai trạm sau phải cập nhật khi mua. |
| Dự phòng pH | Một kit dùng chung 1.683.506 VND thay ba kit | Nhận làm **kịch bản tùy chọn**, cần kiểm bảo quản, tương thích và đưa tới site trong 48 giờ. Mua ban đầu + reserve chung = **43.369.904 VND**; chênh với giả định ba reserve là **3.367.012 VND**. Đây là thay giả định số lượng, chưa phải tiết kiệm theo quote đã ký. |
| BOM A/B | ESP32/M.2 làm tham chiếu, so LILYGO đúng SKU với cùng sensors/site | Đủ để soạn RFQ cùng phạm vi; chưa là chọn phần cứng cuối. TDS chỉ thêm nếu nhóm chọn rule cần TDS; giá/quantity còn TBD. Không tự bỏ DS18B20 chỉ vì probe DO có temperature channel. |
| Site/power | Đề xuất khảo sát Cầu Mới → Cầu Dậu → Cầu Thanh Liệt; panel 20 W chỉ để thử tính | Ghi là tuyến đề xuất, chưa là cửa xả/GPS/permission được xác nhận. Hai probe 0,2 W nếu chạy liên tục cho 9,6 Wh/ngày chỉ là phần tải từ datasheet, chưa đủ sizing hệ thống. |
| D5/D6 | Sáu chuyến cơ sở, 18 lượt kiểm; 36 tháng hosting chung, tối đa 108 SIM-tháng | Đúng baseline cả ba vận hành đủ kỳ cùng lịch. Nếu commissioning lệch, cần tính lại quantity, review theo tuổi trạm và thời gian duy trì backend; không gọi đây là lượng dùng thực tế. |
| QA | Tuấn báo build/mobile và 13 ca simulator đạt | Bá Nguyên đã chạy lại build, 13 ca simulator và calculator source trên bản sao tạm: đạt. [Phạm vi kiểm và giới hạn](team-review/tuan-integration-check-2026-11-27.md). Không nhận đây là field test hoặc tự nhận đã chạy lại browser/mobile. |
| Accuracy/acceptance | DO/turbidity cần đối chiếu quanh ngưỡng; mục tiêu đề xuất 3 NTU, 0,30 mg/L và rule nhạy DO | Phép quy đổi sai số công bố khớp nguồn hãng. Các mục tiêu là đề xuất của Tuấn, **chưa được reviewer phê duyệt và chưa có số đo đạt**. Thêm gate thuê/mượn máy tham chiếu trước đặt hai trạm tiếp theo. |

## Hai điểm cần chỉnh trước khi chốt phạm vi xin giá

### 1. Mua lệch đợt và kỳ vận hành

Nếu ba trạm đều chạy đủ 36 tháng, có 108 SIM-tháng, nhưng trạm 2/3 vận hành muộn sẽ kéo dài thời gian dự án/hosting sau tháng 36 của trạm đầu. Nếu dự án đóng tại tháng 36 chung, hai trạm sau có ít tháng hoạt động hơn; không thể đồng thời khẳng định mỗi trạm chạy 36 tháng. Tương tự, review tháng 36 theo tuổi từng trạm có thể khác tháng 36 chung của dự án.

[Worksheet commissioning](commissioning-cost-basis-2026-11-27.csv) cho baseline và hai ví dụ **chỉ để kiểm logic**, không phải lịch nhóm đã chọn. Ví dụ trạm 2/3 bắt đầu tháng 6: đóng cùng tháng 36 cho 96 SIM-tháng/16 kiểm trạm; nếu cả ba chạy đủ 36 tháng thì hosting kéo tới tháng 42 và các mốc kiểm riêng không còn chỉ sáu chuyến chung. Không tự chốt ngày vận hành bằng các ví dụ.

### 2. Sáu chuyến testing không phải toàn bộ nhu cầu hiệu chuẩn

Ngày 27/11 đã kiểm nguồn hãng: [SEN0710](https://www.dfrobot.com/product-3104.html) hướng dẫn hiệu chuẩn lại mỗi 90 ngày; [hướng dẫn pH SEN0169-V2](https://wiki.dfrobot.com/sen0169-v2/docs/24420) nêu mức lý tưởng hằng tháng. Cần Đạt/Akai rà lịch phù hợp model/site và scope nhà cung cấp. Vì vậy giữ **sáu chuyến testing cơ sở**, còn phần hiệu chuẩn/chuẩn/di chuyển ngoài các chuyến đó vẫn cần tính và báo giá. Không tự khôi phục giá cleaning 24/26 hoặc 12 monthly calibration cũ; cũng không chỉ chờ phần mềm báo drift rồi bỏ hướng dẫn hãng.

## Kế hoạch tổng quát và chi tiết

| Bước | Việc Bá Nguyên thực hiện | Đầu ra / tiêu chí | Trạng thái |
| --- | --- | --- | --- |
| 1 | Đọc comment, 5 file diff, xác định nhánh tích hợp và phân loại confirmed/proposed/pending | Hồ sơ này, snapshot comment, không nhầm nhánh proposal với final | Đã làm |
| 2 | Kiểm phép tính giá và calculator, chạy lại build/simulator trên bản sao | Kiểm 1/1, 3/1, 3/3, 10/1; báo cáo phạm vi riêng | Đã làm |
| 3 | Lập mua hai đợt và đổi reserve tùy chọn sang 1 bộ chung | [CSV mua 1 + 2](staged-procurement-2026-11-27.csv), rollup cập nhật; không đổi đơn giá lịch sử | Đã làm |
| 4 | Tách baseline từ commissioning thực tế và dịch vụ bổ sung | Worksheet thời gian, chú thích lịch 18 checks chỉ là baseline, scope calibration cần thêm | Đã làm |
| 5 | Chuẩn bị RFQ A/B, reference instruments, TDS có điều kiện; ghi model specs/acceptance proposal | Quote template và [hồ sơ kỹ thuật kiểm nguồn](sensor-source-checks-2026-11-27.csv); không bịa quote hoặc field results | Đã làm |
| 6 | Sửa phần phân vai trong kế hoạch hiện tại theo README và đề xuất Tuấn có nhãn | Thiết kế: Akai; triển khai/field: Đạt; chi phí: Bá Nguyên; Tuấn nhận phần tích hợp/data do chính bạn ấy mới đề xuất; chưa coi operator/payer là việc Tuấn tự phải chốt | Đã làm |
| 7 | Kiểm giá/quantity/link/build nhánh Bá Nguyên; bàn giao nhận xét D7 và câu hỏi còn thiếu qua PR | 30 dòng rollup đạt kiểm số, hai đợt mua, reserve chung và ba ví dụ commissioning đúng; link và build đạt; bàn giao trên nhánh Bá Nguyên | Đã kiểm, chuẩn bị công bố cùng commit này |

## Ai cần cung cấp gì để hoàn tất

| Người/đơn vị | Phần cần bổ sung | Không cần hỏi lại |
| --- | --- | --- |
| Đạt, phối hợp Akai về thiết kế | Ngày vận hành/kỳ 36 tháng, site/permission/tuyến, tải đo, thresholds đã duyệt, lịch hiệu chuẩn theo đúng model; operator/backup | Không hỏi lại lịch testing sáu tháng hoặc review gộp lượt cuối đã trả |
| Akai / nhóm thiết kế | Rule Report hay Team; TDS, suitability/range/uncertainty; chấm AI + IoT với nguồn và trọng số | BOM tham chiếu để hỏi giá đã đủ; chưa gọi là BOM cuối |
| Bá Nguyên + người/nhà cung cấp được nhóm giao | Hai quote A/B giao và lắp cùng scope, hai đợt giao, phụ tùng chung, testing + calibration thêm, máy tham chiếu, SIM/hosting | Chưa có sự cho phép gửi tới nhà cung cấp bên ngoài hoặc địa chỉ liên hệ thì chỉ chuẩn bị RFQ, không tự gửi |
| Tuấn | Chỉnh mô tả horizon/quantity theo quyết định nhóm, link tới hồ sơ mới; phản hồi review trước khi tích hợp final; evidence/data/alert test theo đề xuất của Tuấn | Không yêu cầu Tuấn tự quyết định cấu hình nguồn, nghiệm thu field hay cam kết tài trợ chỉ vì làm editing |
| Nhóm và bên có quyền duyệt chi/vận hành | Phân vai được từng người nhận, payer từng khoản, cam kết resources/48 giờ và duyệt mua sau acceptance | Danh sách vai trò trong hồ sơ Tuấn là đề xuất, chưa là thỏa thuận đã ký |

## Kết quả cuối và giới hạn

Các phần tự làm không phụ thuộc quote/đo đã được thực hiện. Kiểm 30 dòng rollup, split 1 + 2, reserve chung 1 kit, giá/tỷ giá/ngày lịch sử không đổi, ba ví dụ commissioning, 24 evidence records, CSV/link Markdown và source snapshot: đạt. `check:links` đạt 12 routes; TypeScript/Vite build nhánh Bá Nguyên đạt. Kiểm riêng proposal Tuấn được ghi ở báo cáo QA, không coi build của nhánh cá nhân thay cho bản proposal.

Chưa có ngân sách đầy đủ hoặc chấp thuận mua sắm. Không áp dụng 222 USD/chiếc cho SEN0710 vào subtotal chỉ vì trang có giá 3+: mua 1 rồi 2 phải xin xác nhận điều kiện giá theo hai đợt trước. Không tự gửi RFQ tới nhà cung cấp hoặc sửa/merge nhánh Tuấn, final-website hay main.
