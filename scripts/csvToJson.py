import csv
import json
import math
from geographiclib.geodesic import Geodesic

geod = Geodesic.WGS84
metersPerUnit = 850/160
center = [47.609946, -122.255315]

# x -> longitude
# y -> latitude

def offsetFromCenter(x, y):
	heading = 90 - math.atan2(y,x) * 180 / math.pi
	distance = math.sqrt(x**2 + y**2)
	g = geod.Direct(center[0], center[1], heading, distance * metersPerUnit)
	return [g['lat2'],g['lon2']]


# Function to convert a CSV to JSON
# Takes the file paths as arguments
def make_json(csvFilePath, jsonFilePath):
	
	# create a dictionary
	data = []
	
	# Open a csv reader called DictReader
	with open(csvFilePath, encoding='utf-8') as csvf:
		csvReader = csv.DictReader(csvf)
		
		for row in csvReader:
			mse = float(row["MSE"])
			if (mse > 200):
				continue

			data.append(row)
			newPoint = offsetFromCenter(float(row["X"]), float(row["Y"]))
			data[-1]["lat"] = newPoint[0]
			data[-1]["lon"] = newPoint[1]
			data[-1]["MSE"] = float(data[-1]["MSE"])
			

	# Open a json writer, and use the json.dumps()
	# function to dump data
	with open(jsonFilePath, 'w', encoding='utf-8') as jsonf:
		jsonf.write(json.dumps(data, indent=4))
		
# Driver Code

# Decide the two file paths according to your
# computer system
csvFilePath = r'./data/fishPos_20190604.csv'
jsonFilePath = r'../src/data/data.json'

# Call the make_json function
make_json(csvFilePath, jsonFilePath)
