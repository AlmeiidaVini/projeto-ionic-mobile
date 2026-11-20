import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AlertController,
  IonButton,
  IonCard,
  IonCardContent,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonInput,
  IonModal,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { DestaqueAvisoDirective } from '../../directives/destaque-aviso.directive';
import { PrioridadeAvisoPipe } from '../../pipes/prioridade-aviso.pipe';

interface Aviso {
  id: number;
  titulo: string;
  mensagem: string;
  prazo: Date;
  obrigatorio: boolean;
  lido: boolean;
}

type Rascunho = Omit<Aviso, 'id' | 'prazo' | 'lido'> & {
  id: number | null;
  prazo: string;
};

type AvisoSalvo = Omit<Aviso, 'prazo'> & { prazo: string | null };

const HORA_MS = 60 * 60 * 1000;
const CHAVE_AVISOS = 'ritmo-fit.timeline.avisos';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [
    FormsModule,
    IonButton,
    IonCard,
    IonCardContent,
    IonCheckbox,
    IonContent,
    IonHeader,
    IonInput,
    IonModal,
    IonTextarea,
    IonTitle,
    IonToolbar,
    DestaqueAvisoDirective,
    PrioridadeAvisoPipe,
  ],
  templateUrl: './timeline.page.html',
  styles: [`
    .titulo-avisos {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 700;
    }

    .acoes {
      display: flex;
      flex-wrap: wrap;
      gap: .25rem;
    }

    .formulario {
      display: grid;
      gap: 1rem;
    }

    .mensagem {
      white-space: pre-wrap;
      overflow-wrap: anywhere;
    }

    .modal-aviso {
      --width: calc(100% - 2rem);
      --max-width: 34rem;
      --height: auto;
      --max-height: calc(100% - 2rem);
      --background: var(--ion-card-background, var(--ion-background-color, #fff));
      --border-radius: 1.125rem;
      --border-width: 1px;
      --border-style: solid;
      --border-color: rgb(127 127 127 / 26%);
      --box-shadow: 0 18px 64px rgb(0 0 0 / 32%);
      --backdrop-opacity: .55;
    }

    .painel-aviso {
      max-height: calc(100dvh - 2rem - 2px);
      overflow-y: auto;
      overscroll-behavior: contain;
      padding: clamp(1rem, 4vw, 1.5rem);
    }

    .painel-aviso h2 {
      margin: 0 0 1.125rem;
      padding-bottom: .85rem;
      border-bottom: 1px solid rgb(127 127 127 / 26%);
      font-size: 1.4rem;
      font-weight: 750;
    }

    .painel-aviso ion-input,
    .painel-aviso ion-textarea {
      --border-radius: .7rem;
      --border-color: rgb(127 127 127 / 50%);
      --background: rgb(127 127 127 / 6%);
    }

    .classificacao-aviso,
    .previa-prioridade,
    .estado-aviso,
    .acoes-modal {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: .5rem;
    }

    .classificacao-aviso {
      justify-content: space-between;
      padding: .8rem;
      border: 1px solid rgb(127 127 127 / 26%);
      border-radius: .8rem;
      background: rgb(127 127 127 / 8%);
    }

    .previa-prioridade {
      font-size: .875rem;
    }

    .etiqueta-prioridade {
      display: inline-block;
      padding: .23rem .6rem;
      border-radius: 999px;
      background: #e5e7eb;
      color: #374151;
      font-size: .8rem;
    }

    .etiqueta-prioridade[data-prioridade="Urgente"] {
      background: #ffdedb;
      color: #831f1b;
    }

    .etiqueta-prioridade[data-prioridade="Atenção"] {
      background: #ffedbf;
      color: #67420c;
    }

    .etiqueta-prioridade[data-prioridade="Informativo"] {
      background: #dce9ff;
      color: #163f7d;
    }

    .acoes-modal {
      justify-content: flex-end;
      padding-top: .85rem;
      border-top: 1px solid rgb(127 127 127 / 26%);
    }

    .acoes-modal ion-button {
      --border-radius: .65rem;
      min-height: 44px;
      margin: 0;
      text-transform: none;
      letter-spacing: 0;
    }

    .acoes-modal ion-button[fill="outline"] {
      --color: var(--ion-text-color, #25232a);
      --border-color: rgb(127 127 127 / 58%);
    }

    .acoes-modal ion-button[type="submit"] {
      --background: var(--ion-color-primary-shade, var(--ion-color-primary, #b75448));
      font-weight: 700;
    }
  `],
})
export class TimelinePage {
  private readonly alertas = inject(AlertController);

  readonly agora = signal(new Date());
  falhaAoSalvar = false;
  readonly avisos = signal(this.carregarAvisos());
  rascunho: Rascunho | null = null;
  erroFormulario = '';

  private proximoId = Math.max(0, ...this.avisos().map(aviso => aviso.id)) + 1;

  get temLidos(): boolean {
    return this.avisos().some(aviso => aviso.lido);
  }

  get temNaoLidos(): boolean {
    return this.avisos().some(aviso => !aviso.lido);
  }

  ionViewWillEnter(): void {
    this.agora.set(new Date());
  }

  abrirFormulario(aviso?: Aviso): void {
    this.atualizarAgora();
    const prazo = aviso?.prazo ?? new Date(this.agora().getTime() + 24 * HORA_MS);
    this.erroFormulario = '';
    this.rascunho = {
      id: aviso?.id ?? null,
      titulo: aviso?.titulo ?? '',
      mensagem: aviso?.mensagem ?? '',
      prazo: this.prazoParaInput(prazo),
      obrigatorio: aviso?.obrigatorio ?? false,
    };
  }

  fecharFormulario(): void {
    this.rascunho = null;
    this.erroFormulario = '';
  }

  atualizarAgora(): void {
    this.agora.set(new Date());
  }

  prazoDoRascunho(rascunho: Rascunho): Date {
    const existente = this.avisos().find(aviso => aviso.id === rascunho.id);

    return existente && this.prazoParaInput(existente.prazo) === rascunho.prazo
      ? existente.prazo
      : new Date(rascunho.prazo ?? '');
  }

  salvarAviso(): void {
    const rascunho = this.rascunho;
    if (!rascunho) return;

    const titulo = (rascunho.titulo ?? '').trim();
    const mensagem = (rascunho.mensagem ?? '').trim();
    const prazo = this.prazoDoRascunho(rascunho);

    if (!titulo || !mensagem || !Number.isFinite(prazo.getTime())) {
      this.erroFormulario = 'Preencha o título, a mensagem e um prazo válido.';
      return;
    }

    const dados = { titulo, mensagem, prazo, obrigatorio: rascunho.obrigatorio };

    if (rascunho.id === null) {
      const novo = { ...dados, id: this.proximoId++, lido: false };
      this.atualizarAvisos([novo, ...this.avisos()]);
    } else {
      this.atualizarAvisos(this.avisos().map(aviso =>
        aviso.id === rascunho.id ? { ...aviso, ...dados } : aviso,
      ));
    }

    this.fecharFormulario();
  }

  alternarLeitura(id: number): void {
    this.atualizarAvisos(this.avisos().map(aviso =>
      aviso.id === id ? { ...aviso, lido: !aviso.lido } : aviso,
    ));
  }

  marcarTodosComoLidos(): void {
    this.atualizarAvisos(this.avisos().map(aviso => ({ ...aviso, lido: true })));
  }

  async excluirAviso(id: number): Promise<void> {
    if (await this.confirmarExclusao('Excluir este aviso?')) {
      this.atualizarAvisos(this.avisos().filter(aviso => aviso.id !== id));
    }
  }

  async limparLidos(): Promise<void> {
    if (await this.confirmarExclusao('Limpar os avisos lidos?')) {
      this.atualizarAvisos(this.avisos().filter(aviso => !aviso.lido));
    }
  }

  private async confirmarExclusao(titulo: string): Promise<boolean> {
    const alerta = await this.alertas.create({
      header: titulo,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Excluir', role: 'confirm' },
      ],
    });
    await alerta.present();
    const { role } = await alerta.onDidDismiss();
    return role === 'confirm';
  }

  private prazoParaInput(prazo: Date): string {
    if (!Number.isFinite(prazo.getTime())) return '';

    const horarioLocal = prazo.getTime() - prazo.getTimezoneOffset() * 60_000;
    return new Date(horarioLocal).toISOString().slice(0, 16);
  }

  private atualizarAvisos(avisos: Aviso[]): void {
    this.gravarAvisos(avisos);
    this.avisos.set(avisos);
    this.agora.set(new Date());
  }

  private gravarAvisos(avisos: Aviso[]): void {
    try {
      localStorage.setItem(CHAVE_AVISOS, JSON.stringify(avisos));
      this.falhaAoSalvar = false;
    } catch {
      this.falhaAoSalvar = true;
    }
  }

  private carregarAvisos(): Aviso[] {
    try {
      const salvo = localStorage.getItem(CHAVE_AVISOS);

      if (salvo !== null) {
        const registros = JSON.parse(salvo) as AvisoSalvo[];

        return registros
          .filter(aviso =>
            Number.isSafeInteger(aviso?.id) &&
            typeof aviso.titulo === 'string' &&
            typeof aviso.mensagem === 'string',
          )
          .map(aviso => ({
            ...aviso,
            prazo: new Date(aviso.prazo ?? NaN),
            obrigatorio: aviso.obrigatorio === true,
            lido: aviso.lido === true,
          }));
      }
    } catch {
      // A lista de exemplo permite abrir a tela se o armazenamento falhar.
    }

    const avisos = this.criarExemplos();
    this.gravarAvisos(avisos);
    return avisos;
  }

  private criarExemplos(): Aviso[] {
    const exemplo = (
      id: number,
      titulo: string,
      mensagem: string,
      horas: number,
      obrigatorio: boolean,
    ): Aviso => ({
      id,
      titulo,
      mensagem,
      prazo: new Date(this.agora().getTime() + horas * HORA_MS),
      obrigatorio,
      lido: false,
    });

    return [
      exemplo(1, 'Confirme sua presença', 'Confirme sua vaga no treino de hoje.', 2, true),
      exemplo(2, 'Atualize seu cadastro', 'Revise seus dados antes da próxima aula.', 48, true),
      exemplo(3, 'Nova turma de alongamento', 'As inscrições estão abertas.', 6, false),
      exemplo(4, 'Inscrição no desafio', 'O prazo de inscrição terminou.', -1, true),
    ];
  }
}