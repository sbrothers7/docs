# Features
[Sikarugir](https://github.com/Sikarugir-App/Sikarugir)
A GUI tool for creating wine bottles and wrappers. Performance is better than virtualization w/ UTM and could theoretically run some Steam games.

* Suports DirectX12
* Winetricks

# Installing Steam With Sikarugir
1. Install sikarugir
`brew install --cask --no-quarantine Sikarugir-App/sikarugir/sikarugir`
2. Open `Sikarugir Creator`
3. Add a new engine
4. Select WS12WineSikarugir10.0_1
5. Click *Download and Install*
6. Click *Update Wrapper*
7. Click *Create New Blank Wrapper* (make sure WS12WineSikarugir10.0_1 is selected as engine)
8. Name the new wrapper
9. Download the Steam installer for Windows
10. Run the newly created wrapper found in `~/Applications/Sikarugir/yourWrapperName.app` (not `/Applications`) or click *View warpper in Finder*
11. Click *Install Software*
12. Click *Choose Setup Executable*
13. Select the Windows Steam installer
14. Go through the installation but **uncheck *Run Steam* after install**
15. Choose `"C:/Program Files (x86)/Steam/Steam.exe"
16. Select translation layer (D3DMetal or DXMT recommended)
17. Launch the wrapper application again

To access to Configure menu again after closing, select the application in Finder > Right Click > Show Package Contents > Open `Contents` folder > `Configure.app`