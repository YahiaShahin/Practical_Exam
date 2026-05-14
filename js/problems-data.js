
const Q = [
  {
  num: 1, title: "Basic Calculator (all operations)", tag: "basics", tagLabel: "Basics", group: "practical",
  brief: "Accept two numbers and perform +, -, *, / printing all results at once.",
  concepts: ["float","scanf / printf","%f specifier","arithmetic operators","& address-of"],
  explanationDetailed: `
<p>Before we write any code, let's understand the <strong>goal</strong>: the user types two numbers, and the program spits out what happens when you add, subtract, multiply, and divide them. Simple -- but there are many small details to get right.</p>
<p><strong>Why float, not int?</strong> If you used <code>int</code> (whole numbers) and divided 10 by 3, C would give you <code>3</code> -- it just chops off the decimal part. By using <code>float</code>, we get <code>3.333333</code>, which is the real mathematical answer. Always use <code>float</code> when your answer might have a decimal point.</p>
<p><strong>What is scanf?</strong> <code>printf</code> sends text <em>to</em> the screen. <code>scanf</code> reads text <em>from</em> the keyboard. When you write <code>scanf("%f", &a)</code>, the <code>%f</code> tells scanf "expect a decimal number", and the <code>&a</code> means "put it in the memory slot called a". The <code>&</code> symbol is called the address-of operator -- without it, scanf has no idea where to store the value and your program will likely crash.</p>
<p><strong>Why declare all variables at the top?</strong> In C89 (the standard you're learning), you <em>must</em> declare all variables before any other statements in a block. This is a rule of the language -- write all your <code>float</code> and <code>int</code> declarations at the very top of <code>main()</code>.</p>`,
  whatHappens: [
    "The program starts and hits the first <code>printf</code> -- this prints the prompt text to the screen.",
    "It reaches <code>scanf(\"%f\", &a)</code> -- the program <strong>pauses</strong> and waits for you to type a number. When you press Enter, the value is stored in variable <code>a</code>.",
    "Same happens for <code>b</code>.",
    "Then the four arithmetic expressions are computed and stored: <code>sum = a + b</code>, <code>sub = a - b</code>, etc.",
    "Finally, four <code>printf</code> calls each print one result. <code>%f</code> is replaced with the actual float value."
  ],
  breakdown: [
    { code: "float a, b, sum, sub, mul, divide;", text: "Declares six float variables in one line. They all start with garbage values (whatever is in memory) -- that's fine, because we fill them before using them." },
    { code: 'printf("Enter first number: ");',    text: "Prints a message to the screen. Notice there is NO <code>\\n</code> at the end -- the cursor stays on the same line so the user types right after the colon." },
    { code: 'scanf("%f", &a);',                   text: "Reads one decimal number from keyboard and stores it in <code>a</code>. The <code>&</code> gives scanf the memory address of <code>a</code>. Without <code>&</code> it's a classic bug." },
    { code: "sum = a + b;",                       text: "The <code>+</code> operator adds two floats. C evaluates the right side first, then copies the result into <code>sum</code> on the left." },
    { code: "divide = a / b;",                    text: "Float division. If both were <code>int</code>, this would truncate. Because they're <code>float</code>, you get the full decimal answer." },
    { code: 'printf("sum = %f\\n", sum);',        text: "<code>%f</code> is a placeholder replaced by the value of <code>sum</code>. <code>\\n</code> moves the cursor to the next line after printing." },
  ],
  mistakes: [
    { text: "Writing <code>scanf(\"%f\", a)</code> without the <code>&</code> -- scanf needs the address, not the value. The program will crash or behave randomly." },
    { text: "Using <code>%d</code> instead of <code>%f</code> for floats -- <code>%d</code> is for integers. Mixing format specifiers gives completely wrong output." },
    { text: "Initializing to 0 unnecessarily -- it's fine but not required when you assign a value before using it." },
  ],
  syntaxTip: "<code>%f</code> prints 6 decimal places by default. Use <code>%.2f</code> to show exactly 2 (like money). Use <code>%e</code> for scientific notation. The letter after <code>%</code> must match the variable type: <code>%d</code>=int, <code>%f</code>=float, <code>%c</code>=char.",
  output: "Enter first number: 10\nEnter second number: 3\nsum      = 13.000000\nsubtract = 7.000000\nmultiply = 30.000000\ndivide   = 3.333333",
  rawCode: `#include <stdio.h>\n\nint main() {\n    float a, b, sum, sub, mul, divide;\n\n    printf("Enter first number: ");\n    scanf("%f", &a);\n    printf("Enter second number: ");\n    scanf("%f", &b);\n\n    sum    = a + b;\n    sub    = a - b;\n    mul    = a * b;\n    divide = a / b;\n\n    printf("sum      = %f\\n", sum);\n    printf("subtract = %f\\n", sub);\n    printf("multiply = %f\\n", mul);\n    printf("divide   = %f\\n", divide);\n\n    return 0;\n}`,
  tryIt: {
    desc: "Change the two numbers and see all four results update live.",
    inputs: [
      { id: "ti_a", label: "First number (a)", type: "number", default: 10, step: "any" },
      { id: "ti_b", label: "Second number (b)", type: "number", default: 3, step: "any" },
    ],
    run(vals){
      const a = parseFloat(vals.ti_a)||0, b = parseFloat(vals.ti_b)||0;
      if(b===0) return `sum      = ${(a+0).toFixed(6)}\nsubtract = ${(a-0).toFixed(6)}\nmultiply = ${(a*0).toFixed(6)}\ndivide   = [ERROR: can't divide by zero]`;
      return `sum      = ${(a+b).toFixed(6)}\nsubtract = ${(a-b).toFixed(6)}\nmultiply = ${(a*b).toFixed(6)}\ndivide   = ${(a/b).toFixed(6)}`;
    }
  }
  },
  {
  num: 2, title: "Odd or Even Checker", tag: "conditionals", tagLabel: "Conditionals", group: "practical",
  brief: "Check whether a given integer is odd or even using the modulus operator.",
  concepts: ["modulus %","if / else","integer input","%d specifier","== vs ="],
  explanationDetailed: `
<p>This program teaches two fundamental ideas: the <strong>modulus operator</strong> and the <strong>if/else statement</strong>.</p>
<p><strong>What does % actually do?</strong> The <code>%</code> operator gives you the <em>remainder</em> after dividing two integers. Think of it like long division from school -- you divide and keep the leftover. For example: <code>7 / 2 = 3 remainder 1</code>, so <code>7 % 2 = 1</code>. And <code>8 / 2 = 4 remainder 0</code>, so <code>8 % 2 = 0</code>. If the remainder is zero, the number divided perfectly -- it's even. If there's any remainder, it's odd.</p>
<p><strong>What is if/else?</strong> It's a decision. The computer checks a condition -- is it true or false? If true, it runs the first block. If false, it skips to <code>else</code> and runs that instead. Only one path ever runs -- never both.</p>
<p><strong>The most important distinction in C: <code>=</code> vs <code>==</code></strong>. A single equals sign <code>=</code> is <em>assignment</em> -- it puts a value into a variable. Two equals signs <code>==</code> is <em>comparison</em> -- it checks whether two values are the same and gives back true or false. Writing <code>if (num % 2 = 0)</code> instead of <code>== 0</code> is one of the most common beginner bugs in C.</p>`,
  whatHappens: [
    "<code>scanf</code> reads the integer into <code>num</code>.",
    "C evaluates <code>num % 2</code> -- the remainder when divided by 2.",
    "The <code>if</code> condition checks: is that remainder equal to zero?",
    "If yes (even): the first printf runs. The else is completely skipped.",
    "If no (odd): the if body is skipped, and the else printf runs instead."
  ],
  breakdown: [
    { code: "int num;",            text: "Declares an integer variable. Integers hold whole numbers only: ...-2, -1, 0, 1, 2... No decimals." },
    { code: 'scanf("%d", &num);',  text: "<code>%d</code> reads a decimal integer. Always <code>%d</code> for <code>int</code>, <code>%f</code> for <code>float</code>. Don't mix them up!" },
    { code: "num % 2",             text: "The modulus. Result is always 0 or 1 for any integer divided by 2. Zero means divisible, one means not." },
    { code: "if (num % 2 == 0)",   text: "<code>==</code> is comparison (two equal signs). The whole condition evaluates to 1 (true) or 0 (false). The if only runs when it's 1." },
    { code: "else",                text: "No condition needed here -- else is the automatic fallback. If the if-condition was false, else runs." },
  ],
  mistakes: [
    { text: "Using <code>=</code> instead of <code>==</code> inside the if: <code>if (num % 2 = 0)</code> -- this tries to assign 0 to an expression, which is a compile error or unpredictable behavior." },
    { text: "Using <code>%</code> with floats -- modulus only works with integers. <code>3.5 % 2</code> is a compile error." },
  ],
  syntaxTip: "<code>if</code> and <code>else</code> with single-statement bodies don't need curly braces <code>{}</code>, but adding them anyway is safer. If you ever add a second statement without adding braces, the second line won't be part of the if -- a very sneaky bug.",
  output: "Enter a number: 7\nThe number is odd",
  rawCode: `#include <stdio.h>\n\nint main() {\n    int num;\n    printf("Enter a number: ");\n    scanf("%d", &num);\n\n    if (num % 2 == 0)\n        printf("The number is even\\n");\n    else\n        printf("The number is odd\\n");\n\n    return 0;\n}`,
  tryIt: {
    desc: "Type any integer and see immediately whether it's odd or even.",
    inputs: [
      { id: "ti_n", label: "Enter a number", type: "number", default: 7 }
    ],
    run(v){
      const n = Math.trunc(parseFloat(v.ti_n)||0);
      return `The number ${n} is ${n%2===0?'even': 'odd'}\n(${n} % 2 = ${Math.abs(n%2)})`;
    }
  }
  },
  {
  num: 3, title: "Student Grade Classifier", tag: "conditionals", tagLabel: "Conditionals", group: "practical",
  brief: "Input a mark and print the letter grade: Excellent, V.Good, Good, or Fail.",
  concepts: ["if / else if / else","logical AND &&","range checking","condition order matters"],
  explanationDetailed: `
<p>This program builds on simple if/else by introducing <strong>else if</strong> chains and the <strong>logical AND operator</strong>. The goal: categorize a number into one of four buckets.</p>
<p><strong>What is else if?</strong> Sometimes you have more than two possibilities. <code>else if</code> lets you chain additional conditions. C checks them one by one from top to bottom and runs <em>only the first one that is true</em>. Once a match is found, all remaining else-ifs and the final else are completely skipped.</p>
<p><strong>What is && (logical AND)?</strong> It means "both conditions must be true at the same time". To catch marks between 80 and 100, we need: the mark must be greater than 80 <em>AND</em> it must be less than or equal to 100. Writing just one condition isn't enough -- <code>a > 80</code> alone would also be true for 200, 500, etc.</p>
<p><strong>Why does order matter?</strong> If you put the Fail check first, every mark below 50 would match it and stop -- even marks that should be Good. Always put your most restrictive (highest range) condition first. C stops as soon as it finds a true condition.</p>`,
  whatHappens: [
    "User enters a mark, stored in <code>a</code>.",
    "First condition: is a between 81 and 100? If yes → Excellent. Done.",
    "Not excellent? Check: is a between 66 and 80? If yes → V.Good. Done.",
    "Still no match? Check: is a between 50 and 65? If yes → Good. Done.",
    "None of the above matched? The <code>else</code> catches it → Fail."
  ],
  breakdown: [
    { code: "if (100 >= a && a > 80)",         text: "<code>&&</code> joins two conditions. BOTH must be true. This catches marks 81-100. The order of conditions inside && doesn't matter mathematically, but the ordering of if/else if chains does." },
    { code: "else if (80 >= a && a > 65)",      text: "Only reached if the first if was false (a is not in 81-100). This catches 66-80. Notice: we don't need to re-check a <= 100 -- we already know that from the first branch failing." },
    { code: "else if (65 >= a && a >= 50)",     text: "Note <code>>=</code> at 50 (inclusive) -- a mark of exactly 50 gets Good, not Fail. The boundary choice matters!" },
    { code: "else printf(\"Fail\");",           text: "Catches everything left -- any mark below 50. No condition needed; it's the automatic fallback." },
  ],
  mistakes: [
    { text: "Forgetting the second part of the range: writing just <code>if (a > 80)</code> instead of <code>if (100 >= a && a > 80)</code> -- correct here because later conditions narrow it down, but unsafe in general." },
    { text: "Putting else before else if -- <code>else</code> must always be last. The compiler will reject the code otherwise." },
    { text: "Using <code>&</code> instead of <code>&&</code> -- a single <code>&</code> is a bitwise operation, not logical AND. Always use <code>&&</code> for conditions." },
  ],
  syntaxTip: "<code>&&</code> short-circuits: if the left side is false, C doesn't even evaluate the right side. This can matter if the right side has side effects, but for simple comparisons it just saves CPU time.",
  output: "Enter your mark: 75\nV.Good",
  rawCode: `#include <stdio.h>\n\nint main() {\n    int a;\n    printf("Enter your mark: ");\n    scanf("%d", &a);\n\n    if (100 >= a && a > 80)\n        printf("Excellent");\n    else if (80 >= a && a > 65)\n        printf("V.Good");\n    else if (65 >= a && a >= 50)\n        printf("Good");\n    else\n        printf("Fail");\n\n    return 0;\n}`,
  tryIt: {
    desc: "Enter a mark (0-100) and watch the grade update live.",
    inputs: [
      { id: "ti_m", label: "Mark (0 - 100)", type: "range", min: 0, max: 100, default: 75 }
    ],
    run(v){
      const m = parseInt(v.ti_m);
      let g = m>80?'Excellent': m>65?'V.Good': m>=50?'Good': 'Fail';
      return `Mark: ${m}\nGrade: ${g}`;
    }
  }
  },
  {
  num: 4, title: "Largest of Three Numbers", tag: "conditionals", tagLabel: "Conditionals", group: "practical",
  brief: "Read three integers and determine which is the largest.",
  concepts: ["if / else if / else","logical AND &&","max of N values","comparison operators"],
  explanationDetailed: `
<p>Finding the largest of three values is a classic algorithm problem. The key insight: you need to compare each candidate against <em>all</em> the others.</p>
<p><strong>Why can't you just compare two at a time?</strong> If you only checked <code>a > b</code>, you'd know a beats b -- but a might still lose to c. You need to confirm a beats <em>both</em> b and c before calling a the winner.</p>
<p><strong>How the logic works: </strong> We have three branches. The first checks if <code>a</code> is bigger than both others. If that's true, a wins -- no need to look further. If a doesn't win, we check b. If b doesn't win either, then c must be the largest (it's the only one left). This is why the final case is just <code>else</code> -- it's guaranteed to be c if we got that far.</p>
<p><strong>What about ties?</strong> If a equals b and both are larger than c, the first condition <code>a > b</code> is false (they're equal, not greater). So the first branch fails. Then <code>b > a</code> is also false (also equal). So we fall to else -- and c gets printed. In a real program you'd handle ties explicitly, but for the exam this logic is sufficient.</p>`,
  whatHappens: [
    "Three integers are read into a, b, c.",
    "First check: does <code>a > b AND a > c</code>? If both true → a is largest.",
    "Second check (only if first failed): does <code>b > a AND b > c</code>? If both true → b is largest.",
    "If both checks failed → c must be the largest (or tied for largest)."
  ],
  breakdown: [
    { code: "scanf(\"%d\", &a);",                text: "Three separate scanf calls, one for each variable. Each one waits for user input before continuing." },
    { code: "if (a > b && a > c)",               text: "a must beat BOTH b and c. Using <code>&&</code> means this only passes when both comparisons are true simultaneously." },
    { code: "else if (b > a && b > c)",          text: "Only evaluated when the first if failed -- so we know a is NOT the largest. Now we check if b beats both a and c." },
    { code: "else printf(\"Third...\");",         text: "We don't need to check c explicitly. If neither a nor b is the largest, c must be. The else handles all remaining cases." },
  ],
  mistakes: [
    { text: "Writing <code>if (a > b > c)</code> -- this doesn't mean 'a is greater than b and b is greater than c'. In C it evaluates left to right: first <code>a > b</code> gives 0 or 1, then compares that to c. Wrong!" },
    { text: "Forgetting to check against all other values: <code>if (a > b)</code> alone doesn't prove a > c." },
  ],
  syntaxTip: "In C, comparison operators return 1 (true) or 0 (false). They don't return booleans like some other languages. <code>&&</code> combines these: <code>1 && 1 = 1</code>, <code>1 && 0 = 0</code>, <code>0 && anything = 0</code>.",
  output: "Enter first number: 5\nEnter second number: 12\nEnter third number: 8\nSecond number is largest",
  rawCode: `#include <stdio.h>\n\nint main() {\n    int a, b, c;\n    printf("Enter first number: ");  scanf("%d", &a);\n    printf("Enter second number: "); scanf("%d", &b);\n    printf("Enter third number: ");  scanf("%d", &c);\n\n    if (a > b && a > c)\n        printf("First number is largest\\n");\n    else if (b > a && b > c)\n        printf("Second number is largest\\n");\n    else\n        printf("Third number is largest\\n");\n\n    return 0;\n}`,
  tryIt: {
    desc: "Set three numbers and find out which is largest.",
    inputs: [
      { id: "ti_a", label: "First number (a)", type: "number", default: 5 },
      { id: "ti_b", label: "Second number (b)", type: "number", default: 12 },
      { id: "ti_c", label: "Third number (c)", type: "number", default: 8 },
    ],
    run(v){
      const a=parseFloat(v.ti_a)||0, b=parseFloat(v.ti_b)||0, c=parseFloat(v.ti_c)||0;
      let res; if(a>b&&a>c)res='First'; else if(b>a&&b>c)res='Second'; else res='Third';
      return `a=${a}, b=${b}, c=${c}\n→ ${res} number is largest`;
    }
  }
  },
  {
  num: 5, title: "Lowest of Three Numbers", tag: "conditionals", tagLabel: "Conditionals", group: "practical",
  brief: "Find and print the smallest among three entered numbers.",
  concepts: ["if / else if / else","variable assignment","minimum finding","compute-then-output"],
  explanationDetailed: `
<p>This is the mirror of Q4 but for finding the <strong>minimum</strong>. There's also a new pattern here worth noting: instead of printing inside each branch, we <em>store the result in a variable first</em>, then print once at the end.</p>
<p><strong>Why store in a variable first?</strong> Imagine later you needed to use the minimum value in a calculation -- not just print it. If you printed inside each if branch, you'd have to duplicate that calculation. By storing it in <code>lowest</code>, you compute once and can use the value as many times as you want after. This is called the <strong>"compute first, output once"</strong> pattern and it's a good habit.</p>
<p><strong>What does initializing to 0 mean?</strong> We write <code>int lowest = 0</code>. The value 0 doesn't matter here -- it gets overwritten before we ever print it. Initializing to 0 is just good practice (variables in C start with garbage values if you don't set them).</p>`,
  whatHappens: [
    "Three numbers are read.",
    "The if chain runs: whichever is smallest gets its value copied into <code>lowest</code>.",
    "Only one branch runs -- the others are skipped.",
    "After the if chain, the single <code>printf</code> prints whatever is now in <code>lowest</code>."
  ],
  breakdown: [
    { code: "int lowest = 0;",      text: "Declares and initializes <code>lowest</code>. We set it to 0 as a placeholder -- it will be overwritten before printing." },
    { code: "if (a < b && a < c)",  text: "a must be less than BOTH others to be the minimum. If a=3, b=5, c=7: 3<5 AND 3<7 → both true → a wins." },
    { code: "lowest = a;",          text: "Assignment. The value of <code>a</code> is copied into <code>lowest</code>. The code doesn't print here -- it just stores the result." },
    { code: 'printf("lowest = %d", lowest);', text: "Prints exactly once, after all branches. The value of <code>lowest</code> was set by whichever branch ran." },
  ],
  mistakes: [
    { text: "Writing <code>lowest == a</code> inside the if body instead of <code>lowest = a</code> -- double equals is comparison, single equals is assignment. Here you need assignment." },
  ],
  syntaxTip: "<code>%i</code> and <code>%d</code> are interchangeable for integers in printf/scanf. Most programmers use <code>%d</code>. The 'i' stands for integer and 'd' for decimal -- both refer to base-10 integers.",
  output: "Enter num 1: 9\nEnter num 2: 3\nEnter num 3: 7\nlowest = 3",
  rawCode: `#include <stdio.h>\n\nint main() {\n    int a, b, c, lowest = 0;\n    printf("Enter num 1: "); scanf("%i", &a);\n    printf("Enter num 2: "); scanf("%i", &b);\n    printf("Enter num 3: "); scanf("%i", &c);\n\n    if (a < b && a < c)\n        lowest = a;\n    else if (b < a && b < c)\n        lowest = b;\n    else\n        lowest = c;\n\n    printf("lowest = %d", lowest);\n    return 0;\n}`,
  tryIt: {
    desc: "Enter three numbers -- the smallest will be found.",
    inputs: [
      { id: "ti_a", label: "Number 1", type: "number", default: 9 },
      { id: "ti_b", label: "Number 2", type: "number", default: 3 },
      { id: "ti_c", label: "Number 3", type: "number", default: 7 },
    ],
    run(v){
      const a=parseFloat(v.ti_a)||0,b=parseFloat(v.ti_b)||0,c=parseFloat(v.ti_c)||0;
      const mn=Math.min(a,b,c);
      return `Numbers: ${a}, ${b}, ${c}\nlowest = ${mn}`;
    }
  }
  },
  {
  num: 6, title: "Triangle Type Checker", tag: "conditionals", tagLabel: "Conditionals", group: "practical",
  brief: "Classify a triangle as Equilateral, Isosceles, or Scalene based on its three sides.",
  concepts: ["logical AND &&","logical OR ||","equality ==","multi-value scanf"],
  explanationDetailed: `
<p>This question introduces the <strong>OR operator (<code>||</code>)</strong> -- the partner to AND. Where <code>&&</code> requires both conditions to be true, <code>||</code> only needs <em>one</em> to be true.</p>
<p><strong>Triangle types recap: </strong> Equilateral = all three sides equal. Isosceles = exactly two sides equal (any two). Scalene = no sides equal.</p>
<p><strong>Why check Equilateral first?</strong> If all three sides are equal, an equilateral triangle would also satisfy the isosceles condition (any two sides are equal). If we put isosceles first, equilateral triangles would be mislabeled. By checking equilateral first, C stops there and never reaches the isosceles branch.</p>
<p><strong>The isosceles check: </strong> There are three possible equal pairs -- side1&side2, side1&side3, or side2&side3. We use <code>||</code> to check all three possibilities in one expression. If any pair matches, it's isosceles.</p>`,
  whatHappens: [
    "All three sides are read in a single scanf.",
    "First check: are all three equal? Uses && to confirm side1==side2 AND side2==side3.",
    "If not equilateral: is any pair equal? Three comparisons joined by ||.",
    "If no pair matches: all three sides are different → Scalene."
  ],
  breakdown: [
    { code: 'scanf("%d%d%d", &s1,&s2,&s3)',       text: "Reading all three in one scanf. The format string has three <code>%d</code>s. scanf will grab the next integer for each one, separated by whitespace." },
    { code: "side1==side2 && side2==side3",         text: "If side1==side2 and side2==side3, then all three must be equal by transitivity. More elegant than checking all three pairs." },
    { code: "side1==side2 || side1==side3 || side2==side3", text: "|| chains: if ANY of these three comparisons is true, the whole condition is true → isosceles. Covers all possible equal pairs." },
    { code: "else printf(\"Scalene\")",             text: "If neither of the above matched, no sides are equal → scalene." },
  ],
  mistakes: [
    { text: "Checking isosceles before equilateral -- an equilateral triangle has equal pairs too, so it would wrongly be called isosceles." },
    { text: "Using <code>|</code> instead of <code>||</code> -- single pipe is bitwise OR, not logical OR. Use double pipe <code>||</code> for conditions." },
  ],
  syntaxTip: "<code>||</code> short-circuits too: if the first condition is true, C doesn't evaluate the rest. So <code>side1==side2 || side1==side3</code>: if side1==side2 is true, C skips the second check entirely.",
  output: "Enter three sides: 5 5 8\nIsosceles triangle.",
  rawCode: `#include <stdio.h>\n\nint main() {\n    int side1, side2, side3;\n    printf("Enter three sides: ");\n    scanf("%d%d%d", &side1, &side2, &side3);\n\n    if (side1 == side2 && side2 == side3)\n        printf("Equilateral triangle.");\n    else if (side1==side2 || side1==side3 || side2==side3)\n        printf("Isosceles triangle.");\n    else\n        printf("Scalene triangle.");\n\n    return 0;\n}`,
  tryIt: {
    desc: "Set the three sides and see the triangle type.",
    inputs: [
      { id: "ti_s1", label: "Side 1", type: "number", default: 5, min: 1 },
      { id: "ti_s2", label: "Side 2", type: "number", default: 5, min: 1 },
      { id: "ti_s3", label: "Side 3", type: "number", default: 8, min: 1 },
    ],
    run(v){
      const s1=parseFloat(v.ti_s1)||1,s2=parseFloat(v.ti_s2)||1,s3=parseFloat(v.ti_s3)||1;
      let t; if(s1==s2&&s2==s3)t='Equilateral'; else if(s1==s2||s1==s3||s2==s3)t='Isosceles'; else t='Scalene';
      return `Sides: ${s1}, ${s2}, ${s3}\n→ ${t} triangle`;
    }
  }
  },
  {
  num: 7, title: "Alphabet, Digit, or Special Char", tag: "conditionals", tagLabel: "Conditionals", group: "practical",
  brief: "Determine whether an input character is a letter, digit, or special character.",
  concepts: ["char type","ASCII values","character literals","char range comparison"],
  explanationDetailed: `
<p>This program introduces the <strong><code>char</code> data type</strong> and a critical insight: <strong>characters in C are secretly just numbers</strong>.</p>
<p><strong>What is ASCII?</strong> Every character on your keyboard has a number assigned to it -- this is called the ASCII code. The letter 'a' is stored as 97, 'b' as 98, all the way to 'z' as 122. Uppercase 'A' is 65, up to 'Z' at 90. Digits '0' to '9' are 48 to 57. Because of this ordering, you can use comparison operators (<code>>=</code>, <code><=</code>) on characters just like on numbers.</p>
<p><strong>How does the range check work?</strong> <code>ch >= 'a' && ch <= 'z'</code> checks if the character's ASCII value falls between 97 and 122 inclusive. If ch is 'm' (109), then 109>=97 is true AND 109<=122 is true → it's a lowercase letter. This works because the letters are consecutive in ASCII.</p>
<p><strong>Why check both cases?</strong> Uppercase and lowercase letters are in different ASCII ranges (65-90 and 97-122) with a gap between them. We use <code>||</code> to accept either range as a valid letter.</p>`,
  whatHappens: [
    "<code>scanf(\"%c\", &ch)</code> reads exactly one character from the keyboard.",
    "First if: checks if ch falls in lowercase (97-122) OR uppercase (65-90) range.",
    "Second else if: checks if ch is between '0' and '9' (ASCII 48-57).",
    "The else catches everything else -- punctuation, spaces, symbols -- all are special characters."
  ],
  breakdown: [
    { code: 'scanf("%c", &ch)',          text: "<code>%c</code> reads exactly one character. Including spaces and newlines. The space before <code>%c</code> in <code>\" %c\"</code> skips whitespace from previous input -- important when mixing scanf calls." },
    { code: "ch >= 'a' && ch <= 'z'",   text: "Because letters are consecutive in ASCII, this range check works perfectly. 'a'=97, 'z'=122 -- any character between them is a lowercase letter." },
    { code: "|| (ch>='A'&&ch<='Z')",    text: "OR-s in the uppercase range. 'A'=65, 'Z'=90. The two ranges are checked separately because they're not adjacent in ASCII." },
    { code: "ch >= '0' && ch <= '9'",   text: "Digit check. '0'=48, '9'=57. Note: character '5' is NOT the number 5 -- it's the number 53. Never confuse char '5' with int 5." },
  ],
  mistakes: [
    { text: "Writing <code>ch >= 'a' && ch <= 'z' || ch >= 'A' && ch <= 'Z'</code> without parentheses -- operator precedence means <code>&&</code> binds tighter than <code>||</code>, so the logic still works here, but adding parentheses makes it clearer." },
    { text: "Comparing char to an integer: <code>ch >= 97</code> works but <code>ch >= 'a'</code> is much more readable. Always use character literals like <code>'a'</code> instead of raw ASCII numbers." },
  ],
  syntaxTip: "You can do arithmetic on chars: <code>ch - 'a'</code> gives the alphabetic position (0 for 'a', 1 for 'b'…). And <code>ch + 32</code> converts uppercase to lowercase (because 'A'=65, 'a'=97, difference=32). Try it!",
  output: "Enter any character: #\n'#' is special character.",
  rawCode: `#include <stdio.h>\n\nint main() {\n    char ch;\n    printf("Enter any character: ");\n    scanf("%c", &ch);\n\n    if ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z'))\n        printf("'%c' is alphabet.", ch);\n    else if (ch >= '0' && ch <= '9')\n        printf("'%c' is digit.", ch);\n    else\n        printf("'%c' is special character.", ch);\n\n    return 0;\n}`,
  tryIt: {
    desc: "Type a character and see its type and ASCII value.",
    inputs: [
      { id: "ti_ch", label: "Enter one character", type: "text", default: "#" }
    ],
    run(v){
      const ch=(v.ti_ch||'#')[0];
      let type = "special character";
      if (/[a-zA-Z]/.test(ch)) type = "alphabet";
      else if (/[0-9]/.test(ch)) type = "digit";
      return "'" + ch + "' is " + type + ".";
    }
  }
  },


  // --------------------------------------------------------------------------------------------------------------------------------
  // PRACTICAL EXAM: SWITCH STATEMENTS (Q8 - Q10)
  // --------------------------------------------------------------------------------------------------------------------------------
  {
  num: 8, title: "Switch-based Calculator", tag: "switch", tagLabel: "Switch", group: "practical",
  brief: "Calculator that uses a switch statement on the operator character.",
  concepts: ["switch / case","break","default","fall-through bug","division by zero"],

  explanationDetailed: `
<p>The <code>switch</code> statement is C's way of branching on a single value that can match multiple specific options. Think of it as a more organized alternative to a long if/else-if chain when you're matching one variable against many possible values.</p>

<p><strong>How switch works: </strong> C evaluates the expression in parentheses (here: <code>op</code>), then jumps directly to the matching <code>case</code> label. If nothing matches, it jumps to <code>default</code>. It's faster than if/else when there are many options because C can sometimes jump directly instead of checking conditions one by one.</p>

<p><strong>The break statement — critical!</strong> After a case's code runs, C doesn't automatically stop. Without <code>break</code>, execution "falls through" and runs the next case too — and the one after that — until it hits a break or the end of the switch. This is almost always a bug for beginners. Always put <code>break;</code> at the end of every case.</p>

<p><strong>Division by zero: </strong> If the user enters <code>/</code> and b happens to be 0, <code>a / 0</code> in C with integers causes a crash (undefined behaviour). We must check <code>if (b == 0)</code> before dividing. This kind of safety check is called a guard clause.</p>`,

  whatHappens: [
    "Reads a, b (integers) and op (char — the operator symbol).",
    "<code>switch(op)</code> jumps directly to the case matching the character.",
    "That case computes and prints the result, then <code>break</code> exits the switch.",
    "The '/' case also checks for division by zero before computing.",
    "If op doesn't match +, -, *, / — the default case prints an error."
  ],

  breakdown: [
    { code: 'scanf(" %c", &op)',         text: "The <strong>space before %c is required</strong> when reading a char after integers. Without it, scanf reads the newline (Enter key press) left in the buffer from the previous input as the character." },
    { code: "switch (op)",               text: "<code>op</code> is a char — switch works with chars and ints. C compares op against each case label and jumps to the matching one." },
    { code: "case '+': ... break;",      text: "The code between <code>case '+': </code> and <code>break;</code> runs only when op is '+'. The break is like an exit door — without it, code would pour into the next case." },
    { code: "if (b == 0)",               text: "Guard against division by zero inside the '/' case. Always check before dividing, not after." },
    { code: "default: ",                  text: "The safety net. Runs if none of the cases matched. Always include a default — handle bad input gracefully." },
  ],

  mistakes: [
    { text: "Forgetting <code>break;</code> — without it, after '+' runs, the '-' case runs too, then '*', then '/' — all of them! This fall-through bug is very common." },
    { text: "Not using a space in <code>scanf(\" %c\", &op)</code> — the newline from pressing Enter after typing 'b' gets read as the operator character." },
  ],

  syntaxTip: "Sometimes fall-through is intentional — you'll see it in Q10. But for a calculator, it's always a bug. Rule of thumb: every case ends with <code>break;</code> unless you explicitly want fall-through and comment it.",

  output: "enter a: 10\nenter b: 3\nenter op: +\nsum = 13",

  rawCode: `#include <stdio.h>

int main() {
  int a, b, result;
  char op;
  printf("enter a: "); scanf("%i", &a);
  printf("enter b: "); scanf("%i", &b);
  printf("enter op: "); scanf(" %c", &op);

  switch (op) {
      case '+':
          result = a + b;
          printf("sum = %i\\n", result); break;
      case '-':
          result = a - b;
          printf("sub = %i\\n", result); break;
      case '*':
          result = a * b;
          printf("multiply = %i\\n", result); break;
      case '/':
          if (b == 0)
              printf("can't divide by zero!");
          else {
              result = a / b;
              printf("divide = %i\\n", result);
          }
          break;
      default:
          printf("invalid operator");
  }
  return 0;
}`,

  tryIt: {
    desc: "Pick two numbers and an operation.",
    inputs: [
      { id: "ti_a", label: "Number a", type: "number", default: 10 },
      { id: "ti_b", label: "Number b", type: "number", default: 3 },
      { id: "ti_op", label: "Operation", type: "select", options: ["+","-","*","/"], default: "+" },
    ],
    run(v){
      const a=parseInt(v.ti_a)||0, b=parseInt(v.ti_b)||0, op=v.ti_op;
      if(op==='/'&&b===0) return "can't divide by zero!";
      const r = op==='+'?a+b: op==='-'?a-b: op==='*'?a*b: Math.trunc(a/b);
      const labels={'+': 'sum','-': 'sub','*': 'multiply','/': 'divide'};
      return `${labels[op]} = ${r}`;
    }
  }
  },

  {
  num: 9, title: "Day of the Week by Number", tag: "switch", tagLabel: "Switch", group: "practical",
  brief: "Enter a number 1–7 and print the corresponding day name.",
  concepts: ["switch / case","integer mapping","default case","break statement"],

  explanationDetailed: `
<p>This is the simplest possible switch example — mapping integers to strings. It's perfect for understanding the switch structure before moving to more complex uses.</p>

<p><strong>When to use switch vs if/else?</strong> Use <code>switch</code> when you're matching a <em>single variable</em> against <em>multiple specific values</em>. Use <code>if/else</code> when your conditions involve ranges, multiple variables, or complex logic. For "what day is day number 3?" — switch is the ideal tool.</p>

<p><strong>What can switch match on?</strong> Only integers and characters. No strings, no floats, no expressions. Each <code>case</code> label must be a constant (like <code>1</code> or <code>'A'</code>), never a variable.</p>

<p><strong>What if the user types 8 or -1?</strong> Without a <code>default</code> case, the switch would silently do nothing and the program would end without printing anything. That's confusing for the user. The <code>default</code> case handles any input that didn't match a case — always include it.</p>`,

  whatHappens: [
    "User types a number. scanf reads it into <code>day</code>.",
    "switch evaluates <code>day</code> and jumps to the matching case.",
    "That case's printf runs, printing the day name.",
    "break exits the switch.",
    "If day is not 1–7, default runs instead."
  ],

  breakdown: [
    { code: "switch (day)",             text: "switch evaluates day once and jumps directly to the matching case label. More efficient than 7 if/else checks." },
    { code: "case 1: printf(\"Saturday\"); break;", text: "When day==1, prints Saturday, then break exits the switch immediately. Without break, it would print Saturday then Sunday then Monday..." },
    { code: "default: printf(\"incorrect...\")", text: "The catch-all. Any value not matched by cases 1–7 ends up here. Unlike cases, default doesn't need break (it's always last), but adding one is harmless." },
  ],

  mistakes: [
    { text: "Using a string in a case: <code>case \"Saturday\": </code> — this is a compile error. Switch only works with int and char values." },
    { text: "Forgetting break — if you type 1 and don't have breaks, all 7 day names print one after another." },
  ],

  syntaxTip: "The <code>default</code> case can appear anywhere in the switch (not just at the end), but putting it last is the convention. C will always check all specific cases first, then fall to default if nothing matched.",

  output: "Enter day number: 3\nToday is Monday",

  rawCode: `#include <stdio.h>

int main() {
  int day;
  printf("Enter day number: ");
  scanf(" %i", &day);

  switch (day) {
      case 1: printf("Today is Saturday");  break;
      case 2: printf("Today is Sunday");    break;
      case 3: printf("Today is Monday");    break;
      case 4: printf("Today is Tuesday");   break;
      case 5: printf("Today is Wednesday"); break;
      case 6: printf("Today is Thursday");  break;
      case 7: printf("Today is Friday");    break;
      default: printf("incorrect day number");
  }
  return 0;
}`,

  tryIt: {
    desc: "Pick a day number and see the name.",
    inputs: [
      { id: "ti_d", label: "Day number", type: "range", min: 0, max: 8, default: 3 }
    ],
    run(v){
      const d=parseInt(v.ti_d);
      const days=['','Saturday','Sunday','Monday','Tuesday','Wednesday','Thursday','Friday'];
      return d>=1&&d<=7?`Day ${d} → Today is ${days[d]}`: `Day ${d} → incorrect day number`;
    }
  }
  },

  {
  num: 10, title: "Vowel or Consonant Checker", tag: "switch", tagLabel: "Switch", group: "practical",
  brief: "Check if an entered character is a vowel (a, e, i, o, u) or not.",
  concepts: ["switch fall-through","stacked case labels","intentional fall-through","char input"],

  explanationDetailed: `
<p>This question teaches <strong>intentional fall-through</strong> — a special switch technique where you want multiple values to share the same code block.</p>

<p><strong>Stacking case labels: </strong> When you write <code>case 'a': case 'A': </code> with nothing between them, C "falls through" from the first to the second and then to the shared code. This is intentional — both 'a' and 'A' should print "Vowel". Without this trick, you'd need to duplicate the printf for every vowel variant.</p>

<p><strong>The rule: </strong> The fall-through happens because there's no <code>break</code> between the case labels. The break comes <em>after</em> the shared code block (after the printf), not between the labels. This exits the switch after printing.</p>

<p><strong>Compare to the bug in Q8: </strong> In Q8, accidentally missing a break caused fall-through — that was a bug. Here, we intentionally remove breaks between case labels to group them. The key difference: here there's no code between the stacked labels. In Q8, there was code that shouldn't have run for every case.</p>`,

  whatHappens: [
    "User types a character.",
    "switch matches it to a case label.",
    "If it matches 'a', C falls through to 'A' immediately (no code between them), then finds the printf and runs it.",
    "break exits the switch.",
    "If no vowel matched, default prints 'Not Vowel!'"
  ],

  breakdown: [
    { code: "case 'a': case 'A': ",  text: "Two case labels with nothing between them — intentional fall-through grouping. Both characters lead to the same printf below." },
    { code: "printf(\"Vowel\"); break;", text: "The shared code. Runs for both 'a' and 'A' (and 'e','E', etc. in their respective groups). The break after prevents falling into the next group." },
    { code: "default: printf(\"Not Vowel!\");", text: "Any character that isn't a vowel (upper or lower case) ends up here." },
  ],

  mistakes: [
    { text: "Putting break between the stacked labels: <code>case 'a': break; case 'A': </code> — now 'a' matches and immediately exits without printing anything. Bug!" },
  ],

  syntaxTip: "A more compact way to write this: instead of stacking case labels, use an if chain with ||. Both approaches work — the switch version is faster, the if version is more flexible. In exams, both are acceptable.",

  output: "Enter a character: e\nVowel",

  rawCode: `#include <stdio.h>

int main() {
  char character;
  printf("Enter a character: ");
  scanf(" %c", &character);

  switch (character) {
      case 'a': case 'A': printf("Vowel"); break;
      case 'e': case 'E': printf("Vowel"); break;
      case 'i': case 'I': printf("Vowel"); break;
      case 'o': case 'O': printf("Vowel"); break;
      case 'u': case 'U': printf("Vowel"); break;
      default:            printf("Not Vowel!");
  }
  return 0;
}`,

  tryIt: {
    desc: "Type a character and see if it's a vowel.",
    inputs: [
      { id: "ti_ch", label: "Enter one character", type: "text", default: "e", maxlength: 1 }
    ],
    run(v){
      const ch=((v.ti_ch)||'e')[0].toLowerCase();
      const isV='aeiou'.includes(ch);
      return `'${(v.ti_ch||'e')[0]}' → ${isV?'Vowel': 'Not Vowel!'}`;
    }
  }
  },
  {

  num: 11, title: "Sum of Even Numbers (0–100)", tag: "loops", tagLabel: "Loops",
  brief: "Use a for loop to sum all even numbers from 0 to 100. Answer: 2550.",
  concepts: ["for loop","loop anatomy","accumulator pattern","i+=2 step","sum calculation"],

  explanationDetailed: `
<p>This program teaches the <strong>for loop</strong> and the <strong>accumulator pattern</strong> — two of the most fundamental tools in programming.</p>

<p><strong>Anatomy of a for loop: </strong> <code>for (initialize; condition; update)</code>. These three parts happen at specific times: initialize runs <em>once</em> at the start. Condition is checked <em>before</em> every iteration — if it's false, the loop stops. Update runs <em>after</em> every iteration body. So the flow is: init → check → body → update → check → body → update → ... → check (false) → done.</p>

<p><strong>What is an accumulator?</strong> A variable that collects (accumulates) values over multiple loop iterations. It starts at the identity value (0 for addition) and grows each iteration. After the loop, it holds the total. This pattern is everywhere in programming.</p>

<p><strong>The i += 2 trick: </strong> Instead of looping over every number 0–100 and checking if it's even (100 iterations), we step by 2 (i += 2) and only visit even numbers (51 iterations). Smarter and faster. The update expression can be anything — not just <code>i++</code>.</p>`,

  whatHappens: [
    "i starts at 0, sum starts at 0.",
    "Check: is 0 <= 100? Yes → body runs: sum = 0+0 = 0. Update: i = 0+2 = 2.",
    "Check: is 2 <= 100? Yes → body: sum = 0+2 = 2. Update: i = 4.",
    "This continues for i = 0, 2, 4, 6, ... 100.",
    "When i becomes 102, the condition 102 <= 100 is false — loop exits.",
    "printf prints sum, which is now 2550."
  ],

  breakdown: [
    { code: "int i, sum = 0;",          text: "<code>sum</code> is the accumulator. It MUST start at 0. If it started at any other value, the total would be off by that amount." },
    { code: "for (i=0; i<=100; i+=2)",  text: "Three-part for loop. Init: i=0. Condition: i must be <= 100. Update: i increases by 2 each time. This visits only even numbers." },
    { code: "sum = sum + i;",           text: "The accumulator step. The right side (sum+i) is computed first, then assigned back to sum. Shorthand: <code>sum += i</code>." },
    { code: 'printf("...= %d", sum)',   text: "Printed once, after the loop. The loop ran 51 times (i=0,2,4,...100) building up sum to 2550." },
  ],

  mistakes: [
    { text: "Writing <code>i < 100</code> instead of <code>i <= 100</code> — then 100 isn't included and the sum is 2450 instead of 2550." },
    { text: "Starting sum at 1 instead of 0 — the total would be 2551." },
    { text: "Using <code>i + 2</code> in the update instead of <code>i += 2</code> — <code>i + 2</code> computes but doesn't save back to i, so i never changes and the loop runs forever." },
  ],

  syntaxTip: "The three parts of a for loop can be omitted: <code>for(;;)</code> is an infinite loop (same as <code>while(1)</code>). <code>for(;i<10;i++)</code> skips initialization. This flexibility is why for loops are so powerful.",

  output: "sum of even numbers = 2550",

  rawCode: `#include <stdio.h>

int main() {
  int i, sum = 0;

  for (i = 0; i <= 100; i += 2) {
      sum = sum + i;
  }

  printf("sum of even numbers = %d\\n", sum);
  return 0;
}`,

  tryIt: {
    desc: "Change the upper limit and step size to explore different sums.",
    inputs: [
      { id: "ti_max", label: "Upper limit", type: "number", default: 100, min: 0, max: 10000 },
      { id: "ti_step", label: "Step size (1=all, 2=even, 3=every-3rd…)", type: "number", default: 2, min: 1, max: 20 },
    ],
    run(v){
      let max=parseInt(v.ti_max)||100, step=parseInt(v.ti_step)||2;
      if(max<0||step<1) return "Invalid input";
      let sum=0,count=0;
      for(let i=0;i<=max;i+=step){sum+=i;count++;}
      return `Sum from 0 to ${max} (step ${step}) = ${sum}\n(${count} numbers added)`;
    }
  }
  },

  {
  num: 12, title: "Factorial Calculator (N!)", tag: "loops", tagLabel: "Loops", group: "practical",
  brief: "Compute N! = 1 × 2 × 3 × … × N using a for loop.",
  concepts: ["for loop","product accumulator","factorial","multiplicative identity","integer overflow"],

  explanationDetailed: `
<p>Factorial is one of the most famous mathematical operations and a perfect example of the <strong>product accumulator</strong> pattern.</p>

<p><strong>What is N! (N factorial)?</strong> It means: multiply all integers from 1 up to N together. So 4! = 1×2×3×4 = 24. And 6! = 1×2×3×4×5×6 = 720.</p>

<p><strong>Why start f at 1, not 0?</strong> This is the most common mistake beginners make here. We're multiplying, not adding. The "neutral element" for multiplication is 1 (multiplying by 1 doesn't change the value). The neutral element for addition is 0. If you start f at 0, the very first multiplication gives 0×1=0, and then every subsequent multiplication also gives 0. The result is always 0. Always initialize a product accumulator to 1.</p>

<p><strong>What is integer overflow?</strong> An <code>int</code> in C can hold values up to about 2,147,483,647. Factorial grows very fast: 13! = 6,227,020,800 — which exceeds this limit. If N > 12, the result "wraps around" and gives a wrong negative number. This is called integer overflow. For larger factorials, you'd use <code>long long</code>.</p>`,

  whatHappens: [
    "Read N. Initialize f=1.",
    "Loop from i=1 to i=N.",
    "Each iteration: f = f × i. (f starts at 1, becomes 1, 2, 6, 24 for N=4)",
    "After loop, print f."
  ],

  breakdown: [
    { code: "int f = 1;",              text: "Product accumulator. MUST be 1. Starting at 0 would make the result always 0 because anything times 0 is 0." },
    { code: "for (i=1; i<=N; i++)",    text: "Start at i=1, not i=0. Multiplying by 0 would reset everything. i goes up to N inclusive." },
    { code: "f = f * i;",             text: "Each iteration multiplies in one more factor. For N=4: f=1→1×1=1→1×2=2→2×3=6→6×4=24." },
  ],

  mistakes: [
    { text: "Initializing <code>f = 0</code> — the result is always 0. This is the #1 factorial mistake." },
    { text: "Starting loop at i=0 — multiplying by 0 on first iteration gives 0." },
    { text: "Computing 13! or higher with int — results in overflow and a wrong negative answer." },
  ],

  syntaxTip: "Test: what is 0! (zero factorial)? Mathematically it equals 1. The loop <code>for(i=1; i<=0; i++)</code> never runs, so f stays at 1 — correct! C gets this right automatically.",

  output: "Enter factorial: 6\nfactorial = 720",

  rawCode: `#include <stdio.h>

int main() {
  int N, i, f = 1;
  printf("Enter factorial: ");
  scanf("%i", &N);

  for (i = 1; i <= N; i++) {
      f = f * i;
  }

  printf("factorial = %i\\n", f);
  return 0;
}`,

  tryIt: {
    desc: "Enter N and see N! computed step by step.",
    inputs: [
      { id: "ti_n", label: "N (try 0–12, overflow happens at 13+)", type: "range", min: 0, max: 15, default: 6 }
    ],
    run(v){
      const n=parseInt(v.ti_n);
      let f=1,steps=[];
      for(let i=1;i<=n;i++){f*=i;if(i<=6||i===n)steps.push(`${i}! = ${f}`);}
      if(n>6&&steps[steps.length-1]!==`${n}! = ${f}`) steps.push(`...`,`${n}! = ${f}`);
      if(n>12) steps.push(`⚠ int overflow! Use long long for N>12`);
      return steps.join('\n')||`0! = 1`;
    }
  }
  },

  {
  num: 13, title: "Power: x^y", tag: "loops", tagLabel: "Loops", group: "practical",
  brief: "Calculate x raised to the power y (x^y) without using math.h.",
  concepts: ["for loop","exponentiation","product accumulator","repeated multiplication"],

  explanationDetailed: `
<p>Raising a number to a power means multiplying it by itself repeatedly. x^y = x × x × x × ... (y times). This is just the product accumulator from Q12, but instead of multiplying by i (1, 2, 3...) we multiply by the same number (base) every time.</p>

<p><strong>Why not just use pow()?</strong> C has a built-in power function <code>pow(base, power)</code> in <code>math.h</code>. But learning to implement it yourself teaches the core loop pattern. Also, <code>pow()</code> returns a <code>double</code> (decimal number) — for integer powers, this manual approach with integers avoids floating-point rounding issues.</p>

<p><strong>Tracing the loop for base=2, power=4: </strong><br>
Start: p=1<br>
i=1: p = 1 × 2 = 2<br>
i=2: p = 2 × 2 = 4<br>
i=3: p = 4 × 2 = 8<br>
i=4: p = 8 × 2 = 16<br>
Loop ends (i=5 > 4). Print: 16. Correct: 2^4=16. ✓</p>`,

  whatHappens: [
    "Read base and power.",
    "Initialize p=1 (product accumulator).",
    "Loop from 1 to power, multiplying p by base each time.",
    "Print p — it holds base^power."
  ],

  breakdown: [
    { code: "int p = 1;",               text: "Product accumulator starting at 1. Each loop iteration multiplies in one factor of base." },
    { code: "for (i=1; i<=power; i++)", text: "Runs exactly 'power' times. Each run multiplies p by base once more." },
    { code: "p = p * base;",            text: "The key line. After 'power' iterations, p contains base multiplied by itself 'power' times = base^power." },
  ],

  mistakes: [
    { text: "Starting loop at i=0 still works here (unlike factorial, we're not multiplying by i), but it means one extra multiplication — result would be base^(power+1). Start at i=1." },
  ],

  syntaxTip: "What about negative powers? x^(-y) = 1/(x^y). You'd need to change p to <code>float</code> and divide instead of multiply when power is negative. Try extending the code in your notes!",

  output: "Enter base: 2\nEnter power: 4\nresult = 16",

  rawCode: `#include <stdio.h>

int main() {
  int i, base, power, p = 1;
  printf("Enter base: ");  scanf("%i", &base);
  printf("Enter power: "); scanf("%i", &power);

  for (i = 1; i <= power; i++) {
      p = p * base;
  }

  printf("result = %i\\n", p);
  return 0;
}`,

  tryIt: {
    desc: "Try different base and power values.",
    inputs: [
      { id: "ti_b", label: "Base (x)", type: "number", default: 2 },
      { id: "ti_p", label: "Power (y)", type: "number", default: 4, min: 0, max: 30 },
    ],
    run(v){
      const b=parseInt(v.ti_b)||0, p=parseInt(v.ti_p)||0;
      if(p===0) return `${b}^0 = 1 (anything to power 0 is 1)`;
      let result=1;
      for(let i=1;i<=p;i++) result*=b;
      return `${b}^${p} = ${result}`;
    }
  }
  },

  {
  num: 14, title: "Count Odd & Even Inputs", tag: "loops", tagLabel: "Loops", group: "practical",
  brief: "Read integers until >= 1000 is entered, then print the count of odd and even numbers.",
  concepts: ["while(1) infinite loop","break","sentinel-controlled loop","++ increment","counter pattern"],

  explanationDetailed: `
<p>This program introduces the <strong>sentinel-controlled loop</strong> — a loop that runs indefinitely until a special "stop" value (the sentinel) is encountered.</p>

<p><strong>What is while(1)?</strong> The condition <code>1</code> is always true in C (non-zero = true). So <code>while(1)</code> creates an infinite loop that runs forever. The only way out is a <code>break</code> statement. This is a standard C idiom — you'll see it often in real programs.</p>

<p><strong>What is a sentinel value?</strong> A special input that signals "stop reading". Here, any number >= 1000 is the sentinel. The program processes every number below 1000, then stops when it sees 1000 or above. The sentinel itself is NOT counted or classified.</p>

<p><strong>The ++ operator: </strong> <code>counteven++</code> is shorthand for <code>counteven = counteven + 1</code>. It's called the increment operator and is so common in C that the language was named "C++" as a joke (C incremented).</p>`,

  whatHappens: [
    "Enter infinite loop: while(1).",
    "Read a number into <code>number</code>.",
    "Check: is number >= 1000? Yes → break (exit loop immediately).",
    "No → classify: even (counteven++) or odd (countodd++).",
    "Loop again. Repeat from step 2.",
    "After break: print both counters."
  ],

  breakdown: [
    { code: "while (1)",               text: "Infinite loop. 1 is always true. Only a break statement inside can exit this loop." },
    { code: "if (number >= 1000) break;", text: "The sentinel check. When triggered, break exits the while loop immediately — the program jumps past the closing }. The number >= 1000 is NOT classified." },
    { code: "counteven++;",             text: "Increment operator: adds 1 to counteven. Equivalent to <code>counteven = counteven + 1</code>. Runs only when the number is even." },
    { code: "countodd++;",              text: "Same idea for odd numbers. Both counters start at 0 and grow by 1 for each matching number." },
  ],

  mistakes: [
    { text: "Not checking for the sentinel before classifying — if you count first and check sentinel after, 1000 itself gets classified as even (1000%2==0), giving a wrong count." },
    { text: "Putting break in the wrong place — it must be inside the while's body, not outside it." },
  ],

  syntaxTip: "<code>break</code> exits only the innermost loop or switch. If you have nested loops, <code>break</code> only exits the inner one. To break out of nested loops, you'd need a flag variable or <code>goto</code> (which is rarely used).",

  output: "enter your numbers = 4\nenter your numbers = 7\nenter your numbers = 1000\nodd=1 and even=1",

  rawCode: `#include <stdio.h>

int main() {
  int countodd = 0, counteven = 0, number;

  while (1) {
      printf("enter your numbers = ");
      scanf("%d", &number);

      if (number >= 1000)
          break;
      else if (number % 2 == 0)
          counteven++;
      else
          countodd++;
  }

  printf("odd=%d and even=%d\\n", countodd, counteven);
  return 0;
}`,

  tryIt: {
    desc: "Enter a series of numbers (comma-separated), and the program counts odds and evens. Numbers >= 1000 stop the counting.",
    inputs: [
      { id: "ti_nums", label: "Enter numbers separated by commas (e.g. 4,7,12,3,1000)", type: "text", default: "4,7,12,3,1000" }
    ],
    run(v){
      const parts=(v.ti_nums||'').split(',').map(s=>parseInt(s.trim())).filter(n=>!isNaN(n));
      let even=0,odd=0,processed=[];
      for(const n of parts){
        if(n>=1000){processed.push(`${n} → STOP (sentinel)`);break;}
        if(n%2===0){even++;processed.push(`${n} → even (evens: ${even})`);}
        else{odd++;processed.push(`${n} → odd (odds: ${odd})`);}
      }
      return processed.join('\n')+`\n\nResult: odd=${odd} and even=${even}`;
    }
  }
  },

  {
  num: 15, title: "do-while: Print 10 to 19", tag: "loops", tagLabel: "Loops", group: "practical",
  brief: "Use a do-while loop to print values of variable a from 10 to 19.",
  concepts: ["do-while loop","post-condition","guaranteed first execution","semicolon after while"],

  explanationDetailed: `
<p>C has three loop types: <code>for</code>, <code>while</code>, and <code>do-while</code>. The key difference of <code>do-while</code>: it checks the condition <em>at the bottom</em>, meaning the loop body always runs at least once.</p>

<p><strong>while vs do-while — when does it matter?</strong></p>
<p><strong>while: </strong> checks condition first → if false from the start, body never runs (0 or more times).<br>
<strong>do-while: </strong> runs body first → checks condition → if false, stops (1 or more times).</p>

<p>If <code>a</code> started at 25 in this program: a <code>while(a < 20)</code> would check 25 < 20 (false) and never print anything. A <code>do-while</code> would print 25 first, then check and stop. For this specific program where a starts at 10, both would give the same result — but the choice of loop communicates your intent to the reader.</p>

<p><strong>The mandatory semicolon: </strong> <code>} while (a < 20);</code> — that semicolon after the closing parenthesis is required for do-while. It's unique to do-while and very easy to forget. Without it, the compiler gives an error.</p>`,

  whatHappens: [
    "a starts at 10.",
    "Body executes: print a (prints 10). Then a = a+1 = 11.",
    "Condition checked: 11 < 20? Yes → go back to body.",
    "Body executes: print 11. a becomes 12.",
    "...continues until a = 20.",
    "Condition: 20 < 20? No → loop exits. 10 numbers printed (10–19)."
  ],

  breakdown: [
    { code: "int a = 10;",          text: "Initialize before the do-while. Unlike for loops, initialization is separate — done before the loop keyword." },
    { code: "do {",                 text: "The do keyword starts the loop. The body runs immediately, no condition is checked yet." },
    { code: "printf(\"value of a: %d\\n\", a); a = a + 1;", text: "Print current value, then increment. After printing 19, a becomes 20." },
    { code: "} while (a < 20);",   text: "The condition is checked AFTER the body runs. When a=20, 20<20 is false and the loop exits. Note the semicolon — it's mandatory here!" },
  ],

  mistakes: [
    { text: "Forgetting the semicolon after <code>while(a < 20)</code> — compile error." },
    { text: "Putting the increment after the while condition instead of inside the body — a would never change and you'd have an infinite loop." },
  ],

  syntaxTip: "<code>a = a + 1</code>, <code>a += 1</code>, and <code>a++</code> all do the same thing. In loops, <code>a++</code> is most compact. <code>++a</code> (prefix) also increments but returns the new value; <code>a++</code> (postfix) returns the old value — the difference matters when used inside expressions.",

  output: "value of a: 10\nvalue of a: 11\n...\nvalue of a: 19",

  rawCode: `#include <stdio.h>

int main() {
  int a = 10;

  do {
      printf("value of a: %d\\n", a);
      a = a + 1;
  } while (a < 20);

  return 0;
}`,

  tryIt: {
    desc: "Change the start and end values to see the do-while in action.",
    inputs: [
      { id: "ti_start", label: "Start value", type: "number", default: 10 },
      { id: "ti_end", label: "Stop when value reaches", type: "number", default: 20 },
    ],
    run(v){
      let a=parseInt(v.ti_start)||10, end=parseInt(v.ti_end)||20;
      if(end<=a+1) return `Start must be less than end!`;
      let lines=[],count=0;
      do{
        if(count<10) lines.push(`value of a: ${a}`);
        else if(count===10) lines.push(`... (showing first 10)`);
        a++;count++;
        if(count>200) break;
      }while(a<end);
      lines.push(`\n${count} values printed (${parseInt(v.ti_start)} to ${end-1})`);
      return lines.join('\n');
    }
  }
  },

  {
  num: 16, title: "Grade Counter with do-while", tag: "loops", tagLabel: "Loops", group: "practical",
  brief: "Count students with grades A, B, C, F — stop when 'X' is entered.",
  concepts: ["do-while","getchar()","character comparison","sentinel termination","multiple counters"],

  explanationDetailed: `
<p>This program combines do-while with <code>getchar()</code> — a character-reading function — and shows how to count multiple categories at once.</p>

<p><strong>What is getchar()?</strong> It reads exactly one character from the keyboard input, including spaces and newlines. Unlike <code>scanf("%c")</code>, it's simpler and always reads one character. Every time you press Enter, getchar can read the letters AND the newline character (\n) that Enter produces.</p>

<p><strong>Why do-while here?</strong> We always need to read at least one grade before we can check if it's the stop character. do-while's "run first, check after" behavior matches this logic perfectly — we read, then decide whether to continue.</p>

<p><strong>Why are spaces ignored?</strong> When you type "A B C X" and press Enter, getchar reads A, then space, then B, then space, then C, then space, then X, then newline. The spaces and newlines don't match 'A', 'B', 'C', or 'F', so they fall through all the if conditions and nothing happens for them. They're silently skipped. This is a handy side effect.</p>`,

  whatHappens: [
    "do { body } while condition",
    "Body: getchar() reads one character from keyboard.",
    "if/else if chain checks which grade it is and increments the right counter.",
    "while condition: is the character NOT 'X'? If not X → repeat.",
    "When X is read, the condition grade != 'X' becomes false → loop exits.",
    "Print all four counters."
  ],

  breakdown: [
    { code: "grade = getchar();",      text: "Reads one character at a time. Also reads spaces and newlines — but those don't match any grade letter, so they're harmlessly ignored." },
    { code: "if (grade=='A') countA++", text: "Compare char to char literal 'A'. If they match, increment that counter. The <code>++</code> adds 1." },
    { code: "} while (grade != 'X');", text: "<code>!=</code> means 'not equal'. The loop continues as long as the last character read was NOT 'X'. When X is read and body finishes, this condition fails." },
  ],

  mistakes: [
    { text: "Using <code>grade != \"X\"</code> (with double quotes) — double quotes make a string, single quotes make a char. <code>\"X\"</code> is a string; <code>'X'</code> is a character. Switch only works with chars/ints, not strings." },
  ],

  syntaxTip: "<code>!=</code> means 'not equal'. Opposite of <code>==</code>. Similarly: <code>>=</code> is 'greater than or equal', <code><=</code> is 'less than or equal', <code>></code> and <code><</code> are strict comparisons.",

  output: "enter grade: \nA B C A F X\nA: 2 B: 1 C: 1 F: 1",

  rawCode: `#include <stdio.h>

int main() {
  int countA=0, countB=0, countC=0, countf=0;
  char grade;
  printf("enter grade: \\n");

  do {
      grade = getchar();
      if      (grade == 'A') countA++;
      else if (grade == 'B') countB++;
      else if (grade == 'C') countC++;
      else if (grade == 'F') countf++;
  } while (grade != 'X');

  printf("A: %d B: %d C: %d F: %d\\n", countA, countB, countC, countf);
  return 0;
}`,

  tryIt: {
    desc: "Enter grade letters (A, B, C, F) — spaces are ignored. End with X.",
    inputs: [
      { id: "ti_grades", label: "Grades (e.g.: A B C A F X)", type: "text", default: "A B C A F X" }
    ],
    run(v){
      const s=(v.ti_grades||'').toUpperCase();
      let a=0,b=0,c=0,f=0;
      for(const ch of s){
        if(ch==='X') break;
        if(ch==='A') a++;
        else if(ch==='B') b++;
        else if(ch==='C') c++;
        else if(ch==='F') f++;
      }
      return `A: ${a}  B: ${b}  C: ${c}  F: ${f}\nTotal graded: ${a+b+c+f}`;
    }
  }
  },

  {
  num: 17, title: "Sum of 4 Subject Scores", tag: "arrays", tagLabel: "Arrays/Input", group: "practical",
  brief: "Use a for loop to read 4 subject scores and print their total.",
  concepts: ["for loop","sum accumulator","loop-driven I/O","reusing variables","+="],

  explanationDetailed: `
<p>This program applies the accumulator pattern to <em>user input</em> — reading multiple values with a loop instead of writing multiple scanf calls.</p>

<p><strong>The problem with writing it without a loop: </strong> You'd need <code>scanf, scanf, scanf, scanf</code> — four separate lines. If the teacher changes it to 8 subjects, you rewrite 4 more lines. With a loop, you just change one number: <code>i <= 4</code> becomes <code>i <= 8</code>. Loops make code scalable.</p>

<p><strong>The reused variable trick: </strong> Notice we only have one variable <code>x</code> for all four scores, not four separate variables. Each iteration, scanf overwrites whatever was in x with the new score. We don't need the old value because we already added it to <code>sum</code>. This is a common pattern — use a temporary variable for input, accumulate into a separate total.</p>

<p><strong>What is +=?</strong> The compound assignment operator. <code>sum += x</code> means exactly <code>sum = sum + x</code>. There are similar operators for all arithmetic: <code>-=</code>, <code>*=</code>, <code>/=</code>, <code>%=</code>. They're shorter to write and often used in loops.</p>`,

  whatHappens: [
    "sum starts at 0.",
    "Loop iteration 1 (i=1): scanf reads score into x. sum = 0 + x.",
    "Loop iteration 2 (i=2): scanf reads NEW score into x (overwriting old). sum = sum + x.",
    "Iterations 3 and 4: same pattern.",
    "After loop (i=5, fails i<=4): print sum."
  ],

  breakdown: [
    { code: "int i, x, sum = 0;",         text: "Three variables. <code>sum</code>=accumulator (starts 0). <code>x</code>=temporary input holder (reused each iteration). <code>i</code>=loop counter." },
    { code: "for (i=1; i<=4; i++)",        text: "Starts at 1 (first subject). Runs while i <= 4 (four subjects). Increments by 1. Body runs exactly 4 times." },
    { code: 'scanf("%d", &x);',            text: "Reads the next score into x. Overwrites whatever was there before. The old value was already saved in sum." },
    { code: "sum = sum + x;",              text: "Add this score to running total. Equivalent shorthand: <code>sum += x</code>." },
  ],

  mistakes: [
    { text: "Starting loop at i=0 and condition i<4 also runs 4 times, but starting at i=1 and i<=4 is more natural for counting subjects." },
  ],

  syntaxTip: "<code>sum += x</code> is shorthand for <code>sum = sum + x</code>. You can chain more: <code>-=</code> subtracts, <code>*=</code> multiplies, <code>/=</code> divides. These are compound assignment operators.",

  output: "Enter score of each subject: \n85 90 75 88\nThe total score is: 338",

  rawCode: `#include <stdio.h>

int main() {
  int i, x, sum = 0;
  printf("Enter score of each subject: \\n");

  for (i = 1; i <= 4; i++) {
      scanf("%d", &x);
      sum = sum + x;
  }

  printf("The total score is: %d", sum);
  return 0;
}`,

  tryIt: {
    desc: "Enter up to 4 scores (comma-separated) and see the total.",
    inputs: [
      { id: "ti_s1", label: "Score 1", type: "number", default: 85, min: 0, max: 100 },
      { id: "ti_s2", label: "Score 2", type: "number", default: 90, min: 0, max: 100 },
      { id: "ti_s3", label: "Score 3", type: "number", default: 75, min: 0, max: 100 },
      { id: "ti_s4", label: "Score 4", type: "number", default: 88, min: 0, max: 100 },
    ],
    run(v){
      const scores=[parseFloat(v.ti_s1)||0,parseFloat(v.ti_s2)||0,parseFloat(v.ti_s3)||0,parseFloat(v.ti_s4)||0];
      const sum=scores.reduce((a,b)=>a+b,0);
      const avg=(sum/4).toFixed(1);
      return scores.map((s,i)=>`Subject ${i+1}: ${s}`).join('\n')+`\n\nTotal = ${sum}\nAverage = ${avg}`;
    }
  }
  },

  {
  num: 18, title: "Salary Sum — Stop at $5000", tag: "loops", tagLabel: "Loops", group: "practical",
  brief: "Keep adding salaries until the total reaches or exceeds $5000, then print the sum.",
  concepts: ["while loop","threshold condition","accumulator","pre-condition check","loop exit"],

  explanationDetailed: `
<p>This program uses a standard <code>while</code> loop controlled by a threshold — the loop runs as long as a condition is true, and stops naturally when the condition becomes false.</p>

<p><strong>while vs do-while revisited: </strong> Here we use <code>while(sum <= 5000)</code>. This checks the condition BEFORE the body runs each time. If sum somehow started above 5000, the loop would never execute. This makes sense here — if we somehow already have enough, we shouldn't ask for more salary input.</p>

<p><strong>Why might the final sum exceed 5000?</strong> Because we check the condition before reading input, but we add the salary before checking again. If sum is 4800 and we enter 1000, sum becomes 5800. Then we check: 5800 <= 5000? False. Loop exits with sum at 5800. The loop condition is checked before each new iteration, not immediately after adding.</p>

<p><strong>Flow trace: </strong><br>
sum=0 → check 0<=5000 (true) → read 2000 → sum=2000<br>
check 2000<=5000 (true) → read 2000 → sum=4000<br>
check 4000<=5000 (true) → read 1500 → sum=5500<br>
check 5500<=5000 (false) → exit → print 5500</p>`,

  whatHappens: [
    "sum=0. Check: 0<=5000? Yes → enter loop.",
    "Read salary into x. Add to sum.",
    "Loop back to check: is sum still <= 5000?",
    "Repeat until sum exceeds 5000.",
    "When condition fails, exit loop and print sum."
  ],

  breakdown: [
    { code: "while (sum <= 5000)",     text: "Pre-condition check. The body only runs when this is true. When sum exceeds 5000, this is false and the loop stops." },
    { code: 'printf("Enter salary: "); scanf("%d", &x);', text: "Prompt and read inside the loop — each iteration gets one more salary entry from the user." },
    { code: "sum = sum + x;",          text: "Add new salary to running total. After this line, if sum > 5000, the condition will fail next time the while is checked." },
  ],

  mistakes: [
    { text: "Writing <code>while (sum < 5000)</code> instead of <code><=</code> — if sum reaches exactly 5000, we'd ask for one more salary unnecessarily." },
  ],

  syntaxTip: "The three loop types have different use cases: <code>for</code> = known count. <code>while</code> = unknown count, condition-driven. <code>do-while</code> = always at least once. When unsure, while is the safest default.",

  output: "Enter the salary: 2000\nEnter the salary: 2000\nEnter the salary: 1500\nThe sum of salaries will be: 5500",

  rawCode: `#include <stdio.h>

int main() {
  int x, sum = 0;

  while (sum <= 5000) {
      printf("Enter the salary: ");
      scanf("%d", &x);
      sum = sum + x;
  }

  printf("The sum of salaries will be: %d", sum);
  return 0;
}`,

  tryIt: {
    desc: "Enter salaries one by one (comma-separated). The loop stops when total exceeds your threshold.",
    inputs: [
      { id: "ti_threshold", label: "Stop threshold ($)", type: "number", default: 5000, min: 1 },
      { id: "ti_salaries", label: "Salaries (comma-separated)", type: "text", default: "2000,2000,1500" },
    ],
    run(v){
      const thresh=parseInt(v.ti_threshold)||5000;
      const parts=(v.ti_salaries||'').split(',').map(s=>parseInt(s.trim())).filter(n=>!isNaN(n));
      let sum=0,lines=[];
      for(const s of parts){
        if(sum>thresh) break;
        sum+=s;
        lines.push(`Enter salary: ${s}  →  running total: ${sum}`);
      }
      lines.push(`\nThe sum of salaries will be: ${sum}`);
      if(sum<=thresh) lines.push(`(total didn't reach ${thresh} — add more salaries)`);
      return lines.join('\n');
    }
  }
  },

  {
  num: 19, title: "Divisibility Check", tag: "conditionals", tagLabel: "Conditionals", group: "practical",
  brief: "Check if the first number is divisible by the second number.",
  concepts: ["modulus %","divisibility","if / else","zero guard","% use cases"],

  explanationDetailed: `
<p>This program revisits the modulus operator from Q2 but in a more general context: checking if any number divides perfectly into any other.</p>

<p><strong>What does "divisible" mean?</strong> num1 is divisible by num2 if dividing gives a whole number with no remainder. 15 ÷ 5 = 3 exactly (remainder 0) → divisible. 14 ÷ 5 = 2 remainder 4 → not divisible.</p>

<p><strong>The modulus operator again: </strong> <code>num1 % num2</code> gives the remainder. If it's 0, there's no remainder → perfectly divisible. If it's anything else → not divisible. It's that simple.</p>

<p><strong>A missing safety guard: </strong> This program has a flaw — it doesn't check if num2 is 0 before computing <code>num1 % num2</code>. Dividing or using modulus with 0 as the divisor causes undefined behavior in C (usually a crash). In a real program you should always check <code>if (num2 == 0)</code> first. Q20 shows you how to add this guard for division.</p>

<p><strong>Real uses of divisibility: </strong> Checking if a year is a leap year (divisible by 4). FizzBuzz (divisible by 3, by 5). Finding multiples. Checking if a number is prime (not divisible by anything except 1 and itself).</p>`,

  whatHappens: [
    "Read num1 and num2.",
    "Compute num1 % num2 (the remainder).",
    "If remainder is 0: divisible → print message.",
    "If remainder is anything else: not divisible → print other message."
  ],

  breakdown: [
    { code: "int num1, num2;",           text: "Two integer inputs. No need for float — divisibility is an integer concept." },
    { code: "num1 % num2 == 0",          text: "The divisibility test. % gives the remainder. ==0 checks if there is none. If true: num1 divides evenly by num2." },
    { code: 'printf("divisible")',        text: "Only one printf runs — either the if branch or the else branch, never both." },
  ],

  mistakes: [
    { text: "Not guarding against num2=0 — <code>num1 % 0</code> crashes the program. Always validate user input before using it in operations that can fail." },
  ],

  syntaxTip: "Common divisibility patterns: <code>n%2==0</code>=even, <code>n%3==0</code>=multiple of 3, <code>n%10==0</code>=multiple of 10 (ends in 0), <code>n%100==0</code>=multiple of 100.",

  output: "Enter num 1: 15\nEnter num 2: 5\nThe first number is divisible by the second",

  rawCode: `#include <stdio.h>

int main() {
  int num1, num2;
  printf("Enter num 1: "); scanf("%d", &num1);
  printf("Enter num 2: "); scanf("%d", &num2);

  if (num1 % num2 == 0)
      printf("The first number is divisible by the second");
  else
      printf("The first number isn't divisible by the second");

  return 0;
}`,

  tryIt: {
    desc: "Test any two numbers for divisibility.",
    inputs: [
      { id: "ti_n1", label: "First number (num1)", type: "number", default: 15 },
      { id: "ti_n2", label: "Second number (num2)", type: "number", default: 5 },
    ],
    run(v){
      const n1=parseInt(v.ti_n1)||0, n2=parseInt(v.ti_n2)||0;
      if(n2===0) return `Cannot check — num2 is 0!\n(Division by zero would crash the program)`;
      const rem=Math.abs(n1%n2);
      const div=rem===0;
      return `${n1} % ${n2} = ${rem}\n${n1} is ${div?'': 'NOT '}divisible by ${n2}`;
    }
  }
  },

  {
  num: 20, title: "Safe Division with Zero Check", tag: "conditionals", tagLabel: "Conditionals", group: "practical",
  brief: "Divide two floats, but print an error message if the divisor is zero.",
  concepts: ["division by zero guard","float division","%f format","defensive programming","inf / nan"],

  explanationDetailed: `
<p>This is the final program and teaches a critical concept: <strong>defensive programming</strong> — writing code that handles bad inputs gracefully instead of crashing.</p>

<p><strong>What happens if you divide by zero in C?</strong></p>
<p>With integers (<code>int a = 5; int b = 0; a/b</code>): the program crashes with a signal (SIGFPE — Floating Point Exception, despite being integers). It's undefined behavior — the worst kind of bug.</p>
<p>With floats (<code>float a = 5.0; float b = 0.0; a/b</code>): C follows the IEEE 754 standard and produces <code>inf</code> (infinity) or <code>nan</code> (not a number). No crash, but the result is mathematically meaningless.</p>

<p><strong>The guard pattern: </strong> Always check the divisor before dividing. This is called a guard clause. Check first, act second. The pattern appears everywhere in real C programs: check for NULL pointers before dereferencing, check file opened before reading, check range before array access.</p>

<p><strong>Why float here?</strong> Using <code>float</code> instead of <code>int</code> means 7/2 = 3.5 (not 3). When dividing two numbers and you care about the exact result, use float.</p>`,

  whatHappens: [
    "Read num1 and num2 as floats.",
    "Check: is num2 equal to 0?",
    "If yes: print error message and skip the division entirely.",
    "If no (safe to divide): compute res = num1/num2 and print it."
  ],

  breakdown: [
    { code: "float num1, num2, res;",  text: "Using float for both inputs and result. This preserves decimal answers like 3.333333." },
    { code: 'scanf("%f", &num1);',     text: "<code>%f</code> reads a float. For <code>double</code> type, you'd use <code>%lf</code>. Always match the format specifier to the variable type." },
    { code: "if (num2 == 0)",          text: "The guard. Checked BEFORE dividing — not after. If num2 is 0, we never reach the division line." },
    { code: "res = num1 / num2;",      text: "Float division. Only reached when num2 is non-zero (safe). The result is stored in res then printed." },
  ],

  mistakes: [
    { text: "Comparing floats with == is generally unreliable due to floating-point precision. <code>0.1 + 0.2 == 0.3</code> can be false in C! For zero specifically, it's fine — but for other values, compare with a small tolerance: <code>if (fabs(x) < 0.0001)</code>." },
  ],

  syntaxTip: "<code>%f</code> prints 6 decimal places. <code>%.2f</code> = 2 places. <code>%e</code> = scientific notation. <code>%g</code> = whichever is shorter of %f and %e. For <code>double</code> type: printf still uses <code>%f</code>, but scanf uses <code>%lf</code>.",

  output: "Enter num 1: 10\nEnter num 2: 0\ncannot divide",

  rawCode: `#include <stdio.h>

int main() {
  float num1, num2, res;
  printf("Enter num 1: "); scanf("%f", &num1);
  printf("Enter num 2: "); scanf("%f", &num2);

  if (num2 == 0) {
      printf("cannot divide");
  } else {
      res = num1 / num2;
      printf("divide = %f", res);
  }
  return 0;
}`,

  tryIt: {
    desc: "Try dividing by zero to see the guard in action.",
    inputs: [
      { id: "ti_n1", label: "Numerator (num1)", type: "number", default: 10, step: "any" },
      { id: "ti_n2", label: "Denominator (num2)", type: "number", default: 3, step: "any" },
      { id: "ti_dec", label: "Decimal places to show", type: "range", min: 0, max: 8, default: 6 },
    ],
    run(v){
      const n1=parseFloat(v.ti_n1)||0, n2=parseFloat(v.ti_n2)||0, dec=parseInt(v.ti_dec)||6;
      if(n2===0) return `num2 is 0 → cannot divide\n(The guard if(num2==0) prevented a crash!)`;
      return `divide = ${(n1/n2).toFixed(dec)}\n(%.${dec}f format)`;
    }
  }
  },

  // --------------------------------------------------------------------------------------------------------------------------------
  // TASK 1: FOR LOOPS & BASIC MATH
  // --------------------------------------------------------------------------------------------------------------------------------
  {
  num: 21,title: "Print 1 to n", tag: "task1", tagLabel: "Task 1", group: "task1",
  brief: "Print all natural numbers from 1 to n using a for loop.",
  concepts: ["for loop","loop counter","iteration","printf","increment operator"],
  explanation: `
  <p>This program introduces one of the most important ideas in programming: <strong>repetition</strong>. Instead of writing <code>printf("1"); printf("2"); printf("3");</code> manually, we use a loop to repeat the same action automatically.</p>
  <p><strong>What is a for loop?</strong> A <code>for</code> loop is used when you know exactly how many times something should repeat. Its structure is: </p>
  <p><code>for(initialization; condition; update)</code></p>
  <p>The initialization runs once at the beginning. The condition is checked before every repetition. If the condition is true, the loop body runs. After the body finishes, the update happens, then the condition is checked again.</p>
  <p><strong>Why start from 1?</strong> We want to print natural numbers beginning from 1. So the loop counter <code>i</code> starts at <code>1</code>. If we started at <code>0</code>, the output would incorrectly begin with 0.</p>
  <p><strong>What does i++ mean?</strong> The expression <code>i++</code> is shorthand for <code>i = i + 1</code>. It increases the value of <code>i</code> by one after every loop iteration. This allows the loop to move through all numbers one by one.</p>
  <p><strong>Why use <= instead of < ?</strong> The condition <code>i <= num</code> means "keep looping as long as i is less than or equal to num". This ensures the last number itself is printed. Using <code>i < num</code> would stop one number too early.</p>`,
  whatHappens: [
    "The function <code>one_to_n()</code> receives the value of <code>num</code>.",
    "The <code>for</code> loop starts by creating <code>i</code> and setting it to <code>1</code>.",
    "Before each iteration, C checks whether <code>i <= num</code>.",
    "If the condition is true, the current value of <code>i</code> is printed.",
    "After printing, <code>i++</code> increases <code>i</code> by 1.",
    "The process repeats until <code>i</code> becomes greater than <code>num</code>.",
    "Finally, <code>printf(\"\\\\n\")</code> moves the cursor to the next line."
  ],
  breakdown: [{code: "for(int i = 1; i <= num; i++)",text: "This is the full loop header. <code>int i = 1</code> creates the loop counter and starts it at 1. <code>i <= num</code> is the stopping condition. <code>i++</code> increases i after every iteration."},
    {code: 'printf("%d ", i);', text: "Prints the current value of <code>i</code>. The space after <code>%d</code> keeps the numbers separated nicely on the screen."},
    {code: 'printf("\\\\n");',text: "Prints a newline character so the terminal cursor moves to the next line after the loop finishes."}
  ],
  mistakes: [
    {text: "Using <code>i < num</code> instead of <code>i <= num</code> — this skips printing the final number." },
    {text: "Starting with <code>i = 0</code> — the output will begin with 0 instead of 1." },
    {text: "Forgetting <code>i++</code> — the loop will never end because <code>i</code> never changes."},
    {text: "Writing <code>printf(\"%d\", num)</code> instead of <code>i</code> — this would print the same number repeatedly."}
  ],
  syntaxTip: "A <code>for</code> loop always has 3 parts: initialization, condition, and update. Example: <code>for(i = 0; i < 10; i++)</code>.",
  output: "1 2 3 4 5",
  rawCode: `#include <stdio.h>
    void one_to_n(int num) {
        for(int i = 1; i <= num; i++) {
            printf("%d ", i);
        }

        printf("\\n");
    }

    int main() {
        one_to_n(5);

        return 0;
    }`,
  tryIt: {
    desc: "Enter any number n and print all numbers from 1 to n.",
    inputs: [
      {
        id: "ti_n",
        label: "Value of n",
        type: "number",
        default: 5
      }
    ],
    run(vals){
      const n = parseInt(vals.ti_n) || 0;
      if(n <= 0)
        return "[Please enter a positive number]";
      let result = "";
      for(let i = 1; i <= n; i++){
        result += i + " ";
      }
      return result.trim();
    }
  }
},
{
  num: 22, title: "Print n to 1", tag: "task1", tagLabel: "Task 1", group: "task1",
  brief: "Print all natural numbers from n down to 1 using a for loop.",
  concepts: ["for loop","loop counter","decrement operator","printf","iteration"],
  explanation: `
  <p>This program introduces the idea of <strong>reverse iteration</strong>, where instead of counting upward, we count downward from a starting number to 1.</p>
  <p><strong>What is a for loop here?</strong> A <code>for</code> loop is used to repeat actions while decreasing the value of a counter until a condition becomes false.</p>
  <p><strong>Structure of the loop: </strong> <code>for(initialization; condition; update)</code></p>
  <p>Here, the loop starts from <code>num</code> and keeps running while <code>i > 0</code>. After each iteration, <code>i--</code> decreases the value of <code>i</code> by 1.</p>
  <p><strong>Why start from num?</strong> Because we want to print numbers in reverse order starting from the given input down to 1.</p>
  <p><strong>What does i-- mean?</strong> The expression <code>i--</code> is shorthand for <code>i = i - 1</code>. It decreases the value of <code>i</code> after every iteration.</p>
  <p><strong>Why use i > 0?</strong> The condition ensures that the loop stops when <code>i</code> reaches 0, so the output correctly ends at 1.</p>
  `,
  whatHappens: [
  "The function <code>n_to_one()</code> receives the value of <code>num</code>.",
  "The <code>for</code> loop initializes <code>i = num</code>.",
  "Before each iteration, C checks whether <code>i > 0</code>.",
  "If true, the current value of <code>i</code> is printed.",
  "After printing, <code>i--</code> decreases <code>i</code> by 1.",
  "The loop continues until <code>i</code> becomes 0.",
  "Finally, <code>printf(\"\\\\n\")</code> moves the cursor to the next line."
  ],
  breakdown: [
  {
    code: "for(int i = num; i > 0; i--)",
    text: "Initializes loop counter at num, continues while i is greater than 0, and decreases i by 1 each iteration."
  },
  {
    code: 'printf("%d ", i);',
    text: "Prints the current value of i followed by a space for readability."
  },
  {
    code: 'printf("\\\\n");',
    text: "Prints a newline after the loop finishes."
  }
  ],
  mistakes: [
  { text: "Using <code>i >= 0</code> instead of <code>i > 0</code> — this would print 0 as well, which is not a natural number in this context." },
  { text: "Using <code>i++</code> instead of <code>i--</code> — this creates an infinite loop." },
  { text: "Starting from <code>i = 1</code> instead of <code>num</code> — this would not reverse the sequence." },
  { text: "Printing <code>num</code> instead of <code>i</code> — this would repeat the same number instead of counting down." }
  ],
  syntaxTip: "A reverse for loop looks like: <code>for(i = n; i > 0; i--)</code>.",
  output: "5 4 3 2 1",
  rawCode: `#include <stdio.h>

  void n_to_one(int num) {
    for(int i = num; i > 0; i--) {
        printf("%d ", i);
    }

    printf("\\n");
  }

  int main() {
    n_to_one(5);

    return 0;
  }`,
  tryIt: {
  desc: "Enter a number n and print all numbers from n down to 1.",
  inputs: [
    {
      id: "ti_n",
      label: "Value of n",
      type: "number",
      default: 5
    }
  ],
  run(vals){
    const n = parseInt(vals.ti_n) || 0;
    if(n <= 0)
      return "[Please enter a positive number]";
    let result = "";
    for(let i = n; i > 0; i--){
      result += i + " ";
    }
    return result.trim();
  }
  }
},
  {
  num: 23, title: "Print Alphabet (a to z)", tag: "task1", tagLabel: "Task 1", group: "task1",
  brief: "Print all lowercase letters from a to z using a for loop.",
  concepts: ["for loop", "char type", "ASCII iteration", "printf", "increment operator"],
  explanation: `
  <p>This program demonstrates that loops can work with <strong>characters</strong> just as easily as they work with numbers. In C, characters are essentially small integers under the hood.</p>
  <p><strong>The ASCII Secret: </strong> Every character (like 'a', 'b', 'c') corresponds to a numeric code in the ASCII table. For example, 'a' is 97 and 'b' is 98. Because they are sequential, we can use the <code>++</code> operator to move to the next letter.</p>
  <p><strong>Looping through Chars: </strong> When we write <code>char c = 'a'</code>, we are telling the computer to start at the numeric value for 'a'. The condition <code>c <= 'z'</code> tells it to stop once it passes the numeric value for 'z'.</p>
  <p><strong>Format Specifier: </strong> We use <code>%c</code> in the <code>printf</code> function to tell C: "Take this number and display it as its character equivalent."</p>`,
  whatHappens: [
    "The function <code>alpha()</code> begins execution.",
    "A character variable <code>c</code> is initialized to <code>'a'</code>.",
    "The loop checks if the current character <code>c</code> is less than or equal to <code>'z'</code>.",
    "Inside the loop, <code>printf(\"%c \", c)</code> displays the character followed by a space.",
    "The <code>++c</code> expression increments the ASCII value, changing 'a' to 'b', 'b' to 'c', and so on.",
    "The loop terminates after 'z' is printed and <code>c</code> increments once more.",
    "A final newline <code>\\n</code> is printed to clean up the output."
  ],
  breakdown: [
    {
      code: "for(char c = 'a'; c <= 'z'; ++c)",
      text: "Starts the loop at 'a'. It continues as long as <code>c</code> hasn't passed 'z'. <code>++c</code> moves to the next character in the alphabet."
    },
    {
      code: 'printf("%c ", c);',
      text: "The <code>%c</code> placeholder is vital here; it converts the underlying numeric ASCII value back into a readable letter."
    },
    {
      code: 'printf("\\n");',
      text: "Ensures that after the full alphabet is printed, the terminal cursor moves to a new line."
    }
  ],
  mistakes: [
    { text: "Using <code>'A'</code> instead of <code>'a'</code> — this would print uppercase letters instead of lowercase." },
    { text: "Using double quotes <code>\"a\"</code> instead of single quotes <code>'a'</code> — in C, single quotes are for single characters, while double quotes are for strings." },
    { text: "Using <code>< 'z'</code> instead of <code><= 'z'</code> — this would stop the loop at 'y', leaving 'z' unprinted." },
    { text: "Forgetting the <code>%c</code> specifier — using <code>%d</code> would print the ASCII numbers (97, 98, 99...) instead of letters." }
  ],
  syntaxTip: "You can loop through any range of characters using their ASCII order: <code>for(char c = '0'; c <= '9'; c++)</code> works too!",
  output: "a b c d e f g h i j k l m n o p q r s t u v w x y z",
  rawCode: `#include <stdio.h>

void alpha(void) {
  for(char c = 'a'; c <= 'z'; ++c) {
      printf("%c ", c);
  }

  printf("\\n");
}

int main() {
  alpha();
  return 0;
}`,
  tryIt: {
    desc: "Run the function to see the alphabet generated automatically.",
    inputs: [],
    run() {
      let result = "";
      for (let i = 97; i <= 122; i++) {
        result += String.fromCharCode(i) + " ";
      }
      return result.trim();
    }
  }
  },

  {
  num: 24, title: "Even Numbers 1 to 100", tag: "task1", tagLabel: "Task 1", group: "task1",
  brief: "Print all even numbers between 1 and 100 using loops.",
  concepts: ["for loop", "modulus operator", "iteration", "conditionals"],
  explanation: `
  <p>This program demonstrates two different logic patterns for solving the same problem: <strong>Optimization</strong> vs. <strong>Filtering</strong>.</p>
  <p><strong>Method 1 (The Fast Way): </strong> We start the loop at 2 and use <code>i += 2</code>. This is efficient because the loop only runs 50 times. It "jumps" over the odd numbers entirely, saving the computer from doing unnecessary work.</p>
  <p><strong>Method 2 (The Logical Way): </strong> We visit every single number from 1 to 100 and ask: "Are you even?" We do this using the <strong>modulus operator (%)</strong>. <code>i % 2 == 0</code> checks if the remainder of a division by 2 is zero.</p>
  <p><strong>Why use Method 2?</strong> While Method 1 is faster, Method 2 is more flexible. If you wanted to find numbers divisible by 3, 7, and 12 simultaneously, the filtering logic of Method 2 is much easier to adapt.</p>`,
  whatHappens: [
    "The first loop starts <code>i</code> at 2.",
    "In each step, <code>i</code> increases by 2 (2, 4, 6...).",
    "The second loop starts at 1 and increments by only 1.",
    "Inside the second loop, an <code>if</code> statement checks the modulus.",
    "If <code>i % 2</code> equals 0, that number is sent to <code>printf</code>.",
    "Both methods result in the same sequence of numbers."
  ],
  breakdown: [
    {
      code: "for(int i = 2; i <= 100; i += 2)",
      text: "This loop is highly efficient. By starting at 2 and adding 2 each time, we guarantee every <code>i</code> is even."
    },
    {
      code: "if(i % 2 == 0)",
      text: "The modulus operator <code>%</code> gives the remainder. If a number divided by 2 has 0 remainder, it is even."
    }
  ],
  mistakes: [
    { text: "Starting Method 1 at <code>i = 1</code> — this would print all odd numbers (1, 3, 5...) because you are adding 2 to an odd start." },
    { text: "Using <code>i =+ 2</code> instead of <code>i += 2</code> — this is a common typo that assigns the value positive 2 to <code>i</code> instead of adding to it." },
    { text: "Forgetting the condition in Method 2 — printing every number from 1 to 100 instead of just the even ones." }
  ],
  syntaxTip: "The increment doesn't have to be <code>++</code>. Use <code>i += n</code> to count by any step size you want.",
  output: "2 4 6 ... 100",
  rawCode: `#include <stdio.h>

void even_to_100(void) {
  // Method 1: Efficient stepping
  for(int i = 2; i <= 100; i += 2) {
      printf("%d ", i);
  }
  printf("\\n");

  // Method 2: Logical filtering
  for(int i = 1; i <= 100; i++) {
      if(i % 2 == 0) {
          printf("%d ", i);
      }
  }
  printf("\\n");
}

int main() {
  even_to_100();
  return 0;
}`,
  tryIt: {
    desc: "Set a limit 'n' to see all even numbers up to that limit.",
    inputs: [{ id: "n_even", label: "Limit (n)", type: "number", default: 20 }],
    run(v) {
      const n = parseInt(v.n_even) || 0;
      let r = "";
      for (let i = 2; i <= n; i += 2) r += i + " ";
      return r.trim() || "None";
    }
  }
  },

  {
  num: 25, title: "Odd Numbers 1 to 100", tag: "task1", tagLabel: "Task 1", group: "task1",
  brief: "Print all odd numbers between 1 and 100.",
  concepts: ["for loop", "modulus", "iteration", "odd check"],
  explanation: `
  <p>This task is the sibling of the 'Even Numbers' task. It reinforces how to control the starting point and step-logic of a loop.</p>
  <p><strong>Stepping Logic: </strong> To get odd numbers efficiently, we start at <code>1</code> (the first odd natural number) and add <code>2</code>. 1 + 2 = 3, 3 + 2 = 5, and so on.</p>
  <p><strong>The Modulus Logic: </strong> When we divide an odd number by 2, we <em>always</em> get a remainder of 1. Therefore, the condition <code>i % 2 != 0</code> or <code>i % 2 == 1</code> identifies an odd number.</p>
  <p><strong>Boundary conditions: </strong> Notice the loop condition <code>i < 100</code>. Since 100 is even, the last odd number we care about is 99. <code>i <= 100</code> would work exactly the same way here, but <code>i < 100</code> is slightly cleaner as we know 100 isn't odd.</p>`,
  whatHappens: [
    "The first loop initializes <code>i</code> to 1.",
    "The loop adds 2 to <code>i</code> in each step, skipping all even numbers.",
    "The second loop checks every number from 1 to 100.",
    "The <code>if</code> statement uses <code>i % 2 == 1</code> to find remainders.",
    "Only numbers satisfying that condition are printed.",
    "A newline is printed after each method completes."
  ],
  breakdown: [
    {
      code: "for(int i = 1; i < 100; i += 2)",
      text: "Starts at 1 and jumps by 2. This is the fastest way to target odd numbers."
    },
    {
      code: "if(i % 2 == 1)",
      text: "This asks: 'Does this number have a remainder of 1 when divided by 2?' If yes, it's odd."
    }
  ],
  mistakes: [
    { text: "Starting at <code>i = 0</code> — this would cause the step-method to print even numbers instead (0, 2, 4...)." },
    { text: "Using <code>i % 2 == 0</code> — this is the check for even numbers, not odd ones." },
    { text: "Accidentally incrementing <code>i</code> inside the loop body AND in the loop header — this would skip numbers twice as fast." }
  ],
  syntaxTip: "An odd number is any integer that cannot be divided exactly by 2.",
  output: "1 3 5 ... 99",
  rawCode: `#include <stdio.h>

void odd_to_100(void) {
  // Method 1: Stepping
  for(int i = 1; i < 100; i += 2) {
      printf("%d ", i);
  }
  printf("\\n");

  // Method 2: Filtering
  for(int i = 1; i <= 100; i++) {
      if(i % 2 == 1) {
          printf("%d ", i);
      }
  }
  printf("\\n");
}

int main() {
  odd_to_100();
  return 0;
}`,
  tryIt: {
    desc: "Enter a limit to see all odd numbers up to that point.",
    inputs: [{ id: "n_odd", label: "Limit (n)", type: "number", default: 20 }],
    run(v) {
      const n = parseInt(v.n_odd) || 0;
      let r = "";
      for (let i = 1; i <= n; i += 2) r += i + " ";
      return r.trim() || "None";
    }
  }
  },

  {
  num: 26, title: "Sum 1 to n", tag: "task1", tagLabel: "Task 1", group: "task1",
  brief: "Calculate the sum of all natural numbers from 1 to n.",
  concepts: ["loop", "accumulator", "addition", "iteration"],
  explanation: `
  <p>This program introduces the <strong>Accumulator Pattern</strong>, one of the most common patterns in all of programming.</p>
  <p><strong>What is an Accumulator?</strong> It's a variable (in this case, <code>total</code>) that "collects" values over time. Think of it like a piggy bank where you keep adding coins.</p>
  <p><strong>The Initialization: </strong> It is critical to start <code>total</code> at <code>0</code>. If you don't, it will contain a "garbage value" (whatever random data was left in that memory spot), and your sum will be completely wrong.</p>
  <p><strong>The Process: </strong> As the loop runs from 1 to <code>n</code>, the current value of <code>i</code> is added to the <code>total</code>. By the time the loop finishes, <code>total</code> holds the sum of every number the loop visited.</p>`,
  whatHappens: [
    "The variable <code>total</code> is created and set to 0.",
    "The loop starts with <code>i = 1</code>.",
    "Inside the loop, the current <code>i</code> is added to <code>total</code> (e.g., 0 + 1, then 1 + 2, then 3 + 3...).",
    "The loop continues until <code>i</code> reaches <code>num</code>.",
    "After the loop finishes, the final accumulated value is printed.",
    "The function ends."
  ],
  breakdown: [
    {
      code: "int total = 0;",
      text: "Initializes the accumulator. Crucial step to ensure we start counting from zero."
    },
    {
      code: "total += i;",
      text: "This is shorthand for <code>total = total + i</code>. It updates the sum with the new number."
    }
  ],
  mistakes: [
    { text: "Not initializing <code>total</code> (e.g., <code>int total;</code>) — this results in a random, huge number." },
    { text: "Putting the <code>printf</code> inside the loop — this would print the running total at every single step instead of just the final result." },
    { text: "Initializing <code>total = 1</code> — this would make the final sum 1 higher than it should be." }
  ],
  syntaxTip: "The <code>+=</code> operator is great for accumulating values: <code>balance += deposit;</code>",
  output: "Sample (n=5): 15",
  rawCode: `#include <stdio.h>

void sum_to_n(int num) {
  int total = 0;

  for(int i = 1; i <= num; i++) {
      total += i;
  }

  printf("The sum is: %d\\n", total);
}

int main() {
  sum_to_n(10); // Example: Sum of 1-10 is 55
  return 0;
}`,
  tryIt: {
    desc: "Enter a number 'n' to calculate the sum from 1 to n.",
    inputs: [{ id: "n_sum", label: "Value of n", type: "number", default: 10 }],
    run(v) {
      const n = parseInt(v.n_sum) || 0;
      let total = 0;
      for (let i = 1; i <= n; i++) total += i;
      return `Total Sum: ${total}`;
    }
  }
  },

  {
  num: 27, title: "Product of Digits", tag: "task1", tagLabel: "Task 1", group: "task1",
  brief: "Find the product of all digits of a number.",
  concepts: ["modulus", "division", "loop", "digit extraction"],
  explanation: `
  <p>This program solves a mathematical problem by "breaking" a number apart piece by piece from right to left.</p>
  <p><strong>How to get the last digit: </strong> Using <code>num % 10</code> gives you the remainder of a division by 10, which is always the last digit (e.g., 123 % 10 = 3).</p>
  <p><strong>How to remove the last digit: </strong> Using <code>num /= 10</code> performs integer division. It "chops off" the decimal, effectively removing the last digit (e.g., 123 / 10 = 12).</p>
  <p><strong>The Multiplier: </strong> Unlike addition (where we start at 0), for a product, we <strong>must</strong> start the accumulator at <code>1</code>. If you start at 0, the result will always be 0 because anything times zero is zero!</p>`,
  whatHappens: [
    "The variable <code>product</code> is initialized to 1.",
    "The <code>while</code> loop checks if <code>num</code> is not 0.",
    "The last digit is extracted using <code>num % 10</code>.",
    "That digit is multiplied into the <code>product</code> variable.",
    "The last digit is removed from <code>num</code> using <code>num /= 10</code>.",
    "The loop repeats until no digits are left (num becomes 0).",
    "The final product is displayed."
  ],
  breakdown: [
    {
      code: "while(num != 0)",
      text: "We use a <code>while</code> loop because we don't know how many digits the number has until we process it."
    },
    {
      code: "product *= num % 10;",
      text: "Extracts the rightmost digit and multiplies it into our running total."
    },
    {
      code: "num /= 10;",
      text: "Reduces the number by one power of ten, moving us to the next digit."
    }
  ],
  mistakes: [
    { text: "Starting <code>product = 0</code> — Your result will always be 0." },
    { text: "Using <code>num > 0</code> with negative inputs — if the input is -123, the loop might not run. <code>num != 0</code> is safer." },
    { text: "Forgetting <code>num /= 10</code> — the loop will process the same last digit forever (Infinite Loop)." }
  ],
  syntaxTip: "To extract digits: <code>% 10</code> gets the digit, <code>/ 10</code> moves to the next one.",
  output: "Sample (num=452): 40",
  rawCode: `#include <stdio.h>

void product_of_digits(int num) {
  // If input is 0, product of digits is 0
  if (num == 0) {
      printf("The product of the digits is: 0\\n");
      return;
  }

  int product = 1;
  // Handle negative numbers by making them positive
  if (num < 0) num = -num;

  while(num != 0) {
      product *= (num % 10);
      num /= 10;
  }

  printf("The product of the digits is: %d\\n", product);
}

int main() {
  product_of_digits(452); // 4 * 5 * 2 = 40
  return 0;
}`,
  tryIt: {
    desc: "Enter a number to see the result of multiplying its digits together.",
    inputs: [{ id: "n_prod", label: "Number", type: "number", default: 452 }],
    run(v) {
      let n = Math.abs(parseInt(v.n_prod) || 0);
      if (n === 0) return "Product: 0";
      let prod = 1;
      while (n > 0) {
        prod *= (n % 10);
        n = Math.floor(n / 10);
      }
      return `Product: ${prod}`;
    }
  }
  },
  {
  num: 28, title: "Product of Digits in a Number", tag: "task1", tagLabel: "Task 1", group: "task1",

  brief: "Take an integer and compute the product of all its digits using a while loop.",

  concepts: ["while loop", "modulo %", "integer division", "variables", "printf / scanf"],

  explanationDetailed: `
<p>The goal here is simple: break a number into digits and multiply them together.</p>

<p><strong>Key idea: </strong> Every digit of a number can be extracted using <code>% 10</code>. This gives the last digit. Then we remove that digit using <code>/ 10</code>.</p>

<p><strong>Example: </strong> If the number is 234: </p>
<ul>
<li>234 % 10 = 4 → take it into product</li>
<li>234 / 10 = 23 → remove last digit</li>
<li>repeat until number becomes 0</li>
</ul>

<p>The loop keeps running until there are no digits left.</p>
`,

  whatHappens: [
  "Program starts and initializes product = 1.",
  "It enters the while loop as long as num != 0.",
  "Each iteration extracts the last digit using num % 10.",
  "That digit is multiplied into product.",
  "Then num is reduced using num / 10 to remove the last digit.",
  "When num becomes 0, loop stops and result is printed."
  ],

  breakdown: [
  {
    code: "int product = 1;",
    text: "We start from 1 because multiplying by 0 would always keep result at 0."
  },
  {
    code: "product *= num % 10;",
    text: "Extracts last digit and multiplies it into the running product."
  },
  {
    code: "num /= 10;",
    text: "Removes the last digit so the next iteration processes the next one."
  },
  {
    code: "while(num != 0)",
    text: "Keeps looping until all digits are processed."
  }
  ],

  mistakes: [
  {
    text: "Starting product at 0 — this makes the final answer always 0 no matter the input."
  },
  {
    text: "Forgetting num /= 10 — this causes an infinite loop."
  },
  {
    text: "Using float instead of int — digits must be handled as integers."
  }
  ],

  syntaxTip: "If the number contains 0, the final product becomes 0 automatically. There is no need for special handling.",

  output: "Enter number: 234\nThe product of the digits is: 24",

  rawCode: `#include <stdio.h>\n\nvoid product_of_digits(int num) {\n    int product = 1;\n    while(num != 0) {\n        product *= num % 10;\n        num /= 10;\n    }\n    printf(\"The product of the digits is: %d\\n\", product);\n}\n\nint main() {\n    int n;\n    printf(\"Enter number: \");\n    scanf(\"%d\", &n);\n    product_of_digits(n);\n    return 0;\n}`,

  tryIt: {
  desc: "Change the number and see how the digit product changes.",
  inputs: [
    { id: "ti_n", label: "Number", type: "number", default: 234 }
  ],
  run(vals) {
    let n = parseInt(vals.ti_n) || 0;
    let num = Math.abs(n);
    if (num === 0) return "The product of the digits is: 0";

    let product = 1;
    while (num !== 0) {
      product *= (num % 10);
      num = Math.floor(num / 10);
    }
    return `The product of the digits is: ${product}`;
  }
  }
},
  {
    num: 29,
    title: "Print Natural Numbers 1 to n (while loop)",
    tag: "task2",
    tagLabel: "Task 2",
    group: "task2",
    brief: "Print numbers from 1 up to n using a while loop.",
    concepts: ["while loop", "increment", "printf"],
    explanationDetailed: `
<p>This question introduces the <strong>while loop</strong> -- the foundation of repeating actions in C.</p>
<p><strong>Loop recap:</strong> A <code>while</code> loop acts like an <code>if</code> statement that repeats. As long as the condition in the parentheses evaluates to true, the code inside the block runs again and again.</p>
<p><strong>Why use post-increment (i++)?</strong> We place <code>i++</code> directly inside the <code>printf</code> function. This is a classic C trick that does two things at once: it prints the current value of <code>i</code>, and <em>then</em> immediately adds 1 to it. This keeps our code compact.</p>
<p><strong>The infinite loop trap:</strong> If you forget to increment <code>i</code>, its value will stay 1 forever. The condition <code>i <= num</code> will never become false, and your program will freeze, printing '1' endlessly.</p>`,
    whatHappens: [
      "i is initialized to 1 as our starting point.",
      "The loop checks if i <= num.",
      "If true, it prints the current value of i.",
      "i is immediately increased by 1.",
      "The loop cycles back to the condition until i exceeds num."
    ],
    breakdown: [
      { code: "int i = 1;", text: "The starting point of our sequence." },
      { code: "while(i <= num)", text: "The condition. The loop keeps running as long as i hasn't passed the user's limit." },
      { code: "printf(\"%d \", i++);", text: "Prints the number, then steps up to the next number in one smooth motion." }
    ],
    mistakes: [
      { text: "Starting i from 0 instead of 1 -- this will print an extra 0 at the start of your sequence." },
      { text: "Forgetting i++ completely -- causes a catastrophic infinite loop." }
    ],
    syntaxTip: "<code>i++</code> (post-increment) uses the value, then adds 1. <code>++i</code> (pre-increment) adds 1, then uses the new value.",
    output: "1 2 3 4 5 ... n",
    rawCode: `void one_to_n(int num) {\n    int i = 1;\n    while (i <= num) {\n        printf("%d ", i++);\n    }\n    printf("\\n");\n}`,
    tryIt: {
      desc: "Set a maximum limit n to see the loop in action.",
      inputs: [{ id: "ti_n", label: "Limit (n)", type: "number", default: 10, min: 1 }],
      run(v) {
        const n = parseInt(v.ti_n) || 1;
        let res = [];
        for (let i = 1; i <= n; i++) res.push(i);
        return `Sequence: ${res.join(" ")}`;
      }
    }
  },
  {
    num: 30,
    title: "Print Natural Numbers n to 1 (while loop)",
    tag: "task2",
    tagLabel: "Task 2",
    group: "task2",
    brief: "Print numbers from n down to 1 using a while loop.",
    concepts: ["while loop", "decrement", "printf"],
    explanationDetailed: `
<p>This question introduces the <strong>decrement operator (<code>--</code>)</strong> and reverse iteration.</p>
<p><strong>Reverse iteration recap:</strong> Instead of starting at 1 and climbing to a limit, we start at the limit and count backward down to 1. This is the exact logic used in countdown timers.</p>
<p><strong>Why check i >= 1?</strong> Because we are counting down, our stopping point is 1. We want the loop to continue as long as our current number is greater than or equal to 1. If we used <code>i > 1</code>, the loop would stop at 2 and miss printing the final '1'.</p>
<p><strong>The post-decrement:</strong> Just like the previous task, <code>i--</code> inside the <code>printf</code> prints the current number, and then subtracts 1 from it, preparing it for the next loop cycle.</p>`,
    whatHappens: [
      "i is initialized to the user's input (num).",
      "The loop checks if i >= 1.",
      "The current value is printed.",
      "i is decreased by 1.",
      "The loop stops once i drops to 0."
    ],
    breakdown: [
      { code: "int i = num;", text: "Start from the maximum value." },
      { code: "while(i >= 1)", text: "Keep looping downwards until we hit 1." },
      { code: "printf(\"%d \", i--);", text: "Print the current value, then immediately decrease it." }
    ],
    mistakes: [
      { text: "Using i++ instead of i-- -- since we start at a high number, adding to it means we will never reach 1. (Infinite loop!)" },
      { text: "Using the condition i <= 1 -- the loop will never start because a high number is already greater than 1." }
    ],
    syntaxTip: "<code>i--</code> decreases the variable after the current operation finishes.",
    output: "n n-1 n-2 ... 1",
    rawCode: `void n_to_one(int num) {\n    int i = num;\n    while (i >= 1) {\n        printf("%d ", i--);\n    }\n    printf("\\n");\n}`,
    tryIt: {
      desc: "Enter a number to start the countdown.",
      inputs: [{ id: "ti_n", label: "Start (n)", type: "number", default: 10, min: 1 }],
      run(v) {
        const n = parseInt(v.ti_n) || 1;
        let res = [];
        for (let i = n; i >= 1; i--) res.push(i);
        return `Countdown: ${res.join(" ")}`;
      }
    }
  },
  {
    num: 31,
    title: "Print Alphabet a to z",
    tag: "task2",
    tagLabel: "Task 2",
    group: "task2",
    brief: "Print lowercase English letters using a while loop.",
    concepts: ["char", "while loop", "ASCII"],
    explanationDetailed: `
<p>This question introduces the concept that <strong>characters are actually numbers</strong> in C, known as ASCII values.</p>
<p><strong>ASCII recap:</strong> The computer doesn't know what the letter 'a' is. Under the hood, C stores 'a' as the integer 97, 'b' as 98, and so on up to 'z' which is 122.</p>
<p><strong>Why do math on letters?</strong> Because they are stored as sequential integers, we can use standard math operators on them. Adding 1 to 'a' (97) gives you 98, which corresponds to 'b'. This means we can loop through the alphabet exactly like we loop through numbers.</p>
<p><strong>The condition:</strong> <code>c <= 'z'</code> translates to "keep looping while the ASCII value of c is less than or equal to 122".</p>`,
    whatHappens: [
      "A char variable 'c' is initialized to 'a'.",
      "The loop checks if c is alphabetically less than or equal to 'z'.",
      "The current letter is printed using the %c format specifier.",
      "c is incremented, shifting to the next letter in the alphabet.",
      "The loop stops after printing 'z'."
    ],
    breakdown: [
      { code: "char c = 'a';", text: "Start at the first letter." },
      { code: "while(c <= 'z')", text: "Loop until we reach the last letter of the alphabet." },
      { code: "printf(\"%c \", c++);", text: "Print the letter, then mathematically increment its ASCII value to the next letter." }
    ],
    mistakes: [
      { text: "Using %d instead of %c in the printf -- this will print the numbers 97, 98, 99 instead of the letters a, b, c." },
      { text: "Using single quotes for the string literal like printf('%c') -- double quotes are strictly required for format strings." }
    ],
    syntaxTip: "Always use <code>%c</code> to print the character representation of an ASCII value.",
    output: "a b c d ... z",
    rawCode: `void alpha(void) {\n    char c = 'a';\n    while (c <= 'z') {\n        printf("%c ", c++);\n    }\n    printf("\\n");\n}`,
    tryIt: {
      desc: "Click run to see the character loop in action.",
      inputs: [],
      run() {
        let res = [];
        for (let i = 97; i <= 122; i++) res.push(String.fromCharCode(i));
        return `Alphabet: ${res.join(" ")}`;
      }
    }
  },
  {
    num: 32,
    title: "Print Even Numbers 1 to 100",
    tag: "task2",
    tagLabel: "Task 2",
    group: "task2",
    brief: "Print even numbers between 1 and 100 using while loop.",
    concepts: ["while loop", "increment", "even numbers"],
    explanationDetailed: `
<p>This question introduces <strong>loop step optimization</strong>. Instead of checking every single number, we change how the loop steps forward.</p>
<p><strong>Even numbers recap:</strong> Even numbers are divisible by 2. The positive even numbers start at 2, 4, 6, 8, etc.</p>
<p><strong>Why change the step?</strong> A beginner might loop from 1 to 100 and use an <code>if (i % 2 == 0)</code> check. While correct, it forces the loop to run 100 times. By starting <code>i</code> at 2 and using <code>i += 2</code> (which means <code>i = i + 2</code>), the loop skips the odd numbers entirely. This cuts the workload exactly in half, making the code much more efficient.</p>`,
    whatHappens: [
      "i is initialized to 2 (the first positive even number).",
      "The loop checks if i is within the 100 limit.",
      "The current even number is printed.",
      "i jumps forward by 2, skipping the next odd number.",
      "The loop ends once i exceeds 100."
    ],
    breakdown: [
      { code: "int i = 2;", text: "Start directly at the first even number." },
      { code: "while(i <= 100)", text: "Set the upper boundary." },
      { code: "i += 2;", text: "Increase by 2 each time, skipping odd numbers for better efficiency." }
    ],
    mistakes: [
      { text: "Starting i at 1 -- this will cause the loop to print odd numbers instead (1, 3, 5, 7...)." },
      { text: "Using i++ -- this will print every number, ignoring the even-only requirement." }
    ],
    syntaxTip: "<code>i += 2</code> is compound assignment. It is shorthand for <code>i = i + 2</code>.",
    output: "2 4 6 8 ... 100",
    rawCode: `void even_to_100(void) {\n    int i = 2;\n    while (i <= 100) {\n        printf("%d ", i);\n        i += 2;\n    }\n    printf("\\n");\n}`,
    tryIt: {
      desc: "See the efficient step loop output.",
      inputs: [{ id: "ti_n", label: "Up to", type: "number", default: 20, max: 100 }],
      run(v) {
        const n = Math.min(100, parseInt(v.ti_n) || 2);
        let res = [];
        for (let i = 2; i <= n; i += 2) res.push(i);
        return `Evens up to ${n}:\n${res.join(" ")}`;
      }
    }
  },
  {
    num: 33,
    title: "Power of a Number",
    tag: "task2",
    tagLabel: "Task 2",
    group: "task2",
    brief: "Calculate base raised to exponent using a loop.",
    concepts: ["while loop", "multiplication", "exponent"],
    explanationDetailed: `
<p>This question introduces the concept of an <strong>accumulator variable</strong> used for multiplication.</p>
<p><strong>Power recap:</strong> Calculating a power (like 2<sup>3</sup>) means multiplying the base number by itself 'exponent' number of times (2 × 2 × 2).</p>
<p><strong>Why initialize result to 1?</strong> In previous addition loops, we start sums at 0. But here, we are multiplying. If we start <code>result = 0</code>, the first multiplication will be <code>0 * base</code>, which is 0. All subsequent multiplications will stay 0. Starting at 1 (the multiplicative identity) ensures the first multiplication stores the base value correctly.</p>
<p><strong>The countdown loop:</strong> We use <code>while(exp-- > 0)</code>. This acts as a simple counter. If the exponent is 3, the loop runs exactly 3 times, performing the multiplication and shrinking the exponent each time until it hits 0.</p>`,
    whatHappens: [
      "result is initialized to 1.",
      "The loop evaluates if the exponent is greater than 0, then decreases it.",
      "Inside the loop, result is multiplied by the base.",
      "This repeats until the exponent counts down to 0.",
      "The final accumulated result is printed."
    ],
    breakdown: [
      { code: "int result = 1;", text: "Start at 1 to prevent multiplying by zero." },
      { code: "while(exp-- > 0)", text: "Use the exponent as a countdown timer to control how many times we multiply." },
      { code: "result *= base;", text: "Multiply the running total by the base (shorthand for result = result * base)." }
    ],
    mistakes: [
      { text: "Initializing result to 0 -- your answer will always be 0." },
      { text: "Using exp++ -- the exponent will grow instead of shrink, causing an infinite loop." }
    ],
    syntaxTip: "Using <code>while(exp-- > 0)</code> is a very common C idiom for 'do this exactly X times'.",
    output: "For base 2, exp 3 → 8",
    rawCode: `void power(int base, int exp) {\n    int result = 1;\n    while (exp-- > 0) {\n        result *= base;\n    }\n    printf("%d\\n", result);\n}`,
    tryIt: {
      desc: "Calculate Base to the power of Exponent.",
      inputs: [
        { id: "ti_b", label: "Base", type: "number", default: 2 },
        { id: "ti_e", label: "Exponent", type: "number", default: 3, min: 0 }
      ],
      run(v) {
        const b = parseInt(v.ti_b) || 1;
        const e = Math.max(0, parseInt(v.ti_e) || 0);
        let res = 1;
        for (let i = 0; i < e; i++) res *= b;
        return `${b}^${e} = ${res}`;
      }
    }
  },
  {
    num: 34,
    title: "Find Factors of a Number",
    tag: "task2",
    tagLabel: "Task 2",
    group: "task2",
    brief: "Print all numbers that divide a given number exactly (factors).",
    concepts: ["while loop", "modulo %", "divisibility", "conditions"],
    explanationDetailed: `
<p>This question introduces the <strong>modulo operator (<code>%</code>)</strong> as a tool to check divisibility.</p>
<p><strong>Factors recap:</strong> A factor is any number that divides into another number perfectly, without leaving a remainder. For example, 3 is a factor of 12 because 12 divided by 3 is exactly 4.</p>
<p><strong>Why use modulo?</strong> The <code>%</code> operator gives us the remainder of a division. Therefore, the expression <code>num % i == 0</code> literally translates to "does i divide into num with a remainder of zero?". If this is true, <code>i</code> is guaranteed to be a factor.</p>
<p><strong>The strategy:</strong> We start testing at 1. We test every single number up to the target number. Every time the modulo condition passes, we print that number.</p>`,
    whatHappens: [
      "i is initialized to 1.",
      "The loop iterates through every number from 1 up to num.",
      "An if statement checks if num % i equals 0.",
      "If it does, i is a factor and is printed.",
      "i is incremented to test the next candidate."
    ],
    breakdown: [
      { code: "if(num % i == 0)", text: "The core logic: if the remainder is 0, it's a perfect division." },
      { code: "while(i <= num)", text: "We must test every potential candidate up to the number itself." },
      { code: "printf(\"%d \", i);", text: "Only executes if the divisibility check was successful." }
    ],
    mistakes: [
      { text: "Starting i at 0 -- this causes a 'Division by Zero' runtime error, crashing the program." },
      { text: "Forgetting to increment i outside the if statement -- if i++ is inside the if block, the loop will freeze on the first non-factor." }
    ],
    syntaxTip: "Divisibility checks are the most common use case for the modulo operator.",
    output: "Factors of 12 → 1 2 3 4 6 12",
    rawCode: `void factors(int num) {\n    int i = 1;\n    while (i <= num) {\n        if (num % i == 0)\n            printf("%d ", i);\n        i++;\n    }\n    printf("\\n");\n}`,
    tryIt: {
      desc: "Enter a number to reveal all its factors.",
      inputs: [{ id: "ti_n", label: "Number", type: "number", default: 12, min: 1 }],
      run(v) {
        const n = parseInt(v.ti_n) || 1;
        if (n <= 0) return "Please enter a positive number.";
        let res = [];
        for (let i = 1; i <= n; i++) if (n % i === 0) res.push(i);
        return `Factors of ${n}: ${res.join(" ")}`;
      }
    }
  },
  {
    num: 35,
    title: "Factorial of a Number",
    tag: "task2",
    tagLabel: "Task 2",
    group: "task2",
    brief: "Compute factorial using repeated multiplication.",
    concepts: ["while loop", "decrement", "multiplication"],
    explanationDetailed: `
<p>This question introduces another use of the <strong>accumulator pattern</strong>, this time applying it to a mathematical sequence.</p>
<p><strong>Factorial recap:</strong> The factorial of a number (written as n!) is the product of all positive integers less than or equal to that number. So, 5! = 5 × 4 × 3 × 2 × 1 = 120.</p>
<p><strong>Why stop at > 1?</strong> Our loop condition is <code>while(num > 1)</code>. You might wonder why we don't go down to 1. Since multiplying any number by 1 doesn't change its value, running the loop for the final '1' is mathematically redundant. Stopping at 2 saves the computer one tiny sliver of wasted effort.</p>
<p><strong>The shrinking multiplier:</strong> <code>result *= num--</code> handles the multiplication and the countdown simultaneously. It multiplies the total by the current number, then shrinks the number for the next round.</p>`,
    whatHappens: [
      "result starts at 1 to prepare for multiplication.",
      "The loop ensures num is greater than 1.",
      "result is multiplied by the current value of num.",
      "num is decremented by 1.",
      "The loop repeats until num drops to 1, completing the factorial."
    ],
    breakdown: [
      { code: "int result = 1;", text: "Start at 1. (0! is also 1, so this handles edge cases elegantly)." },
      { code: "while(num > 1)", text: "Stop before 1 to avoid an unnecessary multiplication." },
      { code: "result *= num--;", text: "Multiply, then step downwards." }
    ],
    mistakes: [
      { text: "Starting result at 0 -- the entire factorial will collapse to 0." },
      { text: "Using num++ -- the number will grow infinitely, causing an infinite loop and an integer overflow." }
    ],
    syntaxTip: "Factorials grow incredibly fast. 13! is too large for a standard 32-bit int. Use <code>long long</code> for larger inputs.",
    output: "For 5 → 120",
    rawCode: `void factorial(int num) {\n    int result = 1;\n    while (num > 1) {\n        result *= num--;\n    }\n    printf("%d\\n", result);\n}`,
    tryIt: {
      desc: "Calculate the factorial (try numbers 1-12).",
      inputs: [{ id: "ti_n", label: "Number (n)", type: "number", default: 5, min: 0, max: 20 }],
      run(v) {
        let n = parseInt(v.ti_n) || 0;
        if (n < 0) return "Error: Negative numbers don't have factorials.";
        if (n > 20) return "Result too large for safe JS display.";
        let f = 1;
        for (let i = 1; i <= n; i++) f *= i;
        return `${n}! = ${f}`;
      }
    }
  },
  {
    num: 36,
    title: "Check Prime Number",
    tag: "task2",
    tagLabel: "Task 2",
    group: "task2",
    brief: "Check whether a number is prime using loop division test.",
    concepts: ["while loop", "modulo", "optimization", "conditions"],
    explanationDetailed: `
<p>This question introduces <strong>early exiting</strong> and algorithmic optimization.</p>
<p><strong>Prime recap:</strong> A prime number is only divisible by 1 and itself (e.g., 2, 3, 5, 7). If we find <em>any</em> other factor, the number is definitely not prime.</p>
<p><strong>Why check up to num/2?</strong> The largest possible factor of any number (excluding the number itself) can never be larger than half of its value. For example, the largest factor of 100 is 50. Therefore, testing numbers beyond <code>num / 2</code> is a waste of processing time.</p>
<p><strong>The early exit:</strong> Inside the loop, if <code>num % i == 0</code> is true, we immediately use <code>return 0;</code> to exit the function. There is no need to keep checking other numbers once we've found a single factor. If the loop finishes checking every possibility and never triggered the early exit, the number must be prime, so we <code>return 1;</code> at the end.</p>`,
    whatHappens: [
      "First, check if num <= 1 (0, 1, and negatives are not prime).",
      "Loop starts at 2 (the first possible factor).",
      "Checks divisibility up to half of the number.",
      "If a divisor is found, the function instantly returns 0 (False).",
      "If the loop ends without finding divisors, it returns 1 (True)."
    ],
    breakdown: [
      { code: "if(num <= 1) return 0;", text: "Handles edge cases before the loop even starts." },
      { code: "while(i <= num/2)", text: "Optimized loop range to save execution time." },
      { code: "if(num % i == 0) return 0;", text: "The early exit. The moment we prove it's not prime, we stop." }
    ],
    mistakes: [
      { text: "Starting i at 1 -- every number is divisible by 1, so your function will mistakenly mark everything as non-prime." },
      { text: "Forgetting to handle numbers like 0 and 1, which are uniquely not prime." }
    ],
    syntaxTip: "Returning early from a function (early exit) is cleaner than using complex flags or break statements.",
    output: "7 → 1 (true) / 8 → 0 (false)",
    rawCode: `int is_prime(int num) {\n    int i = 2;\n    if (num <= 1) return 0;\n    while (i <= num / 2) {\n        if (num % i == 0) return 0;\n        i++;\n    }\n    return 1;\n}`,
    tryIt: {
      desc: "Test if a number is prime.",
      inputs: [{ id: "ti_n", label: "Number", type: "number", default: 7 }],
      run(v) {
        const n = parseInt(v.ti_n) || 0;
        if (n <= 1) return `${n} is NOT prime.`;
        for (let i = 2; i <= Math.sqrt(n); i++) if (n % i === 0) return `${n} is NOT prime (divisible by ${i}).`;
        return `${n} IS a prime number!`;
      }
    }
  },
  {
    num: 37,
    title: "Print Prime Numbers up to n",
    tag: "task2",
    tagLabel: "Task 2",
    group: "task2",
    brief: "Print all prime numbers between 1 and n.",
    concepts: ["loops", "functions", "prime checking"],
    explanationDetailed: `
<p>This question introduces <strong>function reuse</strong> and building complex logic from smaller, simpler pieces.</p>
<p><strong>Recap:</strong> In the previous task, we wrote a function that checks if a single number is prime. Now, we want to find <em>all</em> primes up to a limit.</p>
<p><strong>Why use a helper function?</strong> We could copy the <code>is_prime</code> logic and paste it directly inside a loop, creating a "nested loop" (a loop inside a loop). However, this makes the code messy and hard to read. By calling our pre-written <code>is_prime()</code> function, our new loop acts like a clean conveyor belt. It feeds numbers into the function one by one, and only prints the ones that return true.</p>`,
    whatHappens: [
      "The loop starts at 2 (the lowest prime number).",
      "For every number up to 'num', it calls the is_prime() function.",
      "If the function returns true, the number is printed.",
      "If false, it is ignored.",
      "i increments to test the next number."
    ],
    breakdown: [
      { code: "int i = 2;", text: "Start our test sequence at 2." },
      { code: "while(i <= num)", text: "Iterate up to the user's limit." },
      { code: "if(is_prime(i)) printf(\"%d \", i);", text: "Clean abstraction: the complexity is hidden inside the helper function." }
    ],
    mistakes: [
      { text: "Starting i at 1 -- 1 is not prime, and depending on your helper function, it might print it by mistake." },
      { text: "Writing the prime-checking logic completely from scratch instead of reusing the function." }
    ],
    syntaxTip: "Breaking a problem into smaller functions (modular programming) makes debugging significantly easier.",
    output: "For 20 → 2 3 5 7 11 13 17 19",
    rawCode: `void primes_to_n(int num) {\n    int i = 2;\n    while (i <= num) {\n        if (is_prime(i))\n            printf("%d ", i);\n        i++;\n    }\n    printf("\\n");\n}`,
    tryIt: {
      desc: "Generate all primes up to your target.",
      inputs: [{ id: "ti_n", label: "Limit (N)", type: "number", default: 20, max: 500 }],
      run(v) {
        const n = Math.min(500, parseInt(v.ti_n) || 0);
        let res = [];
        const isp = (num) => {
          if (num <= 1) return false;
          for (let i = 2; i <= Math.sqrt(num); i++) if (num % i === 0) return false;
          return true;
        };
        for (let i = 2; i <= n; i++) if (isp(i)) res.push(i);
        return `Primes up to ${n}:\n${res.join(" ")}`;
      }
    }
  },
  {
    num: 38,
    title: "Sum of Prime Numbers up to n",
    tag: "task2",
    tagLabel: "Task 2",
    group: "task2",
    brief: "Calculate sum of all prime numbers up to n.",
    concepts: ["loops", "accumulator", "prime check"],
    explanationDetailed: `
<p>This final task brings together everything we've learned: <strong>loop iteration, conditionals, function reuse, and the accumulator pattern.</strong></p>
<p><strong>Recap:</strong> We need to isolate prime numbers within a range, and then add those specific numbers together to find a total sum.</p>
<p><strong>How the conditional accumulator works:</strong> We set up an empty bucket <code>sum = 0</code>. As our loop marches from 2 up to <code>n</code>, the <code>is_prime()</code> function acts as a gatekeeper. If the current number is not prime, the gate stays closed, and the number is ignored. If it is prime, the gate opens, and the number is dumped into our <code>sum</code> bucket using <code>sum += i</code>.</p>`,
    whatHappens: [
      "The sum variable is initialized to 0.",
      "The loop iterates from 2 up to the target num.",
      "Each number is evaluated by the is_prime() function.",
      "If the number is prime, it is added to the running sum.",
      "Once the loop finishes, the final accumulated total is printed."
    ],
    breakdown: [
      { code: "int sum = 0;", text: "The starting bucket for our addition." },
      { code: "if(is_prime(i))", text: "The gatekeeper condition ensuring only primes get through." },
      { code: "sum += i;", text: "Add the validated prime number to our total." }
    ],
    mistakes: [
      { text: "Adding all numbers (sum += i) outside the if statement -- this just sums up all numbers, ruining the prime constraint." },
      { text: "Forgetting to initialize sum to 0 -- in C, an uninitialized variable has random 'garbage' data, making your total wildly incorrect." }
    ],
    syntaxTip: "Combine patterns! Using an accumulator inside a conditional statement is how we filter and process data.",
    output: "For 10 (2+3+5+7) → 17",
    rawCode: `void sum_primes_to_n(int num) {\n    int sum = 0, i = 2;\n    while (i <= num) {\n        if (is_prime(i))\n            sum += i;\n        i++;\n    }\n    printf("%d\\n", sum);\n}`,
    tryIt: {
      desc: "Find the sum of all primes up to N.",
      inputs: [{ id: "ti_n", label: "Limit (N)", type: "number", default: 10, max: 1000 }],
      run(v) {
        const n = Math.min(1000, parseInt(v.ti_n) || 0);
        let sum = 0;
        const isp = (num) => {
          if (num <= 1) return false;
          for (let i = 2; i <= Math.sqrt(num); i++) if (num % i === 0) return false;
          return true;
        };
        for (let i = 2; i <= n; i++) if (isp(i)) sum += i;
        return `Sum of primes up to ${n} = ${sum}`;
      }
    }
  },
  {
    num: 39,
    title: "Draw Square Pattern",
    tag: "task2",
    tagLabel: "Task 2",
    group: "task2",
    brief: "Print a filled square of stars using nested loops.",
    concepts: ["nested loops", "outer loop", "inner loop", "printf", "rows & columns"],
    explanationDetailed: `
<p>The square pattern is the <strong>foundation of all pattern problems</strong>. Every complex pattern—triangles, pyramids, hearts—is built on this same two-loop skeleton. Master this and the rest becomes intuitive.</p>
<p>Think of the square like a grid. You need to fill every cell with a star <code>*</code>. The terminal prints one character at a time, left-to-right on a row. When a row is done, you print a newline <code>\\n</code> to jump to the next line.</p>
<p>We need <strong>two loops</strong>:</p>
<ul>
  <li>The <strong>outer loop</strong> controls which <em>row</em> we are on. It runs <code>size</code> times — once per row.</li>
  <li>The <strong>inner loop</strong> controls which <em>column</em> we are on within that row. It also runs <code>size</code> times — once per star on that row.</li>
</ul>
<p>The key insight: the inner loop is <strong>nested inside</strong> the outer loop. For every single iteration of the outer loop (one row), the entire inner loop (all columns) runs from start to finish.</p>`,
    whatHappens: [
      "Outer loop starts: i = 0 (Row 1).",
      "Inner loop runs fully: prints 'size' stars across the row.",
      "After inner loop finishes, printf('\\n') moves to the next line.",
      "Outer loop increments: i = 1 (Row 2). Inner loop repeats.",
      "This continues until all 'size' rows are printed."
    ],
    breakdown: [
      { code: "for(int i = 0; i < size; i++)", text: "<strong>Outer loop — rows.</strong> Runs exactly <code>size</code> times. Each iteration represents one complete horizontal row of the square." },
      { code: "for(int j = 0; j < size; j++)", text: "<strong>Inner loop — columns.</strong> Also runs <code>size</code> times. This prints every single star on the current row, one by one." },
      { code: 'printf("*");', text: "Prints a single star. No newline here — we stay on the same line for the full row." },
      { code: 'printf("\\n");', text: "Prints a newline <em>after</em> the inner loop finishes. This ends the current row and moves the cursor to the next line. This line is inside the outer loop but outside the inner loop." }
    ],
    mistakes: [
      { text: "Putting <code>printf(\"\\\\n\")</code> inside the inner loop causes a newline after every single star — ruining the shape." },
      { text: "Using <code>i &lt;= size</code> instead of <code>i &lt; size</code> when starting from 0 prints one extra row." },
      { text: "Starting both loops from 1 but using <code>&lt; size</code> would print one fewer row/column than intended." }
    ],
    syntaxTip: "Nested loops always run the inner loop <em>completely</em> for each single step of the outer loop. Think: outer = rows, inner = columns.",
    output: `*****
*****
*****
*****
*****`,
    rawCode: `void draw_square(int size){\n  for(int i = 0; i < size; i++) {\n    for(int j = 0; j < size; j++)\n      printf("*");\n    printf("\\n");\n  }\n}`,
    tryIt: {
      desc: "Enter a size and watch the nested loops fill a perfect square of stars. Try size = 3, then size = 8.",
      inputs: [{ id: "ti_s", label: "Size (limit 20)", type: "number", default: 5, min: 1 }],
      run(v) {
        let s = parseInt(v.ti_s) || 1;
        if (s > 20) s = 20;
        let res = "";
        for (let i = 0; i < s; i++) {
          for (let j = 0; j < s; j++) res += "*";
          res += "\n";
        }
        return res;
      }
    }
  },
  {
    num: 40,
    title: "Right Triangle (Left Aligned)",
    tag: "task2",
    tagLabel: "Task 2",
    group: "task2",
    brief: "Print a left-aligned triangle where each row has one more star than the last.",
    concepts: ["nested loops", "row-dependent inner loop", "incremental pattern", "i as counter"],
    explanationDetailed: `
<p>The left-aligned triangle is the first step beyond the square. The key difference: <strong>the inner loop no longer runs a fixed number of times</strong>. Instead, it runs a number of times that depends on the current row.</p>
<p>The rule is simple: <strong>Row number = number of stars on that row</strong>. Row 1 gets 1 star. Row 2 gets 2 stars. Row 5 gets 5 stars. We express this by making the inner loop's limit equal to <code>i</code> (the outer loop's variable).</p>
<p>This is the fundamental pattern of <strong>row-dependent loops</strong> — and it is the core concept behind all triangles, pyramids, and half-shapes.</p>`,
    whatHappens: [
      "Outer loop starts at i = 1 (Row 1).",
      "Inner loop runs from j = 0 to j < i — so only 1 time. Prints 1 star.",
      "Newline. Outer loop: i = 2. Inner loop runs 2 times. Prints 2 stars.",
      "This continues: each row prints exactly i stars.",
      "Final row i = size prints the maximum stars, completing the triangle."
    ],
    breakdown: [
      { code: "for(int i = 1; i <= size; i++)", text: "<strong>Outer loop.</strong> Starts at 1 (not 0). This is intentional — we want row 1 to print 1 star, so <code>i</code> must start at 1." },
      { code: "for(int j = 0; j < i; j++)", text: "<strong>Inner loop.</strong> Its limit is <code>i</code>, not a fixed size. When i=1, runs 1 time. When i=3, runs 3 times. The inner loop 'listens' to the outer loop." },
      { code: 'printf("*");', text: "Prints a star. Runs as many times as the inner loop allows — which is exactly <code>i</code> stars per row." },
      { code: 'printf("\\n");', text: "Ends the row. Placed after the inner loop, inside the outer loop." }
    ],
    mistakes: [
      { text: "Starting the outer loop at <code>i = 0</code> will print an empty first row (0 stars), which throws off the shape." },
      { text: "Using <code>j &lt; size</code> in the inner loop instead of <code>j &lt; i</code> turns it back into a square pattern." },
      { text: "Using <code>i &lt; size</code> in the outer loop (starting from 1) will stop one row early — the triangle will be missing its base." }
    ],
    syntaxTip: "When the inner loop uses <code>i</code> as its limit, the pattern grows with each row. This is the core of ALL triangle patterns.",
    output: `*
**
***
****
*****`,
    rawCode: `void draw_right_triangle_left(int size){\n  for(int i = 1; i <= size; i++) {\n    for(int j = 0; j < i; j++)\n      printf("*");\n    printf("\\n");\n  }\n}`,
    tryIt: {
      desc: "Try different sizes and watch the triangle grow. Notice how each row's star count equals its row number.",
      inputs: [{ id: "ti_s", label: "Size (limit 20)", type: "number", default: 5, min: 1 }],
      run(v) {
        let s = parseInt(v.ti_s) || 1;
        if (s > 20) s = 20;
        let res = "";
        for (let i = 1; i <= s; i++) {
          for (let j = 0; j < i; j++) res += "*";
          res += "\n";
        }
        return res;
      }
    }
  },
  {
    num: 41,
    title: "Right Triangle (Right Aligned)",
    tag: "task2",
    tagLabel: "Task 2",
    group: "task2",
    brief: "Print a right-aligned triangle using spaces to shift stars to the right.",
    concepts: ["nested loops", "spaces", "alignment", "three loops per row", "padding"],
    explanationDetailed: `
<p>This pattern introduces a critical new concept: <strong>using spaces as invisible padding</strong> to shift content across the screen. The terminal can only print characters left-to-right — there is no "move cursor right" command in basic C. To shift a shape to the right, you <strong>print spaces first</strong>.</p>
<p>Each row has two parts that must add up to the total width:</p>
<ul>
  <li><strong>Spaces</strong> on the left: <code>size - i</code> spaces. This starts large and shrinks to zero.</li>
  <li><strong>Stars</strong> on the right: <code>i</code> stars. This starts at 1 and grows.</li>
</ul>
<p>When you add them: <code>(size - i) + i = size</code>. Every row is the same total width, which is what creates the perfect right-alignment.</p>`,
    whatHappens: [
      "Row 1 (i=1): Print (size-1) spaces, then 1 star. The star sits at the far right.",
      "Row 2 (i=2): Print (size-2) spaces, then 2 stars. The stars move one position left.",
      "Each row: spaces decrease by 1, stars increase by 1. The right edge stays fixed.",
      "Final row (i=size): Print 0 spaces, then size stars. Full-width bottom row."
    ],
    breakdown: [
      { code: "for(int i = 1; i <= size; i++)", text: "<strong>Outer loop.</strong> Controls rows from 1 to size, same as the left-aligned triangle." },
      { code: "for(int j = 0; j < size - i; j++)", text: "<strong>First inner loop — spaces.</strong> Prints the left padding. On row 1, prints size-1 spaces. On the last row, prints 0 spaces. This is what shifts the stars rightward." },
      { code: "for(int k = 0; k < i; k++)", text: "<strong>Second inner loop — stars.</strong> Prints i stars. Grows with each row, filling in from the right side." },
      { code: 'printf("\\n");', text: "Ends the row after both inner loops complete." }
    ],
    mistakes: [
      { text: "Swapping the space loop and star loop will shift the triangle to the left (which is just the plain left-aligned triangle — not this shape)." },
      { text: "Using <code>j &lt; size - i - 1</code> for spaces will misalign the first row by one character." },
      { text: "Forgetting the space loop entirely will produce the basic left-aligned triangle." }
    ],
    syntaxTip: "The formula <code>spaces + stars = total_width</code> is the master rule for all alignment problems. Spaces = size - stars.",
    output: `    *
   **
  ***
 ****
*****`,
    rawCode: `void draw_right_triangle_right(int size){\n  for(int i = 1; i <= size; i++) {\n    for(int j = 0; j < size - i; j++)\n      printf(" ");\n    for(int k = 0; k < i; k++)\n      printf("*");\n    printf("\\n");\n  }\n}`,
    tryIt: {
      desc: "Watch how the spaces shrink and stars grow on each row, keeping the right edge perfectly aligned. Try size 5, then size 10.",
      inputs: [{ id: "ti_s", label: "Size (limit 20)", type: "number", default: 5, min: 1 }],
      run(v) {
        let s = parseInt(v.ti_s) || 1;
        if (s > 20) s = 20;
        let res = "";
        for (let i = 1; i <= s; i++) {
          for (let j = 0; j < s - i; j++) res += " ";
          for (let k = 0; k < i; k++) res += "*";
          res += "\n";
        }
        return res;
      }
    }
  },
  {
    num: 42,
    title: "Right Triangle (Upside Down - Left Aligned)",
    tag: "task2",
    tagLabel: "Task 2",
    group: "task2",
    brief: "Print a decreasing left-aligned triangle by counting the outer loop backwards.",
    concepts: ["nested loops", "decrement loop", "i-- pattern", "row dependency", "reverse logic"],
    explanationDetailed: `
<p>To flip a triangle upside down, you flip the direction of the outer loop. Instead of counting <strong>up</strong> (i = 1, 2, 3...), we count <strong>down</strong> (i = size, size-1, size-2...).</p>
<p>The inner loop still uses <code>i</code> as its limit, exactly like the normal triangle. The difference is that <code>i</code> now <strong>starts large and shrinks</strong>. So the first row prints the most stars, and each row prints one fewer.</p>
<p>The crucial C syntax difference: the outer loop uses <code>i--</code> (decrement) instead of <code>i++</code> (increment), and the loop condition becomes <code>i &gt;= 1</code> instead of <code>i &lt;= size</code>.</p>`,
    whatHappens: [
      "Outer loop starts at i = size (max value). Inner loop runs 'size' times. Full row of stars.",
      "Outer loop decrements: i = size - 1. Inner loop runs size-1 times. One fewer star.",
      "Each iteration: i shrinks by 1, inner loop runs one fewer time.",
      "Loop ends when i = 0, which fails i >= 1. Triangle is complete."
    ],
    breakdown: [
      { code: "for(int i = size; i >= 1; i--)", text: "<strong>Outer loop — reversed.</strong> Starts at the maximum (size), counts DOWN to 1. The <code>i--</code> is the key — it decrements i by 1 after each row." },
      { code: "for(int j = 0; j < i; j++)", text: "<strong>Inner loop.</strong> Identical to the normal triangle, but since <code>i</code> is now getting smaller each row, so too does the star count." },
      { code: 'printf("*");', text: "Prints one star. Runs <code>i</code> times per row, shrinking with each row." },
      { code: 'printf("\\n");', text: "Ends the row. After printing all stars for the current (shrinking) i." }
    ],
    mistakes: [
      { text: "Using <code>i++</code> and starting at size will cause an infinite loop — i grows forever and never fails the condition." },
      { text: "Starting at <code>i = 0</code> with <code>i--</code> immediately fails the condition <code>i >= 1</code>, printing nothing at all." },
      { text: "Using <code>i > 0</code> instead of <code>i >= 1</code> does the same thing — but remember, both are equivalent. Pick one and be consistent." }
    ],
    syntaxTip: "Reversed loop: <code>for(i = max; i >= 1; i--)</code> — start high, condition is 'while still positive', decrement with <code>i--</code>.",
    output: `*****
****
***
**
*`,
    rawCode: `void draw_right_triangle_down_left(int size){\n  for(int i = size; i >= 1; i--) {\n    for(int j = 0; j < i; j++)\n      printf("*");\n    printf("\\n");\n  }\n}`,
    tryIt: {
      desc: "Watch the triangle shrink from top to bottom. Notice the outer loop counts DOWN with i--.",
      inputs: [{ id: "ti_s", label: "Size (limit 20)", type: "number", default: 5, min: 1 }],
      run(v) {
        let s = parseInt(v.ti_s) || 1;
        if (s > 20) s = 20;
        let res = "";
        for (let i = s; i >= 1; i--) {
          for (let j = 0; j < i; j++) res += "*";
          res += "\n";
        }
        return res;
      }
    }
  },
  {
    num: 43,
    title: "Right Triangle (Upside Down - Right Aligned)",
    tag: "task2",
    tagLabel: "Task 2",
    group: "task2",
    brief: "Print an inverted triangle that shrinks from the top-left corner toward the bottom-right.",
    concepts: ["nested loops", "decrement logic", "spaces + stars", "alignment", "three loops per row"],
    explanationDetailed: `
<p>This is the most complex of the four triangle variants, combining <strong>two skills at once</strong>: the reverse-counting outer loop from Q42, and the space-padding technique from Q41.</p>
<p>The shape starts as a full row of stars in the top-left, and each row loses one star from the right while gaining one space on the left. The overall effect is a triangle that "slides" to the right as it shrinks.</p>
<p>The key formula per row: <code>spaces = size - i</code> and <code>stars = i</code>. Since <code>i</code> starts at size and decreases:</p>
<ul>
  <li>Row 1 (i=size): 0 spaces + size stars — full left-aligned row</li>
  <li>Row 2 (i=size-1): 1 space + size-1 stars</li>
  <li>Last row (i=1): size-1 spaces + 1 star — one star at the far right</li>
</ul>`,
    whatHappens: [
      "Outer loop starts at i = size. Space loop: 0 iterations (no padding). Star loop: size stars.",
      "i decrements. Space loop: prints 1 space. Star loop: prints size-1 stars.",
      "Each row: spaces = size - i (grows), stars = i (shrinks).",
      "Final row (i=1): spaces = size-1, stars = 1. Single star pushed to the right."
    ],
    breakdown: [
      { code: "for(int i = size; i >= 1; i--)", text: "<strong>Outer loop.</strong> Counts down from size to 1. Controls both space count and star count." },
      { code: "for(int j = 0; j < size - i; j++)", text: "<strong>Space loop.</strong> Prints the left-side padding. When i is large (early rows), <code>size - i</code> is small — few spaces. When i is small (later rows), <code>size - i</code> is large — many spaces." },
      { code: "for(int k = 0; k < i; k++)", text: "<strong>Star loop.</strong> Prints i stars. Since i is decreasing, fewer stars per row — they 'retreat' to the right." },
      { code: 'printf("\\n");', text: "Ends the row after spaces and stars are printed." }
    ],
    mistakes: [
      { text: "The space formula must be <code>size - i</code>, not <code>i</code>. If you use <code>i</code> for spaces, both loops shrink together and the alignment breaks." },
      { text: "Swapping the space and star loops will print stars then spaces — the result sits on the left and doesn't align to the right." },
      { text: "Using a forward loop (i++) with this formula will instead produce the right-aligned growing triangle (Q41)." }
    ],
    syntaxTip: "In pattern problems, always ask: <em>what grows and what shrinks?</em> Here, spaces grow and stars shrink — both controlled by the single variable <code>i</code>.",
    output: `*****
 ****
  ***
   **
    *`,
    rawCode: `void draw_right_triangle_down_right(int size){\n  for(int i = size; i >= 1; i--) {\n    for(int j = 0; j < size - i; j++)\n      printf(" ");\n    for(int k = 0; k < i; k++)\n      printf("*");\n    printf("\\n");\n  }\n}`,
    tryIt: {
      desc: "Notice how the left padding grows by 1 each row while the stars shrink by 1. Both are driven by the same variable i.",
      inputs: [{ id: "ti_s", label: "Size (limit 20)", type: "number", default: 5, min: 1 }],
      run(v) {
        let s = parseInt(v.ti_s) || 1;
        if (s > 20) s = 20;
        let res = "";
        for (let i = s; i >= 1; i--) {
          for (let j = 0; j < s - i; j++) res += " ";
          for (let k = 0; k < i; k++) res += "*";
          res += "\n";
        }
        return res;
      }
    }
  },
  {
    num: 44,
    title: "Pyramid Pattern",
    tag: "task2",
    tagLabel: "Task 2",
    group: "task2",
    brief: "Print a centered pyramid using the odd-number star formula and space padding.",
    concepts: ["nested loops", "center alignment", "odd numbers", "2*i-1 formula", "three loops per row"],
    explanationDetailed: `
<p>The pyramid is one of the most elegant patterns in C. It requires three separate loops per row, and it introduces a beautiful mathematical formula: <strong>stars per row = 2i - 1</strong>.</p>
<p>Why <code>2i - 1</code>? Because pyramid rows follow the odd numbers: 1, 3, 5, 7, 9... Substituting i = 1, 2, 3, 4, 5 into <code>2i - 1</code> gives exactly those values.</p>
<p>To keep the pyramid <strong>centered</strong>, we print spaces on the left of each row. The space count is <code>size - i</code> — which shrinks from top to bottom, just like the right-aligned triangle. This "opens up" the left side to balance the growing star count.</p>
<p>Each row has exactly: <code>(size - i) spaces + (2i - 1) stars</code>. The total width of the last row is always <code>2*size - 1</code>.</p>`,
    whatHappens: [
      "Row 1 (i=1): size-1 spaces, then 2(1)-1 = 1 star. Tip of the pyramid.",
      "Row 2 (i=2): size-2 spaces, then 2(2)-1 = 3 stars.",
      "Each row: one fewer space, two more stars. The pyramid widens symmetrically.",
      "Final row (i=size): 0 spaces, then 2*size-1 stars. Full-width base."
    ],
    breakdown: [
      { code: "for(int i = 1; i <= size; i++)", text: "<strong>Outer loop.</strong> Counts up from 1 to size. Controls the row and feeds the formulas for both spaces and stars." },
      { code: "for(int j = 0; j < size - i; j++)", text: "<strong>Space loop.</strong> Prints the centering pad. Starts large, shrinks by 1 each row. When i=1, prints size-1 spaces. When i=size, prints 0 spaces." },
      { code: "for(int k = 0; k < 2*i - 1; k++)", text: "<strong>Star loop.</strong> Uses the formula <code>2i-1</code>. When i=1, prints 1 star. When i=2, prints 3 stars. Always an odd number — this is what creates the symmetric pyramid shape." },
      { code: 'printf("\\n");', text: "Ends the row after spaces and stars." }
    ],
    mistakes: [
      { text: "Using <code>k &lt; i</code> instead of <code>k &lt; 2*i - 1</code> in the star loop creates a plain left-aligned triangle, not a pyramid (wrong star count)." },
      { text: "Forgetting the space loop entirely will left-align all rows — making a triangle that grows left, not a centered pyramid." },
      { text: "Using <code>j &lt; i</code> for spaces (instead of <code>j &lt; size - i</code>) pushes the tip to the right instead of centering it." }
    ],
    syntaxTip: "The formula <code>2*i - 1</code> generates odd numbers starting from 1. This is the mathematical secret behind every centered pyramid.",
    output: `    *
   ***
  *****
 *******
*********`,
    rawCode: `void draw_pyramid(int size){\n  for(int i = 1; i <= size; i++) {\n    for(int j = 0; j < size - i; j++)\n      printf(" ");\n    for(int k = 0; k < 2*i - 1; k++)\n      printf("*");\n    printf("\\n");\n  }\n}`,
    tryIt: {
      desc: "Watch the odd-number formula in action: 1, 3, 5, 7... stars per row. Notice the spaces perfectly center each row.",
      inputs: [{ id: "ti_s", label: "Height (limit 20)", type: "number", default: 5, min: 1 }],
      run(v) {
        let s = parseInt(v.ti_s) || 1;
        if (s > 20) s = 20;
        let res = "";
        for (let i = 1; i <= s; i++) {
          for (let j = 0; j < s - i; j++) res += " ";
          for (let k = 0; k < 2 * i - 1; k++) res += "*";
          res += "\n";
        }
        return res;
      }
    }
  },
  {
    num: 45,
    title: "Inverted Pyramid Pattern",
    tag: "task2",
    tagLabel: "Task 2",
    group: "task2",
    brief: "Print a centered inverted pyramid — the same formula as Q44, but with the outer loop reversed.",
    concepts: ["nested loops", "reverse symmetry", "odd pattern", "2*i-1 formula", "i-- loop"],
    explanationDetailed: `
<p>The inverted pyramid is the "upside-down" version of Q44. The mathematical formula is <strong>identical</strong> — stars per row = <code>2*i - 1</code>, spaces = <code>size - i</code>. The only change is the <strong>outer loop runs backwards</strong>.</p>
<p>By reversing the outer loop from <code>i = 1 to size</code> to <code>i = size down to 1</code>, the rows are printed in reverse order:</p>
<ul>
  <li>Row 1 now has the widest star count (<code>2*size - 1</code>)</li>
  <li>The pyramid narrows on each subsequent row</li>
  <li>The final row has just 1 star</li>
</ul>
<p>This is a perfect example of how a single change — the loop direction — completely transforms the visual output while keeping the same mathematical relationship between spaces and stars.</p>`,
    whatHappens: [
      "Outer loop starts at i = size. Space loop: 0 spaces. Star loop: 2*size-1 stars. Wide base at the top.",
      "i decrements. Space loop: 1 space. Star loop: 2*(size-1)-1 stars. Narrows by 2.",
      "Each row: one more space (left and right), two fewer stars in the center.",
      "Final row (i=1): size-1 spaces, 1 star. Tip of the inverted pyramid."
    ],
    breakdown: [
      { code: "for(int i = size; i >= 1; i--)", text: "<strong>Outer loop — reversed.</strong> Starts at size (maximum), counts down to 1. This is the ONLY structural difference from the regular pyramid." },
      { code: "for(int j = 0; j < size - i; j++)", text: "<strong>Space loop.</strong> Same formula as Q44. But because i now starts large and decreases, <code>size - i</code> starts at 0 and grows — more spaces each row." },
      { code: "for(int k = 0; k < 2*i - 1; k++)", text: "<strong>Star loop.</strong> Same <code>2*i - 1</code> formula. But since i decreases, the star count also decreases: 9, 7, 5, 3, 1..." },
      { code: 'printf("\\n");', text: "Ends the row. Same as every other pattern." }
    ],
    mistakes: [
      { text: "Forgetting to change the loop direction — if you just swap the output order but keep <code>i++</code>, you will get an infinite loop (i grows forever, never reaches i < 1)." },
      { text: "Changing the space formula but keeping the old loop direction will produce a diamond or broken shape." },
      { text: "A subtle mistake: using <code>i > 0</code> vs <code>i >= 1</code> — these are equivalent. But <code>i >= 1</code> is more readable." }
    ],
    syntaxTip: "Reversing a loop: change <code>i=1; i&lt;=size; i++</code> to <code>i=size; i&gt;=1; i--</code>. The formula inside stays identical. This is a powerful technique for flipping any pattern.",
    output: `*********
 *******
  *****
   ***
    *`,
    rawCode: `void draw_inverted_pyramid(int size){\n  for(int i = size; i >= 1; i--) {\n    for(int j = 0; j < size - i; j++)\n      printf(" ");\n    for(int k = 0; k < 2*i - 1; k++)\n      printf("*");\n    printf("\\n");\n  }\n}`,
    tryIt: {
      desc: "Compare this side-by-side with Q44. The only code difference is i-- vs i++, yet the shape is completely flipped.",
      inputs: [{ id: "ti_s", label: "Height (limit 20)", type: "number", default: 5, min: 1 }],
      run(v) {
        let s = parseInt(v.ti_s) || 1;
        if (s > 20) s = 20;
        let res = "";
        for (let i = s; i >= 1; i--) {
          for (let j = 0; j < s - i; j++) res += " ";
          for (let k = 0; k < 2 * i - 1; k++) res += "*";
          res += "\n";
        }
        return res;
      }
    }
  },
  {
    num: 46,
    title: "ASCII Heart with Custom Text",
    tag: "task2",
    tagLabel: "Task 2",
    group: "task2",
    layout: "wide",
    brief: "Draw a customizable ASCII heart shape with a personal message centered inside using complex nested loops.",
    concepts: ["nested for-loops", "string length (strlen)", "ASCII geometry", "conditional spacing", "<string.h> library"],
    explanationDetailed: `
<p>Before we write the code, let's understand the <strong>geometry</strong> of drawing a shape with text. The terminal prints left-to-right, top-to-bottom. We cannot go "back up" to draw. Therefore, we must slice the heart horizontally into four distinct sections and draw them row by row.</p>
<p><strong>Section 1: The Top Lobes.</strong> This requires an outer loop for the rows, and multiple inner loops to print the left outside space, the left hump, the center cleavage, and the right hump. As we move down row by row, the outside spaces shrink, the humps grow, and the center cleavage shrinks.</p>
<p><strong>Section 2: The Text Band.</strong> We calculate exactly how many stars to print on the left and right of the text so that it stays perfectly centered. We use <code>strlen()</code> from the <code>&lt;string.h&gt;</code> library to find out how many characters are in the user's word.</p>
<p><strong>Section 3: The Bottom Triangle.</strong> This is an inverted triangle. We use a loop that counts <em>backwards</em>. As we go down, the left margin spacing grows, and the number of stars shrinks until we form a V-shape.</p>
<p><strong>Section 4: The Bottom Tip.</strong> A single carefully calculated line of spaces followed by one final star to close the shape.</p>`,
    whatHappens: [
      "The program receives a string (like \"LOVE\") and a size integer (which dictates how large the heart will be).",
      "It enters the first major outer loop, building the rounded top halves of the heart line by line, calculating exactly how many spaces and stars to print.",
      "It calculates a padding value based on the total width of the heart minus the length of the string, ensuring the text fits perfectly in the middle.",
      "It prints the left padding stars, the exact word, and then the right padding stars.",
      "It enters a reverse-counting loop, pushing the stars further right with spaces while printing fewer stars each line, creating a downward-pointing triangle.",
      "It prints one final star to act as the sharp point at the bottom of the heart."
    ],
    breakdown: [
      { code: "void draw_heart(char *prompt, int size)", text: "Defines the function. It takes a string pointer (the text to print) and an integer (the scale of the heart)." },
      { code: "for(int i = 0; i < size; i++) {", text: "<strong>[Top Lobes]</strong> Outer loop governing the rows for the top humps of the heart. It will run <code>size</code> times." },
      { code: 'for(int j = 0; j < size - i - 1; j++) {printf("  ");}', text: "Prints the empty space on the far left. Notice how <code>size - i - 1</code> gets smaller as <code>i</code> grows, pushing the left edge outward to create a curve." },
      { code: 'for(int j = 0; j <= size; j++) {printf("* ");}\nfor(int j = 0; j < 2 * i + 1; j++) {printf("* ");}', text: "These two loops combined print the stars for the left lobe. The first prints a fixed block (based on <code>size</code>), and the second expands (<code>2 * i + 1</code>) as we move down the rows." },
      { code: 'for(int j = 2 * (size - i - 1); j > 0; j--) {printf("  ");}', text: "Prints the empty gap in the top-center of the heart (the V-cleavage). It shrinks twice as fast as the outer margins as we move down." },
      { code: 'for(int j = 0; j <= size; j++) {printf("* ");}\nfor(int j = 0; j < 2 * i + 1; j++) {printf("* ");}', text: "Mirrors the exact same star-printing math from the left lobe to create the right lobe." },
      { code: 'int pad = ((12 * size) - strlen(prompt)) / 4;', text: "<strong>[Text Band]</strong> Calculates padding. The total width of the heart in \"star units\" is roughly 12 times the size. We subtract the word's length and divide to figure out how many stars go on each side." },
      { code: 'for(int i = 0; i < pad; i++) { printf("* "); }', text: "Prints the calculated amount of stars before the text." },
      { code: 'if(strlen(prompt) % 2 == 0) {printf("%s", prompt);} else {printf("%s ", prompt);}', text: "Prints the user's word. If the word has an odd number of letters, it adds an extra space at the end so the right-side padding doesn't get misaligned." },
      { code: "for(int i = 3 * size ; i >= 1; i--) {", text: "<strong>[Bottom Triangle]</strong> Outer loop for the bottom half. Notice it counts <em>downwards</em> from <code>3 * size</code> down to 1. This naturally creates a shrinking effect." },
      { code: 'for(int j = 0; j < 3 * size - i; j++) {printf("  ");}', text: "Prints the left margin spaces. Because <code>i</code> is decreasing, <code>3 * size - i</code> increases, pushing the stars further to the right on every new line." },
      { code: 'for(int j = 0; j < i; j++) {printf("* ");}\nfor(int j = 0; j < i; j++) {printf("* ");}', text: "Prints the stars for the bottom V-shape. Because <code>i</code> is decreasing, it prints fewer and fewer stars each row." },
      { code: 'for(int i = 0; i < 6 * size - 1; i++) {printf(" ");}\nprintf("*");', text: "<strong>[Bottom Tip]</strong> Prints the precise amount of spaces to reach the dead center, then prints the final single star to close the point of the heart." }
    ],
    mistakes: [
      { text: "Forgetting to <code>#include &lt;string.h&gt;</code>. The <code>strlen()</code> function lives in this library, and without it, the compiler won't know how to measure your text." },
      { text: "Messing up the spaces in <code>printf(\"  \")</code> vs <code>printf(\"* \")</code>. This code relies heavily on standardizing a \"block\" as two characters wide (a star and a space, or two spaces). If you change one to a single space, the whole heart will warp." },
      { text: "Choosing a text prompt that is way too long for the <code>size</code> provided. If the text is wider than the heart, the <code>pad</code> integer will go negative, breaking the center row." }
    ],
    syntaxTip: "<code>strlen(string)</code> counts how many visible characters are in a string, but does <em>not</em> count the hidden null-terminator <code>\\0</code> at the end. It returns a <code>size_t</code> (an unsigned integer type).",
    output: `  ***   ***
 ***********
  *********
   *******
    *****
     ***
      *`,
    rawCode: `#include <stdio.h>\n#include <string.h>\n\nvoid draw_heart(char *prompt, int size) {\n    for(int i = 0; i < size; i++) {\n        for(int j = 0; j < size - i - 1; j++) {printf("  ");}\n        for(int j = 0; j <= size; j++) {printf("* ");}\n        for(int j = 0; j < 2 * i + 1; j++) {printf("* ");}\n        for(int j = 2 * (size - i - 1); j > 0; j--) {printf("  ");}\n        for(int j = 0; j <= size; j++) {printf("* ");}\n        for(int j = 0; j < 2 * i + 1; j++) {printf("* ");}\n        printf("\\n");\n    }\n\n    int pad = ((12 * size) - strlen(prompt)) / 4;\n    for(int i = 0; i < pad; i++) {\n        printf("* ");\n    }\n    if(strlen(prompt) % 2 == 0) {printf("%s", prompt);} else {printf("%s ", prompt);}\n\n    for(int i = 0; i < pad; i++) {\n        printf("* ");\n    }\n    printf("\\n");\n    \n    for(int i = 3 * size ; i >= 1; i--) {\n        for(int j = 0; j < 3 * size - i; j++) {printf("  ");}\n        for(int j = 0; j < i; j++) {printf("* ");}\n        for(int j = 0; j < i; j++) {printf("* ");}\n        printf("\\n");\n    }\n\n    for(int i = 0; i < 6 * size - 1; i++) {printf(" ");}\n    printf("*\\n");\n}\n\nint main() {\n    char message[] = "MU Prep 26";\n    int heart_size = 2;\n    draw_heart(message, heart_size);\n    return 0;\n}`,
    tryIt: {
      desc: "Change the size of the heart and the word inside it. Watch how the nested loops dynamically scale the ASCII geometry.",
      inputs: [
        { id: "ti_prompt", label: "Text inside heart", type: "text", default: "MU Prep 2026" },
        { id: "ti_size", label: "Scale (Size)", type: "number", default: 2, min: 1, max: 10 }
      ],
      run(v) {
        const prompt = v.ti_prompt || "C O D E";
        const size = Math.min(10, parseInt(v.ti_size) || 1);
        let res = "";
        
        // Top Lobes
        for(let i = 0; i < size; i++) {
          for(let j = 0; j < size - i - 1; j++) res += "  ";
          for(let j = 0; j <= size; j++) res += "* ";
          for(let j = 0; j < 2 * i + 1; j++) res += "* ";
          for(let j = 2 * (size - i - 1); j > 0; j--) res += "  ";
          for(let j = 0; j <= size; j++) res += "* ";
          for(let j = 0; j < 2 * i + 1; j++) res += "* ";
          res += "\n";
        }

        // Text Band
        let pad = Math.floor(((12 * size) - prompt.length) / 4);
        if (pad < 0) pad = 0;
        for(let i = 0; i < pad; i++) res += "* ";
        res += (prompt.length % 2 === 0) ? prompt : prompt + " ";
        for(let i = 0; i < pad; i++) res += "* ";
        res += "\n";
        
        // Bottom Triangle
        for(let i = 3 * size ; i >= 1; i--) {
          for(let j = 0; j < 3 * size - i; j++) res += "  ";
          for(let j = 0; j < i; j++) res += "* ";
          for(let j = 0; j < i; j++) res += "* ";
          res += "\n";
        }

        // Bottom Tip
        for(let i = 0; i < 6 * size - 1; i++) res += " ";
        res += "*\n";
        return res;
      }
    }
  }
];
