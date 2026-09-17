<template>
  <div class="flex min-h-screen flex-col">
    <header class="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur">
      <div class="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <NuxtLink to="/" class="flex items-center gap-3" aria-label="Alfabetiza Digital, página inicial">
          <span class="flex size-9 items-center justify-center rounded-xl bg-teal-300 text-sm font-bold text-slate-950" aria-hidden="true">AD</span>
          <span class="text-sm font-semibold tracking-wide text-slate-100">Alfabetiza Digital</span>
        </NuxtLink>
        <span class="hidden text-xs font-medium uppercase tracking-[0.16em] text-slate-400 sm:inline">Pesquisa acadêmica</span>
      </div>
    </header>

    <main class="flex-1">
      <slot />
    </main>

    <footer class="border-t border-slate-800/80 bg-slate-950/60">
      <div class="mx-auto w-full max-w-6xl px-5 py-5 text-center text-xs text-slate-400 sm:px-8 sm:text-left">
        Projeto acadêmico sobre alfabetização e competências digitais.
      </div>
    </footer>
  </div>
</template>
