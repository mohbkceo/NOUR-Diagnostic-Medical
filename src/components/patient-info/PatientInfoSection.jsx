import { Section, SectionHeading, Accordion, EmptyState } from "../ui";
import { useSupabaseData } from "../../hooks/useSupabaseData";
import { contentQueries } from "../../services/content";
import { placeholderPatientInfo } from "../../data/placeholders";
import { fr } from "../../content/fr";

export function PatientInfoSection() {
  const { data: items } = useSupabaseData(
    contentQueries.patientInfo,
    [],
    placeholderPatientInfo,
  );

  const sectionContent = (
    <div
      className="
        relative
        mx-auto
        max-w-3xl
      "
    >
      <SectionHeading
        title={fr.patientInfo.title}
        intro={fr.patientInfo.intro}
        className="mb-8"
      />

      {!items?.length ? (
        <div
          className="
            overflow-hidden
            rounded-[1.5rem]
            border border-white/80
            bg-white/55
            backdrop-blur-xl
          "
        >
          <EmptyState title="Aucune information pour le moment." />
        </div>
      ) : (
        <div
          className="
            overflow-hidden
            rounded-[1.5rem]
            border border-white/80
            bg-white/55
            backdrop-blur-xl
          "
        >
          <Accordion
            items={items.map((item) => ({
              id: item.id,
              title: item.title,
              content: item.content,
            }))}
            className="
              w-full
              max-w-none
              divide-y
              divide-slate-200/70
            "
          />
        </div>
      )}
    </div>
  );

  return (
    <Section
      tone="muted"
      className="
        relative
        overflow-hidden
        !py-16
        sm:!py-20
        lg:!py-24
      "
    >
      {/* Soft blue atmosphere */}
      <div
        aria-hidden
        className="
          pointer-events-none
          absolute inset-0
          bg-[radial-gradient(circle_at_18%_25%,rgba(37,99,235,0.055),transparent_28%),radial-gradient(circle_at_82%_72%,rgba(96,165,250,0.045),transparent_30%)]
        "
      />

      <div className="relative">{sectionContent}</div>
    </Section>
  );
}
