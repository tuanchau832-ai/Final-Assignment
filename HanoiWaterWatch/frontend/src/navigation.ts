export function destinations(path: string, search: string) {
  const current = new URLSearchParams(search);
  const fromPath = /^\/stations\/([^/]+)/.exec(path)?.[1];
  const selected = fromPath || current.get('station');
  const code = encodeURIComponent(selected || 'HWW-KNG-001');
  const stationSearch = selected ? '?station=' + encodeURIComponent(selected) : '';
  const analysis = new URLSearchParams();
  for (const key of ['range', 'sensor']) {
    const value = current.get(key);
    if (value) analysis.set(key, value);
  }
  const details = analysis.size ? '?' + analysis : '';
  return {
    mapHome: '/map' + stationSearch,
    overview: '/overview' + stationSearch,
    model: '/stations/' + code + '/model' + details,
    dashboard: '/stations/' + code + '/dashboard' + details,
    alerts: '/alerts' + stationSearch,
    simulation: '/simulation' + stationSearch,
  };
}
