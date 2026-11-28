# Kiểm giao diện Cost Analysis và calculator — 27/11/2026

Đã chạy **Google Chrome thực ở chế độ headless** qua Playwright, tương tác DOM, click menu/citation, thao tác range bằng Home/ArrowRight và gửi touch events để vuốt bảng. [Kết quả máy đọc](browser-qa-2026-11-27/results.json) ghi phiên bản Chrome, từng case và SHA-256 ảnh. **Kiểm ảnh phát hiện số tiền xuống dòng trên proposal Tuấn ở desktop; đã chuẩn bị và kiểm riêng bản vá bên dưới.** Mobile là giả lập viewport/touch, chưa kiểm điện thoại vật lý hoặc website đã deploy.

## Hai source được kiểm riêng

1. Nhánh Bá Nguyên: React report, base `22ef8234a135d3e146ca403aee6bd693dd333f31` cộng sửa APA local, URL `/pages/cost-analysis` trên Vite loopback 5187. Có bảng chi phí 10 cột, không có calculator của Tuấn.
2. Proposal Tuấn: bản sao tạm ngoài repo của đúng `7208280f9e2c2064ddbab716604d871988b1016d`, URL `/#implementation-cost` trên loopback 5188. Có calculator và BOM dạng danh sách, không phải bảng 10 cột. Source nhánh Tuấn/final/main không bị sửa.

## Kết quả giao diện

| Source / viewport CSS px | Toàn trang tràn ngang | Nội dung đã kiểm | Kết quả |
| --- | --- | --- | --- |
| React 320 × 812 | Không; document 320 | Menu mở/đóng sau chọn References; citation mới đi đúng anchor và focus; table region 288, scroll 1200; vuốt touch dịch 209px; kéo đến cột cuối | Đạt |
| React 390 × 844 | Không; document 390 | Region 358, scroll 1200, 10 cột; vuốt touch dịch 258px; cột cuối hiện đủ; menu và citation/reference hoạt động | Đạt |
| React 1440 × 900 | Không; document 1440 | Menu desktop; region 922, scroll 1200; cuộn hết bảng; citation đúng entry | Đạt |
| Tuấn 390 × 844 | Không; document 390 | Menu Resources → References, đóng sau chọn; range và output, giới hạn subtotal/quote pending | Đạt |
| Tuấn 1440 × 900 | Không; document 1440 | Range và output đúng; References từ footer hoạt động; số tiền bị tách dòng | Tương tác đạt; cần bản vá hiển thị |

Không ghi nhận JavaScript runtime error trong năm case. Font bảng React là 15px ở cỡ mặc định; caption và hint cuộn ngang có hiển thị. References giữ bề rộng trang, link dài xuống dòng và thụt treo 48px (=1,27cm tại 96dpi CSS). Bảng React không mất cột; ảnh calculator cho thấy lỗi tách số bên dưới. Đây không phải chứng nhận accessibility toàn site.

## Lỗi phát hiện khi xem ảnh và bản vá đã kiểm

Tại 1440px, ô kết quả trên proposal 7208280 chia ba cột nhưng mỗi cột có vùng chữ quá hẹp. `overflow-wrap:anywhere` tách **13,895,466** thành `13,895,46` rồi `6`, tương tự **41,686,398**. Rà thêm 1280px cũng phát hiện tách dòng ở bốn ô tiền. Đây là lỗi hiển thị, không phải phép cộng sai.

[Bản vá CSS](tuan-calculator-number-wrap.patch) nâng chiều rộng tối thiểu của ô từ 150 lên 240px và giữ số tiền trên một dòng. Đã `git apply --check` thành công trên snapshot đúng 7208280. Đã inject đúng hai khai báo CSS vào browser, kiểm **12/12 case đạt**: 320/390/768/1024/1280/1440px × 3 trạm/3 năm và 100 trạm/5 năm. Chữ số một dòng, không tràn ô hoặc toàn trang; số và công thức giữ nguyên. [Chi tiết trước/sau](browser-qa-2026-11-27/calculator-wrap-results.json).

- [Trước sửa ở 1440px](browser-qa-2026-11-27/tuan-calculator-baseline-1440.png)
- [Sau CSS đề xuất ở 1440px](browser-qa-2026-11-27/tuan-calculator-css-fix-1440.png)
- [Sau CSS đề xuất ở 390px](browser-qa-2026-11-27/tuan-calculator-css-fix-390.png)

Patch được lưu trên nhánh Bá Nguyên để Tuấn review/áp dụng. Không sửa file source trong snapshot hoặc nhánh Tuấn/final/main; không tuyên bố lỗi đã được sửa trên website live. Khi tích hợp lên commit khác, Tuấn cần kiểm diff rồi chạy lại build/browser.

## Calculator: thao tác trên trình duyệt ở cả 390 và 1440 px

| Trạm / năm | Thiết bị ban đầu VND | Reserve pH riêng VND | Lượt kiểm trạm | Chuyến chung | Kết quả |
| --- | ---: | --- | ---: | --- | --- |
| 1 / 1 | 13.895.466 | 1.683.506 | 2 | Route TBD | Đạt |
| 3 / 1 | 41.686.398 | 1.683.506 | 6 | 2 | Đạt |
| 3 / 3 | 41.686.398 | 1.683.506 | 18 | 6 | Đạt |
| 10 / 1 | 138.954.660 | Stock TBD | 20 | Route TBD | Đạt |

Case 3/3 hiện đúng 13.895.466 cho trạm đầu, 27.790.932 cho hai trạm còn lại và 108 SIM-tháng/36 tháng hosting trong **baseline**. Không kết luận các quantities này đúng với commissioning lệch chưa được chọn. Phần dự phòng không nhân theo năm và không cộng ngầm vào subtotal thiết bị. Các số partial không phải chi phí lắp/vận hành đầy đủ.

## Ảnh để đối chiếu

| Ảnh | Nội dung |
| --- | --- |
| [React mobile overview](browser-qa-2026-11-27/react-mobile-overview-390.png) / [desktop overview](browser-qa-2026-11-27/react-desktop-overview-1440.png) | Trang và điều hướng |
| [Bảng mobile bên trái](browser-qa-2026-11-27/react-table-left-390.png) / [cột cuối](browser-qa-2026-11-27/react-table-right-390.png) | Chứng minh vùng cuộn giữ cột |
| [Bảng desktop bên trái](browser-qa-2026-11-27/react-table-left-1440.png) / [cột cuối](browser-qa-2026-11-27/react-table-right-1440.png) | Bảng rộng trong vùng riêng |
| [References mobile](browser-qa-2026-11-27/react-references-390.png) / [desktop](browser-qa-2026-11-27/react-references-1440.png) | Metadata và thụt treo APA |
| [Calculator Tuấn mobile](browser-qa-2026-11-27/tuan-calculator-baseline-390.png) / [desktop](browser-qa-2026-11-27/tuan-calculator-baseline-1440.png) | Baseline 3/3 sau thao tác |
| [References Tuấn mobile](browser-qa-2026-11-27/tuan-references-390.png) / [desktop](browser-qa-2026-11-27/tuan-references-1440.png) | Navigation trên source proposal |

## Phần bàn giao còn mở

Tuấn cần port sửa APA/metadata, áp bản vá chữ số và đổi các link hồ sơ đang trỏ `2a3fb2be` sang bản đã review có một reserve chung. Calculator hiện đúng phép tính baseline, nhưng chưa thể chốt kỳ hosting/SIM/route theo triển khai lệch, lịch hiệu chuẩn thêm hoặc quote dịch vụ. Cần nhóm quyết định trước khi thay logic.

Lần chạy đầu của harness có locator phụ thuộc tên nút thay đổi và đọc URL trước khi React hoàn tất chuyển trang; đã sửa harness chờ navigation/focus rồi chạy lại cả năm case. Touch được kiểm lại bằng chuỗi touchStart/touchMove/touchEnd. Không gọi lỗi harness là lỗi website hoặc sửa ứng dụng để làm test pass.
