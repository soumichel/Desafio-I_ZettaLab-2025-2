import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Serviço para integração com a API do Portal da Transparência
 * 
 * DOCUMENTAÇÃO: https://api.portaldatransparencia.gov.br/swagger-ui.html
 * 
 * ROTAS UTILIZADAS:
 * - /orgaos-siafi (órgãos públicos federais)
 * - /licitacoes (licitações do governo)
 * 
 * ROTAS PÚBLICAS DISPONÍVEIS (não utilizadas):
 * - /cartoes (cartões de pagamento do governo - NÃO UTILIZADA)
 * - /servidores (servidores públicos - requer filtros - NÃO UTILIZADA)
 * - /acordos-leniencia (acordos de leniência - NÃO UTILIZADA)
 * - /ceis (empresas inidôneas e suspensas - NÃO UTILIZADA)
 * - /cnep (empresas punidas - NÃO UTILIZADA)
 * - /cepim (entidades impedidas - NÃO UTILIZADA)
 * 
 * ROTAS RESTRITAS (não usar - requerem autenticação especial):
 * - /despesas/documentos-por-favorecido
 * - /bolsa-familia-disponivel-por-cpf-ou-nis
 * - /bolsa-familia-por-municipio
 * - /bolsa-familia-sacado-por-nis
 * - /auxilio-emergencial-beneficiario-por-municipio
 * - /auxilio-emergencial-por-cpf-ou-nis
 * - /auxilio-emergencial-por-municipio
 * - /seguro-defeso-codigo
 */
@Injectable({
  providedIn: 'root'
})
export class TransparenciaService {
  private readonly BASE_URL = 'https://api.portaldatransparencia.gov.br/api-de-dados';
  
  // Chave de API carregada do arquivo de configuração
  private readonly API_KEY = environment.transparenciaApiKey;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'chave-api-dados': this.API_KEY
    });
  }

  /**
   * Busca órgãos do SIAFI (Sistema Integrado de Administração Financeira)
   * Este é um endpoint público que lista todos os órgãos públicos federais
   * @param pagina Número da página (default 1)
   */
  getDespesas(pagina: number = 1): Observable<any> {
    const url = `${this.BASE_URL}/orgaos-siafi`;
    const params = {
      pagina: pagina.toString()
    };
    
    return this.http.get<any>(url, { 
      headers: this.getHeaders(),
      params 
    });
  }

  /**
   * Busca licitações do governo federal
   * Endpoint público que lista licitações e processos de compra
   * @param pagina Número da página (default 1)
   */
  getContratos(pagina: number = 1): Observable<any> {
    const url = `${this.BASE_URL}/licitacoes`;
    const params = {
      pagina: pagina.toString()
    };
    
    return this.http.get<any>(url, { 
      headers: this.getHeaders(),
      params 
    });
  }

  /**
   * Busca cartões de pagamento do governo federal
   * Endpoint público que lista gastos com cartões corporativos
   * @param mesAno Mês e ano no formato MMAAAA (ex: 102024 para outubro/2024)
   * @param pagina Número da página (default 1)
   */
  getCartoesPagamento(mesAno: string, pagina: number = 1): Observable<any> {
    const url = `${this.BASE_URL}/cartoes`;
    const params = {
      mesAno: mesAno,
      pagina: pagina.toString()
    };
    
    return this.http.get<any>(url, { 
      headers: this.getHeaders(),
      params 
    });
  }

  /**
   * Busca empresas do Cadastro Nacional de Empresas Inidôneas e Suspensas (CEIS)
   * @param pagina Número da página (default 1)
   */
  getEmpresasInidoneas(pagina: number = 1): Observable<any> {
    const url = `${this.BASE_URL}/ceis`;
    const params = {
      pagina: pagina.toString()
    };
    
    return this.http.get<any>(url, { 
      headers: this.getHeaders(),
      params 
    });
  }

  /**
   * Busca empresas do Cadastro Nacional de Empresas Punidas (CNEP)
   * @param pagina Número da página (default 1)
   */
  getEmpresasPunidas(pagina: number = 1): Observable<any> {
    const url = `${this.BASE_URL}/cnep`;
    const params = {
      pagina: pagina.toString()
    };
    
    return this.http.get<any>(url, { 
      headers: this.getHeaders(),
      params 
    });
  }

  /**
   * Busca acordos de leniência
   * @param pagina Número da página (default 1)
   */
  getAcordosLeniencia(pagina: number = 1): Observable<any> {
    const url = `${this.BASE_URL}/acordos-leniencia`;
    const params = {
      pagina: pagina.toString()
    };
    
    return this.http.get<any>(url, { 
      headers: this.getHeaders(),
      params 
    });
  }
}
