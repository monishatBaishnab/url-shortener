import Login from '@/pages/Login';
import NotFound from '@/pages/NotFound';
import Register from '@/pages/Register';
import ResetPass from '@/pages/ResetPass';
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
    path: '/login',
    element: Login,
  },
  {
    path: '/register',
    element: Register,
  },
  {
    path: '/reset-password',
    element: ResetPass,
  },
];
