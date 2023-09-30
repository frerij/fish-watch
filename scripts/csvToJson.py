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
	data = {}
	
	# Open a csv reader called DictReader
	with open(csvFilePath, encoding='utf-8') as csvf:
		csvReader = csv.DictReader(csvf)
		
		
		for row in csvReader:
			# removing outliers above selected mse
			mse = float(row["MSE"])
			if (mse > 200):
				continue

			newPoint = offsetFromCenter(float(row["X"]), float(row["Y"]))
			newEntry = {
				"dateTime": row["Date_time"], 
			   	"lat": newPoint[0], 
			    "lon": newPoint[1], 
			    "mse": row["MSE"], 
			    "x": row["X"], 
			    "y": row["Y"],
				"z": row["Z"]
				}
			if (row["Tag_code"] in data):
				data[row["Tag_code"]]["positions"].append(newEntry)
			else:
				data[row["Tag_code"]] = {"positions": [newEntry], "species": ""}

	# Open a json writer, and use the json.dumps()
	# function to dump data
	with open(jsonFilePath, 'w', encoding='utf-8') as jsonf:
		jsonf.write(json.dumps(data, indent=4))
		
# Driver Code

# Decide the two file paths according to your
# computer system
csvFilePath = r'./data/fishPos_20190604.csv'
jsonFilePath = r'../src/data/fishMap.json'

# Call the make_json function
make_json(csvFilePath, jsonFilePath)
