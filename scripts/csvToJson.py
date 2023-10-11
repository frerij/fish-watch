import csv
import json
import math
from geographiclib.geodesic import Geodesic

geod = Geodesic.WGS84
metersPerUnit = 850/160
center = [48.88231415802141, -122.89835666919856]

# access long code here
fishTagToSpecies = {}
with open("./data/PIT_CE_release.csv", encoding='utf-8') as csvf:
	csvReader = csv.DictReader(csvf)

	for row in csvReader:
		shortTagCode = row["Acoustic Tag"].upper()
		if shortTagCode != "":
			pitTagCode = row["Tag Code"]
			fishTagToSpecies[shortTagCode] = {"speciesName": row["Species Name"], "pitTagCode": pitTagCode}

with open("./data/fishTagToSpecies.json", 'w', encoding='utf-8') as jsonf:
		jsonf.write(json.dumps(fishTagToSpecies, indent=4))

# long code & collected (from collection) to find short code in release
# short code to position
# {{3DD.003BC95FC6: true}}

fishTagToCollected = {}
with open("./data/PIT_CE_collection.csv", encoding='utf-8') as csvf:
	csvReader = csv.DictReader(csvf)

	for row in csvReader:
		collected = (row["Site Name"].strip(" ") == "Final Collection Point")
		if (collected == True):
			pitTagCode = row["Tag Code"]
			fishTagToCollected[pitTagCode] = True
with open("./data/fishTagToCollected.json", 'w', encoding='utf-8') as jsonf:
	jsonf.write(json.dumps(fishTagToCollected, indent=4))


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
	tagToSpecies = {}
	
	# Open a csv reader called DictReader
	with open(csvFilePath, encoding='utf-8') as csvf:
		csvReader = csv.DictReader(csvf)
		
		for row in csvReader:
			# removing outliers above selected mse
			mse = float(row["MSE"])
			if (mse > 4):
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
				shortTagCode = row["Tag_code"][3:7]
				species = "Unknown"
				collected = False
				pitTagCode = ""
				if shortTagCode in fishTagToSpecies:
					species = fishTagToSpecies[shortTagCode]["speciesName"]
					pitTagCode = fishTagToSpecies[shortTagCode]["pitTagCode"]
				if pitTagCode in fishTagToCollected:
					collected = True
				data[row["Tag_code"]] = {"positions": [newEntry], "species": species, "collected": collected, "pitTagCode": pitTagCode}
				if species in tagToSpecies:
					tagToSpecies[species].append(row["Tag_code"])
				else:
					tagToSpecies[species] = [row["Tag_code"]]

	# Open a json writer, and use the json.dumps()
	# function to dump data
	with open(jsonFilePath, 'w', encoding='utf-8') as jsonf:
		jsonf.write(json.dumps(data, indent=4))

	with open("../src/data/speciesToTag.json", 'w', encoding='utf-8') as jsonf:
		jsonf.write(json.dumps(tagToSpecies, indent=4))
		
# Driver Code

# Decide the two file paths according to your
# computer system
csvFilePath = r'./data/fishPos_20190604.csv'
jsonFilePath = r'../src/data/fishMap.json'

# Call the make_json function
make_json(csvFilePath, jsonFilePath)
