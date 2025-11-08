import { defineStore } from 'pinia';
import { 
  saveNote, 
  getAllNotes, 
  getNoteById, 
  deleteNote as deleteNoteFromDb,
  getNotesForReview 
} from '../data/indexedDbAdapter.js';
import { generateSummaryForNote } from '../services/aiService.js';
import { calculateNextReview } from '../services/reviewService.js';

export const useNoteStore = defineStore('notes', {
  state: () => ({
    notes: [],
    currentNote: null,
    isLoading: false
  }),

  getters: {
    /**
     * Get notes that need review today
     */
    todayReviewNotes: (state) => {
      const today = new Date().toISOString().split('T')[0];
      return state.notes.filter(note => note.nextReviewDate <= today);
    },

    /**
     * Get total note count
     */
    totalNotes: (state) => state.notes.length
  },

  actions: {
    /**
     * Fetch all notes from database
     */
    async fetchNotes() {
      this.isLoading = true;
      try {
        this.notes = await getAllNotes();
      } catch (error) {
        console.error('Failed to fetch notes:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Create a new note
     * @param {Object} noteData - The note data {title, content}
     */
    async createNote(noteData) {
      this.isLoading = true;
      try {
        const today = new Date().toISOString().split('T')[0];
        
        const note = {
          id: `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          title: noteData.title,
          content: noteData.content,
          aiSummary: null,
          nextReviewDate: today,
          interval: 1,
          repetitions: 0,
          easeFactor: 2.5,
          createdAt: new Date().toISOString()
        };

        // Save note first
        await saveNote(note);
        this.notes.push(note);

        // Generate AI summary asynchronously
        this.generateAISummary(note.id, noteData.content);

        return note;
      } catch (error) {
        console.error('Failed to create note:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Update an existing note
     * @param {Object} noteData - The updated note data
     */
    async updateNote(noteData) {
      this.isLoading = true;
      try {
        await saveNote(noteData);
        
        const index = this.notes.findIndex(n => n.id === noteData.id);
        if (index !== -1) {
          this.notes[index] = noteData;
        }

        // Regenerate AI summary if content changed
        if (noteData.content) {
          this.generateAISummary(noteData.id, noteData.content);
        }

        return noteData;
      } catch (error) {
        console.error('Failed to update note:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Delete a note
     * @param {string} id - The note ID
     */
    async deleteNote(id) {
      this.isLoading = true;
      try {
        await deleteNoteFromDb(id);
        this.notes = this.notes.filter(n => n.id !== id);
      } catch (error) {
        console.error('Failed to delete note:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Submit a review for a note
     * @param {string} noteId - The note ID
     * @param {string} quality - 'failed', 'hard', or 'good'
     */
    async submitReview(noteId, quality) {
      this.isLoading = true;
      try {
        const note = await getNoteById(noteId);
        if (!note) {
          throw new Error('Note not found');
        }

        const updatedNote = calculateNextReview(note, quality);
        await saveNote(updatedNote);

        const index = this.notes.findIndex(n => n.id === noteId);
        if (index !== -1) {
          this.notes[index] = updatedNote;
        }

        return updatedNote;
      } catch (error) {
        console.error('Failed to submit review:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Generate AI summary for a note (async, doesn't block)
     * @param {string} noteId - The note ID
     * @param {string} content - The note content
     */
    async generateAISummary(noteId, content) {
      try {
        const summary = await generateSummaryForNote(content);
        
        const note = await getNoteById(noteId);
        if (note) {
          note.aiSummary = summary;
          await saveNote(note);
          
          const index = this.notes.findIndex(n => n.id === noteId);
          if (index !== -1) {
            this.notes[index] = note;
          }
        }
      } catch (error) {
        console.error('Failed to generate AI summary:', error);
        // Don't throw error, just log it
      }
    },

    /**
     * Load a specific note by ID
     * @param {string} id - The note ID
     */
    async loadNote(id) {
      this.isLoading = true;
      try {
        this.currentNote = await getNoteById(id);
        return this.currentNote;
      } catch (error) {
        console.error('Failed to load note:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    }
  }
});
