import { Button } from '@/components/ui/button';
import useAuth from '@/hooks/useAuth';

const URLShortener = () => {
  const { logout } = useAuth();
  return (
    <div className="flex items-center justify-center">
      <Button onClick={logout}>Logout</Button>
    </div>
  );
};

export default URLShortener;
