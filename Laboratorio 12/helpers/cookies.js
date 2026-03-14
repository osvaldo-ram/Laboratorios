function parseCookies(cookieHeader = '') {
  return cookieHeader
    .split(';')
    .map((cookie) => cookie.trim())
    .filter(Boolean)
    .reduce((cookies, cookie) => {
      const separatorIndex = cookie.indexOf('=');

      if (separatorIndex === -1) {
        return cookies;
      }

      const name = cookie.slice(0, separatorIndex).trim();
      const value = cookie.slice(separatorIndex + 1).trim();

      cookies[name] = decodeURIComponent(value);
      return cookies;
    }, {});
}

function buildCookie(name, value, options = {}) {
  const parts = [`${name}=${encodeURIComponent(String(value))}`];

  if (options.maxAge !== undefined) {
    parts.push(`Max-Age=${options.maxAge}`);
  }

  if (options.path) {
    parts.push(`Path=${options.path}`);
  }

  if (options.sameSite) {
    parts.push(`SameSite=${options.sameSite}`);
  }

  if (options.httpOnly) {
    parts.push('HttpOnly');
  }

  if (options.secure) {
    parts.push('Secure');
  }

  return parts.join('; ');
}

function appendCookie(response, name, value, options = {}) {
  const cookieValue = buildCookie(name, value, options);
  const currentHeader = response.getHeader('Set-Cookie');

  if (!currentHeader) {
    response.setHeader('Set-Cookie', [cookieValue]);
    return;
  }

  if (Array.isArray(currentHeader)) {
    response.setHeader('Set-Cookie', [...currentHeader, cookieValue]);
    return;
  }

  response.setHeader('Set-Cookie', [currentHeader, cookieValue]);
}

module.exports = {
  appendCookie,
  parseCookies,
};
