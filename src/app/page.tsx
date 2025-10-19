'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { NodeCard } from '@/components/NodeCard';
import { Node } from '@/lib/types';

export default function HomePage() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNodes = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_APP_URL}/api/nodes`; 
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch nodes');
      const data = await response.json();
      if (Array.isArray(data)) {
        setNodes(data);
      } else {
        console.error("API did not return an array:", data);
        setNodes([]); 
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load nodes. Please refresh the page.");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchNodes();
    const interval = setInterval(fetchNodes, 5000); 
    return () => clearInterval(interval);
  }, []);

  const handleAddNode = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_APP_URL}/api/nodes`; 
      const response = await fetch(url, { method: 'POST' });
      if (!response.ok) throw new Error('Failed to create node');
      await fetchNodes(); 
      toast.success("New node created successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create new node.");
    }
  };

  return (
    <main className="container mx-auto p-4 md:p-8">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Virtual Network Lab</h1>
          <p className="text-muted-foreground">Manage your QEMU virtual nodes</p>
        </div>
        <Button onClick={handleAddNode}>Add Node</Button>
      </header>

      {isLoading ? (
        <p>Loading nodes...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {nodes.map((node) => (
            <NodeCard key={node.id} node={node} onActionComplete={fetchNodes} />
          ))}
        </div>
      )}
    </main>
  );
}