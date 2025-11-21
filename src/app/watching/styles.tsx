
import styled, { css } from "styled-components";
// import { Plus, Film, Tv, Edit2, X, Check, Trash2 } from "lucide-react";

export interface ButtonProps {
  variant?: "primary" | "secondary";
  active?: string;
}

export interface DivProps {
  status?: "watching" | "completed" | "watchlist" | undefined;
  width?: number;
  color?: string;
}

export interface SvgProps {
  filled?: boolean;
}


export const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom right, #111827, #1f2937, #111827);
  color: white;
  padding: 1.5rem;
`;

export const Header = styled.div`
  max-width: 80rem;
  margin: 0 auto 2rem;
`;

export const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

export const Title = styled.h1`
  font-size: 2.25rem;
  font-weight: bold;
  background: linear-gradient(to right, #c084fc, #f472b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
`;

export const Subtitle = styled.p`
  color: #9ca3af;
  margin-top: 0.5rem;
`;

export const AddButton = styled.button<ButtonProps>`
  background: linear-gradient(to right, #a855f7, #ec4899);
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
  color: white;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: linear-gradient(to right, #9333ea, #db2777);
    transform: translateY(-1px);
  }
`;

export const Modal = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

export const ModalContent = styled.div`
  background: #1f2937;
  border-radius: 1rem;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  border: 1px solid rgba(75, 85, 99, 0.5);
`;

export const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 0 1.5rem 0;
`;

export const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

export const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #d1d5db;
`;

export const Input = styled.input`
  width: 100%;
  background: rgba(31, 41, 55, 0.8);
  border: 1px solid rgba(75, 85, 99, 0.5);
  border-radius: 0.5rem;
  padding: 0.75rem;
  color: white;
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: #a855f7;
  }
`;

export const Select = styled.select`
  width: 100%;
  background: rgba(31, 41, 55, 0.8);
  border: 1px solid rgba(75, 85, 99, 0.5);
  border-radius: 0.5rem;
  padding: 0.75rem;
  color: white;
  font-size: 0.875rem;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #a855f7;
  }
`;

export const ProgressInputs = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1.5rem;
`;

export const Button = styled.button<ButtonProps>`
  flex: 1;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  ${({ variant }) =>
    variant === "primary"
      ? css`
          background: linear-gradient(to right, #a855f7, #ec4899);
          color: white;
          &:hover {
            background: linear-gradient(to right, #9333ea, #db2777);
          }
        `
      : css`
          background: rgba(31, 41, 55, 0.8);
          color: white;
          border: 1px solid rgba(75, 85, 99, 0.5);

          &:hover {
            background: rgba(55, 65, 81, 0.8);
          }
        `}
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

export const StatCard = styled.div`
  background: rgba(31, 41, 55, 0.5);
  backdrop-filter: blur(12px);
  border-radius: 0.75rem;
  padding: 1rem;
  border: 1px solid rgba(75, 85, 99, 0.5);
`;

export const StatNumber = styled.div<DivProps>`
  font-size: 1.875rem;
  font-weight: bold;
  color: ${(props) => props.color || "#60a5fa"};
`;

export const StatLabel = styled.div`
  color: #9ca3af;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

export const FilterContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

export const FilterButton = styled.button<ButtonProps>`
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  background: ${(props) => (props.active ? "#a855f7" : "rgba(31, 41, 55, 0.5)")};
  color: ${(props) => (props.active ? "white" : "#d1d5db")};

  &:hover {
    background: ${(props) => (props.active ? "#a855f7" : "rgba(55, 65, 81, 0.5)")};
  }
`;

export const GridContainer = styled.div`
  max-width: 80rem;
  margin: 0 auto;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

export const Card = styled.div`
  background: rgba(31, 41, 55, 0.3);
  backdrop-filter: blur(12px);
  border-radius: 0.75rem;
  overflow: hidden;
  border: 1px solid rgba(75, 85, 99, 0.5);
  transition: all 0.3s;

  &:hover {
    border-color: rgba(168, 85, 247, 0.5);
    transform: scale(1.05);
  }
`;

export const ImageContainer = styled.div`
  position: relative;
  height: 20rem;
`;

export const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const ImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, #111827, rgba(17, 24, 39, 0.4), transparent);
`;

export const CardActions = styled.div`
  position: absolute;
  top: 0.75rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.2s;

  ${Card}:hover & {
    opacity: 1;
  }
`;

export const IconButton = styled.button<ButtonProps>`
  background: rgba(17, 24, 39, 0.9);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(75, 85, 99, 0.5);
  border-radius: 0.5rem;
  padding: 0.5rem;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: rgba(31, 41, 55, 0.9);
    border-color: #a855f7;
  }
`;

export const ProviderBadgesContainer = styled.div`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-end;
`;
// Helper to choose accessible text color based on background luminance
const getAccessibleTextColor = (hex?: string) => {
  if (!hex) return '#fff';
  const clean = hex.replace('#', '');
  const full = clean.length === 3
    ? clean.split('').map(c => c + c).join('')
    : clean.padEnd(6, '0');
  const r = parseInt(full.substring(0,2),16);
  const g = parseInt(full.substring(2,4),16);
  const b = parseInt(full.substring(4,6),16);
  const luminance = (0.299*r + 0.587*g + 0.114*b)/255;
  return luminance > 0.6 ? '#111827' : '#F9FAFB';
};

export const ProviderBadge = styled.div<DivProps>`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.25px;
  background: ${(props) => props.color};
  color: ${(props) => getAccessibleTextColor(props.color)};
  box-shadow: 0 2px 4px rgba(0,0,0,0.35);
  border: 1px solid rgba(255,255,255,0.15);
  backdrop-filter: blur(4px);
  text-shadow: ${(props) => getAccessibleTextColor(props.color) === '#F9FAFB' ? '0 1px 2px rgba(0,0,0,0.4)' : 'none'};
`;

export const TypeBadge = styled.div`
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  background: rgba(17, 24, 39, 0.8);
  backdrop-filter: blur(12px);
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

export const CardInfo = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
`;

export const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: bold;
  margin: 0 0 0.5rem 0;
`;

export const ProgressContainer = styled.div`
  margin-bottom: 0.5rem;
`;

export const ProgressText = styled.div`
  font-size: 0.75rem;
  color: #d1d5db;
  margin-bottom: 0.25rem;
`;

export const ProgressBar = styled.div`
  width: 100%;
  background: #374151;
  border-radius: 9999px;
  height: 0.375rem;
  overflow: hidden;
`;

export const ProgressFill = styled.div<DivProps>`
  background: linear-gradient(to right, #a855f7, #ec4899);
  height: 100%;
  width: ${(props) => props.width}%;
  border-radius: 9999px;
`;

export const CardBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Stars = styled.div`
  display: flex;
  gap: 0.25rem;
`;

export const Star = styled.svg<SvgProps>`
  width: 1rem;
  height: 1rem;
  fill: ${(props) => (props.filled ? "#fbbf24" : "#4b5563")};
  cursor: pointer;
  transition: fill 0.2s;

  &:hover {
    fill: #fbbf24;
  }
`;

export const StatusBadge = styled.div<DivProps>`
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${(props) => (props.status === "watching" ? "rgba(59, 130, 246, 0.2)" : props.status === "completed" ? "rgba(34, 197, 94, 0.2)" : "rgba(168, 85, 247, 0.2)")};
  color: ${(props) => (props.status === "watching" ? "#93c5fd" : props.status === "completed" ? "#86efac" : "#d8b4fe")};
`;

export const Legend = styled.div`
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  background: rgba(31, 41, 55, 0.9);
  backdrop-filter: blur(12px);
  border-radius: 0.75rem;
  padding: 1rem;
  border: 1px solid rgba(75, 85, 99, 0.5);
`;

export const LegendTitle = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: #9ca3af;
  margin-bottom: 0.5rem;
`;

export const LegendItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const LegendDot = styled.div`
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 9999px;
  background: ${(props) => props.color};
`;

export const LegendLabel = styled.span`
  font-size: 0.875rem;
`;
