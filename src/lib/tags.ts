
// Farge per standard-tag. Egendefinerte tagger faller tilbake på CUSTOM_TAG_COLOR
// for nå; senere kan denne fallbacken byttes ut med en auto-generert farge.
const STANDARD_TAG_COLORS: Record<string, string> = {
    Reisebrev: "#c0563b",
    Hverdag: "#3b6fc0",
    Akademisk: "#2e7d4f",
    Tøys: "#a8417f",
    Fylla: "#9c5d1f",
};
const CUSTOM_TAG_COLOR = "#6b7280";



export const STANDARD_TAGS = Object.keys(STANDARD_TAG_COLORS);
// Standard-tagger får sin definerte farge; egendefinerte faller tilbake på CUSTOM_TAG_COLOR.
export const getTagColor = (tag: string) => STANDARD_TAG_COLORS[tag] ?? CUSTOM_TAG_COLOR;
