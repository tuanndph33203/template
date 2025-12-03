import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberToVietnamese',
  standalone: true
})
export class NumberToVietnamesePipe implements PipeTransform {
  private readonly numberText = [
    'không', 'một', 'hai', 'ba', 'bốn',
    'năm', 'sáu', 'bảy', 'tám', 'chín'
  ];

  private readonly units = ['', 'nghìn', 'triệu', 'tỷ', 'nghìn tỷ', 'triệu tỷ'];

  private readThreeDigits(num: number): string {
    const hundred = Math.floor(num / 100);
    const ten = Math.floor((num % 100) / 10);
    const unit = num % 10;
    let result = '';

    if (hundred > 0) {
      result += this.numberText[hundred] + ' trăm';
      if (ten === 0 && unit > 0) result += ' lẻ';
    }

    if (ten > 1) {
      result += ' ' + this.numberText[ten] + ' mươi';
      if (unit === 1) result += ' mốt';
      else if (unit === 5) result += ' lăm';
      else if (unit > 0) result += ' ' + this.numberText[unit];
    } else if (ten === 1) {
      result += ' mười';
      if (unit === 1) result += ' một';
      else if (unit === 5) result += ' lăm';
      else if (unit > 0) result += ' ' + this.numberText[unit];
    } else if (ten === 0 && hundred === 0 && unit > 0) {
      result += this.numberText[unit];
    } else if (unit > 0) {
      result += ' ' + this.numberText[unit];
    }

    return result.trim();
  }

  transform(value: number | string | null | undefined): string {
    if (value == null) return '';
    let num = Number(value);
    if (isNaN(num) || num < 0) return '';

    if (num === 0) return 'Không';

    let result = '';
    let group = 0;

    while (num > 0) {
      const block = num % 1000;

      if (block !== 0) {
        const blockText = this.readThreeDigits(block);
        const unitText = this.units[group];

        result = `${blockText} ${unitText} ${result}`.trim();
      }

      num = Math.floor(num / 1000);
      group++;
    }

    return result.charAt(0).toUpperCase() + result.slice(1);
  }
}
