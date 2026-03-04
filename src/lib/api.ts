const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-lp-tsa.onrender.com';

type RequestOptions = {
  method?: string;
  body?: unknown;
  token?: string;
};

export async function api<T = unknown>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, token } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Erro desconhecido' }));
    throw new Error(error.message || `Erro ${res.status}`);
  }

  return res.json();
}

export async function apiUpload<T = unknown>(
  endpoint: string,
  formData: FormData,
  options: { token?: string } = {}
): Promise<T> {
  const headers: Record<string, string> = {};
  if (options.token) {
    headers['Authorization'] = `Bearer ${options.token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Erro desconhecido' }));
    throw new Error(error.message || `Erro ${res.status}`);
  }

  return res.json();
}

export { API_URL };
