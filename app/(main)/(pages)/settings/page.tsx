import ProfileForm from "@/components/forms/profile-form";
import React from "react";
import ProfilePicture from "./_components/profile-picture";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { User } from "@prisma/client";
import { EditUserProfileSchema } from "@/lib/types";
import { z } from "zod";

type Props = {};

const Settings = async (props: Props) => {
  const authUser = await currentUser();

  if (!authUser) return null;

  const user = (await db.user.findUnique({
    where: {
      clerkId: authUser.id,
    },
  })) as User;

  const removeProfileImage = async () => {
    "use server";
    const res = await db.user.update({
      where: {
        clerkId: authUser.id,
      },
      data: {
        profileImage: "",
      },
    });

    return res;
  };

  const uploadProfileImage = async (image: string) => {
    "use server";

    const id = authUser.id;

    const res = await db.user.update({
      where: {
        clerkId: id,
      },
      data: {
        profileImage: image,
      },
    });

    return res;
  };

  const updateUserInfo = async (
    data: z.infer<typeof EditUserProfileSchema>
  ) => {
    "use server";

    const updateUser = await db.user.update({
      where: { clerkId: authUser.id },
      data: {
        name: data.name,
      },
    });

    return updateUser;
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="sticky top-0 z-[10] flex items-center justify-between border-b bg-background/50 p-6 text-4xl backdrop-blur-lg">
        <span>Settings</span>
      </h1>
      <div className="flex flex-col gap-10 p-6">
        <div>
          <h2 className="text-2xl font-bold">User Profile</h2>
          <p className="text-base text-white/50">
            Add or update your infomation
          </p>
        </div>
        <ProfilePicture
          userImage={user?.profileImage || null}
          onUpload={uploadProfileImage}
          onDelete={removeProfileImage}
        />
        <ProfileForm user={user} onUpdate={updateUserInfo} />
      </div>
    </div>
  );
};

export default Settings;
