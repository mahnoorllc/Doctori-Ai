import { useRoleBasedAuth } from '@/hooks/useRoleBasedAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, Clock, CheckCircle, XCircle, Mail, Phone } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function ProviderPendingPage() {
  const { profile } = useRoleBasedAuth();
  const { signOut } = useAuth();

  const getStatusConfig = () => {
    switch (profile?.approval_status) {
      case 'pending':
        return {
          icon: Clock,
          title: 'Application Under Review',
          description: 'Your provider application is being reviewed by our team.',
          badge: { variant: 'secondary' as const, text: 'Pending Review' },
          color: 'text-yellow-600'
        };
      case 'approved':
        return {
          icon: CheckCircle,
          title: 'Application Approved',
          description: 'Congratulations! Your provider application has been approved.',
          badge: { variant: 'default' as const, text: 'Approved' },
          color: 'text-green-600'
        };
      case 'rejected':
        return {
          icon: XCircle,
          title: 'Application Declined',
          description: 'Unfortunately, your provider application was not approved at this time.',
          badge: { variant: 'destructive' as const, text: 'Rejected' },
          color: 'text-red-600'
        };
      default:
        return {
          icon: AlertCircle,
          title: 'Status Unknown',
          description: 'Unable to determine your application status.',
          badge: { variant: 'secondary' as const, text: 'Unknown' },
          color: 'text-gray-600'
        };
    }
  };

  const config = getStatusConfig();
  const IconComponent = config.icon;

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Provider Status</h1>
          <p className="text-muted-foreground mt-2">
            Welcome to Doctori AI Provider Portal
          </p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className={`mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center bg-background border-2 ${config.color}`}>
              <IconComponent className="w-8 h-8" />
            </div>
            <CardTitle className="text-2xl">{config.title}</CardTitle>
            <CardDescription className="text-lg">
              {config.description}
            </CardDescription>
            <Badge variant={config.badge.variant} className="w-fit mx-auto mt-4">
              {config.badge.text}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-6">
            {profile?.approval_status === 'pending' && (
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  What happens next?
                </h3>
                <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                  <li>• Our team will review your application and credentials</li>
                  <li>• You'll receive an email notification once the review is complete</li>
                  <li>• The review process typically takes 2-5 business days</li>
                  <li>• Make sure to check your email regularly for updates</li>
                </ul>
              </div>
            )}

            {profile?.approval_status === 'approved' && (
              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                  You're all set!
                </h3>
                <p className="text-sm text-green-800 dark:text-green-200">
                  You can now access the full provider dashboard and start connecting with patients.
                  Refresh this page or log out and log back in to access your dashboard.
                </p>
              </div>
            )}

            {profile?.approval_status === 'rejected' && (
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">
                  Need help?
                </h3>
                <p className="text-sm text-red-800 dark:text-red-200 mb-4">
                  If you believe this decision was made in error or you have additional credentials to submit,
                  please contact our support team.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                    <Mail className="w-4 h-4" />
                    <span>support@doctoriai.com</span>
                  </div>
                  <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                    <Phone className="w-4 h-4" />
                    <span>1-800-DOCTOR-AI</span>
                  </div>
                </div>
              </div>
            )}

            <div className="border-t pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{profile?.name}</p>
                  <p className="text-sm text-muted-foreground">Provider Account</p>
                </div>
                <Button variant="outline" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>
            Questions? Contact our support team at{' '}
            <a href="mailto:support@doctoriai.com" className="text-primary hover:underline">
              support@doctoriai.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}