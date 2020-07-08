import React, {useEffect, useState} from 'react';
import {Table} from 'antd';
import {ColumnsType, TableProps} from 'antd/es/table';
import {stringify} from 'flatted';
import useFetchData, {DataResult} from './useFetchData';
import {genColumnList, mergePagination, TableColumns} from './utils';

export interface CrudTableProps<T, U extends Record<string, unknown>>
  extends Omit<TableProps<T>, 'columns'> {
  columns?: TableColumns<T>[];
  params?: U;
  request?: (params: {
    pageSize?: number;
    current?: number;
  }) => Promise<DataResult<T>>;
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
  const [columns, setColumns] = useState<ColumnsType<T>>([]);

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

  // pagination
  const pagination =
    propPagination !== false && mergePagination<T>(propPagination, action);

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

  // update columns
  useEffect(() => {
    const tableColumns = genColumnList<T>(propColumns);
    setColumns(tableColumns);
  }, [stringify(propColumns)]);

  return (
    <div>
      <Table
        {...rest}
        loading={action.loading || props.loading}
        dataSource={dataSource}
        columns={columns}
        pagination={pagination}
      />
    </div>
  );
};

export default CrudTable;
