import { Hero } from '../components/hero/Hero'
import { CategoryList } from '../components/services/CategoryList'
import { WhyNour } from '../components/about/WhyNour'
import { DepartmentsStrip } from '../components/departments/DepartmentsStrip'
import { AboutSection } from '../components/about/AboutSection'
import { TeamSection } from '../components/team/TeamSection'
import { PatientInfoSection } from '../components/patient-info/PatientInfoSection'
import { HowItWorks } from '../components/how-it-works/HowItWorks'
import { TestimonialsSection } from '../components/testimonials/TestimonialsSection'
import { FaqSection } from '../components/faq/FaqSection'
import { ContactSection } from '../components/contact/ContactSection'

export default function Home() {
  return (
    <>
      <Hero />
      <CategoryList />
      <WhyNour />
      <DepartmentsStrip />
      <AboutSection />
      <TeamSection />
      <PatientInfoSection />
      <HowItWorks />
      <TestimonialsSection />
      <FaqSection />
      <ContactSection />
    </>
  )
}
