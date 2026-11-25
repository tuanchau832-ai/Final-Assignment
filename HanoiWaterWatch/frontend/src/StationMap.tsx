import { useEffect, useMemo, useState } from 'react';
import { MapContainer, Marker, ScaleControl, TileLayer, Tooltip, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import visuals from '../../shared/registry/status_visuals.json';
import type { Station, Snapshot, Status } from './types';
import { useMapLabel } from './mapLabels';
import 'leaflet/dist/leaflet.css';
import './map.css';

const osmAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>';
const xy = (s: Station): L.LatLngTuple => [s.location.lat, s.location.lng];

function fit(map: L.Map, points: L.LatLngTuple[]) {
  if (points.length) map.fitBounds(L.latLngBounds(points), {
    padding: [Math.min(map.getSize().x * .16, 110), Math.min(map.getSize().y * .18, 80)],
    maxZoom: 14, animate: false
  });
}

export function fitStations(map: L.Map, stations: Station[]) {
  fit(map, stations.map(xy));
}

function Camera({ initial, selected }: { initial: string; selected: string }) {
  const map = useMap();
  useEffect(() => {
    const observer = new ResizeObserver(() => map.invalidateSize({ pan: false }));
    observer.observe(map.getContainer());
    return () => observer.disconnect();
  }, [map]);
  useEffect(() => { fit(map, JSON.parse(initial)); }, [map, initial]);
  useEffect(() => {
    if (selected) {
      const center: L.LatLngTuple = JSON.parse(selected);
      const zoom = Math.max(13, map.getZoom());
      const sheet = map.getContainer().closest('.map-arena')?.querySelector('.station-inspector')?.getBoundingClientRect();
      const narrow = sheet && sheet.width > map.getSize().x / 2;
      const offset = sheet ? L.point(narrow ? 0 : sheet.width / 2, narrow ? sheet.height / 2 : 0) : L.point(0, 0);
      const target = map.unproject(map.project(center, zoom).add(offset), zoom);
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) map.setView(target, zoom, { animate: false });
      else map.flyTo(target, zoom, { duration: .65 });
    }
  }, [map, selected]);
  return null;
}

// Project registry coordinates with Leaflet's own projection even when street tiles cannot load.
function CoordinateGrid() {
  const map = useMap();
  useEffect(() => {
    class Graticule extends L.GridLayer {
      protected createTile(c: L.Coords) {
        const tile = document.createElement('div');
        const point = map.unproject(L.point(c.x * 256, c.y * 256), c.z);
        const label = document.createElement('span');
        label.textContent = point.lat.toFixed(3) + '° · ' + point.lng.toFixed(3) + '°';
        tile.appendChild(label);
        return tile;
      }
    }
    const grid = new Graticule({ zIndex: 0, className: 'coordinate-grid' });
    grid.addTo(map);
    return () => { grid.remove(); };
  }, [map]);
  return null;
}

type MapProps = {
  stations: Station[]; states: (Snapshot | undefined)[]; network?: Station[]; selected?: string;
  onSelect?: (code: string) => void; streets?: boolean; markers?: boolean; counts?: boolean;
};

function Pins({ stations, states, selected, counts, onSelect }: MapProps) {
  const map = useMap(), label = useMapLabel(), { i18n } = useTranslation();
  const [zoom, setZoom] = useState(map.getZoom());
  useMapEvents({ zoomend: () => setZoom(map.getZoom()) });
  const groups = useMemo(() => {
    const clusters: { pixel: L.Point; indices: number[] }[] = [];
    stations.forEach((station, index) => {
      const point = map.project(xy(station), zoom);
      const cluster = clusters.find(group => group.pixel.distanceTo(point) < 44);
      if (cluster) cluster.indices.push(index);
      else clusters.push({ pixel: point, indices: [index] });
    });
    return clusters;
  }, [map, stations, zoom]);
  return <>{groups.map(({ indices }) => {
    const first = indices[0], station = stations[first], status: Status = states[first]?.station_status || 'unavailable';
    if (indices.length > 1) {
      const points = indices.map(i => xy(stations[i]));
      return <Marker key={indices.map(i => stations[i].code).join('/')} position={L.latLngBounds(points).getCenter()}
        title={label('zoom') + ' (' + indices.length + ')'} icon={L.divIcon({
          className: 'station-cluster', html: String(indices.length), iconSize: [42, 42], iconAnchor: [21, 21]
        })} eventHandlers={{ click: () => fit(map, points) }}/>;
    }
    const title = station.river + ' · ' + station.code + ' · ' + visuals.statuses[status].label[i18n.language === 'vi' ? 'vi' : 'en'];
    const icon = L.divIcon({
      className: 'station-pin pin-' + status + (station.data_mode === 'planned' ? '' : ' pin-simulated') + (selected === station.code ? ' pin-selected' : ''),
      html: '<span class="pin-glyph"></span>', iconSize: [42, 42], iconAnchor: [21, 21]
    });
    const open = states[first]?.open_alert_count;
    return <Marker key={station.code} position={xy(station)} title={title} icon={icon}
      eventHandlers={{ click: () => onSelect?.(station.code) }}>
      <Tooltip key={String(counts)} permanent direction="top" offset={[0, -18]} className="station-pin-label">
        {station.river}{counts && open !== undefined && <b> · {open} ⚑</b>}
      </Tooltip>
    </Marker>;
  })}</>;
}

export default function StationMap({ stations, states, network = stations, selected, onSelect,
  streets = true, markers = true, counts = false, onMap }: MapProps & { onMap: (map: L.Map | null) => void }) {
  const navigate = useNavigate(), label = useMapLabel();
  const [failed, setFailed] = useState(false), [attempt, setAttempt] = useState(0);
  const selectedStation = network.find(station => station.code === selected);
  // Serialize only coordinates so polling snapshots cannot move the camera.
  const all = JSON.stringify(network.map(xy));
  return <section className="station-cartography" aria-label={label('stationMap')}>
    <MapContainer ref={onMap} center={[21.005, 105.826]} zoom={12} minZoom={5} maxZoom={19} zoomControl={false}
      scrollWheelZoom={!!onSelect} zoomAnimation={false} fadeAnimation={false} markerZoomAnimation={false}>
      <CoordinateGrid/>
      {streets && <TileLayer key={attempt} url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution={osmAttribution} zIndex={1} maxZoom={19} eventHandlers={{ tileerror: () => setFailed(true) }}/>}
      {markers && <Pins stations={stations} states={states} selected={selected} counts={counts}
        onSelect={onSelect || (code => navigate('/map?station=' + encodeURIComponent(code)))}/>}
      <Camera initial={all} selected={selectedStation ? JSON.stringify(xy(selectedStation)) : ''}/>
      <ScaleControl imperial={false} position="bottomleft"/>
    </MapContainer>
    {streets && failed && <div className="tile-warning"><span>{label('offline')}</span>
      <button onClick={() => { setFailed(false); setAttempt(n => n + 1); }}>{label('retry')}</button></div>}
  </section>;
}
