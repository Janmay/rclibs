import React, {useEffect, useState} from 'react';
import {Table} from 'antd';
import {ColumnsType, TableProps} from 'antd/es/table';
import {stringify} from 'flatted';
import useFetchData, {RequestData} from './useFetchData';

export interface CrudTableProps<T, U extends Record<string, unknown>>
  extends TableProps<T> {
  params?: U;
  request?: RequestData<T>;
  dealData?: (data: any[]) => any[];
  defaultData?: T[];
}

const CrudTable = <
  T extends Record<string, unknown>,
  U extends Record<string, unknown>
>(
  props: CrudTableProps<T, U>,
) => {
  const {
    request,
    params = {},
    dealData,
    defaultData = [],
    pagination: propPagination,
    columns: propColumns = [],
    ...rest
  } = props;

  const [dataSource, setDataSource] = useState<T[]>([]);

  // fetch table data
  const defaultPagination =
    propPagination && typeof propPagination === 'object'
      ? propPagination
      : {defaultCurrent: 1, defaultPageSize: 20, pageSize: 20, current: 1};
  const getData = async ({pageSize, current}) => {
    if (!request) {
      return {
        data: props.dataSource || [],
        success: true,
      };
    }
    const res = await request({
      current,
      pageSize,
      ...params,
    });
    if (dealData) {
      return {...res, data: dealData(res.data)};
    }
    return res;
  };
  const action = useFetchData(getData, defaultData, {
    defaultCurrent:
      defaultPagination.current || defaultPagination.defaultCurrent,
    defaultPageSize:
      defaultPagination.pageSize || defaultPagination.defaultPageSize,
    effects: [stringify(params)],
  });

  // update data
  useEffect(() => {
    setDataSource(request ? action.dataSource : props.dataSource || []);
  }, [props.dataSource, action.dataSource]);

  // update pagination
  useEffect(() => {
    if (propPagination && propPagination.current && propPagination.pageSize) {
      action.setPageInfo({
        pageSize: propPagination.pageSize,
        current: propPagination.current,
      });
    }
  }, [stringify(propPagination)]);

  return <div></div>;
};
