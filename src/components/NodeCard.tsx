'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { Power, PowerOff, Trash2 } from "lucide-react";
import { Node } from '../lib/types'

interface NodeCardProps {
  node: Node;
  onActionComplete: () => void;
}

export function NodeCard({ node, onActionComplete }: NodeCardProps) {
  const isRunning = node.status === 'running';

  const handleAction = async (endpoint: string, successMessage: string, errorMessage: string) => {
    try {
      const response = await fetch(`/api/nodes/${node.id}/${endpoint}`, { method: 'POST' });
      if (!response.ok) throw new Error(errorMessage);
      onActionComplete();
      toast.success(successMessage);
    } catch (error) {
      console.error(error);
      toast.error(errorMessage);
    }
  };

  const handleRun = () => handleAction('run', 'Node started successfully.', 'Failed to start node.');
  const handleStop = () => handleAction('stop', 'Node stopped successfully.', 'Failed to stop node.');
  const handleWipe = () => handleAction('wipe', 'Node wiped successfully.', 'Failed to wipe node.');

async function openGuacConsole(nodeId: string) {
  try {
    const res = await fetch(`/api/guac/connect/${nodeId}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Failed to get Guacamole URL:', res.status, errorText);
      alert('Failed to open Guacamole console. Check backend logs.');
      return;
    }

    const data = await res.json();

    if (data.url) {
      window.open(data.url, '_blank', 'noopener,noreferrer');
    } else {
      console.warn('No URL found in backend response:', data);
      alert('No Guacamole URL found.');
    }

  } catch (error) {
    console.error('Error opening Guacamole console:', error);
    alert('Error connecting to VM console.');
  }
}

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium truncate">Node</CardTitle>
          <Badge variant={isRunning ? "default" : "secondary"} className={isRunning ? "bg-green-500" : ""}>
            {node.status.charAt(0).toUpperCase() + node.status.slice(1)}
          </Badge>
        </div>
        <CardDescription className="text-xs text-muted-foreground truncate">{node.id}</CardDescription>
      </CardHeader>

      <CardContent>
        {isRunning && node.vncPort ? (
          <Button
            onClick={() => openGuacConsole(node.id)}
            className=""
          >
            Open Console (Port: {node.vncPort})
          </Button>

        ) : (
          <p className="text-sm text-muted-foreground">Node is stopped.</p>
        )}
      </CardContent>

      <CardFooter className="flex justify-end gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={handleRun} disabled={isRunning}>
                <Power className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>Run VM</p></TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={handleStop} disabled={!isRunning}>
                <PowerOff className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>Stop VM</p></TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="destructive" size="icon" onClick={handleWipe}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>Wipe VM</p></TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
}
