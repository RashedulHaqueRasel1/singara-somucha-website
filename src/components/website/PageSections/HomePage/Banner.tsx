"use client";

import { useEffect, useState } from "react";
import { getAllProduct } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2, Users2 } from "lucide-react";

interface Product {
  _id: string;
  teamName: string;
}

export default function Banner() {
  const [teams, setTeams] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await getAllProduct();

        // Extract all unique teamNames
        const uniqueTeams: string[] = Array.from(
          new Set(data.map((p: Product) => p.teamName))
        ).filter(Boolean) as string[];

        setTeams(uniqueTeams.sort());
      } catch (error) {
        console.error("Failed to fetch teams:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <section className="relative h-screen px-4 py-20 sm:px-6 lg:px-8 bg-linear-to-br from-background via-muted/50 to-background min-h-[500px] flex flex-col justify-center">
      <div className="max-w-7xl mx-auto w-full">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
            <Users2 className="h-6 w-6 text-primary mr-2" />
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              Our Ecosystem
            </span>
          </div>
          <h1 className="text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl text-foreground">
            Explore Our <span className="text-primary">Teams</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-muted-foreground">
            Select a team to view their specialized project overviews and
            metrics.
          </p>
        </div>

        {/* Teams Navigation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {teams.map((team) => (
            <Link
              key={team}
              href={`/team/${encodeURIComponent(team)}`}
              className="group"
            >
              <Button
                variant="outline"
                className={cn(
                  "w-full h-32 text-xl font-bold rounded-2xl transition-all duration-500",
                  "hover:bg-primary hover:text-primary-foreground hover:scale-105 hover:shadow-xl hover:shadow-primary/30",
                  "border-2 border-muted hover:border-transparent group-active:scale-95",
                  "flex flex-col gap-2 justify-center items-center backdrop-blur-sm"
                )}
              >
                <div className="p-3 bg-muted group-hover:bg-primary-foreground/20 rounded-xl transition-colors">
                  <span className="text-2xl">⚡</span>
                </div>
                {team}
              </Button>
            </Link>
          ))}
        </div>

        {teams.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground italic">
              No teams found in the system.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
