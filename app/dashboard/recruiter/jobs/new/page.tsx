"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  ChevronRight,
  Globe,
  MapPin,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

// --- Simple option lists shown in the form ---------------------------------

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship"] as const

const CATEGORIES = [
  { value: "engineering", label: "Engineering & Tech" },
  { value: "design", label: "Design & Creative" },
  { value: "marketing", label: "Marketing & Sales" },
  { value: "product", label: "Product & Management" },
  { value: "support", label: "Customer Support" },
  { value: "finance", label: "Finance & Legal" },
  { value: "other", label: "Other" },
] as const

const FREQUENCIES = [
  { value: "per hour", label: "per hour" },
  { value: "per day", label: "per day" },
  { value: "per month", label: "per month" },
  { value: "per year", label: "per year" },
] as const

// --- Form data shape (flat and easy to manage) ------------------------------

type JobForm = {
  title: string
  company: string
  category: string
  jobType: string
  remote: boolean
  location: string
  deadline: string
  salaryMin: string
  salaryMax: string
  salaryFrequency: string
  responsibilities: string
  requirements: string
}

const INITIAL_FORM: JobForm = {
  title: "",
  company: "",
  category: "engineering",
  jobType: "Full-time",
  remote: true,
  location: "",
  deadline: "",
  salaryMin: "",
  salaryMax: "",
  salaryFrequency: "per hour",
  responsibilities: "",
  requirements: "",
}

type FormErrors = Partial<Record<keyof JobForm | "form", string>>

// Shared styles for inputs, selects and textareas so they all match.
const controlClass = "rounded-lg bg-input/30"
const errorTextClass = "text-xs text-destructive"

export default function NewJobPage() {
  const router = useRouter()
  const [form, setForm] = useState<JobForm>(INITIAL_FORM)
  const [errors, setErrors] = useState<FormErrors>({})
  const [pending, setPending] = useState(false)
  // "publishing" is true only while the Publish Job button was used to submit.
  const [publishing, setPublishing] = useState(false)
  const [success, setSuccess] = useState(false)

  // Updates one field and clears its error while typing.
  function update<K extends keyof JobForm>(key: K, value: JobForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  // Quick client-side validation of the required fields.
  function validate(): FormErrors {
    const next: FormErrors = {}
    if (!form.title.trim()) next.title = "Job title is required."
    if (!form.company.trim()) next.company = "Company name is required."
    if (!form.category) next.category = "Select a job category."
    if (!form.remote && !form.location.trim())
      next.location = "Location is required for on-site jobs."
    if (!form.responsibilities.trim())
      next.responsibilities = "Key responsibilities are required."
    if (!form.requirements.trim())
      next.requirements = "Qualifications are required."
    if (form.salaryMin && Number.isNaN(Number(form.salaryMin)))
      next.salaryMin = "Enter a valid number."
    if (form.salaryMax && Number.isNaN(Number(form.salaryMax)))
      next.salaryMax = "Enter a valid number."
    if (
      !next.salaryMin &&
      !next.salaryMax &&
      form.salaryMin &&
      form.salaryMax &&
      Number(form.salaryMin) > Number(form.salaryMax)
    )
      next.salaryMax = "Max salary must be at least the min salary."
    return next
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Which submit button was used? "Publish Job" also marks the job
    // as published; the header "Post Job" button keeps it as a draft.
    const publish =
      (e.nativeEvent as SubmitEvent).submitter?.getAttribute("data-publish") ===
      "true"

    const next = validate()
    if (Object.keys(next).length > 0) {
      setErrors(next)
      return
    }

    setPending(true)
    setPublishing(publish)
    setErrors({})
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, publish }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        setErrors({
          form: data?.error ?? "Something went wrong. Please try again.",
        })
        return
      }
      // Success: show feedback, then send the recruiter to "My Jobs".
      setSuccess(true)
      setTimeout(() => {
        router.push("/dashboard/recruiter/jobs")
        router.refresh()
      }, 1200)
    } catch {
      setErrors({ form: "Network error. Check your connection and retry." })
    } finally {
      setPending(false)
      setPublishing(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-xs text-muted-foreground"
      >
        <Link
          href="/dashboard/recruiter/jobs"
          className="outline-none transition-colors hover:text-foreground focus-visible:underline"
        >
          Manage Jobs
        </Link>
        <ChevronRight aria-hidden="true" className="size-3" />
        <span className="text-foreground">Create New Listing</span>
      </nav>

      {/* Page header */}
      <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Post a New Job
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Fill in the position details to attract qualified talent across
            your network.
          </p>
        </div>
        <Button
          type="submit"
          form="new-job-form"
          size="lg"
          disabled={pending || success}
          className="shrink-0"
        >
          {pending && !publishing ? "Posting..." : "Post Job"}
          <ArrowRight data-icon="inline-end" />
        </Button>
      </div>

      {/* Feedback banners */}
      {success && (
        <div
          role="status"
          className="mt-4 flex items-start gap-2.5 rounded-xl border border-primary/30 bg-primary/10 px-3.5 py-2.5 text-sm text-primary"
        >
          <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          Job posted successfully! Taking you to your listings...
        </div>
      )}
      {errors.form && (
        <div
          role="alert"
          className="mt-4 flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive"
        >
          <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          {errors.form}
        </div>
      )}

      <form
        id="new-job-form"
        noValidate
        onSubmit={handleSubmit}
        className="mt-5 grid gap-5"
      >
        {/* 1. Basic Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="size-1.5 shrink-0 rounded-full bg-primary"
              />
              <CardTitle className="text-sm font-medium">
                1. Basic Information
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title" className="text-xs">
                Job Title <span className="text-muted-foreground">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Frontend Developer"
                autoComplete="off"
                className={cn("h-10", controlClass, errors.title && "border-destructive")}
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                aria-invalid={!!errors.title}
                aria-describedby={errors.title ? "title-error" : undefined}
              />
              {errors.title && (
                <p id="title-error" className={errorTextClass}>
                  {errors.title}
                </p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="company" className="text-xs">
                  Company Name <span className="text-muted-foreground">*</span>
                </Label>
                <Input
                  id="company"
                  placeholder="HireLoop Network"
                  autoComplete="organization"
                  className={cn("h-10", controlClass, errors.company && "border-destructive")}
                  value={form.company}
                  onChange={(e) => update("company", e.target.value)}
                  aria-invalid={!!errors.company}
                  aria-describedby={errors.company ? "company-error" : undefined}
                />
                {errors.company && (
                  <p id="company-error" className={errorTextClass}>
                    {errors.company}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category" className="text-xs">
                  Job Category <span className="text-muted-foreground">*</span>
                </Label>
                <Select
                  items={[...CATEGORIES]}
                  value={form.category}
                  onValueChange={(value) => update("category", String(value))}
                >
                  <SelectTrigger
                    id="category"
                    aria-invalid={!!errors.category}
                    className={cn(
                      "w-full",
                      controlClass,
                      "data-[size=default]:h-10",
                      errors.category && "border-destructive"
                    )}
                  >
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className={errorTextClass}>{errors.category}</p>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label className="text-xs">
                Job Type <span className="text-muted-foreground">*</span>
              </Label>
              <div
                role="radiogroup"
                aria-label="Job type"
                className="grid grid-cols-2 gap-2 sm:grid-cols-4"
              >
                {JOB_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    role="radio"
                    aria-checked={form.jobType === type}
                    onClick={() => update("jobType", type)}
                    className={cn(
                      "h-10 rounded-lg border text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                      form.jobType === type
                        ? "border-primary/60 bg-primary/15 text-primary"
                        : "border-border/60 bg-input/30 text-muted-foreground hover:border-foreground/20 hover:text-foreground"
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2. Location, Compensation & Timeline */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="size-1.5 shrink-0 rounded-full bg-primary"
              />
              <CardTitle className="text-sm font-medium">
                2. Location, Compensation &amp; Timeline
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center justify-between gap-4 rounded-lg border border-border/60 bg-input/30 px-4 py-3">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/15 text-primary"
                >
                  <Globe className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-medium">
                    Remote Work{" "}
                    <span className="font-normal text-muted-foreground">
                      (Allow Remote)
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Enable work-from-anywhere location for this role.
                  </p>
                </div>
              </div>
              <Switch
                checked={form.remote}
                onCheckedChange={(checked) => update("remote", checked)}
                aria-label="Allow remote work"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="location" className="text-xs">
                    Job Location (City){" "}
                    <span className="text-muted-foreground">*</span>
                  </Label>
                  {form.remote && (
                    <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-medium text-primary">
                      Remote-only
                    </span>
                  )}
                </div>
                <div className="relative">
                  <MapPin
                    aria-hidden="true"
                    className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    id="location"
                    placeholder="New York, USA"
                    autoComplete="off"
                    className={cn(
                      "h-10 pl-9",
                      controlClass,
                      errors.location && "border-destructive"
                    )}
                    value={form.location}
                    onChange={(e) => update("location", e.target.value)}
                    aria-invalid={!!errors.location}
                    aria-describedby={
                      errors.location ? "location-error" : undefined
                    }
                  />
                </div>
                {errors.location && (
                  <p id="location-error" className={errorTextClass}>
                    {errors.location}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="deadline" className="text-xs">
                  Application Deadline{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </Label>
                <div className="relative">
                  <CalendarDays
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    id="deadline"
                    type="date"
                    className={cn("h-10 pl-9", controlClass)}
                    value={form.deadline}
                    onChange={(e) => update("deadline", e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="grid gap-2">
                <Label htmlFor="salary-min" className="text-xs">
                  Min Salary / Rate
                </Label>
                <Input
                  id="salary-min"
                  type="number"
                  min="0"
                  step="any"
                  placeholder="€ 25"
                  className={cn("h-10", controlClass, errors.salaryMin && "border-destructive")}
                  value={form.salaryMin}
                  onChange={(e) => update("salaryMin", e.target.value)}
                  aria-invalid={!!errors.salaryMin}
                  aria-describedby={
                    errors.salaryMin ? "salary-min-error" : undefined
                  }
                />
                {errors.salaryMin && (
                  <p id="salary-min-error" className={errorTextClass}>
                    {errors.salaryMin}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="salary-max" className="text-xs">
                  Max Salary / Rate
                </Label>
                <Input
                  id="salary-max"
                  type="number"
                  min="0"
                  step="any"
                  placeholder="€ 40"
                  className={cn("h-10", controlClass, errors.salaryMax && "border-destructive")}
                  value={form.salaryMax}
                  onChange={(e) => update("salaryMax", e.target.value)}
                  aria-invalid={!!errors.salaryMax}
                  aria-describedby={
                    errors.salaryMax ? "salary-max-error" : undefined
                  }
                />
                {errors.salaryMax && (
                  <p id="salary-max-error" className={errorTextClass}>
                    {errors.salaryMax}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="salary-frequency" className="text-xs">
                  Frequency
                </Label>
                <Select
                  items={[...FREQUENCIES]}
                  value={form.salaryFrequency}
                  onValueChange={(value) =>
                    update("salaryFrequency", String(value))
                  }
                >
                  <SelectTrigger
                    id="salary-frequency"
                    className={cn(
                      "w-full",
                      controlClass,
                      "data-[size=default]:h-10"
                    )}
                  >
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {FREQUENCIES.map((frequency) => (
                      <SelectItem key={frequency.value} value={frequency.value}>
                        {frequency.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3. Responsibilities & Requirements */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="size-1.5 shrink-0 rounded-full bg-primary"
              />
              <CardTitle className="text-sm font-medium">
                3. Responsibilities &amp; Requirements
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="responsibilities" className="text-xs">
                Key Responsibilities{" "}
                <span className="text-muted-foreground">*</span>
              </Label>
              <Textarea
                id="responsibilities"
                rows={4}
                placeholder="Showcase your commitment to delivering exceptional user interfaces and digital experiences. You will collaborate directly with systems designers and backend engineers to craft responsive, micro-interaction rich products."
                className={cn("bg-input/30", errors.responsibilities && "border-destructive")}
                value={form.responsibilities}
                onChange={(e) => update("responsibilities", e.target.value)}
                aria-invalid={!!errors.responsibilities}
                aria-describedby={
                  errors.responsibilities ? "responsibilities-error" : undefined
                }
              />
              {errors.responsibilities && (
                <p id="responsibilities-error" className={errorTextClass}>
                  {errors.responsibilities}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="requirements" className="text-xs">
                Qualifications &amp; Requirements{" "}
                <span className="text-muted-foreground">*</span>
              </Label>
              <Textarea
                id="requirements"
                rows={4}
                placeholder={"• 3+ years of experience with React, TypeScript, and modern state architectures\n• Proficiency with Git, accessibility standards, and front-end performance tuning\n• Experience partnering closely with product teams and UI/UX designers"}
                className={cn("bg-input/30", errors.requirements && "border-destructive")}
                value={form.requirements}
                onChange={(e) => update("requirements", e.target.value)}
                aria-invalid={!!errors.requirements}
                aria-describedby={
                  errors.requirements ? "requirements-error" : undefined
                }
              />
              {errors.requirements && (
                <p id="requirements-error" className={errorTextClass}>
                  {errors.requirements}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Publish Job: validates, submits and saves the job as "published" */}
        <div className="flex justify-end">
          <Button
            type="submit"
            size="lg"
            data-publish="true"
            disabled={pending || success}
            className="w-full sm:w-auto"
          >
            {publishing ? "Publishing..." : "Publish Job"}
            <ArrowRight data-icon="inline-end" />
          </Button>
        </div>
      </form>
    </div>
  )
}
