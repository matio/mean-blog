import {
  Component,
  OnDestroy,
  Input,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


import { Constant } from '../../shared/constant';
import { MARKDOWN_HEADER_CLASS } from '../../shared/services';


import { TocService } from '../shared/toc.service';
import { ScrollService } from '../shared/scroll.service';

@Component({
  selector: 'app-article-toc',
  templateUrl: './article-toc.component.html',
  styleUrls: ['./article-toc.component.scss'],
})
export class ArticleTocComponent implements OnInit, OnDestroy {
  private Constant = Constant;

  @Input() toc: string;
  @Input() title: string;
  @Input() baseUrl: string;
  public activeIndex: number | null = null;
  private onDestroy = new Subject();

  constructor(
    private route: ActivatedRoute,
    private tocService: TocService,
    public scrollService: ScrollService,
  ) {
  }


  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.tocService.reset();
    this.onDestroy.next();
  }


  /**
   * マークダウン初期化時にハッシュタグで指定したｈタグまでスクロールする.
   * 目次のハイライトを設定する.
   */
  private init(): void {
        const _headings = document.querySelectorAll('.' + MARKDOWN_HEADER_CLASS);
        const skipNoTocHeadings = (heading: HTMLHeadingElement) => !/(?:no-toc|notoc)/i.test(heading.className);
        const headings = Array.prototype.filter.call(_headings, skipNoTocHeadings);
        this.tocService.genToc(headings);

        if (window.location.hash) {
          // 一旦指定したタイトルにスクロールしてから
          // スクロールイベントを開始する
          let isFirst = true;
          this.route.fragment
            .pipe(takeUntil(this.onDestroy))
            .subscribe((fragment: string) => {
              this.scrollToAnchor(fragment);
              if (isFirst) {
                isFirst = false;
                this.tocService.activeItemIndex
                  .pipe(takeUntil(this.onDestroy))
                  .subscribe(index => {
                    this.activeIndex = index;
                  });
              }
            });
        } else {
          // ハッシュタグがある場合は一度指定したタイトルにスクロールしてから
          // スクロールの監視を開始する

          // リロード前にスクロールしている場合
          // 明示的に初期化する
          this.scrollService.scrollToTop();
          this.tocService.activeItemIndex
            .pipe(takeUntil(this.onDestroy))
            .subscribe(index => {
              this.activeIndex = index;
            });

          this.route.fragment
            .pipe(takeUntil(this.onDestroy))
            .subscribe((fragment: string) => {
              this.scrollToAnchor(fragment);
            });
        }
  }


  calcMarginOfTitle(level: number): number {
    return level * this.Constant.TOC_INDENT_INTERVAL;
  }


  private scrollToAnchor(elementId: string): void {
    const element: any = document.querySelector('#' + elementId);
    if (!element) {
      return;
    }

    const scrollContainer = document.getElementsByTagName('html')[0];
    setTimeout(function() {
      element.classList.remove('highlighted');
      setTimeout(function() {
        // 少し下にずらす
        scrollContainer.scrollTop = element.offsetTop - 10;
        element.classList.add('highlighted');
      }, 0);
    }, 0);
  }
}
