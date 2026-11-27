# Checklist testing và hồ sơ sự cố — bản chuẩn bị 27/11/2026

Nguồn scope: [Đạt trả lời D5](https://github.com/tuanchau832-ai/Final-Assignment/pull/3#issuecomment-7202126238). Đây là **mẫu chuẩn bị**, chưa là quy trình được nghiệm thu, dữ liệu field hoặc chứng cứ phần mềm đã phát hiện drift. [Lịch CSV](maintenance-schedule-2026-11-27.csv) ghi tháng tương đối từ mốc bắt đầu vận hành cần nhóm chốt, không chứa ngày thực hiện giả.

Các mã `ST-01/ST-02/ST-03` trong lịch chỉ là placeholder của ba trạm dự kiến, không phải site hoặc thiết bị field đã xác minh. Khi nhóm chốt registry và vị trí, thay mã và ngày bắt đầu trước khi dùng để giao việc.

**Sau phản hồi Tuấn:** [review/plan](tuan-response-plan-2026-11-27.md) nhận các mục tiêu sai lệch **3 NTU quanh 57 NTU**, **0,30 mg/L quanh 4,00 mg/L** và độ không chắc chắn **<0,10 mg/L** nếu dùng rule DO 4,00/4,20 như **đề xuất cần Đạt/Akai duyệt**, không là thông số bảo đảm hoặc field test đã đạt. [Nguồn hãng đã kiểm](sensor-source-checks-2026-11-27.csv) cho bound ±50 NTU và ±0,6 mg/L theo toàn thang; cần máy tham chiếu và protocol trước đặt hai trạm sau. Sáu chuyến/18 checks trong lịch là baseline; [commissioning lệch](commissioning-cost-basis-2026-11-27.csv) và hiệu chuẩn model có thể làm phát sinh công việc.

## 1. Thông tin một lượt kiểm tra

Điền: `route_id`, `station_id`, site/quyền tiếp cận, ngày commissioning, thời điểm đến/rời, người thực hiện, người review, version BOM/firmware, baseline lần trước, số datasheet/quote/procedure, thiết bị chuẩn và hạn hiệu chuẩn, URL thư mục lưu hồ sơ. Các ô chưa có dữ liệu giữ `TBD`.

## 2. Checklist scope theo phản hồi Đạt

| ID | Nhóm kiểm | Cách ghi nhận cần chuẩn bị | Ngưỡng số / source trước khi test | Actual / kết quả |
| --- | --- | --- | --- | --- |
| QA-PH | pH | Model, chuẩn tham chiếu, raw/reference readings, sai lệch, range, response time và khả năng hiệu chuẩn | **TBD**: đúng datasheet + yêu cầu dự án; ghi đơn vị/pH, giới hạn, test condition và số mẫu | Chưa thực hiện |
| QA-DO | DO | Như trên, ghi công nghệ probe và vật tư/màng đúng model | **TBD**: accuracy/range/response và lịch hiệu chuẩn/consumables | Chưa thực hiện |
| QA-TURB | Turbidity | Đúng range/đơn vị, chuẩn/reference và before/after clean | **TBD**: SKU, test method và giới hạn theo datasheet | Chưa thực hiện |
| QA-TEMP | Temperature | Đối chiếu thiết bị tham chiếu, lỗi và response time | **TBD**: model/cáp, accuracy/range/response theo datasheet | Chưa thực hiện |
| QA-BOARD | Board/giao tiếp cảm biến | Đọc đủ kênh, lỗi bus, mất/kết nối lại; LILYGO hay board rời theo BOM cuối | **TBD**: SKU/revision, test duration, tiêu chí thiếu dữ liệu | Chưa thực hiện |
| QA-4G-TIME | 4G/time/data | Timestamp gửi/nhận, log bản tin, mất/gửi lại, độ ổn định | **TBD**: tỷ lệ nhận/độ trễ/clock tolerance và thời gian chạy thử do nhóm chốt | Chưa thực hiện |
| QA-ALERT | Cảnh báo thử | Case đầu vào, event_id, người nhận và timestamps qua chuỗi xử lý | **TBD**: rule/latency/recipient; lưu case tương ứng giữa trạm và ứng dụng | Chưa thực hiện |
| QA-POWER | Solar/pin | Công suất/điện áp/dòng, capacity và tải/ngày; khả năng đáp ứng/autonomy | **TBD**: sơ đồ, W/Wh/Ah, test condition và giới hạn theo model; không mặc định 20 W đủ | Chưa thực hiện |
| QA-HOUSING | Hộp/cáp/đầu nối/gá | Hình before/after, dấu nước/ăn mòn, độ bền và kết nối | **TBD**: IP/model, phương pháp kiểm phù hợp và tiêu chí; không tự thực hiện thử phá hủy | Chưa thực hiện |
| QA-CLEAN-CAL | Vệ sinh/kiểm tra hiệu chuẩn gộp | Vật tư, chuẩn dùng, readings trước/sau, kết luận cần hiệu chuẩn lại hay thay | **TBD**: tần suất model-specific vẫn phải xác nhận; phần phát sinh ngoài gói có phê duyệt/quote | Chưa thực hiện |
| QA-Y3 | Review năm 3 gộp tháng 36 | Phần mòn/ăn mòn, mã linh kiện, ảnh, lý do giữ/thay, đề nghị công/vật tư | **TBD**: hướng dẫn nhà sản xuất; không có danh sách bắt buộc thay đã được chốt | Chưa thực hiện |

Không đánh `Pass` khi chưa có threshold/test evidence. Người có thẩm quyền phải chốt threshold bằng số và ký review trước khi dùng checklist như acceptance gate. Đạt xác nhận scope, chưa cung cấp những ngưỡng này; không dùng thông số của một candidate SKU cho model cuối khác.

## 3. Gộp scope và cách thanh toán

- Mỗi đợt testing có một chuyến chung cả ba trạm theo đề xuất Đạt; lưu ba biên bản trạm cùng `route_id` và một bảng công/travel. Hai chuyến/năm, sáu chuyến/ba năm; có 18 biên bản kiểm trạm.
- Vệ sinh/kiểm tra hiệu chuẩn nằm trong scope chuyến testing. Review năm 3 gộp chuyến tháng 36, không tạo thêm chuyến hoặc phí review đã bao gồm. Dung dịch, vật tư, phụ tùng/công thay và thu gom phải nêu khoản đã trong giá gói và khoản báo riêng.
- Giữa kỳ: chỉ lập yêu cầu khi có dấu drift/số đo bất thường/nghi bám bẩn hoặc sự cố; tần suất, ngưỡng trigger và khả năng phần mềm phải được xác nhận. Đạt loại lịch 24/26 lượt và 12 hiệu chuẩn khỏi basis mới. Nếu datasheet yêu cầu công việc thêm, ghi bổ sung và xin scope/giá trước khi khóa kế hoạch.

Nguồn hãng đã kiểm ngày 27/11: SEN0710 khuyến nghị hiệu chuẩn mỗi 90 ngày; hướng dẫn pH SEN0169-V2 nêu mức lý tưởng tháng. Đạt/Akai cần lập lịch phù hợp model và site, phân biệt calibration theo lịch với vệ sinh do drift. Không dùng việc simulator đạt để bỏ qua những công việc này. Phương án một pH kit chung vẫn cần storage/transport/replenishment và người chịu trách nhiệm, không tự bảo đảm sửa xong trong 48 giờ.

## 4. Mẫu log sự cố và yêu cầu khắc phục 48 giờ

| Trường cần lưu | Nội dung |
| --- | --- |
| Incident ID / station / route | Mã sự cố, trạm/site, link log và bản kiểm gần nhất |
| Trigger | Drift/nghi fouling/mưa lũ/lỗi phần cứng/mất liên lạc; nguồn và rule/version nếu có |
| Received at | Thời điểm nhóm vận hành **tiếp nhận** lỗi, có múi giờ và người nhận; mốc phát hiện lưu riêng |
| Repair due at | Received at + **48 giờ** theo yêu cầu Đạt; dùng cùng basis múi giờ |
| Owner / backup / escalation | Tên, đầu mối và nguồn lực còn **TBD**; ghi người xử lý khi được giao |
| Action / evidence | Kiểm từ xa/đến site, readings trước/sau, cảnh báo thử, phụ tùng DO/pH và ảnh/log |
| Restored at / elapsed | Giờ phục hồi, số giờ từ Received at, tình trạng đạt/quá hạn và nguyên nhân |
| Cost / payer approval | Labour/travel/parts/calibration/collection, đã gồm trong gói hay phát sinh; quote/approval; không tính lại reserve đã mua |
| Closure / review | Người xác nhận hoạt động trở lại và link biên bản; chưa có field data thì để trống |

48 giờ là yêu cầu kế hoạch Đạt đặt ra, **chưa là SLA nhà cung cấp đã ký hoặc khả năng thực tế đã kiểm chứng**. Đạt/Tuấn cần chốt operator, phụ tùng, trực/phản ứng và thỏa thuận chi trả trước triển khai. Câu “phải cam kết từ đầu” không được ghi thành “đã có cam kết”.
