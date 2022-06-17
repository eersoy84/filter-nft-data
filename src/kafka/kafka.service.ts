import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Admin, Consumer, Kafka, Producer } from 'kafkajs';
import {
  FETCH_NFT_DATA_SERVICE,
  FETCH_NFT_DATA_TOPIC,
  FILTER_NFT_DATA_TOPIC,
  NUM_PARTITIONS,
  REPLICATION_FACTOR,
} from 'src/app.constants';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private admin: Admin;
  private consumer: Consumer;
  private producer: Producer;
  private logger: Logger;
  private kafka: Kafka;

  constructor(
    @Inject(FETCH_NFT_DATA_SERVICE) private readonly clientKafka: ClientKafka, // @Inject(KAFKA) private readonly kafka: Kafka,
  ) {
    this.kafka = this.clientKafka.createClient<Kafka>();

    this.logger = new Logger(KafkaService.name);
  }
  async onModuleDestroy() {
    this.logger.verbose('Kafka service shutting down...');
    await this.admin.disconnect();
    // await this.consumer.disconnect();
    await this.producer.disconnect();
  }

  async onModuleInit() {
    await this.initializeAdmin();
    // await this.initializeConsumer();
    await this.initializeProducer();
  }
  async initializeAdmin() {
    this.logger.verbose('Admin initializing...');
    this.admin = this.kafka.admin();
    await this.admin.connect();
    const isTopicCreated = await this.createTopics();
    if (!isTopicCreated) {
      this.logger.verbose(`${FETCH_NFT_DATA_TOPIC} topic already exist with ${NUM_PARTITIONS} partitions...`);
      return;
    }
    this.logger.verbose(`Creating ${FETCH_NFT_DATA_TOPIC} with ${NUM_PARTITIONS} partitions...`);
  }
  async initializeProducer() {
    this.logger.verbose('Producer initializing...');

    this.producer = this.kafka.producer({
      idempotent: true,
    });

    await this.producer.connect();
  }

  async initializeConsumer() {
    this.logger.verbose('Consumer initializing...');
    this.consumer = this.kafka.consumer({
      groupId: 'filterNftData-consumer-groupId',
      retry: {
        retries: 2,
        initialRetryTime: 3000,
        maxRetryTime: 30000,
      },
      allowAutoTopicCreation: false,
    });
    await this.consumer.connect();
    await this.consumer.subscribe({ topics: [FILTER_NFT_DATA_TOPIC], fromBeginning: true });
    console.log('consumer Group', await this.consumer.describeGroup());
  }

  async send(topic: string, dto: any, partition: number) {
    await this.producer.send({
      topic,
      acks: -1,
      messages: [{ value: JSON.stringify(dto), partition }],
    });
  }
  async createTopics(): Promise<boolean> {
    try {
      return await this.admin.createTopics({
        topics: [
          {
            topic: FETCH_NFT_DATA_TOPIC,
            numPartitions: NUM_PARTITIONS,
            replicationFactor: REPLICATION_FACTOR,
          },
        ],
      });
    } catch (err) {
      this.logger.error('Error creating topic', err);
    }
  }
}
