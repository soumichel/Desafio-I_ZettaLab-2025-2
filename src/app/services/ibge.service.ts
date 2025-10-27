import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Serviço para integração com as APIs do IBGE (Instituto Brasileiro de Geografia e Estatística)
 * 
 * DOCUMENTAÇÃO:
 * - Notícias: https://servicodados.ibge.gov.br/api/docs/noticias
 * - Localidades: https://servicodados.ibge.gov.br/api/docs/localidades
 * - Agregados: https://servicodados.ibge.gov.br/api/docs/agregados
 * 
 * ROTAS UTILIZADAS:
 * - /api/v3/noticias (notícias e comunicados do IBGE)
 * - /api/v1/localidades/estados (lista de estados brasileiros)
 * - /api/v1/localidades/estados/{UF}/municipios (municípios por estado)
 * - /api/v1/localidades/municipios/{codigo} (informações de município específico)
 * - /api/v3/agregados/5938 (PIB por município)
 * - /api/v3/agregados/6579 (população estimada por município)
 * - /api/v3/agregados/2629 (IDH por município - NÃO UTILIZADA)
 * - /api/v3/agregados/7113 (taxa de analfabetismo - NÃO UTILIZADA)
 * - /api/v3/agregados/6478 (rendimento médio mensal - NÃO UTILIZADA)
 * 
 * OUTRAS ROTAS DISPONÍVEIS (não implementadas):
 * - /projecao (projeção populacional)
 * - /calendarios (calendários estatísticos)
 * - /metadados (metadados de pesquisas)
 */
@Injectable({
  providedIn: 'root'
})
export class IbgeService {
  private readonly NOTICIAS_URL = 'https://servicodados.ibge.gov.br/api/v3/noticias';
  private readonly LOCALIDADES_URL = 'https://servicodados.ibge.gov.br/api/v1/localidades';
  private readonly AGREGADOS_URL = 'https://servicodados.ibge.gov.br/api/v3/agregados';

  constructor(private http: HttpClient) { }

  /**
   * Busca notícias do IBGE
   * @param quantidade Número de notícias a retornar (padrão: 12)
   * @returns Observable com a lista de notícias
   */
  getNoticias(quantidade: number = 12): Observable<any[]> {
    return this.http.get<any>(`${this.NOTICIAS_URL}?qtd=${quantidade}`).pipe(
      map(response => response.items || [])
    );
  }

  /**
   * Busca todos os estados brasileiros
   * @returns Observable com a lista de estados
   */
  getEstados(): Observable<any[]> {
    return this.http.get<any[]>(`${this.LOCALIDADES_URL}/estados`).pipe(
      map(estados => estados.sort((a, b) => a.nome.localeCompare(b.nome)))
    );
  }

  /**
   * Busca municípios de um estado específico
   * @param uf Sigla do estado (ex: 'SP', 'RJ')
   * @returns Observable com a lista de municípios
   */
  getMunicipiosPorEstado(uf: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.LOCALIDADES_URL}/estados/${uf}/municipios`);
  }

  /**
   * Busca informações de um município específico
   * @param codigoMunicipio Código IBGE do município
   * @returns Observable com informações do município
   */
  getMunicipio(codigoMunicipio: string): Observable<any> {
    return this.http.get<any>(`${this.LOCALIDADES_URL}/municipios/${codigoMunicipio}`);
  }

  /**
   * Busca dados do PIB por município
   * @returns Observable com dados do PIB
   */
  getPibMunicipios(): Observable<any> {
    return this.http.get<any>(`${this.AGREGADOS_URL}/5938/periodos/2021/variaveis/37?localidades=N6[all]`);
  }

  /**
   * Busca população estimada por município
   * @returns Observable com estimativa populacional
   */
  getPopulacaoMunicipios(): Observable<any> {
    return this.http.get<any>(`${this.AGREGADOS_URL}/6579/periodos/2023/variaveis/9324?localidades=N6[all]`);
  }

  /**
   * Busca IDH por município
   * @returns Observable com dados do IDH
   */
  getIdh(): Observable<any> {
    return this.http.get<any>(`${this.AGREGADOS_URL}/2629/periodos/2010/variaveis/120?localidades=N6[all]`);
  }

  /**
   * Busca taxa de analfabetismo
   * @returns Observable com taxas de analfabetismo
   */
  getTaxaAnalfabetismo(): Observable<any> {
    return this.http.get<any>(`${this.AGREGADOS_URL}/7113/periodos/2022/variaveis/10267?localidades=N3[all]`);
  }

  /**
   * Busca rendimento médio mensal
   * @returns Observable com dados de rendimento
   */
  getRendimentoMedio(): Observable<any> {
    return this.http.get<any>(`${this.AGREGADOS_URL}/6478/periodos/202304/variaveis/5929?localidades=N1[all]`);
  }
}

