// src/components/RankingPage.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, Trophy, Crown, Medal, Award, CheckCircle, XCircle } from "lucide-react";
import { fetchRankingData } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface RankingPageProps {
  onBack: () => void;
}

interface PlayerRanking {
  position: number;
  name: string;
  points: number;
  email_verified: boolean;
}

interface RankingData {
  total_players: number;
  total_invites: number;
  conversion_rate: number;
  top_players: PlayerRanking[];
}

export const RankingPage = ({ onBack }: RankingPageProps) => {
  const [rankingData, setRankingData] = useState<RankingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadRankingData();
  }, []);

  const loadRankingData = async () => {
    try {
      setIsLoading(true);
      const data = await fetchRankingData();
      setRankingData(data);
    } catch (error) {
      console.error('Erro ao carregar ranking:', error);
      toast({
        title: "Erro ao carregar ranking",
        description: "Não foi possível carregar os dados do ranking.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <Trophy className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getPositionBadge = (position: number) => {
    if (position <= 3) {
      const colors = {
        1: "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white",
        2: "bg-gradient-to-r from-gray-400 to-gray-500 text-white",
        3: "bg-gradient-to-r from-amber-600 to-amber-700 text-white"
      };
      return colors[position as keyof typeof colors];
    }
    return "bg-secondary text-secondary-foreground";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando ranking...</p>
        </div>
      </div>
    );
  }

  if (!rankingData) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">Erro ao carregar dados</p>
          <Button onClick={loadRankingData}>Tentar novamente</Button>
        </div>
      </div>
    );
  }

  const topThree = rankingData.top_players.slice(0, 3);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              onClick={onBack}
              variant="outline"
              size="icon"
              className="border-border/50 hover:bg-secondary/50"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-foreground mb-2">
                🏆 Ranking de Convites
              </h1>
              <p className="text-muted-foreground">
                Top players que mais convidaram amigos
              </p>
            </div>
          </div>

          {/* Stats Cards - DADOS REAIS DO BANCO */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-gradient-card border-border/50 shadow-card text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-primary mb-2">
                  {rankingData.total_players.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <Users className="w-4 h-4" />
                  Total Players
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-card border-border/50 shadow-card text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-accent mb-2">
                  {rankingData.total_invites.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <Trophy className="w-4 h-4" />
                  Total Convites
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-card border-border/50 shadow-card text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-primary-glow mb-2">
                  {rankingData.conversion_rate.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Taxa de Conversão</div>
              </CardContent>
            </Card>
          </div>

          {/* Top 3 Podium */}
          {topThree.length >= 3 && (
            <Card className="bg-gradient-card border-border/50 shadow-card mb-6">
              <CardHeader>
                <CardTitle className="text-center text-foreground">🏆 Pódio dos Campeões</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {/* 2nd Place */}
                  <div className="text-center order-1">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full mx-auto mb-3 flex items-center justify-center shadow-card">
                      <Medal className="w-8 h-8 text-white" />
                    </div>
                    <div className="font-semibold text-foreground text-sm">{topThree[1]?.name}</div>
                    <div className="text-2xl font-bold text-gray-400">{topThree[1]?.points}</div>
                    <div className="text-xs text-muted-foreground">pontos</div>
                  </div>

                  {/* 1st Place */}
                  <div className="text-center order-2">
                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full mx-auto mb-3 flex items-center justify-center shadow-intense transform -translate-y-2">
                      <Crown className="w-10 h-10 text-white" />
                    </div>
                    <div className="font-bold text-foreground">{topThree[0]?.name}</div>
                    <div className="text-3xl font-bold text-yellow-500">{topThree[0]?.points}</div>
                    <div className="text-xs text-muted-foreground">pontos</div>
                  </div>

                  {/* 3rd Place */}
                  <div className="text-center order-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-amber-700 rounded-full mx-auto mb-3 flex items-center justify-center shadow-card">
                      <Award className="w-8 h-8 text-white" />
                    </div>
                    <div className="font-semibold text-foreground text-sm">{topThree[2]?.name}</div>
                    <div className="text-2xl font-bold text-amber-600">{topThree[2]?.points}</div>
                    <div className="text-xs text-muted-foreground">pontos</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Full Ranking */}
          <Card className="bg-gradient-card border-border/50 shadow-card">
            <CardHeader>
              <CardTitle className="text-foreground">Ranking Completo</CardTitle>
              <CardDescription>
                Todos os players ordenados por pontos de convite
              </CardDescription>
            </CardHeader>
            <CardContent>
              {rankingData.top_players.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Nenhum player encontrado ainda.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {rankingData.top_players.map((player) => (
                    <div
                      key={player.position}
                      className={`flex items-center gap-4 p-4 rounded-lg border transition-all duration-300 hover:scale-[1.02] ${
                        player.position <= 3
                          ? 'bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 shadow-glow'
                          : 'bg-secondary/30 border-border/50 hover:bg-secondary/50'
                      }`}
                    >
                      {/* Position */}
                      <div className="flex items-center gap-3">
                        <Badge
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${getPositionBadge(player.position)}`}
                        >
                          {player.position}
                        </Badge>
                        {getPositionIcon(player.position)}
                      </div>

                      {/* Player Info */}
                      <div className="flex-1">
                        <div className="font-semibold text-foreground">{player.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {player.email_verified ? (
                            <div className="flex items-center gap-1">
                              <CheckCircle className="w-3 h-3 text-green-500" />
                              Email verificado
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <XCircle className="w-3 h-3 text-orange-500" />
                              Pendente verificação
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Points */}
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{player.points}</div>
                        <div className="text-xs text-muted-foreground">pontos</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};