
import { Component } from '@angular/core';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';

import { DatePipe } from '@angular/common';

import { SituacaoPlanoPipe } from '../../pipes/situacao-plano.pipe';

import { DestaquePlanoDirective } from '../../directives/destaque-plano.directive';

@Component({
  selector: 'app-perfil',
  standalone: true,

  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    DatePipe,
    SituacaoPlanoPipe,
    DestaquePlanoDirective
  ],

  templateUrl: './perfil.page.html',
})
export class PerfilPage {

  nomeAluno = 'Anita Gallindo';

  emailAluno = 'anita@email.com';

  agora = new Date();

 plano = {
  bloqueado: false,
  vencimento: new Date('2026-12-30T23:59:59'),
  sessoesRestantes: 8
}; 

}
