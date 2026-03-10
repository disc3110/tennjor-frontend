const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  // No lanzar error aquí para no romper el build, pero sí avisar en consola
  console.warn("NEXT_PUBLIC_API_BASE_URL is not set");
}

export async function apiGet<T>(path: string): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  const res = await fetch(url, {
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    console.error(`API GET ${url} failed with status ${res.status}`);
    throw new Error(`API request failed`);
  }

  return res.json() as Promise<T>;
}

export async function apiPost<TResponse, TBody = unknown>(
  path: string,
  body: TBody
): Promise<TResponse> {
  const url = `${API_BASE_URL}${path}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let message = "API request failed";

    try {
      const errorBody = (await res.json()) as { message?: string | string[] };
      if (Array.isArray(errorBody.message)) {
        message = errorBody.message.join(", ");
      } else if (typeof errorBody.message === "string") {
        message = errorBody.message;
      }
    } catch {
      // Keep default message when backend doesn't return JSON
    }

    console.error(`API POST ${url} failed with status ${res.status}`);
    throw new Error(message);
  }

  return res.json() as Promise<TResponse>;
}
