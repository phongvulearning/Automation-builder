"use server";

import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import axios from "axios";

export const onDiscordConnect = async (
  channel_id: string,
  webhook_id: string,
  webhook_name: string,
  webhook_url: string,
  userId: string,
  guild_name: string,
  guild_id: string
) => {
  if (webhook_id) {
    const webhook = await db.discordWebhook.findFirst({
      where: {
        userId,
      },
      include: {
        connections: {
          select: {
            type: true,
          },
        },
      },
    });

    if (!webhook) {
      await db.discordWebhook.create({
        data: {
          userId,
          webhookId: webhook_id!,
          channelId: channel_id!,
          guildId: guild_id!,
          guildName: guild_name!,
          name: webhook_name!,
          url: webhook_url!,
          connections: {
            create: {
              userId,
              type: "Discord",
            },
          },
        },
      });
    }

    if (webhook) {
      const webhook_channel = await db.discordWebhook.findUnique({
        where: {
          channelId: channel_id,
        },
        include: {
          connections: {
            select: {
              type: true,
            },
          },
        },
      });

      if (!webhook_channel) {
        await db.discordWebhook.create({
          data: {
            userId,
            webhookId: webhook_id,
            channelId: channel_id!,
            guildId: guild_id!,
            name: webhook_name!,
            url: webhook_url!,
            guildName: guild_name!,
            connections: {
              create: {
                userId,
                type: "Discord",
              },
            },
          },
        });
      }
    }
  }
};

export const getDiscordConnectionUrl = async () => {
  const user = await currentUser();
  if (user) {
    const webhook = await db.discordWebhook.findFirst({
      where: {
        userId: user.id,
      },
      select: {
        url: true,
        name: true,
        guildName: true,
      },
    });

    return webhook;
  }
};

export const postContentToWebHook = async (content: string, url: string) => {
  console.log("content", content);
  if (content) {
    const posted = await axios.post(url, { content });

    if (posted) {
      return { message: "success" };
    }

    return { message: "failed request" };
  }

  return { message: "String empty" };
};
