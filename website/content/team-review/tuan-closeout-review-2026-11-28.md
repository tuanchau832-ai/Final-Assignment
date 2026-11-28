# Bá Nguyên rà bản website mới và phản hồi Tuấn — 28/11/2026

Đây là **báo cáo review và bàn giao phần chi phí**, không phải trang Rollout plan. Rollout thực tế của giao diện mới nằm trong `website/src/content/pages/implementation.html`, section `#implementation-plan`. [Plan việc Bá Nguyên](../ba-nguyen-next-steps-2026-11-28.md) và [chỉ mục](../ba-nguyen-current-handoff.md) chỉ dẫn các file hiện hành.

## Nguồn đã đọc

- Toàn bộ 18 mục timeline PR #3, gồm comment, review và inline comment do API tổng hợp; có một comment mới sau 0aa14906: [Tuấn 7232184967](https://github.com/tuanchau832-ai/Final-Assignment/pull/3#issuecomment-7232184967). [Bản lưu nguyên nội dung](tuan-response-2026-11-28.json).
- `final-website@ee0502ca3c487f20a4a564ec8863f9a58697006a`: tái cấu trúc source 69 file; đọc README/overview, các file trang, dữ liệu giá, styles và script liên quan cost/rollout/References. Nhánh cá nhân vẫn 0aa14906, không chứa việc tái cấu trúc chỉ vì các remote refs đã được fetch/pull.
- `feature/tuan-pilot-closeout@687557b1f2b50ed5ab416713706bd4221b883c2d`: đọc toàn bộ diff bốn file so ee0502ca, hồ sơ trạm đầu và test simulator. Commit này là proposal trên nhánh Tuấn, chưa có trong final-website.
- Mở lại nguồn hãng ngày 28/11: [pH](https://wiki.dfrobot.com/sen0169-v2/docs/24420), [SEN0710](https://www.dfrobot.com/product-3104.html), [DO](https://wiki.dfrobot.com/sen0680/docs/21672), [LILYGO packing variants](https://lilygo.cc/en-us/products/t-sim7600). Không thay ngày kiểm giá cũ hoặc cộng giá mới vào BOM.

## Đối chiếu phản hồi và việc xử lý

| Mục Tuấn đề nghị | Kết quả rà | Việc Bá Nguyên thực hiện |
| --- | --- | --- |
| HORIZON | Cách hiểu kỳ chung 36 tháng và ví dụ 0/6/6 đúng: 96 SIM-tháng / 36 hosting / 16 kiểm / 6 đợt | Tính độc lập từng trạm/từng năm, cập nhật source Implementation và Cost Analysis trên nhánh mình, worksheet/RFQ. Ngày thực tế vẫn TBD |
| CALIBRATION | Monthly pH và 90 ngày SEN0710 có căn cứ hãng; không phải mọi công/chuẩn đã có trong testing | Lập 150 dòng việc có ngày minh họa: 3 commissioning + 96 pH + 32 độ đục + 16 testing + 3 closeout. Tách loại việc để không cộng các hàng như 150 chuyến |
| ACCEPTANCE | Report rule nội bộ, hoãn TDS, giữ DS18B20 là đề xuất có thể đưa vào phạm vi hỏi giá | Ghi đúng proposal trong website/RFQ; không tự duyệt ngưỡng, mô hình nguồn, người ký hoặc kết quả thực địa |
| RFQ | A/B cùng sensor scope, staged 1 + 2 và reserve chung khớp phần chi phí | Điền variant B T-SIM7600G-H R2 CH9102, phân biệt module/carrier/full-kit, commissioning/calibration/testing và chi phí chung. Tất cả dịch vụ chưa giá vẫn trống/chờ báo giá |
| Chi phí | 13.895.466 + 27.790.932 = 41.686.398; cộng reserve 1.683.506 = **43.369.904 VND** | Giữ số lịch sử, không gọi là tổng giao/lắp/vận hành đầy đủ, không tự áp giá tier3+ cho giao 1 rồi 2 |
| Hiển thị | Bản mới dùng bốn thẻ tĩnh, không còn calculator 7208280 | Thử bảy viewport trước/sau. Không thấy tách chữ số hoặc tràn ngang; không cần patch CSS calculator cũ |

### Hiệu chuẩn: điều kiện để dùng số lượng

Lịch ngày lấy **01/01/2027 chỉ làm ví dụ tính toán**, trạm 2/3 bắt đầu sáu tháng sau và đóng cùng kỳ. Không có ngày triển khai nào đã được xác nhận. Mỗi model có một dòng việc theo trạm, bao gồm việc cuối kỳ để nhà cung cấp xác nhận scope; commissioning ba trạm nằm riêng.

| Việc trong ví dụ | Năm 1 | Năm 2 | Năm 3 | Tổng | Quan hệ với testing |
| --- | ---: | ---: | ---: | ---: | --- |
| pH monthly | 24 | 36 | 36 | 96 | 16 việc có thể gộp nếu quote bao full calibration; 80 ngoài testing |
| SEN0710 mỗi 90 ngày | 8 | 12 | 12 | 32 | Không trùng đúng ngày testing trong lịch độc lập này; có thể gộp sớm và phải tính lại deadline |
| Testing trạm | 4 | 6 | 6 | 16 | Nằm trong 6 đợt tuyến, không tính thêm 16 đơn giá chuyến |

Ví dụ ST-01 có hạn độ đục 01/04/2027 rồi **30/06/2027**. Đợi đến 01/07 chỉ vì đó là mốc sáu tháng sẽ vượt hạn một ngày. Không coi mỗi quý = 90 ngày. Nếu người vận hành làm sớm để gộp tuyến pH/testing, hạn 90 ngày tiếp theo tính từ ngày đã làm và tổng việc có thể thay đổi. Không dùng 32 làm con số cố định cho mọi lịch commissioning hoặc phương án gộp.

Số 16 việc pH trùng testing **không tự chứng minh đã trả tiền**: “calibration check” không tự bao gồm full two-point calibration/chuẩn/công. Nhà cung cấp phải xác nhận phần gồm rồi mới trừ. Số chuyến phụ thuộc lịch thực, gộp sớm và người vận hành tại chỗ, chưa có số chốt.

Ở đóng kỳ có ba review trong chuyến cuối; với 0/6/6, tuổi là 36/30/30. Không gọi cả ba là age36 reviews, không thêm chuyến thứ bảy hoặc phí review trùng. Phụ tùng/công thay và lỗi sớm vẫn báo riêng.

## Thay đổi trực tiếp vào website

| Source | Đã sửa ở đâu | Trạng thái |
| --- | --- | --- |
| `src/content/sections/07-implementation.ts` | Website trên nhánh Bá Nguyên: bảng theo năm và link Cost Analysis, phân biệt tuổi/đóng kỳ | Đã sửa, build và browser đạt |
| `src/content/sections/08-cost-analysis.ts` | Website trên nhánh Bá Nguyên: 96/36/16/6, dòng hiệu chuẩn, review và TDS đề xuất | Đã sửa, build và browser đạt |
| `src/content/references.ts` | Kế hoạch Tuấn trỏ đúng 687557b1, ngày 28/11 | Đã sửa, citation/reference khớp |
| `src/content/pages/implementation.html` trên kiến trúc mới | Làm rõ tuổi đóng kỳ, việc calibration/90 ngày và phần gộp; cập nhật link kế hoạch | Thực hiện trên bản sao đúng 687557b1; [patch hai file](tuan-closeout-followup-2026-11-28.patch) lưu trên nhánh Bá Nguyên để Tuấn port |
| `src/content/pages/references.html` trên kiến trúc mới | Thêm APA của kế hoạch tương ứng citation Chau và URL 687557b1 | Cùng patch, không sửa branch Tuấn/final/main |

Patch chỉ có hai file nội dung, không đổi CSS, số tiền, simulator hoặc cơ chế hosting. [SHA256 trước/sau](closeout-2026-11-28/patch-manifest.json). `git apply --check` đạt với bản sao nguyên gốc đúng 687557b1. Bản sao đã sửa có thể chạy bằng Vite; không gọi đó là final đã tích hợp hoặc website online đã cập nhật.

## Kiểm chứng thực tế

| Check | Kết quả |
| --- | --- |
| Link/build website nhánh Bá Nguyên | 12 routes đạt; TypeScript/Vite build đạt |
| Test tính lượng | `node tests/check-pilot-service-basis.mjs` đạt: cùng bắt đầu/mua lệch, phân bổ năm, tuổi vs closeout, leap month, ngày không hợp lệ và hạn 90 ngày |
| Build proposal sau patch | TypeScript/Vite 44 modules đạt; 13 ca simulator đạt |
| Thẻ tiền trên proposal | 320/390/768/980/1024/1280/1440 px: cả bốn giá đúng, không tràn ô/toàn trang, không có lỗi JS runtime |
| Điều hướng thực | Menu → Implementation → Cost; Resources → References; tìm Chau và URL đúng commit: đạt 390 và 1440 px; mobile menu đóng sau chọn |
| Website nhánh Bá Nguyên | 320/390/1440 px: Implementation → Cost hoạt động; bảng 10 cột cuộn tới cột cuối, toàn trang không tràn ngang |
| Word count của app mới | Bộ đếm app: khoảng 2.684 trước, 2.749 sau patch. Đây là số xấp xỉ theo thuật toán hiện có, chưa là word count chính thức theo template; Tuấn rà chung |
| Giới hạn | Chrome headless, mobile giả lập; không là điện thoại vật lý, hardware test, deploy, quote hoặc signed acceptance |

Kết quả máy đọc: [before](closeout-2026-11-28/before-browser-results.json), [after](closeout-2026-11-28/after-browser-results.json), [điều hướng](closeout-2026-11-28/navigation-results.json). Ảnh: [390 px](closeout-2026-11-28/after-cost-cards-390.png), [1440 px](closeout-2026-11-28/after-cost-cards-1440.png), [References](closeout-2026-11-28/after-references-390.png), [bảng nhánh Bá Nguyên](closeout-2026-11-28/assigned-cost-390.png). SHA256 của từng ảnh nằm trong các JSON tương ứng.

## Trả lời Tuấn và bước kế tiếp

Bá Nguyên đã có thể xác nhận phép tính và scope để hỏi giá, chưa thể duyệt ngân sách đầy đủ. Tin nhắn và bảng chờ nằm ở [plan](../ba-nguyen-next-steps-2026-11-28.md#việc-còn-chờ-và-tin-nhắn-có-thể-gửi). Bá Nguyên đã cho phép commit/push gói này và thông báo cho ba bạn trên PR #3. [Gói RFQ](../supplier-rfq-package-2026-11-28.md) đã chuẩn bị; chưa gửi nhà cung cấp vì bên nhận/kênh liên hệ chưa được cung cấp. Nhánh Tuấn/final/main vẫn không bị sửa.

Có thể sửa source website và kiểm ngay qua local preview. Chỉnh trên trình duyệt bằng DevTools chỉ thay bản đang xem; để mọi người thấy trên URL online, source phải được tích hợp và deploy từ đúng nhánh. Người dùng yêu cầu dùng source đã pull; không có URL deploy được xác nhận, nên kết quả lượt này chỉ xác nhận source và preview local.
