import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ProgramForm } from "@/components/ProgramForm";
import { ProgramsList } from "@/components/ProgramsList";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isAddingProgram, setIsAddingProgram] = useState(false);
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLocation("/login");
    }
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast({
      title: "Déconnexion réussie",
      description: "À bientôt !",
    });
    setLocation("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500/20 to-purple-500/20">
      <header className="bg-black/40 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-pink-600 bg-clip-text text-transparent">
            Administration des Programmes
          </h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="hover:bg-pink-500/20"
          >
            <LogOut className="h-5 w-5 text-pink-400" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-end"
          >
            <Button
              onClick={() => setIsAddingProgram(true)}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
            >
              Ajouter un programme
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-black/40 backdrop-blur-sm rounded-lg border border-white/10 p-6"
          >
            <ProgramsList />
          </motion.div>
        </div>

        {isAddingProgram && (
          <ProgramForm
            onClose={() => setIsAddingProgram(false)}
            onSuccess={() => {
              setIsAddingProgram(false);
              toast({
                title: "Programme ajouté",
                description: "Le programme a été ajouté avec succès",
              });
            }}
          />
        )}
      </main>
    </div>
  );
}
