import { Component, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';

import { Subscription } from 'rxjs';

import {
  ExerciciosApiService,
  type ExercicioApi
} from '../../services/exercicios-api.service';

@Component({
  selector: 'app-detalhes-treino',
  standalone: true,
  imports: [
    IonBackButton,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar
  ],
  templateUrl: './detalhes-treino.page.html',
  styleUrl: './detalhes-treino.page.css'
})
export class DetalhesTreinoPage implements OnDestroy {
  private rota = inject(ActivatedRoute);
  private api = inject(ExerciciosApiService);

  private requisicao?: Subscription;

  exercicio: ExercicioApi | null = null;

  carregando = true;
  erro = '';

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

  get nome(): string {
    const traducoes = this.exercicio?.translations ?? [];

    return traducoes.find(item => item.language === 7)?.name
      || traducoes[0]?.name
      || 'Detalhes do exercício';
  }

  get descricao(): string {
    const traducao = this.exercicio?.translations?.find(
      item => item.language === 7
    );

    return traducao?.description?.trim() || '';
  }

  get musculos(): string {
    return this.exercicio?.muscles
      ?.map(musculo =>
        this.nomesMusculos[musculo.id]
        || musculo.name_en
        || musculo.name
      )
      .join(', ') || 'Não informado';
  }

  get equipamentos(): string {
    return this.exercicio?.equipment
      ?.map(equipamento =>
        this.nomesEquipamentos[equipamento.id]
        || equipamento.name
      )
      .join(', ') || 'Não informado';
  }

  ionViewWillEnter(): void {
    this.carregarExercicio();
  }

  carregarExercicio(): void {
    this.requisicao?.unsubscribe();

    this.carregando = true;
    this.erro = '';
    this.exercicio = null;

    const id = Number(
      this.rota.snapshot.paramMap.get('id')
    );

    if (!Number.isSafeInteger(id) || id <= 0) {
      this.erro = 'Exercício não encontrado.';
      this.carregando = false;
      return;
    }

    this.requisicao = this.api
      .getExercicioPorId(id)
      .subscribe({
        next: exercicio => {
          this.exercicio = exercicio;
          this.carregando = false;
        },

        error: falha => {
          this.erro = falha?.status === 404
            ? 'Exercício não encontrado.'
            : 'Não foi possível carregar o exercício. Tente novamente.';

          this.carregando = false;
        }
      });
  }

  ionViewWillLeave(): void {
    this.requisicao?.unsubscribe();
  }

  ngOnDestroy(): void {
    this.requisicao?.unsubscribe();
  }
}