"use client";

import styled from "styled-components";
import { Media } from "@/data-models/media.interface";
import { ServiceProvider } from "@/data-models/service-provider.interface";
import { COLORS } from "@/lib/theme-constants";
import Image from "next/image";
import { getProxyImageUrlForPath } from "@/lib/imageUrl";

interface Props {
  item: Media;
  providers: ServiceProvider[];
  onClose: () => void;
  onSave: (item: Media, providerId: string) => void;
}

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.62);
  z-index: 200;
  display: flex;
  align-items: flex-end;
`;

const Sheet = styled.div`
  width: 100%;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
  padding: 1rem;
  background: ${COLORS.gray[900]};
  border-top: 1px solid rgba(192, 132, 252, 0.35);
  box-shadow: 0 -12px 36px rgba(0, 0, 0, 0.5);
`;

const Heading = styled.h3`
  margin: 0 0 0.35rem 0;
  color: ${COLORS.gray[100]};
  font-size: 1rem;
`;

const Sub = styled.p`
  margin: 0 0 0.75rem 0;
  color: ${COLORS.gray[400]};
  font-size: 0.86rem;
`;

const Options = styled.div`
  display: grid;
  gap: 0.45rem;
  max-height: 50vh;
  overflow-y: auto;
`;

const Option = styled.button<{ $active?: boolean }>`
  height: 2.65rem;
  border-radius: 0.65rem;
  border: 1px solid ${({ $active }) => ($active ? COLORS.purple.solid : "rgba(156,163,175,.25)")};
  background: ${({ $active }) => ($active ? "rgba(168,85,247,.26)" : "rgba(31,41,55,.95)")};
  color: ${COLORS.gray[100]};
  font-weight: 600;
  cursor: pointer;
  text-align: left;
  padding: 0 0.75rem;
`;

const Close = styled.button`
  margin-top: 0.75rem;
  width: 100%;
  height: 2.6rem;
  border-radius: 0.65rem;
  border: 1px solid rgba(156, 163, 175, 0.3);
  background: transparent;
  color: ${COLORS.gray[300]};
  font-weight: 700;
  cursor: pointer;
`;

export function ProviderOverrideSheet({ item, providers, onClose, onSave }: Props) {
  const currentProvider = String(item.provider || item.selectedStreamer || "");

  return (
    <Backdrop onClick={onClose}>
      <Sheet onClick={(e) => e.stopPropagation()}>
        <Heading>Choose Streaming Provider</Heading>
        <Sub>{item.title || item.name}</Sub>

        <Options>
          {providers.map((p) => {
            const id = String(p.provider_id);
            return (
              <Option key={p.provider_id} $active={id === currentProvider} onClick={() => onSave(item, id)}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  {p.logo_path ? <Image src={getProxyImageUrlForPath(p.logo_path, "w45") || ""} alt={p.provider_name} width={18} height={18} style={{ borderRadius: 4, background: "#fff", padding: 1 }} /> : null}
                  {p.provider_name}
                </span>
              </Option>
            );
          })}
        </Options>

        <Close onClick={onClose}>Cancel</Close>
      </Sheet>
    </Backdrop>
  );
}
