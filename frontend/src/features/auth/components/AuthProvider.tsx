import type { PropsWithChildren } from 'react';
import { useInitAuth } from '@/features/auth/hooks/useInitAuth';
import { Loader2 } from "lucide-react";

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const { isLoading } = useInitAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
          <p className="text-sm text-muted-foreground">Ładowanie...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}; 