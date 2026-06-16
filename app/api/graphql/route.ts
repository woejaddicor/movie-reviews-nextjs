import { NextRequest, NextResponse } from "next/server";
import { graphql } from "graphql";
import { schema, rootValue } from "@/lib/graphql";

export async function POST(request: NextRequest) {
  const { query, variables } = await request.json();
  const result = await graphql({
    schema,
    source: query,
    rootValue,
    variableValues: variables,
  });
  return NextResponse.json(result);
}
