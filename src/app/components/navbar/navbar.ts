import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  @Output() menuToggle = new EventEmitter<void>();

  searchQuery = '';

  onMenuToggle() {
    this.menuToggle.emit();
  }

  onSearch(event: Event) {
    this.searchQuery = (event.target as HTMLInputElement).value;
  }
}
