import create, { State } from 'zustand'
import { PublicKey } from '@solana/web3.js'

interface UserNFTsStore extends State {
  nftList: any;
  loading: boolean;
  currentPage: number;
  currentView: any;
  fetchNFTs: (address: string, mx: any) => void;
}

const useUserNFTsStore = create<UserNFTsStore>((set) => ({
  nftList: null,
  loading: false,
  currentPage: 1,
  currentView: null,
  fetchNFTs: async (address, mx) => {
    try {
      set({ loading: true, currentView: null });
      const list = await mx.nfts().findAllByOwner({ owner: new PublicKey(address)});
      set({ nftList: list, currentPage: 1, loading: false });
    } catch (e) {
      console.error(e);
      set({ loading: false });
    }
  },
}));

export default useUserNFTsStore;