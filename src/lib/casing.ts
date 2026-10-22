type CasingTransformer = (key: string) => string;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object'
    && value !== null
    && !Array.isArray(value)
    && !(value instanceof Date)
    && !(value instanceof RegExp)
    && !(value instanceof Map)
    && !(value instanceof Set);
}

function transformKeys<T>(value: T, transformer: CasingTransformer): T {
  if (Array.isArray(value)) {
    return value.map((item) => transformKeys(item, transformer)) as unknown as T;
  }

  if (isPlainObject(value)) {
    const result = {} as Record<string, unknown>;
    for (const [key, val] of Object.entries(value)) {
      result[transformer(key)] = transformKeys(val, transformer);
    }
    return result as unknown as T;
  }

  return value;
}

function toPascalCase(key: string): string {
  if (!key) return key;
  return key.charAt(0).toUpperCase() + key.slice(1);
}

function toCamelCase(key: string): string {
  if (!key) return key;
  return key.charAt(0).toLowerCase() + key.slice(1);
}

export function toPascalCaseKeys<T>(value: T): T {
  return transformKeys(value, toPascalCase);
}

export function toCamelCaseKeys<T>(value: T): T {
  return transformKeys(value, toCamelCase);
}
