import HeroSection from '../ui/HeroSection'

export default function BaseHero({
  title,
  subtitle,
  description,
  actions,
  stats,
  backgroundImage,
  aside,
  scrollTarget,
}) {
  return (
    <HeroSection
      title={title}
      subtitle={subtitle}
      description={description}
      actions={actions}
      stats={stats}
      backgroundImage={backgroundImage}
      scrollTarget={scrollTarget}
    >
      {aside}
    </HeroSection>
  )
}
