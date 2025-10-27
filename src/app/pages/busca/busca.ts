import { Component, OnInit } from '@angular/core';
import { BrasilApiService } from '../../services/brasil-api.service';
import { TransparenciaService } from '../../services/transparencia.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-busca',
  imports: [CommonModule, FormsModule],
  templateUrl: './busca.html',
  styleUrl: './busca.scss'
})
export class Busca implements OnInit {
  // Controle de abas
  abaAtiva: 'cep' | 'cnpj' | 'municipio' | 'despesas' | 'contratos' = 'cep';

  // Campos de busca
  cepBusca: string = '';
  cnpjBusca: string = '';
  estadoSelecionado: string = '';
  municipioSelecionado: string = '';

  // Resultados
  resultadoCep: any = null;
  resultadoCnpj: any = null;
  listaMunicipios: any[] = [];
  listaDespesas: any[] = [];
  listaContratos: any[] = [];
  listaEstados: any[] = [];

  // Controle de estado
  loading: boolean = false;
  erro: string = '';

  constructor(
    private brasilApi: BrasilApiService,
    private transparenciaService: TransparenciaService
  ) { }

  ngOnInit(): void {
    this.carregarEstados();
  }

  // ============================================
  // MÉTODOS DE NAVEGAÇÃO
  // ============================================
  
  selecionarAba(aba: 'cep' | 'cnpj' | 'municipio' | 'despesas' | 'contratos'): void {
    this.abaAtiva = aba;
    this.limparResultados();
  }

  limparResultados(): void {
    this.resultadoCep = null;
    this.resultadoCnpj = null;
    this.listaMunicipios = [];
    this.listaDespesas = [];
    this.listaContratos = [];
    this.erro = '';
  }

  // ============================================
  // BRASIL API - CEP
  // ============================================
  
  buscarCep(): void {
    if (!this.cepBusca || this.cepBusca.length < 8) {
      this.erro = 'Por favor, insira um CEP válido com 8 dígitos';
      return;
    }

    this.loading = true;
    this.erro = '';
    
    this.brasilApi.getCep(this.cepBusca).subscribe({
      next: (data) => {
        this.resultadoCep = data;
        this.loading = false;
      },
      error: (err) => {
        this.erro = 'CEP não encontrado ou inválido';
        this.loading = false;
      }
    });
  }

  // ============================================
  // BRASIL API - CNPJ
  // ============================================
  
  buscarCnpj(): void {
    if (!this.cnpjBusca || this.cnpjBusca.length < 14) {
      this.erro = 'Por favor, insira um CNPJ válido com 14 dígitos';
      return;
    }

    this.loading = true;
    this.erro = '';
    
    this.brasilApi.getCnpj(this.cnpjBusca).subscribe({
      next: (data) => {
        this.resultadoCnpj = data;
        this.loading = false;
      },
      error: (err) => {
        this.erro = 'CNPJ não encontrado ou inválido';
        this.loading = false;
      }
    });
  }

  // ============================================
  // BRASIL API - MUNICÍPIOS
  // ============================================
  
  carregarEstados(): void {
    // Estados brasileiros (simplificado)
    this.listaEstados = [
      { sigla: 'AC', nome: 'Acre' },
      { sigla: 'AL', nome: 'Alagoas' },
      { sigla: 'AP', nome: 'Amapá' },
      { sigla: 'AM', nome: 'Amazonas' },
      { sigla: 'BA', nome: 'Bahia' },
      { sigla: 'CE', nome: 'Ceará' },
      { sigla: 'DF', nome: 'Distrito Federal' },
      { sigla: 'ES', nome: 'Espírito Santo' },
      { sigla: 'GO', nome: 'Goiás' },
      { sigla: 'MA', nome: 'Maranhão' },
      { sigla: 'MT', nome: 'Mato Grosso' },
      { sigla: 'MS', nome: 'Mato Grosso do Sul' },
      { sigla: 'MG', nome: 'Minas Gerais' },
      { sigla: 'PA', nome: 'Pará' },
      { sigla: 'PB', nome: 'Paraíba' },
      { sigla: 'PR', nome: 'Paraná' },
      { sigla: 'PE', nome: 'Pernambuco' },
      { sigla: 'PI', nome: 'Piauí' },
      { sigla: 'RJ', nome: 'Rio de Janeiro' },
      { sigla: 'RN', nome: 'Rio Grande do Norte' },
      { sigla: 'RS', nome: 'Rio Grande do Sul' },
      { sigla: 'RO', nome: 'Rondônia' },
      { sigla: 'RR', nome: 'Roraima' },
      { sigla: 'SC', nome: 'Santa Catarina' },
      { sigla: 'SP', nome: 'São Paulo' },
      { sigla: 'SE', nome: 'Sergipe' },
      { sigla: 'TO', nome: 'Tocantins' }
    ];
  }

  buscarMunicipios(): void {
    if (!this.estadoSelecionado) {
      this.erro = 'Por favor, selecione um estado';
      return;
    }

    this.loading = true;
    this.erro = '';
    
    this.brasilApi.getMunicipiosPorEstado(this.estadoSelecionado).subscribe({
      next: (data) => {
        this.listaMunicipios = data;
        this.loading = false;
      },
      error: (err) => {
        this.erro = 'Erro ao carregar municípios';
        this.loading = false;
      }
    });
  }

  // ============================================
  // PORTAL DA TRANSPARÊNCIA - DESPESAS
  // ============================================
  
  buscarDespesas(): void {
    this.loading = true;
    this.erro = '';
    
    // Busca órgãos SIAFI (endpoint público disponível)
    this.transparenciaService.getDespesas(1).subscribe({
      next: (data) => {
        console.log('Resposta da API:', data);
        
        // A API pode retornar array direto ou objeto com propriedades
        if (Array.isArray(data)) {
          this.listaDespesas = data;
        } else if (data && typeof data === 'object') {
          // Tenta extrair array de várias propriedades possíveis
          this.listaDespesas = data.content || data.data || data.items || [];
        } else {
          this.listaDespesas = [];
        }
        
        if (this.listaDespesas.length === 0) {
          this.erro = 'Nenhum dado encontrado. A API pode estar indisponível temporariamente.';
        }
        
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro na API do Portal da Transparência:', err);
        this.loading = false;
        this.listaDespesas = [];
        
        // Não exibe erro, pois vamos mostrar a mensagem informativa no template
      }
    });
  }

  abrirPortalTransparencia(secao: string): void {
    const urls: { [key: string]: string } = {
      'orgaos': 'https://portaldatransparencia.gov.br/orgaos',
      'licitacoes': 'https://portaldatransparencia.gov.br/licitacoes',
      'despesas': 'https://portaldatransparencia.gov.br/despesas',
      'downloads': 'https://portaldatransparencia.gov.br/download-de-dados'
    };
    
    window.open(urls[secao] || 'https://portaldatransparencia.gov.br', '_blank');
  }

  // ============================================
  // PORTAL DA TRANSPARÊNCIA - CONTRATOS
  // ============================================
  
  buscarContratos(): void {
    this.loading = true;
    this.erro = '';
    
    // Busca licitações (endpoint público disponível)
    this.transparenciaService.getContratos(1).subscribe({
      next: (data) => {
        console.log('Resposta da API:', data);
        
        // A API pode retornar array direto ou objeto com propriedades
        if (Array.isArray(data)) {
          this.listaContratos = data;
        } else if (data && typeof data === 'object') {
          // Tenta extrair array de várias propriedades possíveis
          this.listaContratos = data.content || data.data || data.items || [];
        } else {
          this.listaContratos = [];
        }
        
        if (this.listaContratos.length === 0) {
          this.erro = 'Nenhum dado encontrado. A API pode estar indisponível temporariamente.';
        }
        
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro na API do Portal da Transparência:', err);
        this.loading = false;
        this.listaContratos = [];
        
        // Não exibe erro, pois vamos mostrar a mensagem informativa no template
      }
    });
  }

  // ============================================
  // UTILITÁRIOS
  // ============================================
  
  formatarCep(cep: string): string {
    return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
  }

  formatarCnpj(cnpj: string): string {
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }

  formatarMoeda(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }
}
