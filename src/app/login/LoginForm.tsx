import {
  Column,
  Form,
  FormButtons,
  FormField,
  FormSubmitButton,
  Heading,
  Icon,
  PasswordField,
  Text,
  TextField,
} from '@umami/react-zen';
import { useRouter } from 'next/navigation';
import { useMessages, useUpdateQuery } from '@/components/hooks';
import { Logo } from '@/components/svg';
import { setClientAuthToken } from '@/lib/client';
import { consumeReturnUrl } from '@/lib/return-url';
import { setUser } from '@/store/app';

export function LoginForm() {
  const { t, labels, getErrorMessage } = useMessages();
  const router = useRouter();
  const { mutateAsync, error } = useUpdateQuery('/auth/login');

  const handleSubmit = async (data: any) => {
    await mutateAsync(data, {
      onSuccess: async (response: any) => {
        if (response.requiresTwoFactor) {
          sessionStorage.setItem('umami.partial-token', response.partialToken);
          router.push('/login/two-factor');
          return;
        }
        setClientAuthToken(response.token);
        setUser(response.user);
        router.push(consumeReturnUrl() ?? '/');
      },
    });
  };

  return (
    <Column
      justifyContent="center"
      alignItems="center"
      gap="4"
      style={{
        maxWidth: 380,
        width: '100%',
        padding: '32px 24px',
        borderRadius: 16,
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
      }}
    >
      <img
        src="/logo.png"
        alt="Technocrat Logo"
        style={{ width: 48, height: 48, objectFit: 'contain' }}
      />

      <Column alignItems="center" gap="1" style={{ textAlign: 'center' }}>
        <Heading size="2" style={{ fontWeight: 700 }}>
          Technocrat Analytics
        </Heading>
        <Text color="muted" style={{ fontSize: 14, maxWidth: 300, lineHeight: 1.4 }}>
          Hey, welcome! Log in to check and monitor your website activities.
        </Text>
      </Column>

      <Form
        onSubmit={handleSubmit}
        error={getErrorMessage(error)}
        defaultValues={{ username: '', password: '' }}
        style={{ width: '100%', marginTop: 8 }}
      >
        <FormField
          label={t(labels.username)}
          data-test="input-username"
          name="username"
          rules={{ required: t(labels.required) }}
        >
          <TextField autoComplete="username" />
        </FormField>

        <FormField
          label={t(labels.password)}
          data-test="input-password"
          name="password"
          rules={{ required: t(labels.required) }}
        >
          <PasswordField autoComplete="current-password" />
        </FormField>

        <FormButtons>
          <FormSubmitButton
            data-test="button-submit"
            variant="primary"
            style={{ width: '100%', marginTop: 8 }}
            isDisabled={false}
          >
            {t(labels.login)}
          </FormSubmitButton>
        </FormButtons>
      </Form>
    </Column>
  );
}