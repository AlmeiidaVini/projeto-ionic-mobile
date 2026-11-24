import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlunoService {
  private readonly chavePerfil = 'ritmo-fit.aluno';

  nome = 'Anita Gallindo';
  email = 'anita@email.com';

  mediaSemanal = 3.456;

  plano = {
    bloqueado: false,
    vencimento: new Date('2026-12-30T23:59:59'),
    sessoesRestantes: 8
  };

  constructor() {
    this.carregarPerfil();
  }

  atualizarPerfil(nome: string, email: string): boolean {
    this.nome = nome.trim();
    this.email = email.trim();

    try {
      localStorage.setItem(
        this.chavePerfil,
        JSON.stringify({
          nome: this.nome,
          email: this.email
        })
      );

      return true;
    } catch {
      return false;
    }
  }

  private carregarPerfil(): void {
    try {
      const salvo = localStorage.getItem(this.chavePerfil);

      if (!salvo) {
        return;
      }

      const dados = JSON.parse(salvo);

      if (
        typeof dados?.nome === 'string' &&
        dados.nome.trim() &&
        typeof dados?.email === 'string' &&
        dados.email.trim()
      ) {
        this.nome = dados.nome.trim();
        this.email = dados.email.trim();
      }
    } catch {
      // Usa os dados de exemplo se a leitura falhar.
    }
  }
}