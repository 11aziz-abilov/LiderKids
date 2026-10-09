import { ShashkaPiece, PieceColor, CheckersMove, BoardPosition } from '@/types/tournament';

export const BOARD_SIZE = 8;

export function isDarkSquare(row: number, col: number): boolean {
  return (row + col) % 2 === 1;
}

export function createInitialBoard(): ShashkaPiece[] {
  const pieces: ShashkaPiece[] = [];
  let idCounter = 1;

  // Qora toshlar (0, 1, 2-qatorlar)
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (isDarkSquare(row, col)) {
        pieces.push({
          id: `b_${idCounter++}`,
          color: 'black',
          isKing: false,
          row,
          col,
        });
      }
    }
  }

  // Oq toshlar (5, 6, 7-qatorlar)
  for (let row = 5; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (isDarkSquare(row, col)) {
        pieces.push({
          id: `w_${idCounter++}`,
          color: 'white',
          isKing: false,
          row,
          col,
        });
      }
    }
  }

  return pieces;
}

export function getPieceAt(pieces: ShashkaPiece[], row: number, col: number): ShashkaPiece | undefined {
  return pieces.find((p) => p.row === row && p.col === col);
}

export function isInsideBoard(row: number, col: number): boolean {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
}

/**
 * Bitta tosh uchun barcha mumkin bo'lgan urish (capture) yurishlarini topish
 */
export function getCaptureMovesForPiece(
  piece: ShashkaPiece,
  board: ShashkaPiece[]
): CheckersMove[] {
  const moves: CheckersMove[] = [];
  const directions = [
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
  ];

  if (!piece.isKing) {
    // Oddiy toshlar (har 4 diagonal yo'nalishda sakrab urishi mumkin)
    for (const [dr, dc] of directions) {
      const enemyRow = piece.row + dr;
      const enemyCol = piece.col + dc;
      const landRow = piece.row + dr * 2;
      const landCol = piece.col + dc * 2;

      if (isInsideBoard(landRow, landCol)) {
        const enemy = getPieceAt(board, enemyRow, enemyCol);
        const landSquare = getPieceAt(board, landRow, landCol);

        if (enemy && enemy.color !== piece.color && !landSquare) {
          moves.push({
            from: { row: piece.row, col: piece.col },
            to: { row: landRow, col: landCol },
            captured: { row: enemyRow, col: enemyCol },
            isKingPromotion:
              (piece.color === 'white' && landRow === 0) ||
              (piece.color === 'black' && landRow === BOARD_SIZE - 1),
          });
        }
      }
    }
  } else {
    // Damka (Shoh) uchun urish
    for (const [dr, dc] of directions) {
      let r = piece.row + dr;
      let c = piece.col + dc;
      let enemyFound: ShashkaPiece | null = null;

      while (isInsideBoard(r, c)) {
        const currentPiece = getPieceAt(board, r, c);
        if (!enemyFound) {
          if (currentPiece) {
            if (currentPiece.color === piece.color) {
              break; // o'zining toshi to'sib turibdi
            } else {
              enemyFound = currentPiece;
            }
          }
        } else {
          // Raqib toshi topilgan, undan keyingi bo'sh kataklarga qo'na oladi
          if (currentPiece) {
            break; // boshqa tosh to'sib turibdi
          } else {
            moves.push({
              from: { row: piece.row, col: piece.col },
              to: { row: r, col: c },
              captured: { row: enemyFound.row, col: enemyFound.col },
              isKingPromotion: false,
            });
          }
        }
        r += dr;
        c += dc;
      }
    }
  }

  return moves;
}

/**
 * Bitta tosh uchun oddiy (urishsiz) yurishlarni topish
 */
export function getSimpleMovesForPiece(
  piece: ShashkaPiece,
  board: ShashkaPiece[]
): CheckersMove[] {
  const moves: CheckersMove[] = [];

  if (!piece.isKing) {
    // Oddiy tosh faqat oldinga diagonal yuradi
    const forwardDirs =
      piece.color === 'white'
        ? [
            [-1, -1],
            [-1, 1],
          ]
        : [
            [1, -1],
            [1, 1],
          ];

    for (const [dr, dc] of forwardDirs) {
      const nextRow = piece.row + dr;
      const nextCol = piece.col + dc;

      if (isInsideBoard(nextRow, nextCol)) {
        if (!getPieceAt(board, nextRow, nextCol)) {
          moves.push({
            from: { row: piece.row, col: piece.col },
            to: { row: nextRow, col: nextCol },
            isKingPromotion:
              (piece.color === 'white' && nextRow === 0) ||
              (piece.color === 'black' && nextRow === BOARD_SIZE - 1),
          });
        }
      }
    }
  } else {
    // Damka barcha diagonallar bo'ylab uzoqqa yura oladi
    const allDirs = [
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1],
    ];

    for (const [dr, dc] of allDirs) {
      let r = piece.row + dr;
      let c = piece.col + dc;

      while (isInsideBoard(r, c)) {
        if (getPieceAt(board, r, c)) {
          break; // yo'l to'silgan
        }
        moves.push({
          from: { row: piece.row, col: piece.col },
          to: { row: r, col: c },
          isKingPromotion: false,
        });
        r += dr;
        c += dc;
      }
    }
  }

  return moves;
}

/**
 * Rang bo'yicha barcha mumkin bo'lgan qoidaga mos yurishlarni olish.
 * Agar urish (capture) bo'lsa, majburiy qoida bo'yicha faqat urishlar qaytadi!
 */
export function getAllLegalMoves(
  color: PieceColor,
  board: ShashkaPiece[],
  mustContinueFromPieceId?: string | null
): CheckersMove[] {
  let activePieces = board.filter((p) => p.color === color);

  if (mustContinueFromPieceId) {
    activePieces = activePieces.filter((p) => p.id === mustContinueFromPieceId);
  }

  // 1. Avval barcha urish yurishlarini to'playmiz
  const allCaptures: CheckersMove[] = [];
  for (const piece of activePieces) {
    const caps = getCaptureMovesForPiece(piece, board);
    allCaptures.push(...caps);
  }

  // Agar urish imkoniyati bo'lsa, FAQAT urish mumkin (shashka qoidasi)
  if (allCaptures.length > 0) {
    return allCaptures;
  }

  // Agar zanjirli urish davom etayotgan bo'lsa va boshqa urish qolmagan bo'lsa, yurish tugaydi
  if (mustContinueFromPieceId) {
    return [];
  }

  // 2. Oddiy yurishlarni to'playmiz
  const allSimple: CheckersMove[] = [];
  for (const piece of activePieces) {
    const simples = getSimpleMovesForPiece(piece, board);
    allSimple.push(...simples);
  }

  return allSimple;
}

/**
 * Tanlangan tosh uchun ruxsat etilgan yurishlar
 */
export function getLegalMovesForSpecificPiece(
  piece: ShashkaPiece,
  board: ShashkaPiece[],
  mustContinueFromPieceId?: string | null
): CheckersMove[] {
  const allMoves = getAllLegalMoves(piece.color, board, mustContinueFromPieceId);
  return allMoves.filter(
    (m) => m.from.row === piece.row && m.from.col === piece.col
  );
}

/**
 * Yurishni taxtaga qo'llash
 */
export function executeMove(
  board: ShashkaPiece[],
  move: CheckersMove
): {
  newBoard: ShashkaPiece[];
  movedPiece: ShashkaPiece;
  hasFurtherCaptures: boolean;
} {
  let newBoard = [...board];
  const movingPiece = getPieceAt(newBoard, move.from.row, move.from.col);

  if (!movingPiece) {
    throw new Error('Tosh topilmadi');
  }

  // Agar raqib toshi urilgan bo'lsa, uni taxtadan o'chiramiz
  if (move.captured) {
    newBoard = newBoard.filter(
      (p) => !(p.row === move.captured!.row && p.col === move.captured!.col)
    );
  }

  // Toshni yangi o'ringa ko'chiramiz
  const isNowKing =
    movingPiece.isKing ||
    Boolean(move.isKingPromotion) ||
    (movingPiece.color === 'white' && move.to.row === 0) ||
    (movingPiece.color === 'black' && move.to.row === BOARD_SIZE - 1);

  const updatedPiece: ShashkaPiece = {
    ...movingPiece,
    row: move.to.row,
    col: move.to.col,
    isKing: isNowKing,
  };

  newBoard = newBoard.map((p) => (p.id === movingPiece.id ? updatedPiece : p));

  // Agar urish qilingan bo'lsa, shu tosh yana ketma-ket boshqa toshni ura oladimi tekshiramiz
  let hasFurtherCaptures = false;
  if (move.captured) {
    const furtherCaps = getCaptureMovesForPiece(updatedPiece, newBoard);
    if (furtherCaps.length > 0) {
      hasFurtherCaptures = true;
    }
  }

  return {
    newBoard,
    movedPiece: updatedPiece,
    hasFurtherCaptures,
  };
}

/**
 * AI (Robot / Boshqa o'quvchi simulyatsiyasi) yurishini hisoblash
 */
export function computeAIMove(
  board: ShashkaPiece[],
  color: PieceColor = 'black'
): CheckersMove | null {
  const legalMoves = getAllLegalMoves(color, board);
  if (legalMoves.length === 0) return null;

  // 1. Agar urish yurishlari bo'lsa, urishni ustun qo'yadi
  const captureMoves = legalMoves.filter((m) => Boolean(m.captured));
  if (captureMoves.length > 0) {
    // Damkaga aylantiradigan yoki damka bilan uradigan yurishga ustunlik
    const kingCaps = captureMoves.filter((m) => m.isKingPromotion);
    if (kingCaps.length > 0) {
      return kingCaps[Math.floor(Math.random() * kingCaps.length)];
    }
    return captureMoves[Math.floor(Math.random() * captureMoves.length)];
  }

  // 2. Oddiy yurishlar orasidan yaxshirog'ini tanlash
  // Damkaga aylanish imkoniyati bor yurishlar
  const promoMoves = legalMoves.filter((m) => m.isKingPromotion);
  if (promoMoves.length > 0) {
    return promoMoves[0];
  }

  // Markazga yoki oldinga intilishni afzal ko'rish
  const sorted = [...legalMoves].sort((a, b) => {
    // Markaziy ustunlar (col 2,3,4,5) ustunroq
    const aDistCenter = Math.abs(a.to.col - 3.5);
    const bDistCenter = Math.abs(b.to.col - 3.5);
    return aDistCenter - bDistCenter;
  });

  // Eng yaxshi 3 ta yurishdan birini tasodifiy tanlash (tabiiy o'yin uchun)
  const topCount = Math.min(3, sorted.length);
  return sorted[Math.floor(Math.random() * topCount)];
}
