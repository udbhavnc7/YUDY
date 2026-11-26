export const ROOM_ASSET = {
  rug: 1, chair: 2, sofa: 4, posters: 8, books: 16, showcase: 32,
  coffeeTable: 64, readingCorner: 128, royalChair: 256, workstation: 512, chandelier: 1024, curtains: 2048,
} as const;

const ranges = [
  [ROOM_ASSET.rug, 0.04, 0.52], [ROOM_ASSET.rug, 0.77, 1],
  [ROOM_ASSET.chair, 0.035, 0.42], [ROOM_ASSET.chair, 0.82, 1],
  [ROOM_ASSET.sofa, 0.08, 0.59], [ROOM_ASSET.sofa, 0.78, 1],
  [ROOM_ASSET.posters, 0.17, 0.66], [ROOM_ASSET.posters, 0.79, 1],
  [ROOM_ASSET.books, 0.29, 1],
  [ROOM_ASSET.showcase, 0.61, 1],
  [ROOM_ASSET.coffeeTable, 0.15, 0.59], [ROOM_ASSET.coffeeTable, 0.78, 1],
  [ROOM_ASSET.readingCorner, 0.15, 0.59], [ROOM_ASSET.readingCorner, 0.78, 1],
  [ROOM_ASSET.royalChair, 0.78, 1], [ROOM_ASSET.workstation, 0.78, 1],
  [ROOM_ASSET.chandelier, 0.66, 1],
  [ROOM_ASSET.curtains, 0.15, 0.59], [ROOM_ASSET.curtains, 0.78, 1],
] as const;

export const REVEAL_ASSETS = roomAssets(1, 1);

export function roomAssets(progress: number, destination: number) {
  let assets = 0;
  for (const [asset, start, end] of ranges) {
    if ((progress >= start && progress <= end) || (destination >= start && destination <= end)) assets |= asset;
  }
  return assets;
}
