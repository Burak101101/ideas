"use client";
import { dataUrlBytes, planResize } from "./image";

export type Picked = { dataUrl: string; bytes: number; resized: false } | { dataUrl: string; bytes: number; resized: true; width: number; height: number };

function readAsDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(r.error);
    r.readAsDataURL(blob);
  });
}

/**
 * Reads a picked image as a data: URI, shrinking it in the browser first when it is a heavy photo.
 * Falls back to the original file whenever decoding/encoding fails or the result would not be smaller.
 */
export async function pickImage(file: File, shrink: boolean): Promise<Picked> {
  const original = async (): Promise<Picked> => {
    const dataUrl = await readAsDataUrl(file);
    return { dataUrl, bytes: file.size, resized: false };
  };
  if (!shrink || typeof createImageBitmap !== "function") return original();
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    return original();
  }
  try {
    const plan = planResize({ type: file.type, size: file.size, width: bitmap.width, height: bitmap.height });
    if (plan.action === "keep") return original();
    const canvas = document.createElement("canvas");
    canvas.width = plan.width;
    canvas.height = plan.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return original();
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(bitmap, 0, 0, plan.width, plan.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, plan.mime, plan.quality));
    if (!blob || blob.size >= file.size) return original();
    const dataUrl = await readAsDataUrl(blob);
    return { dataUrl, bytes: dataUrlBytes(dataUrl), resized: true, width: plan.width, height: plan.height };
  } catch {
    return original();
  } finally {
    bitmap.close();
  }
}
