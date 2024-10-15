/**
 * Trim mention title.
 *
 * @param {string} title - The title of the mention.
 * @returns {string} - The trimmed title.
 */
export default function trimMentionTitle( title: string ): string {
  return title.length > 20 ? title.substring( 0, 30 ) + '...' : title;
}
