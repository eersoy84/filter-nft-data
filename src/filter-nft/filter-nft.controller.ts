import { Controller, Inject, Logger, ValidationPipe } from '@nestjs/common';
import { ClientKafka, Ctx, EventPattern, KafkaContext, Payload } from '@nestjs/microservices';
import { FilterNftService } from './filter-nft.service';

@Controller()
export class FilterNftController {
  constructor(private filterNft: FilterNftService) {}

  @EventPattern('filter.nft.data')
  handleFilterNftData(@Payload(new ValidationPipe()) data: any, @Ctx() context: KafkaContext) {
    const topic = context.getTopic();
    this.filterNft.handleFilterNftData(data.value);
  }
}
