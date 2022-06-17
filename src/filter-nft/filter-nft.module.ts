import { Module } from '@nestjs/common';
import { FilterNftService } from './filter-nft.service';
import { FilterNftController } from './filter-nft.controller';
import { CollectionApiModule } from 'src/collection-api/collection-api.module';
import { OpenseaModule } from 'src/opensea/opensea.module';
import { KafkaModule } from 'src/kafka/kafka.module';

@Module({
  imports: [CollectionApiModule, KafkaModule, OpenseaModule],
  providers: [FilterNftService],
  controllers: [FilterNftController],
})
export class FilterNftModule {}
