import {useState} from 'react';

export interface DataResult<T> extends Record<string, any> {
  data: T[];
}

export interface RequestData<T, U extends Record<string, any>> {
  (
    params: U & {
      pageSize?: number;
      current?: number;
    },
  ): Promise<DataResult<T>>;
}

export interface UseFetchDataAction<T> {
  dataSource: T[];
  loading?: boolean;
}

const useFetchData = <T>(
  getData: RequestData<T, Record<string, any>>,
  defaultData?: T[],
  options?: {
    defaultCurrent?: number;
    defaultPageSize?: number;
    onLoad?: (dataSource: T[]) => void;
    onError?: (e: Error) => void;
  },
): UseFetchDataAction<T> => {
  const [dataSource, setDataSource] = useState<T[]>(defaultData);
  return {
    dataSource,
  };
};
