"use client";

import {useState} from "react";

const MATRIX_SIZE = 8;
const SHIP_SIZE = 4;
const MATRIX = Array.from({length: MATRIX_SIZE}, (_value, rowIndex) =>
  Array.from({length: MATRIX_SIZE}, (_value, colIndex) => [rowIndex, colIndex] as [number, number]),
);

function getCellViability(cell: [number, number], ship: Set<[number, number]>) {
  if (ship.size === 0) return true;
  else if (ship.size >= SHIP_SIZE) return false;
  else if (ship.has(cell)) return false;

  const [cellRow, cellCol] = cell;
  const [lastRow, lastCol] = Array.from(ship).at(-1)!;
  const [firstRow, firstCol] = Array.from(ship).at(0)!;

  // Check that we only click contiguous cells, horizontally or vertically
  if (ship.size === 1) {
    if (cellRow === firstRow && (cellCol === firstCol - 1 || cellCol === firstCol + 1)) return true;
    if (cellCol === firstCol && (cellRow === firstRow - 1 || cellRow === firstRow + 1)) return true;
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

  function handleRotate(direction: "clockwise" | "counter-clockwise") {
    const draft = new Set<[number, number]>();
    const shipArray = Array.from(ship);
    const [firstRow, firstCol] = shipArray.at(0)!;
    const [lastRow, lastCol] = shipArray.at(-1)!;

    for (let i = 0; i < SHIP_SIZE; i++) {
      let value: [number, number] = shipArray[i];

      // Rotate counter-clockwise by negating the index
      const v = direction === "clockwise" ? i : -i;

      if (firstRow === lastRow) {
        value =
          firstCol < lastCol
            ? // Going right
              MATRIX[firstRow + v]?.[firstCol]
            : // Going left
              MATRIX[firstRow - v]?.[firstCol];
      } else if (firstCol === lastCol) {
        value =
          firstRow < lastRow
            ? // Going down
              MATRIX[firstRow]?.[firstCol - v]
            : // Going up
              MATRIX[firstRow]?.[firstCol + v];
      }

      // If can't rotate, rise an error
      if (!value) return alert("Can't rotate");

      // Add value to draft
      draft.add(value);
    }

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
        <li>
          <button
            className="rounded border p-4 disabled:opacity-50"
            disabled={!shipIsReady}
            type="button"
            onClick={() => handleRotate("counter-clockwise")}
          >
            ↺
          </button>
        </li>
        <li>
          <button
            className="rounded border p-4 disabled:opacity-50"
            disabled={ship.size < 1}
            type="button"
            onClick={handleRemoveLastPiece}
          >
            ⌫
          </button>
        </li>
        <li>
          <button
            className="rounded border p-4 disabled:opacity-50"
            disabled={!shipIsReady}
            type="button"
            onClick={() => handleRotate("clockwise")}
          >
            ↻
          </button>
        </li>
      </ul>
    </main>
  );
}
