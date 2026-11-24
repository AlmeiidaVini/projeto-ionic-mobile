
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';


interface Traducao {
  language: number;
  name: string;
  description?: string;
}

interface MusculoApi {
  id: number;
  name: string;
  name_en: string;
}

interface EquipamentoApi {
  id: number;
  name: string;
}

export interface ExercicioApi {
  id: number;
  translations: Traducao[];
  muscles: MusculoApi[];
  equipment: EquipamentoApi[];
}

interface RespostaApi<T> {
  count: number;
  results: T[];
}

@Injectable({
  providedIn: 'root'
})
export class ExerciciosApiService {

  private apiUrl = 'https://wger.de/api/v2';

  private musculosCache$?: Observable<RespostaApi<MusculoApi>>;
  private equipamentosCache$?: Observable<RespostaApi<EquipamentoApi>>;

  constructor(private http: HttpClient) {}


  getExercicios(busca: string = '', offset: number = 0) {

    let params = new HttpParams()
      .set('language__code', 'pt')
      .set('limit', '20')
      .set('offset', offset.toString());

    if (busca.trim()) {
      params = params.set('name__exact', busca.trim());
    }

    return this.http.get<RespostaApi<ExercicioApi>>(
      `${this.apiUrl}/exerciseinfo/`,
      { params }
    );
  }


  getMusculos(): Observable<RespostaApi<MusculoApi>> {

    if (!this.musculosCache$) {

      this.musculosCache$ = this.http
        .get<RespostaApi<MusculoApi>>(
          `${this.apiUrl}/muscle/?limit=100`
        )
        .pipe(
          shareReplay(1)
        );
    }

    return this.musculosCache$;
  }


  getEquipamentos(): Observable<RespostaApi<EquipamentoApi>> {

    if (!this.equipamentosCache$) {

      this.equipamentosCache$ = this.http
        .get<RespostaApi<EquipamentoApi>>(
          `${this.apiUrl}/equipment/?limit=100`
        )
        .pipe(
          shareReplay(1)
        );
    }

    return this.equipamentosCache$;
  }

  getExercicioPorId(id: number): Observable<ExercicioApi> {
    return this.http.get<ExercicioApi>(
      `${this.apiUrl}/exerciseinfo/${id}/`
    );
  }
}
