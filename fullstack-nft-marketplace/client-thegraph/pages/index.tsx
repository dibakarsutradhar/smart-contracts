import { useQuery } from '@apollo/client';
import { NextPage } from 'next';
import { useMoralis } from 'react-moralis';
import NFTBox from '../components/NFTBox';
import networkMapping from '../constants/networkMapping.json';
import GET_ACTIVE_ITEMS from '../constants/subgraphQueries';

export type NetworkConfigItem = {
  NftMarketplace: string[];
};

export type NetworkConfigMap = {
  [chainId: string]: NetworkConfigItem;
};

const Home: NextPage = () => {
  const { isWeb3Enabled, chainId } = useMoralis();
  const chainString = chainId ? parseInt(chainId).toString() : '31337';
  const marketplaceAddress = (networkMapping as NetworkConfigMap)[chainString]
    .NftMarketplace[0];

  const { loading, error, data: listedNfts } = useQuery(GET_ACTIVE_ITEMS);

  return (
    <div className="container mx-auto">
      <h1 className="py-4 px-4 font-bold text-2xl">Recently Listed</h1>
      <div className="flex flex-wrap">
        {isWeb3Enabled ? (
          loading || !listedNfts ? (
            <div>Loading...</div>
          ) : (
            listedNfts.activeItems.map((nft: any) => {
              console.log(nft);
              const { price, nftAddress, tokenId, seller } = nft;
              return (
                <div>
                  <NFTBox
                    price={price}
                    nftAddress={nftAddress}
                    tokenId={tokenId}
                    marketplaceAddress={marketplaceAddress}
                    seller={seller}
                    key={`${nftAddress}${tokenId}`}
                  />
                </div>
              );
            })
          )
        ) : (
          <div>Web3 Currently is Not Available</div>
        )}
      </div>
    </div>
  );
};

export default Home;
