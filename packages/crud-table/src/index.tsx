import * as React from 'react';
import {Table} from 'antd';
import {ColumnsType, TableProps} from 'antd/es/table';
import {RequestData} from './useFetchData';

export interface CrudTableProps<T, U extends Record<string, any>>
  extends TableProps<T> {
  params?: U;
  request?: (
    params: U & {
      pageSize?: number;
      current?: number;
    },
  ) => Promise<RequestData<T>>;
}

const CrudTable = <
  T extends Record<string, unknown>,
  U extends Record<string, unknown>
>(
  props: CrudTableProps<T, U>,
) => {
  const {request} = props;

  return <div></div>;
};
