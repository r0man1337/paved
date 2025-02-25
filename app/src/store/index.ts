import { create } from "zustand";
import { Entity } from "@dojoengine/recs";

export const CAMERA_SETTINGS: {
  position: [number, number, number];
  rotation: [number, number, number];
  zoom: number;
  aspect: number;
  near: number;
  far: number;
  reset: boolean;
} = {
  position: [0, 0, 0],
  rotation: [Math.PI / 2, 0, 0],
  zoom: 5,
  aspect: 1.77,
  near: 1,
  far: 2000,
  reset: false,
};

export interface Tile {
  col: number;
  row: number;
}

interface LobbyState {
  playerEntity: Entity | null;
  setPlayerEntity: (playerEntity: Entity) => void;
  resetPlayerEntity: () => void;
  mode: string;
  setMode: (mode: string) => void;
  resetMode: () => void;
}

interface CameraState {
  position: [number, number, number];
  setPosition: (position: [number, number, number]) => void;
  resetPosition: () => void;
  rotation: [number, number, number];
  setRotation: (rotation: [number, number, number]) => void;
  resetRotation: () => void;
  zoom: number;
  setZoom: (zoom: number) => void;
  resetZoom: () => void;
  aspect: number;
  setAspect: (aspect: number) => void;
  resetAspect: () => void;
  near: number;
  setNear: (near: number) => void;
  resetNear: () => void;
  far: number;
  setFar: (far: number) => void;
  resetFar: () => void;
  reset: boolean;
  setReset: (reset: boolean) => void;
  resetAll: () => void;
  resetButPosition: () => void;
  compassRotation: number;
  setCompassRotate: (compassRotation: number) => void;
  resetCompassRotation: () => void;
}

interface GameState {
  gameId: number;
  setGameId: (gameId: number) => void;
  builderId: number;
  setBuilderId: (builderId: number) => void;
  orientation: number;
  setOrientation: (orientation: number) => void;
  resetOrientation: () => void;
  order: number;
  setOrder: (order: number) => void;
  character: number;
  setCharacter: (character: number) => void;
  resetCharacter: () => void;
  spot: number;
  setSpot: (spot: number) => void;
  rotateSpot: (spot: number, clockwise: boolean) => void;
  resetSpot: () => void;
  x: number;
  setX: (x: number) => void;
  resetX: () => void;
  y: number;
  setY: (y: number) => void;
  resetY: () => void;
  selectedTile: Tile;
  setSelectedTile: (tile: Tile) => void;
  resetSelectedTile: () => void;
  activeEntity: undefined | Entity;
  setActiveEntity: (entity: Entity | undefined) => void;
  resetActiveEntity: () => void;
  hoveredTile: Tile;
  setHoveredTile: (tile: Tile) => void;
  resetHoveredTile: () => void;
  valid: boolean;
  setValid: (valid: boolean) => void;
  resetValid: () => void;
}

export const useLobbyStore = create<LobbyState>()((set, get) => ({
  playerEntity: null,
  setPlayerEntity: (playerEntity: Entity) => set({ playerEntity }),
  resetPlayerEntity: () => set({ playerEntity: null }),
  mode: "ranked",
  setMode: (mode) => set({ mode }),
  resetMode: () => set({ mode: "single" }),
}));

export const useCameraStore = create<CameraState>()((set, get) => ({
  position: CAMERA_SETTINGS.position,
  setPosition: (position) => set({ position }),
  resetPosition: () => set({ position: CAMERA_SETTINGS.position }),
  rotation: CAMERA_SETTINGS.rotation,
  setRotation: (rotation) => set({ rotation }),
  resetRotation: () => set({ rotation: CAMERA_SETTINGS.rotation }),
  zoom: CAMERA_SETTINGS.zoom,
  setZoom: (zoom) => set({ zoom }),
  resetZoom: () => set({ zoom: CAMERA_SETTINGS.zoom }),
  aspect: CAMERA_SETTINGS.aspect,
  setAspect: (aspect) => set({ aspect }),
  resetAspect: () => set({ aspect: CAMERA_SETTINGS.aspect }),
  near: CAMERA_SETTINGS.near,
  setNear: (near) => set({ near }),
  resetNear: () => set({ near: CAMERA_SETTINGS.near }),
  far: 10,
  setFar: (far) => set({ far }),
  resetFar: () => set({ far: CAMERA_SETTINGS.far }),
  reset: CAMERA_SETTINGS.reset,
  setReset: (reset) => set({ reset }),
  resetAll: () => set({ ...CAMERA_SETTINGS }),
  resetButPosition: () =>
    set({
      rotation: CAMERA_SETTINGS.rotation,
      zoom: CAMERA_SETTINGS.zoom,
    }),
  compassRotation: 0,
  setCompassRotate: (compassRotation) => set({ compassRotation }),
  resetCompassRotation: () => set({ compassRotation: 0 }),
}));

export const useGameStore = create<GameState>()((set, get) => ({
  gameId: 0,
  setGameId: (gameId) => set({ gameId }),
  builderId: 0,
  setBuilderId: (builderId) => set({ builderId }),
  orientation: 1,
  setOrientation: (orientation) => {
    // Keep orientation between 1 and 4
    if (orientation < 1) {
      orientation = 4;
    } else {
      orientation = ((orientation - 1) % 4) + 1;
    }
    set({ orientation });
  },
  resetOrientation: () => set({ orientation: 1 }),
  order: 1,
  setOrder: (order) => set({ order }),
  character: 0,
  setCharacter: (character) => set({ character }),
  resetCharacter: () => set({ character: 0 }),
  spot: 0,
  setSpot: (spot) => set({ spot }),
  rotateSpot: (spot, clockwise) => {
    let newSpot = spot;
    if (spot >= 2 && spot <= 7 && clockwise) {
      newSpot += 2;
    } else if (spot >= 4 && spot <= 9 && !clockwise) {
      newSpot -= 2;
    } else if (spot === 8 && clockwise) {
      newSpot = 2;
    } else if (spot === 2 && !clockwise) {
      newSpot = 8;
    } else if (spot === 9 && clockwise) {
      newSpot = 3;
    } else if (spot === 3 && !clockwise) {
      newSpot = 9;
    }
    set({ spot: newSpot });
  },
  resetSpot: () => set({ spot: 0 }),
  x: 0,
  setX: (x) => set({ x }),
  resetX: () => set({ x: 0 }),
  y: 0,
  setY: (y) => set({ y }),
  resetY: () => set({ y: 0 }),
  selectedTile: { col: 0, row: 0 },
  setSelectedTile: (tile) => set({ selectedTile: tile }),
  resetSelectedTile: () => set({ selectedTile: { col: 0, row: 0 } }),
  activeEntity: undefined,
  setActiveEntity: (entity) => set({ activeEntity: entity }),
  resetActiveEntity: () => set({ activeEntity: undefined }),
  hoveredTile: { col: 0, row: 0 },
  setHoveredTile: (tile) => set({ hoveredTile: tile }),
  resetHoveredTile: () => set({ hoveredTile: { col: 0, row: 0 } }),
  valid: false,
  setValid: (valid) => set({ valid }),
  resetValid: () => set({ valid: false }),
}));
