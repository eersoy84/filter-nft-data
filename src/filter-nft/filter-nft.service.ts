import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Collection } from '@worldwidewebb/shared-messages/nfts';
import { FilterQuery } from 'mongoose';
import { NftCollection } from 'schema';
import {
  FETCH_NFT_DATA_SERVICE,
  FilteredCollections,
  FilteredCollectionsWithUserId,
  MoralisAvatarAddress,
  OPENSEA_CONTRACT_ADDRESS,
} from 'src/app-constants';
import { CollectionTokens } from 'src/models/collectionTokens';
import { OpenseaService } from 'src/opensea/opensea.service';
import { CollectionApiService } from 'src/collection-api/collection-api.service';

@Injectable()
export class FilterNftService {
  private readonly logger = new Logger(FilterNftService.name);
  constructor(
    @Inject(FETCH_NFT_DATA_SERVICE) private readonly fetchNftClient: ClientKafka,
    private readonly openSea: OpenseaService,
    private readonly collectionApi: CollectionApiService,
  ) {
    this.logger.verbose('Initializing 3rd party Apis...');
  }

  async handleFilterNftData(value: MoralisAvatarAddress) {
    const { userId, ownedCollection, chain } = value;

    const filteredCollections: FilteredCollections[] = await this.filterNfts(chain, ownedCollection, null);
    console.log('filtered collections', filteredCollections.length);
    if (filteredCollections?.length == 0) return;
    filteredCollections.map(async (filteredCollection: FilteredCollections) => {
      let filteredCollectionWithUserId: FilteredCollectionsWithUserId = {
        userId: userId,
        filteredCollection,
      };
      console.log('Emiting fetch.nft.data.now event', filteredCollectionWithUserId);
      this.fetchNftClient.emit('fetch.nft.data', filteredCollectionWithUserId);
    });
  }
  public async filterNfts(
    chain: string,
    ownedCollection: CollectionTokens,
    collectionType?: string,
  ): Promise<FilteredCollections[]> {
    let filteredCollections: FilteredCollections[] = [];

    if (ownedCollection.collection.address.value != OPENSEA_CONTRACT_ADDRESS) {
      const query: FilterQuery<NftCollection> = {
        address: ownedCollection.collection.address.value,
        enabled: true,
      };

      if (collectionType) {
        query.collectionTypes = collectionType;
      }
      const nftCollection: NftCollection = await this.collectionApi.getCollection(
        ownedCollection.collection.address.value,
      );

      if (!nftCollection) return [];

      const collection: Collection = ownedCollection.collection;

      filteredCollections = ownedCollection.tokens.map((token) => ({ nftCollection, collection, token }));
      return filteredCollections;
    }

    await Promise.all(
      ownedCollection.tokens.map(async (token) => {
        let slug = (await this.openSea.fetchNftOpensea(chain, OPENSEA_CONTRACT_ADDRESS, token.id))?.collection
          .openseaSlug;
        if (!slug) {
          this.logger.error(`No slug exist for opensea token id #${token.id}`);
          return;
        }
        let query: FilterQuery<NftCollection> = {
          address: ownedCollection.collection.address.value,
          openseaSlug: slug,
          enabled: true,
        };
        if (collectionType) {
          query.collectionTypes = collectionType;
        }
        const nftCollection = await this.collectionApi.getCollectionSlug(query.address, query.openseaSlug);

        if (!nftCollection) return;

        const collection: Collection = ownedCollection.collection;
        filteredCollections.push({ nftCollection, collection, token });
      }),
    );
    return filteredCollections;
  }
}
