import React from 'react';
import {ConfigProvider} from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import 'dayjs/locale/zh-cn';
import './App.less';

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <div className="App">
        React App
      </div>
    </ConfigProvider>
  );
}

export default App;
