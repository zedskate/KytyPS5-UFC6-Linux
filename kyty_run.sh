#!/usr/bin/env bash
# KytyPS5 Linux Launch Wrapper
# Sets up Vulkan and environment variables for Linux execution

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BIN_PATH="${SCRIPT_DIR}/_Build/linux/install/kyty_emulator"

if [ ! -f "$BIN_PATH" ]; then
  if [ -f "${SCRIPT_DIR}/kyty_emulator" ]; then
    BIN_PATH="${SCRIPT_DIR}/kyty_emulator"
  else
    echo "Error: kyty_emulator not found in _Build/linux/install or root directory."
    echo "Please build the project first with ./scripts/build_linux.sh"
    exit 1
  fi
fi

# Recommended Linux environment variables for Vulkan & AMD RADV / NVIDIA
export VK_KHRONOS_VALIDATION_GPUAV_SHARED_MEMORY_DATA_RACE=false

# If game argument is provided, forward it with optimal flags for titles like Wolverine/Spider-Man
echo "Starting KytyPS5 Emulator on Linux..."
echo "Binary: $BIN_PATH"
echo "Arguments: $@"

exec "$BIN_PATH" "$@"
