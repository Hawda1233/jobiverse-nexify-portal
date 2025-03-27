
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, CheckCircle, XCircle } from "lucide-react";

const HRVerificationPending = () => {
  const [resendingEmail, setResendingEmail] = useState(false);
  const { currentUser, sendVerificationEmail, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Handle resend verification email
  const handleResendEmail = async () => {
    if (!currentUser) {
      toast({
        title: "Error",
        description: "You need to be signed in to resend the verification email.",
        variant: "destructive",
      });
      return;
    }

    setResendingEmail(true);
    try {
      await sendVerificationEmail(currentUser);
      toast({
        title: "Email sent!",
        description: "Verification email has been resent. Please check your inbox.",
      });
    } catch (error) {
      console.error("Error resending verification email:", error);
    } finally {
      setResendingEmail(false);
    }
  };

  // Handle sign out and return to sign in page
  const handleSignOut = async () => {
    try {
      await logout();
      navigate("/signin");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="h-8 w-8 text-yellow-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
          <CardDescription>
            We've sent a verification email to your company email address.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <p className="text-sm text-center text-yellow-800">
              Before you can access your HR account, please verify your email by clicking the link we sent you.
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span>Check your company email inbox</span>
            </div>
            <div className="flex items-center text-sm">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span>Click the verification link in the email</span>
            </div>
            <div className="flex items-center text-sm">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span>Return to sign in after verification</span>
            </div>
          </div>
          
          <div className="text-center pt-4">
            <p className="text-sm text-muted-foreground mb-2">
              Didn't receive the email? Check your spam folder or try resending.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button 
            onClick={handleResendEmail} 
            variant="outline" 
            className="w-full"
            disabled={resendingEmail}
          >
            {resendingEmail ? "Sending..." : "Resend Verification Email"}
          </Button>
          
          <Button
            onClick={handleSignOut}
            variant="ghost"
            className="w-full"
          >
            Sign Out
          </Button>
          
          <div className="text-center w-full mt-2">
            <Link 
              to="/signin" 
              className="text-xs text-accent hover:underline"
            >
              Back to Sign In
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default HRVerificationPending;
