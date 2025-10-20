'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Power, PowerOff, Trash2, ExternalLink, Loader2, RotateCw } from "lucide-react"; 
import { Node } from '../lib/types';

interface NodeCardProps {
  node: Node,
  onActionComplete: () => void;
}

export function NodeCard({ node, onActionComplete }: NodeCardProps) {
  const isRunning = node.status === 'running';
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleAction = async (endpoint: string, successMessage: string, errorMessage:string, body?: object) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/nodes/${node.id}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : null,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorMessage);
      }
      onActionComplete();
      toast.success(successMessage);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRun = () => handleAction('run', `Node started succesfully`, 'Failed to start node.');
  const handleStop = () => handleAction('stop', 'Node stopped successfully.', 'Failed to stop node.');
  const handleWipe = () => handleAction('wipe', 'Node wiped successfully.', 'Failed to wipe node.');
  const handleDelete =() => handleAction('delete', `Node deleted successfully`, 'Failed to delete node.');


  // async function openGuacConsole(nodeId: string) {
  //   try {
  //     const res = await fetch(`/api/guac/connect/${nodeId}`);
  //     if (!res.ok) {
  //       const errorText = await res.text();
  //       throw new Error(`Failed to get Guacamole URL: ${errorText}`);
  //     }
  //     const data = await res.json();
  //     if (data.url) {
  //       window.open(data.url, '_blank', 'noopener,noreferrer');
  //     } else {
  //       throw new Error('No Guacamole URL found in the server response.');
  //     }
  //   } catch (error: any) {
  //     console.error('Error opening Guacamole console:', error);
  //     toast.error(error.message || 'Error connecting to VM console.');
  //   }
  // }

  async function openGuacConsole(nodeId: string) {
  //alert("Console access is disabled in this simulation demo. In the full application, this would open a remote console to the virtual machine.");
    window.open('/screenshots/sandbox-3.png', '_blank', 'noopener,noreferrer');
}

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium truncate">Node</CardTitle>
          <Badge variant={isRunning ? "default" : "secondary"} className={isRunning ? "bg-green-500 text-white" : ""}>
            {node.status.charAt(0).toUpperCase() + node.status.slice(1)}
          </Badge>
        </div>
        <CardDescription className="text-xs text-muted-foreground truncate">{node.id}</CardDescription>
      </CardHeader>

      <CardContent className="flex-grow">
        {isRunning && node.vncPort && (
          <Button onClick={() => openGuacConsole(node.id)} className="w-full" disabled={isLoading}>
            Open Console
            <ExternalLink className="h-4 w-4 ml-2"/>
          </Button>
        )}
      </CardContent>

      <CardFooter className="flex justify-end gap-2 pt-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={handleRun} disabled={isRunning || isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Power className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>Run VM</p></TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={handleStop} disabled={!isRunning || isLoading}>
                 {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <PowerOff className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>Stop VM</p></TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={handleWipe} disabled={isLoading}>
                 {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCw className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>Wipe VM</p></TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="destructive" size="icon" onClick={handleDelete} disabled={isLoading}>
                 {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>Delete VM</p></TooltipContent>
          </Tooltip>

        </TooltipProvider>
      </CardFooter>
    </Card>
  );
}


// 'use client';

// import { useState, useEffect } from "react";
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { toast } from "sonner";
// import { Power, PowerOff, Trash2, ExternalLink } from "lucide-react";
// import { Node } from '../lib/types';

// // The NodeCardProps interface is updated to accept the list of available images.
// interface NodeCardProps {
//   node: Node;
//   availableImages: string[];
//   onActionComplete: () => void;
// }

// export function NodeCard({ node, availableImages, onActionComplete }: NodeCardProps) {
//   const isRunning = node.status === 'running';
//   // State to manage the currently selected base image for the dropdown.
//   const [selectedImage, setSelectedImage] = useState<string>('');

//   // Effect to set a default image when the component mounts or the image list changes.
//   useEffect(() => {
//     // If there are images available and no image is currently selected, default to the first one.
//     if (availableImages.length > 0 && !selectedImage) {
//       setSelectedImage(availableImages[0]);
//     }
//   }, [availableImages, selectedImage]);


//   /**
//    * Generic handler for API actions (run, stop, wipe).
//    * It now accepts an optional 'body' parameter for sending data with the request,
//    * which is used to specify the base image when starting a node.
//    */
//   const handleAction = async (endpoint: string, successMessage: string, errorMessage: string, body?: object) => {
//     try {
//       const response = await fetch(`/api/nodes/${node.id}/${endpoint}`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: body ? JSON.stringify(body) : null,
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || errorMessage);
//       }
//       onActionComplete();
//       toast.success(successMessage);
//     } catch (error: any) {
//       console.error(error);
//       toast.error(error.message || errorMessage);
//     }
//   };

//   // The handleRun function now sends the selected base image in the request body.
//   const handleRun = () => {
//     if (!selectedImage) {
//         toast.error("Please select a base image before starting the node.");
//         return;
//     }
//     handleAction('run', `Starting node with ${selectedImage}...`, 'Failed to start node.', { baseImage: selectedImage });
//   }

//   const handleStop = () => handleAction('stop', 'Node stopped successfully.', 'Failed to stop node.');
//   const handleWipe = () => handleAction('wipe', 'Node wiped successfully.', 'Failed to wipe node.');


//   // This function remains the same, it's for opening the Guacamole console.
//   async function openGuacConsole(nodeId: string) {
//     try {
//       const res = await fetch(`/api/guac/connect/${nodeId}`);
//       if (!res.ok) {
//         const errorText = await res.text();
//         throw new Error(`Failed to get Guacamole URL: ${errorText}`);
//       }
//       const data = await res.json();
//       if (data.url) {
//         window.open(data.url, '_blank', 'noopener,noreferrer');
//       } else {
//         throw new Error('No Guacamole URL found in the server response.');
//       }
//     } catch (error: any) {
//       console.error('Error opening Guacamole console:', error);
//       toast.error(error.message || 'Error connecting to VM console.');
//     }
//   }

//   return (
//     <Card className="flex flex-col">
//       <CardHeader>
//         <div className="flex items-center justify-between">
//           <CardTitle className="text-lg font-medium truncate">Node</CardTitle>
//           <Badge variant={isRunning ? "default" : "secondary"} className={isRunning ? "bg-green-500 text-white" : ""}>
//             {node.status.charAt(0).toUpperCase() + node.status.slice(1)}
//           </Badge>
//         </div>
//         <CardDescription className="text-xs text-muted-foreground truncate">{node.id}</CardDescription>
//       </CardHeader>

//       <CardContent className="flex-grow">
//         {/* The content area now dynamically shows either the console button or the image selector */}
//         {isRunning && node.vncPort ? (
//           <Button onClick={() => openGuacConsole(node.id)} className="w-full">
//             Open Console
//             <ExternalLink className="h-4 w-4 ml-2"/>
//           </Button>
//         ) : (
//           <div className="space-y-2">
//             <p className="text-sm text-muted-foreground">Select an image to run.</p>
//             <Select
//               value={selectedImage}
//               onValueChange={setSelectedImage}
//               disabled={isRunning || availableImages.length === 0}
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Select an image" />
//               </SelectTrigger>
//               <SelectContent>
//                 {availableImages.map((image) => (
//                   <SelectItem key={image} value={image}>
//                     {image.replace('.qcow2', '')}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//         )}
//       </CardContent>

//       <CardFooter className="flex justify-end gap-2 pt-4">
//         <TooltipProvider>
//           <Tooltip>
//             <TooltipTrigger asChild>
//               <Button variant="outline" size="icon" onClick={handleRun} disabled={isRunning}>
//                 <Power className="h-4 w-4" />
//               </Button>
//             </TooltipTrigger>
//             <TooltipContent><p>Run VM</p></TooltipContent>
//           </Tooltip>

//           <Tooltip>
//             <TooltipTrigger asChild>
//               <Button variant="outline" size="icon" onClick={handleStop} disabled={!isRunning}>
//                 <PowerOff className="h-4 w-4" />
//               </Button>
//             </TooltipTrigger>
//             <TooltipContent><p>Stop VM</p></TooltipContent>
//           </Tooltip>

//           <Tooltip>
//             <TooltipTrigger asChild>
//               <Button variant="destructive" size="icon" onClick={handleWipe}>
//                 <Trash2 className="h-4 w-4" />
//               </Button>
//             </TooltipTrigger>
//             <TooltipContent><p>Wipe VM</p></TooltipContent>
//           </Tooltip>
//         </TooltipProvider>
//       </CardFooter>
//     </Card>
//   );
// }
