import { useTranslation } from 'react-i18next';
import AuthLayout from '../auth-layout';
import TwoColumnAuth from '../components/two-column-auth';
import { UserAuthForm } from './components/user-auth-form';
import './login-styles.css';

export default function SignIn() {
  const { t } = useTranslation();

  return (
    <AuthLayout>
      <div data-testid='sign-in-animation-layer' className='signin-scene' aria-hidden='true' />
      <TwoColumnAuth
        title={t('auth.signIn.title')}
        description={t('auth.signIn.subtitle')}
        rightFooter={<p className='text-xs leading-7 text-muted-foreground sm:text-sm'>{t('auth.signIn.footer.agreement')}</p>}
      >
        <UserAuthForm />
      </TwoColumnAuth>
    </AuthLayout>
  );
}
