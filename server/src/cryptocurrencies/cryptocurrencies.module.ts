import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CryptocurrenciesController } from './cryptocurrencies.controller';
import { CryptocurrenciesService } from './cryptocurrencies.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        baseURL: configService.get('EXCHANGE_RATE_API'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [CryptocurrenciesController],
  providers: [CryptocurrenciesService],
})
export class CryptocurrenciesModule {}
