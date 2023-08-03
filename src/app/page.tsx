"use client";

import {useState} from "react";

const MATRIX_SIZE = 8;
const SHIP_SIZE = 4;
const MATRIX = Array.from({length: MATRIX_SIZE}, (_value, rowIndex) =>
  Array.from({length: MATRIX_SIZE}, (_value, colIndex) => Symbol(`${rowIndex}-${colIndex}`)),
);

function getCellViability(cell: symbol, ship: Set<symbol>) {
  if (ship.size === 0) return true;
  else if (ship.size >= SHIP_SIZE) return false;
  else if (ship.has(cell)) return false;
  else if (ship.size === 1) {
    const [firstShipCellRowIndex, firstShipCellColIndex] = Array.from(ship)[0]
      .description!.split("-")
      .map(Number);
    const [checkedCellRowIndex, checkedCellColIndex] = cell.description!.split("-").map(Number);

    // Check we can only click cells that allow a full ship to be built
    // ie: If I clicked [1,1] as first cell, I can't go to the left or top
    // because there are not enough cells to build a ship
    if (checkedCellRowIndex < firstShipCellRowIndex && checkedCellRowIndex <= 1) return false;
    if (
      checkedCellRowIndex > firstShipCellRowIndex &&
      checkedCellRowIndex > MATRIX_SIZE - (SHIP_SIZE - 1)
    )
      return false;
    if (checkedCellColIndex < firstShipCellColIndex && checkedCellColIndex <= 1) return false;
    if (
      checkedCellColIndex > firstShipCellColIndex &&
      checkedCellColIndex > MATRIX_SIZE - (SHIP_SIZE - 1)
    )
      return false;

    // Check that we only click contiguous cells
    if (checkedCellRowIndex === firstShipCellRowIndex) {
      if (
        checkedCellColIndex === firstShipCellColIndex - 1 ||
        checkedCellColIndex === firstShipCellColIndex + 1
      )
        return true;
    }
    if (checkedCellColIndex === firstShipCellColIndex) {
      if (
        checkedCellRowIndex === firstShipCellRowIndex - 1 ||
        checkedCellRowIndex === firstShipCellRowIndex + 1
      )
        return true;
    }

    return false;
  } else if (ship.size >= 2) {
    const [firstShipCellRowIndex, firstShipCellColIndex] = Array.from(ship)
      .at(0)!
      .description!.split("-")
      .map(Number);
    const [lastShipCellRowIndex, lastShipCellColIndex] = Array.from(ship)
      .at(-1)!
      .description!.split("-")
      .map(Number);
    const [checkedCellRowIndex, checkedCellColIndex] = cell.description!.split("-").map(Number);

    // Checks for horizontal ships
    if (
      firstShipCellRowIndex === lastShipCellRowIndex &&
      checkedCellRowIndex === firstShipCellRowIndex
    ) {
      if (
        firstShipCellColIndex > lastShipCellColIndex &&
        checkedCellColIndex === lastShipCellColIndex - 1
      )
        return true;
      else if (
        firstShipCellColIndex < lastShipCellColIndex &&
        checkedCellColIndex === lastShipCellColIndex + 1
      )
        return true;
      // Checks for vertical ships
    } else if (
      firstShipCellColIndex === lastShipCellColIndex &&
      checkedCellColIndex === firstShipCellColIndex
    ) {
      if (
        firstShipCellRowIndex > lastShipCellRowIndex &&
        checkedCellRowIndex === lastShipCellRowIndex - 1
      )
        return true;
      else if (
        firstShipCellRowIndex < lastShipCellRowIndex &&
        checkedCellRowIndex === lastShipCellRowIndex + 1
      )
        return true;
    }

    return false;
  }

  return false;
}

export default function Home() {
  const [ship, setShip] = useState<Set<symbol>>(() => new Set());

  function handleCellClick(cell: symbol) {
    const draft = new Set(ship);

    draft.add(cell);

    setShip(draft);
  }

  return (
    <main className="flex w-fit flex-col border">
      {MATRIX.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {row.map((cell, colIndex) => {
            const isViable = getCellViability(cell, ship);

            return (
              <div
                key={colIndex}
                className={`grid h-16 w-16 cursor-pointer place-content-center border ${
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
    </main>
  );
}
