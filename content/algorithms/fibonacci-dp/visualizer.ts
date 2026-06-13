export function generateSteps(input: any) {
  let n = 6;
  if (typeof input === "number") {
    n = input;
  } else if (input && typeof input === "object") {
    if (typeof input.n === "number") {
      n = input.n;
    } else if (Array.isArray(input.array)) {
      // If a user types raw array instead, we just take the length of array
      n = Math.min(Math.max(input.array.length, 2), 12);
    } else if (typeof input.target === "number") {
      n = Math.min(Math.max(input.target, 2), 12);
    }
  } else if (typeof input === "string") {
    const parsed = parseInt(input, 10);
    if (!isNaN(parsed)) n = parsed;
  }

  const steps = [];
  let stepCount = 0;
  const dp: (number | null)[] = new Array(n + 1).fill(null);

  // 1. Initial State
  steps.push({
    step: ++stepCount,
    state: [...dp],
    active: [],
    comparing: [],
    sorted: [],
    description: `ডাইনামিক প্রোগ্রামিং টেবিল (dp table) সাইজ ${n + 1} তৈরি করা হলো। সব মান আপাতত শূন্য/খালি।`,
    action: "টেবিল তৈরি"
  });

  // 2. Base case 0
  dp[0] = 0;
  steps.push({
    step: ++stepCount,
    state: [...dp],
    active: [0],
    comparing: [],
    sorted: [],
    description: `প্রথম বেইস কেস নির্ধারণ করা হলো: F(0) = 0`,
    action: "বেইস কেস"
  });

  if (n >= 1) {
    // 3. Base case 1
    dp[1] = 1;
    steps.push({
      step: ++stepCount,
      state: [...dp],
      active: [1],
      comparing: [],
      sorted: [0],
      description: `দ্বিতীয় বেইস কেস নির্ধারণ করা হলো: F(1) = 1`,
      action: "বেইস কেс"
    });
  }

  for (let i = 2; i <= n; i++) {
    const sortedSoFar = Array.from({ length: i - 1 }, (_, k) => k);

    // 4. Highlight inputs
    steps.push({
      step: ++stepCount,
      state: [...dp],
      active: [i],
      comparing: [i - 1, i - 2],
      sorted: [...sortedSoFar],
      description: `F(${i}) এর মান বের করতে F(${i - 1}) এবং F(${i - 2}) এর মান টেবিলে খোঁজা হচ্ছে।`,
      action: "মান রিডিং"
    });

    dp[i] = (dp[i - 1] as number) + (dp[i - 2] as number);

    // 5. Store result
    steps.push({
      step: ++stepCount,
      state: [...dp],
      active: [i],
      comparing: [i - 1, i - 2],
      sorted: [...sortedSoFar],
      description: `F(${i}) = F(${i - 1}) + F(${i - 2}) = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]} হিসাব করে টেбиলে সংরক্ষণ করা হলো।`,
      action: "হিসাব ও সংরক্ষণ"
    });
  }

  // Done
  steps.push({
    step: ++stepCount,
    state: [...dp],
    active: [],
    comparing: [],
    sorted: Array.from({ length: n + 1 }, (_, k) => k),
    description: `অ্যালগরিদম শেষ। কাঙ্ক্ষিত ফিবোনাচ্চি সংখ্যা F(${n}) = ${dp[n]}।`,
    action: "সম্পন্ন"
  });

  return steps;
}
