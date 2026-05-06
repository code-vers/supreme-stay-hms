"use client";

import ResetPasswordContent from "@/components/auth/reset-password/reset-password-content";
import { useSearchParams } from "next/navigation";

export default function ResetPasswordTokenReader() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  return <ResetPasswordContent token={token} />;
}
