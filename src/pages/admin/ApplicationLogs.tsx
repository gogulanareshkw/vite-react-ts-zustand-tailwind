import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { 
  ExclamationTriangleIcon, 
  TrashIcon, 
  MagnifyingGlassIcon,
  CalendarIcon,
  UserIcon,
  CodeBracketIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

interface ApplicationLog {
  _id: string;
  userId?: string;
  errorMethod: string;
  inputPayload: string;
  errorInfo: string;
  createdDateTime: string;
}

const ApplicationLogs: React.FC = () => {
  const { api, notification } = useStore();
  const [logs, setLogs] = useState<ApplicationLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMethod, setFilterMethod] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadLogs();
  }, [currentPage]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const response = await api.getApplicationLogs(currentPage, 50);
      setLogs(response.data || []);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      notification.show('Failed to load application logs', 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteLogs = async () => {
    if (!confirm('Are you sure you want to delete all application logs? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    try {
      await api.deleteApplicationLogs();
      notification.show('Application logs deleted successfully', 'success');
      loadLogs();
    } catch (error) {
      notification.show('Failed to delete application logs', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = searchTerm === '' || 
      log.errorMethod.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.errorInfo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.inputPayload.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterMethod === '' || log.errorMethod === filterMethod;
    
    return matchesSearch && matchesFilter;
  });

  const uniqueMethods = Array.from(new Set(logs.map(log => log.errorMethod)));

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getErrorLevel = (errorInfo: string) => {
    if (errorInfo.toLowerCase().includes('error')) return 'error';
    if (errorInfo.toLowerCase().includes('warning')) return 'warning';
    return 'info';
  };

  const getErrorIcon = (errorInfo: string) => {
    const level = getErrorLevel(errorInfo);
    switch (level) {
      case 'error':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <InformationCircleIcon className="h-5 w-5 text-blue-500" />;
    }
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
              <h1 className="text-3xl font-bold text-gray-900">Application Logs</h1>
              <p className="mt-2 text-gray-600">
                Monitor system events, errors, and application activities
              </p>
            </div>
            <button
              onClick={deleteLogs}
              disabled={deleting}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              {deleting ? 'Deleting...' : 'Delete All Logs'}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Logs</dt>
                    <dd className="text-lg font-medium text-gray-900">{logs.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CodeBracketIcon className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Unique Methods</dt>
                    <dd className="text-lg font-medium text-gray-900">{uniqueMethods.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UserIcon className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">User Errors</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {logs.filter(log => log.userId).length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CalendarIcon className="h-6 w-6 text-purple-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">System Errors</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {logs.filter(log => !log.userId).length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Logs
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by method, error info, or payload..."
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Method
              </label>
              <select
                value={filterMethod}
                onChange={(e) => setFilterMethod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Methods</option>
                {uniqueMethods.map((method) => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Application Logs ({filteredLogs.length})
            </h3>
          </div>
          
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12">
              <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No logs found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || filterMethod ? 'Try adjusting your search criteria.' : 'No application logs available.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLogs.map((log) => (
                    <tr key={log._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getErrorIcon(log.errorInfo)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {log.errorMethod}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {log.userId ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              User Error
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              System Error
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(log.createdDateTime)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          <details className="group">
                            <summary className="cursor-pointer text-green-600 hover:text-green-800">
                              View Details
                            </summary>
                            <div className="mt-2 space-y-2">
                              {log.inputPayload && (
                                <div>
                                  <span className="font-medium text-gray-700">Input Payload:</span>
                                  <pre className="mt-1 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                                    {log.inputPayload}
                                  </pre>
                                </div>
                              )}
                              {log.errorInfo && (
                                <div>
                                  <span className="font-medium text-gray-700">Error Info:</span>
                                  <pre className="mt-1 text-xs bg-red-50 p-2 rounded overflow-x-auto text-red-700">
                                    {log.errorInfo}
                                  </pre>
                                </div>
                              )}
                            </div>
                          </details>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing page <span className="font-medium">{currentPage}</span> of{' '}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationLogs; 