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