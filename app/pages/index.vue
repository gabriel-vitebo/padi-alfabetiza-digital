<template>
  <div>
    <section class="mx-auto grid w-full max-w-6xl gap-12 px-5 pb-16 pt-14 sm:px-8 sm:pt-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-20 lg:pb-24">
      <div>
        <p class="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-teal-300">Tecnologia com consciência</p>
        <h1 class="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-white sm:text-6xl">
          Como nos relacionamos com o mundo digital?
        </h1>
        <p class="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
          Esta aplicação faz parte de uma pesquisa acadêmica sobre alfabetização e competências digitais. Queremos compreender como estudantes lidam com situações relacionadas ao uso consciente, crítico e seguro da tecnologia.
        </p>
        <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <UButton to="/diagnostico" size="xl" color="primary" trailing-icon="i-lucide-arrow-right" class="justify-center sm:justify-start">
            Iniciar diagnóstico
          </UButton>
          <span class="text-center text-sm text-slate-400 sm:text-left">Uma etapa futura da pesquisa</span>
        </div>
      </div>

      <div class="relative overflow-hidden rounded-3xl border border-teal-900/80 bg-slate-900 p-6 shadow-2xl shadow-black/20 sm:p-8" aria-label="Ilustração abstrata sobre conexão e aprendizado">
        <div class="absolute -right-16 -top-16 size-48 rounded-full border-24 border-slate-800/80" aria-hidden="true"></div>
        <div class="relative flex min-h-64 flex-col justify-between sm:min-h-72">
          <div class="flex items-center justify-between">
            <span class="rounded-full border border-teal-800 bg-teal-950/60 px-3 py-1 text-xs font-semibold text-teal-200">Pesquisa em construção</span>
            <span class="text-2xl text-teal-300" aria-hidden="true">✦</span>
          </div>
          <div>
            <CompetencyBars />
            <p class="max-w-xs text-2xl font-semibold leading-tight text-white">Aprender também é saber escolher.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="border-y border-slate-800/80 bg-slate-950/40">
      <div class="mx-auto grid w-full max-w-6xl gap-6 px-5 py-10 sm:px-8 md:grid-cols-3 md:py-12">
        <div>
          <p class="text-sm font-semibold text-teal-300">01</p>
          <h2 class="mt-2 text-lg font-semibold text-slate-100">Uso consciente</h2>
          <p class="mt-2 text-sm leading-6 text-slate-400">Refletir sobre escolhas e hábitos no ambiente digital.</p>
        </div>
        <div>
          <p class="text-sm font-semibold text-teal-300">02</p>
          <h2 class="mt-2 text-lg font-semibold text-slate-100">Pensamento crítico</h2>
          <p class="mt-2 text-sm leading-6 text-slate-400">Analisar informações, contextos e diferentes perspectivas.</p>
        </div>
        <div>
          <p class="text-sm font-semibold text-teal-300">03</p>
          <h2 class="mt-2 text-lg font-semibold text-slate-100">Segurança digital</h2>
          <p class="mt-2 text-sm leading-6 text-slate-400">Reconhecer cuidados importantes para navegar com mais segurança.</p>
        </div>
      </div>
    </section>
  </div>
</template>
