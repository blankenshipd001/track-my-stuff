"use client";

import React, { ChangeEvent, useRef, useState } from "react";
import { X, Search as SearchIcon } from "lucide-react";
import { Box, Button, IconButton, InputBase, Typography } from "@mui/material";
import { Media } from "@/data-models/media.interface";
import { getProxyImageUrlForPath } from "@/lib/imageUrl";
import { debounce } from "@mui/material/utils";
import { COLORS } from "@/lib/theme-constants";

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
    <Box
      onClick={onClose}
      sx={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.8)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        p: "1rem",
      }}
    >
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          background: "#1f2937",
          borderRadius: "1rem",
          p: "2rem",
          maxWidth: "700px",
          width: "100%",
          border: "1px solid rgba(75, 85, 99, 0.5)",
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
        }}
      >
        <Typography component="h2" sx={{ fontSize: "1.5rem", fontWeight: "bold", m: "0 0 1.5rem 0" }}>
          Search for a Title
        </Typography>

        {/* Search Input */}
        <Box sx={{ mb: "1.5rem" }}>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              p: "0.875rem 3rem 0.875rem 1rem",
              background: "#1f2937",
              border: "2px solid #374151",
              borderRadius: "12px",
              color: "#f3f4f6",
              fontSize: "1rem",
              boxSizing: "border-box",
              display: "flex",
              alignItems: "center",
              "&:focus-within": {
                borderColor: COLORS.purple.solid,
              },
            }}
          >
            <InputBase
              ref={inputRef}
              inputProps={{ "aria-label": "Search for movies or TV shows" }}
              placeholder="Search for movies or TV shows..."
              value={searchValue}
              onChange={handleInputChange}
              autoFocus
              sx={{
                color: "#f3f4f6",
                width: "100%",
              }}
            />
            <Box sx={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", display: "flex", gap: "0.5rem", alignItems: "center" }}>
              {searchValue && (
                <IconButton
                  onClick={handleClear}
                  aria-label="Clear search"
                  sx={{
                    color: COLORS.gray[400],
                    p: "0.25rem",
                  }}
                >
                  <X size={18} />
                </IconButton>
              )}
              <SearchIcon size={18} color={COLORS.gray[400]} />
            </Box>
          </Box>
        </Box>

        {/* Search Results */}
        <Box sx={{ flex: 1, overflowY: "auto", mb: "1.5rem", minHeight: "200px" }}>
          {isSearching && (
            <Typography sx={{ textAlign: "center", p: "2rem", color: COLORS.gray[400] }}>
              Searching...
            </Typography>
          )}

          {!isSearching && searchValue && dropdownOptions.length === 0 && (
            <Typography sx={{ textAlign: "center", p: "2rem", color: COLORS.gray[400] }}>
              No results found for &ldquo;{searchValue}&rdquo;
            </Typography>
          )}

          {!searchValue && (
            <Typography sx={{ textAlign: "center", p: "2rem", color: COLORS.gray[400] }}>
              Start typing to search for titles
            </Typography>
          )}

          {!isSearching && dropdownOptions.length > 0 && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {dropdownOptions.map((option: Media) => (
                <Button
                  key={option.id}
                  onClick={() => handleSelectTitle(option)}
                  sx={{
                    display: "flex",
                    p: "0.75rem",
                    background: "#1f2937",
                    borderRadius: "8px",
                    transition: "all 0.2s",
                    border: "1px solid transparent",
                    justifyContent: "flex-start",
                    textTransform: "none",
                    "&:hover": {
                      background: "#374151",
                      borderColor: COLORS.purple.solid,
                    },
                  }}
                >
                  <Box sx={{ mr: "1rem", width: 48, height: 72, borderRadius: 1, overflow: "hidden", flexShrink: 0 }}>
                    {option.poster_path ? (
                      <img
                        src={getProxyImageUrlForPath(option.poster_path, 'w92')!}
                        alt={option.title || option.name || 'image'}
                        style={{ width: 48, height: 72, objectFit: 'cover' }}
                      />
                    ) : (
                      <Box sx={{ width: 48, height: 72, background: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
                        No Image
                      </Box>
                    )}
                  </Box>
                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Typography sx={{ fontWeight: 600, fontSize: '1rem', color: '#f3f4f6', mb: '0.25rem' }}>
                      {option.title || option.name}
                    </Typography>
                    <Typography sx={{ fontSize: '0.875rem', color: COLORS.gray[400] }}>
                      {option.type === "movie" ? "Movie" : "TV Show"}
                      {option.release_date && ` • ${new Date(option.release_date).getFullYear()}`}
                      {option.first_air_date && ` • ${new Date(option.first_air_date).getFullYear()}`}
                    </Typography>
                  </Box>
                </Button>
              ))}
            </Box>
          )}
        </Box>

        {/* Action buttons */}
        <Box sx={{ display: "flex", gap: "0.5rem", pt: "1rem", borderTop: "1px solid rgba(75, 85, 99, 0.3)" }}>
          <Button
            onClick={onClose}
            sx={{
              flex: 1,
              p: "0.75rem",
              borderRadius: "0.5rem",
              fontWeight: 600,
              border: "1px solid rgba(75, 85, 99, 0.5)",
              background: "rgba(31, 41, 55, 0.8)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              textTransform: "none",
              "&:hover": {
                background: "rgba(55, 65, 81, 0.8)",
              },
            }}
          >
            <X size={16} />
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default SearchModal;
