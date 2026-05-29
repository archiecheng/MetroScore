/** Consistent JSON response shape used across all /api/v1/* routes. */

export function ok<T>(data: T, status = 200): Response {
  return Response.json({ success: true, data }, { status });
}

export function err(
  message: string,
  status: number,
  code?: string,
  details?: unknown,
): Response {
  return Response.json(
    {
      success: false,
      error: message,
      ...(code ? { code } : {}),
      ...(details !== undefined ? { details } : {}),
    },
    { status },
  );
}
