export type GameStatus = 'Playable' | 'InGame' | 'MainMenu' | 'Logo' | 'DoesntBoot' | 'Unknown';
export type GameCategory = 'Game' | 'Application' | 'SystemApp';
export type Region = 'USA' | 'EUR' | 'JPN' | 'GLOBAL';

export interface GameConfig {
  // Graphics
  bindlessTextures: boolean;
  readbackLinearImages: boolean;
  tessellation: boolean;
  redzoneProtection: boolean;
  vulkanValidation: boolean;
  shaderValidation: boolean;
  gpuAssistedValidation: boolean;
  resolutionScale: '1080p' | '1440p' | '4k' | 'Native';
  vsync: boolean;
  frameLimit: number; // 0 = unlimited, 30, 60, 120

  // CPU / Kernel
  jitEnabled: boolean;
  multithreadedCpu: boolean;
  amprWaitFree: boolean;
  memoryTracker: boolean;
  cfgSafetyCap: number;

  // Audio
  audioDecoder: 'LibAtrac9' | 'Ngs2' | 'Aac' | 'Opus';
  audioChannels: 'Stereo' | '5.1' | '7.1' | '3D Tempest';
  spatialAudio: boolean;
  masterVolume: number; // 0 - 100

  // System & Controller
  consoleLanguage: string;
  lightbarColor: string;
  hapticFeedback: boolean;
  adaptiveTriggers: boolean;
  keyBindings: Record<string, string>;
}

export interface TrophyItem {
  id: string;
  title: string;
  description: string;
  type: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  unlocked: boolean;
  unlockedAt?: string;
  hidden: boolean;
  icon?: string;
}

export interface GameItem {
  id: string;
  title: string;
  titleId: string;
  version: string;
  category: GameCategory;
  region: Region;
  status: GameStatus;
  image: string;
  ebootPath: string;
  gameDir: string;
  size: string;
  fpsTarget: number;
  notes: string;
  lastPlayed?: string;
  config: GameConfig;
  trophies: TrophyItem[];
}

export interface CompatibilityEntry {
  id: string;
  titleId: string;
  title: string;
  status: GameStatus;
  testedVersion: string;
  testedDate: string;
  tester: string;
  hardware: string;
  recommendedFlags: string[];
  notes: string;
}

export interface LogLine {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG' | 'BINDLESS' | 'AMPR' | 'SHADER' | 'VULKAN';
  tag: string;
  message: string;
}

export interface ShaderEntry {
  hash: string;
  type: 'Vertex' | 'Pixel' | 'Compute';
  stage: string;
  status: 'Recompiled' | 'GivingUp' | 'BindlessResolved' | 'Dispatched';
  reason?: string;
  gcnAsm: string[];
  spirvCode: string[];
  descriptorsUsed: number;
  heapBase?: string;
}
