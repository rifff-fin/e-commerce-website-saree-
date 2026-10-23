import { useEffect } from 'react';
import { brand } from '../content/copy';
import { BestSellers } from '../sections/BestSellers';
import { Faq } from '../sections/Faq';
import { Hero } from '../sections/Hero';
import { Lookbook } from '../sections/Lookbook';
import { NewArrivals } from '../sections/NewArrivals';
import { Newsletter } from '../sections/Newsletter';
import { OccasionEdits } from '../sections/OccasionEdits';
import { RecentlyViewed } from '../sections/RecentlyViewed';
import { Reviews } from '../sections/Reviews';
import { ShopByWeave } from '../sections/ShopByWeave';
import { WeaveStory } from '../sections/WeaveStory';

export function HomePage() {
  useEffect(() => {
    document.title = `${brand.name} | Handwoven sarees from Bangladesh`;
  }, []);

  return (
    <>
      <Hero />
      <ShopByWeave />
      <NewArrivals />
      <WeaveStory />
      <OccasionEdits />
      <BestSellers />
      <Reviews />
      <Lookbook />
      <RecentlyViewed />
      <Newsletter />
      <Faq />
    </>
  );
}
