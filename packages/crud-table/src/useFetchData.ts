import {useEffect, useState} from 'react';
import {useDebounceFn, usePrevious} from 'ahooks';

export interface DataResult<T> extends Record<string, any> {
  data: T[];
  success?: boolean;
  total?: number;
}

export interface UseFetchDataAction<T> {
  dataSource: T[];
  loading?: boolean;
  hasMore?: boolean;
  current?: number;
  pageSize?: number;
  total?: number;
  cancel: () => void;
  reload: () => Promise<void>;
  fetchMore: () => void;
  fullScreen?: () => void;
  resetPageIndex: () => void;
  reset: () => void;
  setPageInfo: (pageInfo: Partial<PageInfo>) => void;
}

interface PageInfo {
  hasMore: boolean;
  current: number;
  pageSize: number;
  total: number;
}

const useFetchData = <T>(
  getData: (params: {
    pageSize: number;
    current: number;
  }) => Promise<DataResult<T>>,
  defaultData?: T[],
  options?: {
    defaultCurrent?: number;
    defaultPageSize?: number;
    effects?: any[];
    onLoad?: (dataSource: T[]) => void;
    onError?: (e: Error) => void;
  },
): UseFetchDataAction<T> => {
  let isMounted = true;
  const {
    defaultPageSize = 20,
    defaultCurrent = 1,
    effects = [],
    onLoad = () => null,
    onError = () => null,
  } = options || {};

  const [dataSource, setDataSource] = useState<T[]>(defaultData);
  const [loading, setLoading] = useState<boolean>(false);

  const [pageInfo, setPageInfo] = useState<PageInfo>({
    hasMore: false,
    current: defaultCurrent || 1,
    total: 0,
    pageSize: defaultPageSize,
  });
  const prevPage = usePrevious(pageInfo.current);
  const prevPageSize = usePrevious(pageInfo.pageSize);

  const fetchList = async (isAppend?: boolean) => {
    if (loading || !isMounted) {
      return;
    }
    setLoading(true);
    const {current, pageSize} = pageInfo;
    try {
      const {data, success, total: dataTotal} =
        (await getData({current, pageSize})) || {};
      if (success) {
        if (isAppend && dataSource) {
          setDataSource([...dataSource, ...data]);
        } else {
          setDataSource(data);
        }
        setPageInfo({
          ...pageInfo,
          total: dataTotal,
          hasMore: dataTotal > pageSize * current,
        });
      }
      if (onLoad) {
        onLoad(data);
      }
    } catch (e) {
      onError(e);
    } finally {
      setLoading(false);
    }
  };

  const {run: runFetchList, cancel: cancelFetchList} = useDebounceFn(
    fetchList,
    {wait: 200},
  );

  const fetchMore = () => {
    if (pageInfo.hasMore) {
      setPageInfo({...pageInfo, current: pageInfo.current + 1});
    }
  };

  // current page changed
  useEffect(() => {
    const {current, pageSize} = pageInfo;
    if (
      (!prevPage || prevPage === current) &&
      (!prevPageSize || prevPageSize === pageSize)
    ) {
      return () => undefined;
    }
    // if dataSource.length is 30 and pageSize is 10, don't fetch
    if (current !== undefined && dataSource.length <= pageSize) {
      runFetchList();
      return () => cancelFetchList();
    }
    return () => undefined;
  }, [pageInfo.current]);

  // pageSize changed
  useEffect(() => {
    if (!prevPageSize) {
      return () => undefined;
    }
    setDataSource([]); // refresh data
    setPageInfo({...pageInfo, current: 1});
    runFetchList();
    return () => cancelFetchList();
  }, [pageInfo.pageSize]);

  // reset current page
  const resetPageIndex = () => {
    setPageInfo({...pageInfo, current: 1});
  };

  // Other deps which should trigger fetch
  useEffect(() => {
    runFetchList();
    return () => {
      cancelFetchList();
      isMounted = false;
    };
  }, effects);

  return {
    dataSource,
    loading,
    ...pageInfo,
    cancel: cancelFetchList,
    reload: async () => runFetchList(),
    fetchMore,
    resetPageIndex,
    setPageInfo: (info) =>
      setPageInfo({
        ...pageInfo,
        ...info,
      }),
    reset: () => {
      setPageInfo({
        hasMore: false,
        current: defaultCurrent || 1,
        total: 0,
        pageSize: defaultPageSize,
      });
    },
  };
};

export default useFetchData;
