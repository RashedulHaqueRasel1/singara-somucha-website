"use client";

import { useEffect, useState, use } from "react";
import { getAllProduct } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  ArrowLeft,
  Layers,
  Calendar,
  DollarSign,
  Package,
} from "lucide-react";
import Link from "next/link";

interface Product {
  _id: string;
  name: string;
  singara: number;
  somucha: number;
  paymentAmount: number;
  date: string;
  status: string;
  changeTaka: number;
  teamName: string;
  category?: string;
}

export default function TeamPage({
  params,
}: {
  params: Promise<{ teamName: string }>;
}) {
  const { teamName } = use(params);
  const decodedTeamName = decodeURIComponent(teamName);

  const [allTeamProducts, setAllTeamProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await getAllProduct();

        // Filter products for the selected team
        const filteredProducts = data.filter(
          (p: Product) => p.teamName === decodedTeamName
        );

        // Extract unique categories (using fallback)
        const uniqueCategories: string[] = Array.from(
          new Set(filteredProducts.map((p: Product) => p.category || "General"))
        );

        setAllTeamProducts(filteredProducts);
        setCategories(uniqueCategories);

        if (uniqueCategories.length > 0) {
          setActiveCategory(uniqueCategories[0]);
        }
      } catch (error) {
        console.error("Failed to fetch team products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [decodedTeamName]);

  const displayedProducts = allTeamProducts.filter(
    (p) => (p.category || "General") === activeCategory
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse font-medium">
          Loading team data...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-12 space-y-6">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl text-foreground">
                Team{" "}
                <span className="text-primary italic underline decoration-wavy decoration-2 underline-offset-8">
                  {decodedTeamName}
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Comprehensive overview of projects, orders, and performance
                metrics for the {decodedTeamName} department.
              </p>
            </div>

            <div className="flex items-center gap-4 bg-background p-4 rounded-2xl border shadow-sm shrink-0">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">
                  Total Orders
                </p>
                <p className="text-2xl font-bold">{allTeamProducts.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <Layers className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold uppercase tracking-wider">
              Browse Categories
            </h2>
          </div>

          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "rounded-2xl px-6 py-5 text-base font-semibold transition-all duration-300",
                  activeCategory === category
                    ? "shadow-lg shadow-primary/25 scale-105"
                    : "hover:bg-muted/80"
                )}
              >
                {category}
              </Button>
            ))}
            {categories.length === 0 && (
              <div className="w-full text-center p-12 bg-muted/30 rounded-3xl border-2 border-dashed">
                <p className="text-muted-foreground italic">
                  No categories found for this team.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedProducts.map((product) => (
            <Card
              key={product._id}
              className="group overflow-hidden rounded-3xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-muted/50 bg-background/50 backdrop-blur-sm"
            >
              <CardHeader className="bg-muted/30 pb-4 border-b">
                <CardTitle className="flex justify-between items-center group-hover:text-primary transition-colors">
                  <span className="truncate">{product.name}</span>
                  <span
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full",
                      product.status === "done"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700 flex items-center gap-1"
                    )}
                  >
                    {product.status === "pending" && (
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                    )}
                    {product.status}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/20 rounded-2xl space-y-1">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                      Singara
                    </p>
                    <p className="text-xl font-bold">{product.singara}</p>
                  </div>
                  <div className="p-4 bg-muted/20 rounded-2xl space-y-1">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                      Somucha
                    </p>
                    <p className="text-xl font-bold">{product.somucha}</p>
                  </div>
                </div>

                <div className="pt-6 border-t flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <DollarSign className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                        Payment
                      </p>
                      <p className="text-xl font-black text-foreground">
                        ৳{product.paymentAmount}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        Dated
                      </span>
                    </div>
                    <p className="text-sm font-bold text-foreground">
                      {product.date}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {displayedProducts.length === 0 && categories.length > 0 && (
          <div className="text-center py-24 bg-muted/20 rounded-3xl border-2 border-dashed">
            <p className="text-2xl font-bold text-muted-foreground">
              No records found
            </p>
            <p className="text-muted-foreground mt-2">
              There are no orders matching the selected category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
