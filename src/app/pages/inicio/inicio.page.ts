
import { Component, OnDestroy, inject } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AlunoService } from '../../services/aluno.service';


import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import {
  barbellOutline,
  calendarOutline,
  newspaperOutline,
  personOutline
} from 'ionicons/icons';

import { AgendaService } from '../../services/agenda.service';
import { Aula } from '../../models/agenda.model';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonIcon,
    DecimalPipe,
    DatePipe,
    RouterLink
  ],
  templateUrl: './inicio.page.html',
  styleUrl: './inicio.page.scss'
})
export class InicioPage implements OnDestroy {
  private agenda = inject(AgendaService);

  private atualizacaoHorario?: ReturnType<typeof setInterval>;

  private alunoService = inject(AlunoService);

get nomeAluno(): string {
  return this.alunoService.nome;
}

get sessoesRestantes(): number {
  return this.alunoService.plano.sessoesRestantes;
}

get mediaSemanal(): number {
  return this.alunoService.mediaSemanal;
}

  nomeAula = 'Nenhuma aula disponível';
  proximaAula: Date | null = null;

  constructor() {
    addIcons({
      barbellOutline,
      calendarOutline,
      newspaperOutline,
      personOutline
    });
  }

  ionViewWillEnter(): void {
  this.pararAtualizacaoHorario();
  this.buscarProximaAula();

  this.atualizacaoHorario = setInterval(() => {
    this.buscarProximaAula();
  }, 60_000);
}

ionViewWillLeave(): void {
  this.pararAtualizacaoHorario();
}

ngOnDestroy(): void {
  this.pararAtualizacaoHorario();
}

private pararAtualizacaoHorario(): void {
  if (this.atualizacaoHorario !== undefined) {
    clearInterval(this.atualizacaoHorario);
    this.atualizacaoHorario = undefined;
  }
}
  private buscarProximaAula(): void {
    const agora = new Date();

    let melhorData: Date | null = null;
    let melhorAula: Aula | null = null;

    for (let diaOffset = 0; diaOffset < 7; diaOffset++) {
      const data = new Date(agora);
      data.setDate(agora.getDate() + diaOffset);

      const aulasDoDia = this.agenda.listarAulasPorDia(
        data.getDay()
      );

      for (const aula of aulasDoDia) {
        const [hora, minuto] = aula.inicio.split(':').map(Number);

        const inicioAula = new Date(data);
        inicioAula.setHours(hora, minuto, 0, 0);

        if (
          inicioAula > agora &&
          (!melhorData || inicioAula < melhorData)
        ) {
          melhorData = inicioAula;
          melhorAula = aula;
        }
      }
    }

    if (melhorAula && melhorData) {
      this.nomeAula = melhorAula.nome;
      this.proximaAula = melhorData;
    }
  }
}
