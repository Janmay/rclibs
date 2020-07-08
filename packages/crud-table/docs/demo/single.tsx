import React from 'react';
import {Space, Tag} from 'antd';
import request from 'umi-request';
// @ts-ignore
import CrudTable from '@rclibs/crud-table';

const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 72,
  },
  {
    title: '标题',
    dataIndex: 'title',
    copyable: true,
    ellipsis: true,
    rules: [
      {
        required: true,
        message: '此项为必填项',
      },
    ],
    width: '30%',
    hideInSearch: true,
  },
  // {
  //   title: '状态',
  //   dataIndex: 'state',
  //   initialValue: 'all',
  //   filters: true,
  //   valueEnum: {
  //     all: {text: '全部', status: 'Default'},
  //     open: {
  //       text: '未解决',
  //       status: 'Error',
  //     },
  //     closed: {
  //       text: '已解决',
  //       status: 'Success',
  //     },
  //     processing: {
  //       text: '解决中',
  //       status: 'Processing',
  //     },
  //   },
  //   width: '10%',
  // },
  {
    title: '标签',
    dataIndex: 'labels',
    width: '10%',
    render: (_, row) => (
      <Space>
        {row.labels.map(({name, id, color}) => (
          <Tag color={color} key={id}>
            {name}
          </Tag>
        ))}
      </Space>
    ),
  },
  {
    title: '创建时间',
    key: 'since',
    dataIndex: 'created_at',
    valueType: 'dateTime',
    width: '20%',
  },
];

export default () => {
  return (
    <div>
      <CrudTable
        columns={columns}
        request={async (params = {}) =>
          request('https://proapi.azurewebsites.net/github/issues', {
            params,
          })
        }
        rowKey="id"
      />
    </div>
  );
};
