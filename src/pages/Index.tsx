// src/pages/index.tsx  (ou src/app/page.tsx em Next App Router com "use client")
"use client";

import { useState, useEffect } from "react";
import { PreRegisterForm } from "@/components/PreRegisterForm";
import { SuccessPage } from "@/components/SuccessPage";
import { RankingPage } from "@/components/RankingPage";
import { LoginForm } from "@/components/LoginForm"; // ✅ novo
import { getPlayerByInvite, convertApiPlayerToFrontend } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

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

//  inclui "login"
type PageState = "register" | "login" | "success" | "ranking";

const Index = () => {
  const [currentPage, setCurrentPage] = useState<PageState>("register");
  const [registeredPlayer, setRegisteredPlayer] = useState<Player | null>(null);
  const { toast } = useToast();

  const goSuccess = (player: Player) => {
    setRegisteredPlayer(player);
    setCurrentPage("success");
    try {
      localStorage.setItem("prereg_user", JSON.stringify(player));
    } catch {}
  };

  // quando o formulário conclui com sucesso
  const handleRegistrationSuccess = (player: Player) => {
    goSuccess(player);
  };

  const handleViewRanking = () => setCurrentPage("ranking");

  // voltar do ranking: se tem player em memória, volta pro perfil; senão, registro
  const handleBack = () => {
    if (registeredPlayer) setCurrentPage("success");
    else setCurrentPage("register");
  };

  // Restaura sessão se já existir no navegador
  useEffect(() => {
    try {
      const s = localStorage.getItem("prereg_user");
      if (s) {
        const p: Player = JSON.parse(s);
        setRegisteredPlayer(p);
        setCurrentPage("success");
      }
    } catch {}
  }, []);

  // Pós-verificação por e-mail: /?verified=1&invite=XXXX
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const verified = params.get("verified");
    const invite = params.get("invite");

    if (verified === "1" && invite) {
      (async () => {
        try {
          const resp = await getPlayerByInvite(invite);
          if (resp?.success && resp?.data) {
            const player = convertApiPlayerToFrontend(resp.data);
            goSuccess(player);

            toast({
              title: "E-mail verificado com sucesso!",
              description: `Seu código de convite: ${player.inviteCode}`,
            });

            // limpa query da URL para não reprocessar
            if (window.history.replaceState) {
              const url = new URL(window.location.href);
              url.search = "";
              window.history.replaceState({}, "", url.toString());
            }
          }
        } catch (e) {
          console.error("Erro pós-verificação:", e);
        }
      })();
    }
  }, [toast]);

  // tela de login ao entrar
  if (currentPage === "login") {
    return (
      <LoginForm
        onSuccess={goSuccess}
        onBack={() => setCurrentPage(registeredPlayer ? "success" : "register")}
      />
    );
  }

  if (currentPage === "success" && registeredPlayer) {
    return (
      <SuccessPage
        player={registeredPlayer}
        onViewRanking={handleViewRanking}
      />
    );
  }

  if (currentPage === "ranking") {
    return <RankingPage onBack={handleBack} />;
  }

  // ✅ passa onLoginClick para abrir a tela de login
  return (
    <PreRegisterForm
      onSuccess={handleRegistrationSuccess}
      onLoginClick={() => setCurrentPage("login")}
    />
  );
};

export default Index;
