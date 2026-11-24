import { Component, inject, OnDestroy } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonModal,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';

import {
  barbellOutline,
  calendarOutline,
  chevronForwardOutline,
  closeOutline,
  createOutline,
  mailOutline
} from 'ionicons/icons';

import { AlunoService } from '../../services/aluno.service';
import { SituacaoPlanoPipe } from '../../pipes/situacao-plano.pipe';
import { DestaquePlanoDirective } from '../../directives/destaque-plano.directive';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    DatePipe,
    DecimalPipe,
    FormsModule,
    RouterLink,
    IonButton,
    IonContent,
    IonHeader,
    IonIcon,
    IonInput,
    IonModal,
    IonTitle,
    IonToolbar,
    SituacaoPlanoPipe,
    DestaquePlanoDirective
  ],
  templateUrl: './perfil.page.html',
  styleUrl: './perfil.page.css'
})
export class PerfilPage implements OnDestroy {
  private alunoService = inject(AlunoService);

  private atualizacaoPlano?: ReturnType<typeof setInterval>;

  agora = new Date();

  editandoPerfil = false;
  nomeEdicao = '';
  emailEdicao = '';
  erroEdicao = '';

  aviso = '';
  falhaAoSalvar = false;

  constructor() {
    addIcons({
      barbellOutline,
      calendarOutline,
      chevronForwardOutline,
      closeOutline,
      createOutline,
      mailOutline
    });
  }

  get nomeAluno(): string {
    return this.alunoService.nome;
  }

  get emailAluno(): string {
    return this.alunoService.email;
  }

  get plano() {
    return this.alunoService.plano;
  }

  get mediaSemanal(): number {
    return this.alunoService.mediaSemanal;
  }

  get iniciais(): string {
    return this.nomeAluno
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(parte => parte.charAt(0))
      .join('')
      .toUpperCase() || 'RF';
  }

  abrirEdicao(): void {
    this.nomeEdicao = this.nomeAluno;
    this.emailEdicao = this.emailAluno;
    this.erroEdicao = '';
    this.editandoPerfil = true;
  }

  fecharEdicao(): void {
    this.editandoPerfil = false;
    this.erroEdicao = '';
  }

  salvarPerfil(): void {
    const nome = (this.nomeEdicao ?? '').trim();
    const email = (this.emailEdicao ?? '').trim();

    if (!nome) {
      this.erroEdicao = 'Informe seu nome.';
      return;
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailValido.test(email)) {
      this.erroEdicao = 'Informe um e-mail válido.';
      return;
    }

    const salvo = this.alunoService.atualizarPerfil(nome, email);

    this.falhaAoSalvar = !salvo;

    this.aviso = salvo
      ? 'Dados atualizados com sucesso.'
      : 'Dados atualizados nesta sessão. O navegador não permitiu salvar.';

    this.fecharEdicao();
  }

  ionViewWillEnter(): void {
    this.pararAtualizacaoPlano();
    this.agora = new Date();

    this.atualizacaoPlano = setInterval(() => {
      this.agora = new Date();
    }, 60_000);
  }

  ionViewWillLeave(): void {
    this.pararAtualizacaoPlano();
  }

  ngOnDestroy(): void {
    this.pararAtualizacaoPlano();
  }

  private pararAtualizacaoPlano(): void {
    if (this.atualizacaoPlano !== undefined) {
      clearInterval(this.atualizacaoPlano);
      this.atualizacaoPlano = undefined;
    }
  }
}