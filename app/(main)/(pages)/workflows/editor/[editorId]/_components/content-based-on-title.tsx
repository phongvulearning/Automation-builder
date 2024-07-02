import { AccordionContent } from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { onContentChange } from "@/lib/editor-utils";
import { nodeMapper } from "@/lib/types";
import { ConnectionProviderProps } from "@/providers/connections-provider";
import { EditorState } from "@/providers/editor-provider";
import { Option } from "@/store";
import React, { useCallback, useEffect } from "react";
import GoogleFileDetails from "./google-file-details";
import GoogleDriveFiles from "./google-drive-files";
import ActionButton from "./action-button";
import axios from "axios";
import { toast } from "sonner";

type Props = {
  nodeConnection: ConnectionProviderProps;
  newState: EditorState;
  file: any;
  setFile: (file: any) => void;
  selectedSlackChannels: Option[];
  setSelectedSlackChannels: (selectedSlackChannels: Option[]) => void;
};

const ContentBasedOnTitle = ({
  nodeConnection,
  newState,
  file,
  setFile,
  selectedSlackChannels,
  setSelectedSlackChannels,
}: Props) => {
  const { selectedNode } = newState.editor;
  const title = selectedNode.data.title;
  const type = selectedNode.data.type;

  useEffect(() => {
    const reqGoogle = async () => {
      const response: { data: { message: { files: any } } } = await axios.get(
        "/api/drive"
      );
      console.log("response", response);
      if (response) {
        setFile(response.data.message.files[0]);
      } else {
        toast.error("Something went wrong");
      }
    };
    reqGoogle();
  }, []);

  //@ts-ignore
  const nodeConnectionType: any = nodeConnection?.[nodeMapper[type]];

  if (!nodeConnectionType) return <p>Not connected</p>;

  const isConnected =
    title === "Google Drive"
      ? !nodeConnection.isLoading
      : !!nodeConnectionType[
          `${
            title === "Slack"
              ? "slackAccessToken"
              : title === "Discord"
              ? "webhookURL"
              : title === "Notion"
              ? "accessToken"
              : ""
          }`
        ];

  if (!isConnected) return <p>Not connected</p>;

  return (
    <AccordionContent>
      <Card>
        {title === "Discord" && (
          <CardHeader>
            <CardTitle>{nodeConnectionType.webhookName}</CardTitle>
            <CardDescription>{nodeConnectionType.guildName}</CardDescription>
          </CardHeader>
        )}
        <div className="flex flex-col gap-3 px-6 py-3 pb-20">
          <p>{title === "Notion" ? "Values to be stored" : "Message"}</p>
          <Input
            type="text"
            value={nodeConnectionType.content}
            onChange={(event) => onContentChange(nodeConnection, title, event)}
          />

          {JSON.stringify(file) !== "{}" &&
            file &&
            title !== "Google Drive" && (
              <Card className="w-full">
                <CardContent className="px-2 py-3">
                  <div className="flex flex-col gap-4">
                    <CardDescription>Drive File</CardDescription>
                    <div className="flex flex-wrap gap-2">
                      <GoogleFileDetails
                        nodeConnection={nodeConnection}
                        title={title}
                        gFile={file}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

          {title === "Google Drive" && <GoogleDriveFiles />}

          <ActionButton
            currentService={type}
            nodeConnection={nodeConnection}
            channels={selectedSlackChannels}
            setChannels={setSelectedSlackChannels}
          />
        </div>
      </Card>
    </AccordionContent>
  );
};

export default ContentBasedOnTitle;