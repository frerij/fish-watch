import csv
import math

# to find farthest offset from origin to 
# determine distance scale to fit map area
def findFarthestPoint(csvFilePath):
    with open(csvFilePath, encoding='utf-8') as csvf:
        csvReader = csv.DictReader(csvf)
        max = 0
	
        for rows in csvReader:
            length = math.sqrt(float(rows["X"])**2 + float(rows["Y"])**2)

            if length >= max:
                max = length
        return max
    
csvFilePath = r'./data/fishPos_20190604.csv'

print(findFarthestPoint(csvFilePath))
