import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[appDestaqueAviso]',
  standalone: true,
  host: {
    '[style.border-inline-start]': 'borda',
  },
})
export class DestaqueAvisoDirective {
  @Input() appDestaqueAviso = '';

  get borda(): string | null {
    if (this.appDestaqueAviso === 'Urgente') {
      return '4px solid var(--ion-color-danger, #b42318)';
    }

    if (this.appDestaqueAviso === 'Atenção') {
      return '4px solid var(--ion-color-warning, #a15c00)';
    }

    return null;
  }
}