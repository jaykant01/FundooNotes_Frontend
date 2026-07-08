import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgForOf} from '@angular/common';
import {ViewType} from '../../models/view-type';

export interface NavItem {
  label: string;
  icon: string;   // SVG path string
  route: string;
}

@Component({
  selector: 'app-sidedrawer',
  imports: [
  ],
  templateUrl: './sidedrawer.html',
  styleUrl: './sidedrawer.scss',
})
export class Sidedrawer {
  @Input()  isOpen   = true;
  @Output() viewChange = new EventEmitter<ViewType>();  // ← emit view

  activeRoute: ViewType = 'notes';

  navItems = [
    { label: 'Notes',       route: 'notes'     as ViewType, icon: 'M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z' },
    { label: 'Reminders',   route: 'reminders' as ViewType, icon: 'M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z' },
    { label: 'Edit labels', route: 'notes'     as ViewType, icon: 'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z' },
    { label: 'Archive',     route: 'archive'   as ViewType, icon: 'M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM12 17.5L6.5 12H10v-2h4v2h3.5L12 17.5zM5.12 5l.81-1h12l.94 1H5.12z' },
    { label: 'Trash',       route: 'trash'     as ViewType, icon: 'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z' },
  ];

  setActive(route: ViewType) {
    this.activeRoute = route;
    this.viewChange.emit(route);   // ← tell dashboard which view
  }
}
