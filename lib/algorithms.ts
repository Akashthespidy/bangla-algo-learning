import fs from "fs";
import path from "path";

export interface AlgorithmMetadata {
  slug: string;
  name: string;
  nameBn: string;
  category: string;
  categoryBn: string;
  difficulty: "Easy" | "Medium" | "Hard";
  difficultyBn: string;
  tags: string[];
  visualizerType: "array" | "grid" | "tree" | "graph";
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  description: string;
  practiceExercises: {
    question: string;
    options: string[];
    answer: string;
    hint: string;
  }[];
}

export interface AlgorithmDetails extends AlgorithmMetadata {
  code: {
    cpp: string;
    javascript: string;
    python: string;
  };
  explanation: string;
}

const algorithmsDir = path.join(process.cwd(), "content", "algorithms");

export function getAllAlgorithms(): AlgorithmMetadata[] {
  if (!fs.existsSync(algorithmsDir)) {
    return [];
  }

  const folders = fs.readdirSync(algorithmsDir);
  const algorithms: AlgorithmMetadata[] = [];

  for (const folder of folders) {
    const metaPath = path.join(algorithmsDir, folder, "metadata.json");
    if (fs.existsSync(metaPath)) {
      try {
        const fileContent = fs.readFileSync(metaPath, "utf-8");
        const meta = JSON.parse(fileContent);
        algorithms.push({
          slug: folder,
          ...meta,
        });
      } catch (e) {
        console.error(`Error parsing metadata for ${folder}:`, e);
      }
    }
  }

  return algorithms;
}

export async function getAlgorithm(slug: string): Promise<AlgorithmDetails | null> {
  const algoDir = path.join(algorithmsDir, slug);
  const metaPath = path.join(algoDir, "metadata.json");
  const expPath = path.join(algoDir, "explanation.bn.md");

  if (!fs.existsSync(metaPath)) {
    return null;
  }

  try {
    const metaContent = fs.readFileSync(metaPath, "utf-8");
    const meta = JSON.parse(metaContent);

    let explanation = "";
    if (fs.existsSync(expPath)) {
      explanation = fs.readFileSync(expPath, "utf-8");
    }

    // Try dynamic import, fallback to reading source file as a safe fallback
    let code = { cpp: "", javascript: "", python: "" };
    try {
      // Direct dynamic import works inside Server Components
      const codeModule = await import(`../content/algorithms/${slug}/code`);
      code = codeModule.code;
    } catch (e) {
      console.warn(`Dynamic import failed for code.ts on ${slug}, trying direct parse...`, e);
      // fallback reading
      const codeTsPath = path.join(algoDir, "code.ts");
      if (fs.existsSync(codeTsPath)) {
        const content = fs.readFileSync(codeTsPath, "utf-8");
        // We can parse it by matching the string structures
        const cppMatch = content.match(/cpp:\s*`([\s\S]*?)`,/);
        const jsMatch = content.match(/javascript:\s*`([\s\S]*?)`,/);
        const pyMatch = content.match(/python:\s*`([\s\S]*?)`/);
        
        code = {
          cpp: cppMatch ? cppMatch[1].trim() : "",
          javascript: jsMatch ? jsMatch[1].trim() : "",
          python: pyMatch ? pyMatch[1].trim() : ""
        };
      }
    }

    return {
      slug,
      ...meta,
      code,
      explanation,
    };
  } catch (e) {
    console.error(`Error loading algorithm ${slug}:`, e);
    return null;
  }
}
