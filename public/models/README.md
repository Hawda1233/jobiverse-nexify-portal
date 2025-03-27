
# 3D Models Directory

This directory should contain 3D models used throughout the application.

## Required Models:
- robot.glb - A robot character used in various UI elements
- interviewer.glb - A professional character for the interview simulator

## Important Notes:
1. You need to add your own .glb model files to this directory
2. Download free GLB models from sites like:
   - https://sketchfab.com/ (Many free models available)
   - https://www.turbosquid.com/ (Has free and paid models)
   - https://free3d.com/ (Various free 3D models)

3. Recommended model specifications:
   - Low poly count (under 50k triangles) for better performance
   - T-pose or neutral pose for character models
   - Properly UV mapped and textured
   - Exported as binary GLB format

4. Until you add model files, the application will display simple geometric shapes as placeholders.

## Troubleshooting:
- If you see a colored cube instead of a 3D character, it means the GLB file wasn't found
- Make sure your 3D model files are correctly named and placed in this directory
- Check browser console for specific error messages related to model loading

## Quick Start:
1. Download a GLB model from one of the resources above
2. Rename it to `robot.glb` or `interviewer.glb`
3. Place it in this directory (`public/models/`)
4. Refresh your application

## Demo Models:
If you're just testing and need a quick solution, you can use these links to download sample models:
- Sample Robot: https://market.pmnd.rs/model/robot-playground
- Sample Person: https://market.pmnd.rs/model/low-poly-character
