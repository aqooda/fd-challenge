import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import dayjs from 'dayjs';
import EventEmitter from 'events';
import { fromEvent, interval, lastValueFrom, Observable } from 'rxjs';

type Cryptocurreny = typeof cryptocurrencies[number];

interface ExchangeRateResponse {
  ticker?: ExchangeRateTicker;
  timestamp?: number;
  success: boolean;
  error: string;
}

interface ExchangeRatesCache {
  rates: ExchangeRateTicker[];
  lastUpdatedAt: Date;
}

export interface ExchangeRateTicker {
  base: Cryptocurreny;
  target: 'USD';
  price: string;
  volume: string;
  change: string;
}

const cryptocurrencies = ['BTC', 'ETH', 'LTC', 'XMR', 'XRP', 'DOGE', 'DASH', 'MAID', 'LSK', 'SJCX'] as const;

const REQUEST_EXCHANGE_RATES_INTERVAL_MS = dayjs().add(30, 's').diff();

@Injectable()
export class CryptocurrenciesService {
  private eventEmitter = new EventEmitter();
  private exchangeRatesCache: ExchangeRatesCache = null;
  private logger = new Logger(CryptocurrenciesService.name);

  constructor(private httpService: HttpService) {
    this.requestExchangeRates();

    interval(REQUEST_EXCHANGE_RATES_INTERVAL_MS).subscribe(() => this.requestExchangeRates());
  }

  getLatestExchangeRates() {
    return this.exchangeRatesCache.rates;
  }

  async requestExchangeRate(cryptocurrency: Cryptocurreny) {
    try {
      this.logger.log(`Requesting exchange rate of ${cryptocurrency}`);

      const response = await lastValueFrom(
        this.httpService.get<ExchangeRateResponse>(`${cryptocurrency.toLowerCase()}-usd`),
      );

      if (!response.data.success) {
        this.logger.error(`Failed to request exchange rate of ${cryptocurrency}, error: ${response.data.error}`);
      } else {
        this.logger.log(`Received exchange rate of ${cryptocurrency}`);
      }

      return response.data.ticker;
    } catch (err) {
      this.logger.error(`Failed to request exchange rate of ${cryptocurrency}, error: ${err.message}`);

      throw err;
    }
  }

  async requestExchangeRates() {
    const exchangeRates = (
      await Promise.all(cryptocurrencies.map((cryptocurrency) => this.requestExchangeRate(cryptocurrency)))
    )
      .filter(Boolean)
      .sort((rateA, rateB) => rateA.base.localeCompare(rateB.base));

    this.exchangeRatesCache = {
      rates: exchangeRates,
      lastUpdatedAt: new Date(),
    };

    this.eventEmitter.emit('change', this.exchangeRatesCache.rates);
  }

  subscribeExchangeRatesChange() {
    return fromEvent(this.eventEmitter, 'change') as Observable<ExchangeRateTicker[]>;
  }
}
