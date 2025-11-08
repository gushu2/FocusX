
import React from 'react';
import type { Plan } from '../types';
import { CheckIcon } from './icons';

const plans: Plan[] = [
  {
    name: 'Spark',
    price: '0',
    pricePeriod: '/ month',
    description: 'For casual writers and note-takers to get started.',
    features: ['Up to 50 notes', 'Basic rich-text editor', 'Light/Dark mode', 'Community support'],
  },
  {
    name: 'Creator',
    price: '8',
    pricePeriod: '/ month',
    description: 'For professionals and creators who need more power.',
    features: ['Unlimited notes & folders', 'Advanced editor features', 'Share via public link', 'AI text generation (10k words/mo)', 'Priority support'],
    isPopular: true,
  },
  {
    name: 'Zenith',
    price: '15',
    pricePeriod: '/ month',
    description: 'For teams and power users who demand the best.',
    features: ['All Creator features', 'Password-protected notes', 'Export to PDF, Word, MD', 'AI text generation (50k words/mo)', 'Team collaboration (beta)'],
  },
];

const Pricing: React.FC = () => {
  return (
    <section id="pricing" className="py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Find the perfect plan</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Start for free, and unlock powerful features as your needs grow. All plans are designed for a focused, serene writing experience.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col p-8 rounded-2xl shadow-lg border ${plan.isPopular ? 'border-amber-500 dark:border-emerald-500' : 'border-gray-200 dark:border-gray-700'}`}
            >
              {plan.isPopular && (
                <div className="absolute top-0 -translate-y-1/2 px-3 py-1 text-sm font-semibold tracking-wide text-white bg-amber-500 dark:bg-emerald-600 rounded-full shadow-md">
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-semibold leading-7 text-gray-900 dark:text-white">{plan.name}</h3>
              <p className="mt-4 text-gray-600 dark:text-gray-400 flex-grow">{plan.description}</p>
              <div className="mt-6">
                <span className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">${plan.price}</span>
                <span className="text-base font-medium text-gray-500 dark:text-gray-400">{plan.pricePeriod}</span>
              </div>
              <ul role="list" className="mt-8 space-y-4 text-sm leading-6 text-gray-600 dark:text-gray-300">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckIcon className="h-6 w-5 flex-none text-amber-600 dark:text-emerald-500" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href="#"
                className={`mt-8 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  plan.isPopular
                    ? 'bg-amber-500 text-white shadow-sm hover:bg-amber-600 focus-visible:outline-amber-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 dark:focus-visible:outline-emerald-600'
                    : 'text-amber-600 ring-1 ring-inset ring-amber-200 hover:ring-amber-300 dark:text-emerald-400 dark:ring-emerald-500 dark:hover:ring-emerald-400'
                }`}
              >
                Get started
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;