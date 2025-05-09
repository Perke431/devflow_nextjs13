import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import qs from 'query-string';
import { BADGE_CRITERIA } from "@/constants";
import { BadgeCounts } from "@/types";
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getTimestamp = (createdAt: Date): string => {
  const now = new Date();
  const timeDifference = now.getTime() - createdAt.getTime();

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;

  if (timeDifference < minute) {
    const seconds = Math.floor(timeDifference / 1000);
    return `${seconds} ${seconds === 1 ? 'second' : 'seconds'} ago`;
  } else if (timeDifference < hour) {
    const minutes = Math.floor(timeDifference / minute);
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (timeDifference < day) {
    const hours = Math.floor(timeDifference / hour);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else if (timeDifference < week) {
    const days = Math.floor(timeDifference / day);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  } else if (timeDifference < month) {
    const weeks = Math.floor(timeDifference / week);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  } else if (timeDifference < year) {
    const months = Math.floor(timeDifference / month);
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  } else {
    const years = Math.floor(timeDifference / year);
    return `${years} ${years === 1 ? 'year' : 'years'} ago`;
  }
}

export const formatAndDivideNumber = (num: number): string => {
  if ( num >= 1000000) {
    const formattedNum = (num / 1000000).toFixed(1);

    return `${formattedNum}`;
  } else if (num >= 1000) {
    const formattedNum = (num / 1000).toFixed(1);

    return `${formattedNum}K`
  } else {
    return num.toString();
  }
}

export function getMonthYear(dateString: Date) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

interface URLQueryParams {
  params: string;
  key: string;
  value: string | null;
}

export const formURLQuery = ({ params, key, value}: URLQueryParams) => {
  const currentURL = qs.parse(params);

  currentURL[key] = value;

  return qs.stringifyUrl({
    url: window.location.pathname,
    query: currentURL
  }, {
    skipNull: true
  })
}

interface RemoveURLQueryParams {
  params: string;
  keysToRemove: string[];
}

export const removeKeysFromQuery = ({ params, keysToRemove }: RemoveURLQueryParams) => {
  const currentURL = qs.parse(params);

  keysToRemove.forEach(key => {
    delete currentURL[key];
  })

  return qs.stringifyUrl({
    url: window.location.pathname,
    query: currentURL
  }, {
    skipNull: true
  })
}

interface BadgeParam {
  criteria: {
    type: keyof typeof BADGE_CRITERIA;
    count: number;
  }[];
}

export const assignBadges = (params: BadgeParam) => {
  const badgeCounts: BadgeCounts = {
    GOLD: 0,
    SILVER: 0,
    BRONZE: 0
  }

  const { criteria } = params;

  criteria.forEach((item) => {
    const { type, count } = item;
    const bagdeLevels: any = BADGE_CRITERIA[type];

    Object.keys(bagdeLevels).forEach((level:any) => {
      if(count >= bagdeLevels[level]) {
        badgeCounts[level as keyof BadgeCounts] += 1
      }
    })
  })

  return badgeCounts;
}