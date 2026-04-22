import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { discoverApiEndpoints } from './utils/endpoint-discovery';

const projectRoot = path.resolve(__dirname, '..');
const endpoints = discoverApiEndpoints(projectRoot);

describe('API endpoint coverage', () => {
  it('discovers controller endpoints from source code', () => {
    expect(endpoints.length).toBeGreaterThan(0);
  });

  it('does not contain duplicate method + path pairs', () => {
    const keys = endpoints.map((endpoint) => `${endpoint.method} ${endpoint.path}`);
    const unique = new Set(keys);

    expect(unique.size).toBe(keys.length);
  });

  it('keeps all endpoints under /api global prefix', () => {
    for (const endpoint of endpoints) {
      expect(endpoint.path.startsWith('/api')).toBe(true);
    }
  });
});

describe.each(endpoints)('$method $path', (endpoint) => {
  it('is registered in a controller', () => {
    expect(endpoint.sourceFile.endsWith('.controller.ts')).toBe(true);
    expect(endpoint.handlerName.length).toBeGreaterThan(0);
  });
});
