# Banco de Questões — Diagnóstico de Alfabetização Digital (PADI)

> **Status:** instrumento proposto para aplicação exploratória/protótipo acadêmico.  
> As questões foram construídas a partir dos sete eixos da matriz de competências do PADI apresentada no artigo revisado.  
> **Não se trata de um instrumento psicométrico validado.** Os resultados devem ser apresentados como indicativos das respostas às situações propostas, e não como diagnóstico clínico, certificação ou classificação definitiva de alfabetização digital.

## 1. Estratégia de aplicação

O sistema utilizará um banco único de questões. Cada questão possui um campo `contexts` indicando onde pode ser utilizada:

- `diagnostico`: aplicação disponibilizada previamente aos estudantes;
- `feira`: aplicação rápida durante a feira;
- uma questão pode pertencer aos dois contextos.

A quantidade será recebida pela aplicação, por exemplo:

- `/perguntas?total=14&contexto=diagnostico`
- `/perguntas?total=5&contexto=feira`

### Regra de sorteio

1. Filtrar as questões compatíveis com o contexto solicitado.
2. Embaralhar as questões elegíveis.
3. Quando `total >= 7`, selecionar **no mínimo uma questão de cada um dos sete eixos**.
4. Preencher as vagas restantes aleatoriamente, buscando equilíbrio entre os eixos e evitando repetição de questão.
5. Quando `total < 7`, é matematicamente impossível apresentar todos os eixos em uma única sessão. Nesse caso, sortear eixos distintos até atingir `total`, sem repetir eixo enquanto houver eixos ainda não utilizados.
6. A ordem final das questões também deve ser embaralhada.
7. O parâmetro `total` nunca pode exceder a quantidade de questões disponíveis para o contexto.
8. Para análise acadêmica principal, recomenda-se `total >= 14`, pois 10 questões não permitem representar igualmente os sete eixos. Para a feira, 3–5 questões funcionam como experiência demonstrativa, não como diagnóstico completo.

## 2. Pontuação

Cada alternativa possui pontuação interna:

- `2` — decisão mais adequada à competência observada;
- `1` — decisão parcialmente adequada, mas incompleta ou com risco/limitação;
- `0` — decisão inadequada para a situação.

A pontuação não deve ser exibida durante o questionário.

As justificativas abaixo são material interno para documentação e revisão do instrumento.

---

# Eixo 1 — Acesso e utilização

Competência do artigo: operar dispositivos, aplicativos e ambientes digitais de acordo com diferentes finalidades, demonstrando autonomia e capacidade de selecionar recursos adequados.

## Q01 — Formato incompatível

**Contextos:** diagnostico, feira

Você precisa enviar um trabalho pela plataforma da faculdade, mas o arquivo está em um formato que a plataforma não aceita. O que você faria primeiro?

- **A — 2 pontos:** Verificaria quais formatos são aceitos e procuraria uma forma adequada de converter ou exportar o arquivo.
- **B — 1 ponto:** Pediria para um colega converter o arquivo para mim, sem tentar entender como fazer.
- **C — 0 pontos:** Renomearia manualmente a extensão do arquivo esperando que ele passe a funcionar.
- **D — 0 pontos:** Desistiria do envio e aguardaria o professor perguntar o que aconteceu.

**Resposta mais adequada:** A  
**Justificativa:** demonstra compreensão da finalidade, investigação do ambiente e seleção autônoma de uma solução, em vez de apenas depender de terceiros ou alterar o arquivo sem compreender o formato.

## Q02 — Escolha da ferramenta

**Contextos:** diagnostico

Um grupo precisa produzir um documento em conjunto, e cada integrante estará trabalhando de um lugar diferente. Qual seria a melhor decisão?

- **A — 2 pontos:** Utilizar uma ferramenta que permita edição compartilhada e controle das alterações.
- **B — 1 ponto:** Cada integrante cria sua parte separadamente e uma pessoa junta tudo no final.
- **C — 0 pontos:** Enviar várias versões do mesmo arquivo pelo grupo de mensagens e editar qualquer uma delas.
- **D — 0 pontos:** Deixar somente uma pessoa fazer o documento porque é mais simples.

**Resposta mais adequada:** A  
**Justificativa:** avalia a capacidade de selecionar um recurso digital adequado à finalidade de colaboração.

## Q03 — Aprendendo uma plataforma nova

**Contextos:** diagnostico

A faculdade começa a utilizar uma plataforma que você nunca usou e você precisa entregar uma atividade nela. Qual atitude demonstra maior autonomia?

- **A — 2 pontos:** Explorar a interface, consultar orientações ou ajuda oficial e testar as funções necessárias.
- **B — 1 ponto:** Pedir instruções passo a passo a alguém antes de tentar utilizar qualquer recurso.
- **C — 0 pontos:** Clicar aleatoriamente até encontrar alguma forma de enviar a atividade.
- **D — 0 pontos:** Evitar utilizar a plataforma e pedir para outra pessoa realizar o envio.

**Resposta mais adequada:** A  
**Justificativa:** prioriza aprender e adaptar-se a uma ferramenta nova de maneira orientada e autônoma.

## Q04 — Arquivo importante

**Contextos:** diagnostico

Você está trabalhando em um arquivo importante que precisará acessar em outro computador no dia seguinte. O que faria?

- **A — 2 pontos:** Salvaria em um local confiável e acessível posteriormente, mantendo também uma cópia de segurança quando necessário.
- **B — 1 ponto:** Enviaria o arquivo para mim mesmo por um aplicativo de mensagens.
- **C — 0 pontos:** Deixaria apenas no computador atual e confiaria que conseguiria utilizá-lo depois.
- **D — 0 pontos:** Tiraria fotos da tela para reconstruir o trabalho caso perdesse o arquivo.

**Resposta mais adequada:** A  
**Justificativa:** demonstra escolha consciente de recurso e cuidado com continuidade e disponibilidade do trabalho.

---

# Eixo 2 — Informação e pensamento crítico

Competência do artigo: pesquisar, comparar, interpretar e avaliar informações, identificando elementos que contribuam para avaliar a confiabilidade de uma fonte.

## Q05 — Informação em rede social

**Contextos:** diagnostico, feira

Você encontra em uma rede social uma informação surpreendente que pretende utilizar em um trabalho acadêmico, mas a publicação não mostra de onde os dados vieram. O que faria?

- **A — 2 pontos:** Procuraria a origem da informação e compararia com outras fontes confiáveis antes de utilizá-la.
- **B — 1 ponto:** Utilizaria se a publicação fosse de um perfil conhecido e tivesse muitos comentários positivos.
- **C — 0 pontos:** Utilizaria porque muitas pessoas compartilharam a publicação.
- **D — 0 pontos:** Consideraria verdadeira se o texto estivesse bem escrito e apresentasse números.

**Resposta mais adequada:** A  
**Justificativa:** compartilhamentos, aparência e popularidade não substituem autoria, evidência e comparação entre fontes.

## Q06 — Resultados diferentes

**Contextos:** diagnostico

Você pesquisa o mesmo assunto em dois sites e encontra números diferentes. Qual seria a atitude mais adequada?

- **A — 2 pontos:** Investigar a fonte, a data, o contexto e a metodologia dos dados antes de decidir qual informação utilizar.
- **B — 1 ponto:** Escolher o número publicado mais recentemente sem analisar os demais aspectos.
- **C — 0 pontos:** Escolher o resultado que aparece primeiro no mecanismo de busca.
- **D — 0 pontos:** Utilizar o número que mais combina com a conclusão que você pretende apresentar.

**Resposta mais adequada:** A  
**Justificativa:** diferenças entre informações exigem análise de contexto e evidências, não seleção por conveniência.

## Q07 — Manchete alarmante

**Contextos:** diagnostico, feira

Você recebe uma notícia com uma manchete alarmante em um grupo de mensagens. Antes de repassá-la, o que seria mais adequado?

- **A — 2 pontos:** Abrir a publicação, identificar autoria/data e procurar confirmação em outras fontes.
- **B — 1 ponto:** Perguntar no próprio grupo se alguém acha que a notícia é verdadeira.
- **C — 0 pontos:** Repassar e escrever “não sei se é verdade” para que cada pessoa decida.
- **D — 0 pontos:** Repassar se a notícia tiver uma imagem ou vídeo que pareça comprovar o fato.

**Resposta mais adequada:** A  
**Justificativa:** o artigo enfatiza investigação, autoria, fonte e confirmação em vez de consumo passivo de informações.

## Q08 — Primeiro resultado da busca

**Contextos:** diagnostico

Ao pesquisar um tema, o primeiro resultado encontrado responde exatamente à sua pergunta. O que você faria?

- **A — 2 pontos:** Avaliaria quem publicou, quando, quais evidências apresenta e compararia com outras fontes relevantes.
- **B — 1 ponto:** Usaria a informação, mas verificaria rapidamente outro site para ver se diz algo parecido.
- **C — 0 pontos:** Consideraria confiável por estar entre os primeiros resultados.
- **D — 0 pontos:** Copiaria a resposta porque o mecanismo de busca já organizou os resultados por qualidade.

**Resposta mais adequada:** A  
**Justificativa:** posição em resultados de busca não é garantia suficiente de confiabilidade.

---

# Eixo 3 — Comunicação e colaboração

Competência do artigo: participar de ambientes digitais com clareza, respeito e responsabilidade e desenvolver atividades colaborativas respeitando regras de convivência.

## Q09 — Discordância no grupo

**Contextos:** diagnostico, feira

Durante um trabalho em grupo, um colega publica uma ideia que você considera completamente errada. Qual seria a melhor forma de responder?

- **A — 2 pontos:** Explicar de forma respeitosa por que discordo e apresentar argumentos ou fontes para que o grupo possa discutir.
- **B — 1 ponto:** Dizer apenas que discordo e sugerir que o grupo escolha outra ideia.
- **C — 0 pontos:** Responder de forma irônica para mostrar que a ideia não faz sentido.
- **D — 0 pontos:** Apagar ou substituir a contribuição do colega sem conversar com ele.

**Resposta mais adequada:** A  
**Justificativa:** colaboração digital envolve clareza, respeito, responsabilidade e construção conjunta.

## Q10 — Alteração em documento compartilhado

**Contextos:** diagnostico

Você percebe que uma parte importante de um documento compartilhado do grupo precisa ser modificada, mas ela foi escrita por outro integrante. O que faria?

- **A — 2 pontos:** Comunicaria a necessidade da alteração e utilizaria os recursos de comentário, sugestão ou histórico quando apropriado.
- **B — 1 ponto:** Alteraria diretamente, mas avisaria o colega depois.
- **C — 0 pontos:** Apagaria o conteúdo e colocaria minha versão sem avisar.
- **D — 0 pontos:** Criaria outro documento para não precisar conversar sobre a alteração.

**Resposta mais adequada:** A  
**Justificativa:** utiliza recursos digitais de colaboração de forma transparente e responsável.

## Q11 — Informação pessoal de colega

**Contextos:** diagnostico

Um colega envia no grupo privado um documento contendo informações pessoais para ajudar em uma atividade. Você percebe que outra turma também poderia achar o documento útil. O que faria?

- **A — 2 pontos:** Pediria autorização antes de compartilhar e verificaria se informações pessoais precisam ser removidas.
- **B — 1 ponto:** Avisaria ao colega que pretendo compartilhar e faria isso se ele não respondesse.
- **C — 0 pontos:** Compartilharia porque o documento já foi enviado digitalmente.
- **D — 0 pontos:** Publicaria o documento em um local aberto para facilitar o acesso.

**Resposta mais adequada:** A  
**Justificativa:** comunicação responsável inclui consentimento e cuidado com informações de outras pessoas.

## Q12 — Organização do trabalho remoto

**Contextos:** diagnostico

Um grupo está tendo dificuldades porque tarefas e decisões ficam perdidas entre muitas mensagens. Qual atitude ajudaria mais?

- **A — 2 pontos:** Definir um espaço compartilhado para registrar tarefas, responsáveis, prazos e decisões.
- **B — 1 ponto:** Pedir que uma pessoa releia o grupo diariamente e lembre os demais.
- **C — 0 pontos:** Criar outro grupo de mensagens e continuar organizando tudo por mensagens.
- **D — 0 pontos:** Esperar que cada integrante lembre de sua parte.

**Resposta mais adequada:** A  
**Justificativa:** demonstra uso intencional de ferramentas digitais para apoiar colaboração e organização.

---

# Eixo 4 — Produção e criatividade

Competência do artigo: criar conteúdos em diferentes formatos para comunicar ideias ou resolver problemas.

## Q13 — Apresentando resultados

**Contextos:** diagnostico

Você precisa apresentar os resultados de uma pesquisa que possui muitos números. Qual estratégia digital seria mais adequada?

- **A — 2 pontos:** Selecionar os dados relevantes e escolher representações visuais adequadas, explicando o que elas mostram.
- **B — 1 ponto:** Colocar todos os números em uma tabela e explicar oralmente os mais importantes.
- **C — 0 pontos:** Criar gráficos apenas porque deixam a apresentação mais bonita, sem verificar se representam corretamente os dados.
- **D — 0 pontos:** Colocar capturas de tela da planilha inteira nos slides.

**Resposta mais adequada:** A  
**Justificativa:** produzir conteúdo digital envolve selecionar formato e representação de acordo com a finalidade comunicativa.

## Q14 — Material para públicos diferentes

**Contextos:** diagnostico

Você produziu um texto acadêmico sobre segurança digital e agora precisa apresentar a mesma ideia para adolescentes em uma atividade da escola. O que seria mais adequado?

- **A — 2 pontos:** Adaptar linguagem, formato e exemplos ao novo público, preservando a informação essencial.
- **B — 1 ponto:** Resumir o texto original, mas manter a mesma linguagem técnica.
- **C — 0 pontos:** Utilizar exatamente o mesmo material porque a informação é a mesma.
- **D — 0 pontos:** Remover as explicações e usar apenas imagens chamativas.

**Resposta mais adequada:** A  
**Justificativa:** criação digital significativa considera objetivo, público e formato.

## Q15 — Imagem encontrada na internet

**Contextos:** diagnostico, feira

Você encontra uma imagem perfeita para uma apresentação que será publicada na internet. Qual atitude é mais adequada?

- **A — 2 pontos:** Verificar autoria e condições de uso/licença e utilizar ou atribuir a imagem conforme permitido.
- **B — 1 ponto:** Usar a imagem e colocar o endereço do site onde a encontrou, sem verificar a licença.
- **C — 0 pontos:** Usar livremente porque a imagem apareceu em uma busca pública.
- **D — 0 pontos:** Remover qualquer identificação da imagem antes de utilizar.

**Resposta mais adequada:** A  
**Justificativa:** produção de conteúdo também envolve responsabilidade e respeito às condições de uso e autoria.

## Q16 — Escolhendo um formato

**Contextos:** diagnostico

Você precisa ensinar rapidamente um procedimento que envolve várias ações visuais na tela. O que faria?

- **A — 2 pontos:** Avaliaria o público e escolheria um formato capaz de demonstrar claramente as etapas, como uma sequência ilustrada ou vídeo curto quando adequado.
- **B — 1 ponto:** Escreveria um texto detalhado, mesmo que algumas etapas sejam difíceis de explicar sem imagens.
- **C — 0 pontos:** Escolheria o formato que eu mais gosto, independentemente de quem vai utilizar.
- **D — 0 pontos:** Colocaria apenas o nome da ferramenta para que as pessoas pesquisem como fazer.

**Resposta mais adequada:** A  
**Justificativa:** competência de produção envolve selecionar linguagem e formato conforme a finalidade.

---

# Eixo 5 — Segurança e ética

Competência do artigo: proteger informações, reconhecer riscos e agir de forma responsável, incluindo práticas seguras e respeito a direitos.

## Q17 — E-mail urgente

**Contextos:** diagnostico, feira

Você recebe um e-mail aparentemente enviado pela faculdade dizendo que sua conta será bloqueada em 24 horas. A mensagem pede que você clique em um link e faça login imediatamente. O que faria?

- **A — 2 pontos:** Não utilizaria o link; verificaria remetente/endereço e acessaria a plataforma por um canal oficial para confirmar a situação.
- **B — 1 ponto:** Clicaria no link, mas conferiria se a página parece igual à página oficial antes de informar a senha.
- **C — 0 pontos:** Faria login rapidamente para evitar que a conta seja bloqueada.
- **D — 0 pontos:** Responderia ao e-mail enviando meus dados para confirmar que a conta é minha.

**Resposta mais adequada:** A  
**Justificativa:** aparência visual não garante legitimidade; a ação mais segura é verificar por canal independente/oficial.

## Q18 — Senha repetida

**Contextos:** diagnostico

Você utiliza a mesma senha em vários serviços porque é mais fácil lembrar. Um dos serviços informa que sofreu vazamento de dados. O que seria mais adequado?

- **A — 2 pontos:** Alterar a senha comprometida e também as contas em que ela foi reutilizada, adotando senhas diferentes e, quando possível, autenticação adicional.
- **B — 1 ponto:** Alterar apenas a senha do serviço que informou o vazamento.
- **C — 0 pontos:** Não alterar nada enquanto ninguém acessar minhas contas.
- **D — 0 pontos:** Criar uma senha nova e passar a utilizá-la igualmente em todos os serviços.

**Resposta mais adequada:** A  
**Justificativa:** reutilização amplia o impacto de credenciais comprometidas.

## Q19 — Aplicativo pede permissões

**Contextos:** diagnostico

Você instala um aplicativo simples de lanterna e ele solicita acesso aos contatos, microfone, localização e arquivos. O que faria?

- **A — 2 pontos:** Avaliaria se as permissões fazem sentido para a função do aplicativo e recusaria permissões desnecessárias ou buscaria outra opção.
- **B — 1 ponto:** Permitiria inicialmente e tentaria desativar depois caso percebesse algum problema.
- **C — 0 pontos:** Aceitaria tudo porque aplicativos só pedem permissões de que realmente precisam.
- **D — 0 pontos:** Aceitaria porque o aplicativo possui muitas avaliações positivas.

**Resposta mais adequada:** A  
**Justificativa:** segurança e privacidade exigem avaliação crítica da coleta e do acesso a dados.

## Q20 — Computador compartilhado

**Contextos:** diagnostico, feira

Você precisa acessar uma conta pessoal em um computador compartilhado. Qual prática é mais adequada ao terminar?

- **A — 2 pontos:** Encerrar a sessão e evitar salvar senha ou dados de acesso no equipamento.
- **B — 1 ponto:** Fechar apenas a janela do navegador.
- **C — 0 pontos:** Deixar a conta aberta porque outra pessoa precisaria conhecer minha senha para fazer algo.
- **D — 0 pontos:** Salvar a senha no navegador para facilitar caso eu use o computador novamente.

**Resposta mais adequada:** A  
**Justificativa:** equipamentos compartilhados exigem cuidados adicionais com sessão e credenciais.

---

# Eixo 6 — Cidadania e inclusão

Competência do artigo: utilizar tecnologias para ampliar participação social e acesso à informação, considerando também acessibilidade e equidade.

## Q21 — Documento inacessível

**Contextos:** diagnostico

Você está publicando um material digital para toda a turma e percebe que uma imagem importante contém informações que não aparecem no texto. O que seria mais adequado?

- **A — 2 pontos:** Garantir uma alternativa textual adequada para que a informação não dependa exclusivamente da imagem.
- **B — 1 ponto:** Escrever uma legenda curta, mesmo que ela não explique a informação principal da imagem.
- **C — 0 pontos:** Publicar assim mesmo porque a maioria das pessoas consegue visualizar a imagem.
- **D — 0 pontos:** Informar que quem tiver dificuldade deve pedir explicação para um colega.

**Resposta mais adequada:** A  
**Justificativa:** o artigo trata acessibilidade como parte da equidade e da participação em ambientes digitais.

## Q22 — Serviço público digital

**Contextos:** diagnostico, feira

Uma pessoa da sua família precisa solicitar um serviço público pela internet, mas tem dificuldade com o processo. Qual atitude mais contribui para a autonomia dela?

- **A — 2 pontos:** Orientá-la durante o processo, explicando os passos e cuidados para que consiga compreender como realizar tarefas semelhantes.
- **B — 1 ponto:** Fazer todo o procedimento para ela e explicar apenas o resultado.
- **C — 0 pontos:** Pedir todos os dados e realizar o procedimento sem envolvê-la porque é mais rápido.
- **D — 0 pontos:** Dizer que serviços digitais são complicados e recomendar que procure outra pessoa sempre que precisar.

**Resposta mais adequada:** A  
**Justificativa:** inclusão digital está relacionada à autonomia para participar de atividades sociais mediadas por tecnologia.

## Q23 — Formulário disponível apenas on-line

**Contextos:** diagnostico

Uma atividade importante será realizada por formulário on-line. Você sabe que alguns participantes possuem acesso limitado à internet. Qual seria a decisão mais inclusiva?

- **A — 2 pontos:** Manter a solução digital quando útil, mas prever alternativas ou condições de acesso para quem enfrenta limitações.
- **B — 1 ponto:** Manter somente o formulário e ampliar bastante o prazo.
- **C — 0 pontos:** Manter apenas o formato on-line porque hoje praticamente todo mundo possui celular.
- **D — 0 pontos:** Excluir totalmente a tecnologia da atividade para evitar qualquer diferença.

**Resposta mais adequada:** A  
**Justificativa:** inclusão não significa abandonar tecnologia, mas considerar condições diferentes e oferecer oportunidades de participação.

## Q24 — Informação útil para a comunidade

**Contextos:** diagnostico

Seu grupo identificou que muitas pessoas da comunidade têm dificuldade para encontrar informações sobre um serviço local. Como a tecnologia poderia contribuir de forma mais adequada?

- **A — 2 pontos:** Criar um material digital acessível com informações verificadas e orientar onde encontrar as fontes oficiais.
- **B — 1 ponto:** Criar um grupo de mensagens e responder individualmente sempre que alguém perguntar.
- **C — 0 pontos:** Copiar informações encontradas em diferentes redes sociais e reuni-las sem verificar a origem.
- **D — 0 pontos:** Publicar apenas links sem explicar o que cada recurso oferece.

**Resposta mais adequada:** A  
**Justificativa:** utiliza tecnologia para ampliar acesso à informação e participação de maneira responsável.

---

# Eixo 7 — Pensamento computacional e sistemas automatizados

Competência do artigo: organizar problemas, reconhecer padrões e avaliar criticamente resultados produzidos por ferramentas automatizadas.

## Q25 — Resposta de IA com referência

**Contextos:** diagnostico, feira

Você pede a uma ferramenta de inteligência artificial uma informação para utilizar em um trabalho. A resposta parece convincente e apresenta uma referência que você não conhece. O que faria?

- **A — 2 pontos:** Verificaria se a referência realmente existe, consultaria a fonte e compararia a informação antes de utilizá-la.
- **B — 1 ponto:** Procuraria apenas o título da referência; se aparecesse em uma busca, utilizaria a resposta da IA.
- **C — 0 pontos:** Utilizaria porque a ferramenta apresentou uma referência, o que indica que pesquisou a informação.
- **D — 0 pontos:** Utilizaria se a resposta estivesse bem escrita e detalhada.

**Resposta mais adequada:** A  
**Justificativa:** o artigo destaca que sistemas automatizados podem produzir erros ou informações incorretas e devem ser utilizados com verificação e comparação.

## Q26 — IA produz respostas diferentes

**Contextos:** diagnostico

Você faz a mesma pergunta a uma IA duas vezes e recebe respostas diferentes. O que seria mais adequado concluir?

- **A — 2 pontos:** As respostas precisam ser avaliadas; ferramentas automatizadas podem gerar resultados diferentes e não devem ser tratadas como fonte infalível.
- **B — 1 ponto:** A resposta mais detalhada provavelmente é a correta, mas seria bom conferir.
- **C — 0 pontos:** A segunda resposta deve ser mais correta porque foi gerada depois.
- **D — 0 pontos:** Basta pedir várias vezes e escolher a resposta que aparecer com maior frequência.

**Resposta mais adequada:** A  
**Justificativa:** avalia criticamente a natureza e os limites de resultados automatizados.

## Q27 — Problema complexo

**Contextos:** diagnostico

Você precisa resolver uma tarefa digital com várias etapas e percebe que está se perdendo no processo. Qual estratégia seria mais adequada?

- **A — 2 pontos:** Dividir o problema em etapas menores, identificar o que é necessário em cada uma e verificar os resultados progressivamente.
- **B — 1 ponto:** Procurar um tutorial que resolva exatamente o problema e repetir os passos sem adaptar.
- **C — 0 pontos:** Tentar várias ações aleatoriamente até alguma funcionar.
- **D — 0 pontos:** Reiniciar todo o processo sempre que surgir um erro.

**Resposta mais adequada:** A  
**Justificativa:** corresponde à organização/decomposição de problemas prevista no eixo de pensamento computacional.

## Q28 — Automação com resultado inesperado

**Contextos:** diagnostico, feira

Você utiliza uma ferramenta automática para organizar uma lista de dados e percebe que alguns resultados parecem estranhos. O que faria?

- **A — 2 pontos:** Conferiria exemplos, critérios de entrada e resultados antes de confiar no processamento completo.
- **B — 1 ponto:** Corrigiria manualmente apenas os resultados estranhos que consegui perceber.
- **C — 0 pontos:** Confiaria na ferramenta porque processos automatizados são menos sujeitos a erro do que pessoas.
- **D — 0 pontos:** Executaria novamente até obter um resultado que pareça correto.

**Resposta mais adequada:** A  
**Justificativa:** sistemas automatizados precisam ter seus resultados avaliados criticamente, especialmente quando há sinais de inconsistência.

---

# 3. Distribuição do banco

Total: **28 questões**

| Eixo | Quantidade | IDs |
|---|---:|---|
| Acesso e utilização | 4 | Q01–Q04 |
| Informação e pensamento crítico | 4 | Q05–Q08 |
| Comunicação e colaboração | 4 | Q09–Q12 |
| Produção e criatividade | 4 | Q13–Q16 |
| Segurança e ética | 4 | Q17–Q20 |
| Cidadania e inclusão | 4 | Q21–Q24 |
| Pensamento computacional e sistemas automatizados | 4 | Q25–Q28 |

Cada eixo possui exatamente quatro questões para evitar que o próprio banco favoreça uma competência durante o sorteio.

## Questões adequadas à feira

As questões marcadas como `feira` foram escolhidas por serem mais rápidas de compreender e responder:

- Q01 — Formato incompatível
- Q05 — Informação em rede social
- Q07 — Manchete alarmante
- Q09 — Discordância no grupo
- Q15 — Imagem encontrada na internet
- Q17 — E-mail urgente
- Q20 — Computador compartilhado
- Q22 — Serviço público digital
- Q25 — Resposta de IA com referência
- Q28 — Automação com resultado inesperado

> Com `total=3` ou `total=5`, não é possível representar os sete eixos simultaneamente. O resultado da feira deve ser apresentado como **desafio/experiência rápida**, e não como resultado completo do diagnóstico PADI.

# 4. Observações metodológicas para implementação

1. **Não exibir `score` nem “resposta correta” durante a aplicação.**
2. O resultado individual deve ser descrito como um retrato das respostas às situações apresentadas.
3. Não utilizar termos como “analfabeto digital”, “reprovado”, “ruim” ou equivalentes.
4. Uma sessão curta que não contém todos os eixos não deve gerar uma conclusão global sobre alfabetização digital.
5. Como as questões são sorteadas, o cálculo percentual de cada eixo deve usar apenas as questões daquele eixo que realmente apareceram na sessão.
6. Se um eixo não apareceu, ele deve ser omitido do resultado daquela sessão, e não receber `0%`.
7. Para comparação agregada entre participantes, registrar quais `questionIds` cada participante recebeu.
8. Se diferentes participantes receberem questões diferentes, comparações de score bruto devem ser evitadas; utilizar percentuais normalizados e informar a quantidade de respostas por eixo.
9. Para uma aplicação acadêmica mais comparável, pode ser útil futuramente utilizar um conjunto-base fixo e sortear apenas questões adicionais. Esta versão mantém o sorteio solicitado.
10. Antes da aplicação oficial, revisar linguagem, ambiguidade, tempo de resposta e interpretação das alternativas em um pequeno pré-teste.

# 5. Estrutura sugerida para os dados

Exemplo conceitual para implementação futura:

```ts
type QuestionContext = 'diagnostico' | 'feira'

type CompetencyId =
  | 'access-and-use'
  | 'information-and-critical-thinking'
  | 'communication-and-collaboration'
  | 'production-and-creativity'
  | 'security-and-ethics'
  | 'citizenship-and-inclusion'
  | 'computational-thinking-and-automated-systems'

type QuestionOption = {
  id: string
  label: string
  score: 0 | 1 | 2
}

type Question = {
  id: string
  competency: CompetencyId
  contexts: QuestionContext[]
  statement: string
  options: QuestionOption[]
}
```

O campo de justificativa/resposta correta deste documento é documentação interna e não precisa ser enviado ao cliente quando o questionário estiver persistido no backend.
