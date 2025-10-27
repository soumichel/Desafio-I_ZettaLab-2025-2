import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  // Dados estáticos sobre o projeto
  readonly projeto = {
    titulo: 'Portal de Dados Cívicos',
    subtitulo: 'Transparência e Informação para a Cidadania',
    descricao: 'Plataforma desenvolvida para facilitar o acesso a dados públicos brasileiros, promovendo transparência governamental e educação cívica.',
    objetivos: [
      'Facilitar o acesso a dados governamentais abertos',
      'Promover a transparência na gestão pública',
      'Educar cidadãos sobre seus direitos e recursos públicos',
      'Fornecer ferramentas de análise de dados cívicos'
    ]
  };

  readonly zettaLab = {
    nome: 'ZettaLab',
    descricao: 'Laboratório de inovação e tecnologia focado em soluções que impactam positivamente a sociedade através da ciência de dados e desenvolvimento de software.',
    missao: 'Desenvolver tecnologias que democratizem o acesso à informação e promovam a participação cidadã.'
  };

  readonly ufla = {
    nome: 'Universidade Federal de Lavras',
    sigla: 'UFLA',
    descricao: 'Instituição de ensino superior reconhecida pela excelência em pesquisa e inovação tecnológica.',
    localizacao: 'Lavras, Minas Gerais'
  };

  readonly fontesDados = [
    {
      nome: 'Portal da Transparência',
      descricao: 'Dados sobre despesas públicas, servidores, contratos e programas sociais',
      icone: '🏛️'
    },
    {
      nome: 'BrasilAPI',
      descricao: 'Informações sobre CEP, CNPJ, bancos, feriados e municípios brasileiros',
      icone: '🇧🇷'
    },
    {
      nome: 'IBGE',
      descricao: 'Estatísticas demográficas, econômicas e sociais do Brasil',
      icone: '📊'
    }
  ];
}
