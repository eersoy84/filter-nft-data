import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { FETCH_NFT_DATA_SERVICE } from 'src/app-constants';
import { FilterNftService } from './filter-nft.service';
import { FilterNftController } from './filter-nft.controller';
import { CollectionApiModule } from 'src/collection-api/collection-api.module';
import { OpenseaModule } from 'src/opensea/opensea.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: FETCH_NFT_DATA_SERVICE,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'fetch-nft-data',
            brokers: [process.env.KAFKA_BROKER_URL],
          },
          consumer: {
            groupId: 'fetch.nft.data.consumer',
          },
        },
      },
    ]),
    CollectionApiModule,
    OpenseaModule,
  ],
  providers: [FilterNftService],
  controllers: [FilterNftController],
})
export class FilterNftModule {}
