import {Component, signal} from '@angular/core';
import {Router} from '@angular/router';
import {Auth} from '../../../services/auth';
import {Note, NoteDTO, NotesService} from '../../../services/notes.service';
import {FormsModule} from '@angular/forms';
import {Sidedrawer} from '../sidedrawer/sidedrawer';
import {Navbar} from '../navbar/navbar';
import {NgTemplateOutlet} from '@angular/common';
import {ViewType} from '../../models/view-type';

@Component({
  selector: 'app-dashboard',
  imports: [
    FormsModule,
    Sidedrawer,
    Navbar,
    NgTemplateOutlet
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  // ── Drawer ────────────────────────────────────────────────────────────────
  drawerOpen   = signal(true);
  toggleDrawer() { this.drawerOpen.update(v => !v); }

  // ── Current View ──────────────────────────────────────────────────────────
  currentView: ViewType = 'notes';   // tracks which section user is on

  // ── All notes ─────────────────────────────────────────────────────────────
  allNotes: Note[] = [];

  // ── Composer ──────────────────────────────────────────────────────────────
  isComposing    = signal(false);
  newTitle       = '';
  newDescription = '';
  newColor       = '#ffffff';

  // ── Edit modal ────────────────────────────────────────────────────────────
  isEditing       = signal(false);
  editingNote: Note | null = null;
  editTitle       = '';
  editDescription = '';
  editColor       = '#ffffff';       // ← was missing, caused update issues

  // ── UI state ──────────────────────────────────────────────────────────────
  isLoading    = signal(false);
  errorMessage = signal('');

  // ── Color palette ─────────────────────────────────────────────────────────
  colors = [
    '#ffffff', '#f28b82', '#fbbc04', '#fff475',
    '#ccff90', '#a7ffeb', '#cbf0f8', '#aecbfa',
    '#d7aefb', '#fdcfe8', '#e6c9a8', '#e8eaed'
  ];

  activeColorPicker: number | null = null;

  constructor(
    private notesService: NotesService,
    private authService: Auth,
    private router: Router
  ) {}

  ngOnInit() { this.loadNotes(); }

  // ── Load all notes from API ───────────────────────────────────────────────
  loadNotes() {
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.notesService.getAllNotes().subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.success) {
          this.allNotes = res.data as Note[];
        }
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('Failed to load notes.');
      }
    });
  }

  // ── Side drawer view switching ────────────────────────────────────────────
  setView(view: ViewType) {
    this.currentView = view;
    this.activeColorPicker = null;
  }

  // ── Filtered getters based on currentView ─────────────────────────────────
  get pinnedNotes()   { return this.allNotes.filter(n => n.isPinned && !n.isArchived && !n.isTrashed); }
  get activeNotes()   { return this.allNotes.filter(n => !n.isPinned && !n.isArchived && !n.isTrashed); }
  get archivedNotes() { return this.allNotes.filter(n => n.isArchived && !n.isTrashed); }
  get trashedNotes()  { return this.allNotes.filter(n => n.isTrashed); }

  // current page title
  get viewTitle(): string {
    const titles: Record<ViewType, string> = {
      notes:     '',
      archive:   'Archive',
      trash:     'Trash',
      reminders: 'Reminders'
    };
    return titles[this.currentView];
  }

  // ── Composer ──────────────────────────────────────────────────────────────
  openCompose() { this.isComposing.set(true); }

  closeCompose() {
    if (!this.newTitle.trim() && !this.newDescription.trim()) {
      this.isComposing.set(false);
      return;
    }

    const dto: NoteDTO = {
      title:       this.newTitle.trim(),
      description: this.newDescription.trim(),
      color:       this.newColor,
      isPinned:    false,
      isArchived:  false,
      isTrashed:   false,
    };

    this.notesService.createNote(dto).subscribe({
      next: (res) => {
        if (res.success) {
          this.loadNotes();
          this.newTitle       = '';
          this.newDescription = '';
          this.newColor       = '#ffffff';
          this.isComposing.set(false);
        }
      },
      error: () => { this.errorMessage.set('Failed to create note.'); }
    });
  }

  // ── Edit note — open modal ────────────────────────────────────────────────
  openEdit(note: Note) {
    this.editingNote    = { ...note };   // ← spread to avoid reference mutation
    this.editTitle      = note.title || '';
    this.editDescription = note.description || '';
    this.editColor      = note.color || '#ffffff';
    this.isEditing.set(true);
  }

  // ── Edit note — save ──────────────────────────────────────────────────────
  closeEdit() {
    if (!this.editingNote) return;

    const dto: NoteDTO = {
      title:       this.editTitle.trim(),
      description: this.editDescription.trim(),
      color:       this.editColor,          // ← use editColor not editingNote.color
      isPinned:    this.editingNote.isPinned,
      isArchived:  this.editingNote.isArchived,
      isTrashed:   this.editingNote.isTrashed,
    };

    console.log('Updating note:', this.editingNote.noteId, dto);  // debug

    this.notesService.updateNote(this.editingNote.noteId, dto).subscribe({
      next: (res) => {
        console.log('Update response:', res);  // debug
        if (res.success) {
          this.loadNotes();
          this.isEditing.set(false);
          this.editingNote = null;
        } else {
          this.errorMessage.set(res.message || 'Update failed.');
        }
      },
      error: (err) => {
        console.log('Update error:', err);    // debug
        this.errorMessage.set('Failed to update note.');
      }
    });
  }

  cancelEdit() {
    this.isEditing.set(false);
    this.editingNote = null;
  }

  // ── Pin / Unpin ───────────────────────────────────────────────────────────
  togglePin(note: Note) {
    const dto: NoteDTO = {
      title:       note.title,
      description: note.description,
      color:       note.color,
      isPinned:    !note.isPinned,
      isArchived:  note.isArchived,
      isTrashed:   note.isTrashed,
    };
    this.notesService.updateNote(note.noteId, dto).subscribe({
      next: (res) => { if (res.success) this.loadNotes(); }
    });
  }

  // ── Archive / Unarchive ───────────────────────────────────────────────────
  toggleArchive(note: Note) {
    const call = note.isArchived
      ? this.notesService.unarchiveNote(note.noteId)
      : this.notesService.archiveNote(note.noteId);
    call.subscribe({
      next: (res) => { if (res.success) this.loadNotes(); }
    });
  }

  // ── Trash ─────────────────────────────────────────────────────────────────
  trashNote(note: Note) {
    this.notesService.trashNote(note.noteId).subscribe({
      next: (res) => { if (res.success) this.loadNotes(); }
    });
  }

  // ── Recover from trash ────────────────────────────────────────────────────
  recoverNote(note: Note) {
    this.notesService.recoverNote(note.noteId).subscribe({
      next: (res) => { if (res.success) this.loadNotes(); }
    });
  }

  // ── Delete permanently ────────────────────────────────────────────────────
  deleteNote(note: Note) {
    this.notesService.deleteNote(note.noteId).subscribe({
      next: (res) => { if (res.success) this.loadNotes(); }
    });
  }

  // ── Color change ──────────────────────────────────────────────────────────
  changeColor(note: Note, color: string) {
    const dto: NoteDTO = {
      title:       note.title,
      description: note.description,
      color:       color,
      isPinned:    note.isPinned,
      isArchived:  note.isArchived,
      isTrashed:   note.isTrashed,
    };
    this.notesService.updateNote(note.noteId, dto).subscribe({
      next: (res) => {
        if (res.success) {
          this.activeColorPicker = null;
          this.loadNotes();
        }
      }
    });
  }

  toggleColorPicker(noteId: number) {
    this.activeColorPicker = this.activeColorPicker === noteId ? null : noteId;
  }

  // ── Logout ────────────────────────────────────────────────────────────────
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
