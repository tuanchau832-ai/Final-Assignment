# Cost price evidence manifest

Checked by: Ba Nguyen  
Check date: 19 November 2026

Update 25 November 2026: direct pages were reopened and the observed prices were logged in `../live-price-audit-2026-11-25.csv`. Browser captures were saved locally for some rows. Ba Nguyen also supplied four readable screenshots in chat and then placed the original PNG files in `Desktop/ảnh bằng chứng`. Exact byte copies of those four files are now in this folder; SHA-256 hashes matched source and destination. Filenames and file timestamps indicate the capture date, but the page images do not display a trusted clock. These are product-page screenshots, not supplier quotations or proof of VAT/shipping beyond what is visible on the page.

This manifest maps every supplier-listed item used in the Cost Analysis to its direct source and the matching row in `../cost-price-evidence.csv`. It is evidence of the price audit, not a supplier quotation. VAT and delivery treatment are recorded exactly as available from the listing.

| Evidence ID | Item / model | Direct source | Recorded price | VAT / delivery note |
| --- | --- | --- | ---: | --- |
| price-001 | Vietduino ESP32, HS2250V | https://hshop.vn/mach-phat-trien-vietduino-esp32 | 195,000 VND | VAT stated; delivery not stated |
| price-002 | DFRobot pH kit, SEN0169-V2 | https://www.dfrobot.com/product-2069.html | USD 64.90 | VAT, delivery, import and exchange fees not stated |
| price-003 | DFRobot DO sensor, SEN0680 | https://hshop.vn/cam-bien-oxy-hoa-tan-dfrobot-rs485-fluorescence-dissolved-oxygen-sensor-freshwater | 4,428,000 VND | VAT stated; delivery not stated |
| price-004 | DFRobot turbidity sensor, SEN0710 | https://www.dfrobot.com/product-3104.html | USD 229.00 | VAT, delivery, import and exchange fees not stated |
| price-005 | Waterproof DS18B20, HS2432V | https://hshop.vn/cam-bien-nhiet-do-chong-nuoc-ds18b20-waterproof-temperature-sensor | 35,000 VND | VAT stated; delivery not stated |
| price-006 | TTL to RS485 converter, HS2455V | https://hshop.vn/bo-mach-chuyen-doi-tin-hieu-ttl-sang-rs485-v1 | 35,000 VND | VAT stated; delivery not stated |
| price-007 | SIM7600G-H-M.2, HS2164V | https://hshop.vn/mach-sim7600g-h-m-2-simcom-original-4g-lte-cat-4-module-global-coverage-gnss-m-2-connector | 1,566,000 VND | VAT stated; delivery not stated |
| price-008 | Viger IP65 enclosure, PVN457 | https://vinadenki.vn/tu-dien-nhua-vo-hop-dau-noi-cap | 305,000 VND | VAT excluded; exact size not selected; excluded from subtotal |
| price-009 | Upun PG13.5 cable gland | https://daihoaphu.vn/cable-gland-upun-pg135 | 3,175 VND | Price after 8% VAT; delivery not stated |

## Before sending the handoff

| ID | Screenshot captured 25 Nov | Review status |
| --- | --- | --- |
| price-001 | `price-001-2026-11-25.png` | Clear title, SKU, price and VAT |
| price-002 | `price-002-2026-11-25-user.png` (clear); `price-002-2026-11-25.png` (older partial capture) | Clear image shows SEN0169-V2 and USD 64.90; older capture has a region popup |
| price-003 | `price-003-2026-11-25.png` | Clear title, SKU, price and VAT |
| price-004 | `price-004-2026-11-25-user.png` | Clear image shows SEN0710 and USD 229.00 |
| price-005 | `price-005-2026-11-25.png` | Clear title, SKU, price and VAT |
| price-006 | `price-006-2026-11-25.png` | Clear title, SKU, price and VAT |
| price-007 | `price-007-2026-11-25.png` | Clear title, SKU, price and VAT |
| price-008 | `price-008-2026-11-25.png` | Clear title, listed price and VAT exclusion; actual enclosure size must still be selected |
| price-009 | `price-009-price-2026-11-25-user.png`; `price-009-spec-2026-11-25-user.png` | Price image shows 2,940 VND + 235 VND VAT = 3,175 VND; specifications say D6–12 mm while price-area text says 7–12 mm. Confirm fit before purchase |

The four user-supplied images are now archived as exact copies. Source files remain on Ba Nguyen's Desktop. The DFRobot images do not establish VAT, delivery, import costs or an exchange rate. Do not treat the candidate enclosure or four-gland count as approved quantities until the layout and cable schedule are confirmed.

| Original Desktop file | Archived file | SHA-256 |
| --- | --- | --- |
| `Screenshot 2026-11-25 165243.png` | `price-002-2026-11-25-user.png` | `40AB30D9CBD19024028B121BA8C95C9DA22160518F490F4A090F7CF7B8AC2D5A` |
| `Screenshot 2026-11-25 165300.png` | `price-004-2026-11-25-user.png` | `A09EDA7E08899C3BF31C54A7B60E812AB166B05A4ACA62E1E82576E9C5E7BE91` |
| `Screenshot 2026-11-25 165326.png` | `price-009-price-2026-11-25-user.png` | `122AC594ECE05A39BD2E721EED3616E0B5A5BD26899A2EDC0989C3FC24988049` |
| `Screenshot 2026-11-25 165351.png` | `price-009-spec-2026-11-25-user.png` | `05263FF976909EE13C19434A13E5049CB3401B74B188128B6DBC91A25E014605` |


## Giá phụ kiện ứng viên và tỷ giá — 27/11/2026

Bằng chứng mới ở [thư mục phụ kiện](accessories-2026-11-27/README.md). Giá/phạm vi nằm trong [CSV ứng viên](../accessory-candidates-2026-11-27.csv); chưa thay các dòng price-001…014 hay subtotal hiện tại. Ảnh tỷ giá chứng minh hàng lịch sử 19/11, không biến giá niêm yết thành quote.
