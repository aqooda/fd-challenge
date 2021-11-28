import { Button, Card, Center, Space, Text, Title } from '@mantine/core';
import React, { useCallback, useEffect, useState } from 'react';
import { useAuthContext } from '@/contexts/auth';
import { useRequest } from '@/hooks/useRequest';
import type { AuthInfo } from '@/types/auth';

import styles from './styles.module.css';

type Cryptocurreny = typeof cryptocurrencies[number];

interface ExchangeRate {
  base: Cryptocurreny;
  target: 'USD';
  price: string;
  volume: string;
  change: string;
}

const cryptocurrencies = ['BTC', 'ETH', 'LTC', 'XMR', 'XRP', 'DOGE', 'DASH', 'MAID', 'LSK', 'SJCX'] as const;

const HomePage: React.FC = () => {
  const { authInfo, updateAuthInfo } = useAuthContext();
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);
  const { submit } = useRequest();
  const { submit: submitLogoutRequest } = useRequest();
  const refreshAccessToken = useCallback(async () => {
    try {
      const newAuthInfo = await submit<AuthInfo>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ refreshToken: authInfo?.refreshToken, type: 'REFRESH_TOKEN' }),
      });

      updateAuthInfo(newAuthInfo);
    } catch (err) {
      updateAuthInfo(null);
    }
  }, [authInfo, submit, updateAuthInfo]);
  const onLogoutClick = useCallback(async () => {
    await submitLogoutRequest('/api/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken: authInfo?.refreshToken }),
    });

    updateAuthInfo(null);
  }, [authInfo, submitLogoutRequest, updateAuthInfo]);

  useEffect(() => {
    const eventSource = new EventSource(`/api/cryptocurrencies/exchange-rates?accessToken=${authInfo?.accessToken}`);
    const eventHandler = (event: MessageEvent) => setExchangeRates(JSON.parse(event.data));

    eventSource.addEventListener('message', eventHandler);
    eventSource.addEventListener('error', refreshAccessToken);

    return () => {
      eventSource.removeEventListener('message', eventHandler);
      eventSource.removeEventListener('error', refreshAccessToken);
      eventSource.close();
    };
  }, [authInfo, refreshAccessToken]);

  return (
    <div>
      <Title order={3}>Cryptocurrency Real-time Exchange Rates</Title>
      <Text size="sm" color="dimmed">
        Auto refresh every 30 secords
      </Text>

      <Space h="md" />

      <div className={styles['exchange-rates-container']}>
        {exchangeRates.map(({ base, target, price, change, volume }) => (
          <Card key={base} withBorder>
            <Text weight="bold">{base}</Text>

            <Text size="sm">{`${target} ${price}`}</Text>
            <Text size="xs" color={Number(change) > 0 ? 'green' : 'red'}>
              {change}
            </Text>

            <Space h="md" />

            <Text size="sm">Volume</Text>
            <Text size="xs">{volume || '-'}</Text>
          </Card>
        ))}
      </div>

      <Space h="lg" />

      <Center>
        <Button onClick={onLogoutClick}>Logout</Button>
      </Center>
    </div>
  );
};

export default HomePage;
