import { useTranslation } from 'react-i18next';
import type { Station } from './types';

export default function StationLifecycle({ lifecycle }: { lifecycle?: Station['lifecycle'] }) {
  const { i18n } = useTranslation();
  if (!lifecycle || lifecycle === 'active') return null;
  const vi = i18n.language.startsWith('vi');
  return <span className="badge amber">{lifecycle === 'maintenance'
    ? (vi ? 'Bảo trì' : 'Maintenance') : (vi ? 'Đã lưu trữ' : 'Archived')}</span>;
}
