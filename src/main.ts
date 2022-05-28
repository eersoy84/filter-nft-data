import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [process.env.KAFKA_BROKER_URL],
        retry: {
          retries: 8,
          initialRetryTime: 3000,
          maxRetryTime: 30000,
        },
      },
      consumer: {
        groupId: 'filter.nft.data.consumer',
      },
    },
  });
  await app.listen();
}
bootstrap();
