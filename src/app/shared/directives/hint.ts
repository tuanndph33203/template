// import {
//     Directive,
//     Input,
//     ElementRef,
//     Renderer2,
//     OnInit,
// } from '@angular/core';
// import { Tooltip } from 'primeng/tooltip';

// @Directive({
//     selector: '[appHint]',
//     standalone: true,
//     providers: [Tooltip]
// })
// export class Hint implements OnInit {
//     @Input('appHint') text = '';

//     constructor(
//         private el: ElementRef,
//         private renderer: Renderer2,
//         private tooltip: Tooltip
//     ) { }

//     ngOnInit() {
//         const parent = this.el.nativeElement;
//         const wrapper = this.renderer.createElement('div');
//         this.renderer.addClass(wrapper, 'absolute');
//         this.renderer.addClass(wrapper, '-top-1');
//         this.renderer.addClass(wrapper, '-right-3');
//         const icon = this.renderer.createElement('i');
//         this.renderer.addClass(icon, 'pi');
//         this.renderer.addClass(icon, 'pi-question-circle');

//         this.renderer.setStyle(icon, 'font-size', '9px');
//         this.renderer.setStyle(icon, 'color', 'var(--primary-color)');
//         this.renderer.appendChild(wrapper, icon);
//         this.renderer.appendChild(parent, wrapper);
//         this.tooltip.tooltipEvent = 'hover';
//         this.tooltip.content = this.text;
//         this.tooltip.target = icon;
//         this.tooltip.ngAfterViewInit();
//     }
// }
