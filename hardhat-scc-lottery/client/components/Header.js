import React from 'react';
import { ConnectButton } from 'web3uikit';

const Header = () => {
  return (
    <div>
      Decentralized Raffle
      <ConnectButton moralisAuth={false} />
    </div>
  );
};

export default Header;
