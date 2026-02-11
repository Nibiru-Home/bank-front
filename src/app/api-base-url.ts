const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1', '::1']);

export const API_BASE_URL = LOCAL_HOSTNAMES.has(window.location.hostname)
    ? 'http://localhost:8081'
    : 'http://api.bank.nibiruhome.store';
