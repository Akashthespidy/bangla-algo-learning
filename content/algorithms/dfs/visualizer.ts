export interface DFSStep {
  step: number;
  action: string;
  description: string;
  state: {
    nodes: Array<{
      id: string;
      label: string;
      roomBn: string;
      status: "unvisited" | "visiting" | "visited";
      x: number;
      y: number;
    }>;
    edges: Array<{
      from: string;
      to: string;
      status: "unvisited" | "active" | "visited" | "skipped" | "backtrack";
    }>;
    activeVertex: string;
    activeChild?: string;
    callStack: Array<{
      vertex: string;
      par?: string;
      status: "active" | "waiting";
    }>;
    vis: { [key: string]: boolean };
    akkasAction: {
      type: "enter" | "explore" | "skip" | "backtrack" | "finish";
      message: string;
      badge: string;
    };
    logs: string[];
  };
}

export function generateSteps(options?: any): DFSStep[] {
  // Preset selection: default to 'maze' (Story graph)
  const preset = options?.preset || "maze";

  if (preset === "cycle") {
    return generateCycleGraphSteps();
  }

  if (preset === "tree") {
    return generateTreeGraphSteps();
  }

  return generateMazeGraphSteps();
}

// -------------------------------------------------------------
// 1. Akkas Bhai's Story Maze Graph (6 Nodes with cross tunnels)
// -------------------------------------------------------------
function generateMazeGraphSteps(): DFSStep[] {
  const nodePositions: { [id: string]: { x: number; y: number; roomBn: string } } = {
    "1": { x: 100, y: 75, roomBn: "ঘর ১" },
    "2": { x: 300, y: 75, roomBn: "ঘর ২" },
    "4": { x: 500, y: 75, roomBn: "ঘর ৪" },
    "3": { x: 100, y: 225, roomBn: "ঘর ৩" },
    "6": { x: 300, y: 225, roomBn: "ঘর ৬" },
    "5": { x: 500, y: 225, roomBn: "ঘর ৫" },
  };

  const nodeIds = ["1", "2", "3", "4", "5", "6"];

  const baseEdges = [
    { from: "1", to: "2" },
    { from: "1", to: "3" },
    { from: "2", to: "4" },
    { from: "2", to: "6" },
    { from: "4", to: "5" },
    { from: "5", to: "6" },
    { from: "3", to: "6" },
  ];

  const steps: DFSStep[] = [];
  let stepCount = 0;
  const currentLogs: string[] = [];

  const createNodes = (
    visitingId: string,
    visitedSet: Set<string>
  ) => {
    return nodeIds.map((id) => ({
      id,
      label: id,
      roomBn: nodePositions[id].roomBn,
      status: (id === visitingId
        ? "visiting"
        : visitedSet.has(id)
        ? "visited"
        : "unvisited") as "unvisited" | "visiting" | "visited",
      x: nodePositions[id].x,
      y: nodePositions[id].y,
    }));
  };

  type EdgeStatus = "unvisited" | "visited" | "active" | "skipped" | "backtrack";

  const createEdges = (
    visitedEdges: Map<string, EdgeStatus>
  ) => {
    return baseEdges.map((e) => {
      const key1 = `${e.from}-${e.to}`;
      const key2 = `${e.to}-${e.from}`;
      const status = (visitedEdges.get(key1) || visitedEdges.get(key2) || "unvisited") as EdgeStatus;
      return {
        from: e.from,
        to: e.to,
        status,
      };
    });
  };

  const visitedSet = new Set<string>();
  const visitedMap: { [key: string]: boolean } = {
    "1": false,
    "2": false,
    "3": false,
    "4": false,
    "5": false,
    "6": false,
  };
  const visitedEdges = new Map<string, EdgeStatus>();
  const stack: Array<{ vertex: string; par?: string; status: "active" | "waiting" }> = [];

  // Helper to push step
  const addStep = (
    action: string,
    description: string,
    activeVertex: string,
    activeChild: string | undefined,
    badge: string,
    message: string,
    type: "enter" | "explore" | "skip" | "backtrack" | "finish"
  ) => {
    steps.push({
      step: ++stepCount,
      action,
      description,
      state: {
        nodes: createNodes(activeVertex, visitedSet),
        edges: createEdges(visitedEdges),
        activeVertex,
        activeChild,
        callStack: stack.map((s) => ({ ...s })),
        vis: { ...visitedMap },
        akkasAction: {
          type,
          badge,
          message,
        },
        logs: [...currentLogs],
      },
    });
  };

  // Step 0: Ready
  addStep(
    "যাত্রা শুরু",
    "আক্কাস ভাই গোলকধাঁধার ১ নম্বর প্রবেশদ্বারে দাঁড়ালেন। এখান থেকেই শুরু হবে তাঁর ডেপথ ফার্স্ট সার্চ (DFS) অভিযান!",
    "1",
    undefined,
    "🚪 শুরুতে প্রস্তুত",
    "আক্কাস ভাই প্রস্তুত! dfs(1) শুরু হচ্ছে...",
    "enter"
  );

  // Step 1: Visit 1
  visitedSet.add("1");
  visitedMap["1"] = true;
  stack.push({ vertex: "1", status: "active" });
  addStep(
    "ঘর ১ এ প্রবেশ",
    "১ নম্বর ঘরে পা রাখলেন এবং দেয়ালে লিখে দিলেন vis[1] = true। রিকার্সন স্ট্যাকে যোগ হলো dfs(1)।",
    "1",
    undefined,
    "✍️ vis[1] = true",
    "ঘর ১-এ পা দিলেন! vis[1] = true লিখে দিলেন।",
    "enter"
  );

  // Step 2: 1 explores 2
  visitedEdges.set("1-2", "active");
  currentLogs.push("par: 1 child: 2");
  addStep(
    "সুরঙ্গ দিয়ে ঘর ২-এর দিকে",
    "১ নম্বর ঘর থেকে সুরঙ্গ ধরে ২ নম্বর ঘরের দিকে তাকালেন এবং চিৎকার করে বললেন: par: 1, child: 2!",
    "1",
    "2",
    "🗣️ par: 1 child: 2",
    "সুরঙ্গ ধরে ঘর ২-এর দিকে এগোচ্ছেন!",
    "explore"
  );

  // Step 3: Visit 2
  visitedEdges.set("1-2", "visited");
  visitedSet.add("2");
  visitedMap["2"] = true;
  stack[0].status = "waiting";
  stack.push({ vertex: "2", par: "1", status: "active" });
  addStep(
    "ঘর ২-এ প্রবেশ",
    "আক্কাস ভাই ২ নম্বর ঘরে ঢুকলেন এবং দেয়ালে লিখলেন vis[2] = true। কল স্ট্যাকে জমা হলো dfs(2)।",
    "2",
    undefined,
    "✍️ vis[2] = true",
    "ঘর ২-এ পৌঁছালেন! দেয়ালে vis[2] = true লিখলেন।",
    "enter"
  );

  // Step 4: 2 checks 1 (already visited)
  visitedEdges.set("2-1", "skipped");
  currentLogs.push("par: 2 child: 1 (ঘোরা শেষ!)");
  addStep(
    "ঘর ১ পরীক্ষা (ইতিমধ্যে ঘোরা)",
    "ঘর ২ থেকে সুরঙ্গ দিয়ে ঘর ১ দেখলেন। কিন্তু vis[1] == true! তাই আক্কাস ভাই বললেন: 'এটা তো আগেই ঘুরে এসেছি!', ইউ-টার্ন নিয়ে ২-এ ফিরে আসলেন (continue)।",
    "2",
    "1",
    "🚫 vis[1] == true (ইউ-টার্ন)",
    "ঘর ১ আগেই দেখা হয়েছে! সোজা ইউ-টার্ন (continue)।",
    "skip"
  );
  visitedEdges.set("1-2", "visited"); // restore visited state

  // Step 5: 2 explores 4
  visitedEdges.set("2-4", "active");
  currentLogs.push("par: 2 child: 4");
  addStep(
    "সুরঙ্গ দিয়ে ঘর ৪-এর দিকে",
    "ঘর ২-এর দ্বিতীয় সুরঙ্গ দিয়ে ৪ নম্বর ঘরের দিকে এগোলেন: par: 2, child: 4!",
    "2",
    "4",
    "🗣️ par: 2 child: 4",
    "ঘর ৪-এর সুরঙ্গ ধরে হাঁটছেন!",
    "explore"
  );

  // Step 6: Visit 4
  visitedEdges.set("2-4", "visited");
  visitedSet.add("4");
  visitedMap["4"] = true;
  stack[1].status = "waiting";
  stack.push({ vertex: "4", par: "2", status: "active" });
  addStep(
    "ঘর ৪-এ প্রবেশ",
    "৪ নম্বর ঘরে পা রাখলেন: vis[4] = true। রিকার্সন স্ট্যাকে পুশ হলো dfs(4)।",
    "4",
    undefined,
    "✍️ vis[4] = true",
    "ঘর ৪-এ ঢুকলেন! vis[4] = true করলেন।",
    "enter"
  );

  // Step 7: 4 explores 5
  visitedEdges.set("4-5", "active");
  currentLogs.push("par: 4 child: 5");
  addStep(
    "সুরঙ্গ দিয়ে ঘর ৫-এর দিকে",
    "গভীরে আরও সামনে এগোচ্ছেন! ৪ নম্বর ঘর থেকে ৫ নম্বর ঘরের সুরঙ্গ ধরলেন: par: 4, child: 5!",
    "4",
    "5",
    "🗣️ par: 4 child: 5",
    "ঘর ৫-এর সুরঙ্গ ধরে হাঁটছেন...",
    "explore"
  );

  // Step 8: Visit 5
  visitedEdges.set("4-5", "visited");
  visitedSet.add("5");
  visitedMap["5"] = true;
  stack[2].status = "waiting";
  stack.push({ vertex: "5", par: "4", status: "active" });
  addStep(
    "ঘর ৫-এ প্রবেশ",
    "আক্কাস ভাই ৫ নম্বর ঘরে পৌঁছে লিখলেন vis[5] = true। স্ট্যাকে যুক্ত হলো dfs(5)।",
    "5",
    undefined,
    "✍️ vis[5] = true",
    "ঘর ৫-এ আসলেন! vis[5] = true দেয়ালে লিখলেন।",
    "enter"
  );

  // Step 9: 5 explores 6
  visitedEdges.set("5-6", "active");
  currentLogs.push("par: 5 child: 6");
  addStep(
    "সুরঙ্গ দিয়ে ঘর ৬-এর দিকে",
    "৫ নম্বর ঘর থেকে ৬ নম্বর ঘরের দিকে যাত্রা: par: 5, child: 6!",
    "5",
    "6",
    "🗣️ par: 5 child: 6",
    "ঘর ৬-এর সুরঙ্গ ধরে হাঁটছেন!",
    "explore"
  );

  // Step 10: Visit 6
  visitedEdges.set("5-6", "visited");
  visitedSet.add("6");
  visitedMap["6"] = true;
  stack[3].status = "waiting";
  stack.push({ vertex: "6", par: "5", status: "active" });
  addStep(
    "ঘর ৬-এ প্রবেশ",
    "৬ নম্বর ঘরে প্রবেশ করলেন: vis[6] = true। কল স্ট্যাকে পুশ হলো dfs(6)।",
    "6",
    undefined,
    "✍️ vis[6] = true",
    "ঘর ৬-এ পৌঁছে দেয়ালে vis[6] = true লিখলেন।",
    "enter"
  );

  // Step 11: 6 checks 2 (already visited)
  visitedEdges.set("2-6", "skipped");
  currentLogs.push("par: 6 child: 2 (ঘোরা শেষ!)");
  addStep(
    "ঘর ২ পরীক্ষা (ঘোরা শেষ)",
    "ঘর ৬ থেকে সুরঙ্গ দিয়ে দেখলেন ঘর ২ এর দিকে যায়। কিন্তু vis[2] == true! তাই ইউ-টার্ন নিয়ে ৬-এ ফেরত আসলেন।",
    "6",
    "2",
    "🚫 vis[2] == true (ইউ-টার্ন)",
    "ঘর ২ আগে থেকেই ভিজিটেড! ইউ-টার্ন।",
    "skip"
  );
  visitedEdges.set("2-6", "unvisited");

  // Step 12: 6 explores 3
  visitedEdges.set("3-6", "active");
  currentLogs.push("par: 6 child: 3");
  addStep(
    "সুরঙ্গ দিয়ে ঘর ৩-এর দিকে",
    "ঘর ৬ থেকে এবার ৩ নম্বর ঘরের দিকে সুরঙ্গ দেখলেন: par: 6, child: 3!",
    "6",
    "3",
    "🗣️ par: 6 child: 3",
    "ঘর ৩-এর সুরঙ্গ ধরে এগোচ্ছেন!",
    "explore"
  );

  // Step 13: Visit 3
  visitedEdges.set("3-6", "visited");
  visitedSet.add("3");
  visitedMap["3"] = true;
  stack[4].status = "waiting";
  stack.push({ vertex: "3", par: "6", status: "active" });
  addStep(
    "ঘর ৩-এ প্রবেশ",
    "৩ নম্বর ঘরে পৌঁছালেন: vis[3] = true। স্ট্যাকে যুক্ত হলো dfs(3)। সব ঘর এখন ভিজিট করা শেষ!",
    "3",
    undefined,
    "✍️ vis[3] = true",
    "ঘর ৩-এ প্রবেশ! vis[3] = true। সব ঘর ঘোরা হলো!",
    "enter"
  );

  // Step 14: 3 checks 1 (already visited)
  visitedEdges.set("1-3", "skipped");
  currentLogs.push("par: 3 child: 1 (ঘোরা শেষ!)");
  addStep(
    "ঘর ১ পরীক্ষা (ঘোরা শেষ)",
    "ঘর ৩ থেকে সুরঙ্গ ১-এর দিকে যায়। কিন্তু vis[1] == true! তাই আক্কাস ভাই ইউ-টার্ন নিলেন।",
    "3",
    "1",
    "🚫 vis[1] == true (ইউ-টার্ন)",
    "ঘর ১ ইতিমধ্যে ঘোরা শেষ! ইউ-টার্ন।",
    "skip"
  );
  visitedEdges.set("1-3", "visited");

  // Step 15: 3 has no more unvisited neighbors -> Backtrack to 6
  stack.pop();
  stack[stack.length - 1].status = "active";
  visitedEdges.set("3-6", "backtrack");
  addStep(
    "ঘর ৩ থেকে ব্যাকট্র্যাক (Backtrack) -> ঘর ৬",
    "ঘর ৩-এর আর কোনো সুরঙ্গ বাকি নেই! আক্কাস ভাই ইউ-টার্ন নিয়ে পেছনে ঘর ৬-এ ব্যাকট্র্যাক করলেন। dfs(3) স্ট্যাক থেকে পপ (pop) হলো!",
    "6",
    "3",
    "↩️ ব্যাকট্র্যাক (dfs(3) শেষ)",
    "আটকে পড়ায় ব্যাকট্র্যাক করে ঘর ৬-এ ফেরত আসলেন!",
    "backtrack"
  );
  visitedEdges.set("3-6", "visited");

  // Step 16: 6 has no more unvisited neighbors -> Backtrack to 5
  stack.pop();
  stack[stack.length - 1].status = "active";
  visitedEdges.set("5-6", "backtrack");
  addStep(
    "ঘর ৬ থেকে ব্যাকট্র্যাক -> ঘর ৫",
    "ঘর ৬-এর সব সুরঙ্গ এক্সপ্লোর শেষ। ব্যাকট্র্যাক করে ঘর ৫-এ ফেরত আসলেন। dfs(6) পপ হলো।",
    "5",
    "6",
    "↩️ ব্যাকট্র্যাক (dfs(6) শেষ)",
    "ঘর ৫-এ ফিরে এলেন!",
    "backtrack"
  );
  visitedEdges.set("5-6", "visited");

  // Step 17: 5 backtracks to 4
  stack.pop();
  stack[stack.length - 1].status = "active";
  visitedEdges.set("4-5", "backtrack");
  addStep(
    "ঘর ৫ থেকে ব্যাকট্র্যাক -> ঘর ৪",
    "ঘর ৫ থেকে সুরঙ্গ বেয়ে পেছনে ঘর ৪-এ ব্যাকট্র্যাক করলেন। dfs(5) স্ট্যাক থেকে সমাপ্ত হলো।",
    "4",
    "5",
    "↩️ ব্যাকট্র্যাক (dfs(5) শেষ)",
    "ঘর ৪-এ ফিরে এলেন!",
    "backtrack"
  );
  visitedEdges.set("4-5", "visited");

  // Step 18: 4 backtracks to 2
  stack.pop();
  stack[stack.length - 1].status = "active";
  visitedEdges.set("2-4", "backtrack");
  addStep(
    "ঘর ৪ থেকে ব্যাকট্র্যাক -> ঘর ২",
    "ঘর ৪-এর সব পথ দেখা শেষ। ব্যাকট্র্যাক করে ঘর ২-এ ফিরে আসলেন। dfs(4) সমাপ্ত।",
    "2",
    "4",
    "↩️ ব্যাকট্র্যাক (dfs(4) শেষ)",
    "ঘর ২-এ ফিরে এলেন!",
    "backtrack"
  );
  visitedEdges.set("2-4", "visited");

  // Step 19: 2 backtracks to 1
  stack.pop();
  stack[stack.length - 1].status = "active";
  visitedEdges.set("1-2", "backtrack");
  addStep(
    "ঘর ২ থেকে ব্যাকট্র্যাক -> ঘর ১",
    "ঘর ২-এর কোনো নতুন সুরঙ্গ নেই। ব্যাকট্র্যাক করে আদি ঘর ১-এ ফিরে আসলেন। dfs(2) শেষ।",
    "1",
    "2",
    "↩️ ব্যাকট্র্যাক (dfs(2) শেষ)",
    "আদি ঘর ১-এ ফিরে এলেন!",
    "backtrack"
  );
  visitedEdges.set("1-2", "visited");

  // Step 20: 1 checks 3 (already visited)
  visitedEdges.set("1-3", "skipped");
  currentLogs.push("par: 1 child: 3 (ঘোরা শেষ!)");
  addStep(
    "ঘর ১ থেকে ঘর ৩ পরীক্ষা",
    "ঘর ১-এর বাকি সুরঙ্গ ৩ নম্বর ঘরে যায়। কিন্তু vis[3] == true! তাই আর ভেতরে যাওয়ার প্রয়োজন নেই।",
    "1",
    "3",
    "🚫 vis[3] == true (ইউ-টার্ন)",
    "ঘর ৩ তো আগেই ঘুরে আসা হয়েছে!",
    "skip"
  );
  visitedEdges.set("1-3", "visited");

  // Step 21: Done
  stack.pop();
  addStep(
    "অভিযান সম্পন্ন! 🎉",
    "আক্কাস ভাই গোলকধাঁধার প্রতিটি ঘর এবং সুরঙ্গ সফলভাবে ঘুরে শেষ করেছেন! পুরো গ্রাফ DFS ট্রাভার্সাল সম্পন্ন।",
    "1",
    undefined,
    "🏆 গোলকধাঁধা জয়!",
    "সব ঘর এক্সপ্লোর শেষ! আক্কাস ভাই মুক্ত!",
    "finish"
  );

  return steps;
}

// -------------------------------------------------------------
// 2. Cycle Graph Preset (4-node cycle to demonstrate cycle detection)
// -------------------------------------------------------------
function generateCycleGraphSteps(): DFSStep[] {
  const nodePositions: { [id: string]: { x: number; y: number; roomBn: string } } = {
    "1": { x: 180, y: 80, roomBn: "ঘর ১" },
    "2": { x: 420, y: 80, roomBn: "ঘর ২" },
    "3": { x: 420, y: 220, roomBn: "ঘর ৩" },
    "4": { x: 180, y: 220, roomBn: "ঘর ৪" },
  };

  const nodeIds = ["1", "2", "3", "4"];
  const baseEdges = [
    { from: "1", to: "2" },
    { from: "2", to: "3" },
    { from: "3", to: "4" },
    { from: "4", to: "1" },
  ];

  const steps: DFSStep[] = [];
  let stepCount = 0;
  const currentLogs: string[] = [];
  const visitedSet = new Set<string>();
  const visitedMap: { [key: string]: boolean } = { "1": false, "2": false, "3": false, "4": false };
  const visitedEdges = new Map<string, "visited" | "active" | "skipped" | "backtrack">();
  const stack: Array<{ vertex: string; par?: string; status: "active" | "waiting" }> = [];

  const addStep = (
    action: string,
    description: string,
    activeVertex: string,
    activeChild: string | undefined,
    badge: string,
    message: string,
    type: "enter" | "explore" | "skip" | "backtrack" | "finish"
  ) => {
    steps.push({
      step: ++stepCount,
      action,
      description,
      state: {
        nodes: nodeIds.map((id) => ({
          id,
          label: id,
          roomBn: nodePositions[id].roomBn,
          status: (id === activeVertex ? "visiting" : visitedSet.has(id) ? "visited" : "unvisited") as any,
          x: nodePositions[id].x,
          y: nodePositions[id].y,
        })),
        edges: baseEdges.map((e) => {
          const status = visitedEdges.get(`${e.from}-${e.to}`) || visitedEdges.get(`${e.to}-${e.from}`) || "unvisited";
          return { from: e.from, to: e.to, status };
        }),
        activeVertex,
        activeChild,
        callStack: stack.map((s) => ({ ...s })),
        vis: { ...visitedMap },
        akkasAction: { type, badge, message },
        logs: [...currentLogs],
      },
    });
  };

  // Step 1: Start
  visitedSet.add("1");
  visitedMap["1"] = true;
  stack.push({ vertex: "1", status: "active" });
  addStep("ঘর ১ থেকে শুরু", "চক্র গ্রাফে ১ নম্বর ঘর থেকে DFS শুরু হলো। vis[1] = true।", "1", undefined, "✍️ vis[1] = true", "ঘর ১-এ প্রবেশ!", "enter");

  // 1 -> 2
  visitedEdges.set("1-2", "visited");
  visitedSet.add("2");
  visitedMap["2"] = true;
  currentLogs.push("par: 1 child: 2");
  stack[0].status = "waiting";
  stack.push({ vertex: "2", par: "1", status: "active" });
  addStep("ঘর ২-এ প্রবেশ", "১ থেকে ২-এ এগোলো: par: 1, child: 2! vis[2] = true।", "2", undefined, "✍️ vis[2] = true", "ঘর ২-এ পৌঁছালেন!", "enter");

  // 2 -> 3
  visitedEdges.set("2-3", "visited");
  visitedSet.add("3");
  visitedMap["3"] = true;
  currentLogs.push("par: 2 child: 3");
  stack[1].status = "waiting";
  stack.push({ vertex: "3", par: "2", status: "active" });
  addStep("ঘর ৩-এ প্রবেশ", "২ থেকে ৩-এ এগোলো: par: 2, child: 3! vis[3] = true।", "3", undefined, "✍️ vis[3] = true", "ঘর ৩-এ পৌঁছালেন!", "enter");

  // 3 -> 4
  visitedEdges.set("3-4", "visited");
  visitedSet.add("4");
  visitedMap["4"] = true;
  currentLogs.push("par: 3 child: 4");
  stack[2].status = "waiting";
  stack.push({ vertex: "4", par: "3", status: "active" });
  addStep("ঘর ৪-এ প্রবেশ", "৩ থেকে ৪-এ এগোলো: par: 3, child: 4! vis[4] = true।", "4", undefined, "✍️ vis[4] = true", "ঘর ৪-এ পৌঁছালেন!", "enter");

  // 4 -> 1 (Cycle detected!)
  visitedEdges.set("4-1", "skipped");
  currentLogs.push("par: 4 child: 1 (Cycle Detected!)");
  addStep("চক্র (Cycle) শনাক্ত!", "ঘর ৪ থেকে ১ নম্বরে সুরঙ্গ গেছে, কিন্তু vis[1] == true! অর্থাৎ এটি একটি চক্র বা Cycle!", "4", "1", "⚠️ Cycle Detected!", "চক্র ধরা পড়েছে! ইউ-টার্ন।", "skip");

  // Backtrack
  stack.pop();
  addStep("ব্যাকট্র্যাক ৪ -> ৩", "ঘর ৪ থেকে ৩-এ ফিরে আসলো। dfs(4) সমাপ্ত।", "3", "4", "↩️ ব্যাকট্র্যাক", "৩-এ ফেরত!", "backtrack");
  stack.pop();
  addStep("ব্যাকট্র্যাক ৩ -> ২", "ঘর ৩ থেকে ২-এ ফিরে আসলো। dfs(3) সমাপ্ত।", "2", "3", "↩️ ব্যাকট্র্যাক", "২-এ ফেরত!", "backtrack");
  stack.pop();
  addStep("ব্যাকট্র্যাক ২ -> ১", "ঘর ২ থেকে ১-এ ফিরে আসলো। dfs(2) সমাপ্ত।", "1", "2", "↩️ ব্যাকট্র্যাক", "১-এ ফেরত!", "backtrack");
  stack.pop();
  addStep("সম্পন্ন!", "চক্র গ্রাফের DFS সফলভাবে সম্পন্ন হয়েছে!", "1", undefined, "🏆 সম্পন্ন", "চক্র গ্রাফ এক্সপ্লোর শেষ!", "finish");

  return steps;
}

// -------------------------------------------------------------
// 3. Tree Graph Preset (Root 1 with branches)
// -------------------------------------------------------------
function generateTreeGraphSteps(): DFSStep[] {
  const nodePositions: { [id: string]: { x: number; y: number; roomBn: string } } = {
    "1": { x: 300, y: 55, roomBn: "রুট ১" },
    "2": { x: 170, y: 150, roomBn: "ঘর ২" },
    "3": { x: 430, y: 150, roomBn: "ঘর ৩" },
    "4": { x: 100, y: 245, roomBn: "ঘর ৪" },
    "5": { x: 240, y: 245, roomBn: "ঘর ৫" },
    "6": { x: 370, y: 245, roomBn: "ঘর ৬" },
    "7": { x: 490, y: 245, roomBn: "ঘর ৭" },
  };

  const nodeIds = ["1", "2", "3", "4", "5", "6", "7"];
  const baseEdges = [
    { from: "1", to: "2" },
    { from: "1", to: "3" },
    { from: "2", to: "4" },
    { from: "2", to: "5" },
    { from: "3", to: "6" },
    { from: "3", to: "7" },
  ];

  const steps: DFSStep[] = [];
  let stepCount = 0;
  const currentLogs: string[] = [];
  const visitedSet = new Set<string>();
  const visitedMap: { [key: string]: boolean } = {
    "1": false, "2": false, "3": false, "4": false, "5": false, "6": false, "7": false,
  };
  const visitedEdges = new Map<string, "visited" | "active" | "skipped" | "backtrack">();
  const stack: Array<{ vertex: string; par?: string; status: "active" | "waiting" }> = [];

  const addStep = (
    action: string,
    description: string,
    activeVertex: string,
    activeChild: string | undefined,
    badge: string,
    message: string,
    type: "enter" | "explore" | "skip" | "backtrack" | "finish"
  ) => {
    steps.push({
      step: ++stepCount,
      action,
      description,
      state: {
        nodes: nodeIds.map((id) => ({
          id,
          label: id,
          roomBn: nodePositions[id].roomBn,
          status: (id === activeVertex ? "visiting" : visitedSet.has(id) ? "visited" : "unvisited") as any,
          x: nodePositions[id].x,
          y: nodePositions[id].y,
        })),
        edges: baseEdges.map((e) => {
          const status = visitedEdges.get(`${e.from}-${e.to}`) || visitedEdges.get(`${e.to}-${e.from}`) || "unvisited";
          return { from: e.from, to: e.to, status };
        }),
        activeVertex,
        activeChild,
        callStack: stack.map((s) => ({ ...s })),
        vis: { ...visitedMap },
        akkasAction: { type, badge, message },
        logs: [...currentLogs],
      },
    });
  };

  // 1
  visitedSet.add("1");
  visitedMap["1"] = true;
  stack.push({ vertex: "1", status: "active" });
  addStep("রুট ১ এ শুরু", "ট্রি গ্রাফের রুট নোড ১ এ পা দিলেন। vis[1] = true।", "1", undefined, "✍️ vis[1] = true", "ট্রি রুট ১ এ শুরু!", "enter");

  // 1 -> 2
  visitedEdges.set("1-2", "visited");
  visitedSet.add("2");
  visitedMap["2"] = true;
  currentLogs.push("par: 1 child: 2");
  stack[0].status = "waiting";
  stack.push({ vertex: "2", par: "1", status: "active" });
  addStep("বাম শাখায় ঘর ২", "রুট ১ থেকে বাম দিকে ঘর ২-এ গেলেন: par: 1, child: 2!", "2", undefined, "✍️ vis[2] = true", "ঘর ২-এ এলেন!", "enter");

  // 2 -> 4
  visitedEdges.set("2-4", "visited");
  visitedSet.add("4");
  visitedMap["4"] = true;
  currentLogs.push("par: 2 child: 4");
  stack[1].status = "waiting";
  stack.push({ vertex: "4", par: "2", status: "active" });
  addStep("লিফ নোড ঘর ৪", "ঘর ২ থেকে গভীরে গিয়ে লিফ নোড ৪-এ পৌঁছালেন: par: 2, child: 4!", "4", undefined, "✍️ vis[4] = true", "লিফ নোড ৪ এ!", "enter");

  // 4 backtracks to 2
  stack.pop();
  stack[stack.length - 1].status = "active";
  addStep("ব্যাকট্র্যাক ৪ -> ২", "৪-এর নিচে আর পথ নেই, তাই ২-এ ব্যাকট্র্যাক করলেন।", "2", "4", "↩️ ব্যাকট্র্যাক", "২-এ ফেরত!", "backtrack");

  // 2 -> 5
  visitedEdges.set("2-5", "visited");
  visitedSet.add("5");
  visitedMap["5"] = true;
  currentLogs.push("par: 2 child: 5");
  stack[1].status = "waiting";
  stack.push({ vertex: "5", par: "2", status: "active" });
  addStep("ঘর ৫-এ প্রবেশ", "ঘর ২-এর ডান সন্তান ঘর ৫-এ গেলেন: par: 2, child: 5!", "5", undefined, "✍️ vis[5] = true", "ঘর ৫-এ পৌঁছালেন!", "enter");

  // 5 backtracks to 2
  stack.pop();
  stack[stack.length - 1].status = "active";
  addStep("ব্যাকট্র্যাক ৫ -> ২", "৫-এর নিচে আর কিছু নেই, ২-এ ব্যাকট্র্যাক করলেন।", "2", "5", "↩️ ব্যাকট্র্যাক", "২-এ ফেরত!", "backtrack");

  // 2 backtracks to 1
  stack.pop();
  stack[stack.length - 1].status = "active";
  addStep("ব্যাকট্র্যাক ২ -> ১", "ঘর ২-এর উভয় সন্তান ঘোরা শেষ, তাই রুট ১-এ ফিরলেন।", "1", "2", "↩️ ব্যাকট্র্যাক", "রুট ১-এ ফেরত!", "backtrack");

  // 1 -> 3
  visitedEdges.set("1-3", "visited");
  visitedSet.add("3");
  visitedMap["3"] = true;
  currentLogs.push("par: 1 child: 3");
  stack[0].status = "waiting";
  stack.push({ vertex: "3", par: "1", status: "active" });
  addStep("ডান শাখায় ঘর ৩", "রুট ১ থেকে এবার ডানদিকের শাখা ঘর ৩-এ গেলেন: par: 1, child: 3!", "3", undefined, "✍️ vis[3] = true", "ঘর ৩-এ পৌঁছালেন!", "enter");

  // 3 -> 6
  visitedEdges.set("3-6", "visited");
  visitedSet.add("6");
  visitedMap["6"] = true;
  currentLogs.push("par: 3 child: 6");
  stack[1].status = "waiting";
  stack.push({ vertex: "6", par: "3", status: "active" });
  addStep("ঘর ৬-এ প্রবেশ", "ঘর ৩ থেকে গভীরে গিয়ে ঘর ৬-এ পৌঁছালেন: par: 3, child: 6!", "6", undefined, "✍️ vis[6] = true", "ঘর ৬-এ পৌঁছালেন!", "enter");

  // 6 backtracks to 3
  stack.pop();
  stack[stack.length - 1].status = "active";
  addStep("ব্যাকট্র্যাক ৬ -> ৩", "৬-এর নিচে পথ নেই, ব্যাকট্র্যাক করে ৩-এ ফেরত।", "3", "6", "↩️ ব্যাকট্র্যাক", "৩-এ ফেরত!", "backtrack");

  // 3 -> 7
  visitedEdges.set("3-7", "visited");
  visitedSet.add("7");
  visitedMap["7"] = true;
  currentLogs.push("par: 3 child: 7");
  stack[1].status = "waiting";
  stack.push({ vertex: "7", par: "3", status: "active" });
  addStep("ঘর ৭-এ প্রবেশ", "ঘর ৩ থেকে শেষ লিফ নোড ৭-এ পৌঁছালেন: par: 3, child: 7!", "7", undefined, "✍️ vis[7] = true", "ঘর ৭-এ পৌঁছালেন!", "enter");

  // 7 backtracks to 3
  stack.pop();
  stack[stack.length - 1].status = "active";
  addStep("ব্যাকট্র্যাক ৭ -> ৩", "৭ থেকে ৩-এ ব্যাকট্র্যাক করলেন।", "3", "7", "↩️ ব্যাকট্র্যাক", "৩-এ ফেরত!", "backtrack");

  // 3 backtracks to 1
  stack.pop();
  stack[stack.length - 1].status = "active";
  addStep("ব্যাকট্র্যাক ৩ -> ১", "ঘর ৩ থেকে রুটে ব্যাকট্র্যাক করে ১-এ ফিরলেন।", "1", "3", "↩️ ব্যাকট্র্যাক", "রুট ১-এ ফেরত!", "backtrack");

  // Finish
  stack.pop();
  addStep("ট্রি DFS সম্পন্ন! 🌲", "ট্রি-এর প্রতিটি সাব-ট্রি নিখুঁতভাবে ডেপথ ফার্স্ট ট্রাভার্সাল সম্পন্ন হলো!", "1", undefined, "🏆 ট্রি সম্পন্ন", "ট্রি এর সব নোড ঘোরা শেষ!", "finish");

  return steps;
}
