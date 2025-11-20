"use client";

import { useState } from "react";
import styled, { css } from "styled-components";
import { Plus, Film, Tv, Edit2, X, Check, Trash2 } from "lucide-react";

interface ButtonProps {
  variant?: "primary" | "secondary";
  active?: string;
}

interface DivProps {
  status?: "watching" | "completed" | "watchlist";
  width?: number;
}

interface SvgProps {
  filled?: boolean;
}

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom right, #111827, #1f2937, #111827);
  color: white;
  padding: 1.5rem;
`;

const Header = styled.div`
  max-width: 80rem;
  margin: 0 auto 2rem;
`;

const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled.h1`
  font-size: 2.25rem;
  font-weight: bold;
  background: linear-gradient(to right, #c084fc, #f472b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
`;

const Subtitle = styled.p`
  color: #9ca3af;
  margin-top: 0.5rem;
`;

const AddButton = styled.button<ButtonProps>`
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

const Modal = styled.div`
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

const ModalContent = styled.div`
  background: #1f2937;
  border-radius: 1rem;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  border: 1px solid rgba(75, 85, 99, 0.5);
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 0 1.5rem 0;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #d1d5db;
`;

const Input = styled.input`
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

const Select = styled.select`
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

const ProgressInputs = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1.5rem;
`;

const Button = styled.button<ButtonProps>`
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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const StatCard = styled.div`
  background: rgba(31, 41, 55, 0.5);
  backdrop-filter: blur(12px);
  border-radius: 0.75rem;
  padding: 1rem;
  border: 1px solid rgba(75, 85, 99, 0.5);
`;

const StatNumber = styled.div`
  font-size: 1.875rem;
  font-weight: bold;
  color: ${(props) => props.color || "#60a5fa"};
`;

const StatLabel = styled.div`
  color: #9ca3af;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button<ButtonProps>`
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

const GridContainer = styled.div`
  max-width: 80rem;
  margin: 0 auto;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const Card = styled.div`
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

const ImageContainer = styled.div`
  position: relative;
  height: 20rem;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, #111827, rgba(17, 24, 39, 0.4), transparent);
`;

const CardActions = styled.div`
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

const IconButton = styled.button<ButtonProps>`
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

const ProviderBadge = styled.div`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${(props) => props.color};
`;

const TypeBadge = styled.div`
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

const CardInfo = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: bold;
  margin: 0 0 0.5rem 0;
`;

const ProgressContainer = styled.div`
  margin-bottom: 0.5rem;
`;

const ProgressText = styled.div`
  font-size: 0.75rem;
  color: #d1d5db;
  margin-bottom: 0.25rem;
`;

const ProgressBar = styled.div`
  width: 100%;
  background: #374151;
  border-radius: 9999px;
  height: 0.375rem;
  overflow: hidden;
`;

const ProgressFill = styled.div<DivProps>`
  background: linear-gradient(to right, #a855f7, #ec4899);
  height: 100%;
  width: ${(props) => props.width}%;
  border-radius: 9999px;
`;

const CardBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Stars = styled.div`
  display: flex;
  gap: 0.25rem;
`;

const Star = styled.svg<SvgProps>`
  width: 1rem;
  height: 1rem;
  fill: ${(props) => (props.filled ? "#fbbf24" : "#4b5563")};
  cursor: pointer;
  transition: fill 0.2s;

  &:hover {
    fill: #fbbf24;
  }
`;

const StatusBadge = styled.div<DivProps>`
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${(props) => (props.status === "watching" ? "rgba(59, 130, 246, 0.2)" : props.status === "completed" ? "rgba(34, 197, 94, 0.2)" : "rgba(168, 85, 247, 0.2)")};
  color: ${(props) => (props.status === "watching" ? "#93c5fd" : props.status === "completed" ? "#86efac" : "#d8b4fe")};
`;

const Legend = styled.div`
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  background: rgba(31, 41, 55, 0.9);
  backdrop-filter: blur(12px);
  border-radius: 0.75rem;
  padding: 1rem;
  border: 1px solid rgba(75, 85, 99, 0.5);
`;

const LegendTitle = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: #9ca3af;
  margin-bottom: 0.5rem;
`;

const LegendItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LegendDot = styled.div`
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 9999px;
  background: ${(props) => props.color};
`;

const LegendLabel = styled.span`
  font-size: 0.875rem;
`;

const StreamingWatchlist = () => {
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    type: "movie",
    provider: "netflix",
    status: "watchlist",
    rating: 0,
    progress: { current: 0, total: 0 },
    image: "",
  });

  const providers: object = {
    netflix: { name: "Netflix", color: "#dc2626" },
    hulu: { name: "Hulu", color: "#22c55e" },
    disney: { name: "Disney+", color: "#2563eb" },
    hbo: { name: "HBO Max", color: "#9333ea" },
    prime: { name: "Prime Video", color: "#0ea5e9" },
    apple: { name: "Apple TV+", color: "#1f2937" },
  };

  const [items, setItems] = useState([
    {
      id: 1,
      title: "The Last of Us",
      type: "tv",
      provider: "hbo",
      status: "watching",
      progress: { current: 7, total: 9 },
      rating: 5,
      image: "https://images.unsplash.com/photo-1574267432644-f610f00de51f?w=400&h=600&fit=crop",
    },
    {
      id: 2,
      title: "Oppenheimer",
      type: "movie",
      provider: "prime",
      status: "completed",
      rating: 4,
      image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop",
    },
    {
      id: 3,
      title: "Stranger Things",
      type: "tv",
      provider: "netflix",
      status: "watching",
      progress: { current: 4, total: 8 },
      rating: 4,
      image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop",
    },
    {
      id: 4,
      title: "The Bear",
      type: "tv",
      provider: "hulu",
      status: "watching",
      progress: { current: 5, total: 10 },
      rating: 5,
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=600&fit=crop",
    },
    {
      id: 5,
      title: "Dune: Part Two",
      type: "movie",
      provider: "hbo",
      status: "watchlist",
      rating: 0,
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=600&fit=crop",
    },
    {
      id: 6,
      title: "The Morning Show",
      type: "tv",
      provider: "apple",
      status: "watching",
      progress: { current: 3, total: 10 },
      rating: 4,
      image: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=400&h=600&fit=crop",
    },
  ]);

  const filteredItems = items.filter((item) => {
    if (filter === "all") return true;
    if (filter === "movies") return item.type === "movie";
    if (filter === "tv") return item.type === "tv";
    return item.status === filter;
  });

  const stats = {
    watching: items.filter((i) => i.status === "watching").length,
    completed: items.filter((i) => i.status === "completed").length,
    watchlist: items.filter((i) => i.status === "watchlist").length,
  };

  const resetForm = () => {
    setFormData({
      title: "",
      type: "movie",
      provider: "netflix",
      status: "watchlist",
      rating: 0,
      progress: { current: 0, total: 0 },
      image: "",
    });
  };

  const handleAdd = () => {
    setEditingId(null);
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      type: item.type,
      provider: item.provider,
      status: item.status,
      rating: item.rating || 0,
      progress: item.progress || { current: 0, total: 0 },
      image: item.image,
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.title.trim()) return;

    if (editingId) {
      setItems(items.map((item) => (item.id === editingId ? { ...item, ...formData } : item)));
    } else {
      const newItem = {
        id: Math.max(...items.map((i) => i.id), 0) + 1,
        ...formData,
        image: formData.image || "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop",
      };
      setItems([...items, newItem]);
    }

    setShowModal(false);
    setEditingId(null);
    resetForm();
  };

  const handleDelete = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleCancel = () => {
    setShowModal(false);
    setEditingId(null);
    resetForm();
  };

  const calculateProgress = (progress) => {
    if (!progress || !progress.total) return 0;
    return (progress.current / progress.total) * 100;
  };

  return (
    <Container>
      <Header>
        <HeaderTop>
          <div>
            <Title>My Watchlist</Title>
            <Subtitle>Track what you&apos;re watching across all platforms</Subtitle>
          </div>
          <AddButton onClick={handleAdd}>
            <Plus size={20} />
            Add Title
          </AddButton>
        </HeaderTop>

        <StatsGrid>
          <StatCard>
            <StatNumber color="#60a5fa">{stats.watching}</StatNumber>
            <StatLabel>Currently Watching</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber color="#4ade80">{stats.completed}</StatNumber>
            <StatLabel>Completed</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber color="#c084fc">{stats.watchlist}</StatNumber>
            <StatLabel>In Watchlist</StatLabel>
          </StatCard>
        </StatsGrid>

        <FilterContainer>
          {["all", "watching", "completed", "watchlist", "movies", "tv"].map((f) => (
            <FilterButton key={f} active={(filter === f).toString()} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </FilterButton>
          ))}
        </FilterContainer>
      </Header>

      <GridContainer>
        <Grid>
          {filteredItems.map((item) => (
            <Card key={item.id}>
              <ImageContainer>
                <Image src={item.image} alt={item.title} />
                <ImageOverlay />

                <CardActions>
                  <IconButton onClick={() => handleEdit(item)}>
                    <Edit2 size={14} />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(item.id)}>
                    <Trash2 size={14} />
                  </IconButton>
                </CardActions>

                <ProviderBadge color={providers[item.provider].color}>{providers[item.provider].name}</ProviderBadge>

                <TypeBadge>
                  {item.type === "movie" ? <Film size={12} /> : <Tv size={12} />}
                  {item.type === "movie" ? "Movie" : "TV Show"}
                </TypeBadge>

                <CardInfo>
                  <CardTitle>{item.title}</CardTitle>

                  {item.progress && item.progress.total > 0 && (
                    <ProgressContainer>
                      <ProgressText>
                        {item.progress.current}/{item.progress.total} episodes
                      </ProgressText>
                      <ProgressBar>
                        <ProgressFill width={calculateProgress(item.progress)} />
                      </ProgressBar>
                    </ProgressContainer>
                  )}

                  <CardBottom>
                    <Stars>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} filled={i < item.rating} viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </Star>
                      ))}
                    </Stars>

                    <StatusBadge status={item.status}>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</StatusBadge>
                  </CardBottom>
                </CardInfo>
              </ImageContainer>
            </Card>
          ))}
        </Grid>
      </GridContainer>

      {showModal && (
        <Modal onClick={handleCancel}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>{editingId ? "Edit Title" : "Add New Title"}</ModalTitle>

            <FormGroup>
              <Label>Title</Label>
              <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Enter title" />
            </FormGroup>

            <FormGroup>
              <Label>Type</Label>
              <Select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                <option value="movie">Movie</option>
                <option value="tv">TV Show</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Streaming Provider</Label>
              <Select value={formData.provider} onChange={(e) => setFormData({ ...formData, provider: e.target.value })}>
                {Object.entries(providers).map(([key, provider]) => (
                  <option key={key} value={key}>
                    {provider.name}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Status</Label>
              <Select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                <option value="watchlist">Watchlist</option>
                <option value="watching">Watching</option>
                <option value="completed">Completed</option>
              </Select>
            </FormGroup>

            {formData.type === "tv" && (
              <FormGroup>
                <Label>Progress (Episodes)</Label>
                <ProgressInputs>
                  <Input
                    type="number"
                    min="0"
                    value={formData.progress.current}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        progress: { ...formData.progress, current: parseInt(e.target.value) || 0 },
                      })
                    }
                    placeholder="Current"
                  />
                  <Input
                    type="number"
                    min="0"
                    value={formData.progress.total}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        progress: { ...formData.progress, total: parseInt(e.target.value) || 0 },
                      })
                    }
                    placeholder="Total"
                  />
                </ProgressInputs>
              </FormGroup>
            )}

            <FormGroup>
              <Label>Rating</Label>
              <Stars>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} filled={i < formData.rating} viewBox="0 0 20 20" onClick={() => setFormData({ ...formData, rating: i + 1 })}>
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </Star>
                ))}
              </Stars>
            </FormGroup>

            <FormGroup>
              <Label>Image URL (optional)</Label>
              <Input value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} placeholder="https://..." />
            </FormGroup>

            <ButtonGroup>
              <Button variant="secondary" onClick={handleCancel}>
                <X size={16} />
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSave}>
                <Check size={16} />
                {editingId ? "Save Changes" : "Add Title"}
              </Button>
            </ButtonGroup>
          </ModalContent>
        </Modal>
      )}

      <Legend>
        <LegendTitle>STREAMING SERVICES</LegendTitle>
        <LegendItems>
          {Object.entries(providers).map(([key, provider]) => (
            <LegendItem key={key}>
              <LegendDot color={provider.color} />
              <LegendLabel>{provider.name}</LegendLabel>
            </LegendItem>
          ))}
        </LegendItems>
      </Legend>
    </Container>
  );
};

export default StreamingWatchlist;
