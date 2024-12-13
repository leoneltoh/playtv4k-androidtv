import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { motion } from "framer-motion";
import type { Program } from "@/lib/types";
import { Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProgramsList() {
  const { data: programs, isLoading } = useQuery<Program[]>({
    queryKey: ["programs"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/programs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des programmes");
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="h-24 bg-white/5 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!programs?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-white/60">Aucun programme pour le moment</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {programs.map((program) => (
        <motion.div
          key={program.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <h3 className="font-semibold text-white">{program.title}</h3>
              <p className="text-sm text-white/60">{program.description}</p>
              <div className="flex items-center gap-4 text-sm text-pink-400">
                <span>
                  {format(new Date(program.startTime), "d MMMM à HH:mm", { locale: fr })}
                </span>
                <span>→</span>
                <span>
                  {format(new Date(program.endTime), "d MMMM à HH:mm", { locale: fr })}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="hover:bg-pink-500/20">
                <Edit2 className="h-4 w-4 text-pink-400" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-pink-500/20">
                <Trash2 className="h-4 w-4 text-pink-400" />
              </Button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
