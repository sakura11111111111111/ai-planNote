import { fetchSummaryFromAI } from '../data/aiApiAdapter.js';

/**
 * Generate an AI summary for a note's content
 * @param {string} noteContent - The HTML content of the note
 * @returns {Promise<string>} The AI-generated summary
 */
export async function generateSummaryForNote(noteContent) {
  try {
    // Strip HTML tags for better AI processing
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = noteContent;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';

    if (!textContent.trim()) {
      throw new Error('Note content is empty');
    }

    const summary = await fetchSummaryFromAI(textContent);
    return summary;
  } catch (error) {
    console.error('Failed to generate AI summary:', error);
    throw error;
  }
}
