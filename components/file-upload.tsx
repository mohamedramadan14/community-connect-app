"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { X } from "lucide-react";
import Image from "next/image";

import "@uploadthing/react/styles.css";

type FileUploadProps = {
  endpoint: "serverImage" | "messageFile";
  value: string;
  onChange: (url?: string) => void;
};
const FileUpload = ({ endpoint, onChange, value }: FileUploadProps) => {
  const fileType = value.split(".").pop();
  if (value && fileType !== "pdf") {
    return (
      <div className="relative h-20 w-20">
        <Image src={value} fill alt="Upload" className="rounded-full" />
        <button
          onClick={() => onChange("")}
          className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
          type="button"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    );
  }
  return (
    <UploadDropzone
      className="cursor-pointer"
      endpoint={endpoint}
      onClientUploadComplete={(res) => onChange(res?.[0]?.url)}
      onUploadError={(error: Error) => console.log(error)}
    />
  );
};

export default FileUpload;
