"use client";

import React, { ChangeEvent, useRef, useState } from "react";
import { X, Search as SearchIcon } from "lucide-react";
import { Media } from "@/data-models/media.interface";
import { getProxyImageUrlForPath } from "@/lib/imageUrl";
import { debounce } from "@mui/material/utils";
import {
  Modal,
  ModalContent,
  ModalTitle,
  Button,
  ButtonGroup,
} from "./styles";

interface SearchModalProps {
  show: boolean;
  onClose: () => void;
  onSelectTitle: (title: Media) => void;
}

const SearchModal = ({ show, onClose, onSelectTitle }: SearchModalProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [dropdownOptions, setDropdownOptions] = useState<Media[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Debounced search handler
  const debouncedSearch = useRef(
    debounce(async (value: string) => {
      if (!value) {
        setDropdownOptions([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);

      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(value)}`);
        if (!res.ok) {
          console.error("Search failed");
          setIsSearching(false);
          return;
        }
        const json = await res.json();
        type RawItem = { id?: number; movieId?: number; title?: string; popularity?: number } & Record<string, unknown>;
        const items = (json.all as RawItem[]) || [...((json.movies || []) as RawItem[]), ...((json.tv || []) as RawItem[])];
        const normalized = (items as RawItem[])
          .map((item) => ({
            ...item,
            type: item.title ? "movie" : "tv",
            movieId: item.movieId ?? item.id,
            popularity: typeof item.popularity === "number" ? item.popularity : 0,
          }))
          .sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

        setDropdownOptions(normalized as unknown as Media[]);
        setIsSearching(false);
      } catch (err) {
        console.error("Search error:", err);
        setIsSearching(false);
      }

    }, 300)
  ).current;

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
    debouncedSearch(value);
  };

  const handleClear = () => {
    setSearchValue("");
    setDropdownOptions([]);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleSelectTitle = (title: Media) => {
    onSelectTitle(title);
    handleClear();
    onClose();
  };

  if (!show) return null;

  return (
    <Modal onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
        <ModalTitle>Search for a Title</ModalTitle>

        {/* Search Input */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ position: 'relative' }}>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search for movies or TV shows..."
              value={searchValue}
              onChange={handleInputChange}
              autoFocus
              style={{
                width: '100%',
                padding: '0.875rem 3rem 0.875rem 1rem',
                background: '#1f2937',
                border: '2px solid #374151',
                borderRadius: '12px',
                color: '#f3f4f6',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = '#a855f7'}
              onBlur={(e) => e.target.style.borderColor = '#374151'}
            />
            <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              {searchValue && (
                <button
                  onClick={handleClear}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#9ca3af',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <X size={18} />
                </button>
              )}
              <SearchIcon size={18} color="#9ca3af" />
            </div>
          </div>
        </div>

        {/* Search Results */}
        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1.5rem', minHeight: '200px' }}>
          {isSearching && (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
              Searching...
            </div>
          )}

          {!isSearching && searchValue && dropdownOptions.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
              No results found for &ldquo;{searchValue}&rdquo;
            </div>
          )}

          {!searchValue && (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
              Start typing to search for titles
            </div>
          )}

          {!isSearching && dropdownOptions.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {dropdownOptions.map((option: Media) => (
                <div
                  key={option.id}
                  onClick={() => handleSelectTitle(option)}
                  style={{
                    display: 'flex',
                    padding: '0.75rem',
                    background: '#1f2937',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    border: '1px solid transparent',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#374151';
                    e.currentTarget.style.borderColor = '#a855f7';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#1f2937';
                    e.currentTarget.style.borderColor = 'transparent';
                  }}
                >
                  <div style={{ marginRight: '1rem', width: 48, height: 72, borderRadius: 6, overflow: 'hidden', flexShrink: 0 }}>
                    {option.poster_path ? (
                      <img
                        src={getProxyImageUrlForPath(option.poster_path, 'w92')!}
                        alt={option.title || option.name || 'image'}
                        style={{ width: 48, height: 72, objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ width: 48, height: 72, background: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
                        No Image
                      </div>
                    )}
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ fontWeight: 600, fontSize: '1rem', color: '#f3f4f6', marginBottom: '0.25rem' }}>
                      {option.title || option.name}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
                      {option.type === "movie" ? "Movie" : "TV Show"}
                      {option.release_date && ` • ${new Date(option.release_date).getFullYear()}`}
                      {option.first_air_date && ` • ${new Date(option.first_air_date).getFullYear()}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <ButtonGroup style={{ paddingTop: '1rem', borderTop: '1px solid rgba(75, 85, 99, 0.3)' }}>
          <Button variant="secondary" onClick={onClose}>
            <X size={16} />
            Cancel
          </Button>
        </ButtonGroup>
      </ModalContent>
    </Modal>
  );
};

export default SearchModal;
