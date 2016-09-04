export default function (str) {
  return str
    .replace('-', '_')
    .replace(/([a-z\d])([A-Z])/g, '$1_$2')
    .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1_$2')
    .toUpperCase();
}
