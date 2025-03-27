
# 3D Models Directory

This directory should contain 3D models used throughout the application.

## Required Models:
- robot.glb - A robot character used in various UI elements
- interviewer.glb - A professional character for the interview simulator

## Important Notes:
1. **You need to add your own .glb model files to this directory**
2. The app will show a colored cube as a placeholder until you add actual model files
3. Download free GLB models from sites like:
   - https://sketchfab.com/ (Many free models available)
   - https://www.turbosquid.com/ (Has free and paid models)
   - https://free3d.com/ (Various free 3D models)

4. Recommended model specifications:
   - Low poly count (under 50k triangles) for better performance
   - T-pose or neutral pose for character models
   - Properly UV mapped and textured
   - Exported as binary GLB format (not text-based GLTF)

5. After downloading models:
   - Place them directly in this folder (`public/models/`)
   - Make sure they are named exactly as specified above (robot.glb, interviewer.glb)
   - No need to modify any code - the app will automatically use these models

## Troubleshooting:
- If you see a colored cube instead of a 3D character, it means the GLB file wasn't found
- Check that your 3D model files are correctly named and placed in this directory
- Make sure the models are properly exported in GLB format (binary, not text)
- If using custom models, ensure they have proper materials and geometry

## Placeholder Models:
Until you add your own models, the application will display a simple colored cube as a placeholder. This is expected behavior.
