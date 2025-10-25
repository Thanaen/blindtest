"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isPasskeyMode, setIsPasskeyMode] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { data, error } = await authClient.signUp.email({
        email,
        password,
        name,
      });

      if (error) {
        setError(error.message || "Failed to create account");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasskeySignup = async () => {
    setIsLoading(true);
    setError("");

    try {
      // First create account with a random password
      const { data: signupData, error: signupError } = await authClient.signUp.email({
        email,
        password: Math.random().toString(36).slice(-12), // Generate random password as fallback
        name,
      });

      if (signupError) {
        setError(signupError.message || "Failed to create account");
        setIsLoading(false);
        return;
      }

      // Then add passkey to the newly created account
      const passkeyResult = await authClient.passkey.addPasskey({
        name: `${name}'s Passkey`,
      });

      if (passkeyResult?.error) {
        setError(passkeyResult.error.message || "Failed to register passkey. You can add one later from your account settings.");
        // Still redirect even if passkey fails, since account was created
        setTimeout(() => router.push("/dashboard"), 2000);
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError(`Passkey registration failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>
          {isPasskeyMode
            ? "Fill in your name and email to sign up with a passkey"
            : "Enter your details to create a new account"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          {!isPasskeyMode && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                minLength={8}
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          {!isPasskeyMode ? (
            <>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or</span>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  setIsPasskeyMode(true);
                  setError("");
                }}
                disabled={isLoading}
              >
                Sign up with Passkey
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                className="w-full"
                onClick={handlePasskeySignup}
                disabled={isLoading || !name || !email}
              >
                {isLoading ? "Creating account..." : "Create Account with Passkey"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setIsPasskeyMode(false);
                  setError("");
                }}
                disabled={isLoading}
              >
                Use password instead
              </Button>
            </>
          )}
          <p className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <a href="/login" className="text-primary hover:underline">
              Sign in
            </a>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
