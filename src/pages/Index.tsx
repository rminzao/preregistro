import { useState } from "react";
import { PreRegisterForm } from "@/components/PreRegisterForm";
import { SuccessPage } from "@/components/SuccessPage";
import { RankingPage } from "@/components/RankingPage";

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

type PageState = 'register' | 'success' | 'ranking';

const Index = () => {
  const [currentPage, setCurrentPage] = useState<PageState>('register');
  const [registeredPlayer, setRegisteredPlayer] = useState<Player | null>(null);

  const handleRegistrationSuccess = (player: Player) => {
    setRegisteredPlayer(player);
    setCurrentPage('success');
  };

  const handleViewRanking = () => {
    setCurrentPage('ranking');
  };

  const handleBackToRegister = () => {
    setCurrentPage('register');
    setRegisteredPlayer(null);
  };

  if (currentPage === 'success' && registeredPlayer) {
    return (
      <SuccessPage
        player={registeredPlayer}
        onViewRanking={handleViewRanking}
      />
    );
  }

  if (currentPage === 'ranking') {
    return (
      <RankingPage onBack={handleBackToRegister} />
    );
  }

  return (
    <PreRegisterForm onSuccess={handleRegistrationSuccess} />
  );
};

export default Index;
