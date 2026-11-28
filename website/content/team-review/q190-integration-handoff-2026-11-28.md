# Cập nhật chi phí Q190 cho bản tích hợp — gói local 28/11/2026

> **SUPERSEDED:** Dùng [gói submission closeout](submission-closeout-2026-11-28/README.md) cho số hiện hành và patch đã rút gọn. Các patch/số partial phía dưới chỉ lưu lịch sử.


> **ĐÃ ĐƯỢC THAY THẾ cho bàn giao mới:** [Gói bốn file](cost-release-2026-11-28/README.md) bổ sung Home, nguồn phụ kiện và hai patch theo base. Giữ gói ba file dưới đây làm lịch sử; không áp thêm sau patch mới.


Người dùng đã giao quyền so sánh và chọn controller cho **cơ sở dự toán**. [Kết luận: chọn B/Q190](../controller-decision-2026-11-28.md), chưa là đơn mua/field acceptance. Source nhánh Bá Nguyên đã dùng số mới; nhánh Tuấn/final/live chưa được sửa hoặc nhận đã cập nhật.

| Số trên source Tuấn ea4cce0a | Số mới của Bá Nguyên | Lý do |
| --- | --- | --- |
| 13.895.466 VND/trạm | **13.933.146 VND/trạm** | Thay ESP32 195.000 + module 1.566.000 bằng Q190: 69,34 USD × giả định 25.940 = 1.798.680 VND, làm tròn đơn giá |
| 27.790.932 cho hai trạm sau | **27.866.292** | Hai lần đơn giá B |
| 1.683.506 reserve | **Giữ 1.683.506 một lần** | Một kit chung tùy chọn |
| 43.369.904 partial | **43.482.944 partial** | Ba trạm B + một kit; vẫn chưa gồm quote-required scope |
| Dòng carrier/modem/antennas chưa giá | Không cộng modem/carrier riêng; báo phần outdoor/diversity nếu cần | Q190 package đã có board/modem, SIM/GPS antennas, cáp và headers; không có full power/media/site solution |
| 18 baseline checks trên card | **16 trong ví dụ 0/6/6**; 18 ghi rõ simultaneous comparison | Không đổi lịch kiểm sáu tháng; chỉ làm rõ scope của con số |

96 SIM-tháng, 36 hosting, 16 testing/6 đợt, pH 96 với 80–96 báo riêng và 32 turbidity tasks vẫn giữ. **99 chu kỳ 30 ngày** là ứng viên billing Viettel trên ví dụ ngày, không thay 96 tháng lịch thành 99 tháng hoặc tự chọn SIM plan. Render 13 USD/system-month là compute-only trước workspace/storage/usage/broker/support/tax. Không chứng minh Q190 tiết kiệm OPEX hơn các controller khác.

## Patch ba file đã chuẩn bị

[Patch](q190-cost-update-for-tuan-2026-11-28.patch), [base commit và hash trước/sau](q190-integration-manifest-2026-11-28.json). Chỉ phù hợp source **ea4cce0ab3e1c520e074b48ae703d3dfe69570fb** hoặc source đã được đối chiếu, không áp thẳng vào kiến trúc React của nhánh Bá Nguyên.

- `website/src/content/data.ts`: chỉ sửa khối BUILD và ghi chú giá, thay hai dòng controller/modem bằng Q190. Không thay matrix, scores, bios hoặc mô phỏng.
- `website/src/content/pages/implementation.html`: số fallback, scope antenna, 16 checks minh họa và hai service candidates. Link rollup A cũ được ghi rõ historical.
- `website/src/content/pages/references.html`: thêm LILYGO, Render, Viettel dùng trong nội dung patch; các suffix DFRobot cũ giữ vì patch này không thêm entry FIT0348. Audit/source chính Bá Nguyên có thêm FIT0348 nên suffix của hai source cần được biên tập theo đúng tập references được port.

`git apply --check` đạt trên bản sao đúng base. Candidate riêng build đạt; [browser JSON](completion-2026-11-28/browser-results.json) ghi bốn viewport của candidate, bốn thẻ tiền, bảy BOM lines, ba References mới và hai ảnh. Bản nguồn base được giữ nguyên. Không commit/push/merge, không sửa hoặc chuyển nhánh Tuấn/final/main; không gửi comment/tin trong lượt này.

Đây là nội dung sẵn để biên tập/tích hợp sau khi được phép xuất bản. Không giao thêm vai khảo sát, nghiệm thu, vận hành hoặc payer cho Tuấn, Đạt hoặc Akai.
