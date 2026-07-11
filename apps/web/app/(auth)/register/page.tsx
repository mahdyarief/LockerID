"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, Shield, Eye, EyeOff } from "lucide-react";
import { Logo } from "@/assets/logo";
import { signUp } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc/client";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get("redirect");
  const redirectTo =
    rawRedirect?.startsWith("/") && !rawRedirect.startsWith("//")
      ? rawRedirect
      : null;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const utils = trpc.useUtils();
  const { data: isFirstUserData } = trpc.users.isFirstUser.useQuery();
  const isFirstUser = isFirstUserData?.isFirst ?? false;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Capture isFirstUser before registration to avoid race condition
    const wasFirstUser = isFirstUser;

    try {
      const result = await signUp.email({ name, email, password });
      if (result.error) {
        toast.error(result.error.message ?? "Registration failed");
      } else {
        // Redirect based on whether this WAS the first user (before registration)
        if (wasFirstUser) {
          router.push(redirectTo ?? "/admin");
        } else {
          router.push(redirectTo ?? "/onboarding");
        }
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <Logo className="size-8 text-primary" />
          <span className="text-lg font-semibold">LockerID</span>
        </div>

        <h1 className="text-xl font-semibold tracking-tight mb-1">
          Create account
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          Start storing your files securely
        </p>

        {isFirstUser && (
          <div className="mb-6 rounded-lg border border-primary/30 bg-primary/5 p-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-primary">First User - Superadmin Role</p>
                <p className="text-xs text-muted-foreground">
                  As the first user, you will be assigned the <span className="font-semibold text-foreground">Superadmin</span> role.
                  Superadmins have system-level access to manage all workspaces and users,
                  but cannot create their own workspace.
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Choose a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : "Create account"}
          </Button>
        </form>

        <p className="text-sm text-muted-foreground text-center mt-4">
          Already have an account?{" "}
          <Link
            href={
              redirectTo
                ? `/login?redirect=${encodeURIComponent(redirectTo)}`
                : "/login"
            }
            className="text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
