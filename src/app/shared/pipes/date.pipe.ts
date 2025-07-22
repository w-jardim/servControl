import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDate',
  standalone: true
})
export class DatePipe implements PipeTransform {
  transform(value: Date | string | number, format: string = 'dd/MM/yyyy'): string {
    if (!value) return '';

    const date = new Date(value);
    if (isNaN(date.getTime())) return '';

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    const formats: { [key: string]: string } = {
      'dd/MM/yyyy': `${day}/${month}/${year}`,
      'MM/dd/yyyy': `${month}/${day}/${year}`,
      'yyyy-MM-dd': `${year}-${month}-${day}`,
      'dd/MM/yyyy HH:mm': `${day}/${month}/${year} ${hours}:${minutes}`,
      'dd/MM/yyyy HH:mm:ss': `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`,
      'HH:mm': `${hours}:${minutes}`,
      'HH:mm:ss': `${hours}:${minutes}:${seconds}`,
      'relative': this.getRelativeTime(date),
      'short': this.getShortDate(date),
      'long': this.getLongDate(date)
    };

    return formats[format] || formats['dd/MM/yyyy'];
  }

  private getRelativeTime(date: Date): string {
    const now = new Date();
    const diffInMilliseconds = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) {
      return 'Agora';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''} atrás`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hora${diffInHours > 1 ? 's' : ''} atrás`;
    } else if (diffInDays < 7) {
      return `${diffInDays} dia${diffInDays > 1 ? 's' : ''} atrás`;
    } else {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
  }

  private getShortDate(date: Date): string {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    if (date.toDateString() === today.toDateString()) {
      return `Hoje ${hours}:${minutes}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Ontem ${hours}:${minutes}`;
    } else {
      return `${day}/${month} ${hours}:${minutes}`;
    }
  }

  private getLongDate(date: Date): string {
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    const weekdays = [
      'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
      'Quinta-feira', 'Sexta-feira', 'Sábado'
    ];

    const weekday = weekdays[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${weekday}, ${day} de ${month} de ${year} às ${hours}:${minutes}`;
  }
}
