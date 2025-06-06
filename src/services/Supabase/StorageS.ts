import { supabase } from "./SupabaseConfig";
import { Meme } from "../../utils/types/MemeTypes";

// Constants
const STORAGE_BUCKET = "memeshere";
const MEMES_FOLDER = "memes";
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const SUPPORTED_VIDEO_EXTENSIONS = ["mp4", "webm", "ogg", "mov"];

// Type definitions
type FileType = "image" | "video" | "gif";

// Helper functions
const generateUniqueFileName = (originalName: string): string => {
  const extension = originalName.split(".").pop();
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(7);
  return `${timestamp}_${randomString}.${extension}`;
};

const determineFileType = (file: File | string): FileType => {
  if (typeof file === "string") {
    const extension = file.split(".").pop()?.toLowerCase() || "";
    if (SUPPORTED_VIDEO_EXTENSIONS.includes(extension)) return "video";
    if (extension === "gif") return "gif";
    return "image";
  }

  if (file.type.startsWith("video/")) return "video";
  if (file.type === "image/gif") return "gif";
  return "image";
};

const validateFile = (file: File): void => {
  const isValidType = file.type.startsWith("image/") || file.type.startsWith("video/");
  if (!isValidType) {
    throw new Error("El archivo debe ser una imagen o un video");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("El archivo es demasiado grande. El tamaño máximo es 50MB");
  }
};

const handleStorageError = (error: any, context: string): Error => {
  console.error(`Error en ${context}:`, error);
  if (error.message?.includes("permission denied")) {
    return new Error(`No tienes permisos para ${context}. Por favor, inicia sesión.`);
  }
  return new Error(`Error en ${context}: ${error.message}`);
};

const getPublicUrl = (filePath: string): string => {
  const { data: { publicUrl } } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(filePath);
  return publicUrl;
};

// Main functions
export const uploadMeme = async (file: File): Promise<Meme> => {
  try {
    validateFile(file);
    
    const fileName = generateUniqueFileName(file.name);
    const filePath = `${MEMES_FOLDER}/${fileName}`;
    const fileType = determineFileType(file);

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw handleStorageError(uploadError, "subir el archivo");
    }

    return {
      name: file.name,
      url: getPublicUrl(filePath),
      type: fileType,
    };
  } catch (error) {
    throw handleStorageError(error, "subir el meme");
  }
};

export const getMemes = async (): Promise<Meme[]> => {
  try {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .list(MEMES_FOLDER, {
        limit: 100,
        offset: 0,
        sortBy: { column: "created_at", order: "asc" },
      });

    if (error) {
      throw handleStorageError(error, "obtener la lista de memes");
    }

    if (!data?.length) {
      return [];
    }

    const validFiles = data.filter((file: { name: string }) => file.name !== ".emptyFolderPlaceholder");

    return await Promise.all(
      validFiles.map(async (file: { name: string }) => ({
        name: file.name,
        url: getPublicUrl(`${MEMES_FOLDER}/${file.name}`),
        type: determineFileType(file.name),
      }))
    );
  } catch (error) {
    throw handleStorageError(error, "obtener los memes");
  }
};