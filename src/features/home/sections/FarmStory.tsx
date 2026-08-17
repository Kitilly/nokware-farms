import { Link } from 'react-router-dom'
import { MediaPlaceholder } from '@/components/ui/MediaPlaceholder'
import { getSceneTreatment } from '@/data/mock/images'
import { copy } from '@/config/copy'

export function FarmStory() {
  return (
    <section className="px-5 py-8 md:px-8">
      <div className="overflow-hidden rounded-2xl border border-border bg-cream-50 md:flex md:items-stretch">
        <MediaPlaceholder
          treatment={getSceneTreatment('farm-story')}
          alt="Our farm"
          className="h-40 w-full md:h-auto md:w-2/5"
          iconClassName="h-9 w-9"
        />
        <div className="p-5 md:flex md:flex-1 md:flex-col md:justify-center md:p-8">
          <h2 className="text-h3 text-charcoal-900">{copy.home.sections.farmStory}</h2>
          <p className="mt-2 text-body-lg text-charcoal-600">{copy.home.farmStoryBody}</p>
          <Link to="/account/about-farm" className="mt-3 inline-block w-fit text-body font-medium text-forest-700 hover:underline">
            Read our story
          </Link>
        </div>
      </div>
    </section>
  )
}
