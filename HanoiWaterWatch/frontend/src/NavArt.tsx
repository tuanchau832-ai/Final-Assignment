/* Small illustrated tiles for the main destinations, in the platform's colours, so each page can be
   recognised at a glance: the river map, the network overview, the station, the readings, the alert
   on a phone and the ESP32 simulator. */
import type { ReactNode } from 'react';

const Tile = ({ id, children }: { id: string; children: ReactNode }) => (
  <svg className={'nav-art art-' + id} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id={'bg-' + id} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#16365a" /><stop offset="1" stopColor="#0b2036" /></linearGradient>
      <linearGradient id={'w-' + id} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#38bdf8" /><stop offset="1" stopColor="#0574a4" /></linearGradient>
    </defs>
    <rect x="1" y="1" width="38" height="38" rx="10" fill={`url(#bg-${id})`} />
    {children}
  </svg>
);

export default function NavArt({ kind }: { kind: string }) {
  switch (kind) {
    case 'mapHome': return <Tile id="mp">
      <path d="M7 12 L15 9.5 L25 12 L33 9.5 V30 L25 32.5 L15 30 L7 32.5 Z" fill="#1d3f60" />
      <path d="M15 9.5 V30 L7 32.5 V12 Z" fill="#244b70" /><path d="M25 12 V32.5 L33 30 V9.5 Z" fill="#244b70" />
      <path d="M7 26 C12 24 14 28 19 26.5 C24 25 27 21 33 22" fill="none" stroke="url(#w-mp)" strokeWidth="2.6" strokeLinecap="round" />
      <ellipse className="art-ring" cx="20" cy="22.5" rx="3.2" ry="1.2" fill="none" stroke="#8cc152" strokeWidth="1" />
      <g className="art-pin"><path d="M20 22.5 C16.5 18 15 15.8 15 13.4 A5 5 0 0 1 25 13.4 C25 15.8 23.5 18 20 22.5 Z" fill="#8cc152" stroke="#0b2036" strokeWidth=".8" /><circle cx="20" cy="13.4" r="1.9" fill="#0b2036" /></g>
    </Tile>;
    case 'overview': return <Tile id="ov">
      <rect x="8" y="9" width="11" height="10" rx="2.5" fill="#8cc152" /><rect x="21" y="9" width="11" height="10" rx="2.5" fill="#38bdf8" />
      <rect x="8" y="21" width="11" height="10" rx="2.5" fill="#f2a541" /><rect className="art-blink" x="21" y="21" width="11" height="10" rx="2.5" fill="#ff6b57" />
      <path d="M10.5 15 L12.5 17 L16.5 12.5" fill="none" stroke="#0b2036" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </Tile>;
    case 'model': return <Tile id="md">
      <path className="art-wave" d="M3 31 C7 29 10 33 14 31 S21 29 25 31 S32 33 37 31 L37 37 L3 37 Z" fill="url(#w-md)" opacity=".85" />
      <rect x="19" y="13" width="2.4" height="19" rx="1" fill="#9fb6c9" />
      <path d="M12 9.5 L26 7 L28.5 12 L14.5 14.5 Z" fill="#1d6fa5" stroke="#7cc0e8" strokeWidth=".9" />
      <rect x="16.5" y="18" width="7.5" height="6" rx="1.4" fill="#22476a" stroke="#38bdf8" strokeWidth=".9" />
      <circle className="art-blink" cx="20.2" cy="21" r="1.2" fill="#8cc152" />
    </Tile>;
    case 'dashboard': return <Tile id="db">
      <path d="M7 16 H33" stroke="#ff6b57" strokeWidth=".9" strokeDasharray="2 2" opacity=".8" />
      <path d="M7 30 L12 27 L16 28 L20 22 L24 12 L28 21 L33 18 L33 32 L7 32 Z" fill="#38bdf8" opacity=".2" />
      <path className="art-line" d="M7 30 L12 27 L16 28 L20 22 L24 12 L28 21 L33 18" fill="none" stroke="#7cc0e8" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" pathLength="1" />
      <circle className="art-blink" cx="24" cy="12" r="2.3" fill="#ff6b57" />
    </Tile>;
    case 'alerts': return <Tile id="al">
      <path className="art-blink" d="M28.5 12.5 A7 7 0 0 1 28.5 22.5" fill="none" stroke="#ff8a75" strokeWidth="1.6" strokeLinecap="round" />
      <g className="art-shake">
        <rect x="11" y="7" width="14" height="26" rx="3.4" fill="#0a1828" stroke="#7cc0e8" strokeWidth="1.2" />
        <rect x="13.2" y="10.5" width="9.6" height="17" rx="1.6" fill="#ff6b57" />
        <rect x="17" y="13" width="2" height="8" rx="1" fill="#fff" /><circle cx="18" cy="24" r="1.2" fill="#fff" />
      </g>
    </Tile>;
    case 'simulation': return <Tile id="sm">
      <rect x="6" y="8" width="28" height="24" rx="3" fill="#1d5a3a" stroke="#8cc152" strokeWidth=".9" />
      <rect x="9" y="11" width="7" height="5" rx="1" fill="#0b2036" stroke="#a7d47a" strokeWidth=".6" />
      {[0, 1, 2].map(i => <g key={i}>
        <path d={`M${21 + i * 4.5} 12 V29`} stroke="#0b2036" strokeWidth="2.4" strokeLinecap="round" />
        <rect className={'art-knob k' + i} x={19.6 + i * 4.5} y={[22, 15, 19][i]} width="3.4" height="3.2" rx="1" fill={['#7cc0e8', '#f2a541', '#c8f169'][i]} />
      </g>)}
      <path d="M9 21 H15 M9 24.5 H14 M9 28 H15" stroke="#a7d47a" strokeWidth=".8" opacity=".7" />
    </Tile>;
    default: return null;
  }
}
