# Tích hợp chi phí Q190 — gói phát hành 28/11/2026

[Số liệu hiện hành và phạm vi](../../publication-handoff-2026-11-28.md). Gói này thay bản vá Q190 ba file trước đây: đã thêm sửa số ở Home, bảng phụ kiện tham chiếu và chín nguồn mới.

## Chọn đúng patch

| Source đích | Base đã kiểm | Patch |
| --- | --- | --- |
| Nhánh tích hợp Tuấn | ea4cce0ab3e1c520e074b48ae703d3dfe69570fb | [tuan-ea4cce0a.patch](tuan-ea4cce0a.patch) |
| final-website | ee0502ca3c487f20a4a564ec8863f9a58697006a | [final-ee0502ca.patch](final-ee0502ca.patch) |

**Chỉ chọn một patch khớp base, không áp cả hai.** Hai patch có cùng đầu ra của bốn file, nhưng context nguồn khác nhau. [Manifest](manifest.json) ghi base và hash patch/bốn file trước–sau. [Bốn file nguồn](source/website/src/content/) giúp đọc trực tiếp. Artifact dùng LF; lệnh git -c core.autocrlf=false apply --check đã kiểm trên bản sao bytes lấy từ Git. Checkout Windows có thể dùng CRLF, nên khi đối chiếu nội dung cần lưu ý line endings.

Không áp patch vào kiến trúc React trên nhánh Bá Nguyên. Source nhánh Bá Nguyên đã được sửa trực tiếp trong website/src/content/sections/07-implementation.ts, 08-cost-analysis.ts và References tương ứng.

## Những gì đã sửa

- data.ts: thay ESP32 + modem rời bằng Q190 1.798.680 VND; bộ tính từ BUILD tự suy ra 13.933.146 / 27.866.292 / 1.683.506 / 43.482.944.
- home.html: thay “41,7 triệu” bằng đúng 41.799.438 cho ba trạm, tách 43.482.944 khi có một reserve.
- implementation.html: fallback khớp bộ tính, 16 checks trong ví dụ 0/6/6, 96 SIM-tháng/99 chu kỳ 30 ngày/36 hosting, bảng phụ kiện và tổng kịch bản 57.466.944/70.398.864 có exclusions.
- references.html: nguồn Q190, Viettel, Render và chín nguồn phụ kiện đã dùng trong nội dung.

DFRobot trong source chung vẫn có ba entry n.d.-a/b/c; source Bá Nguyên có thêm FIT0348 nên là n.d.-a/b/c/d. Không copy suffix từ tập References khác vào một câu trích dẫn. Các entry Đông Bắc mới dùng a/b theo title 4.01/7.01.

## Kiểm tra và giới hạn

Cả hai patch đã dry-apply đúng base và khớp hash đầu ra bốn file. Bản sao source Tuấn + patch và bản sao đúng final-website + patch đã build riêng. [Browser results](browser-results.json) ghi kiểm Home, rollout/cost cards, phép tính BOM, References và bảng cuộn ở các viewport; ảnh có SHA-256. Đây là kiểm bản sao sau tích hợp, chưa là bằng chứng nhánh final/live đã nhận patch.

Remote final-website và nhánh Tuấn được giữ nguyên. Sau khi bên được phép tích hợp thực sự áp vào website chung, cần kiểm lại build và bản deploy ở đúng commit mới. Không thể ghi việc đó đã xong chỉ vì patch được push lên nhánh Bá Nguyên. Gói này không giao thêm vai giá/nghiệm thu/vận hành/payer cho người khác.
