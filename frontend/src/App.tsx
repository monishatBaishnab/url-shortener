import { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import AuthGuard from './components/AuthGuard';
import Loading from './pages/Loading';
import NotFound from './pages/NotFound';
import { PROTECTED_ROUTES, PUBLIC_ROUTES } from './routes/routes';

const App = () => {
  return (
    <main>
      <Routes>
        <Route path="/" element={<Navigate to={'/url-shortener'} />} />

        {/* Public routers */}
        {PROTECTED_ROUTES.map(({ path, element: Element }, idx) => (
          <Route
            path={path}
            key={idx + path}
            element={
              <AuthGuard>
                {Element ? (
                  <Suspense fallback={<Loading />}>
                    <Element />
                  </Suspense>
                ) : (
                  <NotFound />
                )}
              </AuthGuard>
            }
          />
        ))}
        {/* Public routers */}
        {PUBLIC_ROUTES.map(({ path, element: Element }, idx) => (
          <Route
            path={path}
            key={idx + path}
            element={
              <Suspense fallback={<Loading />}>
                <Element />
              </Suspense>
            }
          />
        ))}
      </Routes>
    </main>
  );
};

export default App;
