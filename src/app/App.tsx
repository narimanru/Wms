import { RouterProvider } from 'react-router';
import { router } from './routes';
import { useEffect } from 'react';

// Force refresh v1.0.2
export default function App() {
  useEffect(() => {
    // Suppress clipboard permission errors from console.error
    const originalError = console.error;
    console.error = (...args: any[]) => {
      if (args[0]?.toString().includes('Clipboard') || 
          args[0]?.toString().includes('clipboard') ||
          args[0]?.message?.includes('Clipboard') ||
          args[0]?.message?.includes('clipboard')) {
        return;
      }
      originalError.apply(console, args);
    };

    // Suppress clipboard errors from window.error events
    const handleError = (event: ErrorEvent) => {
      if (event.error?.toString().includes('Clipboard') ||
          event.error?.toString().includes('clipboard') ||
          event.error?.message?.includes('Clipboard') ||
          event.error?.message?.includes('clipboard') ||
          event.message?.includes('Clipboard') ||
          event.message?.includes('clipboard')) {
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
    };

    // Suppress clipboard errors from unhandled promise rejections
    const handleRejection = (event: PromiseRejectionEvent) => {
      if (event.reason?.toString().includes('Clipboard') ||
          event.reason?.toString().includes('clipboard') ||
          event.reason?.message?.includes('Clipboard') ||
          event.reason?.message?.includes('clipboard')) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      console.error = originalError;
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  return <RouterProvider router={router} />;
}