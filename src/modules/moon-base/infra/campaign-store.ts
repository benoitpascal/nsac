import type { Campaign } from '../core/campaign';

const KEY = 'horizon.campaign';

/** The tab's session storage, or nothing when the browser blocks it. */
const storage = (): Storage | undefined => {
  try {
    return window.sessionStorage;
  } catch {
    return undefined;
  }
};

/** Keeps the demo between pages; when storage is blocked the demo still plays, page by page. */
export const saveCampaign = (campaign: Campaign) => {
  try {
    storage()?.setItem(KEY, JSON.stringify(campaign));
  } catch {
    // Storage full or blocked: nothing to keep.
  }
};

/** Returns the demo saved in this tab, if any. */
export const loadCampaign = (): Campaign | undefined => {
  const saved = storage()?.getItem(KEY);
  if (!saved) return undefined;
  try {
    return JSON.parse(saved) as Campaign;
  } catch {
    return undefined;
  }
};
