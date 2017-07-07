document.cookie.split(';')
  .map(s => s.split('='))
  .forEach(c => {
    if (c[0].trim() === 'tenantId') {
      config.tenantId = Number(c[1]);
    }
    if (c[0].trim() === 'poiId') {
      config.poiId = Number(c[1]);
    };
  });
export default config;
