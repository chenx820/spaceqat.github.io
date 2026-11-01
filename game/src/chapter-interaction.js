// Coordinates share the chapter canvas's logical 640 × 360 floor.
export const chapterResident={x:544,y:284,approachX:520,radius:34};
export function nearChapterResident(player){return Math.hypot(player.x-chapterResident.x,player.y-chapterResident.y)<chapterResident.radius}
