import { createBoard, markedTilesCount, TILE_STATUSES, markTile, revealTile, checkWin, checkLose, positionMatch } from "./minesweeper.js";

describe("#createBoard", () => {
  test("it creates a valid board", () => {
    const boardSize = 2;
    const minePositions = [{ x: 0, y: 1 }];
    const expectedBoard = [
      [
        { x: 0, y: 0, status: TILE_STATUSES.HIDDEN, mine: false },
        { x: 0, y: 1, status: TILE_STATUSES.HIDDEN, mine: true },
      ],
      [
        { x: 1, y: 0, status: TILE_STATUSES.HIDDEN, mine: false },
        { x: 1, y: 1, status: TILE_STATUSES.HIDDEN, mine: false },
      ],
    ];
    const board = createBoard(boardSize, minePositions);
    expect(board).toEqual(expectedBoard);
  });
});

describe("#markedTilesCount", () => {
  test("with some marked tiles", () => {
    const board = [
      [
        { x: 0, y: 0, status: TILE_STATUSES.HIDDEN, mine: false },
        { x: 0, y: 1, status: TILE_STATUSES.MARKED, mine: true },
      ],
      [
        { x: 1, y: 0, status: TILE_STATUSES.HIDDEN, mine: false },
        { x: 1, y: 1, status: TILE_STATUSES.HIDDEN, mine: false },
      ],
    ];

    expect(markedTilesCount(board)).toEqual(1);
  });

  test("with no marked tiles", () => {
    const board = [
      [
        { x: 0, y: 0, status: TILE_STATUSES.HIDDEN, mine: false },
        { x: 0, y: 1, status: TILE_STATUSES.HIDDEN, mine: true },
      ],
      [
        { x: 1, y: 0, status: TILE_STATUSES.HIDDEN, mine: false },
        { x: 1, y: 1, status: TILE_STATUSES.HIDDEN, mine: false },
      ],
    ];

    expect(markedTilesCount(board)).toEqual(0);
  });

  test("with all marked tiles", () => {
    const board = [
      [
        { x: 0, y: 0, status: TILE_STATUSES.MARKED, mine: false },
        { x: 0, y: 1, status: TILE_STATUSES.MARKED, mine: true },
      ],
      [
        { x: 1, y: 0, status: TILE_STATUSES.MARKED, mine: false },
        { x: 1, y: 1, status: TILE_STATUSES.MARKED, mine: false },
      ],
    ];

    expect(markedTilesCount(board)).toEqual(4);
  });
});

describe("#markTile", () => {
  test("hidden tile gets marked", () => {
    const board = [
      [
        { x: 0, y: 0, status: TILE_STATUSES.HIDDEN, mine: false },
        { x: 0, y: 1, status: TILE_STATUSES.HIDDEN, mine: true },
      ],
      [
        { x: 1, y: 0, status: TILE_STATUSES.HIDDEN, mine: false },
        { x: 1, y: 1, status: TILE_STATUSES.HIDDEN, mine: false },
      ],
    ];
    const expectedBoard = [
      [
        { x: 0, y: 0, status: TILE_STATUSES.MARKED, mine: false },
        { x: 0, y: 1, status: TILE_STATUSES.HIDDEN, mine: true },
      ],
      [
        { x: 1, y: 0, status: TILE_STATUSES.HIDDEN, mine: false },
        { x: 1, y: 1, status: TILE_STATUSES.HIDDEN, mine: false },
      ],
    ];

    expect(markTile(board, { x: 0, y: 0 })).toEqual(expectedBoard);
  });

  test("marked tile gets unmarked", () => {
    const board = [
      [
        { x: 0, y: 0, status: TILE_STATUSES.MARKED, mine: false },
        { x: 0, y: 1, status: TILE_STATUSES.HIDDEN, mine: true },
      ],
      [
        { x: 1, y: 0, status: TILE_STATUSES.HIDDEN, mine: false },
        { x: 1, y: 1, status: TILE_STATUSES.HIDDEN, mine: false },
      ],
    ];
    const expectedBoard = [
      [
        { x: 0, y: 0, status: TILE_STATUSES.HIDDEN, mine: false },
        { x: 0, y: 1, status: TILE_STATUSES.HIDDEN, mine: true },
      ],
      [
        { x: 1, y: 0, status: TILE_STATUSES.HIDDEN, mine: false },
        { x: 1, y: 1, status: TILE_STATUSES.HIDDEN, mine: false },
      ],
    ];

    expect(markTile(board, { x: 0, y: 0 })).toEqual(expectedBoard);
  });

  test("mine tile gets nothing", () => {
    const board = [
      [
        { x: 0, y: 0, status: TILE_STATUSES.MINE, mine: false },
        { x: 0, y: 1, status: TILE_STATUSES.HIDDEN, mine: true },
      ],
      [
        { x: 1, y: 0, status: TILE_STATUSES.HIDDEN, mine: false },
        { x: 1, y: 1, status: TILE_STATUSES.HIDDEN, mine: false },
      ],
    ];

    expect(markTile(board, { x: 0, y: 0 })).toEqual(board);
  });

  test("number tile gets nothing", () => {
    const board = [
      [
        { x: 0, y: 0, status: TILE_STATUSES.NUMBER, mine: false },
        { x: 0, y: 1, status: TILE_STATUSES.HIDDEN, mine: true },
      ],
      [
        { x: 1, y: 0, status: TILE_STATUSES.HIDDEN, mine: false },
        { x: 1, y: 1, status: TILE_STATUSES.HIDDEN, mine: false },
      ],
    ];

    expect(markTile(board, { x: 0, y: 0 })).toEqual(board);
  });
});

describe("#revealTile", () => {
  describe("with a hidden tile", () => {
    const board = [
      [
        { x: 0, y: 0, status: TILE_STATUSES.HIDDEN, mine: false },
        { x: 0, y: 1, status: TILE_STATUSES.HIDDEN, mine: true },
      ],
      [
        { x: 1, y: 0, status: TILE_STATUSES.HIDDEN, mine: false },
        { x: 1, y: 1, status: TILE_STATUSES.HIDDEN, mine: false },
      ],
    ];
    test("when the tile is a mine it sets its status to the mine", () => {
      const expectedBoard = [
        [
          { x: 0, y: 0, status: TILE_STATUSES.HIDDEN, mine: false },
          { x: 0, y: 1, status: TILE_STATUSES.MINE, mine: true },
        ],
        [
          { x: 1, y: 0, status: TILE_STATUSES.HIDDEN, mine: false },
          { x: 1, y: 1, status: TILE_STATUSES.HIDDEN, mine: false },
        ],
      ];
      expect(revealTile(board, { x: 0, y: 1 })).toEqual(expectedBoard);
    });

    describe("when the tile is not a mine", () => {
      test("when the tile is adjacent to a mine it counts how many mines are nearby", () => {
        const expectedBoard = [
          [
            { x: 0, y: 0, status: TILE_STATUSES.NUMBER, mine: false, adjacentMinesCount: 1 },
            { x: 0, y: 1, status: TILE_STATUSES.HIDDEN, mine: true },
          ],
          [
            { x: 1, y: 0, status: TILE_STATUSES.HIDDEN, mine: false },
            { x: 1, y: 1, status: TILE_STATUSES.HIDDEN, mine: false },
          ],
        ];
        expect(revealTile(board, { x: 0, y: 0 })).toEqual(expectedBoard);
      });

      test("when the tile is not adjacent to a mine reveal nearby tiles ", () => {
        const board = [
          [
            { x: 0, y: 0, status: TILE_STATUSES.HIDDEN, mine: true },
            { x: 0, y: 1, status: TILE_STATUSES.HIDDEN, mine: false },
            { x: 0, y: 2, status: TILE_STATUSES.HIDDEN, mine: false },
          ],
          [
            { x: 1, y: 0, status: TILE_STATUSES.HIDDEN, mine: false },
            { x: 1, y: 1, status: TILE_STATUSES.HIDDEN, mine: false },
            { x: 1, y: 2, status: TILE_STATUSES.HIDDEN, mine: false },
          ],
          [
            { x: 2, y: 0, status: TILE_STATUSES.HIDDEN, mine: false },
            { x: 2, y: 1, status: TILE_STATUSES.HIDDEN, mine: false },
            { x: 2, y: 2, status: TILE_STATUSES.HIDDEN, mine: false },
          ],
        ];

        const expectedBoard = [
          [
            { x: 0, y: 0, status: TILE_STATUSES.HIDDEN, mine: true },
            { x: 0, y: 1, status: TILE_STATUSES.NUMBER, mine: false, adjacentMinesCount: 1 },
            { x: 0, y: 2, status: TILE_STATUSES.NUMBER, mine: false, adjacentMinesCount: 0 },
          ],
          [
            { x: 1, y: 0, status: TILE_STATUSES.NUMBER, mine: false, adjacentMinesCount: 1 },
            { x: 1, y: 1, status: TILE_STATUSES.NUMBER, mine: false, adjacentMinesCount: 1 },
            { x: 1, y: 2, status: TILE_STATUSES.NUMBER, mine: false, adjacentMinesCount: 0 },
          ],
          [
            { x: 2, y: 0, status: TILE_STATUSES.NUMBER, mine: false, adjacentMinesCount: 0 },
            { x: 2, y: 1, status: TILE_STATUSES.NUMBER, mine: false, adjacentMinesCount: 0 },
            { x: 2, y: 2, status: TILE_STATUSES.NUMBER, mine: false, adjacentMinesCount: 0 },
          ],
        ];

        expect(revealTile(board, { x: 2, y: 2 })).toEqual(expectedBoard);
      });
    });
  });

  test("with a marked tile it does nothing", () => {
    const board = [
      [
        { x: 0, y: 0, status: TILE_STATUSES.MARKED, mine: false },
        { x: 0, y: 1, status: TILE_STATUSES.HIDDEN, mine: true },
      ],
      [
        { x: 1, y: 0, status: TILE_STATUSES.HIDDEN, mine: false },
        { x: 1, y: 1, status: TILE_STATUSES.HIDDEN, mine: false },
      ],
    ];

    expect(revealTile(board, { x: 0, y: 0 })).toEqual(board);
  });

  test("mine tile gets nothing", () => {
    const board = [
      [
        { x: 0, y: 0, status: TILE_STATUSES.MINE, mine: false },
        { x: 0, y: 1, status: TILE_STATUSES.HIDDEN, mine: true },
      ],
      [
        { x: 1, y: 0, status: TILE_STATUSES.HIDDEN, mine: false },
        { x: 1, y: 1, status: TILE_STATUSES.HIDDEN, mine: false },
      ],
    ];

    expect(revealTile(board, { x: 0, y: 0 })).toEqual(board);
  });

  test("number tile gets nothing", () => {
    const board = [
      [
        { x: 0, y: 0, status: TILE_STATUSES.NUMBER, mine: false },
        { x: 0, y: 1, status: TILE_STATUSES.HIDDEN, mine: true },
      ],
      [
        { x: 1, y: 0, status: TILE_STATUSES.HIDDEN, mine: false },
        { x: 1, y: 1, status: TILE_STATUSES.HIDDEN, mine: false },
      ],
    ];

    expect(revealTile(board, { x: 0, y: 0 })).toEqual(board);
  });
});

describe("#checkWin", () => {
  test("with only hidden and marked mine tiles it returns true", () => {
    const board = [
      [
        { x: 0, y: 0, status: TILE_STATUSES.MARKED, mine: true },
        { x: 0, y: 1, status: TILE_STATUSES.HIDDEN, mine: true },
      ],
      [
        { x: 1, y: 0, status: TILE_STATUSES.NUMBER, mine: false },
        { x: 1, y: 1, status: TILE_STATUSES.NUMBER, mine: false },
      ],
    ];

    expect(checkWin(board)).toBe(true);
  });
  test("with some hidden non-mine tiles it returns false", () => {
    const board = [
      [
        { x: 0, y: 0, status: TILE_STATUSES.MARKED, mine: true },
        { x: 0, y: 1, status: TILE_STATUSES.HIDDEN, mine: true },
      ],
      [
        { x: 1, y: 0, status: TILE_STATUSES.HIDDEN, mine: false },
        { x: 1, y: 1, status: TILE_STATUSES.NUMBER, mine: false },
      ],
    ];

    expect(checkWin(board)).toBe(false);
  });
});

describe("#checkLose", () => {
  test("with no mines revealed it returns false", () => {
    const board = [
      [
        { x: 0, y: 0, status: TILE_STATUSES.MARKED, mine: true },
        { x: 0, y: 1, status: TILE_STATUSES.HIDDEN, mine: true },
      ],
      [
        { x: 1, y: 0, status: TILE_STATUSES.HIDDEN, mine: false },
        { x: 1, y: 1, status: TILE_STATUSES.HIDDEN, mine: false },
      ],
    ];

    expect(checkLose(board)).toBe(false);
  });
  test("with a mine revealead it returns true", () => {
    const board = [
      [
        { x: 0, y: 0, status: TILE_STATUSES.MINE, mine: true },
        { x: 0, y: 1, status: TILE_STATUSES.HIDDEN, mine: true },
      ],
      [
        { x: 1, y: 0, status: TILE_STATUSES.HIDDEN, mine: false },
        { x: 1, y: 1, status: TILE_STATUSES.NUMBER, mine: false },
      ],
    ];

    expect(checkLose(board)).toBe(true);
  });
});

describe("#positionMatch", () => {
  test("it returns true when the x and y properties are the same", () => {
    const posA = { x: 1, y: 2 };
    const posB = { x: 1, y: 2 };
    expect(positionMatch(posA, posB)).toBeTruthy();
  });

  test("it returns false when the x or y properties are not the same", () => {
    const posA = { x: 1, y: 2 };
    const posB = { x: 1, y: 1 };
    expect(positionMatch(posA, posB)).toBeFalsy();
  });
});
