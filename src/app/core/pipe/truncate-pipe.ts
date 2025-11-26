import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number | undefined): string {
    if (!limit) {
      return value;
    }
    return value.length < limit ? value : value.slice(0, limit) + '...';
  }
}
