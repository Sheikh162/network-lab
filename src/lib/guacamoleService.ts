const GUAC_API_URL = process.env.GUAC_API_URL;
const DATA_SOURCE = 'postgresql'; 

export async function getGuacAuthToken(): Promise<{ authToken: string; username: string; dataSource: string }> {
  try {    
    const response = await fetch(`${GUAC_API_URL}/api/tokens`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        username: process.env.GUAC_USER || 'guacadmin',
        password: process.env.GUAC_PASS || 'guacadmin',
      }),
    });

    const text = await response.text();

    if (!response.ok) {
      throw new Error(`Failed to get Guacamole token. Status: ${response.status}`);
    }

    const data = JSON.parse(text);

    if (!data.authToken) {
      console.error('authToken not found in response');
      throw new Error('Guacamole authToken missing in response');
    }

    return data;
  } catch (error) {
    console.error('Error fetching Guacamole auth token:', error);
    throw error;
  }
}

export async function findExistingConnection(nodeId: string, vncPort: number, hostname?: string): Promise<string | null> {
  const { authToken } = await getGuacAuthToken();
  const url = `${GUAC_API_URL}/api/session/data/${DATA_SOURCE}/connections`;

  const res = await fetch(url, {
    method: 'GET',
    headers: { 'Guacamole-Token': authToken }
  });

  if (!res.ok) {
    const txt = await res.text();
    console.warn('Unable to list connections:', res.status, txt);
    return null;
  }

  const conns = await res.json();
  const list = Array.isArray(conns) ? conns : Object.values(conns || {});

  for (const c of list) {
    if (String(c.connection_id) === String(nodeId)) {
      console.log('Found connection by connection_id:', c.connection_id);
      return String(c.connection_id);
    }
    if (c.connection_name && c.connection_name.startsWith(`Node ${nodeId.substring(0, 8)}`)) {
      console.log('Found connection by name:', c.connection_id, c.connection_name);
      return String(c.connection_id);
    }
  }

  return null;
}

export async function createGuacamoleConnection(nodeId: string, vncPort: number, hostname = 'host.docker.internal'): Promise<string> {
  try {
    const existing = await findExistingConnection(nodeId, vncPort, hostname);
    if (existing) {
      return existing;
    }

    const { authToken } = await getGuacAuthToken();
    if (!authToken) throw new Error('No Guacamole auth token available');

    const body = {
      parentIdentifier: 'ROOT',
      name: `Node ${nodeId.substring(0, 8)}`,
      identifier: nodeId, 
      protocol: 'vnc',
      parameters: {
        port: String(vncPort),
        'read-only': '',
        'disable-server-input': '',
        'disable-display-resize': '',
        'swap-red-blue': '',
        cursor: '',
        'color-depth': '',
        'force-lossless': '',
        'compress-level': '',
        'quality-level': '',
        'clipboard-encoding': '',
        'disable-copy': '',
        'disable-paste': '',
        'dest-port': '',
        'recording-exclude-output': '',
        'recording-exclude-mouse': '',
        'recording-include-keys': '',
        'create-recording-path': '',
        'recording-write-existing': '',
        'enable-sftp': '',
        'sftp-port': '',
        'sftp-timeout': '',
        'sftp-server-alive-interval': '',
        'sftp-disable-download': '',
        'sftp-disable-upload': '',
        'enable-audio': '',
        'wol-send-packet': '',
        'wol-udp-port': '',
        'wol-wait-time': '',
        hostname: 'host.docker.internal',
        password: '' 
      },
      attributes: {
        'failover-only': '',
        'guacd-encryption': '',
        weight: '',
        'max-connections': '',
        'guacd-port': '',
        'max-connections-per-user': ''
      }
    };

    console.log('Creating new Guacamole connection with body:', JSON.stringify(body, null, 2));

    const createUrl = `${GUAC_API_URL}/api/session/data/${DATA_SOURCE}/connections`;
    const createRes = await fetch(createUrl, {
      method: 'POST',
      headers: {
        'Guacamole-Token': authToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const text = await createRes.text();
    if (!createRes.ok) {
      console.error('Guacamole create response:', createRes.status, text);
      if (createRes.status === 409 || createRes.status === 400 || createRes.status === 500) {
        const existing2 = await findExistingConnection(nodeId, vncPort, hostname);
        if (existing2) return existing2;
      }
      throw new Error(`Failed to create Guacamole connection: ${createRes.status} ${text}`);
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      throw new Error('Failed to parse Guacamole create response: ' + text);
    }

    const id = data.identifier ?? data.identifier?.toString?.() ?? data.connection_id ?? data.connectionId ?? data.id;
    if (!id) {
      const found = await findExistingConnection(nodeId, vncPort, hostname);
      if (found) return found;
      throw new Error('Could not determine created connection ID from Guacamole response');
    }
    return String(id);
  } catch (err) {
    console.error('createGuacamoleConnection error:', err);
    throw err;
  }
}

export async function deleteGuacamoleConnection(identifier: string): Promise<void> {
  try {
    const { authToken } = await getGuacAuthToken();
    if (!authToken) throw new Error('No Guacamole auth token available');

    const url = `${GUAC_API_URL}/api/session/data/${DATA_SOURCE}/connections/${encodeURIComponent(identifier)}`;

    const res = await fetch(url, {
      method: 'DELETE',
      headers: { 'Guacamole-Token': authToken }
    });

    if (!res.ok) {
      const txt = await res.text();
      console.warn('Delete connection returned:', res.status, txt);
    } else {
    }
  } catch (err) {
    console.error('deleteGuacamoleConnection error:', err);
  }
}