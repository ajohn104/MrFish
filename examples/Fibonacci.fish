>> Fibonacci Series MrFish Language

declare input as 8

function Fibonacci needs (n):
    if (n equal_to 0):
        provide 0
    else if (n equal_to 1):
        provide 1
    else:
        provide Fibonacci with (n = n - 1) + Fibonacci with (n = n - 2)

Output "Fibonacci($(input)) = $(Fibonacci(input))"