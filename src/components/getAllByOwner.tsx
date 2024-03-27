import Head from 'next/head';
import styles from "../styles/custom.module.css"
import { Metaplex, } from '@metaplex-foundation/js';
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import { FC, useEffect, useState } from "react"
import Image from 'next/image';
import { de } from 'date-fns/locale';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
const connection = new Connection(clusterApiUrl('devnet'));
const mx = Metaplex.make(connection);

export const Gallery: FC = () => {
  const { publicKey } = useWallet();
  const [address, setAddress] = useState(
    publicKey,
  );
  
  const [nftList, setNftList] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentView, setCurrentView] = useState(null);
  const perPage = 1;

  const fetchNFTs = async () => {
    try {
      setLoading(true);
      setCurrentView(null);
      const list = await mx.nfts().findAllByOwner({ owner: new PublicKey(address)});
      setNftList(list);
      setCurrentPage(1);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (!nftList) {
      return;
    }

    const execute = async () => {
      const startIndex = (currentPage - 1) * perPage;
      const endIndex = currentPage * perPage;
      const nfts = await loadData(startIndex, endIndex);

      setCurrentView(nfts);
      setLoading(false);
    };

    execute();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nftList, currentPage]);

  const loadData = async (startIndex: number, endIndex: number) => {
    const nftsToLoad = nftList.filter((_, index) => (index >= startIndex && index < endIndex))

    const promises = nftsToLoad.map((metadata) => mx.nfts().load({ metadata }));
    return Promise.all(promises);
  };

  const changeCurrentPage = (operation: string) => {
    setLoading(true);
    if (operation === 'next') {
      setCurrentPage((prevValue) => prevValue + 1);
    } else {
      setCurrentPage((prevValue) => (prevValue > 1 ? prevValue - 1 : 1));
    }
  };

  return (
    <div>
      <Head>
        <title>Metaplex and Next.js example</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.App}>
        <div className={styles.container}>
          <h1 className={styles.title}>Wallet Address</h1>
          <div className={styles.nftForm}>
             <input
             type="text"
             className="form-control block mb-2 w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center"
             placeholder="If this is not your address, please paste your address here."
             value= "publicKey"
             onChange={(e) => setNftList(e.target.value)}
            />
            <button
             className="px-8 m-2 btn animate-pulse bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ..."
             onClick={fetchNFTs}
             >
              Fetch
            </button>
          </div>
        {loading ? (
            <Image className={styles.loadingIcon} src="/loading.svg" alt="Loading" />
        ) : (
            currentView &&
            currentView.map((nft, index) => (
                <div key={index} className={styles.nftPreview}>
                    <h1>{nft.name}</h1>
                    <Image
                        className={styles.nftImage}
                        src={nft?.json?.image || '/fallbackImage.jpg'}
                        alt="The downloaded illustration of the provided NFT address."
                    />
                </div>
            ))
        )}
          {currentView && (
            <div className={styles.buttonWrapper}>
              <button
                disabled={currentPage === 1}
                className={styles.styledButton}
                onClick={() => changeCurrentPage('prev')}
              >
                Prev Page
              </button>
              <button
                disabled={nftList && nftList.length / perPage === currentPage}
                className={styles.styledButton}
                onClick={() => changeCurrentPage('next')}
              >
                Next Page
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Gallery;