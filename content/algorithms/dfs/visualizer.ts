export function generateSteps(input?: any) {
  const steps = [];
  let stepCount = 0;

  // Step 1: Initial state
  steps.push({
    step: ++stepCount,
    state: {
      nodes: [
        { id: "A", label: "A", status: "unvisited" },
        { id: "B", label: "B", status: "unvisited" },
        { id: "C", label: "C", status: "unvisited" },
        { id: "D", label: "D", status: "unvisited" },
        { id: "E", label: "E", status: "unvisited" },
      ],
      edges: [
        { from: "A", to: "B", status: "unvisited" },
        { from: "A", to: "C", status: "unvisited" },
        { from: "B", to: "D", status: "unvisited" },
        { from: "C", to: "E", status: "unvisited" },
        { from: "D", to: "E", status: "unvisited" },
      ],
      stack: []
    },
    action: "সূচনা",
    description: "ডেপথ ফার্স্ট সার্চ (DFS) শুরু হচ্ছে। আমরা স্টার্ট নোড হিসেবে 'A' কে নির্বাচন করেছি।"
  });

  // Step 2: Push A
  steps.push({
    step: ++stepCount,
    state: {
      nodes: [
        { id: "A", label: "A", status: "stack" },
        { id: "B", label: "B", status: "unvisited" },
        { id: "C", label: "C", status: "unvisited" },
        { id: "D", label: "D", status: "unvisited" },
        { id: "E", label: "E", status: "unvisited" },
      ],
      edges: [
        { from: "A", to: "B", status: "unvisited" },
        { from: "A", to: "C", status: "unvisited" },
        { from: "B", to: "D", status: "unvisited" },
        { from: "C", to: "E", status: "unvisited" },
        { from: "D", to: "E", status: "unvisited" },
      ],
      stack: ["A"]
    },
    action: "স্ট্যাকে পুশ",
    description: "শুরুতেই সোর্স নোড 'A' কে ট্রাভার্সাল স্ট্যাকে প্রবেশ করানো হলো।"
  });

  // Step 3: Visit A
  steps.push({
    step: ++stepCount,
    state: {
      nodes: [
        { id: "A", label: "A", status: "visiting" },
        { id: "B", label: "B", status: "stack" },
        { id: "C", label: "C", status: "stack" },
        { id: "D", label: "D", status: "unvisited" },
        { id: "E", label: "E", status: "unvisited" },
      ],
      edges: [
        { from: "A", to: "B", status: "visiting" },
        { from: "A", to: "C", status: "visiting" },
        { from: "B", to: "D", status: "unvisited" },
        { from: "C", to: "E", status: "unvisited" },
        { from: "D", to: "E", status: "unvisited" },
      ],
      stack: ["C", "B"]
    },
    action: "ভিজিট A ও পুশ B, C",
    description: "নোড 'A' কে স্ট্যাক থেকে বের করে ভিজিট করা হলো। এর পরশিবর্তী অস্পর্শিত নোড 'B' এবং 'C'-কে স্ট্যাকে যুক্ত করা হলো।"
  });

  // Step 4: Visit B
  steps.push({
    step: ++stepCount,
    state: {
      nodes: [
        { id: "A", label: "A", status: "visited" },
        { id: "B", label: "B", status: "visiting" },
        { id: "C", label: "C", status: "stack" },
        { id: "D", label: "D", status: "stack" },
        { id: "E", label: "E", status: "unvisited" },
      ],
      edges: [
        { from: "A", to: "B", status: "visited" },
        { from: "A", to: "C", status: "visiting" },
        { from: "B", to: "D", status: "visiting" },
        { from: "C", to: "E", status: "unvisited" },
        { from: "D", to: "E", status: "unvisited" },
      ],
      stack: ["C", "D"]
    },
    action: "ভিজিট B ও পুш D",
    description: "স্ট্যাকের শেষ থেকে 'B' নোডটি তুলে নিয়ে ভিজিট করা শুরু হলো। তার সাথে সংযুক্ত অস্পর্শিত প্রতিবেশী 'D' কে স্ট্যাকে ঢোকানো হলো।"
  });

  // Step 5: Visit D
  steps.push({
    step: ++stepCount,
    state: {
      nodes: [
        { id: "A", label: "A", status: "visited" },
        { id: "B", label: "B", status: "visited" },
        { id: "C", label: "C", status: "stack" },
        { id: "D", label: "D", status: "visiting" },
        { id: "E", label: "E", status: "stack" },
      ],
      edges: [
        { from: "A", to: "B", status: "visited" },
        { from: "A", to: "C", status: "visiting" },
        { from: "B", to: "D", status: "visited" },
        { from: "C", to: "E", status: "unvisited" },
        { from: "D", to: "E", status: "visiting" },
      ],
      stack: ["C", "E"]
    },
    action: "ভিজিট D ও পুশ E",
    description: "আমরা গভীরে প্রবেশ করছি। নোড 'D' কে পপ করে ভিজিট করা হচ্ছে এবং তার সংলগ্ন ও অস্পর্শিত নোড 'E' কে স্ট্যাকে যুক্ত করা হচ্ছে।"
  });

  // Step 6: Visit E
  steps.push({
    step: ++stepCount,
    state: {
      nodes: [
        { id: "A", label: "A", status: "visited" },
        { id: "B", label: "B", status: "visited" },
        { id: "C", label: "C", status: "stack" },
        { id: "D", label: "D", status: "visited" },
        { id: "E", label: "E", status: "visiting" },
      ],
      edges: [
        { from: "A", to: "B", status: "visited" },
        { from: "A", to: "C", status: "visiting" },
        { from: "B", to: "D", status: "visited" },
        { from: "C", to: "E", status: "visiting" },
        { from: "D", to: "E", status: "visited" },
      ],
      stack: ["C"]
    },
    action: "নোড E ভিজিট",
    description: "এখন নোড 'E' কে পপ করে ভিজিট করা হচ্ছে। এর সব প্রতিবেশীই (C ও D) ইতিমধ্যেই স্পর্শ করা বা ভিজিট করা হয়ে গেছে।"
  });

  // Step 7: Visit C
  steps.push({
    step: ++stepCount,
    state: {
      nodes: [
        { id: "A", label: "A", status: "visited" },
        { id: "B", label: "B", status: "visited" },
        { id: "C", label: "C", status: "visiting" },
        { id: "D", label: "D", status: "visited" },
        { id: "E", label: "E", status: "visited" },
      ],
      edges: [
        { from: "A", to: "B", status: "visited" },
        { from: "A", to: "C", status: "visited" },
        { from: "B", to: "D", status: "visited" },
        { from: "C", to: "E", status: "visited" },
        { from: "D", to: "E", status: "visited" },
      ],
      stack: []
    },
    action: "নোড C ভিজিট",
    description: "সবশেষে স্ট্যাকের শেষ আইটেম 'C' কে বের করে ভিজিট করা হলো। এটি একটি লিফ (leaf) অবস্থা নির্দেশ করছে কারণ এর সব দিকই ইতোমধ্যে দেখা হয়েছে।"
  });

  // Step 8: Done
  steps.push({
    step: ++stepCount,
    state: {
      nodes: [
        { id: "A", label: "A", status: "visited" },
        { id: "B", label: "B", status: "visited" },
        { id: "C", label: "C", status: "visited" },
        { id: "D", label: "D", status: "visited" },
        { id: "E", label: "E", status: "visited" },
      ],
      edges: [
        { from: "A", to: "B", status: "visited" },
        { from: "A", to: "C", status: "visited" },
        { from: "B", to: "D", status: "visited" },
        { from: "C", to: "E", status: "visited" },
        { from: "D", to: "E", status: "visited" },
      ],
      stack: []
    },
    action: "সম্পন্ন",
    description: "সব নোড সফলভাবে ভিজিট করা হয়েছে! ডিএফএস (DFS) ট্রাভার্সাল সম্পন্ন।"
  });

  return steps;
}
