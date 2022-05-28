import { Module } from '@nestjs/common';
import { CollectionApi } from '@worldwidewebb/client-nfts';
import { COLLECTION_API, COLLECTION_API_URL } from 'src/app-constants';
import { CollectionApiService } from './collection-api.service';

const collectionApiFactory = {
  provide: COLLECTION_API,
  useFactory: () => {
    return new CollectionApi(undefined, process.env.COLLECTION_API_URL);
  },
};

@Module({
  // providers: [CollectionApiService],
  providers: [collectionApiFactory, CollectionApiService],
  exports: [CollectionApiService],
})
export class CollectionApiModule {}
