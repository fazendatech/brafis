import type { BunFile } from "bun";

type CertFile = string | Buffer | BunFile;

interface FetchRequestInitWithTls extends RequestInit {
  tls?: {
    rejectUnauthorized?: boolean | undefined;
    // biome-ignore lint/suspicious/noExplicitAny:
    checkServerIdentity?: any;
    ca?: CertFile | CertFile[];
    cert?: CertFile | CertFile[];
    key?: CertFile | CertFile[];
  };
}

/**
 * @description Wrapper for bun's `fetch`, which allows to pass TLS options with correct typings.
 *
 * @param url
 * @param init
 * @returns {Promise<Response>}
 */
export function fetchWithTls(
  url: string | URL | Request,
  init?: FetchRequestInitWithTls,
): Promise<Response> {
  return fetch(url, init);
}
