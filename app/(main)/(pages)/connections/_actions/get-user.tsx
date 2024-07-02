"use server";

import { db } from "@/lib/db";

export const getUserData = async (userId: string) => {
  const user_info = await db.user.findUnique({
    where: {
      clerkId: userId,
    },
    include: {
      connections: true,
    },
  });

  return user_info;
};
