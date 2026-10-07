CMAKE ?= cmake
JOBS ?= $(shell nproc)

MINGW_TRIPLE ?= x86_64-w64-mingw32
MINGW_TOOLCHAIN := $(CURDIR)/cmake/mingw-w64-x86_64.cmake

BUILD_DEBUG := build/debug
BUILD_RELEASE := build/release
BUILD_MINGW_DEBUG := build/mingw-debug
BUILD_MINGW_RELEASE := build/mingw-release

.PHONY: all dev release mingw mingwdev win check-mingw clean clean-debug clean-release clean-mingw clean-mingw-debug clean-mingw-release

all: release

release:
	$(CMAKE) -S . -B $(BUILD_RELEASE) -DCMAKE_BUILD_TYPE=Release
	$(CMAKE) --build $(BUILD_RELEASE) -j$(JOBS)

dev:
	$(CMAKE) -S . -B $(BUILD_DEBUG) -DCMAKE_BUILD_TYPE=Debug
	$(CMAKE) --build $(BUILD_DEBUG) -j$(JOBS)

check-mingw:
	@command -v $(MINGW_TRIPLE)-g++ >/dev/null || (echo "Нет $(MINGW_TRIPLE)-g++. Установи: sudo apt install g++-mingw-w64-x86-64" && exit 1)
	@command -v $(MINGW_TRIPLE)-gcc >/dev/null || (echo "Нет $(MINGW_TRIPLE)-gcc. Установи: sudo apt install gcc-mingw-w64-x86-64" && exit 1)

mingw: check-mingw
	$(CMAKE) -S . -B $(BUILD_MINGW_RELEASE) -DCMAKE_TOOLCHAIN_FILE=$(MINGW_TOOLCHAIN) -DCMAKE_BUILD_TYPE=Release
	$(CMAKE) --build $(BUILD_MINGW_RELEASE) -j$(JOBS)

mingwdev: check-mingw
	$(CMAKE) -S . -B $(BUILD_MINGW_DEBUG) -DCMAKE_TOOLCHAIN_FILE=$(MINGW_TOOLCHAIN) -DCMAKE_BUILD_TYPE=Debug
	$(CMAKE) --build $(BUILD_MINGW_DEBUG) -j$(JOBS)

win: mingw

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
