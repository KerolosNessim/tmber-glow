import { Trans } from 'react-i18next'

export function AnnouncementBar() {
  return (
    <div className="bg-forest-deep py-[9px] text-center text-[13px] leading-snug font-medium text-on-forest">
      <Trans ns="layout" i18nKey="bar" components={{ b: <b className="text-gold" /> }} />
    </div>
  )
}
