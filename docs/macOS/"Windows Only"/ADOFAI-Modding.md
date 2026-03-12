# ADOFAI Modding

## Installation

1. Install [mono](https://www.mono-project.com/) (cross-platform open source .NET framework) via homebrew.
2. Download [UMM](https://adof.ai/umm)
3. Extract downloaded archive.
4. Open terminal at UMM folder.
5. Run

    ``` zsh
    mono Console.exe
    ```

6. Go through installation process (put game directory as `"~/Library/Application Support/Steam/steamapps/common/A Dance of Fire and Ice"`).
7. Add mods under `Mods/` in game directory (If downloaded mods are archives, unarchive them and put them inside `Mods/`).

!!! note
    For Apple Silicon, after install, before running the game:

    1. *Get Info* `(CMD + I)` of `ADanceOfFireAndIce.app` and check *Open Using Rosetta 2*
    2. Open Terminal and `cd` to `[Game Directory]/ADanceOfFireAndIce.app/Contents/MacOS/`
    3. Check for architecture using

        ```sh
        lipo -info "ADanceOfFireAndIce"
        ```

    4. If arm64 is detected, run

        ```sh
        lipo -remove arm64 "ADanceOfFireAndIce" -output "ADanceOfFireAndIce"
        ```

## Compatibility

For downloading mods, it is advised to join the [ACS discord server](https://discord.gg/adofaigg).

Some mods do not work properly when installed. (Texture breaks, input bugs, etc.)

*Last Updated: Mar. 12, 2026*  
*ADOFAI version: 2.9.8*
*UMM version: Manager-0.32.4.0*

| Compatibility | Mod | Notes |
| :-----------: | :---: | :------------ |
| Very High | YSmod | (v1.0.3) |
| Very High | DesyncFix | Game graphic glitches are the mod's fault, not a compatibility issue |
| Very High | PlanetTweaks2 | Requires Localization2 mod (v1.1.0) |
| Very High | JipperResourcePack | (v1.3.4) |
| High | ADOFAI Tweaks | KeyLimiter does not work (v2.8.1) |
| High | KeyViewer 4 | "" |
| High | [KeyViewer 3](https://drive.google.com/drive/folders/1FCFl68oEdQmr1r1x4WsQSiqL0lYIcLyD?usp=drive_link) | "" (v3.13.1) |
| High | Together | (v6.0.6) |
| High | TUFHelper | **MacOS build exists separately** (v2.6.0) |
| High | EnhancedEffectRemover | (v1.6.1) |
| Medium-High | PACL2 | Timeline view graphics break (v2.4.405) |
| Medium | BetterCalibration | Recommended calibration settings menu hides mouse cursor (v1.1.3) |
| Medium | KeyboardChatterBlocker | Unable to restart after death (need to escape to exit gameplay then press play) (v0.0.1) |

!!! note
    Mods that do not work were excluded.
