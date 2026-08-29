import CategoryBanner from "@/components/gallery/CategoryBanner";
import PhotoGallery from "@/components/gallery/PhotoGallery";

export const metadata = {
  title: "Wedding Photography | Murlidhar Studio",
  description: "Timeless and elegant wedding photography in Kutch. We capture every emotion of your special day.",
};

async function getCategoryData() {
  const CategoryModel = (await import("@/lib/models/Category")).default;
  await import("@/lib/db").then(m => m.connectToDatabase());
  const category = await CategoryModel.findOne({ slug: "weddingphotos" }).lean();
  
  if (!category) {
    return {
      title: "Wedding Photography",
      description: "Preserving the magic and emotions of your wedding day for a lifetime.",
    };
  }
  return JSON.parse(JSON.stringify(category));
}

export default async function WeddingPhotosPage() {
  const categoryData = await getCategoryData();

  return (
    <>
      <CategoryBanner data={categoryData} />
      <PhotoGallery categoryId="weddingphotos" />
    </>
  );
}
