import { Inject, Injectable, Logger } from '@nestjs/common';
import { CollectionApi } from '@worldwidewebb/client-nfts';
import { NftCollection } from 'schema';
import { COLLECTION_API } from 'src/app-constants';

@Injectable()
export class CollectionApiService {
  private readonly logger = new Logger(CollectionApiService.name);

  constructor(@Inject(COLLECTION_API) private readonly collectionApi: CollectionApi) {
    this.logger.verbose('collection api initializing...');
  }

  async getCollection(address: string, options?: any): Promise<NftCollection | undefined> {
    try {
      const { data: nftCollection } = await this.collectionApi.getCollection(address);
      if (!nftCollection) return;
      return nftCollection;
    } catch (err) {
      this.logger.error(`Error: while fetching nftCollection for address ${address}  from CollectionApi`, err);
      return;
    }
  }

  async getCollectionSlug(address: string, slug: string): Promise<NftCollection | undefined> {
    try {
      const { data: nftCollectionSlug } = await this.collectionApi.getCollectionSlug(address, slug);
      if (!nftCollectionSlug) return;
      return nftCollectionSlug;
    } catch (err) {
      this.logger.error(
        `Error: while fetching nftCollectionSlug for address ${address} and slug ${slug}  from CollectionApi`,
        err,
      );
      return;
    }
  }
}
