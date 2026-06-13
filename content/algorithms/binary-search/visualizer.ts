export function generateSteps(input: any) {
  // Gracefully handle raw array or object input
  let array: number[] = [];
  let target = 5;

  if (Array.isArray(input)) {
    array = [...input].sort((a, b) => a - b);
  } else if (input && typeof input === "object") {
    array = Array.isArray(input.array) ? [...input.array] : [];
    target = typeof input.target === "number" ? input.target : Number(input.target);
  }

  const steps = [];
  let left = 0;
  let right = array.length - 1;
  let stepCount = 0;

  // Initial step
  steps.push({
    step: ++stepCount,
    state: [...array],
    active: [left, right],
    comparing: [],
    sorted: [],
    markers: { left, right },
    description: `অনুসন্ধান শুরু হচ্ছে। লক্ষ্য সংখ্যা: ${target}। প্রাথমিক সীমানা নির্ধারণ করা হয়েছে: বাম = ${left}, ডান = ${right}।`,
    action: "সূচনা"
  });

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    // Step: Calculating mid and comparing
    steps.push({
      step: ++stepCount,
      state: [...array],
      active: [left, right],
      comparing: [mid],
      sorted: [],
      markers: { left, right, mid },
      description: `মধ্যম উপাদান নির্ধারণ করা হলো। মধ্যম ইনডেক্স = ${mid} (মান: ${array[mid]})। এখন যাচাই করে দেখা হচ্ছে।`,
      action: "মিডল পয়েন্ট নির্ণয়"
    });

    if (array[mid] === target) {
      // Found!
      steps.push({
        step: ++stepCount,
        state: [...array],
        active: [left, right],
        comparing: [],
        sorted: [mid],
        markers: { left, right, mid },
        description: `অভিনন্দন! লক্ষ্য সংখ্যা ${target} ইনডেক্স ${mid}-এ খুঁজে পাওয়া গেছে।`,
        action: "ফлаফল পাওয়া গেছে"
      });
      return steps;
    }

    if (array[mid] < target) {
      left = mid + 1;

      steps.push({
        step: ++stepCount,
        state: [...array],
        active: left <= right ? [left, right] : [],
        comparing: [],
        sorted: [],
        markers: left <= right ? { left, right } : {},
        description: `যেহেতু মধ্যম মান ${array[mid]} লক্ষ্য মান ${target} থেকে ছোট, তাই নতুন বাম সীমানা হবে ${left} (ডান অর্ধে খোঁজা হবে)।`,
        action: "ডান অর্ধে অনুসন্ধান"
      });
    } else {
      right = mid - 1;

      steps.push({
        step: ++stepCount,
        state: [...array],
        active: left <= right ? [left, right] : [],
        comparing: [],
        sorted: [],
        markers: left <= right ? { left, right } : {},
        description: `যেহেতু মধ্যм মান ${array[mid]} লক্ষ্য মান ${target} থেকে বড়, তাই নতুন ডান সীমানা হবে ${right} (বাম অর্ধে খোঁজা হবে)।`,
        action: "বাম অর্ধে অনুসন্ধান"
      });
    }
  }

  // Not found
  steps.push({
    step: ++stepCount,
    state: [...array],
    active: [],
    comparing: [],
    sorted: [],
    markers: {},
    description: `দুঃখিত! অনুসন্ধান শেষ হয়েছে কিন্তু লক্ষ্য সংখ্যা ${target} এই অ্যারেতে খুঁজে পাওয়া যায়নি।`,
    action: "খুঁজে পাওয়া যায়নি"
  });

  return steps;
}
