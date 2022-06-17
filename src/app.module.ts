import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FilterNftModule } from './filter-nft/filter-nft.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FilterNftModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
