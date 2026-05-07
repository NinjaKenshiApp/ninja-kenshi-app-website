interface SectionHeadingProps {
  eyebrow: string
  title: string
  subtitle: string
}

/*
Purpose: Reusable section header for visual consistency.
Key dependencies: None.
Integration: Used by hero, apps showcase, and reviews sections.
*/
export function SectionHeading({ eyebrow, title, subtitle }: SectionHeadingProps) {
  return (
    <header className="section-heading">
      <p className="section-eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p className="section-subtitle">{subtitle}</p>
    </header>
  )
}
