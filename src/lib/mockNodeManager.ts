// src/lib/mockNodeManager.ts

import { Node } from './types';

// In-memory array to act as our database for the simulation
let mockNodes: Node[] = [
  {
    id: 'ab0b9cab-68f7-47fa-aac6-c7333a91156b',
    status: 'stopped',
    pid: null,
    vncPort: null,
    overlayPath: '/mock/path/1',
    baseImage: 'cirros.qcow2',
    guacamoleConnectionId: 'mock-guac-id-1',
    guacamoleUrl: '#',
  },
  {
    id: 'cd4e8dcd-9c0d-4a1d-a64e-2f8a6b3e1a2f',
    status: 'running',
    pid: 12345,
    vncPort: 5901,
    overlayPath: '/mock/path/2',
    baseImage: 'tinycore-11.1.qcow2',
    guacamoleConnectionId: 'mock-guac-id-2',
    guacamoleUrl: '#',
  },
];

// --- Mock API Functions ---

export const mockGetAllNodes = () => {
  return mockNodes;
};

export const mockCreateNode = (baseImage: string): Node => {
  const newNode: Node = {
    id: `mock-${Math.random().toString(36).substring(7)}`,
    status: 'stopped',
    pid: null,
    vncPort: null,
    overlayPath: `/mock/path/${Math.random()}`,
    baseImage: baseImage,
    guacamoleConnectionId: null,
    guacamoleUrl: null,
  };
  mockNodes.push(newNode);
  return newNode;
};

export const mockStartNode = (id: string): Node | null => {
  const node = mockNodes.find((n) => n.id === id);
  if (node) {
    node.status = 'running';
    node.pid = Math.floor(Math.random() * 10000);
    node.vncPort = 5900 + Math.floor(Math.random() * 100);
    node.guacamoleConnectionId = `mock-guac-id-${node.id}`;
  }
  return node || null;
};

export const mockStopNode = (id: string): Node | null => {
  const node = mockNodes.find((n) => n.id === id);
  if (node) {
    node.status = 'stopped';
    node.pid = null;
    node.vncPort = null;
    node.guacamoleConnectionId = null;
  }
  return node || null;
};

export const mockWipeNode = (id: string): Node | null => {
  // In the simulation, wiping is the same as stopping.
  const node = mockNodes.find((n) => n.id === id);
  if (node) {
    node.status = 'stopped';
  }
  return node || null;
};

export const mockDeleteNode = (id: string): boolean => {
  const nodeIndex = mockNodes.findIndex((n) => n.id === id);
  if (nodeIndex > -1) {
    mockNodes.splice(nodeIndex, 1);
    return true;
  }
  return false;
};