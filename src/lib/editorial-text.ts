/** Decorative kashida for fixed editorial headings, never user-entered text. */
const extendedWords: Record<string, string> = {
  إلهام: "إلهــام",
  سعودي: "ســعودي",
  وحي: "وحــي",
  المصممات: "المصممــات",
  خطواتك: "خطــواتك",
  عالم: "عــالم",
  الأزياء: "الأزيــاء",
  فرص: "فــرص",
  تصميم: "تصميــم",
  مهاراتك: "مهــاراتك",
  وأعمالك: "وأعمــالك",
  مساحة: "مســاحة",
  واحدة: "واحــدة",
  استكشاف: "استكشــاف",
  الفرص: "الفــرص",
  ملفك: "ملفــك",
  المهني: "المهنــي",
  معرض: "معــرض",
  أعمالي: "أعمــالي",
  رحلتي: "رحلتــي",
  التعليمية: "التعليميــة",
};

export function editorialText(text: string): string {
  return text.replace(/\S+/g, (word) => extendedWords[word] ?? word);
}
