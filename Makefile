CMAKE ?= cmake
JOBS ?= $(shell nproc)

MINGW_TRIPLE ?= x86_64-w64-mingw32
MINGW_CC := $(MINGW_TRIPLE)-gcc
MINGW_CXX := $(MINGW_TRIPLE)-g++
MINGW_RC := $(MINGW_TRIPLE)-windres

BUILD_DEBUG := build/debug
BUILD_RELEASE := build/release
BUILD_MINGW_DEBUG := build/mingw-debug
BUILD_MINGW_RELEASE := build/mingw-release

.PHONY: all dev release mingw mingwdev clean clean-debug clean-release clean-mingw clean-mingw-debug clean-mingw-release

all: release

release:
	$(CMAKE) -S . -B $(BUILD_RELEASE) -DCMAKE_BUILD_TYPE=Release
	$(CMAKE) --build $(BUILD_RELEASE) -j$(JOBS)

dev:
	$(CMAKE) -S . -B $(BUILD_DEBUG) -DCMAKE_BUILD_TYPE=Debug
	$(CMAKE) --build $(BUILD_DEBUG) -j$(JOBS)

mingw:
	$(CMAKE) -S . -B $(BUILD_MINGW_RELEASE) -DCMAKE_SYSTEM_NAME=Windows -DCMAKE_C_COMPILER=$(MINGW_CC) -DCMAKE_CXX_COMPILER=$(MINGW_CXX) -DCMAKE_RC_COMPILER=$(MINGW_RC) -DCMAKE_BUILD_TYPE=Release
	$(CMAKE) --build $(BUILD_MINGW_RELEASE) -j$(JOBS)

mingwdev:
	$(CMAKE) -S . -B $(BUILD_MINGW_DEBUG) -DCMAKE_SYSTEM_NAME=Windows -DCMAKE_C_COMPILER=$(MINGW_CC) -DCMAKE_CXX_COMPILER=$(MINGW_CXX) -DCMAKE_RC_COMPILER=$(MINGW_RC) -DCMAKE_BUILD_TYPE=Debug
	$(CMAKE) --build $(BUILD_MINGW_DEBUG) -j$(JOBS)

clean:
	rm -rf build

clean-debug:
	rm -rf $(BUILD_DEBUG)

clean-release:
	rm -rf $(BUILD_RELEASE)

clean-mingw:
	rm -rf $(BUILD_MINGW_DEBUG) $(BUILD_MINGW_RELEASE)

clean-mingw-debug:
	rm -rf $(BUILD_MINGW_DEBUG)

clean-mingw-release:
	rm -rf $(BUILD_MINGW_RELEASE)
