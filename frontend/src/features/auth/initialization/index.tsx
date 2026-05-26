import { useTranslation } from 'react-i18next';
import AuthLayout from '../auth-layout';
import TwoColumnAuth from '../components/two-column-auth';
import { InitializationForm } from './components/initialization-form';
import '../sign-in/login-styles.css';

export default function Initialization() {
  const { t } = useTranslation();

  return (
    <AuthLayout>
      <div className='signin-scene' aria-hidden='true' />
      <TwoColumnAuth title={t('initialization.title')} description={t('initialization.description')} rightMaxWidthClassName='max-w-2xl'>
        <InitializationForm />
      </TwoColumnAuth>
    </AuthLayout>
  );
}
