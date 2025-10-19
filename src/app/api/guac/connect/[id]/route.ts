import { NextRequest, NextResponse } from 'next/server';
import { getGuacAuthToken } from '../../../../../lib/guacamoleService';
import { readNodes } from '@/lib/nodeManager';

const GUAC_API_URL = process.env.GUAC_API_URL || 'http://localhost:8080/guacamole';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const nodeId = (await params).id;
  try {
    const nodes = await readNodes();
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) {
      console.error(`Node with ID ${nodeId} not found in nodes.json`);
      return NextResponse.json({ error: 'Node not found' }, { status: 404 });
    }
    const { authToken, dataSource, username } = await getGuacAuthToken();
    const connectionId = node.guacamoleConnectionId;
    if (!connectionId) {
      console.error('No Guacamole connection ID found on node.');
      return NextResponse.json(
        { error: 'No Guacamole connection registered for this node.' },
        { status: 400 }
      );
    }

    const clientUrl = `${GUAC_API_URL}/#/client/${encodeURIComponent(
      connectionId
    )}?token=${encodeURIComponent(authToken)}&dataSource=${encodeURIComponent(dataSource)}`;

    try {
      const tunnelUrl = `${GUAC_API_URL}/api/session/tunnels?token=${authToken}`;
      const check = await fetch(tunnelUrl, { method: 'GET' });
    } catch (err) {
      console.warn('Tunnel check failed (non-fatal):', err);
    }

    return NextResponse.json({
      url: clientUrl
    });

  } catch (error: any) {
    console.error('Guacamole connection error:', error.message || error);
    return NextResponse.json({ error: error.message || 'Guacamole connection failed' }, { status: 500 });
  }
}