import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <section className="relative">
      <div className="mx-auto max-w-6xl px-4">
        <div className="py-20 md:py-28 flex flex-col items-center justify-center text-center">
          <h1 className="mb-6 text-3xl md:text-5xl lg:text-5xl font-extrabold leading-none tracking-tight text-black">
            Sarah, don't worry —{' '}
            <span className="underline underline-offset-3 decoration-8 decoration-blue-400">
              I've got your back
            </span>
          </h1>
          <p className="mb-6 max-w-2xl text-lg font-normal text-gray-600 lg:text-xl">
            Sarah, an executive at Pharma Co., is in charge of a drug called
            Luminarex, an immunotherapy which has not yet been approved by the
            FDA. Sarah's drug is currently in phase 3 of Clinical Trials,
            specifically targeting a disease called Non Small Cell Lung Cancer
            (NSCLC), and Sarah hopes that her drug will be approved soon.
          </p>

          {/* Buttons in a row */}
          <div className="flex items-center gap-4">
            <Link
              to="/search"
              className="inline-flex items-center justify-center rounded-xl bg-blue-900 text-white px-5 py-3 hover:bg-blue-800 transition"
            >
              Get Started
            </Link>
            <Link
              to="/search"
              className="inline-flex items-center justify-center rounded-xl border px-5 py-3 hover:bg-black/5 transition"
            >
              Learn more
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
