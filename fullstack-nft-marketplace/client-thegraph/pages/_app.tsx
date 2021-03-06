import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { MoralisProvider } from 'react-moralis';
import { NotificationProvider } from 'web3uikit';
import Header from '../components/Header';
import '../styles/globals.css';

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_SUBGRAPH_URL,
  cache: new InMemoryCache(),
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>NFT Marketplace</title>
        <meta name="description" content="NFT Marketplace" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MoralisProvider initializeOnMount={false}>
        <ApolloProvider client={client}>
          <NotificationProvider>
            <Header />
            <Component {...pageProps} />;
          </NotificationProvider>
        </ApolloProvider>
      </MoralisProvider>
    </>
  );
}

export default MyApp;
