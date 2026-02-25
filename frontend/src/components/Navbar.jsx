import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRaw = localStorage.getItem('user');
    const hasToken = Boolean(token);
    const hasUser = Boolean(userRaw);
    setIsAuthenticated(hasToken && hasUser);
    if (userRaw) {
      try {
        const parsed = JSON.parse(userRaw);
        setRole(parsed.role || '');
      } catch {
        setRole('');
      }
    } else {
      setRole('');
    }
  }, [location.pathname]);

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setRole('');
    navigate('/login');
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl tracking-tight">Integra Magna</span>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Home
          </Link>
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                Login
              </Link>
              <Button asChild size="sm">
                <Link to="/signup">Sign Up</Link>
              </Button>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              {(role === 'writer' || role === 'admin') && (
                <Button asChild variant="ghost" size="sm">
                  <Link to="/create-post">Create Post</Link>
                </Button>
              )}
              <div className="flex items-center">
                <span className="text-sm text-muted-foreground bg-secondary px-2.5 py-0.5 rounded-full font-medium">
                  {role}
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
