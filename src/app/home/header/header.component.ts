import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
@ViewChild('search') searchField!: ElementRef;

focusInputField(): void {
  this.searchField.nativeElement.focus();
}
}
