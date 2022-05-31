import { CollectionTokens } from './models/collectionTokens';
import { NftCollection } from 'schema';
import { Collection, Token } from '@worldwidewebb/shared-messages/nfts';

export type MoralisAvatarAddress = {
  userId: string;
  ownedCollection: CollectionTokens;
  chain: string;
  address: string;
};

export type FilteredCollections = {
  nftCollection: NftCollection;
  collection: Collection;
  token: Token;
};

export type FilteredCollectionsWithUserId = {
  userId: string;
  filteredCollection: FilteredCollections;
};

export const FETCH_NFT_DATA_SERVICE = 'FETCH_NFT_DATA_SERVICE';
export const OPENSEA_CONTRACT_ADDRESS = '0x495f947276749ce646f68ac8c248420045cb7b5e';
export const COLLECTION_API = 'COLLECTION_API';
