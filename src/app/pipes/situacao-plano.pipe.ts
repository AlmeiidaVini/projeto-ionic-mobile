
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

    // 1. Verifica se o plano está bloqueado.
    if (plano.bloqueado === true) {
      return 'Plano bloqueado';
    }

    // 2. Verifica se os dados são válidos.
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

    // 3. Verifica se o plano está vencido.
    if (vencimento < agora) {
      return 'Plano vencido';
    }

    // 4. Verifica se ainda existem sessões.
    if (plano.sessoesRestantes <= 0) {
      return 'Sem sessões disponíveis';
    }

    // 5. Se nenhuma condição anterior for encontrada.
    return 'Plano ativo';
  }
}
