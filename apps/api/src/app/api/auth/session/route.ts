import { getCurrentSession } from "@/features/auth/service";

export async function GET() {
  const session = await getCurrentSession();
  return Response.json(session, { status: 200 });
}
