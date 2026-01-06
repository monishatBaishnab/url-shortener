import ForgotPass from '@/pages/ForgotPass';
import NotFound from '@/pages/NotFound';
import SignIn from '@/pages/SignIn';
import SignUp from '@/pages/SignUp';
import URLShortener from '@/pages/URLShortener';

export const PROTECTED_ROUTES = [
  {
    path: '/url-shortener',
    element: URLShortener,
  },
];

export const PUBLIC_ROUTES = [
  {
    path: '*',
    element: NotFound,
  },
  {
    path: '/sign-in',
    element: SignIn,
  },
  {
    path: '/sign-up',
    element: SignUp,
  },
  {
    path: '/forgot-password',
    element: ForgotPass,
  },
];
