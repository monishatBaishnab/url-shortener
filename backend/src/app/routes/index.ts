import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.route.js';
import { LinkRoutes } from '../modules/link/link.route.js';
const routes = [
  {
    path: '/auth/',
    route: AuthRoutes,
  },
  {
    path: '/links/',
    route: LinkRoutes,
  },
];

const router = Router();

routes.forEach(({ path, route }) => router.use(path, route));

export const AppRoutes = router;
