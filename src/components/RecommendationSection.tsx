"use client";

import React, { useEffect, useState } from "react";
import ProfileCard from "./ProfileCard";
import { Sparkles, TrendingUp } from "lucide-react";

interface Model {
  id: string;
  name: string;
  age: number;
  location: string;
  imageUrl: string;
}

export default function RecommendationSection() {
  const [recommendations, setRecommendations] = useState<Model[]>([]);

  useEffect(() => {
    // Simulated Algorithm: Priorities higher-tier and same-city models
    // In a real app, this would fetch from a database with a score-based algorithm
    const mockRecs: Model[] = [
      { id: '1', name: 'Valentina', age: 21, location: 'Guayaquil', imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800' },
      { id: '2', name: 'Alessandra', age: 24, location: 'Samborondón', imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800' },
      { id: '3', name: 'Isabella', age: 22, location: 'Cumbayá', imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800' },
    ];
    setRecommendations(mockRecs);
  }, []);

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-brand-gold/10 rounded-2xl border border-brand-gold/20">
              <Sparkles className="text-brand-gold" size={24} />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-serif text-brand-gold tracking-tight">Especial para ti</h2>
              <p className="text-brand-white/50 text-xs uppercase tracking-widest mt-1">Sugerencias inteligentes basadas en tu búsqueda</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-brand-pink text-xs font-black uppercase tracking-tighter">
            <TrendingUp size={16} />
            Popular Cerca de ti
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recommendations.map((model) => (
            <ProfileCard key={model.id} {...model} />
          ))}
        </div>
      </div>
    </section>
  );
}
