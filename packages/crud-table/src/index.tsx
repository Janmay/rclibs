import React, {useState} from 'react';
import {Table} from 'antd';
import {ColumnsType, TableProps} from 'antd/es/table';
import {RequestData} from './useFetchData';

export interface CrudTableProps<T, U extends Record<string, any>>
  extends TableProps<T> {
  params?: U;
  request?: RequestData<T, U>;
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
    pagination: propPagination,
    columns: propColumns = [],
    ...rest
  } = props;

  const [dataSource, setDataSource] = useState<T[]>([]);

  return <div></div>;
};
