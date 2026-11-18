import { MAX_WORK_IMAGE_CHARS } from "./mock-data";

/** Resize and compress a portfolio photo in the browser so it can be stored
 * with the work itself (Firestore documents are limited to 1 MiB). */
export async function preparePortfolioImage(file: File): Promise<string> {
  if (
    !["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.type)
  )
    throw new Error("اختاري صورة JPG أو PNG أو WebP أو AVIF.");
  if (file.size > 15 * 1024 * 1024)
    throw new Error("حجم الصورة يجب ألا يتجاوز ١٥ ميغابايت");
  const objectUrl = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.decoding = "async";
    img.src = objectUrl;
    await img.decode();
    // Try progressively smaller sizes and qualities until the photo fits.
    for (const edge of [1400, 1100, 850]) {
      const ratio = Math.min(
        1,
        edge / Math.max(img.naturalWidth, img.naturalHeight),
      );
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(img.naturalWidth * ratio));
      canvas.height = Math.max(1, Math.round(img.naturalHeight * ratio));
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("تعذّر تجهيز الصورة في هذا المتصفح");
      ctx.fillStyle = "#FAF6F1";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      for (const quality of [0.82, 0.7, 0.58]) {
        const output = canvas.toDataURL("image/jpeg", quality);
        if (output.length <= MAX_WORK_IMAGE_CHARS) return output;
      }
    }
    throw new Error("تعذّر ضغط الصورة بما يكفي. جرّبي صورة أخرى");
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
