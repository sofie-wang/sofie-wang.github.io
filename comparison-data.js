// Historical project analysis only. Unknown evidence is never treated as absence.
export const competitors = [
  { id: 'spark', name: 'Story Spark', image: 'ca-story-spark.webp', positioning: 'Creative storytelling', strength: 'Custom characters and story co-creation', limitation: 'Limited focus on emotional learning', context: 'The original analysis describes unique, personalized stories with custom characters and magical plots, emphasizing imagination and co-creation.' },
  { id: 'moshi', name: 'Moshi Kids', image: 'ca-moshi.webp', positioning: 'Sleep and relaxation', strength: 'Extensive audio content and calming bedtime experiences', limitation: 'Daily emotional reflection is not a central feature', context: 'The original analysis describes a sleep-focused app with calming audio stories and meditations. It identifies a gap in capturing a child’s daily emotional experience.' },
  { id: 'storytime', name: 'StoryTime AI', image: 'ca-storytime.webp', positioning: 'Personalized storytelling', strength: 'Personalized stories and multilingual accessibility', limitation: 'Limited emphasis on emotional reflection and progress tracking', context: 'The original analysis describes personalized literacy and multilingual stories. Its limitations row identifies gaps in feedback, progress tracking, and emotional reflection.' }
];
export const categories = ['All', 'Storytelling', 'Emotional Learning', 'Parent Experience', 'Accessibility'];
export const coverageStates = {
  strong: { label: 'Strong support', symbol: '●' },
  partial: { label: 'Partial support', symbol: '◐' },
  limited: { label: 'Limited support', symbol: '○' },
  unknown: { label: 'Not verified', symbol: '?' }
};
export const dimensions = [
  { id: 'personalization', category: 'Storytelling', label: 'Story personalization', description: 'Adapting stories to a child through custom characters, plots, or personal story elements.', implication: 'Personalization provides a foundation; Moodie Tales explores connecting that foundation to a child’s daily emotional context.' },
  { id: 'participation', category: 'Storytelling', label: 'Creative participation', description: 'Inviting children or caregivers to shape a story through co-creation.', implication: 'Co-creation suggests a way to give families agency in the narrative, rather than only presenting finished content.' },
  { id: 'bedtime', category: 'Storytelling', label: 'Bedtime experience', description: 'Supporting a calming bedtime routine through stories or audio.', implication: 'A familiar bedtime ritual offers a setting for emotional connection; it should remain low-effort and calming.' },
  { id: 'checkins', category: 'Emotional Learning', label: 'Daily emotional check-ins', description: 'Capturing how a child feels and what happened during the day.', implication: 'A lightweight check-in could connect an everyday emotional experience to the story that follows.' },
  { id: 'emotionStories', category: 'Emotional Learning', label: 'Emotion-based storytelling', description: 'Using a child’s emotional experiences as input to a personalized narrative.', implication: 'Moodie Tales explores using emotional context to shape a story; this is an opportunity, not a verified competitor deficiency.' },
  { id: 'reflection', category: 'Emotional Learning', label: 'Emotional reflection', description: 'Helping a child or caregiver revisit and make sense of emotional experiences.', implication: 'Reflection could extend the value of a story beyond the moment of reading.' },
  { id: 'insights', category: 'Parent Experience', label: 'Parent insights', description: 'Helping caregivers interpret a child’s emotional experiences.', implication: 'Caregiver insights should make patterns understandable without adding unnecessary cognitive load.' },
  { id: 'progress', category: 'Parent Experience', label: 'Long-term progress tracking', description: 'Making patterns or development visible across repeated use.', implication: 'Longitudinal reflection is a potential bridge between individual stories and a parent’s broader understanding.' },
  { id: 'recommendations', category: 'Parent Experience', label: 'Actionable recommendations', description: 'Providing relevant, practical guidance that caregivers can act on.', implication: 'A recommendation needs to connect clearly to a family’s context; additional research is needed to understand what feels useful.' },
  { id: 'languages', category: 'Accessibility', label: 'Multilingual support', description: 'Providing story experiences in more than one language.', implication: 'Language accessibility is a relevant consideration for family storytelling, without assuming coverage of specific languages.' },
  { id: 'childInteraction', category: 'Accessibility', label: 'Child-friendly interaction', description: 'Supporting age-appropriate, understandable input and navigation.', implication: 'A children’s product label alone does not establish interaction usability. Age-appropriate input needs direct evaluation.' }
];
// Ratings require dimension-specific statements in the original comparison.
// No partial rating is assigned where the source cannot establish partial coverage.
export const comparisonEvidence = {
  'spark:personalization': { state: 'strong', approach: 'Personalized stories with custom characters and magical plots.', evidence: 'Story Spark / Usability row: unique and personalized stories with custom characters and magical plots.', strength: 'The original analysis explicitly identifies story customization.', limitation: 'It does not document how personalization connects to a child’s daily emotional experience.' },
  'spark:participation': { state: 'strong', approach: 'An emphasis on imagination and creativity, supporting co-creation.', evidence: 'Story Spark / Pros row: imagination, creativity, and co-creation.', strength: 'Creative participation is explicitly described in the research.', limitation: 'The source does not establish emotional-learning outcomes or age-specific usability.' },
  'moshi:bedtime': { state: 'strong', approach: 'Calming audio stories and meditations designed to help children relax.', evidence: 'Moshi Kids / Usability and Pros rows: sleep-focused experiences and a large audio library.', strength: 'A clear focus on calming bedtime content.', limitation: 'The source identifies a gap in capturing the child’s daily emotional experience.' },
  'moshi:checkins': { state: 'limited', approach: 'The original review centers on calming content and identifies daily emotional capture as a gap.', evidence: 'Moshi Kids / Cons row: does not capture the child’s daily emotional experience.', strength: 'The documented calming bedtime context may provide a familiar ritual.', limitation: 'Daily emotional capture is explicitly identified as limited in this historical review.' },
  'storytime:personalization': { state: 'strong', approach: 'Personalized literacy experiences that bring a child’s unique stories to life.', evidence: 'StoryTime AI / Usability row: personalized literacy and a child’s unique stories.', strength: 'Personalized storytelling is central to its documented positioning.', limitation: 'The source does not verify daily emotion-based inputs or parent-guided customization.' },
  'storytime:reflection': { state: 'limited', approach: 'Personalized stories, with emotional reflection identified as a gap in the original review.', evidence: 'StoryTime AI / Cons row: limited emotional reflection, feedback, and progress tracking.', strength: 'Personalized stories provide a narrative experience.', limitation: 'Emotional reflection is explicitly identified as a gap; no follow-up product assessment is documented.' },
  'storytime:progress': { state: 'limited', approach: 'The original analysis identifies progress tracking as a gap alongside personalized storytelling.', evidence: 'StoryTime AI / Cons row: does not provide progress tracking.', strength: 'The source documents personalized storytelling as a foundation.', limitation: 'Long-term progress tracking is identified as limited in the historical analysis.' },
  'storytime:languages': { state: 'strong', approach: 'Support for multiple languages, described as increasing accessibility.', evidence: 'StoryTime AI / Pros row: supports multiple languages.', strength: 'Multilingual support is explicitly documented.', limitation: 'The research does not list supported languages or evaluate translation quality.' }
};
export function getComparison(competitor, dimension) {
  return comparisonEvidence[`${competitor.id}:${dimension.id}`] || {
    state: 'unknown',
    approach: `The source describes ${competitor.positioning.toLowerCase()}, but does not establish coverage of ${dimension.label.toLowerCase()}.`,
    evidence: 'This dimension is not assessed in the original comparison. Missing evidence is not proof of an absent feature.',
    strength: 'No dimension-specific strength can be established from the available research.',
    limitation: 'Evidence is insufficient for a rating. Further product review would be needed.'
  };
}
