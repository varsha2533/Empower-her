import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Calendar, Phone, MapPin } from 'lucide-react';

// Type definition for SOS Alert from database
interface SOSAlertRecord {
  _id: string;
  contacts: Array<{
    name: string;
    phone: string;
  }>;
  location: {
    lat: number;
    lng: number;
  } | null;
  message: string;
  smsStatus: 'pending' | 'sent' | 'failed' | 'simulated';
  riskScore: number | null;
  riskLevel: string | null;
  recommendation: string | null;
  createdAt: string;
  updatedAt: string;
}

interface PaginationInfo {
  total: number;
  limit: number;
  skip: number;
  hasMore: boolean;
}

const SOSHistory: React.FC = () => {
  // Clerk authentication
  const { user, isSignedIn } = useUser();
  
  const [alerts, setAlerts] = useState<SOSAlertRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);

  // Fetch SOS history from backend
  useEffect(() => {
    const fetchSOSHistory = async () => {
      try {
        // Check if user is authenticated
        if (!isSignedIn || !user?.id) {
          setError('not_signed_in');
          setLoading(false);
          return;
        }
        
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/sos/history?limit=50&userId=${user.id}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch SOS history: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || 'Failed to load SOS history');
        }

        setAlerts(data.alerts);
        setPagination(data.pagination);
      } catch (err: any) {
        console.error('Error fetching SOS history:', err);
        setError(err.message || 'Failed to load SOS history. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchSOSHistory();
  }, []);

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  // Get badge color based on SMS status
  const getStatusColor = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case 'sent':
        return 'default';
      case 'simulated':
        return 'secondary';
      case 'failed':
        return 'destructive';
      case 'pending':
      default:
        return 'outline';
    }
  };

  // Get badge color based on risk level
  const getRiskColor = (level: string | null): 'default' | 'secondary' | 'destructive' | 'outline' => {
    if (!level) return 'outline';
    switch (level.toUpperCase()) {
      case 'HIGH':
        return 'destructive';
      case 'MEDIUM':
        return 'secondary';
      case 'LOW':
        return 'default';
      default:
        return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-calm-lavender via-calm-softWhite to-calm-paleBlue dark:from-calm-deepNavy dark:via-calm-slate dark:to-calm-deepNavy py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 rounded-full bg-gradient-to-r from-empowerHer-primary to-empowerHer-accent1 shadow-lg mb-6">
            <AlertCircle className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-empowerHer-primary via-empowerHer-secondary to-empowerHer-accent1 bg-clip-text text-transparent mb-4">
            Your SOS Alert History
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Track your safety journey and review past emergency alerts
          </p>
        </div>

        {/* Stats */}
        {pagination && (
          <div className="glass-card rounded-3xl p-6 mb-8 border border-empowerHer-primary/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-empowerHer-primary mb-2">{pagination.total}</p>
                <p className="text-sm text-muted-foreground font-medium">Total Alerts</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-empowerHer-accent1 mb-2">
                  {alerts.filter(a => a.smsStatus === 'sent').length}
                </p>
                <p className="text-sm text-muted-foreground font-medium">Successfully Sent</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-red-500 mb-2">
                  {alerts.filter(a => a.smsStatus === 'failed').length}
                </p>
                <p className="text-sm text-muted-foreground font-medium">Failed Attempts</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-empowerHer-primary border-t-transparent mb-6"></div>
            <p className="text-lg text-muted-foreground">Loading SOS history...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && error !== 'not_signed_in' && (
          <div className="glass-card bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 rounded-3xl p-8 mb-8">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-red-100 dark:bg-red-800/50">
                <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-red-900 dark:text-red-100 mb-2">Error Loading History</h3>
                <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && alerts.length === 0 && (
          <div className="glass-card rounded-3xl p-12 text-center border border-empowerHer-primary/20">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-empowerHer-primary/20 to-empowerHer-accent1/20 flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-10 w-10 text-empowerHer-primary" />
            </div>
            <h3 className="text-2xl font-bold text-empowerHer-primary dark:text-empowerHer-lightPurple mb-3">
              {!isSignedIn ? 'Sign In Required' : 'No SOS Alerts Yet'}
            </h3>
            <p className="text-muted-foreground text-lg mb-6">
              {!isSignedIn 
                ? 'Please sign in to view your SOS history' 
                : 'Stay safe! Your alert history will appear here when you need help'
              }
            </p>
            {!isSignedIn && (
              <div className="flex flex-col items-center space-y-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Quick Actions:</p>
                  <div className="flex gap-3 justify-center">
                    <button className="px-4 py-2 bg-empowerHer-primary text-white rounded-lg hover:bg-empowerHer-primary/90 transition-colors">
                      Sign In
                    </button>
                    <button className="px-4 py-2 bg-empowerHer-accent1 text-white rounded-lg hover:bg-empowerHer-accent1/90 transition-colors">
                      Create Account
                    </button>
                  </div>
                </div>
              </div>
            )}
            {isSignedIn && (
              <div className="flex flex-col items-center space-y-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Quick Actions:</p>
                  <div className="flex gap-3 justify-center">
                    <button className="px-4 py-2 bg-empowerHer-primary text-white rounded-lg hover:bg-empowerHer-primary/90 transition-colors">
                      Test SOS
                    </button>
                    <button className="px-4 py-2 bg-empowerHer-accent1 text-white rounded-lg hover:bg-empowerHer-accent1/90 transition-colors">
                      Update Contacts
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Alerts List - Responsive Grid */}
        {!loading && !error && alerts.length > 0 && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {alerts.map((alert) => (
              <Card key={alert._id} className="glass-card rounded-3xl border-2 border-empowerHer-primary/20 hover:border-empowerHer-primary/40 transition-all duration-300 p-8 hover:shadow-2xl transform hover:-translate-y-1">
                {/* Header with Date and Status */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-empowerHer-primary/20 to-empowerHer-accent1/20">
                      <Calendar className="h-6 w-6 text-empowerHer-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Your Alert</p>
                      <p className="text-sm font-bold text-foreground">
                        {formatDate(alert.createdAt)}
                      </p>
                    </div>
                  </div>
                  <Badge variant={getStatusColor(alert.smsStatus)} className="px-3 py-1 rounded-full text-xs font-bold">
                    {alert.smsStatus.toUpperCase()}
                  </Badge>
                </div>

                {/* Risk Assessment */}
                {alert.riskScore !== null && alert.riskLevel && (
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 mb-6 border border-empowerHer-primary/20">
                    <h4 className="text-sm font-bold text-empowerHer-primary uppercase tracking-wider mb-4">
                      Risk Assessment
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/80 dark:bg-card/80 rounded-xl p-4 text-center">
                        <p className="text-xs text-muted-foreground font-medium mb-2">Score</p>
                        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                          {alert.riskScore.toFixed(1)}/10
                        </p>
                      </div>
                      <div className="bg-white/80 dark:bg-card/80 rounded-xl p-4 text-center">
                        <p className="text-xs text-muted-foreground font-medium mb-2">Level</p>
                        <Badge variant={getRiskColor(alert.riskLevel)} className="mt-1">
                          {alert.riskLevel}
                        </Badge>
                      </div>
                    </div>
                    {alert.recommendation && (
                      <div className="mt-4 bg-white/80 dark:bg-card/80 rounded-xl p-4">
                        <p className="text-xs text-muted-foreground font-medium mb-2">Recommendation</p>
                        <p className="text-sm text-foreground">{alert.recommendation}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Emergency Contacts */}
                <div className="mb-6">
                  <p className="text-sm font-bold text-empowerHer-primary uppercase tracking-wider mb-3">Notified Contacts</p>
                  <div className="space-y-2">
                    {alert.contacts.map((contact, idx) => (
                      <div key={idx} className="bg-white/60 dark:bg-card/60 rounded-2xl p-4 flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-empowerHer-primary/20 to-empowerHer-accent1/20">
                          <Phone className="h-5 w-5 text-empowerHer-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-foreground">{contact.name}</p>
                          <p className="text-xs text-muted-foreground font-mono">{contact.phone}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Location */}
                {alert.location && alert.location.lat !== 0 && alert.location.lng !== 0 && (
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-xl bg-gradient-to-br from-empowerHer-primary/20 to-empowerHer-accent1/20">
                        <MapPin className="h-5 w-5 text-empowerHer-primary" />
                      </div>
                      <a
                        href={`https://maps.google.com/?q=${alert.location.lat},${alert.location.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-bold text-empowerHer-primary hover:text-empowerHer-secondary transition-colors"
                      >
                        Your Location
                      </a>
                    </div>
                    <div className="bg-white/60 dark:bg-card/60 rounded-2xl p-4">
                      <p className="text-xs text-muted-foreground font-mono">
                        {alert.location.lat.toFixed(6)}, {alert.location.lng.toFixed(6)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Message */}
                {alert.message && (
                  <div className="mb-4">
                    <p className="text-sm font-bold text-empowerHer-primary uppercase tracking-wider mb-3">Your Message</p>
                    <div className="bg-white/60 dark:bg-card/60 rounded-2xl p-4">
                      <p className="text-sm text-foreground italic">"{alert.message}"</p>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Pagination Info */}
        {pagination && pagination.hasMore && (
          <div className="mt-12 text-center text-muted-foreground">
            <p className="text-lg font-medium">Showing {alerts.length} of {pagination.total} alerts</p>
            <p className="text-sm mt-2">Scroll or load more to see additional alerts</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SOSHistory;
