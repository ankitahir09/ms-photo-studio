import CategoryBanner from "@/components/gallery/CategoryBanner";
import PhotoGallery from "@/components/gallery/PhotoGallery";

export const metadata = {
  title: "Maternity Shoot | Murlidhar Studio",
  description: "Beautiful maternity photography to celebrate your journey into motherhood.",
};

async function getCategoryData() {
  const CategoryModel = (await import("@/lib/models/Category")).default;
  await import("@/lib/db").then(m => m.connectToDatabase());
  const category = await CategoryModel.findOne({ slug: "maternityshoot" }).lean();
  
  if (!category) {
    return {
      title: "Maternity Photography",
      description: "Celebrating the miracle of life with elegant and timeless maternity portraits.",
    };
  }
  return JSON.parse(JSON.stringify(category));
}

export default async function MaternityShootPage() {
  const categoryData = await getCategoryData();

  return (
    <>
      <CategoryBanner data={categoryData} />
      <PhotoGallery categoryId="maternityshoot" />
    </>
  );
}
