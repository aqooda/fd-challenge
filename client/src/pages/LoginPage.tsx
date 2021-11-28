import { useRequest } from '@/hooks/useRequest';
import { Button, Card, Center, PasswordInput, SimpleGrid, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { EnvelopeClosedIcon, LockClosedIcon } from '@radix-ui/react-icons';
import React, { useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/auth';
import { useErrorModal } from '@/hooks/useErrorModal';
import { routes } from '@/routes';
import type { AuthInfo } from '@/types/auth';

type FormValues = Record<'email' | 'password', string>;

const LoginPage: React.FC = () => {
  const form = useForm<FormValues>({
    initialValues: {
      email: '',
      password: '',
    },
    validationRules: {
      email: (value: string) => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value),
      password: (value: string) => value.length >= 8 && value.length <= 16,
    },
  });
  const { openModal } = useErrorModal();
  const { loading, submit } = useRequest();
  const { authInfo, updateAuthInfo } = useAuthContext();
  const onEmailChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => form.setFieldValue('email', event.currentTarget.value),
    [form],
  );
  const onPasswordChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => form.setFieldValue('password', event.currentTarget.value),
    [form],
  );
  const onSubmit = useCallback(
    async (values: FormValues) => {
      try {
        const newAuthInfo = await submit<AuthInfo>('/api/auth/login', { method: 'POST', body: JSON.stringify(values) });

        updateAuthInfo(newAuthInfo);
      } catch (err) {
        openModal((err as Error).message);
      }
    },
    [submit, updateAuthInfo, openModal],
  );

  if (authInfo) {
    return <Navigate to={routes.HOME.path} replace />;
  }

  return (
    <Center style={{ height: '100vh' }}>
      <Card style={{ maxWidth: 500, width: '100%' }} shadow="md" padding="lg" withBorder>
        <form onSubmit={form.onSubmit(onSubmit)}>
          <SimpleGrid cols={1} spacing="lg">
            <TextInput
              label="Email"
              placeholder="Any email"
              icon={<EnvelopeClosedIcon />}
              value={form.values.email}
              error={form.errors.email && 'Invalid email'}
              onChange={onEmailChange}
            />

            <PasswordInput
              label="Password"
              placeholder="8 - 16 characters"
              icon={<LockClosedIcon />}
              value={form.values.password}
              error={form.errors.password && 'Invalid password'}
              onChange={onPasswordChange}
            />

            <Button type="submit" loading={loading}>
              Login
            </Button>

            <Text size="sm" color="dimmed">
              * New user will be created automatically for unregistered email.
            </Text>
          </SimpleGrid>
        </form>
      </Card>
    </Center>
  );
};

export default LoginPage;
