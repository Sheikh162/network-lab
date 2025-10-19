import { Node } from './types';
import { exec } from 'child_process';
import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import { randomUUID } from 'crypto';
import path from 'path';
import { Mutex } from 'async-mutex';
import util from 'util';
import { createGuacamoleConnection, deleteGuacamoleConnection } from './guacamoleService';

const execAsync = util.promisify(exec);

const DB_PATH = path.resolve('./data/nodes.json');
const BASE_IMAGE_PATH = path.resolve('./base_images/base.qcow2');
const OVERLAYS_DIR = path.resolve('./overlays');

const fileMutex = new Mutex();

export async function readNodes(): Promise<Node[]> {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data) as Node[];
  } catch (error) {
    return [];
  }
}

async function writeNodes(nodes: Node[]): Promise<void> {
  await fs.writeFile(DB_PATH, JSON.stringify(nodes, null, 2));
}

export async function getAllNodes(): Promise<Node[]> {
  return fileMutex.runExclusive(async () => {
    const nodes = await readNodes();
    // const { stdout } = await execAsync("ps -o pid= -o comm=");
    // const runningPids = new Set(
    //     stdout.split('\n')
    //     .filter(line => line.includes('qemu-system-x86'))
    //     .map(line => parseInt(line.trim().split(' ')[0]))
    // );
    
    // nodes.forEach(node => {
    //     if (node.status === 'running' && !runningPids.has(node.pid!)) {
    //         console.log(`Cleaning up stale node: ${node.id}`);
    //         node.status = 'stopped';
    //         node.pid = null;
    //         node.vncPort = null;
    //         node.guacamoleUrl = null;
    //         // Optionally delete the Guacamole connection here as well
    //     }
    // });

    // await writeNodes(nodes);
    return nodes;
  });
}

export async function createNode(): Promise<Node> {
  return fileMutex.runExclusive(async () => {
    const nodes = await readNodes();
    const newNodeId = randomUUID();
    const overlayPath = path.join(OVERLAYS_DIR, `${newNodeId}.qcow2`);

    const command = `qemu-img create -f qcow2 -o backing_file=${BASE_IMAGE_PATH},backing_fmt=qcow2 ${overlayPath}`;
    await execAsync(command);

    const newNode: Node = {
      id: newNodeId,
      status: 'stopped',
      pid: null,
      vncPort: null,
      overlayPath: overlayPath,
      guacamoleConnectionId: null,
      guacamoleUrl: null,
    };

    nodes.push(newNode);
    await writeNodes(nodes);
    return newNode;
  });
}

export async function startNode(id: string): Promise<Node> {
  return fileMutex.runExclusive(async () => {
    const nodes = await readNodes();
    const node = nodes.find((n) => n.id === id);

    if (!node) throw new Error('Node not found.');
    if (node.status === 'running') return node;

    const usedPorts = nodes.map(n => n.vncPort).filter(Boolean);
    let vncPort = 5901;
    while (usedPorts.includes(vncPort)) { vncPort++; }

    const qemuProcess = spawn('qemu-system-x86_64', [
        '-drive', `file=${node.overlayPath},if=virtio`,
        '-vnc', `0.0.0.0:${vncPort - 5900}`,
        '-m', '512M'
      ], { detached: true, stdio: 'ignore' }
    );
    qemuProcess.unref();

    node.pid = qemuProcess.pid!;
    node.status = 'running';
    node.vncPort = vncPort;


    // try {
    //   const id = await createGuacamoleConnection(node.id, vncPort);
    //   node.guacamoleConnectionId = id
    //   node.guacamoleUrl = `http://localhost:8080/guacamole/#/client/${encodeURIComponent(id)}`;
    // } catch (error) {
    //   console.error("Failed to auto-register with Guacamole:", error);
    //   process.kill(node.pid); // Kill the VM if registration fails
    //   throw new Error("Failed to register node with Guacamole.");
    // }

    // after node.vncPort assigned, before writeNodes

    // If we already have a stored guacamoleConnectionId, verify it exists or reuse
    if (node.guacamoleConnectionId) {
    } else {
      try {
        const connId = await createGuacamoleConnection(node.id, vncPort, 'host.docker.internal');
        node.guacamoleConnectionId = connId;
        node.guacamoleUrl = `http://localhost:8080/guacamole/#/client/${encodeURIComponent(connId)}`;
      } catch (err) {
        console.error('Failed to auto-register with Guacamole:', err);
        try { process.kill(node.pid); } catch {}
        throw new Error('Failed to register node with Guacamole.');
      }
    }

    
    await writeNodes(nodes);
    return node;
  })
}

export async function stopNode(id: string): Promise<Node> {
    return fileMutex.runExclusive(async () => {
        const nodes = await readNodes();
        const node = nodes.find((n) => n.id === id);
      
        if (!node) throw new Error('Node not found.');
        if (node.status === 'stopped' || !node.pid) return node;
      
        try {
          process.kill(node.pid);
        } catch (error) { }

        if (node.guacamoleConnectionId) {
          await deleteGuacamoleConnection(node.guacamoleConnectionId);
        }
      
        node.pid = null;
        node.status = 'stopped';
        node.vncPort = null;
        node.guacamoleConnectionId = null;
        node.guacamoleUrl = null;
      
        await writeNodes(nodes);
        return node;
    });
}

export async function wipeNode(id: string): Promise<Node> {
    return fileMutex.runExclusive(async () => {
        let nodes = await readNodes();
        let node = nodes.find((n) => n.id === id);

        if (!node) throw new Error('Node not found.');

        if (node.status === 'running') {
            try {
              process.kill(node.pid!);
            } catch (error) { }

            if (node.guacamoleConnectionId) {
              await deleteGuacamoleConnection(node.guacamoleConnectionId);
            }
        }
        
        node.pid = null;
        node.status = 'stopped';
        node.vncPort = null;
        node.guacamoleConnectionId = null;
        node.guacamoleUrl = null;
        await writeNodes(nodes);
        
        await new Promise(resolve => setTimeout(resolve, 500));

        await fs.unlink(node.overlayPath);

        const command = `qemu-img create -f qcow2 -o backing_file=${BASE_IMAGE_PATH},backing_fmt=qcow2 ${node.overlayPath}`;
        await execAsync(command);

        return node;
    });
}
