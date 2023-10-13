# FishWatch

This is **FishWatch**, an interactive data visualization to explore fish behavior in a waterbody. Movement patterns are represented as a heatmap view of position points with optional animated pathing. You can view movement patterns of all tagged fish, all fish in one species, or one specific fish and fish are color coded based on whether they reached the Final Collection Point or not.

## To run this program

1. `pnpm i`
2. `pnpm run dev`

## Technologies Used

- React, Vite, TypeScript, TailwindCSS
- React Leaflet, ReCharts, GeographicLib

## Data

### Data Assumptions:

MSE:
| Since MSE is a measure of the accuracy of the position estimate, I opted to remove some data points with high MSE values. As the position data was given in coordinates, I removed data points with an MSE > 4 thinking this would remove points which were more than 2 units 'off'. This was included in the csvToJson.py script and the accepted MSE value can be easily changed to better represent the data.

### Data Processing

- Position Coordinates:
  - While I converted the given x and y local coordinates into latitudes and longitudes, I preserved the original values for potential use with depth measurement to make a 3D representation of depth over the given area
  - Processed position points to find the farthest distance away from the origin to determine distance scale to fit in map area
- Processed release and collection data to find corresponding tag codes to retrieve collection status and species name to aggregate into primary data file (fishMap.json)

### Data Structure

Primary data file was fishMap.json, I wanted the keys to be the acoustic tag codes for faster lookup, and positions array made plotting point markers and pathing easier.

```json
	{ AcousticTagCode:  {
			"positions": [
					{ "dateTime": "",
						"lat": num,
						"lon": num,
						"mse": "",
						"x": "",
						"y": "",
						"z": ""
					},
				],
			"species": "",
			"collected": boolean,
			"pitTagCode": ""
			},
	}
```

## Current Features

- Select data by all fish, fish by species, and individual fish
  - View heatmap of position data
  - View animated pathing of position data over time
    - For mapping points, I implemented random sampling to limit the number of points being plotted, this vastly improved performance and loading but also greatly cut down certain position data.

## Future Features and Improvements

- UI Features
  - User select map colors: current colors chosen for accessibility but user choice could be best
  - UI to choose timer interval speed
  - User select multiple fish (not 1 vs entire species) and filter tag codes by search
  - Depth graph/three point cloud -> highlighting current point on map for
- Data Improvements:
  - Use full datetime to show fish movement more clearly and accurately, rather than all at once
  - Process position data for comparable points/time (some fish collected every 3s others 90s etc)
  - Improved pathing/drift markers for easier multi-fish viewing
- Testing

## References

Fullscreen loading: https://tailwindflex.com/prajwal/loading-overlay
