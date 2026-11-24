
import { Pipe, PipeTransform } from '@angular/core';

interface Plano {
  bloqueado: boolean;
  vencimento: string | Date;
  sessoesRestantes: number;
}

@Pipe({
  name: 'situacaoPlano',
  standalone: true,
})
export class SituacaoPlanoPipe implements PipeTransform {

  transform(
    plano: Plano | null | undefined,
    agora: Date = new Date()
  ): string {

    if (!plano) {
      return 'Situação não disponível';
    }

    if (plano.bloqueado === true) {
      return 'Plano bloqueado';
    }

    const vencimento = new Date(plano.vencimento);

    if (
      typeof plano.bloqueado !== 'boolean' ||
      Number.isNaN(vencimento.getTime()) ||
      !(agora instanceof Date) ||
      Number.isNaN(agora.getTime()) ||
      typeof plano.sessoesRestantes !== 'number' ||
      !Number.isFinite(plano.sessoesRestantes)
    ) {
      return 'Situação não disponível';
    }

    if (vencimento < agora) {
      return 'Plano vencido';
    }

    if (plano.sessoesRestantes <= 0) {
      return 'Sem sessões disponíveis';
    }

    return 'Plano ativo';
  }
}
