#!/bin/bash
set -e # Exit immediately if any command fails

# --- Configuration ---
SCRIPT_DIR=$(pwd)
BASE_IMG_DIR="$SCRIPT_DIR/base_images"
OVERLAY_DIR="$SCRIPT_DIR/task2_overlays"

ROUTER_BASE_PATH="$BASE_IMG_DIR/router.qcow2"
PC_BASE_PATH="$BASE_IMG_DIR/linux-pc.qcow2"

ROUTER_OVERLAY="$OVERLAY_DIR/router-overlay.qcow2"
PC1_OVERLAY="$OVERLAY_DIR/pc1-overlay.qcow2"
PC2_OVERLAY="$OVERLAY_DIR/pc2-overlay.qcow2"

# --- Checks ---
if [ ! -f "$ROUTER_BASE_PATH" ]; then
    echo "ERROR: Router image missing at $ROUTER_BASE_PATH"
    exit 1
fi
if [ ! -f "$PC_BASE_PATH" ]; then
    echo "ERROR: PC image missing at $PC_BASE_PATH"
    exit 1
fi

# --- Setup ---
# Kill any previous stray lab processes specifically
pkill -f "task2_overlays" || true
sleep 1

echo "Setting up overlay directory..."
rm -rf "$OVERLAY_DIR"
mkdir -p "$OVERLAY_DIR"

echo "Creating overlays..."
qemu-img create -f qcow2 -F qcow2 -b "$ROUTER_BASE_PATH" "$ROUTER_OVERLAY" > /dev/null
qemu-img create -f qcow2 -F qcow2 -b "$PC_BASE_PATH" "$PC1_OVERLAY" > /dev/null
qemu-img create -f qcow2 -F qcow2 -b "$PC_BASE_PATH" "$PC2_OVERLAY" > /dev/null

# --- Launch PCs (Background) ---
# Using multicast (mcast) for robust networking
echo "--------------------------------------------------"
echo "Launching PC1 (VNC: :1 / Port 5901)..."
qemu-system-x86_64 \
    -m 512M \
    -drive file="$PC1_OVERLAY",if=virtio,media=disk \
    -netdev socket,id=net0,mcast=230.0.0.1:1234 \
    -device e1000,netdev=net0,mac=DE:AD:BE:EF:01:02 \
    -vnc :1 \
    -daemonize

echo "Launching PC2 (VNC: :2 / Port 5902)..."
qemu-system-x86_64 \
    -m 512M \
    -drive file="$PC2_OVERLAY",if=virtio,media=disk \
    -netdev socket,id=net0,mcast=230.0.0.2:1234 \
    -device e1000,netdev=net0,mac=DE:AD:BE:EF:02:02 \
    -vnc :2 \
    -daemonize

# --- Launch Router (Interactive) ---
echo "--------------------------------------------------"
echo "Launching Router in THIS terminal."
echo "Wait for boot, then press Enter."
echo "To quit the lab: Press 'Ctrl+A' then 'X'. If doesnt work, give Ctrl+C."
echo "--------------------------------------------------"
sleep 2

qemu-system-x86_64 \
    -m 1G \
    -drive file="$ROUTER_OVERLAY",if=virtio,media=disk \
    -nographic \
    -netdev socket,id=net0,mcast=230.0.0.1:1234 \
    -device e1000,netdev=net0,mac=DE:AD:BE:EF:01:01 \
    -netdev socket,id=net1,mcast=230.0.0.2:1234 \
    -device e1000,netdev=net1,mac=DE:AD:BE:EF:02:01

# --- Cleanup ---
echo -e "\nShutting down background PCs..."
pkill -f "task2_overlays" || true
echo "Lab stopped."
