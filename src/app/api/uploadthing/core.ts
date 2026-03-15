import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// File Router Configuration for Cariñosas.top
export const ourFileRouter = {
  // Define endpoint for model photos
  modelImage: f({ image: { maxFileSize: "4MB", maxFileCount: 6 } })
    .middleware(async ({ req }) => {
      // In a real app, check auth here
      return { modelId: "temp-id" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for model:", metadata.modelId);
      console.log("File URL:", file.url);
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
