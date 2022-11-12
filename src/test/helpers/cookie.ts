export function deleteAllCookies() {
  document.cookie.split(';').forEach((cookie) => {
    const equalsIndex = cookie.indexOf('=');
    const name = equalsIndex > -1 ? cookie.substring(0, equalsIndex) : cookie;
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
  });
}
