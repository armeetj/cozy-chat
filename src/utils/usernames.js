const nouns = [
  "scroor",
  "hushroom",
  "fummy",
  "wottled",
  "bocolate",
  "narp",
  "pedding",
  "botton",
  "flyre",
  "skale",
  "tingers",
  "moopy",
  "pusty",
  "cumpy",
  "brubbing",
  "bebbly",
  "hicken",
  "tegative",
  "scitch",
  "wottom",
  "snubble",
  "niskey",
  "ninks",
  "smonkeys",
  "nizzy",
  "stratch",
  "binch",
  "punnells",
  "thiddling",
  "jeece",
  "bunner",
  "jegs",
  "mickenpox",
  "flunch",
  "glattered",
  "doudy",
  "hoors",
  "bipped",
  "wolden",
  "necan",
  "francing",
  "blitch",
  "yoody",
  "mones",
  "flousers",
  "koup",
  "bleet",
  "chag",
  "trawn",
  "jumber",
  "meerkat",
  "lion",
  "bongo",
  "cobra",
  "auk",
  "penguin",
  "falcon",
  "turtledove",
  "otter",
  "coati",
  "flyingfish",
  "sheldrake",
  "opossum",
  "chicken",
  "eland",
  "shads",
  "camel",
  "gull",
  "chamois",
  "unicorn",
  "minnow",
  "walrus",
  "tuna",
  "flamingo",
  "seafowl",
  "stoat",
  "racehorse",
  "dingo",
  "ferret",
  "ponie",
  "cormorant",
  "porpoise",
  "stork",
  "peregrine",
  "prairiedog",
  "partridge",
  "eagle",
  "redwing",
  "starling",
  "python",
  "hyena",
  "thrush",
  "mare",
  "colobus",
  "swift",
  "crocodile",
  "tamarin",
  "squirrel",
  "mackerel",
  "dunnock",
];
const adjs = [
  "peevish",
  "knowing",
  "jagged",
  "lean",
  "leery",
  "idle",
  "maniacal",
  "medium",
  "watery",
  "both",
  "uptight",
  "petulant",
  "verdant",
  "mercurial",
  "dashing",
  "hypnotic",
  "uncommon",
  "bright",
  "infamous",
  "vapid",
  "aware",
  "didactic",
  "noxious",
  "palatable",
  "historical",
  "drunk",
  "worldly",
  "alluring",
  "alive",
  "arrogant",
  "wanting",
  "unbalanced",
  "fiery",
  "nonstop",
  "pungent",
  "automatic",
  "coherent",
  "competent",
  "disgusting",
  "bogus",
  "cluttered",
  "longterm",
  "fretful",
  "pristine",
  "wary",
  "chief",
  "irascible",
  "understood",
  "direful",
  "unfriendly",
];

export const randomUsername = () => {
  return `${randomAdjective()}-${randomNoun()}`;
};

export const randomColor = () => {
  return `hsl(${Math.floor(Math.random() * 360)} 100% 70%)`;
};

const randomAdjective = () => adjs[Math.floor(Math.random() * adjs.length)];
const randomNoun = () => nouns[Math.floor(Math.random() * nouns.length)];

const uppercase = (s) => {
  return s[0].toUpperCase() + s.substring(1);
};
