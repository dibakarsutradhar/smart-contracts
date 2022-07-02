import { ConnectButton } from 'web3uikit';
import Link from 'next/link';

const Header = () => {
  return (
    <nav className="p-5 border-b-2 flex flex-row justify-between items-center">
      <h1 className="py-4 px-4 font-bold text-3xl">NFT Marketplace</h1>
      <div>
        <Link href="/">
          <a>NFT Marketplace</a>
        </Link>
        <Link href="/sell-nft">
          <a>Sell NFT</a>
        </Link>
        <ConnectButton />;
      </div>
    </nav>
  );
};

export default Header;
