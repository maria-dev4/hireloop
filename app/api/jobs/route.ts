import { headers } from "next/headers";

import { auth, db } from "@/lib/auth";

// Creates a new job post. Only signed-in recruiters (or admins) are allowed.
export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return Response.json(
      { error: "You must be signed in to post a job." },
      { status: 401 }
    );
  }

  const role = String(session.user.role ?? "");
  if (role !== "recruiter" && role !== "admin") {
    return Response.json(
      { error: "Only recruiters can post jobs." },
      { status: 403 }
    );
  }

  const body = (await request.json().catch(() => null)) as Record<
    string,
    unknown
  > | null;
  if (!body) {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const str = (key: string) =>
    typeof body[key] === "string" ? (body[key] as string).trim() : "";

  const num = (key: string) => {
    const parsed = Number(body[key]);
    return Number.isFinite(parsed) ? parsed : null;
  };

  const title = str("title");
  const company = str("company");
  const category = str("category");
  const remote = body.remote === true;
  // "publish: true" comes from the "Publish Job" button and makes the
  // listing live right away; the header "Post Job" button saves it as open.
  const publish = body.publish === true;
  const location = str("location");
  const deadline = str("deadline");
  const responsibilities = str("responsibilities");
  const requirements = str("requirements");

  // Simple server-side check on the required fields.
  const missing = [
    !title && "job title",
    !company && "company name",
    !category && "job category",
    !remote && !location && "job location",
    !responsibilities && "responsibilities",
    !requirements && "qualifications",
  ].filter(Boolean) as string[];

  if (missing.length > 0) {
    return Response.json(
      { error: `Please fill in: ${missing.join(", ")}.` },
      { status: 400 }
    );
  }

  const deadlineDate = deadline ? new Date(deadline) : null;
  if (deadline && !deadlineDate) {
    return Response.json(
      { error: "The application deadline is not a valid date." },
      { status: 400 }
    );
  }

  try {
    const result = await db.collection("jobs").insertOne({
      title,
      company,
      category,
      jobType: str("jobType") || "Full-time",
      remote,
      location,
      deadline: deadlineDate,
      salaryMin: num("salaryMin"),
      salaryMax: num("salaryMax"),
      salaryFrequency: str("salaryFrequency") || "per month",
      responsibilities,
      requirements,
      status: publish ? "published" : "open",
      recruiterId: session.user.id,
      recruiterName: session.user.name,
      createdAt: new Date(),
    });

    return Response.json(
      { id: result.insertedId.toString() },
      { status: 201 }
    );
  } catch {
    return Response.json(
      { error: "Could not save the job. Please try again." },
      { status: 500 }
    );
  }
}
