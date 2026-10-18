#!/usr/bin/env bash
set -euo pipefail

# KytyPS5 Linux Native Build Script
# Targets: kyty_emulator, launcher, and unit tests

echo "========================================="
echo "  KytyPS5 Linux Native Build Orchestrator"
echo "========================================="

BUILD_DIR="${1:-_Build/linux}"
INSTALL_DIR="${2:-_Build/linux/install}"
BUILD_TYPE="${BUILD_TYPE:-Release}"

echo "Configuration:"
echo "  Build Directory:   $BUILD_DIR"
echo "  Install Directory: $INSTALL_DIR"
echo "  Build Type:        $BUILD_TYPE"
echo ""

# Check for essential tools
command -v cmake >/dev/null 2>&1 || { echo >&2 "Error: cmake is required but not installed."; exit 1; }
command -v ninja >/dev/null 2>&1 || { echo >&2 "Error: ninja is required but not installed."; exit 1; }

# Pick compiler
if command -v clang++ >/dev/null 2>&1; then
  CC=clang
  CXX=clang++
elif command -v g++ >/dev/null 2>&1; then
  CC=gcc
  CXX=g++
else
  echo >&2 "Error: Neither clang++ nor g++ was found."
  exit 1
fi

echo "Using compiler: $CXX ($($CXX --version | head -n1))"

# Locate Qt6 if not set
QT6_PREFIX=""
if [ -z "${Qt6_DIR:-}" ]; then
  for candidate in \
    /usr/lib/x86_64-linux-gnu/cmake/Qt6 \
    /usr/lib64/cmake/Qt6 \
    /usr/lib/cmake/Qt6 \
    /opt/Qt/6.*/gcc_64; do
    if [ -d "$candidate" ]; then
      QT6_PREFIX="$candidate"
      break
    fi
  done
else
  QT6_PREFIX="$Qt6_DIR"
fi

CMAKE_FLAGS=(
  -S .
  -B "$BUILD_DIR"
  -G Ninja
  -DCMAKE_BUILD_TYPE="$BUILD_TYPE"
  -DCMAKE_C_COMPILER="$CC"
  -DCMAKE_CXX_COMPILER="$CXX"
)

if [ -n "$QT6_PREFIX" ]; then
  echo "Found Qt6 at: $QT6_PREFIX"
  CMAKE_FLAGS+=("-DCMAKE_PREFIX_PATH=$QT6_PREFIX")
fi

echo ""
echo "-> Configuring CMake..."
cmake "${CMAKE_FLAGS[@]}"

echo ""
echo "-> Building KytyPS5 targets (launcher, kyty_emulator)..."
cmake --build "$BUILD_DIR" --target launcher kyty_emulator --parallel "$(nproc)"

echo ""
echo "-> Installing to $INSTALL_DIR..."
cmake --install "$BUILD_DIR" --prefix "$INSTALL_DIR"

echo ""
echo "========================================="
echo "  Build completed successfully!"
echo "  Binaries located in: $INSTALL_DIR"
echo "  Launcher: $INSTALL_DIR/launcher"
echo "  Emulator: $INSTALL_DIR/kyty_emulator"
echo "========================================="
