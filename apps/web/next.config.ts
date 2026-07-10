import type { NextConfig } from "next";

// Filter hydration warnings in development
if (process.env.NODE_ENV === "development") {
  const originalConsoleError = console.error;
  console.error = (...args: any[]) => {
    const message = args.join(" ");
    if (message.includes("hydrat") || message.includes("Hydrat")) {
      return;
    }
    originalConsoleError(...args);
  };
}

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: [
    "@locker/common",
    "@locker/database",
    "@locker/email",
    "@locker/storage",
  ],
  serverExternalPackages: ["re2", "just-bash"],
};

export default nextConfig;
