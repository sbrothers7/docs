# ADOFAI on Linux

Notes from getting accurate input in the native Linux build of A Dance of Fire and Ice (Unity 6000.3, Steam) on Arch + Hyprland with an 8 kHz keyboard (Archon M1 Pro 2 TKL). Short version: the keyboard and kernel were fine the whole time — the problems were all in how the game's input library, SkyHook, gets key events and timestamps them. Bismuth (from the `linux-evdev-fix` branch onward) works around all of it, and no launch options are needed.

## Checking the keyboard's polling rate

8 kHz needs a High Speed (480M) USB link and a 125 µs endpoint interval. Both are visible without any tools:

``` sh
lsusb -t                                        # the keyboard's interfaces should say 480M
cat /sys/bus/usb/devices/3-3:1.*/ep_*/interval  # 125us = 8000 Hz (use your device's bus-port path)
```

`usbhid`'s `kbpoll`/`mousepoll` module parameters are `0` (use the device's own interval) by default — nothing to change. If the interfaces read `125us`, the kernel is already polling at 8 kHz.

## How the game reads keys: SkyHook

ADOFAI's "async input" goes through SkyHook (`ADanceOfFireAndIce_Data/Plugins/libskyhook.so`), which on Linux has two backends, picked when the hook starts:

| Backend | Chosen when | Problems |
| --- | --- | --- |
| X11 XRecord | an X display opens (`DISPLAY` set) | Sees only keys delivered to X clients — **nothing at all** if the game runs as a native Wayland window. Timestamps are X server milliseconds. |
| evdev (`/dev/input`) | no X display opens | Reads the kernel's per-report timestamps directly (full 8 kHz precision), but SkyHook mis-stamps them — see below. Needs read access to `/dev/input/event*` (the `input` group). |

You can see which window backend Unity picked in `~/.config/unity3d/7th Beat Games/A Dance of Fire and Ice/Player.log`: `Selected window backend: x11` (XWayland) or `wayland` (with `-force-wayland`).

### SkyHook's evdev timestamps are wrong twice

Comparing raw kernel events against what SkyHook hands the game:

```
kernel:  t=1792845719.588556          (seconds . microseconds, UTC)
SkyHook: TimeSec=1792845719  TimeSubsecNano=588556
```

1. **Microseconds stored as nanoseconds.** `TimeSubsecNano` gets `tv_usec` unscaled, so every press reads as landing in the first millisecond of its second — up to a full second early.
2. **UTC instead of local time.** The game builds its frame clock from `DateTime.Now` (local time, `scrConductor.Update` → `AsyncInputManager.currFrameTick`) and compares hit ticks against it. The X11 backend evidently reports local time; evdev reports UTC. In KST (UTC+9), every press looked 9 hours early.

Either one alone makes every hit judge **TooEarly** regardless of timing. Menus still "work", because they don't judge timing — which makes this look like a level-editor-only bug when it isn't.

!!! note
    The game also groups events by identical tick value before processing them (`scrController.UpdateInput`), so bug 1 additionally merges presses that land in the same second.

### Things that don't help

- `env -u DISPLAY %command% -force-wayland` gets SkyHook onto evdev, but then you hit both timestamp bugs above. Not needed with Bismuth.
- SkyHook's key-code mapping functions (`key_code_to_vk` / `vk_to_key_code`) return "unknown" for every key on Linux, so the game's own key limiter can't represent keys properly there.

## Bismuth fixes

On Linux, Bismuth:

- starts every SkyHook hook on **evdev** — it hides `DISPLAY` from the hook only while it starts, waits until it has opened `/dev/input`, then restores `DISPLAY`. Works whether the game window is XWayland or native Wayland. If `/dev/input` isn't readable, it restarts the hook on X11 and says so in the log;
- corrects SkyHook's evdev timestamps (µs → ns, UTC → local) where the game turns an event into a hit time (`SkyHookEvent.GetTimeInTicks`);
- holds the game's own key limiter off whenever Bismuth's limiter is on, so the two never filter at the same time (Bismuth's supports more keys);
- no longer has a hit-time fallback over legacy `UnityEngine.Input` — under Wayland with fcitx5 running, legacy Input misreads letter keys (only digits got through), so it only ever dropped valid hits.

Confirm in `Mods/Bismuth/BismuthLog.txt`:

```
SkyHook: reading /dev/input (kernel timestamps)
[patch] applied N class(es)
```

If there's no `[patch] applied` line, Bismuth's master switch is off (`<ModEnabled>false</ModEnabled>` in `Mods/Bismuth/Settings.xml`) and none of this is active.

!!! warning "Harmony version"
    Native UnityModManager ships plain Harmony **2.3.6** (`ADanceOfFireAndIce_Data/Managed/UnityModManager/0Harmony.dll`), not HarmonyX, even though Bismuth builds against HarmonyX 2.10.2. HarmonyX-only calls like `Harmony.UnpatchSelf()` throw `MissingMethodException` at runtime — that's what used to make Bismuth's master switch fail and leave the mod disabled. Mod code that has to run on both should stick to APIs they share (e.g. `GetPatchedMethods()` + `Unpatch(method, HarmonyPatchType.All, id)`, `CreateProcessor` instead of the 6-argument `Patch` overload).

## Frame rate stuck at the refresh rate

With vsync off and a 120 FPS cap in the game's settings, the game still sat at the monitor's 100 Hz — under XWayland and native Wayland alike. The game does request no vsync (`QualitySettings.vSyncCount = 0`); the cap is Hyprland presenting window frames on vblank. Allow tearing for the game only:

``` lua title="hyprland.lua"
hl.config({
    general = {
        allow_tearing = true,
    },
})

rule("adofai", { class = "ADanceOfFireAndIce" }, { float = true, immediate = true })
```

Tearing only applies to fullscreen windows, so run the game fullscreen. This is purely visual — with kernel timestamps, judgement no longer depends on frame rate.
