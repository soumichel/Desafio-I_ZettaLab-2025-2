import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IbgeService } from '../../services/ibge.service';
import { BrasilApiService } from '../../services/brasil-api.service';
import { TransparenciaService } from '../../services/transparencia.service';

interface ConteudoEducativo {
  categoria: string;
  titulo: string;
  descricao: string;
  icone: string;
  exemplos: string[];
}

@Component({
  selector: 'app-educativo',
  imports: [CommonModule, FormsModule],
  templateUrl: './educativo.html',
  styleUrl: './educativo.scss'
})
export class Educativo implements OnInit {
  // Controle de seções
  categoriaAtiva: 'cidadania' | 'apis' | 'transparencia' | 'pratica' = 'cidadania';

  // Dados educativos
  conteudosCidadania: ConteudoEducativo[] = [];
  conteudosApis: ConteudoEducativo[] = [];
  conteudosTransparencia: ConteudoEducativo[] = [];

  // Dados práticos
  noticiasIbge: any[] = [];
  
  // Estados de controle
  erro: string = '';

  // Quiz interativo
  quizAtual: number = 0;
  respostasSelecionadas: number[] = [];
  quizCompleto: boolean = false;
  pontuacao: number = 0;

  // Banco completo de perguntas (será randomizado)
  bancoPerguntasCompleto = [
    {
      pergunta: 'O que significa transparência pública?',
      opcoes: [
        'Divulgação de informações governamentais ao cidadão',
        'Governo secreto e fechado',
        'Apenas políticos podem ver os dados',
        'Informações disponíveis apenas mediante pagamento'
      ],
      respostaCorreta: 0
    },
    {
      pergunta: 'Qual é a função do IBGE?',
      opcoes: [
        'Arrecadar impostos',
        'Produzir e analisar estatísticas sobre o Brasil',
        'Gerenciar rodovias federais',
        'Controlar a moeda brasileira'
      ],
      respostaCorreta: 1
    },
    {
      pergunta: 'O que são dados abertos?',
      opcoes: [
        'Dados que custam muito caro',
        'Informações privadas do governo',
        'Dados públicos, acessíveis e reutilizáveis gratuitamente',
        'Dados disponíveis apenas para pesquisadores'
      ],
      respostaCorreta: 2
    },
    {
      pergunta: 'Qual lei brasileira regulamenta o acesso à informação pública?',
      opcoes: [
        'Lei de Acesso à Informação (LAI - Lei 12.527/2011)',
        'Código de Defesa do Consumidor',
        'Constituição Federal de 1824',
        'Lei de Diretrizes e Bases da Educação'
      ],
      respostaCorreta: 0
    },
    {
      pergunta: 'O que é uma API (Application Programming Interface)?',
      opcoes: [
        'Um tipo de impressora moderna',
        'Uma interface que permite aplicações acessarem dados de forma automatizada',
        'Um programa antivírus',
        'Um navegador de internet'
      ],
      respostaCorreta: 1
    },
    {
      pergunta: 'Qual portal governamental brasileiro centraliza dados sobre gastos públicos?',
      opcoes: [
        'Portal da Receita Federal',
        'Portal da Transparência',
        'Portal do Empreendedor',
        'Portal e-CAC'
      ],
      respostaCorreta: 1
    },
    {
      pergunta: 'O que é CNPJ?',
      opcoes: [
        'Cadastro Nacional de Pessoa Jurídica',
        'Certificado Nacional de Propriedade de Jogos',
        'Conselho Nacional de Proteção Jurídica',
        'Central Nacional de Processos Judiciais'
      ],
      respostaCorreta: 0
    },
    {
      pergunta: 'Qual órgão é responsável pelo Censo Demográfico no Brasil?',
      opcoes: [
        'Ministério da Saúde',
        'IBGE (Instituto Brasileiro de Geografia e Estatística)',
        'Tribunal Superior Eleitoral',
        'Banco Central'
      ],
      respostaCorreta: 1
    },
    {
      pergunta: 'O que são despesas públicas?',
      opcoes: [
        'Dívidas pessoais de políticos',
        'Gastos realizados pelo governo com recursos públicos',
        'Impostos pagos pelos cidadãos',
        'Investimentos privados em empresas'
      ],
      respostaCorreta: 1
    },
    {
      pergunta: 'Qual é o objetivo principal da transparência pública?',
      opcoes: [
        'Esconder informações sensíveis',
        'Permitir controle social e prevenir corrupção',
        'Dificultar o acesso a dados governamentais',
        'Aumentar a burocracia'
      ],
      respostaCorreta: 1
    },
    {
      pergunta: 'O que significa a sigla CEP?',
      opcoes: [
        'Centro de Estudos Públicos',
        'Código de Endereçamento Postal',
        'Cadastro Estadual de Propriedades',
        'Conselho de Ética Profissional'
      ],
      respostaCorreta: 1
    },
    {
      pergunta: 'Quantos estados possui o Brasil?',
      opcoes: [
        '25 estados',
        '26 estados',
        '27 estados (26 + Distrito Federal)',
        '28 estados'
      ],
      respostaCorreta: 2
    },
    {
      pergunta: 'O que é o Portal BrasilAPI?',
      opcoes: [
        'Um site de notícias',
        'Uma API pública e gratuita com dados brasileiros',
        'Uma rede social governamental',
        'Um aplicativo de mensagens'
      ],
      respostaCorreta: 1
    },
    {
      pergunta: 'Qual é a importância do controle social?',
      opcoes: [
        'Permitir que cidadãos fiscalizem ações governamentais',
        'Controlar o que as pessoas fazem em casa',
        'Impedir manifestações públicas',
        'Limitar a liberdade de expressão'
      ],
      respostaCorreta: 0
    },
    {
      pergunta: 'O que são licitações públicas?',
      opcoes: [
        'Processos para venda de produtos online',
        'Procedimentos para contratação de obras e serviços pelo governo',
        'Cadastro de empresas privadas',
        'Sistema de votação eletrônica'
      ],
      respostaCorreta: 1
    }
  ];

  // Perguntas selecionadas aleatoriamente para o quiz atual
  perguntas: any[] = [];

  constructor(
    private ibgeService: IbgeService,
    private brasilApi: BrasilApiService,
    private transparenciaService: TransparenciaService
  ) { }

  ngOnInit(): void {
    this.inicializarConteudos();
    this.carregarNoticiasIbge();
    this.inicializarQuiz();
  }

  // ============================================
  // NAVEGAÇÃO
  // ============================================
  
  selecionarCategoria(categoria: 'cidadania' | 'apis' | 'transparencia' | 'pratica'): void {
    this.categoriaAtiva = categoria;
    this.erro = '';
  }

  // ============================================
  // CONTEÚDOS EDUCATIVOS
  // ============================================
  
  inicializarConteudos(): void {
    this.conteudosCidadania = [
      {
        categoria: 'Direitos',
        titulo: 'Direito à Informação',
        descricao: 'Todo cidadão tem direito de acessar informações públicas, conforme garantido pela Lei de Acesso à Informação (LAI - Lei 12.527/2011).',
        icone: '📖',
        exemplos: [
          'Consultar despesas públicas',
          'Verificar salários de servidores',
          'Acessar dados de contratos governamentais',
          'Obter informações sobre programas sociais'
        ]
      },
      {
        categoria: 'Participação',
        titulo: 'Participação Cidadã',
        descricao: 'A transparência permite que os cidadãos acompanhem e fiscalizem a gestão pública, exercendo controle social.',
        icone: '👥',
        exemplos: [
          'Acompanhar execução do orçamento',
          'Fiscalizar obras públicas',
          'Avaliar políticas públicas',
          'Denunciar irregularidades'
        ]
      },
      {
        categoria: 'Dados',
        titulo: 'Importância dos Dados',
        descricao: 'Dados públicos são fundamentais para tomada de decisões, pesquisas acadêmicas e desenvolvimento de soluções inovadoras.',
        icone: '📊',
        exemplos: [
          'Planejamento urbano baseado em dados demográficos',
          'Pesquisas científicas com estatísticas oficiais',
          'Desenvolvimento de aplicações cívicas',
          'Análise de políticas públicas'
        ]
      }
    ];

    this.conteudosApis = [
      {
        categoria: 'IBGE',
        titulo: 'API do IBGE',
        descricao: 'Fornece dados demográficos, econômicos e geográficos do Brasil, incluindo censos, pesquisas e estatísticas oficiais.',
        icone: '🗺️',
        exemplos: [
          'População de municípios e estados',
          'Indicadores econômicos (PIB, inflação)',
          'Dados do Censo Demográfico',
          'Informações geográficas e territoriais'
        ]
      },
      {
        categoria: 'BrasilAPI',
        titulo: 'BrasilAPI',
        descricao: 'Agrega diversas informações públicas brasileiras em uma única API, facilitando o acesso a dados sobre CEP, CNPJ, bancos e muito mais.',
        icone: '🇧🇷',
        exemplos: [
          'Consulta de CEP e endereços',
          'Informações de CNPJ',
          'Lista de bancos brasileiros',
          'Feriados nacionais e municipais'
        ]
      },
      {
        categoria: 'Transparência',
        titulo: 'Portal da Transparência',
        descricao: 'Disponibiliza informações sobre execução orçamentária, despesas, contratos, servidores e programas do governo federal.',
        icone: '🏛️',
        exemplos: [
          'Despesas por órgão e programa',
          'Contratos e licitações',
          'Remuneração de servidores',
          'Transferências de recursos'
        ]
      }
    ];

    this.conteudosTransparencia = [
      {
        categoria: 'Lei',
        titulo: 'Lei de Acesso à Informação',
        descricao: 'A LAI (Lei 12.527/2011) regula o acesso a informações públicas, estabelecendo que a transparência é a regra e o sigilo, a exceção.',
        icone: '⚖️',
        exemplos: [
          'Qualquer pessoa pode solicitar informações',
          'Resposta deve ser dada em até 20 dias',
          'Informações devem ser divulgadas ativamente',
          'Sigilo só em casos específicos previstos em lei'
        ]
      },
      {
        categoria: 'Portal',
        titulo: 'Portal da Transparência',
        descricao: 'Plataforma oficial do governo federal para divulgação de informações sobre a aplicação de recursos públicos.',
        icone: '💻',
        exemplos: [
          'Acesso livre e gratuito',
          'Dados atualizados diariamente',
          'Informações desde 2004',
          'Diversos formatos de consulta e download'
        ]
      },
      {
        categoria: 'Controle',
        titulo: 'Controle Social',
        descricao: 'Mecanismos que permitem à sociedade acompanhar e fiscalizar a gestão dos recursos públicos.',
        icone: '🔍',
        exemplos: [
          'Conselhos de políticas públicas',
          'Audiências públicas',
          'Ouvidorias governamentais',
          'Plataformas de dados abertos'
        ]
      }
    ];
  }

  // ============================================
  // NOTÍCIAS DO IBGE
  // ============================================
  
  carregarNoticiasIbge(): void {
    this.ibgeService.getNoticias(3).subscribe({
      next: (data) => {
        this.noticiasIbge = data;
      },
      error: (err) => {
        console.error('Erro ao carregar notícias:', err);
      }
    });
  }

  // ============================================
  // QUIZ INTERATIVO
  // ============================================

  inicializarQuiz(): void {
    // Embaralha o banco de perguntas e seleciona 3 aleatórias
    const perguntasEmbaralhadas = [...this.bancoPerguntasCompleto].sort(() => Math.random() - 0.5);
    this.perguntas = perguntasEmbaralhadas.slice(0, 3);
  }
  
  selecionarResposta(perguntaIndex: number, respostaIndex: number): void {
    this.respostasSelecionadas[perguntaIndex] = respostaIndex;
  }

  proximaPergunta(): void {
    if (this.quizAtual < this.perguntas.length - 1) {
      this.quizAtual++;
    }
  }

  perguntaAnterior(): void {
    if (this.quizAtual > 0) {
      this.quizAtual--;
    }
  }

  finalizarQuiz(): void {
    this.pontuacao = 0;
    this.perguntas.forEach((pergunta, index) => {
      if (this.respostasSelecionadas[index] === pergunta.respostaCorreta) {
        this.pontuacao++;
      }
    });
    this.quizCompleto = true;
  }

  reiniciarQuiz(): void {
    this.quizAtual = 0;
    this.respostasSelecionadas = [];
    this.quizCompleto = false;
    this.pontuacao = 0;
    this.inicializarQuiz(); // Seleciona novas perguntas aleatórias
  }
}
