import { Suspense } from "react";
import ResetPasswordTokenReader from "./token-reader";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className='p-6 text-center'>Loading...</div>}>
      <ResetPasswordTokenReader />
    </Suspense>
  );
}
