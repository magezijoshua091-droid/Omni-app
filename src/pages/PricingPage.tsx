import { Check } from "lucide-react";
import { Button } from "../components/ui/button";

const tiers = [
  {
    name: 'Free',
    id: 'tier-free',
    href: '#',
    priceMonthly: '$0',
    description: 'Perfect for trying out Omni.',
    features: ['5 files per month', 'Basic compression', 'Community support', '10MB file limit'],
    featured: false,
  },
  {
    name: 'Pro',
    id: 'tier-pro',
    href: '#',
    priceMonthly: '$12',
    description: 'For professionals who need more power.',
    features: [
      'Unlimited files',
      'Advanced AI suggestions',
      'Priority processing queue',
      '1GB file limit',
      'Email support',
    ],
    featured: true,
  },
  {
    name: 'Business',
    id: 'tier-business',
    href: '#',
    priceMonthly: '$49',
    description: 'For teams and heavy workflows.',
    features: [
      'Everything in Pro',
      'Custom workflows',
      'API access',
      '5GB file limit',
      '24/7 phone support',
    ],
    featured: false,
  },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function PricingPage() {
  return (
    <div className="bg-white dark:bg-gray-950 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">Pricing</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Pricing plans for teams of&nbsp;all&nbsp;sizes
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600 dark:text-gray-400">
          Choose an affordable plan that's packed with the best features for engaging your audience, creating customer
          loyalty, and driving sales.
        </p>
        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={classNames(
                tier.featured ? 'ring-2 ring-blue-600' : 'ring-1 ring-gray-200 dark:ring-gray-800',
                'rounded-3xl p-8 xl:p-10 bg-white dark:bg-gray-900/50 shadow-sm'
              )}
            >
              <div className="flex items-center justify-between gap-x-4">
                <h3
                  id={tier.id}
                  className={classNames(
                    tier.featured ? 'text-blue-600' : 'text-gray-900 dark:text-white',
                    'text-lg font-semibold leading-8'
                  )}
                >
                  {tier.name}
                </h3>
                {tier.featured ? (
                  <p className="rounded-full bg-blue-600/10 px-2.5 py-1 text-xs font-semibold leading-5 text-blue-600">
                    Most popular
                  </p>
                ) : null}
              </div>
              <p className="mt-4 text-sm leading-6 text-gray-600 dark:text-gray-400">{tier.description}</p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">{tier.priceMonthly}</span>
                <span className="text-sm font-semibold leading-6 text-gray-600 dark:text-gray-400">/month</span>
              </p>
              <Button
                variant={tier.featured ? "default" : "outline"}
                className="mt-6 w-full h-11"
              >
                Buy plan
              </Button>
              <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <Check className="h-6 w-5 flex-none text-blue-600" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
