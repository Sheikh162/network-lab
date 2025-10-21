'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Node } from '@/lib/types';
import { PlusCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NodeCard } from '@/components/NodeCard';

export default function LabPage() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [availableImages, setAvailableImages] = useState<string[]>([]);
  const [nodesLoading, setNodesLoading] = useState(true);
  const [imagesLoading, setImagesLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');

  // Fetch nodes
  const fetchNodes = async () => {
    setNodesLoading(true);
    try {
      const res = await fetch('/api/nodes');
      if (!res.ok) throw new Error('Failed to fetch nodes');
      const data = await res.json();
      setNodes(data);
    } catch (error) {
      console.error(error);
      toast.error('Could not load nodes.');
    } finally {
      setNodesLoading(false);
    }
  };

  // Fetch images
  const fetchImages = async () => {
    setImagesLoading(true);
    try {
      const res = await fetch('/api/images');
      if (!res.ok) throw new Error('Failed to fetch images');
      const data = await res.json();
      setAvailableImages(data);
    } catch (error) {
      console.error(error);
      toast.error('Could not load available images.');
    } finally {
      setImagesLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchImages();
    fetchNodes();
  }, []);


  // Create new node
  const handleCreateNode = async () => {
    if (!selectedImage) {
      toast.error('Please select a base image first.');
      return;
    }

    try {
      const res = await fetch('/api/nodes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ baseImage: selectedImage }),
      });

      if (!res.ok) throw new Error('Failed to create node');

      // Get the newly created node from the response
      const newNode = await res.json();
      setNodes(prev => [...prev, newNode]); // instant update

      toast.success('New node created successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to create a new node.');
    }
  };

  return (
    <main className="flex-1 p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Lab Dashboard</h1>

        <div className="flex items-center gap-2">
          <Select
            value={selectedImage}
            onValueChange={setSelectedImage}
            disabled={availableImages.length === 0 || imagesLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an image" />
            </SelectTrigger>
            <SelectContent>
              {availableImages.map((image) => (
                <SelectItem key={image} value={image}>
                  {image.replace('.qcow2', '')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={handleCreateNode}
            disabled={!selectedImage}
            className="flex items-center"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Create New Node
          </Button>
        </div>
      </div>

       {nodesLoading ? (
        <p>Loading nodes...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {nodes.map((node) => (
            <NodeCard key={node.id} node={node} onActionComplete={fetchNodes} />
          ))}
        </div>
      )}

      {/* {nodesLoading ? (
        <p>Loading lab environment...</p>
      ) : (
        <NodeGrid
          nodes={nodes}
          availableImages={availableImages}
          onActionComplete={fetchNodes}
        />
      )} */}
      
    </main>
  );
}