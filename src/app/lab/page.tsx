// 'use client';

// import { useState, useEffect } from 'react';
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";
// import { NodeCard } from '@/components/NodeCard';
// import { Node } from '@/lib/types';

// export default function HomePage() {
//   const [nodes, setNodes] = useState<Node[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   const fetchNodes = async () => {
//     try {
//       const url = `${process.env.NEXT_PUBLIC_APP_URL}/api/nodes`; 
//       const response = await fetch(url);
//       if (!response.ok) throw new Error('Failed to fetch nodes');
//       const data = await response.json();
//       if (Array.isArray(data)) {
//         setNodes(data);
//       } else {
//         console.error("API did not return an array:", data);
//         setNodes([]); 
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to load nodes. Please refresh the page.");
//     } finally {
//       setIsLoading(false);
//     }
//   };
//   useEffect(() => {
//     fetchNodes();
//     const interval = setInterval(fetchNodes, 5000); 
//     return () => clearInterval(interval);
//   }, []);

//   const handleAddNode = async () => {
//     try {
//       const url = `${process.env.NEXT_PUBLIC_APP_URL}/api/nodes`; 
//       const response = await fetch(url, { method: 'POST' });
//       if (!response.ok) throw new Error('Failed to create node');
//       await fetchNodes(); 
//       toast.success("New node created successfully!");
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to create new node.");
//     }
//   };

//   return (
//     <main className="container mx-auto p-4 md:p-8">
//       <header className="flex items-center justify-between mb-8">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">Virtual Network Lab</h1>
//           <p className="text-muted-foreground">Manage your QEMU virtual nodes</p>
//         </div>
//         <Button onClick={handleAddNode}>Add Node</Button>
//       </header>

//       {isLoading ? (
//         <p>Loading nodes...</p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {nodes.map((node) => (
//             <NodeCard key={node.id} node={node} onActionComplete={fetchNodes} />
//           ))}
//         </div>
//       )}
//     </main>
//   );
// }

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




// // src/app/page.tsx
// 'use client';

// import { useState, useEffect } from 'react';
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";
// import { NodeCard } from '@/components/NodeCard'; // We will create this next
// import { Node } from '@/lib/types';

// export default function LabPage() {
//   const [nodes, setNodes] = useState<Node[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
// // 1. Create state to hold the list of images
//   const [availableImages, setAvailableImages] = useState<string[]>([]);

//   // 1. Hardcode the list of available images here
// //   const availableImages = [
// //     "cirros-0.5.2-x86_64-disk.img.qcow2",
// //     "tinycore-11.1.qcow2",
// //     "ubuntu-20.04-cloudimg-amd64.qcow2"
// //   ];

// // 2. Add a useEffect to fetch the images when the component mounts
//   useEffect(() => {
//     const fetchImages = async () => {
//       try {
//         const response = await fetch('/api/images');
//         if (!response.ok) {
//           throw new Error('Failed to fetch images');
//         }
//         const imageList = await response.json();
//         setAvailableImages(imageList);
//       } catch (error) {
//         console.error(error);
//         // Handle the error, maybe show a toast
//       }
//     };

//     fetchImages();
//   }, []); // The empty dependency array ensures this runs only once on mount

//   // Function to fetch nodes from the backend
//   const fetchNodes = async () => {
//     try {
//       const url = `${process.env.NEXT_PUBLIC_APP_URL}/api/nodes`;
//       const response = await fetch(url);
//       if (!response.ok) throw new Error('Failed to fetch nodes');
      
//       const data = await response.json();
//       if (Array.isArray(data)) {
//         setNodes(data);
//       } else {
//         console.error("API did not return an array:", data);
//         setNodes([]);
//       }
//     } catch (error) {
//       console.error("Error fetching nodes:", error);
//       toast.error("Failed to load nodes. Please refresh the page.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Fetch nodes on initial load and set up polling
//   useEffect(() => {
//     fetchNodes();
//     const interval = setInterval(fetchNodes, 5000); // Poll every 5 seconds
//     return () => clearInterval(interval); // Cleanup on component unmount
//   }, []);

//   const handleAddNode = async () => {
//     try {
//       const url = `${process.env.NEXT_PUBLIC_APP_URL}/api/nodes`;
//       const response = await fetch(url, { method: 'POST' });
//       if (!response.ok) throw new Error('Failed to create node');
//       await fetchNodes(); // Refresh the list immediately
//       toast.success("New node created successfully!");
//     } catch (error) {
//       console.error("Error creating node:", error);
//       toast.error("Failed to create new node.");
//     }
//   };

//   return (
//     <main className="container mx-auto py-12 md:py-16">
//       <header className="flex items-center justify-between mb-8">
//         <div>
//           <h1 className="text-4xl font-bold tracking-tighter text-foreground md:text-5xl">
//             Virtual Lab
//           </h1>
//           <p className="mt-2 text-lg text-muted-foreground">
//             Manage your QEMU virtual nodes.
//           </p>
//         </div>
//         <Button onClick={handleAddNode} size="lg">Add Node</Button>
//       </header>

//       {isLoading ? (
//         <p className="text-muted-foreground">Loading nodes...</p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {nodes.length > 0 ? (
//             nodes.map((node) => (
//               <NodeCard key={node.id} node={node} onActionComplete={fetchNodes} availableImages={availableImages} />
//             ))
//           ) : (
//             <p className="text-muted-foreground col-span-full text-center">No nodes created yet. Click "Add Node" to get started.</p>
//           )}
//         </div>
//       )}
//     </main>
//   );
// }
