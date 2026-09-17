import type { Question } from '~/types/diagnostic'

// These scenarios are temporary development mocks, not the academic instrument.
export const diagnosticQuestions: Question[] = [
  {
    id: 'source-comparison',
    competency: 'information-critical-thinking',
    statement: 'Você encontra duas notícias diferentes sobre o mesmo assunto em uma rede social. O que faria primeiro?',
    options: [
      { id: 'a', label: 'Compartilharia a que parece mais interessante.' },
      { id: 'b', label: 'Conferiria a fonte, a data e outras informações sobre o assunto.' },
      { id: 'c', label: 'Escolheria a notícia com mais comentários.' },
      { id: 'd', label: 'Ignoraria as duas sem tentar entender a diferença.' }
    ]
  },
  {
    id: 'suspicious-message',
    competency: 'security-privacy',
    statement: 'Você recebe uma mensagem urgente pedindo para clicar em um link e confirmar seus dados. Como reagiria?',
    options: [
      { id: 'a', label: 'Clicaria imediatamente para evitar perder o acesso.' },
      { id: 'b', label: 'Encaminharia a mensagem para várias pessoas perguntando se é real.' },
      { id: 'c', label: 'Verificaria o remetente e procuraria o serviço por um canal oficial.' },
      { id: 'd', label: 'Responderia à mensagem pedindo mais detalhes pessoais.' }
    ]
  },
  {
    id: 'online-discussion',
    competency: 'digital-citizenship',
    statement: 'Em uma discussão online, alguém publica uma opinião diferente da sua. Qual atitude contribui para uma boa convivência?',
    options: [
      { id: 'a', label: 'Responder com respeito e explicar seu ponto de vista.' },
      { id: 'b', label: 'Compartilhar o perfil da pessoa para que outros a critiquem.' },
      { id: 'c', label: 'Usar uma ofensa para encerrar a conversa.' },
      { id: 'd', label: 'Publicar a conversa fora de contexto.' }
    ]
  },
  {
    id: 'ai-generated-content',
    competency: 'artificial-intelligence-critical-thinking',
    statement: 'Uma ferramenta de inteligência artificial apresenta uma resposta convincente para um trabalho. O que você faria antes de usá-la?',
    options: [
      { id: 'a', label: 'Usaria o texto inteiro porque a resposta parece bem escrita.' },
      { id: 'b', label: 'Verificaria as informações em fontes confiáveis e adaptaria o conteúdo.' },
      { id: 'c', label: 'Aceitaria a resposta se ela aparecer rapidamente.' },
      { id: 'd', label: 'Publicaria a resposta sem dizer que usou uma ferramenta.' }
    ]
  },
  {
    id: 'privacy-sharing',
    competency: 'security-privacy',
    statement: 'Um aplicativo novo pede acesso aos seus contatos, fotos e localização, embora essa função não pareça necessária. O que você faria?',
    options: [
      { id: 'a', label: 'Aceitaria tudo para conseguir usar o aplicativo.' },
      { id: 'b', label: 'Daria os acessos e removeria depois, sem ler as opções.' },
      { id: 'c', label: 'Analisaria as permissões e recusaria as que não forem necessárias.' },
      { id: 'd', label: 'Instalaria o aplicativo em outro celular sem verificar nada.' }
    ]
  }
]