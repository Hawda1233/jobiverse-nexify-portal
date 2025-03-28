
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, CheckCircle, RefreshCw } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { verifyOTP, sendOTP } from "@/lib/otpOperations";

const OTPVerification = () => {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const { currentUser, userData } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if OTP time remains when component loads
  useEffect(() => {
    if (!currentUser) return;
    
    const checkOTPExpiry = async () => {
      try {
        const expiryTime = localStorage.getItem(`otp_expiry_${currentUser.uid}`);
        if (expiryTime) {
          const timeLeft = Math.max(0, Math.floor((parseInt(expiryTime) - Date.now()) / 1000));
          if (timeLeft > 0) {
            setRemainingTime(timeLeft);
          }
        }
      } catch (error) {
        console.error("Error checking OTP expiry:", error);
      }
    };
    
    checkOTPExpiry();
  }, [currentUser]);

  // Countdown timer for OTP expiry
  useEffect(() => {
    if (remainingTime === null || remainingTime <= 0) return;
    
    const timer = setInterval(() => {
      setRemainingTime(prev => prev !== null ? prev - 1 : null);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [remainingTime]);

  // Format seconds to mm:ss
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerifyOTP = async () => {
    if (!currentUser || !otp) return;
    
    setIsVerifying(true);
    try {
      const result = await verifyOTP(currentUser.uid, otp);
      if (result.success) {
        toast({
          title: "Email verified!",
          description: "Your email has been successfully verified.",
        });
        // Clear OTP data
        localStorage.removeItem(`otp_expiry_${currentUser.uid}`);
        setRemainingTime(null);
        
        // Navigate to dashboard
        navigate(userData?.role === "hr" ? "/hr-dashboard" : "/dashboard");
      } else {
        toast({
          title: "Verification failed",
          description: result.message || "The OTP you entered is invalid or has expired.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      toast({
        title: "Verification error",
        description: "An error occurred during verification. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    if (!currentUser) return;
    
    setIsSendingOTP(true);
    try {
      const result = await sendOTP(currentUser);
      if (result.success) {
        // Set expiry time in localStorage for UI countdown
        const expiryTime = Date.now() + (5 * 60 * 1000); // 5 minutes from now
        localStorage.setItem(`otp_expiry_${currentUser.uid}`, expiryTime.toString());
        setRemainingTime(5 * 60); // 5 minutes in seconds
        
        toast({
          title: "OTP sent!",
          description: "A new verification code has been sent to your email.",
        });
      } else {
        toast({
          title: "Failed to send OTP",
          description: result.message || "Could not send verification code. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast({
        title: "Error",
        description: "Failed to send verification code. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSendingOTP(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="h-8 w-8 text-accent" />
          </div>
          <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
          <CardDescription>
            Enter the 6-digit verification code sent to your email
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          
          {remainingTime !== null && remainingTime > 0 && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                OTP expires in <span className="font-medium text-accent">{formatTime(remainingTime)}</span>
              </p>
            </div>
          )}
          
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <p className="text-sm text-center text-yellow-800">
              We've sent a verification code to: <strong>{currentUser?.email}</strong>
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span>Check your email inbox (and spam folder)</span>
            </div>
            <div className="flex items-center text-sm">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span>Enter the 6-digit code from the email</span>
            </div>
            <div className="flex items-center text-sm">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span>Gain full access to your HR dashboard</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button 
            onClick={handleVerifyOTP} 
            className="w-full"
            disabled={isVerifying || otp.length !== 6}
          >
            {isVerifying ? "Verifying..." : "Verify Email"}
          </Button>
          
          <Button 
            onClick={handleResendOTP} 
            variant="outline" 
            className="w-full"
            disabled={isSendingOTP || (remainingTime !== null && remainingTime > 0)}
          >
            {isSendingOTP ? "Sending..." : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Resend Code
              </>
            )}
          </Button>
          
          <div className="text-center w-full mt-2">
            <Button
              onClick={() => navigate("/signin")}
              variant="ghost"
              className="text-xs text-accent hover:underline"
            >
              Back to Sign In
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OTPVerification;
