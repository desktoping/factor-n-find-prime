// How to factor N, a product to two primes.
// 1. Make a guess, g<N that shares no factor with N
// 2. Find r, such as gʳ=mN+1
// 3. If r is even, calculate (gʳ/²+1) and (gʳ/²-1). If r is odd, go back to step 1
// 4. Use Euclid's algorithm to find the greatest common divisor

const PRODUCT_OF_TWO_PRIMES = 77;
const rThreshold = 500;

let g = 1;
let r = 1;
let N = PRODUCT_OF_TWO_PRIMES;

let valid_g = false;
let valid_r = false;

// Prevent Euclid's algo - gcd, from going to infinity
const callStackLimit = 8;

// @TODO - Needs performance improvement
const euclidAlgo = (a, b, c = 1) => {
  if (c > callStackLimit) {
    return 0;
  }

  if (a === 0) return b;
  return euclidAlgo(b % a, a, c + 1);
};

const isPrime = (n) => {
  let nIsPrime = n > 1;
  for (let i = 2; i < n - 1; i++) {
    if (n % i === 0) {
      nIsPrime = false;
      break;
    }
  }
  return nIsPrime;
};

const redoCalculation = () => {
  valid_r = false;
  valid_g = false;
  return guess_G_and_R();
};

console.time("Calculation");
// Start solving the factors
const guess_G_and_R = () => {
  try {
    if (g >= N) {
      console.log("Unable to get prime factors");
      return;
    }

    while (!valid_g && g < N) {
      g = g < N ? g + 1 : 1;

      // Check if g shares a factor of N
      // Can be deduced if their greates common divisor is lesser than N
      const f = euclidAlgo(N, g);
      valid_g = f > 0 && f < N;
    }

    while (!valid_r && r < rThreshold) {
      // Check if remainder of gʳ and N is 1
      const rm = Math.pow(g, r) % N;
      if (r % 2 === 0 && rm === 1 && !isNaN(rm)) {
        valid_r = true;
      } else {
        r = r + 1;
      }
    }

    if (!valid_r) {
      r = 1;
      return redoCalculation();
    }

    // Find the factors of N
    // (gʳ/²+1)(gʳ/²-1) = mN

    const upperBound = Math.pow(g, r / 2) + 1;
    // const lowerBound = Math.pow(g, r / 2) - 1;

    const firstPossiblePrime = euclidAlgo(upperBound, N);
    const secondPossiblePrime = N / firstPossiblePrime;

    if (
      !isPrime(firstPossiblePrime) ||
      !isPrime(secondPossiblePrime) ||
      firstPossiblePrime === N
    ) {
      r = 1;
      return redoCalculation();
    }

    console.log(
      `Product: ${N}\nPrimes: `,
      firstPossiblePrime,
      secondPossiblePrime
    );
    console.timeEnd("Calculation");
  } catch (err) {
    console.error(err);
  }
};

guess_G_and_R();
