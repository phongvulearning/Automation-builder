"use client";
import React, { useState } from "react";
import { FileUploaderRegular } from "@uploadcare/react-uploader";
import "@uploadcare/react-uploader/core.css";
import { useRouter } from "next/navigation";

type UploadcareButtonProps = {
  onUpload?: any;
};

const UploadcareButton = ({ onUpload }: UploadcareButtonProps) => {
  const router = useRouter();
  const handleUpload = (event: any) => {
    const imageUrl = event.allEntries[0].cdnUrl;
    onUpload(imageUrl);

    router.refresh();
  };
  return (
    <FileUploaderRegular
      onChange={handleUpload}
      pubkey="a9388ad84f61dc183498"
      maxLocalFileSizeBytes={5000000}
      multiple={false}
      imgOnly={true}
      sourceList="local, url, camera, gdrive"
    />
  );
};

export default UploadcareButton;
