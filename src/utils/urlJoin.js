export default function (...args) {
  const url = args
    .filter(item => item)
    .map((item) => {
      item = String(item);
      return item.replace(/(^\/+|\/+$)/g, '');
    })
    .join('/')
    .replace(/\/\?/, '?');

  return args[0] ? url : `/${url}`;
}
