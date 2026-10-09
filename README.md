# Alfabetiza Digital — PADI

Aplicação acadêmica anônima: pesquisa pré-feira, Desafio Digital, resultados individuais persistidos e dashboard agregado. Projeto existente preservado em Nuxt 4, Vue 3, TypeScript, Tailwind CSS, Nuxt UI e pnpm.

## Arquitetura

```text
Navegador → Nuxt/Nitro server/api → Prisma ORM / Prisma Client → PostgreSQL
Local: Docker + Bitnami PostgreSQL
Homolog: Vercel Preview + Supabase Homolog
Production: Vercel Production + Supabase Production
```

Somente Nitro conhece a conexão e os scores. Nenhum cliente Supabase, cadastro/login de participante ou serviço separado. O acesso individual exige um token secreto emitido ao iniciar a sessão. As 28 questões e sete eixos são os de `banco-questoes-padi.md`, sem alteração. O documento ainda contém a proposta antiga de `?total`; a regra vigente está em `shared/config.ts`, e parâmetros de URL não alteram a quantidade.

| Ambiente | Banco | Dados fictícios | Uso |
|---|---|---|---|
| Local | Docker PostgreSQL | Sim | Desenvolvimento |
| Homolog | Supabase Homolog | Sim | Testes |
| Production | Supabase Production | Nunca | Pesquisa real |

## Local

Pré-requisitos: Node.js 22.14+ (LTS), pnpm 10, Docker Desktop/Engine com Compose.

```bash
pnpm install
cp .env.example .env
# Edite POSTGRESQL_PASSWORD e a senha correspondente em DATABASE_URL.
docker compose up -d
pnpm db:migrate:deploy
pnpm db:seed
pnpm dev
```

Abra `http://localhost:3000`. Opcional: `pnpm db:seed:dev` cria 160 pesquisas fictícias variadas, identificadas como sintéticas. Não execute esse seed em um banco destinado a dados reais.

```bash
docker compose down
```

Esse comando preserva o volume `padi_postgres`. Não usamos `down -v`, nem reset automático. A senha é aplicada pela imagem somente na primeira inicialização do volume; mudar `.env` não muda a senha de um banco existente. Porta padrão 5432, restrita a `127.0.0.1`; ao mudar `POSTGRESQL_PORT`, ajuste também `DATABASE_URL`.

### Imagem Bitnami

`bitnami/postgresql`, PostgreSQL **18.6.0**, revisão **21**, fixada pelo digest multi-arquitetura:

```text
sha256:ea7edc281ba9f65e6af5cabbd1ade6e1a32ff473aa79395c2ffd8d6aff8b2036
```

O Compose não usa `latest`. O catálogo público mudou e a tag Debian consultada não existe; o digest e a versão foram confirmados no manifesto/configuração do registro oficial. A imagem oferece amd64 e arm64. Consulte [a documentação Bitnami](https://github.com/bitnami/containers/tree/main/bitnami/postgresql) e [a mudança do catálogo](https://github.com/bitnami/containers/issues/83267). O container foi iniciado e ficou saudável em 9 de outubro de 2026; migrations e integração foram verificadas nesse PostgreSQL Docker. Veja `docs/validacao.md`.

## Variáveis

Nenhuma variável desta tabela deve receber prefixo `NUXT_PUBLIC_`.

| Variável | Local | Homolog | Production |
|---|---|---|---|
| `APP_ENV` | `local` | `homolog` | `production` |
| `DATABASE_URL` | PostgreSQL local | Transaction pooler do projeto Homolog | Transaction pooler do projeto Production |
| `DATABASE_MIGRATION_URL` | Opcional | URL direta ou session pooler do mesmo projeto | URL direta ou session pooler do mesmo projeto |
| `CONFIRM_DATABASE_ENV` | Não necessário | `homolog`, após conferir o destino | `production`, após conferir o destino |
| `POSTGRESQL_DATABASE` | `padi` | Não usar | Não usar |
| `POSTGRESQL_USERNAME` | Usuário local escolhido | Não usar | Não usar |
| `POSTGRESQL_PASSWORD` | Senha local externa ao Git | Não usar | Não usar |
| `POSTGRESQL_PORT` | `5432` ou porta livre | Não usar | Não usar |

`DATABASE_MIGRATION_URL` é o nome escolhido neste projeto para a URL administrativa: `prisma.config.ts` a entrega ao campo `datasource.url` do Prisma 7. Localmente, vazio usa `DATABASE_URL`; os scripts administrativos exigem URL explícita em homolog/production. Os scripts leem `.env` se existir, preservando valores já definidos externamente. Não há seleção automática de `.env.homolog`/`.env.production`: exporte explicitamente as variáveis do ambiente desejado. Arquivos `.env*` estão ignorados, exceto `.env.example`.

`getEnvironment()` rejeita valores ausentes/desconhecidos e divergências com `VERCEL_ENV`. Um marcador na tabela `padi.environment` identifica o banco provisionado. Toda operação confere esse marcador; um banco homolog não é aceito por uma instância production. A conexão local só aceita hosts locais. Esses controles não substituem a conferência das URLs no primeiro provisionamento de um banco vazio. O wrapper de migrations exige `CONFIRM_DATABASE_ENV` igual a `APP_ENV` para comandos administrativos remotos; esta variável não é necessária na aplicação Vercel.

## Supabase e Vercel

Crie **dois projetos Supabase separados**. Não reutilize projeto, credenciais ou dados entre homolog e produção. Mantenha o schema privado `padi` fora dos schemas expostos pela Data API; migrations revogam acesso público ao schema. Não é necessário habilitar Auth, Storage ou Realtime.

Na opção **Connect** de cada projeto, copie a URL real adequada. Não há URLs Supabase inventadas neste repositório:

- Aplicação Vercel: **transaction pooler**, geralmente porta 6543, com Prisma 7 e `@prisma/adapter-pg` (driver `pg`, sem prepared statements nomeados). Pool do adapter de no máximo duas conexões por instância, timeout de conexão, conexões ociosas e tempo máximo de vida configurados. Usa runtime Node/Nitro, não Edge.
- Migrations/seed: conexão direta se o executor suporta a conectividade do projeto, ou **session pooler** para acesso IPv4. Configure `DATABASE_MIGRATION_URL` apontando para o mesmo projeto. Não execute migrations a cada inicialização de função.
- Use `sslmode=verify-full` nas URLs remotas. TLS com verificação completa de certificado em homolog/production; não desabilite verificação para contornar um erro. Se usar CA personalizada, configure confiança no ambiente Node.

Referência: [conexões PostgreSQL no Supabase](https://supabase.com/docs/guides/database/connecting-to-postgres) e [prepared statements](https://supabase.com/docs/guides/troubleshooting/disabling-prepared-statements-qL8lEL).

### Homolog

1. Crie Supabase Homolog e obtenha URLs/credenciais.
2. Confira que ambas as URLs pertencem ao Supabase Homolog. Configure externamente `APP_ENV=homolog`, `DATABASE_URL`, `DATABASE_MIGRATION_URL` e `CONFIRM_DATABASE_ENV=homolog` no executor administrativo.
3. Execute `pnpm db:migrate:deploy` e `pnpm db:seed`.
4. Opcionalmente execute `pnpm db:seed:dev`. A proteção confere ambiente e marcador do banco.
5. Na Vercel, importe este projeto com preset Nuxt, pnpm e Node LTS suportado. Use `pnpm build`; deixe output/preset sob detecção Nuxt/Vercel.
6. Defina `APP_ENV=homolog` e `DATABASE_URL` **somente no escopo Preview**. Restrinja branches conforme seu fluxo de homologação.
7. Valide pesquisa, desafio, retomada, resultado, filtros e dashboard no deploy Preview.

### Production

1. Crie outro projeto Supabase vazio para dados reais.
2. Depois de validar as mesmas migrations em local e homolog, confira as URLs desse projeto e configure externamente `APP_ENV=production`, `DATABASE_URL`, `DATABASE_MIGRATION_URL` e `CONFIRM_DATABASE_ENV=production` no executor administrativo.
3. Execute `pnpm db:migrate:deploy` e **somente** `pnpm db:seed`.
4. Configure `APP_ENV=production` e `DATABASE_URL` no escopo **Production** da Vercel.
5. Faça deploy após as migrations; mantenha as credenciais de migrations no executor administrativo, não no browser.

Nunca execute seed fictício em production. Não existe script `db:reset`. A função de proteção de reset aceita apenas local e é testada. Não há deploy automático ou configuração de contas externas nesta entrega.

## Schema e migrations

Prisma **7.10.0**, Prisma Client e `@prisma/adapter-pg` estão fixados na mesma versão. A compatibilidade foi conferida para Node 22.14.0, TypeScript 5.9 e o build Nuxt 4/Nitro. A versão `latest` consultada era um release candidate 8; não foi adotada.

O schema está em `prisma/schema.prisma`, com modelos, relações e enums. O Client é gerado em `server/generated/prisma` (ignorado no Git). `server/db/client.ts` centraliza uma instância por processo, inclusive durante hot reload; scripts administrativos desconectam ao terminar. `postinstall` e `build` geram o Client. Não existem imports Prisma no frontend.

Migrations em `prisma/migrations`:

1. `20261007000000_legacy_baseline`: schema inicial equivalente ao SQL anterior, incluindo CHECKs e snapshots.
2. `20261007010000_prisma_constraints`: enums, status, timestamps e índices. Preserva sessões existentes, preenchendo COMPLETED a partir da conclusão anterior.
3. `20261007151143_profile_kind_defaults`: converte constantes geradas do perfil em defaults, NOT NULL e CHECKs equivalentes, compatíveis com o schema Prisma.
4. `20261009000000_session_access`: adiciona o hash de acesso, preservando sessões antigas.
5. `20261009010000_completion_integrity`: exige totais não nulos e coerentes nas sessões concluídas.

Não edite migrations aplicadas. O histórico autoritativo passa a ser `_prisma_migrations` (no schema padrão da URL administrativa, geralmente `public`); a tabela antiga de checksums é removida pela segunda migration. Os CHECKs específicos de PostgreSQL permanecem nas migrations porque o Prisma Schema não representa todos eles.

**Banco novo:** `pnpm db:migrate:deploy`, depois `pnpm db:seed`.

**Banco com a versão anterior já aplicada:** faça backup e confira o schema contra o baseline, execute uma única vez `pnpm db:baseline` e depois `pnpm db:migrate:deploy`. O baseline confere ambiente e checksum da migration legada antes de executar `prisma migrate resolve --applied`; não cria nem apaga tabelas de pesquisa. Não execute baseline em banco vazio. O checksum confirma o histórico conhecido, mas não detecta alterações manuais posteriores; a inspeção prévia é necessária.

**Criar mudança local:** edite `schema.prisma`, execute `pnpm db:migrate:dev --create-only --name nome_da_alteracao`, revise o SQL e aplique com `pnpm db:migrate:dev`. Gere novamente o Client com `pnpm prisma:generate`. O usuário PostgreSQL local precisa de CREATEDB para o shadow database do Migrate dev. O script rejeita ambientes remotos.

**Promover para homolog/production:** use as mesmas migrations revisadas com `pnpm db:migrate:deploy`, seguido de `pnpm db:seed`. Nunca use `migrate dev`, `db push` ou reset nesses ambientes. Não há migration automática no boot ou no build Vercel.

**Validação do schema e Client:**

```bash
pnpm prisma:format
pnpm prisma:validate
pnpm prisma:generate
pnpm db:migrate:status
```

**Prisma Studio local:** `pnpm prisma:studio` e abra o endereço localhost indicado pelo CLI. Inspecione Competency, Question, QuestionOption, SurveySession, SessionQuestion e SurveyAnswer. Não publique Studio; o dashboard de pesquisa continua em `/dashboard`. O script só aceita APP_ENV=local e banco local.

O seed estrutural é transacional e usa upserts para sete competências, Q01–Q28, 112 alternativas, contextos e opções de perfil. Reexecução não duplica nem reativa questões desativadas. Snapshots existentes permanecem imutáveis.

O seed fictício usa perfis de acesso/autonomia variados, cinco cursos, oito semestres e respostas heterogêneas; não modela a população real. Se já houver sessões sintéticas, não duplica o conjunto. A API/dashboard sinaliza a presença de dados fictícios. Não existe remoção automática desses dados: use bancos homolog separados dos reais.

## Rotas e endpoints

| Rota | Função |
|---|---|
| `/pesquisa` | Apresentação, perfil contextual e 14 questões |
| `/desafio` | Cinco questões elegíveis para feira em eixos distintos |
| `/resultado/:sessionId` | Resultado persistido, consultável ao recarregar |
| `/dashboard` | Agregações da pesquisa concluída e comparação de segmentos |
| `/diagnostico`, `/perguntas` | Compatibilidade: redirecionam para `/pesquisa`, sem parâmetros de quantidade |

| Método/API | Contrato |
|---|---|
| `POST /api/surveys/research/start` | `{ profile: { course, semester, device, internet, help } }` |
| `POST /api/surveys/fair/start` | `{}` |
| `GET /api/sessions/:sessionId` | Sessão, perguntas públicas e estado de conclusão |
| `POST /api/sessions/:sessionId/submit` | `{ answers: [{ questionId, optionId }] }` |
| `GET /api/sessions/:sessionId/result` | Totais, percentuais, feedback e competências apresentadas |
| `GET /api/dashboard/summary` | Filtros opcionais `course`, `semester`, `device`, `internet` |

Campos extras ou valores inválidos são rejeitados. O início retorna `{ sessionId, accessToken, mode, completed, questions }`. `accessToken` tem 32 bytes aleatórios (256 bits), é retornado somente na criação e deve ser enviado em **todas** as requisições a `/api/sessions/:sessionId` (incluindo `/submit` e `/result`) pelo header:

```http
Authorization: Bearer <accessToken>
```

O servidor armazena somente SHA-256 do token e verifica o acesso antes de retornar perguntas/resultados ou aceitar respostas. UUID sozinho, token de outra sessão e tokens ausentes/incorretos recebem 403. O token não entra em URLs, query strings ou no dashboard. O resultado é carregado no cliente usando o segredo do navegador; abrir apenas o link em outro dispositivo não autoriza acesso. Não retornam perfil contextual pelo endpoint de sessão/resultado. Erros de banco são apresentados como indisponibilidade, sem stack trace ou detalhes de conexão. Respostas de API não são cacheadas.

## Seleção, submissão e retomada

`shared/config.ts` centraliza quantidades, contextos, opções e limite mínimo. O algoritmo agrupa questões ativas/elegíveis por eixo, sorteia eixos distintos inicialmente, preenche priorizando os menos representados e embaralha a ordem final. Rejeita quantidade impossível e falta de um dos sete eixos para sessões de pelo menos sete questões. Com 14, são duas por eixo; com cinco na feira, cinco eixos distintos.

A sessão e as perguntas são gravadas em transação antes do retorno ao navegador. A projeção pública contém somente ID, competência, enunciado e alternativas ID/label. O banco TypeScript com scores está em `server/`, nunca em `app/`.

Na conclusão, um `updateMany` condicionado a `status=IN_PROGRESS` bloqueia a linha da sessão dentro de `$transaction`. Uma conclusão concorrente aguarda e recebe 409 quando a condição deixa de ser satisfeita. A mesma transação valida estado, pertencimento, alternativas, completude e duplicidade; grava respostas/resultados; marca conclusão. Submissão concorrente ou repetida recebe 409. Se o navegador perder a resposta do envio, consulta o estado e recupera o resultado já persistido.

O máximo de cada eixo vem somente das questões apresentadas. Eixos ausentes são omitidos. O desafio não recebe percentual global. Empates aparecem sem escolher arbitrariamente uma competência.

`padi:research:v2` guarda sessão em andamento, token e respostas locais, ou `{completed:true,sessionId,accessToken}` ao concluir. A retomada busca as perguntas originais na API, sem novo sorteio. Pesquisa concluída oferece “Ver meu resultado”, sem botão para apagar a participação. `padi:fair:v2` é separado e permite novo desafio. Armazenamento bloqueado gera aviso e não impede responder: o segredo fica na memória durante a visita, mas não há garantia de retomada após fechar/recarregar.

**Sessões anteriores à proteção por token:** continuam no banco e nos agregados, mas ficam sem acesso individual; não existe recuperação segura a partir apenas do UUID de uma participação anônima. Marcadores v1 concluídos são respeitados para evitar repetição acidental e mostram uma explicação da atualização. Apenas uma participação antiga incompleta e sem segredo permite começar uma nova sessão; a anterior continua preservada no banco. Nenhum token é derivado do UUID nem há endpoint para reivindicar sessões antigas. Perder o armazenamento local/segredo de uma sessão nova também impede recuperá-la por identidade, pois não coletamos dados identificadores.

## Dashboard e privacidade

Prisma utiliza count e groupBy para contagens, médias dos percentuais individuais, médias/distribuições por competência, desempenho por questão e distribuições contextuais. Nenhum conjunto de respostas brutas é enviado. Pesquisa incompleta e desafio ficam fora das métricas.

Filtros começam em “Todos”, podem ser combinados e atualizam as métricas. Comparação com amostra geral usa percentuais normalizados. Questões aparecem do menor para o maior percentual médio, com n e distribuição dos scores quando permitida.

`MIN_AGGREGATE_SAMPLE_SIZE = 5`: segmentos menores e complementos pequenos são suprimidos, inclusive na comparação com todos os subconjuntos dos filtros ativos; a resposta não expõe sua contagem exata. Questões/eixos exigem n mínimo. Distribuições que contêm células não vazias abaixo do limite são inteiramente suprimidas para impedir inferência direta por subtração. Comparações por questão/eixo e distribuições também suprimem complementos pequenos. Consultas usam uma transação RepeatableRead. Uma única consulta `$queryRaw` parametrizada calcula médias de respostas divididas pelo máximo do snapshot e agrega o título JSON; o restante usa operações Prisma. Esses controles reduzem a reconstrução por diferenças entre filtros. Não constituem privacidade diferencial nem garantia contra todas as consultas sobrepostas ou mudanças da amostra ao longo do tempo; não há histórico/budget de consultas por pessoa, já que não se exige login.

Chart.js/vue-chartjs nas distribuições; barras Tailwind para comparações simples; legendas textuais e tabela por questão. Interface escura, responsiva, labels, rádio nativo com teclado, foco visível, mensagens acessíveis e foco no enunciado ao avançar/voltar.

## Scripts e testes

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Sem infraestrutura anterior de testes, adotamos `node:test` com `tsx` para domínio e integração, ESLint para TS/Vue, Playwright para navegador.

- `db:up` / `db:down`: Compose, sem remoção de volumes.
- `db:migrate:dev`: desenvolvimento local, criação/revisão de migrations.
- `db:migrate:deploy`: aplica migrations pendentes em qualquer ambiente autorizado.
- `db:migrate`: alias de compatibilidade para deploy.
- `db:baseline`: adota o histórico legado verificado, uma única vez.
- `prisma:generate` / `prisma:studio`: geração do Client e inspeção local.
- `db:seed`: sete eixos, 28 questões, 112 alternativas, contextos e opções.
- `db:seed:dev`: dados fictícios apenas local/homolog.
- `test:integration`: exige ambiente local e nome de banco terminado em `_test`, vazio e já migrado/semeado.
- `test:e2e`: inicia o build local na porta 3107 e exige banco `_test`; nunca aponte testes com escrita para produção. Rode `pnpm exec playwright install chromium` antes; alternativamente `PLAYWRIGHT_CHANNEL=chrome pnpm test:e2e` usa Chrome instalado.

Para integração, crie um banco local **separado** `padi_test`, configure a URL dele externamente e aplique migrations/seed. Exemplo de sequência, usando a URL real desse banco sem commitá-la:

```bash
# export APP_ENV=local
# export DATABASE_URL=<URL_LOCAL_PADI_TEST>
# export DATABASE_MIGRATION_URL=<MESMA_URL_LOCAL_PADI_TEST>
pnpm db:migrate:deploy
pnpm db:seed
pnpm test:integration
```

Use um banco vazio, aplique migrations/seed estrutural, rode integração e somente depois execute `db:seed:dev` para preparar o dashboard dos testes de navegador. Os testes de integração removem apenas as sessões que eles próprios criaram; não truncam o banco. Não execute concorrendo com participantes reais. Detalhes do que foi efetivamente validado: [docs/validacao.md](docs/validacao.md). Auditoria inicial: [docs/auditoria.md](docs/auditoria.md).

## Limitações acadêmicas

Pesquisa anônima, sem nome/e-mail/documentos ou fingerprinting. LocalStorage evita repetição acidental, mas não garante uma pessoa = uma resposta. Instrumento não psicometricamente validado. Resultados são descritivos, não certificação ou evidência causal. Desafio Digital não é diagnóstico completo. Revise cursos/semestres em `shared/config.ts` e faça pré-teste de linguagem e tempo antes da aplicação oficial.

## Relatório da adoção de Prisma

Veja [docs/prisma.md](docs/prisma.md) para o estado encontrado, decisões de modelagem, migração segura e proteção das sessões. [docs/relatorio-final.md](docs/relatorio-final.md) resume a entrega atual; [docs/validacao.md](docs/validacao.md) registra somente as verificações executadas nesta retomada.
