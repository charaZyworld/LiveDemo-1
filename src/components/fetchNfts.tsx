import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js"
import { FC, useEffect, useState } from "react"
import styles from "../styles/custom.module.css"

export const FetchNft: FC = () => {
  const [nftData, setNftData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Change this to the number of items you want per page

  const { connection } = useConnection();
  const wallet = useWallet();
  const metaplex = Metaplex.make(connection).use(walletAdapterIdentity(wallet));

  const fetchNfts = async () => {
    if (!wallet.connected) {
      return;
    }

    const nfts = await metaplex.nfts().findAllByOwner({ owner: wallet.publicKey });

    const nftMetadata = await Promise.all(nfts.map(async (nft) => {
      const fetchResult = await fetch(nft.uri);
      return fetchResult.json();
    }));

    setNftData(nftMetadata);
  };

  useEffect(() => {
    fetchNfts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet, currentPage]);

  const totalPages = Math.ceil(nftData.length / itemsPerPage);

  return (
    <div>
      {nftData.length > 0 && (
        <div className={styles.gridNFT}>
          {nftData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((nft) => (
            <div key={nft.name} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <ul>{nft.name}</ul>
              <img src={nft.image} alt={nft.name} style={{width: '50%', height: 'auto'}}/>
            </div>
          ))}
        </div>
      )}
      <div>
        {currentPage > 1 && <button onClick={() => setCurrentPage(currentPage - 1)}style={{fontSize: '125%', border: '1px solid', backgroundColor: 'white', color: 'black'}}>← Previous</button>}
        {currentPage < totalPages && <button onClick={() => setCurrentPage(currentPage + 1)}style={{fontSize: '125%', border: '1px solid', backgroundColor: 'white', color: 'black'}}>Next →</button>}
      </div>
    </div>
  );
};
export default FetchNft;