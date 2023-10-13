# FishWatch

This is **FishWatch**, an interactive data visualization to explore fish behavior in a waterbody. Movement patterns are represented as a heatmap view of position points with optional animated pathing. You can view movement patterns of all tagged fish, all fish in one species, or one specific fish and fish are color coded based on whether they reached the Final Collection Point or not.

## To run this program

1. `pnpm i`
2. `pnpm run dev`

## Technologies/Libraries Used

- React, Vite, TypeScript, TailwindCSS
- React Leaflet, ReCharts, GeographicLib

## Data Processing/Structure

- csv -> json, organizing data by tag code
- filtering out: mse > value, released w/o acoustic tag, collected not @ final point
- converting x, y offset from origin to lat/lon -> deciding on scale for display
- when mapping points -> random sampling to improve performance

## Current Features

- select all fish, fish by species, individual fish
- view heatmap of position of the above
- view animated pathing of the above

## Future Features and Improvements

- User select map colors: current colors chosen for accessibility but user choice could be best
  - UI to choose timer interval speed
  - User select multiple fish (not 1 vs entire species)
- Depth graph/three point cloud -> highlighting current point on map
- Process position data for comparable points/time (some fish collected every 3s others 90s)
  - Improved pathing/drift marker for easier multi-fish viewing
- Testing

## References

Fullscreen loading: https://tailwindflex.com/prajwal/loading-overlay
