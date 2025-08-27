import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { GamepadIcon, Users, Trophy, Share2 } from "lucide-react";

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

interface PreRegisterFormProps {
  onSuccess: (player: Player) => void;
}

export const PreRegisterForm = ({ onSuccess }: PreRegisterFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: ""
  });
  const [referrerCode, setReferrerCode] = useState<string>("");
  const [referrerName, setReferrerName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check for referrer code in URL
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');
    if (ref) {
      setReferrerCode(ref);
      // Simulate finding referrer name
      setReferrerName("GameMaster123"); // This would come from your backend
    }
  }, []);

  const generateInviteCode = () => {
    return Math.random().toString(36).substring(2, 12).toUpperCase();
  };

  const generateUHash = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erro na senha",
        description: "As senhas não coincidem",
        variant: "destructive"
      });
      return;
    }

    if (formData.password.length < 8) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 8 caracteres",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const newPlayer: Player = {
        id: Math.random().toString(36).substring(2, 15),
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        inviteCode: generateInviteCode(),
        referrerCode: referrerCode || undefined,
        referrerName: referrerName || undefined,
        points: 0,
        emailVerified: false,
        createdAt: new Date()
      };

      setIsLoading(false);
      onSuccess(newPlayer);
      
      toast({
        title: "Pré-registro realizado!",
        description: "Verifique seu email para confirmar a conta",
      });
    }, 2000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-gaming rounded-xl mb-4 shadow-glow">
              <GamepadIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Pré-Registro
            </h1>
            <p className="text-muted-foreground">
              Faça seu cadastro e convide amigos para ganhar pontos
            </p>
          </div>

          {/* Referrer Badge */}
          {referrerCode && (
            <Card className="mb-6 bg-gradient-card border-primary/20 shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-gaming rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Convidado por:</p>
                    <p className="font-semibold text-foreground">{referrerName}</p>
                  </div>
                  <Badge variant="secondary" className="ml-auto">
                    <Trophy className="w-3 h-3 mr-1" />
                    +1 Ponto
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Registration Form */}
          <Card className="bg-gradient-card border-border/50 shadow-card backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-foreground">Criar Conta</CardTitle>
              <CardDescription>
                Preencha seus dados para começar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-foreground">Nickname</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="bg-input/50 border-border/50 focus:border-primary focus:ring-primary/50"
                    placeholder="Seu nickname único"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-foreground">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="bg-input/50 border-border/50 focus:border-primary focus:ring-primary/50"
                    placeholder="seu@email.com"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-foreground">Celular</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                    className="bg-input/50 border-border/50 focus:border-primary focus:ring-primary/50"
                    placeholder="(11) 99999-9999"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password" className="text-foreground">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="bg-input/50 border-border/50 focus:border-primary focus:ring-primary/50"
                    placeholder="Mínimo 8 caracteres"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="confirmPassword" className="text-foreground">Confirmar Senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="bg-input/50 border-border/50 focus:border-primary focus:ring-primary/50"
                    placeholder="Digite a senha novamente"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-gaming hover:shadow-glow transition-all duration-300 transform hover:-translate-y-0.5"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Criando conta...
                    </div>
                  ) : (
                    <>
                      <GamepadIcon className="w-4 h-4 mr-2" />
                      Fazer Pré-Registro
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <Card className="bg-gradient-card border-border/50 shadow-card text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-primary">1,247</div>
                <div className="text-sm text-muted-foreground">Players</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card border-border/50 shadow-card text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-accent">856</div>
                <div className="text-sm text-muted-foreground">Convites</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};