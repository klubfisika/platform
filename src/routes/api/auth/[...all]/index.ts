import type { RequestHandler } from '@builder.io/qwik-city';
import { getAuth } from '../../../../lib/auth';
import { toNodeHandler } from 'better-auth/node';

export const onRequest: RequestHandler = async (event) => {
  const auth = getAuth();
  const handler = toNodeHandler(auth.handler);

  const url = new URL(event.request.url);
  const nodeReq = {
    method: event.request.method,
    url: url.pathname + url.search,
    headers: Object.fromEntries(event.request.headers.entries())
  };

  let body = '';
  let status = 200;
  const headers: Record<string, string> = {};

  const nodeRes = {
    writeHead: (s: number, h: Record<string, string>) => { status = s; Object.assign(headers, h); },
    setHeader: (k: string, v: string) => { headers[k] = v; },
    end: (data?: string) => { body = data || ''; }
  };

  try {
    const rawBody = await event.request.text();
    const parsedBody = rawBody ? JSON.parse(rawBody) : {};
    const nodeReqWithBody = { ...nodeReq, body: parsedBody, json: () => Promise.resolve(parsedBody) };

    await handler(nodeReqWithBody as any, nodeRes as any);
    return new Response(body, { status, headers });
  } catch {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
