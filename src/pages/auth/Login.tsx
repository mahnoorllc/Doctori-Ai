import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useRoleBasedAuth } from '@/hooks/useRoleBasedAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, LogIn, UserPlus, Stethoscope, Shield } from 'lucide-react';

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('user');
  const { signIn, user } = useAuth();
  const { profile, redirectToDashboard } = useRoleBasedAuth();
  const { toast } = useToast();

  // Determine if this is admin login from URL
  const isAdminLogin = location.pathname.includes('/login/admin');

  useEffect(() => {
    if (user && profile) {
      redirectToDashboard();
    }
  }, [user, profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signIn(formData.email, formData.password);

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast({
            title: "Login failed",
            description: "Invalid email or password. Please check your credentials.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Login failed",
            description: error.message,
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Welcome back!",
          description: "You've been logged in successfully.",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const tabConfig = {
    user: {
      title: 'Patient Login',
      description: 'Access your health dashboard',
      icon: UserPlus,
      registerLink: '/auth/register/user'
    },
    provider: {
      title: 'Provider Login',
      description: 'Healthcare professional access',
      icon: Stethoscope,
      registerLink: '/auth/register/provider'
    },
    admin: {
      title: 'Admin Login',
      description: 'Administrative access',
      icon: Shield,
      registerLink: '/auth/register/admin'
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to Doctori AI</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="user">Patient</TabsTrigger>
              <TabsTrigger value="provider">Provider</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>

            {Object.entries(tabConfig).map(([key, config]) => {
              const IconComponent = config.icon;
              return (
                <TabsContent key={key} value={key} className="space-y-4">
                  <div className="text-center">
                    <div className="mx-auto mb-2 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold">{config.title}</h3>
                    <p className="text-sm text-muted-foreground">{config.description}</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter your password"
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign In
                    </Button>
                  </form>

                  <div className="text-center text-sm">
                    Don't have an account?{' '}
                    <Link to={config.registerLink} className="text-primary hover:underline">
                      Register as {key}
                    </Link>
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>

          <div className="mt-6 pt-6 border-t text-center">
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary">
              ← Back to home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}