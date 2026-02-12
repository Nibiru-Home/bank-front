const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1', '::1']);
const SERVER_API_BASE_URL = `//api.bank.nibiruhome.store`;

const isLocalHost = LOCAL_HOSTNAMES.has(window.location.hostname);

export const API_BASE_URL = isLocalHost
    ? ''
    : SERVER_API_BASE_URL;
