> Auditoria histórica do protótipo. O estado encontrado na retomada de 9 de outubro e as decisões atuais estão em [prisma.md](prisma.md).

# Auditoria inicial

Leitura integral do projeto existente e do `banco-questoes-padi.md` antes da implementação. Não havia AGENTS.md aplicável, backend, ORM, biblioteca de gráficos, testes ou configuração de lint.

- Nuxt 4, Vue 3, TypeScript, Tailwind e Nuxt UI, com pnpm.
- `app/pages/index.vue`: apresentação visual já estabelecida.
- `/diagnostico`: redirecionava para `/perguntas?contexto=diagnostico`.
- `/perguntas`: fazia seleção no cliente a partir de `?total` e `?contexto`.
- `/resultado`: dependia somente de `useState`, perdido ao recarregar; permitia reinício.
- `/desafio` e `/dashboard`: páginas de placeholder.
- Componentes `question-card`, `question-option`, `question-progress` e `competency-bars` já organizados em diretórios; preservados.
- `use-diagnostic`: navegação, respostas e cálculo no cliente. Reaproveitado e convertido para sessões de API.
- `select-questions`: seleção balanceada existente reaproveitada no servidor, com rejeição de configurações impossíveis.
- `diagnostic-result`: cálculo normalizado reaproveitado no servidor.
- Banco TypeScript com 28 questões e pontuação no bundle do cliente. Movido para `server/db/questions.ts`; teste compara integralmente IDs, eixos, enunciados, opções, scores e contextos contra o Markdown.
- Tema escuro, layout responsivo e estilos Tailwind preservados; nenhum novo bloco `<style>`.
- O texto antigo do banco sugere `?total`; a instrução atual do usuário prevalece. O documento foi preservado e os parâmetros públicos foram removidos do comportamento da aplicação.

## Decisões históricas, substituídas pela exigência de Prisma

Postgres.js, SQL parametrizado e migrations transacionais com checksum evitam um ORM pesado. Tipos explícitos nos resultados SQL e validação Zod nos limites HTTP; SQL não tem inferência automática a partir do schema. Schema privado `padi`, fora do schema exposto padrão do Supabase. Marcador de ambiente impede usar banco já provisionado de outro ambiente.

Snapshot privado completo mais alternativas e resultados relacionais conservam a apresentação e a pontuação da sessão. Lock de linha na conclusão impede dupla gravação concorrente. Nenhum score de entrada é aceito.

Chart.js + vue-chartjs nos gráficos de distribuição, barras Tailwind para percentuais simples e dados textuais/tabelas acessíveis em todas as visualizações.

Nenhum script de reset foi exposto. Há uma regra de proteção local testada para impedir introdução inadvertida de reset remoto.
