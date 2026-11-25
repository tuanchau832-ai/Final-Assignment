import { useQueries, useQueryClient } from '@tanstack/react-query';
import { useStations, stationStateOptions } from './api';

export function useNetworkStations() {
  const registry = useStations();
  const client = useQueryClient();
  const stations = registry.data?.items || [];
  const snapshotQueries = useQueries({
    queries: stations.map(station => stationStateOptions(client, station.code))
  });
  return { registry, stations, snapshotQueries };
}
