# Installing Linux

## Asahi Linux

Asahi Linux is a project aimed at apple silicon macs to natively boot linux by reverse-engineering kernel drivers. 
*Very impressive stuff*.

Of course, reverse-engineering does not guarantee full performance of hardware, and some kernel drivers are incomplete, leading to limited OS functionality in some cases. There has been significant progress for the M1 and M2 drivers, however.

Asahi is currently developing drivers for the M3 and M4 models.

You can find more information at the [Asahi Linux website](https://asahilinux.org/)

## T2 Linux

T2 Linux is a project aimed to enable booting linux on devices with the T2 chip. If your device was manufactured between late-2017 and mid-2023, it is likely that it has a T2 chip installed.

!!! Important
    Your mac needs to have an **Intel chip** for t2 linux to work.

- [Guide](https://wiki.t2linux.org/)
- [Triple-booting](https://wiki.t2linux.org/guides/windows/)

### Known Caveats

#### Arch Linux

You have to use `iwd` as the backend for `NetworkManager` but it is unstable
