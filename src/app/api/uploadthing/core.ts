import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// File Router Configuration for Cariñosas.top
export const ourFileRouter = {
  // Define endpoint for model photos
  modelImage: f({ image: { maxFileSize: "4MB", maxFileCount: 6 } })
    .middleware(async () => {
      // In a real app, check auth here
      return { modelId: "temp-id" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for model:", metadata.modelId);
      console.log("File URL:", file.url);
      return { url: file.url };
    }),

  // Endpoint para la verificación 4K: selfie en vivo + gesto del día.
  // Acepta imagen (selfie) y video (gesto). El material NO se publica.
  verificationMedia: f({ image: { maxFileSize: "16MB", maxFileCount: 1 }, video: { maxFileSize: "32MB", maxFileCount: 1 } })
    .middleware(async () => {
      // El material de verificación es sensible: se marca con un prefijo privado
      // para no servirlo públicamente. En producción: bucket privado + URL firmada.
      return { purpose: "verification-4k" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Verification media uploaded:", metadata.purpose, file.url);
      return { url: file.url, key: file.key };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
