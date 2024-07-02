import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  onCreateNodesEdges,
  onFlowPublish,
} from "../_actions/workflow-connection";

type FlowInstanceProps = {
  nodes: any[];
  edges: any[];
  children: ReactNode;
};

const FlowInstance = ({ nodes, edges, children }: FlowInstanceProps) => {
  const [isFlow, setIsFlow] = useState([]);
  const pathname = usePathname();

  const onFlowAutomation = useCallback(async () => {
    const flow = await onCreateNodesEdges(
      pathname.split("/").pop()!,
      JSON.stringify(nodes),
      JSON.stringify(edges),
      JSON.stringify(isFlow)
    );

    if (flow) toast.success(flow.message);
  }, [edges, isFlow, nodes, pathname]);

  const onPublishWorkFlow = useCallback(async () => {
    const response = await onFlowPublish(pathname.split("/").pop()!, true);
    if (response) toast.success(response.message);
  }, [pathname]);

  const onAutomationFlow = useCallback(async () => {
    const flows: any = [];

    const connectedEdges = edges.map((edge) => edge.target);

    connectedEdges.map((target) => {
      nodes.map((node) => {
        if (node.id === target) {
          flows.push(node.type);
        }
      });
    });

    setIsFlow(flows);
  }, [edges]);

  useEffect(() => {
    onAutomationFlow();
  }, [onAutomationFlow]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-3 p-4">
        <Button onClick={onFlowAutomation} disabled={isFlow.length < 1}>
          Save
        </Button>
        <Button onClick={onPublishWorkFlow} disabled={isFlow.length < 1}>
          Publish
        </Button>
      </div>
      {children}
    </div>
  );
};

export default FlowInstance;
