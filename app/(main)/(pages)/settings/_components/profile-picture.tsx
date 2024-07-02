"use client";
import React from "react";
import UploadcareButton from "./uploadcare-button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { TrashIcon, UploadIcon, X } from "lucide-react";

type Props = {
  userImage: string | null;
  onUpload?: any;
  onDelete?: any;
};

const ProfilePicture = ({ userImage, onUpload, onDelete }: Props) => {
  const router = useRouter();

  const onRemoveProfileImage = async () => {
    const res = await onDelete();

    if (res) {
      router.refresh();
    }
  };

  return (
    <div className="fkex flex-col">
      <p className="text-lg text-white">Profile Picture</p>
      <div className="flex flex-col items-start mt-2">
        {userImage ? (
          <div className="flex items-center gap-6">
            <div className="relative w-32 h-32 rounded-full overflow-hidden">
              <Image
                src={userImage}
                alt="User_Image"
                fill
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Button
                variant="ghost"
                onClick={onRemoveProfileImage}
                className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900"
              >
                <TrashIcon className="mr-2 h-4 w-4" />
                Delete Image
              </Button>
            </div>
          </div>
        ) : (
          <UploadcareButton onUpload={onUpload} />
        )}
      </div>
    </div>
  );
};

export default ProfilePicture;
