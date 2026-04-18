import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const HTTP_DECORATORS = ['Get', 'Post', 'Put', 'Patch', 'Delete', 'Options', 'Head'] as const;

export type HttpMethod = Uppercase<(typeof HTTP_DECORATORS)[number]>;

export type ApiEndpoint = {
  sourceFile: string;
  handlerName: string;
  method: HttpMethod;
  path: string;
};

function listControllerFiles(directory: string): string[] {
  const entries = readdirSync(directory);
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      files.push(...listControllerFiles(fullPath));
      continue;
    }

    if (entry.endsWith('.controller.ts')) {
      files.push(fullPath);
    }
  }

  return files;
}

function normalizePath(rawPath: string): string {
  const segments = rawPath
    .split('/')
    .map((part) => part.trim())
    .filter(Boolean);

  return `/${segments.join('/')}`;
}

function parseStringDecoratorArg(rawArgument: string): string {
  const argument = rawArgument.trim();

  if (!argument) {
    return '';
  }

  const literalMatch = argument.match(/^['"`]([^'"`]*)['"`]$/s);
  return literalMatch ? literalMatch[1].trim() : '';
}

function readControllerBasePath(source: string): string {
  const controllerMatch = source.match(/@Controller\(([^)]*)\)/s);
  if (!controllerMatch) {
    return '';
  }

  return parseStringDecoratorArg(controllerMatch[1]);
}

function discoverEndpointsInFile(filePath: string, projectRoot: string): ApiEndpoint[] {
  const source = readFileSync(filePath, 'utf8');
  const basePath = readControllerBasePath(source);
  const endpointRegex = /@(Get|Post|Put|Patch|Delete|Options|Head)\(([^)]*)\)/g;
  const endpoints: ApiEndpoint[] = [];

  let match = endpointRegex.exec(source);

  while (match) {
    const [, methodDecorator, routeArg] = match;
    const methodPath = parseStringDecoratorArg(routeArg);
    const afterDecorator = source.slice(match.index + match[0].length);
    const handlerMatch = afterDecorator.match(
      /\n\s*(?:public\s+|private\s+|protected\s+)?(?:async\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*\(/,
    );

    if (handlerMatch) {
      const fullPath = normalizePath(`/api/${basePath}/${methodPath}`);

      endpoints.push({
        sourceFile: path.relative(projectRoot, filePath).replace(/\\/g, '/'),
        handlerName: handlerMatch[1],
        method: methodDecorator.toUpperCase() as HttpMethod,
        path: fullPath,
      });
    }

    match = endpointRegex.exec(source);
  }

  return endpoints;
}

export function discoverApiEndpoints(projectRoot: string): ApiEndpoint[] {
  const srcPath = path.join(projectRoot, 'src');
  const controllerFiles = listControllerFiles(srcPath);
  const endpoints = controllerFiles
    .flatMap((filePath) => discoverEndpointsInFile(filePath, projectRoot))
    .sort((a, b) => a.path.localeCompare(b.path) || a.method.localeCompare(b.method));

  return endpoints;
}
