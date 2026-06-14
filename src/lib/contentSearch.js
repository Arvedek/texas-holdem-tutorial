export function normalizeQuery(value) {
  return String(value || "").trim().toLowerCase();
}

export function searchableText(parts) {
  return parts.flatMap((part) => Array.isArray(part) ? part : [part])
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function glossaryText(term) {
  return searchableText([
    term.id,
    term.term,
    term.english,
    term.abbreviation,
    term.aliases,
    term.category,
    term.difficulty,
    term.definition,
    term.simple,
    term.example,
    term.misunderstanding,
    term.relatedTerms
  ]);
}

export function chapterText(chapter) {
  return searchableText([
    chapter.id,
    chapter.title,
    chapter.subtitle,
    chapter.difficulty,
    chapter.summary,
    chapter.plainLanguage,
    chapter.goals,
    chapter.prerequisites,
    chapter.sections?.flatMap((section) => [section.heading, section.body, section.keyTakeaway]),
    chapter.examples?.flatMap((example) => [example.title, example.scenario, example.analysis, example.takeaway]),
    chapter.decisionFlow,
    chapter.mistakeDetails?.flatMap((mistake) => [mistake.mistake, mistake.whyItHurts, mistake.betterHabit]),
    chapter.checkpoint,
    chapter.practiceTasks?.flatMap((task) => [task.title, task.body]),
    chapter.relatedTerms
  ]);
}

export function searchContent(query, chapters, terms) {
  const normalized = normalizeQuery(query);
  if (!normalized) {
    return { chapters: [], terms: [] };
  }

  const scoreTerm = (term) => {
    const exactParts = [term.id, term.term, term.english, term.abbreviation, ...(term.aliases || [])]
      .filter(Boolean)
      .map((item) => String(item).toLowerCase());
    if (exactParts.includes(normalized)) return 100;
    if (exactParts.some((item) => item.includes(normalized))) return 80;
    return glossaryText(term).includes(normalized) ? 40 : 0;
  };

  const scoreChapter = (chapter) => {
    const exactParts = [chapter.id, chapter.title, chapter.subtitle]
      .filter(Boolean)
      .map((item) => String(item).toLowerCase());
    if (exactParts.includes(normalized)) return 90;
    if ((chapter.relatedTerms || []).some((termId) => termId.toLowerCase().includes(normalized))) return 70;
    return chapterText(chapter).includes(normalized) ? 30 : 0;
  };

  return {
    terms: terms.map((term) => ({ item: term, score: scoreTerm(term) }))
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score || a.item.term.localeCompare(b.item.term, "zh-CN"))
      .map((result) => result.item),
    chapters: chapters.map((chapter) => ({ item: chapter, score: scoreChapter(chapter) }))
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score || a.item.stage - b.item.stage)
      .map((result) => result.item)
  };
}
