export function generateSteps(input: number[]) {
  const steps = [];
  const arr = [...input];
  const n = arr.length;
  let stepCount = 0;

  // 1. Initial State
  steps.push({
    step: ++stepCount,
    state: [...arr],
    active: [],
    comparing: [],
    swapping: [],
    sorted: [],
    description: `প্রারম্ভিক অ্যারে: [${arr.join(", ")}]। বাবল সর্ট অ্যালগরিদম শুরু করা হচ্ছে।`,
    action: "শুরু"
  });

  let swapped;
  for (let i = 0; i < n - 1; i++) {
    swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      const sortedSoFar = Array.from({ length: i }, (_, k) => n - 1 - k);

      // 2. Comparing State
      steps.push({
        step: ++stepCount,
        state: [...arr],
        active: [j, j + 1],
        comparing: [j, j + 1],
        swapping: [],
        sorted: [...sortedSoFar],
        description: `ইনডেক্স ${j} (মান: ${arr[j]}) এবং ইনডেক্স ${j + 1} (মান: ${arr[j + 1]}) এর মধ্যে তুলনা করা হচ্ছে।`,
        action: "তুলনা"
      });

      if (arr[j] > arr[j + 1]) {
        // Swap elements
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        swapped = true;

        // 3. Swapped State
        steps.push({
          step: ++stepCount,
          state: [...arr],
          active: [j, j + 1],
          comparing: [],
          swapping: [j, j + 1],
          sorted: [...sortedSoFar],
          description: `যেহেতু ${arr[j + 1]} এর চেয়ে ${arr[j]} বড়, তাই উপাদান দুটির স্থান পরিবর্তন (Swap) করা হলো।`,
          action: "স্থান পরিবর্তন"
        });
      } else {
        // 4. No Swap State
        steps.push({
          step: ++stepCount,
          state: [...arr],
          active: [j, j + 1],
          comparing: [j, j + 1],
          swapping: [],
          sorted: [...sortedSoFar],
          description: `যেহেতু ${arr[j]} এর চেয়ে ${arr[j + 1]} বড় বা সমান, তাই কোনো স্থান পরিবর্তনের প্রয়োজন নেই।`,
          action: "যাচাই"
        });
      }
    }

    // Mark the end-of-pass sorted element
    const sortedAfterPass = Array.from({ length: i + 1 }, (_, k) => n - 1 - k);
    steps.push({
      step: ++stepCount,
      state: [...arr],
      active: [],
      comparing: [],
      swapping: [],
      sorted: [...sortedAfterPass],
      description: `পাস ${i + 1} শেষ। অ্যারের সবচেয়ে বড় অবিকৃত উপাদানটি (${arr[n - 1 - i]}) সঠিক অবস্থানে (${n - 1 - i} ইনডেক্স) বসে গেল।`,
      action: "পাস সম্পন্ন"
    });

    if (!swapped) {
      steps.push({
        step: ++stepCount,
        state: [...arr],
        active: [],
        comparing: [],
        swapping: [],
        sorted: Array.from({ length: n }, (_, k) => k),
        description: "এই পাসে উপাদানগুলোর কোনো স্থান পরিবর্তনের প্রয়োজন হয়নি। এর অর্থ অ্যারেটি সম্পূর্ণ সর্ট হয়ে গেছে। অ্যালগরিদম শেষ করা হচ্ছে।",
        action: "সর্টিং সম্পন্ন"
      });
      return steps;
    }
  }

  // Final confirmation
  steps.push({
    step: ++stepCount,
    state: [...arr],
    active: [],
    comparing: [],
    swapping: [],
    sorted: Array.from({ length: n }, (_, k) => k),
    description: `সর্টিং সম্পূর্ণ সম্পন্ন হয়েছে! চূড়ান্ত সর্ট করা অ্যারে: [${arr.join(", ")}]।`,
    action: "সম্পন্ন"
  });

  return steps;
}
