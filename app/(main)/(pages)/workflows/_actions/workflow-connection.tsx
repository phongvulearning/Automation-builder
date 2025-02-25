"use server";

import { db } from "@/lib/db";
import { Option } from "@/store";
import { auth, currentUser } from "@clerk/nextjs/server";

export const onCreateWorkflow = async ({
  name,
  description,
}: {
  name: string;
  description: string;
}) => {
  const user = await currentUser();

  if (!user) {
    return { message: "Unauthorize" };
  }

  if (user) {
    const workflow = await db.workflows.create({
      data: {
        userId: user.id,
        name,
        description,
      },
    });
    if (workflow) return { message: "Workflow created successfully" };

    return { message: "Oops! try again" };
  }
};

export const onGetWorkflows = async () => {
  const user = await currentUser();

  if (user) {
    const workflow = await db.workflows.findMany({
      where: {
        userId: user.id,
      },
    });

    if (workflow) return workflow;
  }
};

export const getGoogleListener = async () => {
  const { userId } = auth();

  if (userId) {
    const listener = await db.user.findUnique({
      where: {
        clerkId: userId,
      },
      select: {
        googleResourceId: true,
      },
    });

    if (listener) return listener;
  }
};

export const onCreateNodeTemplate = async (
  content: string,
  type: string,
  workflowId: string,
  channels?: Option[],
  accessToken?: string,
  notionDbId?: string
) => {
  if (type === "Discord") {
    const response = await db.workflows.update({
      where: {
        id: workflowId,
      },
      data: {
        discordTemplate: content,
      },
    });

    if (response) {
      return "Discord template saved";
    }
  }

  if (type === "Notion") {
    const response = await db.workflows.update({
      where: {
        id: workflowId,
      },
      data: {
        notionTemplate: content,
        notionAccessToken: accessToken,
        notionDbId,
      },
    });

    if (response) {
      return "Notion template saved";
    }
  }

  if (type === "Slack") {
    const response = await db.workflows.update({
      where: {
        id: workflowId,
      },
      data: {
        slackAccessToken: accessToken,
        slackTemplate: content,
      },
    });

    if (response) {
      const channelList = await db.workflows.findUnique({
        where: {
          id: workflowId,
        },
        select: {
          slackChannels: true,
        },
      });

      if (channelList) {
        const NonDuplicated = channelList.slackChannels.filter(
          (channel) => channel !== channels![0].value
        );

        NonDuplicated!
          .map((channel) => channel)
          .forEach(async (channel) => {
            await db.workflows.update({
              where: {
                id: workflowId,
              },
              data: {
                slackChannels: {
                  push: channel,
                },
              },
            });
          });

        return "Slack template saved";
      }

      channels!
        .map((channel) => channel.value)
        .forEach(async (channel) => {
          await db.workflows.update({
            where: {
              id: workflowId,
            },
            data: {
              slackChannels: {
                push: channel,
              },
            },
          });
        });

      return "Slack template saved";
    }
  }
};

export const onGetNodesEdges = async (workflowId: string) => {
  const nodesEdges = await db.workflows.findUnique({
    where: {
      id: workflowId,
    },
    select: {
      edges: true,
      nodes: true,
    },
  });

  if (nodesEdges?.edges && nodesEdges?.nodes) return nodesEdges;
};
