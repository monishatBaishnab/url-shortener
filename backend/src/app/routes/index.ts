import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.route.js';
const routes = [
  {
    path: '/auth/',
    route: AuthRoutes,
  },
];

const router = Router();

routes.forEach(({ path, route }) => router.use(path, route));

export const AppRoutes = router;
