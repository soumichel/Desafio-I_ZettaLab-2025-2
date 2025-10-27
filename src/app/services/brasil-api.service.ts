import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Serviço para integração com a BrasilAPI
 * 
 * DOCUMENTAÇÃO: https://brasilapi.com.br/docs
 * 
 * ROTAS UTILIZADAS:
 * - /cep/v1/{cep} (busca informações de CEP)
 * - /cnpj/v1/{cnpj} (busca informações de CNPJ)
 * - /ibge/municipios/v1/{uf} (lista municípios de um estado)
 * 
 * ROTAS DISPONÍVEIS (não utilizadas no sistema):
 * - /banks/v1 (lista todos os bancos do Brasil - NÃO UTILIZADA)
 * - /feriados/v1/{ano} (feriados nacionais - NÃO UTILIZADA)
 * - /ddd/v1/{ddd} (informações de DDD - NÃO UTILIZADA)
 * - /ibge/municipios/v1/{codigoIbge} (município por código IBGE - NÃO UTILIZADA)
 * - /isbn/v1/{isbn} (informações de livros - NÃO UTILIZADA)
 * - /taxas/v1 (taxas de juros e indicadores econômicos - NÃO UTILIZADA)
 * - /cvm/corretoras/v1 (corretoras registradas na CVM - NÃO UTILIZADA)
 * - /ncm/v1 (Nomenclatura Comum do Mercosul - NÃO UTILIZADA)
 * - /pix/v1/participants (instituições participantes do PIX - NÃO UTILIZADA)
 */
@Injectable({
  providedIn: 'root'
})
export class BrasilApiService {
  private readonly BASE_URL = 'https://brasilapi.com.br/api';

  constructor(private http: HttpClient) { }

  /**
   * Busca informações de CEP
   * @param cep CEP a ser consultado (apenas números)
   */
  getCep(cep: string): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/cep/v1/${cep}`);
  }

  /**
   * Busca informações de CNPJ
   * @param cnpj CNPJ a ser consultado (apenas números)
   */
  getCnpj(cnpj: string): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/cnpj/v1/${cnpj}`);
  }

  /**
   * Busca todos os bancos do Brasil
   */
  getBancos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.BASE_URL}/banks/v1`);
  }

  /**
   * Busca feriados nacionais de um ano
   * @param ano Ano a ser consultado
   */
  getFeriados(ano: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.BASE_URL}/feriados/v1/${ano}`);
  }

  /**
   * Busca informações de DDD
   * @param ddd DDD a ser consultado
   */
  getDdd(ddd: string): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/ddd/v1/${ddd}`);
  }

  /**
   * Busca informações de um município por código IBGE
   * @param codigoIbge Código IBGE do município
   */
  getMunicipio(codigoIbge: string): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/ibge/municipios/v1/${codigoIbge}`);
  }

  /**
   * Busca todos os municípios de um estado
   * @param uf Sigla do estado (ex: 'SP', 'RJ')
   */
  getMunicipiosPorEstado(uf: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.BASE_URL}/ibge/municipios/v1/${uf}?providers=dados-abertos-br,gov,wikipedia`);
  }

  /**
   * Busca informações sobre um ISBN
   * @param isbn ISBN do livro
   */
  getIsbn(isbn: string): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/isbn/v1/${isbn}`);
  }

  /**
   * Busca taxas de juros e indicadores econômicos
   */
  getTaxas(): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/taxas/v1`);
  }
}
