def fibbonachiSeries(c):
    number1, num2 = 0, 1
    res = 0
    if c == 0 or c == 1:
        print(number1)

    else:
        while res < c:

            n = number1+num2
            print(n)

            number1 = num2
            num2 = n
            res += 1


fibbonachiSeries(1)
