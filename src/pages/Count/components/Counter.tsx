import { Typography } from 'antd';
import React from 'react';
import { useModel } from '@umijs/max';

const Counter: React.FC = () => {
  const { counter } = useModel('Count.countModel');
  return (
    <Typography.Text
    >
      {counter}
    </Typography.Text>
  );
};

export default Counter;
