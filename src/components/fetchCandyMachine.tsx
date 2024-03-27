import { useConnection } from "@solana/wallet-adapter-react"
import { PublicKey } from "@solana/web3.js"
import { Metaplex } from "@metaplex-foundation/js"
import { FC, useEffect, useState } from "react"
import styles from "../styles/custom.module.css"
import Image from "next/image"
const myCM = "7ZsJvqbAjBVmZm5q217QAQEyCcgHYjTBQEWuZci4jSPe"

export const FetchCandyMachine: FC = () => {
  const [candyMachineAddress, setCandyMachineAddress] = useState(myCM)
  const [candyMachineData, setCandyMachineData] = useState(null)
  const [pageItems, setPageItems] = useState(null)
  const [page, setPage] = useState(1)
  const { connection } = useConnection()
  const metaplex = Metaplex.make(connection)

  const fetchCandyMachine = async () => {
    try {
      let candyMachine;
      try {
        // First, try fetching the CandyMachineV2
        candyMachine = await metaplex
          .candyMachinesV2()
          .findByAddress({address: new PublicKey(candyMachineAddress)});
        console.log('Candy Machine V2:', candyMachine);
      } catch (e) {
        console.log('Not a Candy Machine V2, trying CandyMachine');
        // If that fails, try fetching the CandyMachine
        candyMachine = await metaplex
          .candyMachines()
          .findByAddress({ address: new PublicKey(candyMachineAddress) });
        console.log('Candy Machine:', candyMachine);
      }
      setCandyMachineData(candyMachine);
    } catch (e) {
      console.error('Error fetching Candy Machine:', e);
      alert("Please submit a valid CMv2 address.");
    }
  };
  useEffect(() => {
    if (candyMachineData) {
      console.log('Candy Machine Data:', candyMachineData); // Log the candyMachineData
      console.log('Current Page:', page); // Log the current page
      getPage(page, 10) // Fetch 10 items per page initially
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candyMachineData, page])
  const getPage = async (page, perPage) => {
    if (candyMachineData && candyMachineData.items) {
      const pageItems = candyMachineData.items.slice(
        (page - 1) * perPage,
        page * perPage
     )
  
      let nftData = []
      for (let i = 0; i < pageItems.length; i++) {
        try {
          let fetchResult = await fetch(pageItems[i].uri)
          let json = await fetchResult.json()
          nftData.push(json)
        } catch (e) {
          console.error("Error fetching NFT data:", e) // Log the error
        }
      }
  
      console.log('NFT Data:', nftData); // Log the result
      setPageItems(nftData)
    }
  }

  const prev = async () => {
    if (page - 1 < 1) {
      setPage(1)
    } else {
      setPage(page - 1)
    }
  }

  const next = async () => {
    setPage(page + 1)
  }

  return (
    <div>
      <input
        type="text"
        className="form-control block mb-2 w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center"
        placeholder="Enter Candy Machine v2 Address"
        value={candyMachineAddress}
        onChange={(e) => setCandyMachineAddress(e.target.value)}
      />
      <button
        className="px-8 m-2 btn animate-pulse bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ..."
        onClick={fetchCandyMachine}
      >
        Fetch
      </button>

      {candyMachineData && (
        <div className="flex flex-col items-center justify-center p-5">
          <ul>Candy Machine Address: {candyMachineData.address.toString()}</ul>
        </div>
      )}

      {pageItems && (
        <div>
          <div className={styles.gridNFT}>
            {pageItems.map((nft, index) => (
              <div key={index}>
                <ul>{nft.name}</ul>
                <Image src={nft.image} 
                alt={nft.name} width={500} height={300} />
              </div>
            ))}
          </div>
          <button
            className="px-8 m-2 btn animate-pulse bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ..."
            onClick={prev}
          >
            Prev
          </button>
          <button
            className="px-8 m-2 btn animate-pulse bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ..."
            onClick={next}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default FetchCandyMachine