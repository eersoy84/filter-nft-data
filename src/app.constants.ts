import { CollectionTokens } from './models/collectionTokens';
import { Collection, Token } from '@worldwidewebb/shared-messages/nfts';
import { NftCollection } from '@worldwidewebb/client-nfts';
import { ConfigModule } from '@nestjs/config';
ConfigModule.forRoot();

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
export const COLLECTION_API = 'COLLECTION_API';
export const FILTER_NFT_DATA_TOPIC = process.env.FILTER_NFT_DATA_TOPIC || 'filter.nft.data';
export const FETCH_NFT_DATA_TOPIC = process.env.FETCH_NFT_DATA_TOPIC || 'fetch.nft.data';
export const FETCH_NFT_DATA_SERVICE = 'FETCH_NFT_DATA_SERVICE';
export const NUM_PARTITIONS = parseInt(process.env.NUM_PARTITIONS) || 1;
export const REPLICATION_FACTOR = parseInt(process.env.REPLICATION_FACTOR) || 1;
