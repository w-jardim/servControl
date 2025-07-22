import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customCurrency',
  standalone: true
})
export class CurrencyPipe implements PipeTransform {
  transform(
    value: number | string, 
    currency: string = 'BRL',
    display: 'symbol' | 'code' | 'name' = 'symbol',
    digitsInfo: string = '1.2-2'
  ): string {
    if (value === null || value === undefined || value === '') return '';

    const numericValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numericValue)) return '';

    const [integerDigits, fractionDigits] = digitsInfo.split('.');
    const [minFraction, maxFraction] = fractionDigits.split('-');

    const options: Intl.NumberFormatOptions = {
      style: 'currency',
      currency: currency,
      currencyDisplay: display,
      minimumFractionDigits: parseInt(minFraction, 10),
      maximumFractionDigits: parseInt(maxFraction, 10)
    };

    // Define locale based on currency
    let locale = 'pt-BR';
    switch (currency) {
      case 'USD':
        locale = 'en-US';
        break;
      case 'EUR':
        locale = 'de-DE';
        break;
      case 'BRL':
      default:
        locale = 'pt-BR';
        break;
    }

    try {
      return new Intl.NumberFormat(locale, options).format(numericValue);
    } catch (error) {
      // Fallback for older browsers or unsupported currencies
      return this.fallbackFormat(numericValue, currency, display);
    }
  }

  private fallbackFormat(value: number, currency: string, display: string): string {
    const symbols: { [key: string]: string } = {
      'BRL': 'R$',
      'USD': '$',
      'EUR': '€'
    };

    const symbol = display === 'code' ? currency : (symbols[currency] || currency);
    const formatted = value.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    
    return currency === 'BRL' ? `${symbol} ${formatted}` : `${symbol}${formatted}`;
  }
}

@Pipe({
  name: 'percentage',
  standalone: true
})
export class PercentagePipe implements PipeTransform {
  transform(value: number | string, digitsInfo: string = '1.0-2'): string {
    if (value === null || value === undefined || value === '') return '';

    const numericValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numericValue)) return '';

    const [integerDigits, fractionDigits] = digitsInfo.split('.');
    const [minFraction, maxFraction] = fractionDigits.split('-');

    const options: Intl.NumberFormatOptions = {
      style: 'percent',
      minimumFractionDigits: parseInt(minFraction, 10),
      maximumFractionDigits: parseInt(maxFraction, 10)
    };

    try {
      return new Intl.NumberFormat('pt-BR', options).format(numericValue);
    } catch (error) {
      return `${(numericValue * 100).toFixed(parseInt(maxFraction, 10))}%`;
    }
  }
}

@Pipe({
  name: 'number',
  standalone: true
})
export class NumberPipe implements PipeTransform {
  transform(value: number | string, digitsInfo: string = '1.0-3'): string {
    if (value === null || value === undefined || value === '') return '';

    const numericValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numericValue)) return '';

    const [integerDigits, fractionDigits] = digitsInfo.split('.');
    const [minFraction, maxFraction] = fractionDigits.split('-');

    const options: Intl.NumberFormatOptions = {
      minimumFractionDigits: parseInt(minFraction, 10),
      maximumFractionDigits: parseInt(maxFraction, 10)
    };

    try {
      return new Intl.NumberFormat('pt-BR', options).format(numericValue);
    } catch (error) {
      return numericValue.toFixed(parseInt(maxFraction, 10));
    }
  }
}
