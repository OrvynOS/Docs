import { searchIndex } from "@/lib/docs";

// Built once at export time; the search box loads it the first time it opens.
export const dynamic = "force-static";

export function GET() {
  return Response.json(searchIndex());
}
