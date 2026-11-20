'use client';

import { useCallback, useRef, useState } from 'react';
import type { StructuredExam } from '@/lib/structured-exam';

export type HistorySnapshot = {
  html: string;
  structure?: StructuredExam;
};

export const MAX_HISTORY = 100;

export class EditorHistoryStack {
  private entries: HistorySnapshot[] = [];
  private cursor = -1;
  private readonly limit: number;

  constructor(initial?: HistorySnapshot, limit = MAX_HISTORY) {
    this.limit = limit;
    if (initial) {
      this.entries = [cloneSnapshot(initial)];
      this.cursor = 0;
    }
  }

  get canUndo(): boolean {
    return this.cursor > 0;
  }

  get canRedo(): boolean {
    return this.cursor >= 0 && this.cursor < this.entries.length - 1;
  }

  get current(): HistorySnapshot | null {
    return this.cursor >= 0 ? this.entries[this.cursor] : null;
  }

  reset(initial: HistorySnapshot): void {
    this.entries = [cloneSnapshot(initial)];
    this.cursor = 0;
  }

  push(snapshot: HistorySnapshot): boolean {
    const current = this.current;
    if (
      current &&
      current.html === snapshot.html &&
      JSON.stringify(current.structure ?? null) === JSON.stringify(snapshot.structure ?? null)
    ) {
      return false;
    }
    const truncated = this.entries.slice(0, this.cursor + 1);
    truncated.push(cloneSnapshot(snapshot));
    if (truncated.length > this.limit) {
      truncated.splice(0, truncated.length - this.limit);
    }
    this.entries = truncated;
    this.cursor = this.entries.length - 1;
    return true;
  }

  undo(): HistorySnapshot | null {
    if (!this.canUndo) return null;
    this.cursor -= 1;
    return cloneSnapshot(this.entries[this.cursor]);
  }

  redo(): HistorySnapshot | null {
    if (!this.canRedo) return null;
    this.cursor += 1;
    return cloneSnapshot(this.entries[this.cursor]);
  }
}

function cloneSnapshot(s: HistorySnapshot): HistorySnapshot {
  return {
    html: s.html,
    structure: s.structure ? structuredClone(s.structure) : undefined,
  };
}

export function useEditorHistory(debounceMs = 600) {
  const stackRef = useRef<EditorHistoryStack>(new EditorHistoryStack());
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [availability, setAvailability] = useState({ canUndo: false, canRedo: false });

  const sync = useCallback(() => {
    const stack = stackRef.current;
    setAvailability({ canUndo: stack.canUndo, canRedo: stack.canRedo });
  }, []);

  const reset = useCallback(
    (snapshot: HistorySnapshot) => {
      if (typingTimer.current) {
        clearTimeout(typingTimer.current);
        typingTimer.current = null;
      }
      stackRef.current.reset(snapshot);
      sync();
    },
    [sync],
  );

  const pushSnapshot = useCallback(
    (snapshot: HistorySnapshot) => {
      if (typingTimer.current) {
        clearTimeout(typingTimer.current);
        typingTimer.current = null;
      }
      stackRef.current.push(snapshot);
      sync();
    },
    [sync],
  );

  const recordTyping = useCallback(
    (getSnapshot: () => HistorySnapshot) => {
      if (typingTimer.current) clearTimeout(typingTimer.current);
      typingTimer.current = setTimeout(() => {
        typingTimer.current = null;
        stackRef.current.push(getSnapshot());
        sync();
      }, debounceMs);
    },
    [debounceMs, sync],
  );

  const undo = useCallback((): HistorySnapshot | null => {
    if (typingTimer.current) {
      clearTimeout(typingTimer.current);
      typingTimer.current = null;
    }
    const snap = stackRef.current.undo();
    sync();
    return snap;
  }, [sync]);

  const redo = useCallback((): HistorySnapshot | null => {
    if (typingTimer.current) {
      clearTimeout(typingTimer.current);
      typingTimer.current = null;
    }
    const snap = stackRef.current.redo();
    sync();
    return snap;
  }, [sync]);

  return {
    canUndo: availability.canUndo,
    canRedo: availability.canRedo,
    reset,
    pushSnapshot,
    recordTyping,
    undo,
    redo,
  };
}
