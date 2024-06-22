export function parseCookies(cookieString: string) {
  const cookies: Record<string, any> = {};
  for (const cookie of cookieString.split(';')) {
    const parts = cookie.split('=');
    const name = parts[0].trim();
    let value = parts.slice(1).join('=').trim();

    // Remove quotes if present
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }

    // Decode the value
    value = decodeURIComponent(value);

    // Try to parse JSON if it looks like JSON
    if (value.startsWith('{') && value.endsWith('}')) {
      try {
        value = JSON.parse(value);
      } catch (e) {
        // If parsing fails, keep it as a string
      }
    }

    cookies[name] = value;
  }
  return cookies;
}
