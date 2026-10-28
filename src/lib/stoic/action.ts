type ActionRead = {
  slug: string;
  title: string;
  author: string;
};

export type ActionPath = {
  id: string;
  title: string;
  line: string;
  reads: ActionRead[];
};

export type WeeklyRep = {
  title: string;
  body: string;
  read: ActionRead;
};

export const PATHS: ActionPath[] = [
  {
    id: "mind",
    title: "A racing mind",
    line: "Come back to what is actually yours.",
    reads: [
      { slug: "enchiridion-1-10", title: "Maxims 1–10", author: "Epictetus, Enchiridion" },
      {
        slug: "discourses-1-what-is-in-our-power",
        title: "What is in our power",
        author: "Epictetus, Discourses",
      },
      { slug: "peace-1", title: "The complaint", author: "Seneca, On Peace of Mind" },
    ],
  },
  {
    id: "pressure",
    title: "Under pressure",
    line: "Catch the reaction before it chooses for you.",
    reads: [
      { slug: "anger-1-what", title: "What anger is", author: "Seneca, On Anger" },
      { slug: "meditations-book-2", title: "Book 2", author: "Marcus Aurelius" },
      { slug: "enchiridion-1-10", title: "Maxims 1–10", author: "Epictetus, Enchiridion" },
    ],
  },
  {
    id: "yours",
    title: "What is yours",
    line: "Separate the fact from the story, then act on your part.",
    reads: [
      { slug: "enchiridion-1-10", title: "Maxims 1–10", author: "Epictetus, Enchiridion" },
      {
        slug: "discourses-1-what-is-in-our-power",
        title: "What is in our power",
        author: "Epictetus, Discourses",
      },
      { slug: "meditations-book-2", title: "Book 2", author: "Marcus Aurelius" },
    ],
  },
  {
    id: "day",
    title: "An ordinary day",
    line: "A steadier life is built on ordinary hours, not on a mood.",
    reads: [
      { slug: "shortness-1", title: "Life is long enough", author: "Seneca" },
      { slug: "peace-2", title: "The remedy", author: "Seneca, On Peace of Mind" },
      { slug: "providence-2", title: "The athlete", author: "Seneca, On Providence" },
    ],
  },
];

export const REPS: WeeklyRep[] = [
  {
    title: "The smallest version",
    body: "Name one thing you already know you should do. Do not reform your life. Shrink it until it takes five minutes, and do only that today.",
    read: { slug: "shortness-2", title: "The busy man", author: "Seneca" },
  },
  {
    title: "Meet them in advance",
    body: "Before the day gets loud, name the person or task most likely to irritate you. Decide now that you will not be surprised, and that your part is your response.",
    read: { slug: "meditations-book-2", title: "Book 2", author: "Marcus Aurelius" },
  },
  {
    title: "Fact, then opinion",
    body: "When something stings, write the fact in one line and the opinion you added in the next. Act only on the part that is yours.",
    read: { slug: "enchiridion-1-10", title: "Maxims 1–10", author: "Epictetus" },
  },
  {
    title: "The first motion",
    body: "The next time anger rises, do nothing for one breath. Then say what happened, without the insult you were about to add.",
    read: { slug: "anger-1-what", title: "What anger is", author: "Seneca" },
  },
  {
    title: "Three lines at night",
    body: "Tonight, three lines only: what you intended, what happened, and what was yours to do better. No essay.",
    read: { slug: "peace-2", title: "The remedy", author: "Seneca" },
  },
  {
    title: "One comfort set down",
    body: "Skip one comfort you do not need today. Notice that you remain intact, and go back to the work.",
    read: { slug: "providence-2", title: "The athlete", author: "Seneca" },
  },
  {
    title: "Silence first",
    body: "In one conversation today, let the other person finish. Answer with the fewest words that are still true.",
    read: { slug: "enchiridion-11-20", title: "Maxims 11–20", author: "Epictetus" },
  },
  {
    title: "Use the hour",
    body: "Take one hour you usually give away. Spend it on a single chapter. Then stop.",
    read: { slug: "shortness-1", title: "Life is long enough", author: "Seneca" },
  },
];

export function currentWeekKey(date = new Date()) {
  const utc = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = utc.getUTCDay() || 7;
  utc.setUTCDate(utc.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((utc.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${utc.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

export function repForWeek(key = currentWeekKey()) {
  const n = Number(key.slice(key.indexOf("W") + 1)) || 1;
  return REPS[(n - 1) % REPS.length];
}
