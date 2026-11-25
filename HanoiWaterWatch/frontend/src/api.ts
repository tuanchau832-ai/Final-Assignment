import { syncServerClock } from './clock';
import { useSyncExternalStore } from 'react';
import {useQuery,useQueryClient,useMutation,onlineManager,type QueryClient} from '@tanstack/react-query';
import {acceptVersion} from './domain';
import type {Snapshot,Station,Alert,History,User} from './types';
import { ApiError, type DataProvider } from './dataProvider';
export { ApiError } from './dataProvider';
const sessionRoutes = new Set(['/auth/login','/auth/logout','/auth/me']);
let synthetic: Promise<DataProvider> | undefined;
async function httpRequest<T>(path:string,body?:unknown):Promise<T>{const r=await fetch('/api/v1'+path,{credentials:'same-origin',signal:AbortSignal.timeout(8000),...(body!==undefined?{method:'POST',headers:{'Content-Type':'application/json','X-Requested-With':'hww'},body:JSON.stringify(body)}:{})});syncServerClock(r.headers.get('Date'));if(!r.ok){const p=await r.json().catch(()=>({}));throw new ApiError(r.status,typeof p.detail==='string'?p.detail:p.title||p.code||JSON.stringify(p.detail)||`Request failed (${r.status})`)}if(r.status===204)return undefined as T;return r.json()}
const httpProvider: DataProvider = { request: httpRequest };

export async function api<T>(path: string, body?: unknown): Promise<T> {
  if (import.meta.env.VITE_DEMO_MODE === 'true') {
    if (!['localhost','127.0.0.1','[::1]'].includes(window.location.hostname)) {
      throw new ApiError(403,'Demonstration mode is available only on a local origin.');
    }
    if (!sessionRoutes.has(path)) {
      synthetic ??= import('./demo/provider').then(({ createDemoProvider }) => createDemoProvider(async () => {
        try { return (await httpProvider.request<{user: User}>('/auth/me')).user; }
        catch (error) { if (error instanceof ApiError && error.status === 401) return null; throw error; }
      }));
      return (await synthetic).request<T>(path, body);
    }
  }
  return httpProvider.request<T>(path, body);
}
export function useOnline() {
  return useSyncExternalStore(onlineManager.subscribe, () => onlineManager.isOnline());
}
export const useStations=()=>useQuery({queryKey:['stations'],queryFn:()=>api<{items:Station[]}>('/stations')});
export const useStation=(code:string)=>useQuery({queryKey:['station',code],queryFn:()=>api<Station>('/stations/'+code)});
export function stationStateOptions(client: QueryClient, code: string) {
  const queryKey = ['stationState', code];
  return {
    queryKey,
    queryFn: async () => acceptVersion(client.getQueryData<Snapshot>(queryKey), await api<Snapshot>(`/stations/${code}/state`)),
    refetchInterval: 2000,
    retry: false
  };
}
export function useStationState(code: string) {
  return useQuery(stationStateOptions(useQueryClient(), code));
}
export const useAlerts=(filters='')=>useQuery({queryKey:['alerts',filters],queryFn:()=>api<{items:Alert[];next_cursor:string|null;total:number}>('/alerts?'+filters),refetchInterval:5000});
export const useUser=()=>useQuery({queryKey:['user'],queryFn:async()=>{try{return await api<{user:User}>('/auth/me')}catch(error){if(error instanceof ApiError&&error.status===401)return null;throw error}},retry:false,staleTime:15000,refetchInterval:30000});
export function useAlert(id:string){const user=useUser();return useQuery({queryKey:['alert',id,user.data?.user.username??'anonymous'],queryFn:()=>api<Alert>('/alerts/'+id),refetchInterval:5000})}
export const useHistory=(code:string,channel:string,from:string,to:string,enabled=true,bucket='auto')=>useQuery({queryKey:['history',code,channel,from,to,bucket],queryFn:()=>api<History>(`/stations/${code}/measurements?channel=${channel}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&bucket=${bucket}`),refetchInterval:10000,enabled});
export function useAction() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ path, body }: { path: string; body: unknown }) => api<Record<string, unknown>>(path, body),
    onSuccess: async (_, { path }) => {
      if (path === '/auth/logout') {
        const privateKeys = ['alert', 'alerts', 'replays', 'sessions'];
        const privateQuery = (q: { queryKey: readonly unknown[] }) => privateKeys.includes(String(q.queryKey[0]));
        await client.cancelQueries({ predicate: q => q.queryKey[0] === 'user' || privateQuery(q) });
        client.setQueryData(['user'], null);
        client.removeQueries({ predicate: privateQuery });
      }
      void client.invalidateQueries();
    },
  });
}
export const useResource=<T,>(key:string,path:string,poll=10000,enabled=true)=>useQuery({queryKey:[key,path],queryFn:()=>api<T>(path),refetchInterval:poll,enabled});
