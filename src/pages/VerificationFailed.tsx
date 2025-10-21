import { useSearchParams, useNavigate } from 'react-router-dom';

type ErrorType = 'invalid_token' | 'expired_token' | null;

interface ErrorConfig {
  title: string;
  message: string;
  icon: JSX.Element;
}

const VerificationFailed = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const error = searchParams.get('error') as ErrorType;

  const errorConfig: Record<string, ErrorConfig> = {
    invalid_token: {
      title: 'Invalid Verification Link',
      message: 'The verification link is invalid or has already been used.',
      icon: (
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
        />
      )
    },
    expired_token: {
      title: 'Link Expired',
      message: 'This verification link has expired. Please register again to receive a new link.',
      icon: (
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
        />
      )
    },
    default: {
      title: 'Verification Failed',
      message: 'Something went wrong during verification. Please try again.',
      icon: (
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" 
        />
      )
    }
  };

  const config = errorConfig[error || 'default'] || errorConfig.default;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 text-center mx-4">
        {/* Error Icon */}
        <div className="mb-6">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto">
            <svg 
              className="w-12 h-12 text-red-500 dark:text-red-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {config.icon}
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
          {config.title}
        </h1>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          {config.message}
        </p>

        {/* Help Text */}
        <div className="bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-700 rounded-lg p-4 mb-6">
          <p className="text-sm text-orange-800 dark:text-orange-300">
            Need help? Contact our support team at{' '}
            <a href="mailto:support@weez.online" className="font-semibold underline">
              support@weez.online
            </a>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/auth')}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Try Register Again
          </button>
          <button
            onClick={() => navigate('/auth')}
            className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationFailed;
