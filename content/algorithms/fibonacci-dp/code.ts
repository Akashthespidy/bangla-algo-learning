export const code = {
  cpp: `// Fibonacci (DP) C++ Implementation (Tabulation)
#include <iostream>
#include <vector>

int fibonacciDP(int n) {
    if (n <= 0) return 0;
    if (n == 1) return 1;
    
    // Create DP table
    std::vector<int> dp(n + 1, 0);
    
    // Base cases
    dp[0] = 0;
    dp[1] = 1;
    
    // Fill the table bottom-up
    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    
    return dp[n];
}`,
  javascript: `// Fibonacci (DP) JavaScript Implementation (Tabulation)
function fibonacciDP(n) {
    if (n <= 0) return 0;
    if (n === 1) return 1;
    
    // Create DP table
    const dp = new Array(n + 1).fill(0);
    
    // Base cases
    dp[0] = 0;
    dp[1] = 1;
    
    // Fill the table bottom-up
    for (let i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    
    return dp[n];
}`,
  python: `# Fibonacci (DP) Python Implementation (Tabulation)
def fibonacci_dp(n):
    if n <= 0:
        return 0
    if n == 1:
        return 1
        
    # Create DP table
    dp = [0] * (n + 1)
    
    # Base cases
    dp[0] = 0
    dp[1] = 1
    
    # Fill the table bottom-up
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
        
    return dp[n]`
};
