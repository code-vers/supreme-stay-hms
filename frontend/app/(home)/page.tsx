import PopularHotelRooms from "@/components/home/popular-hotel-rooms";
import ExploreDestination from "../../components/home/explore-destination";
import HomeBanner from "../../components/home/home-banner";
import SolutionSection from "@/components/home/solution-section";

export default function Page() {
  return (
    <div>
      <HomeBanner />
      <ExploreDestination />
      <SolutionSection />
      <PopularHotelRooms />
    </div>
  );
}
