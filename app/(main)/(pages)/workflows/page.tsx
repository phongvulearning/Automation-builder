import React from "react";
import WorkflowButton from "./_components/workflow-button";
import Workflows from "./_components";

type Props = {};

const Workflow = (props: Props) => {
  return (
    <div className="flex flex-col">
      <h1 className="sticky top-0 z-[10] flex items-center justify-between border-b bg-background/50 p-6 text-4xl backdrop-blur-lg">
        Workflows <WorkflowButton />
      </h1>
      <Workflows />
    </div>
  );
};

export default Workflow;
