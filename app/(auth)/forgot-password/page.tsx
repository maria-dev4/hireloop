import type { Metadata } from "next"

import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"

export const metadata: Metadata = {
  title: "Password recovery | HireLoop",
  description: "Reset your HireLoop account password.",
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />
}
