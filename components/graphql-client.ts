export async function graphqlClient(query: string, variables?: Record<string, unknown>) {
  const res = await fetch("/api/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();
  if (!res.ok || json.errors) {
    const message = json.errors?.[0]?.message || "GraphQL request failed";
    throw new Error(message);
  }
  return json.data;
}
