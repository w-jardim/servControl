import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'status',
  standalone: true
})
export class StatusPipe implements PipeTransform {
  transform(value: string, context?: 'plantao' | 'troca' | 'financeiro' | 'usuario'): string {
    if (!value) return '';

    const statusLabels: { [key: string]: { [key: string]: string } } = {
      plantao: {
        'ativo': 'Ativo',
        'cancelado': 'Cancelado',
        'concluido': 'Concluído',
        'pendente': 'Pendente',
        'em-andamento': 'Em Andamento',
        'agendado': 'Agendado'
      },
      troca: {
        'pendente': 'Pendente',
        'aceita': 'Aceita',
        'rejeitada': 'Rejeitada',
        'cancelada': 'Cancelada',
        'expirada': 'Expirada',
        'concluida': 'Concluída'
      },
      financeiro: {
        'pendente': 'Pendente',
        'pago': 'Pago',
        'cancelado': 'Cancelado',
        'em-processamento': 'Em Processamento',
        'falhou': 'Falhou',
        'reembolsado': 'Reembolsado',
        'atrasado': 'Atrasado'
      },
      usuario: {
        'ativo': 'Ativo',
        'inativo': 'Inativo',
        'bloqueado': 'Bloqueado',
        'pendente': 'Pendente Aprovação',
        'suspenso': 'Suspenso',
        'verificado': 'Verificado',
        'nao-verificado': 'Não Verificado'
      }
    };

    // Se um contexto específico foi fornecido, use-o
    if (context && statusLabels[context] && statusLabels[context][value]) {
      return statusLabels[context][value];
    }

    // Caso contrário, procure em todos os contextos
    for (const contextKey in statusLabels) {
      if (statusLabels[contextKey][value]) {
        return statusLabels[contextKey][value];
      }
    }

    // Fallback: capitalizar a primeira letra
    return value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, ' ');
  }
}

@Pipe({
  name: 'priority',
  standalone: true
})
export class PriorityPipe implements PipeTransform {
  transform(value: string | number): string {
    if (value === null || value === undefined) return '';

    const priorityLabels: { [key: string]: string } = {
      '1': 'Baixa',
      '2': 'Normal',
      '3': 'Alta',
      '4': 'Urgente',
      '5': 'Crítica',
      'low': 'Baixa',
      'normal': 'Normal',
      'medium': 'Média',
      'high': 'Alta',
      'urgent': 'Urgente',
      'critical': 'Crítica',
      'baixa': 'Baixa',
      'media': 'Média',
      'alta': 'Alta',
      'urgente': 'Urgente',
      'critica': 'Crítica'
    };

    const key = value.toString().toLowerCase();
    return priorityLabels[key] || value.toString();
  }
}

@Pipe({
  name: 'role',
  standalone: true
})
export class RolePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    const roleLabels: { [key: string]: string } = {
      'admin': 'Administrador',
      'administrator': 'Administrador',
      'medico': 'Médico',
      'doctor': 'Médico',
      'coordenador': 'Coordenador',
      'coordinator': 'Coordenador',
      'enfermeiro': 'Enfermeiro',
      'nurse': 'Enfermeiro',
      'tecnico': 'Técnico',
      'technician': 'Técnico',
      'recepcionista': 'Recepcionista',
      'receptionist': 'Recepcionista',
      'user': 'Usuário',
      'usuario': 'Usuário',
      'guest': 'Convidado',
      'convidado': 'Convidado'
    };

    const key = value.toLowerCase();
    return roleLabels[key] || value.charAt(0).toUpperCase() + value.slice(1);
  }
}

@Pipe({
  name: 'specialty',
  standalone: true
})
export class SpecialtyPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    const specialtyLabels: { [key: string]: string } = {
      'cardiologia': 'Cardiologia',
      'neurologia': 'Neurologia',
      'ortopedia': 'Ortopedia',
      'pediatria': 'Pediatria',
      'ginecologia': 'Ginecologia',
      'urologia': 'Urologia',
      'oftalmologia': 'Oftalmologia',
      'dermatologia': 'Dermatologia',
      'psiquiatria': 'Psiquiatria',
      'anestesiologia': 'Anestesiologia',
      'radiologia': 'Radiologia',
      'patologia': 'Patologia',
      'cirurgia-geral': 'Cirurgia Geral',
      'clinica-geral': 'Clínica Geral',
      'emergencia': 'Emergência',
      'uti': 'UTI',
      'pronto-socorro': 'Pronto Socorro'
    };

    const key = value.toLowerCase().replace(/\s+/g, '-');
    return specialtyLabels[key] || value;
  }
}
