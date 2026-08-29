import CategoryBanner from "@/components/gallery/CategoryBanner";
import PhotoGallery from "@/components/gallery/PhotoGallery";

export const metadata = {
  title: "Pre-Wedding Photography | Murlidhar Studio",
  description: "Beautiful pre-wedding photoshoots capturing the romance and anticipation before your big day in Kutch.",
};

async function getCategoryData() {
  const CategoryModel = (await import("@/lib/models/Category")).default;
  await import("@/lib/db").then(m => m.connectToDatabase());
  const category = await CategoryModel.findOne({ slug: "prewedshoot" }).lean();
  
  if (!category) {
    return {
      title: "Pre-Wedding Photography",
      description: "Capturing the romance and excitement before you tie the knot.",
    };
  }
  return JSON.parse(JSON.stringify(category));
}

export default async function PreWeddingPage() {
  const categoryData = await getCategoryData();

  return (
    <>
      <CategoryBanner data={categoryData} />
      <PhotoGallery categoryId="prewedphotos" />
    </>
  );
}
