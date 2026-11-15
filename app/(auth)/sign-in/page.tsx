"use client"

// import type { Metadata } from "next"

import { SignInForm } from "@/components/auth/sign-in-form"



export default function SignInPage() {
  // This page is a Server Component, so it only renders the form.
  // The Better Auth signIn.email call lives inside SignInForm (a Client
  // Component), because event handlers must run in the browser.
  return <SignInForm />
}
