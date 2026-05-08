import { SignIn, SignUp } from '@clerk/clerk-react';
import { useLocation } from 'react-router-dom';
import type { Appearance } from '@clerk/types';

const AuthPage = () => {
  const location = useLocation();
  const isSignIn = location.pathname === '/sign-in';

  const clerkAppearance: Appearance = {
    elements: {
      formButtonPrimary: 'bg-empowerHer-purple hover:bg-empowerHer-purple/90',
      footerActionLink: 'text-empowerHer-purple hover:text-empowerHer-purple/90',
      card: 'bg-transparent shadow-none h-auto !max-h-none',
      headerTitle: 'text-foreground',
      headerSubtitle: 'text-muted-foreground',
      socialButtonsBlockButton: 'bg-muted hover:bg-muted/90 border-border text-foreground flex items-center gap-2',
      socialButtonsBlockButtonText: 'text-foreground font-medium',
      socialButtonsBlockButtonArrow: 'text-foreground',
      socialButtonsProviderIcon: 'w-5 h-5',
      dividerLine: 'bg-border',
      dividerText: 'text-muted-foreground',
      formFieldLabel: 'text-foreground',
      formFieldInput: 'bg-muted border-border text-foreground placeholder:text-muted-foreground',
      formFieldInputShowPasswordButton: 'text-muted-foreground hover:text-foreground',
      formFieldInputShowPasswordIcon: 'w-4 h-4',
      formButtonIcon: 'w-4 h-4',
      footerActionText: 'text-muted-foreground',
      identityPreviewText: 'text-foreground',
      identityPreviewEditButton: 'text-muted-foreground hover:text-foreground',
      rootBox: 'h-auto !max-h-none',
      form: 'h-auto !max-h-none space-y-4',
    },
    layout: {
      socialButtonsPlacement: "bottom" as const,
      shimmer: true
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-foreground">Welcome to Empower Her</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {isSignIn ? 'Sign in to access your profile and safety features' : 'Create an account to get started'}
          </p>
        </div>

        <div className="h-auto">
          {isSignIn ? (
            <SignIn 
              routing="path"
              path="/sign-in"
              appearance={clerkAppearance}
            />
          ) : (
            <SignUp 
              routing="path"
              path="/sign-up"
              appearance={clerkAppearance}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage; 