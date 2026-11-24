# Ritmo Fit

Aplicativo acadêmico de academia desenvolvido com Ionic e Angular standalone.

O projeto reúne informações do aluno, avisos, biblioteca de exercícios e grade de aulas. A interface utiliza vermelho e branco, com o vermelho principal `#BB2822`.

## Executar o projeto

Utilize Node.js 24.

Dentro da pasta do projeto, execute:

```bash
npm ci
npm start
```

Abra [http://localhost:4200](http://localhost:4200).

## Compilar para produção

```bash
npm run build
```

Os arquivos compilados são gerados na pasta `www`.

## Telas e navegação

O aplicativo possui cinco telas principais e duas telas de detalhes.

| Tela | Rota | Funcionalidade |
|---|---|---|
| Início | `/inicio` | Banner, dados do aluno, próxima aula, sessões restantes e atalhos. |
| Timeline | `/timeline` | Criar, editar, excluir e marcar avisos como lidos. |
| Treinos | `/treinos` | Consultar exercícios, pesquisar, paginar e abrir detalhes. |
| Grade | `/grade` | Selecionar o dia da semana e consultar horários e aulas. |
| Perfil | `/perfil` | Avatar com iniciais, resumo do plano, edição de nome/e-mail e atalhos. |
| Detalhes da aula | `/grade/detalhes/:id` | Receber o ID pela rota e mostrar os detalhes da aula. |
| Detalhes do exercício | `/treinos/detalhes/:id` | Consultar o exercício pelo ID e mostrar nome, músculos, equipamentos e instruções disponíveis. |

A barra inferior permite navegar entre as cinco telas principais.

## Integração com API pública

A biblioteca utiliza a API pública [wger](https://wger.de/api/v2/).

O `ExerciciosApiService` disponibiliza quatro consultas GET:

| Endpoint | Dados consultados |
|---|---|
| `/exerciseinfo/` | Exercícios com tradução em português, busca e paginação. |
| `/muscle/` | Músculos relacionados aos exercícios. |
| `/equipment/` | Equipamentos relacionados aos exercícios. |
| `/exerciseinfo/:id/` | Dados de um exercício selecionado. |

A biblioteca utiliza as três primeiras consultas. A consulta individual acontece ao abrir os detalhes de um exercício.

As respostas de músculos e equipamentos ficam em cache na memória durante o uso do aplicativo.

As telas apresentam estados de carregamento e erro. A biblioteca também trata resultados vazios, e a tela de detalhes oferece uma nova tentativa quando ocorre uma falha.

Quando não existem instruções em português para um exercício, a interface informa essa ausência.

## Services

Os arquivos ficam em `src/app/services/`.

| Service | Responsabilidade |
|---|---|
| `ExerciciosApiService` | Consultas à API wger, cache e busca de exercícios por ID. |
| `AgendaService` | Dados locais de dias, horários e aulas da academia. |
| `AlunoService` | Dados compartilhados entre Início e Perfil, atualização e armazenamento de nome/e-mail no navegador. |

O projeto possui os dois services previstos na divisão inicial e um terceiro para compartilhar os dados do aluno.

## Pipes

| Tipo | Pipe no HTML | Utilização |
|---|---|---|
| Personalizado | `prioridadeAviso` | Classificar avisos conforme prazo e obrigatoriedade. |
| Personalizado | `situacaoPlano` | Identificar a situação do plano. |
| Built-in — DatePipe | `date` | Formatar datas e horários no Início e no Perfil. |
| Built-in — DecimalPipe | `number` | Formatar sessões restantes e média semanal no Início e no Perfil. |

Os pipes personalizados são classes Angular standalone que implementam `PipeTransform`, com regras próprias do aplicativo.

### Prioridade dos avisos

Arquivo: `src/app/pipes/prioridade-aviso.pipe.ts`.

O pipe recebe o aviso e uma data de referência. As regras são avaliadas nesta ordem:

1. Prazo encerrado: **Encerrado**.
2. Aviso obrigatório com prazo nas próximas 24 horas: **Urgente**.
3. Aviso obrigatório com prazo maior que 24 horas: **Atenção**.
4. Aviso não obrigatório com prazo futuro: **Informativo**.

Dados ausentes ou inválidos são tratados com a mensagem **Sem prioridade**.

### Situação do plano

Arquivo: `src/app/pipes/situacao-plano.pipe.ts`.

O pipe recebe o plano e uma data de referência. As regras são avaliadas nesta ordem:

1. Plano bloqueado: **Plano bloqueado**.
2. Vencimento anterior à data de referência: **Plano vencido**.
3. Quantidade de sessões igual ou inferior a zero: **Sem sessões disponíveis**.
4. Plano válido, dentro do prazo e com sessões: **Plano ativo**.

O pipe também trata dados ausentes ou inválidos.

## Diretivas personalizadas

Os arquivos ficam em `src/app/directives/`.

| Diretiva | Utilização |
|---|---|
| `appDestaqueAviso` | Destacar visualmente avisos urgentes e de atenção na Timeline. |
| `appDestaquePlano` | Aplicar cores conforme a situação do plano no Perfil. |

Os pipes produzem os textos de classificação. As diretivas aplicam o destaque visual correspondente.

## Estruturas de controle

O projeto utiliza `@if` para exibir conteúdo conforme o estado da tela e `@for` para renderizar listas.

Essas estruturas aparecem nas telas conforme a necessidade de cada página.

## Perfil e dados compartilhados

O Perfil permite editar nome e e-mail, com validação dos campos.

As alterações também aparecem no Início. Nome e e-mail são salvos no `localStorage` e recuperados ao recarregar o aplicativo.

O avatar utiliza as iniciais do nome atual do aluno.

## Atualização das datas

A próxima aula no Início e a data de referência do Perfil são atualizadas:

- Ao entrar na tela.
- A cada minuto enquanto a tela estiver aberta.

Os temporizadores são encerrados ao sair da tela ou destruir o componente.

## Dados locais e persistência

- Os dados do aluno e do plano são demonstrativos.
- Nome e e-mail editados ficam salvos no navegador.
- Os dias, horários e aulas ficam no `AgendaService`.
- Os avisos da Timeline são salvos no `localStorage`.
- Quando o armazenamento falha, a interface informa que as alterações estão disponíveis apenas naquela sessão.
- A consulta de exercícios depende de internet e da disponibilidade da API wger.

## Tema e banner

As cores compartilhadas ficam em `src/global.css`.

O banner da Home está em:

`src/assets/images/banner-vermelho.png`

Os estilos de cada página utilizam as variáveis do tema para manter a identidade vermelha e branca.

## Divisão do grupo

| Nível | Integrante | Responsabilidade |
|---|---|---|
| Difícil | Leno | Treinos, API, busca, paginação, detalhes dos exercícios e revisão final da integração. |
| Difícil | Gabriel | Grade, service de agenda local e detalhes da aula com ID pela rota. |
| Médio | Vinícius | Timeline, `@for`, pipe de prioridade e diretiva de destaque dos avisos. |
| Médio | Anita | Perfil, `@if`, pipe de situação do plano e diretiva de destaque do plano. |
| Fácil | Bianka | Início, banner, atalhos e uso do DatePipe. |
| Fácil | Emanuele | Navegação, tema compartilhado e indicador com DecimalPipe. |

Na apresentação, cada integrante deve explicar sua funcionalidade, mostrar onde está implementada e demonstrar o resultado na tela.

## Validações realizadas

Em 24/11/2026:

- Compilação de produção aprovada com `npm run build`.
- Dados compartilhados entre Início e Perfil conferidos.
- Mudança automática de plano ativo para vencido confirmada em teste.
- Abertura dos detalhes dos exercícios e retorno à biblioteca conferidos.
- Edição de nome/e-mail e recuperação após recarregar a página conferidas.
- Novo banner vermelho exibido na Home.
- Interface conferida em visualização de celular no navegador.