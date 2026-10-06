import { getLocalizedField } from '../../i18n/localizedField'
import { useLocale } from '../../i18n/LocaleProvider'
import { useState } from 'react'
import { Section, SectionHeading, EmptyState } from '../ui'
import { GlassSheet } from '../glass'
import { useSupabaseData } from '../../hooks/useSupabaseData'
import { contentQueries } from '../../services/content'
import { placeholderTeam } from '../../data/placeholders'

export function TeamSection() {
  const { copy, locale } = useLocale()
  const { data: team } = useSupabaseData(contentQueries.team, [], placeholderTeam)
  const [selected, setSelected] = useState(null)

  return (
    <Section id="team" tone="white">
      <SectionHeading title={copy.team.title} intro={copy.team.intro} />

      {!team?.length ? (
        <EmptyState title={copy.common.emptyTeam} />
      ) : (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {team.map((member) => (
            <button key={member.id} onClick={() => setSelected(member)} className="text-start">
              <div className="aspect-square w-full overflow-hidden rounded-md bg-primary-50">
                {member.photo_path ? (
                  <img
                    src={member.photo_path}
                    alt={member.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : null}
              </div>
              <p className="mt-3 font-medium text-ink">{member.name}</p>
              <p className="text-sm text-ink-soft">{getLocalizedField(member, 'specialty', locale)}</p>
            </button>
          ))}
        </div>
      )}

      <GlassSheet open={Boolean(selected)} onClose={() => setSelected(null)} side="center" title={selected?.name}>
        {selected ? (
          <div>
            <div className="mb-4 aspect-square w-32 overflow-hidden rounded-md bg-primary-50">
              {selected.photo_path ? (
                <img src={selected.photo_path} alt={selected.name} className="h-full w-full object-cover" />
              ) : null}
            </div>
            <p className="font-medium text-ink">{getLocalizedField(selected, 'specialty', locale)}</p>
            {getLocalizedField(selected, 'title', locale) ? <p className="text-sm text-ink-soft">{getLocalizedField(selected, 'title', locale)}</p> : null}
            {getLocalizedField(selected, 'bio', locale) ? <p className="mt-4 text-sm text-ink-soft">{getLocalizedField(selected, 'bio', locale)}</p> : null}
          </div>
        ) : null}
      </GlassSheet>
    </Section>
  )
}
