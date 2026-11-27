const destinations = [
  /^\/(?:map|admin|stations|simulation)\/?$/,
  /^\/overview(?:\/alerts(?:\/\d+)?)?\/?$/,
  /^\/alerts(?:\/\d+)?\/?$/,
  /^\/stations\/[A-Za-z0-9_-]+(?:\/(?:dashboard|model))?\/?$/,
];

export function loginDestination(target: string | null) {
  if (!target || !target.startsWith('/') || target.startsWith('//') || target.includes('\\')) return '/map';
  const path = target.split(/[?#]/, 1)[0];
  return destinations.some(route => route.test(path)) ? target : '/map';
}
