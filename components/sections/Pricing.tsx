import React from "react";

const PricingPlans = () => {
  const plans = [
    {
      name: "Starter",
      price: "$0",
      period: "/month",
      description: "Get started with essential features to explore Slesh.",
      features: [
        "Access to the standard model",
        "Limited usage (~30 messages/month)",
        "View and analyze up to 5 PDFs, 10 Videos, and 25 Web pages",
        "Run up to 10 automation flows",
        "Add context to your messages",
        "Up to 3 Pages and 2 Screenshots",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Pro",
      price: "$15",
      period: "/month",
      description: "Unlock a more powerful Slesh with extended capabilities.",
      features: [
        "Access to premium models Sonnet 4, GPT-5, Gemini 2.5 Pro...",
        "10x more messages than starter",
        "20× more PDFs, Videos, Web pages than starter",
        "Run up to 10x more automation flows",
        "Add more context to your messages",
        "Up to 10 Pages and 5 Screenshots",
      ],
      cta: "Choose Pro",
      popular: true,
    },
    {
      name: "Unlimited",
      price: "$39",
      period: "/month",
      description: "Unlock the full potential of Slesh with no limits.",
      features: [
        "Everything in Pro",
        "Unlimited chats",
        "Unlimited PDFs, Videos, Web pages",
        "Unlimited automation flows",
        "Early access to new features",
        "*Fair use applies. See Terms.",
      ],
      cta: "Choose Unlimited",
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="page-container">
        <div className="text-center">
          <h2 className="mb-4 text-4xl font-bold text-black md:text-5xl">
            Choose Your Plan
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Start free and scale as you grow. Every plan includes our core
            features with different usage limits.
          </p>
        </div>

        <div className="mt-16 space-y-12 lg:grid lg:grid-cols-3 lg:gap-8 lg:space-y-0">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-3xl border bg-white/90 p-8 shadow-sm transition-transform ${
                plan.popular
                  ? "border-[color:var(--color-primary)] shadow-2xl shadow-[color:var(--color-primary-muted)] scale-105 z-10"
                  : "border-gray-200 hover:-translate-y-2 hover:border-[color:var(--color-primary)] hover:shadow-xl hover:shadow-[color:var(--color-primary-muted)]"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="inline-flex items-center rounded-full bg-[color:var(--color-primary)] px-4 py-1 text-sm font-medium text-white shadow">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900">
                  {plan.name}
                </h3>
                <div className="mt-4 flex items-baseline justify-center">
                  <span className="text-5xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="ml-2 text-lg font-light text-[#6b7280]">
                    {plan.period}
                  </span>
                </div>
                <p className="mt-4 text-gray-600">{plan.description}</p>
              </div>

              <ul className="mt-8 space-y-4">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-6 w-6 text-[color:var(--color-primary)]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <p className="ml-3 text-gray-700">{feature}</p>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <button
                  className={`w-full py-3 cursor-pointer px-6 rounded-md text-center font-medium ${
                    plan.popular
                      ? "bg-[color:var(--color-primary)] text-white shadow-lg shadow-[color:var(--color-primary-muted)] hover:bg-[#0042d1]"
                      : "border border-[color:var(--color-primary)] bg-transparent text-[color:var(--color-primary)] hover:bg-[color:var(--color-primary)] hover:text-white"
                  } transition-colors duration-200`}
                >
                  {plan.cta}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingPlans;
