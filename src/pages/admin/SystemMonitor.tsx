import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { 
  ServerIcon, 
  ClockIcon, 
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  CpuChipIcon,
  WifiIcon,
  DatabaseIcon
} from '@heroicons/react/24/outline';

interface CronJob {
  name: string;
  schedule: string;
  status: 'running' | 'stopped' | 'error';
  lastRun?: string;
  nextRun?: string;
  description: string;
}

interface SystemStatus {
  uptime: string;
  memoryUsage: number;
  cpuUsage: number;
  diskUsage: number;
  activeConnections: number;
  databaseStatus: 'connected' | 'disconnected' | 'error';
  apiStatus: 'healthy' | 'degraded' | 'down';
}

const SystemMonitor: React.FC = () => {
  const { api, notification } = useStore();
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [cronJobs, setCronJobs] = useState<CronJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadSystemData();
    const interval = setInterval(loadSystemData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadSystemData = async () => {
    setRefreshing(true);
    try {
      // Mock data for demonstration - replace with actual API calls
      const mockSystemStatus: SystemStatus = {
        uptime: '15 days, 8 hours, 32 minutes',
        memoryUsage: 67,
        cpuUsage: 23,
        diskUsage: 45,
        activeConnections: 142,
        databaseStatus: 'connected',
        apiStatus: 'healthy'
      };

      const mockCronJobs: CronJob[] = [
        {
          name: 'Currency Rate Update',
          schedule: '0 1 * * *',
          status: 'running',
          lastRun: new Date(Date.now() - 3600000).toISOString(),
          nextRun: new Date(Date.now() + 3600000).toISOString(),
          description: 'Updates currency exchange rates daily'
        },
        {
          name: 'Bangkok Weekly Lottery Start',
          schedule: '0 0 * * 6',
          status: 'stopped',
          lastRun: new Date(Date.now() - 86400000).toISOString(),
          nextRun: new Date(Date.now() + 86400000).toISOString(),
          description: 'Starts Bangkok weekly lottery game'
        },
        {
          name: 'Bangkok Weekly Lottery Stop',
          schedule: '30 8 * * 5',
          status: 'running',
          lastRun: new Date(Date.now() - 7200000).toISOString(),
          nextRun: new Date(Date.now() + 86400000).toISOString(),
          description: 'Stops Bangkok weekly lottery game'
        },
        {
          name: 'Dubai Daily Lottery Start',
          schedule: '0 0 * * *',
          status: 'running',
          lastRun: new Date(Date.now() - 3600000).toISOString(),
          nextRun: new Date(Date.now() + 3600000).toISOString(),
          description: 'Starts Dubai daily lottery game'
        },
        {
          name: 'Dubai Daily Lottery Stop',
          schedule: '0 17 * * *',
          status: 'stopped',
          lastRun: new Date(Date.now() - 7200000).toISOString(),
          nextRun: new Date(Date.now() + 3600000).toISOString(),
          description: 'Stops Dubai daily lottery game'
        },
        {
          name: 'Database Cleanup',
          schedule: '0 2 * * 0',
          status: 'running',
          lastRun: new Date(Date.now() - 604800000).toISOString(),
          nextRun: new Date(Date.now() + 604800000).toISOString(),
          description: 'Cleans up old database records weekly'
        }
      ];

      setSystemStatus(mockSystemStatus);
      setCronJobs(mockCronJobs);
    } catch (error) {
      notification.show('Failed to load system data', 'error');
    } finally {
      setRefreshing(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
      case 'connected':
      case 'healthy':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'stopped':
      case 'degraded':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      case 'error':
      case 'disconnected':
      case 'down':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ExclamationTriangleIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
      case 'connected':
      case 'healthy':
        return 'bg-green-100 text-green-800';
      case 'stopped':
      case 'degraded':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
      case 'disconnected':
      case 'down':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getUsageColor = (usage: number) => {
    if (usage < 50) return 'text-green-600';
    if (usage < 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getUsageBarColor = (usage: number) => {
    if (usage < 50) return 'bg-green-500';
    if (usage < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">System Monitor</h1>
              <p className="mt-2 text-gray-600">
                Real-time system performance and cron job monitoring
              </p>
            </div>
            <button
              onClick={loadSystemData}
              disabled={refreshing}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              <ArrowPathIcon className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* System Status Cards */}
        {systemStatus && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ServerIcon className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">System Uptime</dt>
                      <dd className="text-lg font-medium text-gray-900">{systemStatus.uptime}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CpuChipIcon className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">CPU Usage</dt>
                      <dd className={`text-lg font-medium ${getUsageColor(systemStatus.cpuUsage)}`}>
                        {systemStatus.cpuUsage}%
                      </dd>
                    </dl>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getUsageBarColor(systemStatus.cpuUsage)}`}
                      style={{ width: `${systemStatus.cpuUsage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ChartBarIcon className="h-6 w-6 text-purple-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Memory Usage</dt>
                      <dd className={`text-lg font-medium ${getUsageColor(systemStatus.memoryUsage)}`}>
                        {systemStatus.memoryUsage}%
                      </dd>
                    </dl>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getUsageBarColor(systemStatus.memoryUsage)}`}
                      style={{ width: `${systemStatus.memoryUsage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DatabaseIcon className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Disk Usage</dt>
                      <dd className={`text-lg font-medium ${getUsageColor(systemStatus.diskUsage)}`}>
                        {systemStatus.diskUsage}%
                      </dd>
                    </dl>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getUsageBarColor(systemStatus.diskUsage)}`}
                      style={{ width: `${systemStatus.diskUsage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Service Status */}
        {systemStatus && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <DatabaseIcon className="h-8 w-8 text-blue-500" />
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Database</h3>
                    <p className="text-sm text-gray-500">MongoDB Connection</p>
                  </div>
                </div>
                <div className="flex items-center">
                  {getStatusIcon(systemStatus.databaseStatus)}
                  <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(systemStatus.databaseStatus)}`}>
                    {systemStatus.databaseStatus}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <WifiIcon className="h-8 w-8 text-green-500" />
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">API Server</h3>
                    <p className="text-sm text-gray-500">REST API Status</p>
                  </div>
                </div>
                <div className="flex items-center">
                  {getStatusIcon(systemStatus.apiStatus)}
                  <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(systemStatus.apiStatus)}`}>
                    {systemStatus.apiStatus}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <WifiIcon className="h-8 w-8 text-purple-500" />
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Active Connections</h3>
                    <p className="text-sm text-gray-500">Current Users</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{systemStatus.activeConnections}</div>
                  <div className="text-sm text-gray-500">Connected</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cron Jobs */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Cron Jobs</h3>
              <div className="flex items-center space-x-2">
                <ClockIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-500">Automated Tasks</span>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Schedule
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Run
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Next Run
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {cronJobs.map((job, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(job.status)}
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                          {job.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {job.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-mono">
                        {job.schedule}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {job.lastRun ? formatDate(job.lastRun) : 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {job.nextRun ? formatDate(job.nextRun) : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-md">
                        {job.description}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Alerts */}
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">System Alerts</h3>
          <div className="space-y-4">
            {systemStatus && systemStatus.memoryUsage > 80 && (
              <div className="flex items-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-yellow-800">High Memory Usage</h4>
                  <p className="text-sm text-yellow-700">
                    Memory usage is at {systemStatus.memoryUsage}%. Consider optimizing or scaling up.
                  </p>
                </div>
              </div>
            )}
            
            {systemStatus && systemStatus.diskUsage > 80 && (
              <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-red-800">High Disk Usage</h4>
                  <p className="text-sm text-red-700">
                    Disk usage is at {systemStatus.diskUsage}%. Consider cleanup or storage expansion.
                  </p>
                </div>
              </div>
            )}

            {cronJobs.filter(job => job.status === 'error').length > 0 && (
              <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-red-800">Cron Job Errors</h4>
                  <p className="text-sm text-red-700">
                    {cronJobs.filter(job => job.status === 'error').length} cron job(s) have errors.
                  </p>
                </div>
              </div>
            )}

            {(!systemStatus || systemStatus.databaseStatus !== 'connected') && (
              <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
                <XCircleIcon className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-red-800">Database Connection Issue</h4>
                  <p className="text-sm text-red-700">
                    Database connection is not healthy. Check database server status.
                  </p>
                </div>
              </div>
            )}

            {systemStatus && systemStatus.databaseStatus === 'connected' && systemStatus.apiStatus === 'healthy' && (
              <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircleIcon className="h-5 w-5 text-green-400" />
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-green-800">All Systems Operational</h4>
                  <p className="text-sm text-green-700">
                    All critical systems are running normally.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemMonitor; 