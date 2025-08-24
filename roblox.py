def main(centerCapacities, dailyLog):
    centerCounts = [0] * len(centerCapacities)
    centerTotals = [0] * len(centerCapacities)
    closed = [0] * len(centerCapacities)
    centerIndex = 0

    for i in range(0, len(dailyLog)):


        if dailyLog[i] == "PACKAGE":
            while centerCounts[centerIndex] == centerCapacities[centerIndex] or closed[centerIndex] == 1:
                centerIndex += 1

                if centerIndex >= len(centerCapacities):
                    centerTotals = [a + b for a, b in zip(centerTotals, centerCounts)]
                    centerCounts = [0] * len(centerCapacities)
                    centerIndex = 0

            centerCounts[centerIndex] += 1
        else:
            closed[int(dailyLog[i].split()[1])] = 1

    centerTotals = [a + b for a, b in zip(centerTotals, centerCounts)]
    return centerTotals.index(max(centerTotals))


if (__name__ == "__main__"):
    print(main([1, 1, 2], ["PACKAGE", "PACKAGE", "PACKAGE", "CLOSURE 2", "PACKAGE"]))