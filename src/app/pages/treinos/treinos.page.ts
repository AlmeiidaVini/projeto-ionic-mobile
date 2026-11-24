import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonSearchbar,
  IonButton
} from '@ionic/angular/standalone';

import { forkJoin, Subscription } from 'rxjs';

import { ExerciciosApiService } from '../../services/exercicios-api.service';

interface Treino {
  id: number;
  nome: string;
  musculos: string;
  equipamentos: string;
}

@Component({
  selector: 'app-treinos',
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonSearchbar,
    IonButton,
    RouterLink
  ],
  templateUrl: './treinos.page.html',
  styleUrl: './treinos.page.css'
})

export class TreinosPage implements OnInit, OnDestroy {


  treinos: Treino[] = [];

  carregando = true;
  erro = '';

  busca = '';

  private requisicaoAtual?: Subscription;


  paginaAtual = 1;

  itensPorPagina = 20;

  totalExercicios = 0;

  get totalPaginas(): number {
    return Math.ceil(
      this.totalExercicios / this.itensPorPagina
    );
  }

  get treinosFiltrados(): Treino[] {
    return this.treinos;
  }


  private nomesMusculos: Record<number, string> = {
    1: 'Bíceps',
    2: 'Deltoide anterior',
    3: 'Serrátil anterior',
    4: 'Peitoral maior',
    5: 'Tríceps',
    6: 'Abdômen',
    7: 'Panturrilha',
    8: 'Glúteo máximo',
    9: 'Trapézio',
    10: 'Quadríceps',
    11: 'Posterior da coxa',
    12: 'Grande dorsal',
    13: 'Braquial',
    14: 'Oblíquo externo',
    15: 'Sóleo'
  };


  private nomesEquipamentos: Record<number, string> = {
    1: 'Barra',
    2: 'Barra EZ',
    3: 'Halteres',
    4: 'Colchonete',
    5: 'Bola suíça',
    6: 'Barra fixa',
    7: 'Peso corporal',
    8: 'Banco',
    9: 'Banco inclinado',
    10: 'Kettlebell',
    11: 'Faixa elástica',
    12: 'Máquina de cabos'
  };


  constructor(
    private api: ExerciciosApiService
  ) {}

  ngOnInit(): void {
    this.carregarTreinos();
  }


  atualizarBusca(
    valor: string | null | undefined
  ): void {

    this.busca = valor ?? '';

    this.paginaAtual = 1;

    this.carregarTreinos();
  }


  carregarTreinos(): void {

    this.carregando = true;

    this.erro = '';

    this.requisicaoAtual?.unsubscribe();

    const offset =
      (this.paginaAtual - 1) * this.itensPorPagina;

    this.requisicaoAtual = forkJoin({

      exercicios: this.api.getExercicios(
        this.busca,
        offset
      ),

      musculos: this.api.getMusculos(),

      equipamentos: this.api.getEquipamentos()

    }).subscribe({

      next: ({ exercicios, musculos, equipamentos }) => {

        this.totalExercicios = exercicios.count;


        const mapaMusculos = new Map(
          musculos.results.map(m => [
            m.id,
            this.nomesMusculos[m.id] ?? 'Músculo não traduzido'
          ] as const)
        );


        const mapaEquipamentos = new Map(
          equipamentos.results.map(e => [
            e.id,
            this.nomesEquipamentos[e.id] ?? 'Equipamento não traduzido'
          ] as const)
        );


        this.treinos = exercicios.results.flatMap(
          exercicio => {

            const traducao = exercicio.translations.find(
              item => item.language === 7
            );

            if (!traducao?.name?.trim()) {
              return [];
            }

            return [{
              id: exercicio.id,

              nome: traducao.name,

              musculos: exercicio.muscles
                .map(m =>
                  mapaMusculos.get(m.id) ?? 'Não informado'
                )
                .join(', ') || 'Não informado',

              equipamentos: exercicio.equipment
                .map(e =>
                  mapaEquipamentos.get(e.id) ?? 'Não informado'
                )
                .join(', ') || 'Não informado'
            }];
          }
        );

        this.carregando = false;

      },

      error: (erro) => {

        console.error(
          'Erro ao carregar exercícios:',
          erro
        );

        this.erro =
          'Não foi possível carregar os exercícios.';

        this.carregando = false;
      }

    });
  }


  proximaPagina(): void {

    if (this.carregando) {
      return;
    }

    if (this.paginaAtual < this.totalPaginas) {

      this.paginaAtual++;

      this.carregarTreinos();
    }
  }

  paginaAnterior(): void {

    if (this.carregando) {
      return;
    }

    if (this.paginaAtual > 1) {

      this.paginaAtual--;

      this.carregarTreinos();
    }
  }


  ngOnDestroy(): void {

    this.requisicaoAtual?.unsubscribe();
  }

}
