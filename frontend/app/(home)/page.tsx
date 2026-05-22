import PopularHotelRooms from "@/components/home/popular-hotel-rooms";
import ExploreDestination from "../../components/home/explore-destination";
import HomeBanner from "../../components/home/home-banner";
import SolutionSection from "@/components/home/solution-section";
import BuiltTeam from "@/components/home/built-team";
import GalleryImages from "@/components/home/gallery-images";
import Testimonial from "@/components/home/testimonial";
import RegisterProperty from "@/components/home/register-property";

export default function Page() {
  return (
    <div>
      <HomeBanner />
      <ExploreDestination />
      <SolutionSection />
      <PopularHotelRooms />
      <BuiltTeam />
      <GalleryImages />
      <Testimonial />
      <RegisterProperty />
    </div>
  );
}
