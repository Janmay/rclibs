import React from 'react';
import {ColumnsType, ColumnType, TablePaginationConfig} from 'antd/es/table';
import {UseFetchDataAction} from './useFetchData';

export interface TableColumnType<T> extends Omit<ColumnType<T>, 'title'> {
  title?: React.ReactNode | ((config: TableColumnType<T>) => React.ReactNode);
}

export interface TableColumnGroupType<T> extends TableColumnType<T> {
  children: TableColumns<T>;
}

export type TableColumns<T> = TableColumnGroupType<T> | TableColumnType<T>;

// columns
export const genColumnList = <T,>(columns: TableColumns<T>[]): ColumnsType<T> =>
  columns.map((item) => {
    const {title} = item;
    return {
      ...item,
      title: title && typeof title === 'function' ? title(item) : title,
    };
  });

// paginations
export const mergePagination = <T,>(
  pagination: TablePaginationConfig | boolean | undefined = {},
  action: UseFetchDataAction<T>,
): TablePaginationConfig | false | undefined => {
  if (pagination === false) {
    return {};
  }
  const defaultPagination = pagination && pagination !== true ? pagination : {};
  const {current, pageSize} = action;
  return {
    showSizeChanger: true,
    total: action.total,
    ...defaultPagination,
    current,
    pageSize,
    onChange: (page: number, size?: number) => {
      if (size !== pageSize) {
        action.setPageInfo({pageSize});
      } else if (current !== page) {
        action.setPageInfo({current: page});
      }

      if (typeof pagination === 'object' && pagination.onChange) {
        pagination.onChange(page || 1, size || 20);
      }
    },
    onShowSizeChange: (current: number, size: number) => {
      action.setPageInfo({current, pageSize: size});
      if (typeof pagination === 'object' && pagination.onShowSizeChange) {
        pagination.onShowSizeChange(current || 1, size || 20);
      }
    },
  };
};
