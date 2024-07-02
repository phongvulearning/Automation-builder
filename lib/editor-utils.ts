import { ConnectionProviderProps } from "@/providers/connections-provider";
import { EditorCanvasCardType } from "./types";
import { EditorState } from "@/providers/editor-provider";
import { getDiscordConnectionUrl } from "@/app/(main)/(pages)/connections/_actions/discord-connections";
import {
  getNotionConnectionUrl,
  getNotionDatabse,
} from "@/app/(main)/(pages)/connections/_actions/notion-connections";
import {
  getSlackConnectionUrl,
  listBotChannels,
} from "@/app/(main)/(pages)/connections/_actions/slack-connections";
import { Option } from "@/store";

export const onDragStart = (
  event: any,
  nodeType: EditorCanvasCardType["type"]
) => {
  event.dataTransfer.setData("application/reactflow", nodeType);
  event.dataTransfer.effectAllowed = "move";
};

export const onSlackContent = (
  nodeConnection: ConnectionProviderProps,
  event: React.ChangeEvent<HTMLInputElement>
) => {
  nodeConnection.setSlackNode((prev: any) => ({
    ...prev,
    content: event.target.value,
  }));
};

export const onDiscordContent = (
  nodeConnection: ConnectionProviderProps,
  event: React.ChangeEvent<HTMLInputElement>
) => {
  nodeConnection.setDiscordNode((prev: any) => ({
    ...prev,
    content: event.target.value,
  }));
};

export const onNotionContent = (
  nodeConnection: ConnectionProviderProps,
  event: React.ChangeEvent<HTMLInputElement>
) => {
  nodeConnection.setNotionNode((prev: any) => ({
    ...prev,
    content: event.target.value,
  }));
};

export const onContentChange = (
  nodeConnection: ConnectionProviderProps,
  nodeType: string,
  event: React.ChangeEvent<HTMLInputElement>
) => {
  if (nodeType === "Slack") {
    onSlackContent(nodeConnection, event);
  } else if (nodeType === "Discord") {
    onDiscordContent(nodeConnection, event);
  } else if (nodeType === "Notion") {
    onNotionContent(nodeConnection, event);
  }
};

export const onAddTemplateSlack = (
  nodeConnection: ConnectionProviderProps,
  template: string
) => {
  nodeConnection.setSlackNode((prev: any) => ({
    ...prev,
    content: `${prev.content} ${template}`,
  }));
};

export const onAddTemplateDiscord = (
  nodeConnection: ConnectionProviderProps,
  template: string
) => {
  nodeConnection.setDiscordNode((prev: any) => ({
    ...prev,
    content: `${prev.content} ${template}`,
  }));
};
export const onAddTemplateNotion = (
  nodeConnection: ConnectionProviderProps,
  template: string
) => {
  nodeConnection.setNotionNode((prev: any) => ({
    ...prev,
    content: `${prev.content} ${template}`,
  }));
};

export const onAddTemplate = (
  nodeConnection: ConnectionProviderProps,
  title: string,
  template: string
) => {
  if (title === "Slack") {
    onAddTemplateSlack(nodeConnection, template);
  } else if (title === "Discord") {
    onAddTemplateDiscord(nodeConnection, template);
  } else if (title === "Notion") {
    onAddTemplateNotion(nodeConnection, template);
  }
};

export const onConnections = async (
  nodeConnection: ConnectionProviderProps,
  editorState: EditorState,
  googleFile: any
) => {
  if (editorState.editor.selectedNode.data.type === "Discord") {
    const connection = await getDiscordConnectionUrl();

    if (connection) {
      nodeConnection.setDiscordNode({
        webhookURL: connection.url,
        content: "",
        webhookName: connection.name,
        guildName: connection.guildName,
      });
    }
  }

  if (editorState.editor.selectedNode.data.type === "Notion") {
    const connection = await getNotionConnectionUrl();

    if (connection) {
      nodeConnection.setNotionNode({
        accessToken: connection.accessToken,
        databaseId: connection.databaseId,
        workspaceName: connection.workspaceName,
        content: {
          name: googleFile?.name,
          kind: googleFile?.kind,
          type: googleFile?.mindType,
        },
      });
    }

    if (nodeConnection.notionNode.databaseId !== "") {
      const respone = await getNotionDatabse(
        nodeConnection.notionNode.databaseId,
        nodeConnection.notionNode.accessToken
      );
    }
  }

  if (editorState.editor.selectedNode.data.type === "Slack") {
    const connection = await getSlackConnectionUrl();

    if (connection) {
      nodeConnection.setSlackNode({
        appId: connection.appId,
        userId: connection.userId,
        authedUserId: connection.authedUserId,
        authedUserToken: connection.authedUserToken,
        slackAccessToken: connection.slackAccessToken,
        botUserId: connection.botUserId,
        teamId: connection.teamId,
        teamName: connection.teamName,
        content: "",
      });
    }
  }
};

export const fetchBotSlackChannels = async (
  slackAccessToken: string,
  setSlackChannels: (slackChannels: Option[]) => void
) => {
  await listBotChannels(slackAccessToken)?.then((channels) =>
    setSlackChannels(channels)
  );
};
