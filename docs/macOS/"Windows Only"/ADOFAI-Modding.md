# ADOFAI Modding

## Installation

!!! important
    For Apple Silicon, before install:

    1. Remove game directory completely before installation
    2. Do a fresh install of the game

1. Install [mono](https://www.mono-project.com/) (cross-platform open source .NET framework) via homebrew.
2. Download [UMM](https://www.nexusmods.com/site/mods/21)
3. Extract downloaded archive
4. Open terminal at UMM folder
5. Run `mono Console.exe`
6. Go through installation process (put game directory as `"~/Library/Application Support/Steam/steamapps/common/A Dance of Fire and Ice"`)
7. Add mods under Mods/ in game directory

!!! important
    For Apple Silicon, after install, before running the game:

1. *Get Info* `(CMD + I)` of `ADanceOfFireAndIce.app` and check *Open Using Rosetta 2*
2. Open Terminal and `cd` to `[Game Directory]/ADanceOfFireAndIce.app/Contents/MacOS/`
3. Check for architecture using <pre lang="markdown">lipo -info "ADanceOfFireAndIce"</pre>
4. If arm64 is detected, run <pre lang="markdown">lipo -remove arm64 "ADanceOfFireAndIce" -output "ADanceOfFireAndIce"</pre>

## Compatibility

Some mods do not work properly when installed. (Texture breaks, input bugs, etc.)

Last Checked: Feb 8, 2026

| Compatibility | Mod | Notes |
| :-----------: | :---: | :------------ |
| Very High | KeyboardChatterBlocker | |
| Very High | YSmod | |
| Very High | DesyncFix | Game graphic glitches are the mod's fault, not a compatibility issue |
| High | ADOFAI Tweaks | KeyLimiter does not work |
| High | KeyViewer 4 | "" |
| High | KeyViewer 3 | "" |
| High | Together | |
| High | TUFHelper | Make sure to set download path manually |
| High | EnhancedEffectRemover | |
| High | JipperResourcePack | KeyViewer rain is broken |
| Medium | PACL2 | Timeline view graphics break |
| Medium | BetterCalibration | Recommended calibration settings menu hides mouse cursor |

!!! note
    Mods that do not work were excluded.