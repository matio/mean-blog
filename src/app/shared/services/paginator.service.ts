import { MatPaginatorIntl } from '@angular/material';


export class PaginatorService extends MatPaginatorIntl {
  itemsPerPageLabel = '';
  nextPageLabel     = '次ページ';
  previousPageLabel = '前ページ';

  getRangeLabel = (pageIndex, pageSize, length): string => {
    if (length === 0 || pageSize === 0) {
      return '0 / ' + length;
    }

    return length + ' 件　　　' + (pageIndex + 1) + ' / ' + Math.ceil(length / pageSize) + 'ページ目';
  }

  calcRange(pageIndex, pageSize, length): {startIndex: number, endIndex: number} {
    length = Math.max(length, 0);
    const startIndex = pageIndex * pageSize;
    const endIndex = startIndex < length
      ? Math.min(startIndex + pageSize, length)
      : startIndex + pageSize;

    return {
      startIndex,
      endIndex,
    };
  }
}
