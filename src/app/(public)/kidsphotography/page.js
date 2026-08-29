import CategoryBanner from "@/components/gallery/CategoryBanner";
import PhotoGallery from "@/components/gallery/PhotoGallery";

export const metadata = {
  title: "Kids Photography | Murlidhar Studio",
  description: "Adorable kids and baby photography sessions capturing their innocent smiles and playful moments.",
};

async function getCategoryData() {
  const CategoryModel = (await import("@/lib/models/Category")).default;
  await import("@/lib/db").then(m => m.connectToDatabase());
  const category = await CategoryModel.findOne({ slug: "kidsphotography" }).lean();
  
  if (!category) {
    return {
      title: "Kids Photography",
      description: "Capturing the fleeting moments of childhood with joy and creativity.",
    };
  }
  return JSON.parse(JSON.stringify(category));
}

export default async function KidsPhotographyPage() {
  const categoryData = await getCategoryData();

  return (
    <>
      <CategoryBanner data={categoryData} />
      <PhotoGallery categoryId="childphotos" />
    </>
  );
}
