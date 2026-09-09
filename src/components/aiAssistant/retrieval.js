// ─────────────────────────────────────────────────────────────────────────
// Lightweight, dependency-free "retrieval" over PRODUCT_KNOWLEDGE_BASE.
//
// This is a client-side stand-in for RAG's retrieval step: instead of vector
// embeddings + a similarity search (which would need a backend + an LLM call
// to be safe — an API key can't live in frontend JS), it scores every
// knowledge-base entry against the query by token overlap plus phrase
// matches on each entry's keyword list, and returns the best match above a
// minimum confidence bar. Good enough for a fixed, hand-authored knowledge
// base of this size; swap for real embeddings if the KB grows much larger
// or a backend endpoint becomes available.
// ─────────────────────────────────────────────────────────────────────────

const STOPWORDS = new Set([
  "a", "an", "the", "is", "are", "was", "were", "be", "been", "being",
  "do", "does", "did", "have", "has", "had", "i", "you", "he", "she", "it",
  "we", "they", "me", "my", "your", "our", "this", "that", "these", "those",
  "to", "of", "in", "on", "at", "for", "with", "about", "how", "what",
  "when", "where", "why", "which", "who", "can", "could", "should", "would",
  "will", "and", "or", "but", "if", "so", "just", "please", "there", "here",
  "am", "as", "up", "down", "out", "get", "got",
]);

const tokenize = (text = "") =>
  text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token && !STOPWORDS.has(token));

// Cache each entry's token set so repeated queries don't re-tokenize the
// whole knowledge base every keystroke.
const entryTokenCache = new WeakMap();

const getEntryTokens = (entry) => {
  if (entryTokenCache.has(entry)) return entryTokenCache.get(entry);
  const tokens = new Set([
    ...tokenize(entry.question),
    ...entry.keywords.flatMap(tokenize),
  ]);
  entryTokenCache.set(entry, tokens);
  return tokens;
};

/**
 * Scores every entry in `knowledgeBase` against `query` and returns the best
 * match, or null if nothing clears `minScore`.
 */
export function retrieveAnswer(query, knowledgeBase, { minScore = 2 } = {}) {
  const queryTokens = tokenize(query);
  if (!queryTokens.length) return null;

  const lowerQuery = query.toLowerCase();
  let best = null;
  let bestScore = 0;

  for (const entry of knowledgeBase) {
    const entryTokens = getEntryTokens(entry);
    let score = 0;

    queryTokens.forEach((token) => {
      if (entryTokens.has(token)) score += 1;
    });

    // Whole-phrase keyword match is a much stronger signal than loose token
    // overlap (e.g. query "how do i delete a job" containing the keyword
    // phrase "delete job" outright) — weight it accordingly.
    entry.keywords.forEach((keyword) => {
      if (lowerQuery.includes(keyword.toLowerCase())) score += 3;
    });

    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }

  return bestScore >= minScore ? { entry: best, score: bestScore } : null;
}
