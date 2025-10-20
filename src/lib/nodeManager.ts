import { Node } from './types';
import { exec } from 'child_process';
import { spawn } from 'child_process';
import fs from 'fs/promises';
import fsSync from 'fs';
import { randomUUID } from 'crypto';
import path from 'path';
import { Mutex } from 'async-mutex';
import util from 'util';
import { createGuacamoleConnection, deleteGuacamoleConnection } from './guacamoleService';

const execAsync = util.promisify(exec);

const DB_PATH = path.resolve('./data/nodes.json');
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
    return nodes;
  });
}

export async function createNode(baseImage: string): Promise<Node> {
  return fileMutex.runExclusive(async () => {
    const nodes = await readNodes();
    const newNodeId = randomUUID();
    const overlayPath = path.join(OVERLAYS_DIR, `${newNodeId}.qcow2`);
    const BASE_IMAGE_PATH = path.resolve(`./base_images/${baseImage}`); 

    if (!fsSync.existsSync(BASE_IMAGE_PATH)) {
      throw new Error(`Base image not found: ${BASE_IMAGE_PATH}`);
    }

    const command = `qemu-img create -f qcow2 -o backing_file=${BASE_IMAGE_PATH},backing_fmt=qcow2 ${overlayPath}`;
    await execAsync(command);

    const newNode: Node = {
      id: newNodeId,
      status: 'stopped',
      pid: null,
      vncPort: null,
      overlayPath,
      baseImage:BASE_IMAGE_PATH,
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
    if (!node) {
      console.error(`Node ${id} not found.`);
      throw new Error('Node not found.');
    }

    console.log(`Node found:`, node);

    if (node.status === 'running') {
      try {
        process.kill(node.pid!);
      } catch (error) {
        console.warn(`Failed to kill process ${node.pid}:`, error);
      }

      if (node.guacamoleConnectionId) {
        try {
          await deleteGuacamoleConnection(node.guacamoleConnectionId);
        } catch (error) {
          console.warn(`Failed to delete Guacamole connection:`, error);
        }
      }
    }

    node.pid = null;
    node.status = 'stopped';
    node.vncPort = null;
    node.guacamoleConnectionId = null;
    node.guacamoleUrl = null;

    await writeNodes(nodes);
    await new Promise(resolve => setTimeout(resolve, 500));
    try {
      await fsSync.unlinkSync(node.overlayPath);
    } catch (error) {
      console.error(` Failed to delete overlay: ${node.overlayPath}`, error);
    }

    const command = `qemu-img create -f qcow2 -o backing_file=${node.baseImage},backing_fmt=qcow2 ${node.overlayPath}`;
    console.log(`Recreating overlay with command: ${command}`);

    try {
      await execAsync(command);
    } catch (error) {
      console.error(`Failed to recreate overlay:`, error);
    }

    return node;
  });
}


export async function deleteNode(id: string): Promise<void> {
  return fileMutex.runExclusive(async () => {
    let nodes = await readNodes();
    const nodeIndex = nodes.findIndex((n) => n.id === id);

    if (nodeIndex === -1) {
      throw new Error('Node not found.');
    }
    
    const node = nodes[nodeIndex];

    if (node.status === 'running' && node.pid) {
      console.log(`Stopping running node ${id} (PID: ${node.pid}) before deletion.`);
      try {
        process.kill(node.pid);
      } catch (error) {
        console.warn(`Failed to kill process ${node.pid}, it may have already stopped.`, error);
      }
      if (node.guacamoleConnectionId) {
        try {
          await deleteGuacamoleConnection(node.guacamoleConnectionId);
        } catch (error) {
          console.warn(`Failed to delete Guacamole connection:`, error);
        }
      }
    }
    try {
      await fs.unlink(node.overlayPath);
    } catch (error) {
      console.error(`Failed to delete overlay file: ${node.overlayPath}`, error);
    }
    nodes.splice(nodeIndex, 1);
    await writeNodes(nodes);
  });
}