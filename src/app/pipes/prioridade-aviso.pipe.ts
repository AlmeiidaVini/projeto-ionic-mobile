import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'prioridadeAviso',
  standalone: true,
})
export class PrioridadeAvisoPipe implements PipeTransform {
  transform(
    aviso: { prazo?: Date | null; obrigatorio?: boolean | null } | null | undefined,
    agora?: Date | null,
  ): string {
    const prazo = aviso?.prazo;
    const obrigatorio = aviso?.obrigatorio;

    if (
      !(prazo instanceof Date) ||
      !(agora instanceof Date) ||
      typeof obrigatorio !== 'boolean'
    ) {
      return 'Sem prioridade';
    }

    const restantesMs = prazo.getTime() - agora.getTime();
    const limiteMs = 24 * 60 * 60 * 1000;

    if (!Number.isFinite(restantesMs)) {
      return 'Sem prioridade';
    }

    if (restantesMs <= 0) {
      return 'Encerrado';
    }

    if (obrigatorio) {
      return restantesMs <= limiteMs ? 'Urgente' : 'Atenção';
    }

    return 'Informativo';
  }
}