import { SidebarLink } from "@/types";

export const themes = [
  { value: "light", label: "Light", icon: "/assets/icons/sun.svg" },
  { value: "dark", label: "Dark", icon: "/assets/icons/moon.svg" },
  { value: "system", label: "System", icon: "/assets/icons/computer.svg" },
];

export const sidebarLinks: SidebarLink[] = [
  {
    imgURL: "/assets/icons/home.svg",
    route: "/",
    label: "Home",
  },
  {
    imgURL: "/assets/icons/users.svg",
    route: "/community",
    label: "Community",
  },
  {
    imgURL: "/assets/icons/star.svg",
    route: "/collection",
    label: "Collections",
  },
  {
    imgURL: "/assets/icons/suitcase.svg",
    route: "/jobs",
    label: "Find Jobs",
  },
  {
    imgURL: "/assets/icons/tag.svg",
    route: "/tags",
    label: "Tags",
  },
  {
    imgURL: "/assets/icons/user.svg",
    route: "/profile",
    label: "Profile",
  },
  {
    imgURL: "/assets/icons/question.svg",
    route: "/ask-question",
    label: "Ask a question",
  },
];

export const BADGE_CRITERIA = {
  QUESTION_COUNT: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  ANSWER_COUNT: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  QUESTION_UPVOTES: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  ANSWER_UPVOTES: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  TOTAL_VIEWS: {
    BRONZE: 1000,
    SILVER: 10000,
    GOLD: 100000,
  },
};

export const hotNetwork = [
  {
    id: '0',
    text: 'Would it be appropriate to point out an error in another paper during a referee report?',
  },
  {
    id: '1',
    text: 'How can an airconditioning machine exist?',
  },
  {
    id: '2',
    text: 'Interrogated every time crossing UK Border as citizen',
  },
  {
    id: '3',
    text: 'Low digit addition generator',
  },
  {
    id: '4',
    text: 'What is an example of 3 numbers that do not make up a vector?',
  }
];

export const popularTags = [
  {
    _id: '0',
    label: 'Javascript',
    count: 20152
  },
  {
    _id: '1',
    label: 'Next.Js',
    count: 18493
  },
  {
    _id: '2',
    label: 'React.js',
    count: 16269
  },
  {
    _id: '3',
    label: 'Node.js',
    count: 15121
  }
]