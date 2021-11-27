import { Controller, Sse, UseGuards } from '@nestjs/common';
import { map, merge, of } from 'rxjs';
import { CryptocurrenciesService } from './cryptocurrencies.service';
import { AuthGuard } from '../auth.guard';

@Controller('cryptocurrencies')
export class CryptocurrenciesController {
  constructor(private cryptocurrenciesService: CryptocurrenciesService) {}

  @UseGuards(AuthGuard)
  @Sse('exchange-rates')
  getExchangeRates() {
    return merge(
      of(this.cryptocurrenciesService.getLatestExchangeRates()),
      this.cryptocurrenciesService.subscribeExchangeRatesChange(),
    ).pipe(map((rates) => ({ data: rates })));
  }
}
