import Link from "next/link";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-[#f8f8f5] text-slate-900">
      <div className="pointer-events-none absolute -right-40 -top-48 h-[34rem] w-[34rem] rounded-full bg-lime-200/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-56 -left-40 h-[32rem] w-[32rem] rounded-full bg-emerald-100/70 blur-3xl" />

      <section className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-6 pb-20 pt-12 sm:px-10 sm:pb-28">
        <div className="max-w-3xl">
          <p className="mb-7 inline-flex items-center gap-2 rounded-full border border-lime-200 bg-lime-100/70 px-4 py-2 text-sm font-medium text-slate-700">
            <span className="h-2 w-2 rounded-full bg-lime-500" />
            Un espace pour avancer sereinement
          </p>
          <h1 className="text-5xl font-semibold leading-[1.08] tracking-[-0.055em] sm:text-7xl lg:text-8xl">
            Bonjour, et bienvenue<span className="text-emerald-600">.</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600 sm:text-xl">
            Organise tes études à ta façon. Planifie tes tâches, garde le cap sur tes échéances et libère ton esprit pour apprendre.
          </p>
          <Link
            href="/tasks"
            className="mt-10 inline-flex items-center gap-3 rounded-full bg-slate-900 px-7 py-4 text-base font-medium text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            Découvrir mes tâches
            <span aria-hidden="true" className="text-lg text-lime-300">→</span>
          </Link>
        </div>

        <div className="mt-20 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { number: "01", title: "Pose tes priorités", detail: "Une chose à la fois." },
            { number: "02", title: "Garde le rythme", detail: "Avance à ton tempo." },
            { number: "03", title: "Célèbre tes progrès", detail: "Chaque étape compte." },
          ].map((item) => (
            <div key={item.number} className="rounded-2xl border border-white/80 bg-white/60 p-5 shadow-sm shadow-slate-900/[0.03] backdrop-blur-sm">
              <span className="text-xs font-semibold tracking-widest text-emerald-700">{item.number}</span>
              <h2 className="mt-4 font-semibold">{item.title}</h2>
              <p className="mt-1 text-sm text-slate-500">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="relative mx-auto w-full max-w-7xl px-6 py-6 text-sm text-slate-500 sm:px-10">
        Ton espace d’étude, à ton rythme.
      </footer>
    </main>
  );
}
