/** @typedef {import("@/app/page.js").Event[]} Event */
/** @typedef {import("@/app/page.js").EventsBy} EventsBy */

/**
 * @param {string} key
 * @param {Event[]} arr
 * @returns {EventsBy}
 */
export const groupBy = (key, arr) =>
  arr.reduce(
    (acc, x) => ({ ...acc, [x[key]]: [...(acc[x[key]] || []), x] }),
    {}
  )
