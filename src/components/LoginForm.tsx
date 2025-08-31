import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { login, convertApiPlayerToFrontend } from "@/lib/api";

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

export function LoginForm({
  onSuccess,
  onBack,
}: {
  onSuccess: (p: Player) => void;
  onBack: () => void;
}) {
  const { toast } = useToast();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (k: "email" | "password", v: string) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) return;

    setLoading(true);
    try {
      const resp = await login(form.email, form.password);
      if (resp?.success && resp?.data) {
        const player = convertApiPlayerToFrontend(resp.data);
        try { localStorage.setItem("prereg_user", JSON.stringify(player)); } catch {}
        toast({ title: "Bem-vindo!", description: `Código: ${player.inviteCode}` });
        onSuccess(player);
      } else {
        throw new Error(resp?.message || "Falha ao entrar");
      }
    } catch (err: any) {
      toast({ title: "Erro no login", description: err?.message || "Verifique suas credenciais", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card className="bg-gradient-card border-border/50 shadow-card backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-foreground">Entrar</CardTitle>
              <CardDescription>Acesse sua conta com e-mail e senha</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="seu@email.com"
                    className="bg-input/50 border-border/50"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={form.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    placeholder="••••••••"
                    className="bg-input/50 border-border/50"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-gaming hover:shadow-glow transition-all duration-300"
                  disabled={loading}
                >
                  {loading ? "Entrando..." : "Entrar"}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full mt-2"
                  onClick={onBack}
                >
                  Voltar
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
