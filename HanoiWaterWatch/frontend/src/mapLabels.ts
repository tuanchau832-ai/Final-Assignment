import { useTranslation } from 'react-i18next';

const labels = {
  tools: ['Map tools', 'Công cụ bản đồ'], backTools: ['Back to map tools', 'Trở về công cụ bản đồ'],
  zoomIn: ['Zoom in', 'Phóng to'], zoomOut: ['Zoom out', 'Thu nhỏ'],
  title: ['Station map', 'Bản đồ trạm'], search: ['Search stations or rivers', 'Tìm trạm hoặc sông'],
  list: ['Station list', 'Danh sách trạm'], layers: ['Layers', 'Lớp bản đồ'], legend: ['Legend', 'Chú giải'],
  streets: ['Street map', 'Bản đồ đường phố'], markers: ['Station markers', 'Điểm trạm'],
  counts: ['Open alert counts', 'Số cảnh báo đang mở'], fit: ['Fit stations', 'Hiện tất cả trạm'],
  details: ['Station details', 'Chi tiết trạm'], expand: ['Expand details', 'Mở rộng chi tiết'],
  collapse: ['Collapse details', 'Thu gọn chi tiết'], preview: ['Preview details', 'Xem nhanh'],
  close: ['Close station details', 'Đóng chi tiết trạm'], river: ['River', 'Sông'],
  latest: ['Latest simulated readings', 'Số liệu mô phỏng mới nhất'],
  trend: ['Last 15 minutes', '15 phút gần nhất'], active: ['Active alerts', 'Cảnh báo hiện tại'],
  show: ['Show on map', 'Hiện trên bản đồ'], locations: ['Illustrative locations', 'Vị trí minh họa'],
  offline: ['Street tiles unavailable. Station coordinates remain visible.', 'Bản đồ đường phố không khả dụng. Vẫn hiển thị tọa độ trạm.'],
  retry: ['Retry', 'Thử lại'], grid: ['Coordinate grid', 'Lưới tọa độ'], updated: ['Latest frame', 'Khung mới nhất'],
  matching: ['stations shown', 'trạm hiển thị'], noMatch: ['No stations match these filters.', 'Không có trạm phù hợp.'],
  noStations: ['No stations registered.', 'Chưa đăng ký trạm.'], review: ['View station alerts', 'Xem cảnh báo của trạm'],
  missing: ['Station not found.', 'Không tìm thấy trạm.'], reset: ['Reset filters', 'Đặt lại bộ lọc'],
  selected: ['Selected station', 'Trạm đã chọn'], coords: ['Coordinates', 'Tọa độ'],
  zoom: ['Zoom to stations', 'Phóng to các trạm'], minimize: ['Minimize details', 'Thu nhỏ chi tiết'],
  stationMap: ['Hanoi station map', 'Bản đồ trạm Hà Nội'], closeTools: ['Close map tools', 'Đóng công cụ'],
  quant: ['Parameter', 'Thông số'], info: ['Information', 'Thông tin'], warning: ['Warning', 'Cảnh báo'],
  critical: ['Critical', 'Nghiêm trọng'], latestSamples: ['Recent samples', 'Mẫu gần đây'],
  stale: ['Connection interrupted. Last known frames are historical.', 'Mất kết nối. Thời điểm khung gần nhất là dữ liệu lịch sử.']
} as const;
export function useMapLabel() {
  const { i18n } = useTranslation();
  return (key: keyof typeof labels) => labels[key][i18n.language.startsWith('vi') ? 1 : 0];
}
