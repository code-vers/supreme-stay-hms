import React from "react";
import SplitSection from "../shared/split-section";

export default function SolutionSection() {
  return (
    <section>
      {/* Title */}
      <div className='bg-(--color-primary)'>
        <p className='text-3xl lg:text-[40px] text-white max-w-140 mx-auto text-center py-12'>
          Your Ultimate Hotel Booking Solution
        </p>
      </div>
      <SplitSection
        title='Family Vacation'
        description='A perfect place for your family to stay and enjoy. With our user-friendly booking system, you can easily find and reserve the ideal accommodations for your next family getaway. Experience seamless booking, personalized recommendations, and exceptional service all in one platform. All your family’s needs are covered, from kid-friendly amenities to spacious rooms and fun activities. Make unforgettable memories with us on your next family vacation.'
        buttonLabel='View Plan'
        imageSrc='/home/solution/solution1.png'
      />
      <SplitSection
        title='Group Trips'
        description='Planning a trip with friends or colleagues? Our platform makes it easy to coordinate group bookings, manage shared itineraries, and ensure everyone has a great experience. Whether it’s a weekend getaway or a business retreat, we’ve got you covered. Enjoy hassle-free group travel planning with our intuitive tools and personalized support.'
        imageSrc='/home/solution/solution2.png'
        imageLeft
      />
      <SplitSection
        title='Office Meetings & Events'
        description='Host your next corporate event or meeting at our hotel. With state-of-the-art facilities, customizable event spaces, and expert planning services, we ensure your event is a success. From small meetings to large conferences, we provide the perfect setting for productive and memorable gatherings. Let us take care of the details while you focus on your business objectives. Experience seamless event planning and execution with us.'
        imageSrc='/home/solution/solution3.png'
      />
    </section>
  );
}
