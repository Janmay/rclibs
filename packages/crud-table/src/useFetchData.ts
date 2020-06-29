export interface RequestData<T> extends Record<string, any> {
  data: T[];
}
