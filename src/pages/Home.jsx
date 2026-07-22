import Hero from '../components/home/Hero'
import LiveFeedSection from '../components/home/LiveFeedSection'
import AnnouncementsSection from '../components/home/AnnouncementsSection'
import StatsSection from '../components/home/StatsSection'
import MissionsSection from '../components/home/MissionsSection'
import PartnersSection from '../components/home/PartnersSection'
import CTASection from '../components/home/CTASection'
import LatestArticles from '../components/home/LatestArticles'

export default function Home() {
  return (
    <>
      <Hero />
      <LiveFeedSection />
      <AnnouncementsSection />
      <StatsSection />
      <MissionsSection />
      <PartnersSection />
      <CTASection />
      <LatestArticles />
    </>
  )
}
