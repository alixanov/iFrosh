export const createPagination = (currentPage, lastPage) => {
  let current = currentPage;
  let last = lastPage;
  let delta = 2;
  let left = current - delta;
  let right = current + delta + 1;
  let range = [];
  let rangeWithDots = [];
  let l;

  for (let i = 1; i <= last; i++) {
    if (i === 1 || i === last || (i >= left && i < right)) {
      range.push(i);
    }
  }

  for (let i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l !== 1) {
        rangeWithDots.push('...');
      }
    }
    rangeWithDots.push(i);
    l = i;
  }

  if (rangeWithDots.length > 5) {
    const mid = Math.ceil(rangeWithDots.length / 2);
    rangeWithDots = [...rangeWithDots.slice(0, 2), ...rangeWithDots.slice(mid - 1, mid + 1), ...rangeWithDots.slice(-2)];
  }

  return rangeWithDots;
};
