import { AddButton } from "../styles";
import { ChevronDown, Edit2, Plus } from "lucide-react";
import { COLORS } from "@/lib/theme-constants";
import type { CSSProperties } from "react";

interface AddTitleMenuProps {
  show: boolean;
  onToggle: () => void;
  onQuickAdd: () => void;
  onAddWithDetails: () => void;
}

export function AddTitleMenu({ show, onToggle, onQuickAdd, onAddWithDetails }: AddTitleMenuProps) {
  return (
    <div style={{ position: "relative" }}>
      <AddButton onClick={onToggle}>
        <Plus size={20} />
        Add Title
        <ChevronDown size={16} style={{ marginLeft: "0.25rem" }} />
      </AddButton>
      {show && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            marginTop: "0.5rem",
            background: "rgba(17, 24, 39, 0.95)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(168, 85, 247, 0.3)",
            borderRadius: "0.75rem",
            overflow: "hidden",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
            minWidth: "200px",
            zIndex: 50,
          }}
        >
          <button
            onClick={onQuickAdd}
            style={menuButtonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(168, 85, 247, 0.2)";
              e.currentTarget.style.color = COLORS.purple.solid;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#e5e7eb";
            }}
          >
            <Plus size={16} />
            Quick Add
          </button>
          <button
            onClick={onAddWithDetails}
            style={menuButtonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(168, 85, 247, 0.2)";
              e.currentTarget.style.color = COLORS.purple.solid;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#e5e7eb";
            }}
          >
            <Edit2 size={16} />
            Add with Details
          </button>
        </div>
      )}
    </div>
  );
}

const menuButtonStyle: CSSProperties = {
  width: "100%",
  padding: "0.75rem 1rem",
  textAlign: "left",
  background: "transparent",
  border: "none",
  color: "#e5e7eb",
  cursor: "pointer",
  fontSize: "0.875rem",
  fontWeight: 500,
  transition: "all 0.2s",
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
};
