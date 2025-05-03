import IntuitiveHeader from "./components/IntuitiveHeader"
import ResponsiveHero from "./components/ResponsiveHero"
import EnhancedMinistries from "./components/EnhancedMinistries"
import Testimonies from "./components/Testimonies"
import ServiceTimes from "./components/ServiceTimes"
import CTA from "./components/CTA"
import PastoralTeam from "./components/PastoralTeam"
import UpcomingEvents from "./components/UpcomingEvents"
import GallerySection from "./components/GallerySection"
import GetInvolved from "./components/GetInvolved"
import Footer from "./components/Footer"
import VideoWelcomeModal from "./components/VideoWelcomeModal"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <IntuitiveHeader />
      <main className="w-full">
        {/* Video Welcome Modal - Only appears on home page */}
        <VideoWelcomeModal />

        <div className="w-full">
          <ResponsiveHero />
        </div>
        <div className="w-full">
          <EnhancedMinistries />
        </div>
        <div className="w-full">
          <ServiceTimes />
        </div>
        <div className="w-full">
          <PastoralTeam />
        </div>
        <div className="w-full">
          <GetInvolved />
        </div>
        <div className="w-full">
          <GallerySection />
        </div>
        <div className="w-full">
          <Testimonies />
        </div>
        <div className="w-full">
          <UpcomingEvents />
        </div>
        <div className="w-full">
          <CTA />
        </div>
      </main>
      <Footer />
    </div>
  )
}

