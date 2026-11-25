export class ApiError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

export interface DataProvider {
  request<T>(path: string, body?: unknown): Promise<T>;
}
