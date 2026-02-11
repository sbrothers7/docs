# GRUB

GRUB is a popular bootloader used by linux users.

## Reparing GRUB

When dual-booting Windows, GRUB can break if you:

- install a new Windows update
- reinstall Windows

Plus, it's just very easy to break.

I have found that the most optimal way of reparing GRUB is to use live installation media and `chroot`ing.

1. Prepare a [bootable USB](sbrothers7.github.io/Documentation/Other/Bootable-Media)
2. Check partition layout using `lsblk`
3. Mount partitions

    !!! note
        If you're using btrfs subvolumes, you need to mount them separately, then mount the boot partition. For example:

        ``` sh
        mount -o subvol=@ /dev/nvme0n1p2 /mnt
        mount -o subvol=@home /dev/nvme0np2 /mnt/home
        mount /dev/nvme0n1p1 /boot
        ```

    !!! warning
        Your ESP might be set to `/boot/efi`, in which case, you should mount the boot partition at said location.

4. chroot

    ``` sh
    chroot /mnt
    ```

    !!! note
        If you're using Arch Linux, `arch-chroot` is also available

    Consult the [arch wiki](https://wiki.archlinux.org/title/Chroot) for additional information.

5. 