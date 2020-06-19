export function formatApi(apiParams) {
  let {base, url, data} = apiParams;

  // base host
  const defaultBase = process.env.REACT_APP_API_HOST.test(/^(https?:)?\/\//)
    ? process.env.REACT_APP_API_HOST
    : `${window.location.protocol}//${process.env.REACT_APP_API_HOST}`;
  if (!base) {
    base = defaultBase;
  }

  // api url with variables, e.g. api.example.com/:id
  if (url.includes(':')) {
    const {compile} = require('path-to-regexp');
    const toPath = compile(url, {encode: encodeURIComponent});
    url = toPath(data);
  }

  return {
    ...apiParams,
    base,
    url,
  };
}
