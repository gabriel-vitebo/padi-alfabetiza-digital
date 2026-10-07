import type { Question } from '~/types/diagnostic'

export const diagnosticQuestions: Question[] = [
  {
    id: 'Q01', competency: 'access-and-use', contexts: ['diagnostico', 'feira'],
    statement: 'Você precisa enviar um trabalho pela plataforma da faculdade, mas o arquivo está em um formato que a plataforma não aceita. O que você faria primeiro?',
    options: [
      { id: 'A', label: 'Verificaria quais formatos são aceitos e procuraria uma forma adequada de converter ou exportar o arquivo.', score: 2 },
      { id: 'B', label: 'Pediria para um colega converter o arquivo para mim, sem tentar entender como fazer.', score: 1 },
      { id: 'C', label: 'Renomearia manualmente a extensão do arquivo esperando que ele passe a funcionar.', score: 0 },
      { id: 'D', label: 'Desistiria do envio e aguardaria o professor perguntar o que aconteceu.', score: 0 }
    ]
  },
  {
    id: 'Q02', competency: 'access-and-use', contexts: ['diagnostico'],
    statement: 'Um grupo precisa produzir um documento em conjunto, e cada integrante estará trabalhando de um lugar diferente. Qual seria a melhor decisão?',
    options: [
      { id: 'A', label: 'Utilizar uma ferramenta que permita edição compartilhada e controle das alterações.', score: 2 },
      { id: 'B', label: 'Cada integrante cria sua parte separadamente e uma pessoa junta tudo no final.', score: 1 },
      { id: 'C', label: 'Enviar várias versões do mesmo arquivo pelo grupo de mensagens e editar qualquer uma delas.', score: 0 },
      { id: 'D', label: 'Deixar somente uma pessoa fazer o documento porque é mais simples.', score: 0 }
    ]
  },
  {
    id: 'Q03', competency: 'access-and-use', contexts: ['diagnostico'],
    statement: 'A faculdade começa a utilizar uma plataforma que você nunca usou e você precisa entregar uma atividade nela. Qual atitude demonstra maior autonomia?',
    options: [
      { id: 'A', label: 'Explorar a interface, consultar orientações ou ajuda oficial e testar as funções necessárias.', score: 2 },
      { id: 'B', label: 'Pedir instruções passo a passo a alguém antes de tentar utilizar qualquer recurso.', score: 1 },
      { id: 'C', label: 'Clicar aleatoriamente até encontrar alguma forma de enviar a atividade.', score: 0 },
      { id: 'D', label: 'Evitar utilizar a plataforma e pedir para outra pessoa realizar o envio.', score: 0 }
    ]
  },
  {
    id: 'Q04', competency: 'access-and-use', contexts: ['diagnostico'],
    statement: 'Você está trabalhando em um arquivo importante que precisará acessar em outro computador no dia seguinte. O que faria?',
    options: [
      { id: 'A', label: 'Salvaria em um local confiável e acessível posteriormente, mantendo também uma cópia de segurança quando necessário.', score: 2 },
      { id: 'B', label: 'Enviaria o arquivo para mim mesmo por um aplicativo de mensagens.', score: 1 },
      { id: 'C', label: 'Deixaria apenas no computador atual e confiaria que conseguiria utilizá-lo depois.', score: 0 },
      { id: 'D', label: 'Tiraria fotos da tela para reconstruir o trabalho caso perdesse o arquivo.', score: 0 }
    ]
  },
  {
    id: 'Q05', competency: 'information-and-critical-thinking', contexts: ['diagnostico', 'feira'],
    statement: 'Você encontra em uma rede social uma informação surpreendente que pretende utilizar em um trabalho acadêmico, mas a publicação não mostra de onde os dados vieram. O que faria?',
    options: [
      { id: 'A', label: 'Procuraria a origem da informação e compararia com outras fontes confiáveis antes de utilizá-la.', score: 2 },
      { id: 'B', label: 'Utilizaria se a publicação fosse de um perfil conhecido e tivesse muitos comentários positivos.', score: 1 },
      { id: 'C', label: 'Utilizaria porque muitas pessoas compartilharam a publicação.', score: 0 },
      { id: 'D', label: 'Consideraria verdadeira se o texto estivesse bem escrito e apresentasse números.', score: 0 }
    ]
  },
  {
    id: 'Q06', competency: 'information-and-critical-thinking', contexts: ['diagnostico'],
    statement: 'Você pesquisa o mesmo assunto em dois sites e encontra números diferentes. Qual seria a atitude mais adequada?',
    options: [
      { id: 'A', label: 'Investigar a fonte, a data, o contexto e a metodologia dos dados antes de decidir qual informação utilizar.', score: 2 },
      { id: 'B', label: 'Escolher o número publicado mais recentemente sem analisar os demais aspectos.', score: 1 },
      { id: 'C', label: 'Escolher o resultado que aparece primeiro no mecanismo de busca.', score: 0 },
      { id: 'D', label: 'Utilizar o número que mais combina com a conclusão que você pretende apresentar.', score: 0 }
    ]
  },
  {
    id: 'Q07', competency: 'information-and-critical-thinking', contexts: ['diagnostico', 'feira'],
    statement: 'Você recebe uma notícia com uma manchete alarmante em um grupo de mensagens. Antes de repassá-la, o que seria mais adequado?',
    options: [
      { id: 'A', label: 'Abrir a publicação, identificar autoria/data e procurar confirmação em outras fontes.', score: 2 },
      { id: 'B', label: 'Perguntar no próprio grupo se alguém acha que a notícia é verdadeira.', score: 1 },
      { id: 'C', label: 'Repassar e escrever “não sei se é verdade” para que cada pessoa decida.', score: 0 },
      { id: 'D', label: 'Repassar se a notícia tiver uma imagem ou vídeo que pareça comprovar o fato.', score: 0 }
    ]
  },
  {
    id: 'Q08', competency: 'information-and-critical-thinking', contexts: ['diagnostico'],
    statement: 'Ao pesquisar um tema, o primeiro resultado encontrado responde exatamente à sua pergunta. O que você faria?',
    options: [
      { id: 'A', label: 'Avaliaria quem publicou, quando, quais evidências apresenta e compararia com outras fontes relevantes.', score: 2 },
      { id: 'B', label: 'Usaria a informação, mas verificaria rapidamente outro site para ver se diz algo parecido.', score: 1 },
      { id: 'C', label: 'Consideraria confiável por estar entre os primeiros resultados.', score: 0 },
      { id: 'D', label: 'Copiaria a resposta porque o mecanismo de busca já organizou os resultados por qualidade.', score: 0 }
    ]
  },
  {
    id: 'Q09', competency: 'communication-and-collaboration', contexts: ['diagnostico', 'feira'],
    statement: 'Durante um trabalho em grupo, um colega publica uma ideia que você considera completamente errada. Qual seria a melhor forma de responder?',
    options: [
      { id: 'A', label: 'Explicar de forma respeitosa por que discordo e apresentar argumentos ou fontes para que o grupo possa discutir.', score: 2 },
      { id: 'B', label: 'Dizer apenas que discordo e sugerir que o grupo escolha outra ideia.', score: 1 },
      { id: 'C', label: 'Responder de forma irônica para mostrar que a ideia não faz sentido.', score: 0 },
      { id: 'D', label: 'Apagar ou substituir a contribuição do colega sem conversar com ele.', score: 0 }
    ]
  },
  {
    id: 'Q10', competency: 'communication-and-collaboration', contexts: ['diagnostico'],
    statement: 'Você percebe que uma parte importante de um documento compartilhado do grupo precisa ser modificada, mas ela foi escrita por outro integrante. O que faria?',
    options: [
      { id: 'A', label: 'Comunicaria a necessidade da alteração e utilizaria os recursos de comentário, sugestão ou histórico quando apropriado.', score: 2 },
      { id: 'B', label: 'Alteraria diretamente, mas avisaria o colega depois.', score: 1 },
      { id: 'C', label: 'Apagaria o conteúdo e colocaria minha versão sem avisar.', score: 0 },
      { id: 'D', label: 'Criaria outro documento para não precisar conversar sobre a alteração.', score: 0 }
    ]
  },
  {
    id: 'Q11', competency: 'communication-and-collaboration', contexts: ['diagnostico'],
    statement: 'Um colega envia no grupo privado um documento contendo informações pessoais para ajudar em uma atividade. Você percebe que outra turma também poderia achar o documento útil. O que faria?',
    options: [
      { id: 'A', label: 'Pediria autorização antes de compartilhar e verificaria se informações pessoais precisam ser removidas.', score: 2 },
      { id: 'B', label: 'Avisaria ao colega que pretendo compartilhar e faria isso se ele não respondesse.', score: 1 },
      { id: 'C', label: 'Compartilharia porque o documento já foi enviado digitalmente.', score: 0 },
      { id: 'D', label: 'Publicaria o documento em um local aberto para facilitar o acesso.', score: 0 }
    ]
  },
  {
    id: 'Q12', competency: 'communication-and-collaboration', contexts: ['diagnostico'],
    statement: 'Um grupo está tendo dificuldades porque tarefas e decisões ficam perdidas entre muitas mensagens. Qual atitude ajudaria mais?',
    options: [
      { id: 'A', label: 'Definir um espaço compartilhado para registrar tarefas, responsáveis, prazos e decisões.', score: 2 },
      { id: 'B', label: 'Pedir que uma pessoa releia o grupo diariamente e lembre os demais.', score: 1 },
      { id: 'C', label: 'Criar outro grupo de mensagens e continuar organizando tudo por mensagens.', score: 0 },
      { id: 'D', label: 'Esperar que cada integrante lembre de sua parte.', score: 0 }
    ]
  },
  {
    id: 'Q13', competency: 'production-and-creativity', contexts: ['diagnostico'],
    statement: 'Você precisa apresentar os resultados de uma pesquisa que possui muitos números. Qual estratégia digital seria mais adequada?',
    options: [
      { id: 'A', label: 'Selecionar os dados relevantes e escolher representações visuais adequadas, explicando o que elas mostram.', score: 2 },
      { id: 'B', label: 'Colocar todos os números em uma tabela e explicar oralmente os mais importantes.', score: 1 },
      { id: 'C', label: 'Criar gráficos apenas porque deixam a apresentação mais bonita, sem verificar se representam corretamente os dados.', score: 0 },
      { id: 'D', label: 'Colocar capturas de tela da planilha inteira nos slides.', score: 0 }
    ]
  },
  {
    id: 'Q14', competency: 'production-and-creativity', contexts: ['diagnostico'],
    statement: 'Você produziu um texto acadêmico sobre segurança digital e agora precisa apresentar a mesma ideia para adolescentes em uma atividade da escola. O que seria mais adequado?',
    options: [
      { id: 'A', label: 'Adaptar linguagem, formato e exemplos ao novo público, preservando a informação essencial.', score: 2 },
      { id: 'B', label: 'Resumir o texto original, mas manter a mesma linguagem técnica.', score: 1 },
      { id: 'C', label: 'Utilizar exatamente o mesmo material porque a informação é a mesma.', score: 0 },
      { id: 'D', label: 'Remover as explicações e usar apenas imagens chamativas.', score: 0 }
    ]
  },
  {
    id: 'Q15', competency: 'production-and-creativity', contexts: ['diagnostico', 'feira'],
    statement: 'Você encontra uma imagem perfeita para uma apresentação que será publicada na internet. Qual atitude é mais adequada?',
    options: [
      { id: 'A', label: 'Verificar autoria e condições de uso/licença e utilizar ou atribuir a imagem conforme permitido.', score: 2 },
      { id: 'B', label: 'Usar a imagem e colocar o endereço do site onde a encontrou, sem verificar a licença.', score: 1 },
      { id: 'C', label: 'Usar livremente porque a imagem apareceu em uma busca pública.', score: 0 },
      { id: 'D', label: 'Remover qualquer identificação da imagem antes de utilizar.', score: 0 }
    ]
  },
  {
    id: 'Q16', competency: 'production-and-creativity', contexts: ['diagnostico'],
    statement: 'Você precisa ensinar rapidamente um procedimento que envolve várias ações visuais na tela. O que faria?',
    options: [
      { id: 'A', label: 'Avaliaria o público e escolheria um formato capaz de demonstrar claramente as etapas, como uma sequência ilustrada ou vídeo curto quando adequado.', score: 2 },
      { id: 'B', label: 'Escreveria um texto detalhado, mesmo que algumas etapas sejam difíceis de explicar sem imagens.', score: 1 },
      { id: 'C', label: 'Escolheria o formato que eu mais gosto, independentemente de quem vai utilizar.', score: 0 },
      { id: 'D', label: 'Colocaria apenas o nome da ferramenta para que as pessoas pesquisem como fazer.', score: 0 }
    ]
  },
  {
    id: 'Q17', competency: 'security-and-ethics', contexts: ['diagnostico', 'feira'],
    statement: 'Você recebe um e-mail aparentemente enviado pela faculdade dizendo que sua conta será bloqueada em 24 horas. A mensagem pede que você clique em um link e faça login imediatamente. O que faria?',
    options: [
      { id: 'A', label: 'Não utilizaria o link; verificaria remetente/endereço e acessaria a plataforma por um canal oficial para confirmar a situação.', score: 2 },
      { id: 'B', label: 'Clicaria no link, mas conferiria se a página parece igual à página oficial antes de informar a senha.', score: 1 },
      { id: 'C', label: 'Faria login rapidamente para evitar que a conta seja bloqueada.', score: 0 },
      { id: 'D', label: 'Responderia ao e-mail enviando meus dados para confirmar que a conta é minha.', score: 0 }
    ]
  },
  {
    id: 'Q18', competency: 'security-and-ethics', contexts: ['diagnostico'],
    statement: 'Você utiliza a mesma senha em vários serviços porque é mais fácil lembrar. Um dos serviços informa que sofreu vazamento de dados. O que seria mais adequado?',
    options: [
      { id: 'A', label: 'Alterar a senha comprometida e também as contas em que ela foi reutilizada, adotando senhas diferentes e, quando possível, autenticação adicional.', score: 2 },
      { id: 'B', label: 'Alterar apenas a senha do serviço que informou o vazamento.', score: 1 },
      { id: 'C', label: 'Não alterar nada enquanto ninguém acessar minhas contas.', score: 0 },
      { id: 'D', label: 'Criar uma senha nova e passar a utilizá-la igualmente em todos os serviços.', score: 0 }
    ]
  },
  {
    id: 'Q19', competency: 'security-and-ethics', contexts: ['diagnostico'],
    statement: 'Você instala um aplicativo simples de lanterna e ele solicita acesso aos contatos, microfone, localização e arquivos. O que faria?',
    options: [
      { id: 'A', label: 'Avaliaria se as permissões fazem sentido para a função do aplicativo e recusaria permissões desnecessárias ou buscaria outra opção.', score: 2 },
      { id: 'B', label: 'Permitiria inicialmente e tentaria desativar depois caso percebesse algum problema.', score: 1 },
      { id: 'C', label: 'Aceitaria tudo porque aplicativos só pedem permissões de que realmente precisam.', score: 0 },
      { id: 'D', label: 'Aceitaria porque o aplicativo possui muitas avaliações positivas.', score: 0 }
    ]
  },
  {
    id: 'Q20', competency: 'security-and-ethics', contexts: ['diagnostico', 'feira'],
    statement: 'Você precisa acessar uma conta pessoal em um computador compartilhado. Qual prática é mais adequada ao terminar?',
    options: [
      { id: 'A', label: 'Encerrar a sessão e evitar salvar senha ou dados de acesso no equipamento.', score: 2 },
      { id: 'B', label: 'Fechar apenas a janela do navegador.', score: 1 },
      { id: 'C', label: 'Deixar a conta aberta porque outra pessoa precisaria conhecer minha senha para fazer algo.', score: 0 },
      { id: 'D', label: 'Salvar a senha no navegador para facilitar caso eu use o computador novamente.', score: 0 }
    ]
  },
  {
    id: 'Q21', competency: 'citizenship-and-inclusion', contexts: ['diagnostico'],
    statement: 'Você está publicando um material digital para toda a turma e percebe que uma imagem importante contém informações que não aparecem no texto. O que seria mais adequado?',
    options: [
      { id: 'A', label: 'Garantir uma alternativa textual adequada para que a informação não dependa exclusivamente da imagem.', score: 2 },
      { id: 'B', label: 'Escrever uma legenda curta, mesmo que ela não explique a informação principal da imagem.', score: 1 },
      { id: 'C', label: 'Publicar assim mesmo porque a maioria das pessoas consegue visualizar a imagem.', score: 0 },
      { id: 'D', label: 'Informar que quem tiver dificuldade deve pedir explicação para um colega.', score: 0 }
    ]
  },
  {
    id: 'Q22', competency: 'citizenship-and-inclusion', contexts: ['diagnostico', 'feira'],
    statement: 'Uma pessoa da sua família precisa solicitar um serviço público pela internet, mas tem dificuldade com o processo. Qual atitude mais contribui para a autonomia dela?',
    options: [
      { id: 'A', label: 'Orientá-la durante o processo, explicando os passos e cuidados para que consiga compreender como realizar tarefas semelhantes.', score: 2 },
      { id: 'B', label: 'Fazer todo o procedimento para ela e explicar apenas o resultado.', score: 1 },
      { id: 'C', label: 'Pedir todos os dados e realizar o procedimento sem envolvê-la porque é mais rápido.', score: 0 },
      { id: 'D', label: 'Dizer que serviços digitais são complicados e recomendar que procure outra pessoa sempre que precisar.', score: 0 }
    ]
  },
  {
    id: 'Q23', competency: 'citizenship-and-inclusion', contexts: ['diagnostico'],
    statement: 'Uma atividade importante será realizada por formulário on-line. Você sabe que alguns participantes possuem acesso limitado à internet. Qual seria a decisão mais inclusiva?',
    options: [
      { id: 'A', label: 'Manter a solução digital quando útil, mas prever alternativas ou condições de acesso para quem enfrenta limitações.', score: 2 },
      { id: 'B', label: 'Manter somente o formulário e ampliar bastante o prazo.', score: 1 },
      { id: 'C', label: 'Manter apenas o formato on-line porque hoje praticamente todo mundo possui celular.', score: 0 },
      { id: 'D', label: 'Excluir totalmente a tecnologia da atividade para evitar qualquer diferença.', score: 0 }
    ]
  },
  {
    id: 'Q24', competency: 'citizenship-and-inclusion', contexts: ['diagnostico'],
    statement: 'Seu grupo identificou que muitas pessoas da comunidade têm dificuldade para encontrar informações sobre um serviço local. Como a tecnologia poderia contribuir de forma mais adequada?',
    options: [
      { id: 'A', label: 'Criar um material digital acessível com informações verificadas e orientar onde encontrar as fontes oficiais.', score: 2 },
      { id: 'B', label: 'Criar um grupo de mensagens e responder individualmente sempre que alguém perguntar.', score: 1 },
      { id: 'C', label: 'Copiar informações encontradas em diferentes redes sociais e reuni-las sem verificar a origem.', score: 0 },
      { id: 'D', label: 'Publicar apenas links sem explicar o que cada recurso oferece.', score: 0 }
    ]
  },
  {
    id: 'Q25', competency: 'computational-thinking-and-automated-systems', contexts: ['diagnostico', 'feira'],
    statement: 'Você pede a uma ferramenta de inteligência artificial uma informação para utilizar em um trabalho. A resposta parece convincente e apresenta uma referência que você não conhece. O que faria?',
    options: [
      { id: 'A', label: 'Verificaria se a referência realmente existe, consultaria a fonte e compararia a informação antes de utilizá-la.', score: 2 },
      { id: 'B', label: 'Procuraria apenas o título da referência; se aparecesse em uma busca, utilizaria a resposta da IA.', score: 1 },
      { id: 'C', label: 'Utilizaria porque a ferramenta apresentou uma referência, o que indica que pesquisou a informação.', score: 0 },
      { id: 'D', label: 'Utilizaria se a resposta estivesse bem escrita e detalhada.', score: 0 }
    ]
  },
  {
    id: 'Q26', competency: 'computational-thinking-and-automated-systems', contexts: ['diagnostico'],
    statement: 'Você faz a mesma pergunta a uma IA duas vezes e recebe respostas diferentes. O que seria mais adequado concluir?',
    options: [
      { id: 'A', label: 'As respostas precisam ser avaliadas; ferramentas automatizadas podem gerar resultados diferentes e não devem ser tratadas como fonte infalível.', score: 2 },
      { id: 'B', label: 'A resposta mais detalhada provavelmente é a correta, mas seria bom conferir.', score: 1 },
      { id: 'C', label: 'A segunda resposta deve ser mais correta porque foi gerada depois.', score: 0 },
      { id: 'D', label: 'Basta pedir várias vezes e escolher a resposta que aparecer com maior frequência.', score: 0 }
    ]
  },
  {
    id: 'Q27', competency: 'computational-thinking-and-automated-systems', contexts: ['diagnostico'],
    statement: 'Você precisa resolver uma tarefa digital com várias etapas e percebe que está se perdendo no processo. Qual estratégia seria mais adequada?',
    options: [
      { id: 'A', label: 'Dividir o problema em etapas menores, identificar o que é necessário em cada uma e verificar os resultados progressivamente.', score: 2 },
      { id: 'B', label: 'Procurar um tutorial que resolva exatamente o problema e repetir os passos sem adaptar.', score: 1 },
      { id: 'C', label: 'Tentar várias ações aleatoriamente até alguma funcionar.', score: 0 },
      { id: 'D', label: 'Reiniciar todo o processo sempre que surgir um erro.', score: 0 }
    ]
  },
  {
    id: 'Q28', competency: 'computational-thinking-and-automated-systems', contexts: ['diagnostico', 'feira'],
    statement: 'Você utiliza uma ferramenta automática para organizar uma lista de dados e percebe que alguns resultados parecem estranhos. O que faria?',
    options: [
      { id: 'A', label: 'Conferiria exemplos, critérios de entrada e resultados antes de confiar no processamento completo.', score: 2 },
      { id: 'B', label: 'Corrigiria manualmente apenas os resultados estranhos que consegui perceber.', score: 1 },
      { id: 'C', label: 'Confiaria na ferramenta porque processos automatizados são menos sujeitos a erro do que pessoas.', score: 0 },
      { id: 'D', label: 'Executaria novamente até obter um resultado que pareça correto.', score: 0 }
    ]
  }
]
