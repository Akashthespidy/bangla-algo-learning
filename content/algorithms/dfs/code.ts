export const code = {
  cpp: `// DFS C++ Implementation (Standard Competitive Programming Approach)
#include <bits/stdc++.h>
using namespace std;

const int N = 1e5 + 10;

vector<int> v[N];
bool vis[N];

void dfs(int vertex) {
    // Akkas bhai steps into this vertex
    vis[vertex] = true;

    for (int child : v[vertex]) {
        cout << "par: " << vertex << " child: " << child << endl;

        // Already visited? Akkas bhai turns back!
        if (vis[child])
            continue;

        dfs(child);
    }
}

int main() {
    int n, m;
    cin >> n >> m;

    for (int i = 0; i < m; i++) {
        int a, b;
        cin >> a >> b;

        v[a].push_back(b);
        v[b].push_back(a);
    }

    dfs(1);
    return 0;
}`,
  c: `// DFS C Implementation (Using 2D Array Adjacency List)
#include <stdio.h>
#include <stdbool.h>

#define N 100010

int v[N][100];   // Adjacency list
int degree[N];
bool vis[N];

void dfs(int vertex) {
    vis[vertex] = true;

    for (int i = 0; i < degree[vertex]; i++) {
        int child = v[vertex][i];

        printf("par: %d child: %d\\n", vertex, child);

        if (vis[child])
            continue;

        dfs(child);
    }
}

int main() {
    int n, m;
    scanf("%d %d", &n, &m);

    for (int i = 0; i < m; i++) {
        int a, b;
        scanf("%d %d", &a, &b);

        v[a][degree[a]++] = b;
        v[b][degree[b]++] = a;
    }

    dfs(1);

    return 0;
}`,
  javascript: `// DFS JavaScript Implementation (Node.js)
const fs = require("fs");

// Fast I/O for Competitive Programming in Node.js
const input = fs.readFileSync(0, "utf8").trim().split(/\\s+/).map(Number);
let index = 0;

const n = input[index++];
const m = input[index++];

const v = Array.from({ length: n + 1 }, () => []);
const vis = Array(n + 1).fill(false);

function dfs(vertex) {
    vis[vertex] = true;

    for (const child of v[vertex]) {
        console.log(\`par: \${vertex} child: \${child}\`);

        if (vis[child])
            continue;

        dfs(child);
    }
}

for (let i = 0; i < m; i++) {
    const a = input[index++];
    const b = input[index++];

    v[a].push(b);
    v[b].push(a);
}

dfs(1);`,
  python: `# DFS Python Implementation (Adjacency List)
import sys

# Fast I/O and recursion limit
sys.setrecursionlimit(200000)

def solve():
    input_data = sys.stdin.read().split()
    if not input_data:
        return
        
    n = int(input_data[0])
    m = int(input_data[1])
    
    v = [[] for _ in range(n + 1)]
    vis = [False] * (n + 1)
    
    def dfs(vertex):
        vis[vertex] = True
        
        for child in v[vertex]:
            print(f"par: {vertex} child: {child}")
            
            if vis[child]:
                continue
                
            dfs(child)
            
    idx = 2
    for _ in range(m):
        a = int(input_data[idx])
        b = int(input_data[idx + 1])
        idx += 2
        v[a].append(b)
        v[b].append(a)
        
    dfs(1)

if __name__ == "__main__":
    solve()`
};
