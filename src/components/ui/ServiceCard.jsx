import Button from './Button'
import ResponsiveImage from '../ResponsiveImage'

export default function ServiceCard({
  icon,
  title,
  description,
  image,
  action,
}) {
  return (
    <article className="ui-service-card">
      {image ? (
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
      ) : null}
      <div className="ui-service-card__body">
        {icon ? <div className="ui-service-card__icon" aria-hidden="true">{icon}</div> : null}
        <h3>{title}</h3>
        <p>{description}</p>
        {action ? (
          <Button variant="tertiary" as={action.to ? 'link' : 'a'} to={action.to} href={action.href}>
            {action.label}
          </Button>
        ) : null}
      </div>
    </article>
  )
}
