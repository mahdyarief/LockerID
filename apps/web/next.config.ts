import type { NextConfig } from "next";

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
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    BLOB_STORAGE_PROVIDER: process.env.BLOB_STORAGE_PROVIDER,
    LOCAL_BLOB_DIR: process.env.LOCAL_BLOB_DIR,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_REGION: process.env.AWS_REGION,
    S3_BUCKET: process.env.S3_BUCKET,
    R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID,
    R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
    R2_BUCKET: process.env.R2_BUCKET,
    R2_PUBLIC_URL: process.env.R2_PUBLIC_URL,
    BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    PLUGIN_ENCRYPTION_SECRET: process.env.PLUGIN_ENCRYPTION_SECRET,
    MAX_FILE_SIZE: process.env.MAX_FILE_SIZE,
    MAX_STORAGE_PER_USER: process.env.MAX_STORAGE_PER_USER,
    AI_GATEWAY_API_KEY: process.env.AI_GATEWAY_API_KEY,
    AI_GATEWAY_MODEL: process.env.AI_GATEWAY_MODEL,
    QMD_SERVICE_URL: process.env.QMD_SERVICE_URL,
    QMD_API_SECRET: process.env.QMD_API_SECRET,
    LOCKER_RUNTIME_ENV: process.env.LOCKER_RUNTIME_ENV,
    DOCKER_CONTAINER: process.env.DOCKER_CONTAINER,
    RENDER_WORKFLOW_SLUG: process.env.RENDER_WORKFLOW_SLUG,
    RENDER_API_KEY: process.env.RENDER_API_KEY,
    S3_API_KEY_ENCRYPTION_SECRET: process.env.S3_API_KEY_ENCRYPTION_SECRET,
  },
};

export default nextConfig;
