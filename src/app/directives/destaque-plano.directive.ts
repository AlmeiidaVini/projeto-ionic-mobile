
import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[appDestaquePlano]',
  standalone: true,
})
export class DestaquePlanoDirective {

  @Input() appDestaquePlano = '';

  @HostBinding('style.backgroundColor')
  get corFundo(): string {
    switch (this.appDestaquePlano) {
      case 'Plano ativo':
        return '#e4f5e9';

      case 'Plano vencido':
        return '#fff0dc';

      case 'Plano bloqueado':
        return '#fde5e5';

      case 'Sem sessões disponíveis':
        return '#fff0dc';

      default:
        return '#eeeeee';
    }
  }

  @HostBinding('style.color')
  get corTexto(): string {
    switch (this.appDestaquePlano) {
      case 'Plano ativo':
        return '#237a42';

      case 'Plano vencido':
      case 'Sem sessões disponíveis':
        return '#a45b13';

      case 'Plano bloqueado':
        return '#b42318';

      default:
        return '#555555';
    }
  }

  @HostBinding('style.borderLeft')
  get borda(): string {
    switch (this.appDestaquePlano) {
      case 'Plano ativo':
        return '5px solid #237a42';

      case 'Plano vencido':
      case 'Sem sessões disponíveis':
        return '5px solid #e59b35';

      case 'Plano bloqueado':
        return '5px solid #b42318';

      default:
        return '5px solid #888888';
    }
  }
}
