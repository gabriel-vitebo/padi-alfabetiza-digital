# Consolidação Prisma — 9 de outubro de 2026

## Estado encontrado

A auditoria desta retomada encontrou uma aplicação integrada, e não apenas placeholders. Pesquisa/desafio reutilizavam o mesmo motor; havia seleção, snapshots, submissão transacional, resultados, dashboard com consultas reais, filtros, gráficos e testes. O banco de 28 questões continuava idêntico ao documento metodológico.

A conversão anterior para **Prisma 7.10.0 já estava presente**: Client central, adapter, modelos, três migrations, seeds em Prisma e agregações com groupBy. O banco Docker local tinha essas três migrations aplicadas, sete eixos, 28 questões e duas sessões. As alterações staged e unstaged foram preservadas; nenhum commit ou reset foi feito.

Pendências verificadas no código:

- UUID sozinho autorizava leitura e submissão de qualquer sessão conhecida.
- Retomada e resultado não guardavam nem enviavam um segredo independente.
- A proteção de comparação só verificava complemento em relação à amostra total, sem analisar os subconjuntos dos filtros ativos.
- Distribuições/questões comparadas podiam ter complementos pequenos mesmo quando o total do segmento era suficiente.
- O comando de seed dependia de `tsx` estar no PATH do chamador.
- Wrapper de migration não identificava o ambiente de um banco recém-provisionado até o seed.
- O CHECK legado de totais usava comparações que podiam resultar em NULL, aceito por um CHECK SQL.
- README apontava para `docs/prisma.md`, que não existia, e ainda descrevia acesso individual apenas por link e storage v1.
- Os relatórios antigos registravam outra camada de banco e uma falha anterior do Docker; não eram evidência de validação desta versão.

## Prisma exclusivo

`prisma`, `@prisma/client` e `@prisma/adapter-pg`: **7.10.0**. Mantida a versão instalada compatível com Node 22.14.0 e TypeScript 5.9.3. Não foi adotado o release candidate 8 sugerido pelo CLI.

Nenhum outro ORM ou cliente PostgreSQL é usado pela aplicação. A antiga dependência direta `postgres` já estava removida no estado encontrado; não houve dependência adicional removida nesta retomada. `pg` permanece como dependência interna legítima do adapter. Não há imports Prisma no frontend.

`server/db/client.ts` cria o Client com `PrismaPg` e reutiliza uma instância por processo/hot reload. Pool limitado a duas conexões por instância, timeout de conexão 10s, idle 20s, vida máxima 300s. `$transaction` tem espera máxima 10s e timeout 30s. TLS remoto verifica certificados.

`prisma.config.ts` fornece schema, pasta de migrations, comando do seed e URL administrativa. `DATABASE_URL` é runtime; `DATABASE_MIGRATION_URL` é a conexão direta/session pooler para administração, com fallback local. Os scripts remotos exigem confirmação de ambiente por `CONFIRM_DATABASE_ENV`. Nenhuma operação remota foi executada nesta retomada.

## Modelagem

| Modelo | Uso e integridade |
|---|---|
| Environment | Marcador único local/homolog/production |
| Competency | Sete eixos e relações com questões/resultados |
| Question | Enunciado, título, justificativa interna, ativo, timestamps e competência |
| QuestionContext | PK composta questão/contexto; enum diagnostico/feira |
| QuestionOption | PK questão/alternativa, score limitado por CHECK |
| ProfileOption | Catálogo de opções contextuais, PK tipo/valor |
| SurveySession | UUID, modo/status em enums, datas, totais, quantidade, synthetic e hash do segredo |
| ParticipantProfile | Um perfil por sessão; FKs para opções e índices dos filtros |
| SessionQuestion | PK sessão/questão, ordem única por sessão e snapshot privado |
| SessionOption | Alternativas e scores imutáveis da apresentação daquela sessão |
| SurveyAnswer | PK sessão/questão e FK composta para alternativa da sessão |
| CompetencyResult | PK sessão/competência, pontos/máximo e CHECKs |

CHECKs PostgreSQL não representáveis no Prisma Schema permanecem nas migrations. O Prisma Schema representa relacionamentos, enums, defaults, unicidade, índices e timestamps. `migrate diff` foi utilizado para conferir a estrutura modelável.

## Histórico consistente

1. `20261007000000_legacy_baseline`: preserva o schema SQL inicial como baseline Prisma.
2. `20261007010000_prisma_constraints`: enums, status/timestamps e índices, preservando dados anteriores.
3. `20261007151143_profile_kind_defaults`: constantes do perfil como defaults/NOT NULL/CHECKs.
4. `20261009000000_session_access`: hash de acesso nullable para preservar registros legados sem conceder acesso inseguro.
5. `20261009010000_completion_integrity`: proíbe totais nulos/incoerentes ao concluir.

As três migrations encontradas não foram editadas. As duas novas foram adicionadas e aplicadas com **Prisma Migrate**, sem reset. `_prisma_migrations` é o histórico autoritativo; sua localização depende do schema padrão da URL administrativa (neste ambiente, `public`).

Bancos novos recebem todas via deploy. Bancos anteriores ao Prisma seguem o baseline protegido descrito no README: backup, inspeção de schema, checksum conhecido, `migrate resolve --applied`, depois deploy. Esse caminho foi exercitado em outro banco Docker isolado: uma sessão legada concluída manteve os sete pontos obtidos e dez possíveis. A tabela antiga de checksums é removida pela migration histórica já existente; os dados de pesquisa não são apagados.

## Proteção de sessão

Ao criar uma sessão, o backend gera 32 bytes com `crypto.randomBytes` e retorna o segredo em base64url. O PostgreSQL recebe somente o hash SHA-256. O segredo nunca é derivado do UUID.

GET da sessão, POST de respostas e GET de resultado exigem `Authorization: Bearer <token>`. Comparação do hash usa `timingSafeEqual`. Tokens ausentes, malformados, incorretos ou de outra sessão são negados. O dashboard não tem tokens, IDs de participantes ou respostas individuais.

O navegador guarda `padi:research:v2`/`padi:fair:v2`, incluindo token e ID. O segredo não é colocado na URL nem no HTML renderizado pelo servidor. Resultado é consultado client-side. Se storage falhar, a memória da visita mantém o acesso e a interface informa a limitação de retomada.

Sessões anteriores permanecem no banco/agregados, mas **não são reivindicáveis por UUID**. Sem identidade ou segredo anterior, não há recuperação segura. Marcadores v1 concluídos continuam prevenindo repetição acidental e mostram a explicação da atualização. Apenas a sessão antiga incompleta pode ser substituída, por ação explícita, por uma nova participação; não se apaga o registro no banco. Perder o segredo local também impede a recuperação de sessões novas; não introduzimos login, CPF, e-mail ou fingerprinting.

## Transação e cálculo

Início consulta questões ativas via Prisma, seleciona 14 para pesquisa (duas por eixo) ou cinco para feira (eixos distintos/contexto feira), e grava sessão/perfil/snapshots em `$transaction`. A projeção pública exclui score, justificativa e resposta ideal.

Submissão autentica a sessão, faz `updateMany` condicionado a IN_PROGRESS para adquirir o lock, valida pertencimento/completude/duplicidade e grava respostas/resultados/conclusão na mesma transação. Concorrentes aguardam e recebem 409 quando a primeira conclui. Falhas fazem rollback. PKs/FKs/CHECKs protegem também o banco.

Resultados são reconstruídos com os snapshots persistidos, não com uma nova consulta às questões editáveis. Eixos ausentes são omitidos, percentuais usam somente o máximo apresentado e desafio não produz percentual global. Feedback e empates são educativos, sem classificação definitiva.

## Agregados e privacidade

Prisma count/groupBy obtém frequências agregadas; a aplicação combina essas frequências em médias ponderadas dos percentuais. Uma consulta `$queryRaw` com `Prisma.sql` e parâmetros calcula a média por questão em relação ao máximo do snapshot. Não existe driver SQL paralelo ou interpolação de SQL de usuário.

Somente pesquisa concluída entra no painel. Há filtros de curso, semestre, dispositivo e internet, comparação com amostra geral, distribuições, questões ordenadas e sinalização de dados fictícios.

Mínimo de cinco: segmento, complementos da amostra geral e de todos os subconjuntos dos filtros ativos. Questões/eixos e distribuições comparadas têm supressão adicional para complementos pequenos. Uma célula pequena suprime a distribuição inteira, evitando subtração simples. Tudo usa uma transação RepeatableRead.

Não é privacidade diferencial: resultados exatos continuam sujeitos a inferências por consultas sobrepostas, informações externas ou evolução temporal. Essa limitação está documentada; não há alegação de anonimização absoluta.

## Seeds e validação

Seed estrutural: upserts, transação, sete competências, Q01–Q28, 112 alternativas, contextos, justificativas e opções. Conteúdo persistido comparado ao banco TypeScript e ao Markdown. Seed fictício separado cria 160 participações coerentes para desenvolvimento; reexecução não duplica. `APP_ENV=production` aborta antes de conectar.

Veja [validacao.md](validacao.md) para resultados efetivamente executados no Docker. Nenhum dado fictício foi inserido no banco local principal nesta retomada: esse banco manteve suas duas sessões; os dados de navegador/dashboard foram gerados em bancos `_test` separados.

## Arquivos desta retomada

Criados: duas migrations incrementais; `server/domain/session-access.ts`; `server/utils/session-token.ts`; `app/composables/use-session-access.ts`; `server/domain/aggregate-privacy.ts`; este relatório.

Modificados: schema, configuração Prisma, scripts de migration/seed fictício e package scripts; serviço e APIs de sessão; composable do questionário e página de resultado; dashboard server-side; testes de domínio, integração e navegador; `.env.example`, README e relatórios.

Limpeza: helper de label sem uso e ramo inalcançável do sorteio; referências de operação desatualizadas. Lógica de seleção/cálculo, questões, componentes, páginas e migrations anteriores foram preservados.
