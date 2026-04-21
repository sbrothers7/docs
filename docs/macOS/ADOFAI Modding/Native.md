# ADOFAI Modding (arm64)

!!! Note
    Currently, it is difficult to find a way that would allow native modding to work. Further updates will be made in future.

This is a full investigation into running `BepInEx 5.x` natively on macOS Apple Silicon (arm64), specifically for modding ADOFAI. Native doorstop injection and BepInEx preloader loading were successful, but a fundamental incompatibility in `MonoMod/Harmony` prevents BepInEx from fully initializing on arm64 `Mono`.

## Environment

- **Device**: Apple M3 Pro, macOS 26.4.1
- **Game**: A Dance of Fire and Ice (Universal Binary: x86_64 + arm64)
- **BepInEx**: 5.4.23.5 (stable)
- **UnityDoorstop**: v4 (from BepInEx distribution)

## `libdoorstop.dylib` arm64e Incompatibility (SOLVED)

### Symptoms

``` log
dyld: terminating because inserted dylib 'libdoorstop.dylib' could not be loaded:
  (fat file, but missing compatible architecture (have 'x86_64,arm64', need 'arm64e'))
```

On Apple Silicon, `dyld` runs as `arm64e` and requires inserted libraries (`DYLD_INSERT_LIBRARIES`) to match. The shipped `libdoorstop.dylib` only contains `x86_64` and `arm64` slices — not `arm64e`.

### Failures

- **`arch -arm64` flag**: dyld enforces the architecture check before the process launches.
- **Patching Mach-O headers**: Relabeling the `arm64` slice's CPU subtype to `arm64e` (value `0x02`) resulted in `arm64e.old` rejection. Adding the ptrauth ABI version flag (`0x8002`) resulted in `unknown` architecture. Therefore it can be concluded that `dyld` validates more than just the subtype and checks for chained fixups and pointer authentication support that only exist in binaries actually compiled as `arm64e`.

### Solution

**Compile `libdoorstop.dylib` from source targeting `arm64e`:**

```bash
git clone https://github.com/NeighTools/UnityDoorstop.git
cd UnityDoorstop

# Build arm64e dylib
clang -target arm64e-apple-macos \
  -isysroot /Library/Developer/CommandLineTools/SDKs/MacOSX.sdk \
  -fPIC -Oz -DVERBOSE \
  -dynamiclib \
  -o libdoorstop_arm64e.dylib \
  src/bootstrap.c \
  src/config/common.c \
  src/util/paths.c \
  src/runtimes/globals.c \
  src/nix/entrypoint.c \
  src/nix/util.c \
  src/nix/config.c \
  src/nix/plthook/plthook_osx.c

# Create universal binary
lipo -create \
  libdoorstop_arm64e.dylib \
  build/macosx/x86_64/release/libdoorstop_x86_64.dylib \
  -output libdoorstop.dylib

# Ad-hoc sign
codesign --force --sign - libdoorstop.dylib
```

The key is using `-target arm64e-apple-macos` which makes clang produce a proper arm64e binary with chained fixups (`LC_DYLD_CHAINED_FIXUPS`) and pointer authentication support.

!!! Note
    Adding `-DVERBOSE` enables doorstop's logging output, which is extremely helpful for debugging. Without it, `LOG()` macros are compiled out entirely.

### Result

``` sh
$ file libdoorstop.dylib
libdoorstop.dylib: Mach-O universal binary with 2 architectures:
  [x86_64] [arm64e]
```

`dyld` loads the library successfully.

!!! Note
    For some reason, if `ApplyRuntimePatches` is set to `true` in `BepInEx.cfg`,

    ``` cfg title="BepInEx.cfg"
    [Preloader]
    ApplyRuntimePatches = true
    ```

    `BepInEx` writes its preloader logs inside the `.app` bundle, not in the game directory:

    ``` sh
    ADanceOfFireAndIce.app/Contents/MacOS/preloader_<timestamp>.log
    ```

## MonoMod/Harmony arm64 Incompatibility (UNSOLVED)

### Symptom

`BepInEx` preloader crashes immediately with:

```
HarmonyLib.HarmonyException: IL Compile Error (unknown location)
  ---> System.NullReferenceException: Object reference not set to an instance of an object
    at MonoMod.RuntimeDetour.DetourHelper.GetIdentifiable(MethodBase method)
```

This occurs in two places:

1. `ConsoleSetOutFix.Apply()` — can be bypassed with `ApplyRuntimePatches = false` in config
2. `HarmonyInteropFix.Apply()` — cannot be bypassed via config, crashes at start of `Preloader.Run()`

### Root Cause

The `MonoMod.RuntimeDetour.dll` (~v22.x) bundled with BepInEx 5.x does not support arm64 Mono. `DetourHelper.GetIdentifiable()` returns null because it cannot resolve method metadata on the arm64 Mono runtime.

### Tried Solutions

- `HarmonyBackend = cecil` in `BepInEx/config/BepInEx.cfg` — does not help because the crash occurs in `ILHook` constructor before the backend choice takes effect
- `ApplyRuntimePatches = false` — bypasses the first crash (`ConsoleSetOutFix`) but `HarmonyInteropFix` in `Preloader.Run()` is not controlled by this setting
- Unity Mod Manager (Assembly patching method) — also ships `0Harmony.dll` with the same arm64 incompatibility

### Current State of arm64 MonoMod

- **MonoMod v22.x** (used by BepInEx 5.x): No arm64 support. The `OrionMoonclaw/MonoMod-arm64` fork that had backported arm64 support has been deleted.
- **Fadenfire's MonoMod fork** (`github.com/Fadenfire/MonoMod`, branch `macos-m1`): Still exists as of April 2026, but is based on the `reorganize` branch (v25.x API) which is **not API-compatible** with BepInEx 5.x.
- **MonoMod v25.x** (main repo, `reorganize` branch): Has arm64 support merged via [PR #241](https://github.com/MonoMod/MonoMod/pull/241), but completely different API from v22.x.
- **BepInEx 6.x bleeding edge**: All builds are 6.0.0, only `macos-x64` — no arm64 macOS builds exist.

## What Works

| Component | arm64 Native | Status |
|-----------|-------------|--------|
| UnityDoorstop (libdoorstop.dylib) | Y | Compile from source with `-target arm64e-apple-macos` |
| Doorstop → Mono hooking | Y | Successfully hooks UnityPlayer and intercepts mono_jit_init |
| BepInEx Preloader loading | Y | Assembly loads and entrypoint is invoked |
| MonoMod.RuntimeDetour | N | DetourHelper.GetIdentifiable fails on arm64 Mono |
| Harmony (0Harmony.dll) | N | Depends on MonoMod, crashes on any patch attempt |
| BepInEx plugin loading | N | Blocked by Harmony crash in preloader |
| Unity Mod Manager | N | Assembly patching works but runtime Harmony usage crashes |

## What Would Fix This

Any of the following would unblock native arm64 BepInEx on macOS:

1. **Backport arm64 support to MonoMod v22.x** — build `MonoMod.RuntimeDetour.dll` and `MonoMod.Utils.dll` with arm64 `DetourHelper.GetIdentifiable()` fix, maintaining the v22.x API
2. **BepInEx 5.x update** — upgrade to a MonoMod version with arm64 support while maintaining plugin API compatibility
3. **BepInEx 6.x macOS arm64 builds** — add `macos-arm64` as a build target in the bleeding edge CI
4. **Skip Harmony in preloader** — make `HarmonyInteropFix.Apply()` gracefully handle arm64 failure instead of crashing, allowing plugin loading to proceed (plugins that don't use Harmony would work)

## Workaround

[Run the game under Rosetta](https://sbrothers7.github.io/docs/macOS/ADOFAI%20Modding/Rosetta) for now.
