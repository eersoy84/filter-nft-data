import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { FETCH_NFT_DATA_SERVICE } from 'src/app.constants';
import { KafkaService } from './kafka.service';

// const kafka = {
//   provide: KAFKA,
//   useFactory: () => {
//     return new Kafka({
//       clientId: 'filterNftForWalletService',
//       brokers: [process.env.KAFKA_BROKER_URL],
//     });
//   },
// };

@Module({
  imports: [
    ClientsModule.register([
      {
        name: FETCH_NFT_DATA_SERVICE,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'fetch-nft-data',
            brokers: [process.env.KAFKA_BROKER_URL],
          },
        },
      },
    ]),
  ],
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule {}
