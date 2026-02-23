# Installing Linux

## Asahi Linux

Asahi Linux is a project aimed at apple silicon macs to natively boot linux by reverse-engineering kernel drivers. 
*Very impressive stuff*.

Of course, reverse-engineering does not guarantee full performance of hardware, and some kernel drivers are incomplete, leading to limited OS functionality in some cases.

The project is currently more focused on maintaining and improving their M1 and M2 kernel builds rather than developing kernels for M3 and onwards.

You can find more information at the [Asahi Linux website](https://asahilinux.org/)

## T2 Linux

!!! Important
    Your mac needs to have an **Intel chip** for t2 linux to work.

- [Guide](https://wiki.t2linux.org/)
- [Triple-booting](https://wiki.t2linux.org/guides/windows/)

### Known Caveats

#### Arch Linux

You have to use `iwd` as the backend for `NetworkManager` but it is unstable
