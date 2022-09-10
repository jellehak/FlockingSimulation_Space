export const math = (function() {
  return {
    rand_range (a, b) {
      return Math.random() * (b - a) + a;
    },

    rand_normalish () {
      const r = Math.random() + Math.random() + Math.random() + Math.random();
      return (r / 4.0) * 2.0 - 1;
    },

    lerp (x, a, b) {
      return x * (b - a) + a;
    },

    clamp (x, a, b) {
      return Math.min(Math.max(x, a), b);
    },

    sat (x) {
      return Math.min(Math.max(x, 0.0), 1.0);
    },
  };
})();
