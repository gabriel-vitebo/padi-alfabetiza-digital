# Validação da retomada — 9 de outubro de 2026

Esta página substitui o relatório de validação anterior. Os resultados abaixo foram obtidos nesta retomada com Prisma e PostgreSQL em Docker; não são herdados dos testes antigos com outro cliente SQL.

## Ambiente real

- Node.js 22.14.0; Prisma/Client/adapter 7.10.0.
- Docker Desktop iniciou nesta sessão. `docker compose up -d` iniciou o banco; `docker compose ps` mostrou **healthy**.
- Imagem oficial Bitnami PostgreSQL 18.6.0, fixada pelo digest do Compose; o log do container confirmou PostgreSQL 18.6.
- Banco local principal `padi`: três migrations já aplicadas e duas sessões encontradas. Aplicadas apenas as duas novas migrations e seed estrutural idempotente. **As duas sessões foram preservadas.**
- Integração e dados fictícios em bancos locais separados com sufixo `_test`. Nenhum teste escreveu em homologação ou produção.

## Verificações executadas

| Verificação | Resultado |
|---|---|
| Prisma format | Passou |
| Prisma validate | Schema válido |
| Prisma generate | Client gerado em server/generated/prisma |
| Prisma migrate deploy, banco vazio | Cinco migrations aplicadas |
| Prisma migrate deploy, banco existente | Duas migrations novas aplicadas; anteriores mantidas |
| Prisma migrate deploy repetido | Sem migrations pendentes |
| Prisma migrate diff | Sem diferenças na estrutura modelável |
| Seed estrutural repetido via Prisma db seed | 7 eixos, 28 questões, 112 alternativas; sem duplicação |
| Conteúdo persistido | Comparado com o banco TypeScript, que é testado contra o Markdown |
| Seed fictício repetido | 160 sessões; segunda execução não duplicou |
| Seed com APP_ENV=production | Abortou antes de conectar |
| Baseline de banco legado | Executado em banco isolado; sessão e totais preservados |
| Lint | Passou |
| Typecheck | Passou |
| Testes de domínio | 12 passaram |
| Integração PostgreSQL Docker | Cenário abrangente passou |
| Build Nuxt/Nitro com Prisma | Passou |
| Navegador e HTTP real | Cinco cenários Playwright/Chrome passaram |
| Assets públicos | Sem Client Prisma, conexão, hash de acesso ou banco interno de questões |
| Git diff --check | Passou |

## Testes de domínio

Fonte de verdade Q01–Q28/enunciados/opções/scores/contextos; seleção balanceada em 100 sorteios; cinco eixos na feira; generalização 1–28 questões; duplicações/banco impossível; cálculo normalizado; submissão incompleta/duplicada/questão externa/alternativa inválida/concluída; projeção sem pontuação; filtros e dados contextuais; bloqueios production/reset; supressão de células pequenas; segredo independente de UUID; rejeição de hash legado ausente; todos os subconjuntos dos filtros ativos.

## Integração em PostgreSQL Docker

- Dashboard vazio e sessão real com 14 questões/snapshots.
- Retomada idêntica, sem novo sorteio.
- Token ausente/incorreto negado; somente hash de 64 caracteres persistido.
- FKs rejeitam alternativa externa; PK rejeita resposta duplicada; transação com duplicação reverte todas as respostas.
- CHECKs rejeitam status concluído inconsistente e conclusão com pontuação nula.
- Submissão incompleta, duplicada, com pergunta externa ou opção inválida não deixa respostas parciais.
- Duas submissões concorrentes: exatamente uma conclui; reenvio recebe 409.
- Alteração temporária do score da questão original não muda resultado da sessão já persistida.
- Desafio com cinco eixos, sem percentual global e excluído do dashboard acadêmico.
- Amostra controlada: média geral 75%, segmento de cinco com média 100%; filtros e amostra insuficiente conferidos.
- Segmento de cinco dentro de um curso de oito é suprimido: o complemento de três não pode ser reconstruído por comparação com esse filtro ancestral.
- Limpeza somente dos IDs criados pelo próprio teste, sem reset/truncate.

## Migrations, seeds e legado

O caminho completo de cinco migrations foi aplicado em `padi_final_20261009_test`. O banco `padi_prisma_20261009_test` recebeu testes e, depois, o seed fictício para navegador. O banco `padi_legacy_20261009_test` simulou a versão anterior ao Prisma, com histórico/checksum conhecido e sessão concluída de sete pontos em dez. `db:baseline` marcou somente o baseline como aplicado; deploy promoveu o schema e preservou os totais/status. O hash permaneceu NULL, portanto essa sessão não ganha acesso apenas por UUID.

Foi corrigida uma falha real do seed: `prisma db seed` chamado diretamente por Node não encontrava `tsx` no PATH. O comando configurado agora é `node --import tsx scripts/seed.ts`; as duas execuções de verificação passaram.

## Navegador e HTTP

Playwright usa o build real (`.output/server/index.mjs`) na porta local 3107 e PostgreSQL Docker. As APIs não foram mockadas. Chrome já instalado foi utilizado com `PLAYWRIGHT_CHANNEL=chrome`.

Cenários: pesquisa mobile com 14 perguntas apesar de `?total=1`, retomada e foco após reload, payload sem scores, token exigido, conclusão/resultado persistente, acesso negado em outro navegador, prevenção local de repetição; desafio com cinco perguntas e resultado limitado; dashboard com canvas/tabela/filtros/amostra insuficiente; validação HTTP de entradas inválidas; tratamento dos marcadores legados.

## Limitações externas

Supabase Homolog, Supabase Production e deploys Vercel não foram executados: não foram fornecidas/configuradas credenciais externas. Pooling/TLS estão preparados conforme a documentação, mas não são alegados como validados nesses provedores.

O container local foi mantido ativo para desenvolvimento, com seu volume preservado. Os servidores HTTP lançados pela suíte são encerrados automaticamente pelo Playwright. Arquivos de ambiente dos testes e artefatos são ignorados pelo Git.
