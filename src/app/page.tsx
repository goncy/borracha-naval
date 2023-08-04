"use client";

import {useState} from "react";

const MATRIX_SIZE = 8;
const SHIP_SIZE = 4;
const MATRIX = Array.from({length: MATRIX_SIZE}, (_value, rowIndex) =>
  Array.from({length: MATRIX_SIZE}, (_value, colIndex) => [rowIndex, colIndex] as [number, number]),
);

function isAbove([aRow, aCol]: [number, number], [bRow, bCol]: [number, number]) {
  return aRow === bRow - 1 && aCol === bCol;
}

function isBelow([aRow, aCol]: [number, number], [bRow, bCol]: [number, number]) {
  return aRow === bRow + 1 && aCol === bCol;
}

function isLeft([aRow, aCol]: [number, number], [bRow, bCol]: [number, number]) {
  return aCol === bCol - 1 && aRow === bRow;
}

function isRight([aRow, aCol]: [number, number], [bRow, bCol]: [number, number]) {
  return aCol === bCol + 1 && aRow === bRow;
}

function getCellViability(cell: [number, number], ship: Set<[number, number]>) {
  if (ship.size === 0) return true;
  else if (ship.size >= SHIP_SIZE) return false;
  else if (ship.has(cell)) return false;

  const [cellRow, cellCol] = cell;
  const last = Array.from(ship).at(-1)!;
  const [lastRow, lastCol] = last;

  // Check we can only click cells that allow a full ship to be built
  // ie: If I clicked [1,1] as first cell, I can't go to the left or top
  // because there are not enough cells to build a ship
  if (lastCol === cellCol) {
    // Doesn't fit top
    if (cellRow + 1 < SHIP_SIZE - ship.size) return false;
    // Doesn't fit bottom
    if (MATRIX_SIZE - cellRow < SHIP_SIZE - ship.size) return false;
  } else if (lastRow === cellRow) {
    // Doesn't fit left
    if (cellCol < lastCol && cellCol + 1 < SHIP_SIZE - ship.size) return false;
    // Doesn't fit right
    if (cellCol > lastCol && MATRIX_SIZE - cellCol < SHIP_SIZE - ship.size) return false;
  }

  const [firstRow, firstCol] = Array.from(ship).at(0)!;

  // Check that we only click contiguous cells, horizontally or vertically
  if (ship.size === 1) {
    if (isLeft(cell, last) || isRight(cell, last) || isAbove(cell, last) || isBelow(cell, last)) {
      return true;
    }
  }

  // If we already decided a direction, we can only click cells in that direction
  if (firstRow === lastRow && cellRow === firstRow) {
    // Going left
    if (firstCol > lastCol && cellCol === lastCol - 1) return true;
    // Going right
    if (firstCol < lastCol && cellCol === lastCol + 1) return true;
  }

  if (firstCol === lastCol && cellCol === firstCol) {
    // Going down
    if (firstRow > lastRow && cellRow === lastRow - 1) return true;
    // Going up
    if (firstRow < lastRow && cellRow === lastRow + 1) return true;
  }

  // If it didn't match, return false
  return false;
}

export default function Home() {
  const [ship, setShip] = useState<Set<[number, number]>>(() => new Set());
  const shipIsReady = ship.size === SHIP_SIZE;

  function handleCellClick(cell: [number, number]) {
    const draft = new Set(ship);

    draft.add(cell);

    setShip(draft);
  }

  function handleRemoveLastPiece() {
    const draft = new Set(ship);
    const last = Array.from(ship).at(-1)!;

    draft.delete(last);

    setShip(draft);
  }

  return (
    <main className="grid gap-4">
      <section className="flex w-fit flex-col border">
        {MATRIX.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((cell, colIndex) => {
              const isViable = getCellViability(cell, ship);

              return (
                <div
                  key={colIndex}
                  className={`grid h-16 w-16 place-content-center border ${
                    ship.has(cell) ? "bg-green-500" : "bg-transparent"
                  } ${isViable ? "cursor-pointer" : "cursor-not-allowed"}`}
                  onClick={() => isViable && handleCellClick(cell)}
                >
                  <span>
                    {rowIndex}, {colIndex}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </section>
      <ul className="grid grid-flow-col place-content-between gap-4">
        {ship.size > 0 && (
          <li>
            <button className="rounded border p-4" type="button" onClick={handleRemoveLastPiece}>
              Delete last piece
            </button>
          </li>
        )}
        {Boolean(shipIsReady) && (
          <>
            <li>
              <button className="rounded border p-4" type="button">
                Rotate clockwise
              </button>
            </li>
            <li>
              <button className="rounded border p-4" type="button">
                Rotate anti-clockwise
              </button>
            </li>
          </>
        )}
      </ul>
    </main>
  );
}
