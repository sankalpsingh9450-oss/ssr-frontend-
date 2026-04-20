import Button from './Button'
import ResponsiveImage from '../ResponsiveImage'

export default function ProjectCard({
  title,
  category,
  description,
  image,
  location,
  action,
}) {
  return (
    <article className="ui-project-card">
      <div className="ui-card-media">
        <ResponsiveImage
          src={image}
          alt={title}
          aspectRatio="16 / 10"
          sizes="(max-width: 480px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority
          className="h-full"
          imgClassName="ui-card-media__image h-full w-full"
        />
      </div>
      <div className="ui-project-card__body">
        <span className="ui-card-category">{category}</span>
        <h3>{title}</h3>
        {location ? <p className="ui-project-card__location">{location}</p> : null}
        <p>{description}</p>
        {action ? (
          <div className="ui-project-card__footer">
            <Button variant="tertiary" as={action.to ? 'link' : 'a'} to={action.to} href={action.href}>
              {action.label}
            </Button>
          </div>
        ) : null}
      </div>
    </article>
  )
}
