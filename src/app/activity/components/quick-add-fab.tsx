"use client";

import { useState } from "react";
import styled from "styled-components";
import { Plus, Sparkles, ListPlus } from "lucide-react";
import { COLORS, GRADIENTS, SHADOWS } from "@/lib/theme-constants";

interface Props {
  onAddWatching: () => void;
  onAddWatchlist: () => void;
}

const Wrap = styled.div`
  position: fixed;
  right: 1rem;
  bottom: 1.2rem;
  z-index: 120;
`;

const Menu = styled.div`
  margin-bottom: 0.55rem;
  display: grid;
  gap: 0.45rem;
`;

const MiniButton = styled.button`
  min-width: 10.5rem;
  height: 2.45rem;
  border-radius: 999px;
  border: 1px solid rgba(192, 132, 252, 0.4);
  background: rgba(17, 24, 39, 0.95);
  color: ${COLORS.gray[100]};
  font-size: 0.84rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
`;

const Fab = styled.button`
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 999px;
  border: 0;
  background: ${GRADIENTS.purplePink};
  color: #fff;
  display: grid;
  place-items: center;
  cursor: pointer;
  box-shadow: ${SHADOWS.buttonHover};
`;

export function QuickAddFab({ onAddWatching, onAddWatchlist }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Wrap>
      {open && (
        <Menu>
          <MiniButton
            onClick={() => {
              setOpen(false);
              onAddWatching();
            }}
          >
            <Sparkles size={16} />
            Add To Watching
          </MiniButton>
          <MiniButton
            onClick={() => {
              setOpen(false);
              onAddWatchlist();
            }}
          >
            <ListPlus size={16} />
            Add To Watchlist
          </MiniButton>
        </Menu>
      )}

      <Fab onClick={() => setOpen((v) => !v)} aria-label="Add title">
        <Plus size={22} />
      </Fab>
    </Wrap>
  );
}