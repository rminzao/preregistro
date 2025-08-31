import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Copy, Share2, Trophy, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface Player {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  inviteCode: string;
  referrerCode?: string;
  referrerName?: string;
  points: number;
  emailVerified: boolean;
  createdAt: Date;
}

interface SuccessPageProps {
  player: Player;
  onViewRanking: () => void;
}

export const SuccessPage = ({ player, onViewRanking }: SuccessPageProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // === Aviso central ===
  const [promoOpen, setPromoOpen] = useState(true);
  const promoShownRef = useRef(false);
  useEffect(() => {
    if (promoShownRef.current) return;
    promoShownRef.current = true;
    const t = setTimeout(() => setPromoOpen(false), 6000); // fecha sozinho
    return () => clearTimeout(t);
  }, []);

  // Guardas pro SSR (Next.js etc.)
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const inviteUrl = `${origin ? origin : ""}/?ref=${player.inviteCode}`;
  const whatsappText = `🎮 Faça seu pré-registro neste link: ${inviteUrl}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;

  const copyInviteLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      toast({
        title: "Link copiado!",
        description: "Compartilhe com seus amigos",
      });
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast({
        title: "Falha ao copiar",
        description: "Não foi possível copiar o link.",
        variant: "destructive",
      });
    }
  };

  // === LOGOUT REAL ===
  const handleLogout = async () => {
    try {
      // Se no futuro você criar um endpoint de logout no backend
      // await fetch('/api/logout', { method: 'POST', credentials: 'include' }).catch(() => {});
    } finally {
      // Limpa tudo que você usa no front
      try {
        localStorage.removeItem("prereg_user");
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
      } catch {}
      try {
        sessionStorage.clear();
      } catch {}
      // Apaga cookie simples (se existir algum token próprio)
      document.cookie = "token=; Max-Age=0; path=/";
      // Redireciona
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      {/* Aviso central (modal leve) */}
      <Dialog open={promoOpen} onOpenChange={setPromoOpen}>
        <DialogContent
          className="max-w-md text-center"
          // bloqueia fechar por clique fora e por ESC
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <h2 className="text-xl font-bold mb-3">🎯 Sistema de Pontos & Premiações</h2>

          <div className="space-y-2 text-sm text-foreground">
            <div>✨ <b>+10 pts</b> ao confirmar seu e-mail</div>
            <div>🤝 <b>+40 pts</b> por cada amigo confirmado pelo seu convite</div>
            <div>🚀 <b>+10 pts extras</b> quando seus convidados também convidarem outros</div>
            <div className="pt-2 text-[13px] font-semibold text-yellow-500">
              ⚠️ Pontuação só é contabilizada após <u>verificar seu e-mail</u>.
            </div>
          </div>

          <div className="pt-4 text-left">
            <p className="font-semibold mb-1">🏆 Premiação Top 3</p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground">
              <li>🥇 1º lugar: <b>Recarga FULL</b></li>
              <li>🥈 2º lugar: <b>Cupom 50%</b> de desconto na recarga</li>
              <li>🥉 3º lugar: <b>1 mês de Passe</b></li>
            </ul>
          </div>

          <Button onClick={() => setPromoOpen(false)} className="mt-4 w-full">
            Fechar
          </Button>
        </DialogContent>
      </Dialog>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-gaming rounded-xl mb-4 shadow-glow">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Cadastro Realizado!
            </h1>
            <p className="text-muted-foreground">
              Bem-vindo, <span className="text-primary font-semibold">{player.name}</span>
            </p>
          </div>

          {/* Player Info Card */}
          <Card className="bg-gradient-card border-border/50 shadow-card backdrop-blur-sm mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Trophy className="w-5 h-5 text-primary" />
                Sua Conta
              </CardTitle>
              <CardDescription>
                Informações do seu perfil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Nickname:</span>
                <span className="font-semibold text-foreground">{player.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Email:</span>
                <span className="text-sm text-foreground">{player.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Código de Convite:</span>
                <Badge variant="secondary" className="font-mono">
                  {player.inviteCode}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Pontos:</span>
                <span className="font-semibold text-primary">{player.points}</span>
              </div>
            </CardContent>
          </Card>

          {/* Email Verification Notice */}
          <Card className="bg-gradient-card border-orange-500/20 shadow-card mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                  <Mail className="w-4 h-4 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Verifique seu email</p>
                  <p className="text-xs text-muted-foreground">
                    Enviamos um link de confirmação para {player.email}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Invite Section */}
          <Card className="bg-gradient-card border-border/50 shadow-card mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Share2 className="w-5 h-5 text-accent" />
                Convide Amigos
              </CardTitle>
              <CardDescription>
                Ganhe pontos para cada amigo que confirmar o cadastro
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-input/30 rounded-lg border border-border/50">
                <p className="text-xs text-muted-foreground mb-1">Seu link de convite:</p>
                <p className="text-sm text-foreground font-mono break-all">{inviteUrl}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={copyInviteLink}
                  variant="secondary"
                  className="transition-all duration-300"
                  disabled={copied}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {copied ? "Copiado!" : "Copiar"}
                </Button>

                <Button
                  onClick={() => window.open(whatsappUrl, "_blank", "noopener,noreferrer")}
                  className="bg-green-600 hover:bg-green-700 transition-all duration-300"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
              </div>

              {/* comunidade */}
              <Button
                onClick={() =>
                  window.open(
                    "https://chat.whatsapp.com/DJKU3kJ4kFm3DFIlrqUZXo?mode=ems_copy_t",
                    "_blank",
                    "noopener,noreferrer"
                  )
                }
                className="w-full bg-green-500 hover:bg-green-600 transition-all duration-300 mt-3"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Entrar na Comunidade
              </Button>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={onViewRanking}
              className="w-full bg-gradient-gaming hover:shadow-glow transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <Trophy className="w-4 h-4 mr-2" />
              Ver Ranking
            </Button>

            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full border-border/50 hover:bg-secondary/50"
            >
              Sair
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
