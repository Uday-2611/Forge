"use client";

import { useState, useMemo } from "react";
import { PAIN_POINTS, PainPoint } from "@/lib/data";
import { Nav } from "@/components/forge/Nav";
import { HeroStrip } from "@/components/forge/HeroStrip";
import { FilterRow } from "@/components/forge/FilterRow";
import { Feed } from "@/components/forge/Feed";
import { Footer } from "@/components/forge/Footer";
import { DetailModal } from "@/components/forge/DetailModal";
import { SubmitModal } from "@/components/forge/SubmitModal";
import { ProfileMenu } from "@/components/forge/ProfileMenu";
import { ListPanel, ListKind } from "@/components/forge/ListPanel";

export default function FeedPage() {
  const [industry, setIndustry] = useState("All");
  const [difficulty, setDifficulty] = useState("Any build");
  const [sort, setSort] = useState("Pain Score");
  const [detail, setDetail] = useState<PainPoint | null>(null);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [listKind, setListKind] = useState<ListKind | null>(null);

  const items = useMemo(() => {
    let list = [...PAIN_POINTS];
    if (industry !== "All") list = list.filter((p) => p.industry === industry);
    if (difficulty !== "Any build")
      list = list.filter((p) => p.difficulty === difficulty);
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.keywords.some((k) => k.toLowerCase().includes(q)) ||
          p.industry.toLowerCase().includes(q)
      );
    }
    if (sort === "Pain Score") list.sort((a, b) => b.score - a.score);
    if (sort === "Trending") list.sort((a, b) => b.builders - a.builders);
    if (sort === "New") list.sort((a, b) => b.id - a.id);
    return list;
  }, [industry, difficulty, sort, query]);

  return (
    <div className="min-h-screen bg-(--forge-bg) text-(--forge-text)">
      <Nav
        onSubmitOpen={() => setSubmitOpen(true)}
        onSearchToggle={() => setSearchOpen((v) => !v)}
        searchOpen={searchOpen}
        query={query}
        setQuery={setQuery}
        onProfileOpen={() => setProfileOpen((v) => !v)}
        profileOpen={profileOpen}
      />

      <HeroStrip />

      <FilterRow
        industry={industry}
        setIndustry={setIndustry}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        sort={sort}
        setSort={setSort}
        total={items.length}
      />

      <Feed items={items} onOpen={setDetail} />

      <Footer />

      <DetailModal p={detail} onClose={() => setDetail(null)} />
      <SubmitModal open={submitOpen} onClose={() => setSubmitOpen(false)} />
      <ProfileMenu
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        onShowList={(kind) => setListKind(kind)}
      />
      <ListPanel kind={listKind} onClose={() => setListKind(null)} />
    </div>
  );
}
