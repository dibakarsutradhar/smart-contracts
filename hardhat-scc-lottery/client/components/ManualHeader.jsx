import React from 'react';
import { useMoralis } from 'react-moralis';

const ManualHeader = () => {
  const { enableWeb3 } = useMoralis();
  return <div>Hi From ManualHeader</div>;
};

export default ManualHeader;
