/** Convert a user's local photograph to a compact persistent JPEG data URL.
 * This is a frontend demo only: images are not uploaded to a server. */
export async function preparePortfolioImage(file: File): Promise<string> {
  if (
    !["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.type)
  )
    throw new Error("اختاري صورة JPG أو PNG أو WebP أو AVIF.");
  if (file.size > 8 * 1024 * 1024)
    throw new Error("حجم الصورة يجب ألا يتجاوز ٨ ميغابايت.");
  const objectUrl = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.decoding = "async";
    img.src = objectUrl;
    await img.decode();
    const ratio = Math.min(
      1,
      1200 / Math.max(img.naturalWidth, img.naturalHeight),
    );
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(img.naturalWidth * ratio));
    canvas.height = Math.max(1, Math.round(img.naturalHeight * ratio));
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("تعذّر تجهيز الصورة في هذا المتصفح.");
    ctx.fillStyle = "#FAF6F1";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    let output = canvas.toDataURL("image/jpeg", 0.75);
    if (output.length > 900_000) output = canvas.toDataURL("image/jpeg", 0.55);
    if (output.length > 1_200_000)
      throw new Error("الصورة كبيرة جدًا للتخزين المحلي. اختاري صورة أصغر.");
    return output;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
