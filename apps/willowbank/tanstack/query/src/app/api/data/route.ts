import type { NextRequest } from "next/server";

// A simple endpoint for getting the current list.
let list = ["Item 1", "Item 2", "Item 3"];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const add = searchParams.get("add");

  if (add) {
    if (!list.includes(add)) {
      list.push(add);
    }
  } else if (searchParams.get("clear")) {
    list = [];
  }

  await new Promise((r) => setTimeout(r, 100));

  return Response.json(list);
}
