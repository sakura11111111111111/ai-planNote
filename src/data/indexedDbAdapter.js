import Dexie from 'dexie';

// Create database
const db = new Dexie('ReviewNotesDB');

// Define schema
db.version(1).stores({
  notes: 'id, title, nextReviewDate'
});

/**
 * Save or update a note
 * @param {Object} note - The note object to save
 * @returns {Promise<string>} The note ID
 */
export async function saveNote(note) {
  return await db.notes.put(note);
}

/**
 * Get all notes
 * @returns {Promise<Array>} Array of all notes
 */
export async function getAllNotes() {
  return await db.notes.toArray();
}

/**
 * Get a note by ID
 * @param {string} id - The note ID
 * @returns {Promise<Object|undefined>} The note object or undefined
 */
export async function getNoteById(id) {
  return await db.notes.get(id);
}

/**
 * Delete a note by ID
 * @param {string} id - The note ID
 * @returns {Promise<void>}
 */
export async function deleteNote(id) {
  return await db.notes.delete(id);
}

/**
 * Get notes that need to be reviewed on or before a specific date
 * @param {string} date - Date in 'YYYY-MM-DD' format
 * @returns {Promise<Array>} Array of notes for review
 */
export async function getNotesForReview(date) {
  return await db.notes.where('nextReviewDate').belowOrEqual(date).toArray();
}

export default db;
