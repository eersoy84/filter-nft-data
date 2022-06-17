import { Controller, ValidationPipe } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { FILTER_NFT_DATA_TOPIC } from 'src/app.constants';
import { FilterNftService } from './filter-nft.service';

@Controller()
export class FilterNftController {
  constructor(private filterNft: FilterNftService) {}
  @EventPattern(FILTER_NFT_DATA_TOPIC)
  handleFilterNftData(@Payload(new ValidationPipe()) data: any) {
    const { value, partition } = data;
    this.filterNft.handleFilterNftData(value, partition);
  }
}
