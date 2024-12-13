import { useState, useEffect } from "react";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { Channel, Program } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Calendar, 
  Clock, 
  Film, 
  Tv, 
  Music, 
  Trophy, 
  Globe, 
  BookOpen,
  Baby,
  Theater,
  Radio,
  X
} from "lucide-react";

interface GuideTVProps {
  channels: Channel[];
  isVisible: boolean;
  onClose: () => void;
}

export function GuideTV({ channels, isVisible, onClose }: GuideTVProps) {
  const [, setLocation] = useLocation();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editMode, setEditMode] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [customPrograms, setCustomPrograms] = useState<Record<string, Program[]>>(() => {
    const saved = localStorage.getItem('customPrograms');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('customPrograms', JSON.stringify(customPrograms));
  }, [customPrograms]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "1234") {
      setEditMode(true);
      setShowPasswordModal(false);
      setPassword("");
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  // Génération et gestion des programmes
  const generatePrograms = (channel: Channel): Program[] => {
    // Si des programmes personnalisés existent pour cette chaîne, les utiliser
    if (customPrograms[channel.id]) {
      return customPrograms[channel.id];
    }

    const programs: Program[] = [];
    let currentTime = new Date();
    
    const categories = [
      "Films", "Séries", "Sport", "Information", "Documentaire", 
      "Divertissement", "Jeunesse", "Culture", "Musique", "Télé-réalité"
    ];
    
    const categoryIcons = {
      "Films": Film,
      "Séries": Tv,
      "Sport": Trophy,
      "Information": Globe,
      "Documentaire": BookOpen,
      "Divertissement": Theater,
      "Jeunesse": Baby,
      "Culture": Radio,
      "Musique": Music
    };
    
    const titles = {
      "Films": [
        "Le Grand Film", "Action Totale", "Comédie du Soir", "Drame Passionné",
        "Aventure Spatiale", "Romance d'Été", "Thriller Nocturne", "Western Moderne"
      ],
      "Séries": [
        "Les Aventuriers", "Enquêtes Spéciales", "La Famille", "Docteur Urgences",
        "Police Scientifique", "Histoires Parallèles", "Le Bureau", "Café des Secrets"
      ],
      "Sport": [
        "Match de Football", "Tennis en Direct", "Basketball Championship", "Sports Extrêmes",
        "Rugby Elite", "F1 Grand Prix", "Boxe Championship", "Athlétisme Elite"
      ],
      "Information": [
        "Journal TV", "Enquêtes et Reportages", "Magazine d'Investigation",
        "Débat du Jour", "Edition Spéciale", "Le Point", "7 Jours en France"
      ],
      "Documentaire": [
        "Nature Sauvage", "Histoire Mondiale", "Sciences et Découvertes",
        "Voyage Culinaire", "Secrets de l'Univers", "Tech & Futur", "Civilisations"
      ],
      "Divertissement": [
        "Le Grand Show", "Jeux et Quiz", "Télé-Réalité", "Karaoké Star",
        "Talent Show", "Top Chef", "Les Stars en Cuisine", "Danse avec les Stars"
      ],
      "Jeunesse": [
        "Dessins Animés", "Club des Enfants", "Aventures Animées",
        "Les Mini-héros", "École des Découvertes", "Jeux & Cie", "Les Petits Génies"
      ],
      "Culture": [
        "Arts et Culture", "Musique Live", "Théâtre et Spectacles",
        "Expo Mondiale", "Festival Jazz", "Opéra Classic", "Danse Contemporaine"
      ]
    };
    
    for (let i = 0; i < 5; i++) {
      const startTime = new Date(currentTime);
      const endTime = new Date(startTime.getTime() + (Math.random() * 2 + 1) * 60 * 60 * 1000);
      const category = channel.group || categories[Math.floor(Math.random() * categories.length)];
      const titlesList = titles[category as keyof typeof titles] || titles["Divertissement"];
      const title = titlesList[Math.floor(Math.random() * titlesList.length)];
      
      programs.push({
        id: crypto.randomUUID(),
        title,
        description: `Ne manquez pas ${title} sur ${channel.name}. Un programme exclusif sélectionné spécialement pour vous.`,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        category,
        thumbnail: channel.logo
      });
      
      currentTime = endTime;
    }
    
    return programs;
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "100%" }}
          transition={{ 
            type: "spring",
            stiffness: 100,
            damping: 20,
            mass: 1
          }}
          className="fixed inset-0 bg-gradient-to-br from-black/90 via-black/85 to-purple-900/80 backdrop-blur-sm z-50 overflow-hidden flex flex-col"
        >
          <div className="flex items-center justify-between p-4 bg-black/40">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="hover:bg-pink-500/20"
              >
                <Calendar className="w-6 h-6 text-pink-400" />
              </Button>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-pink-600 bg-clip-text text-transparent">
                Guide des Programmes
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (editMode) {
                    setEditMode(false);
                  } else {
                    setShowPasswordModal(true);
                  }
                }}
                className={`${editMode ? 'bg-pink-500/20' : ''} hover:bg-pink-500/30`}
              >
                {editMode ? 'Terminer l\'édition' : 'Modifier les programmes'}
              </Button>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-pink-400" />
                <span className="text-pink-200">
                  {format(selectedDate, "EEEE d MMMM", { locale: fr })}
                </span>
              </div>
            </div>
          </div>

          {/* Modal de mot de passe */}
          <AnimatePresence>
            {showPasswordModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    setShowPasswordModal(false);
                    setPassword("");
                    setPasswordError(false);
                  }
                }}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-background p-6 rounded-lg w-full max-w-md relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setShowPasswordModal(false);
                      setPassword("");
                      setPasswordError(false);
                    }}
                    className="absolute right-2 top-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  
                  <h3 className="text-xl font-semibold mb-4">Authentification requise</h3>
                  <form onSubmit={handlePasswordSubmit}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Mot de passe administrateur
                        </label>
                        <Input
                          type="password"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            setPasswordError(false);
                          }}
                          className={`w-full ${passwordError ? 'border-red-500' : ''}`}
                          placeholder="Entrez le mot de passe"
                        />
                        {passwordError && (
                          <p className="text-red-500 text-sm mt-1">
                            Mot de passe incorrect
                          </p>
                        )}
                      </div>
                      <Button type="submit" className="w-full">
                        Valider
                      </Button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Modal d'édition de programme */}
          {editingProgram && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-background p-6 rounded-lg w-full max-w-md"
              >
                <h3 className="text-xl font-semibold mb-4">Modifier le programme</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Titre</label>
                    <input
                      type="text"
                      value={editingProgram.title}
                      onChange={(e) => setEditingProgram({ ...editingProgram, title: e.target.value })}
                      className="w-full p-2 bg-white/10 rounded-md border border-white/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      value={editingProgram.description}
                      onChange={(e) => setEditingProgram({ ...editingProgram, description: e.target.value })}
                      className="w-full p-2 bg-white/10 rounded-md border border-white/20 h-24"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Heure de début</label>
                      <input
                        type="time"
                        value={format(new Date(editingProgram.startTime), "HH:mm")}
                        onChange={(e) => {
                          const [hours, minutes] = e.target.value.split(':');
                          const date = new Date(editingProgram.startTime);
                          date.setHours(parseInt(hours), parseInt(minutes));
                          setEditingProgram({ ...editingProgram, startTime: date.toISOString() });
                        }}
                        className="w-full p-2 bg-white/10 rounded-md border border-white/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Heure de fin</label>
                      <input
                        type="time"
                        value={format(new Date(editingProgram.endTime), "HH:mm")}
                        onChange={(e) => {
                          const [hours, minutes] = e.target.value.split(':');
                          const date = new Date(editingProgram.endTime);
                          date.setHours(parseInt(hours), parseInt(minutes));
                          setEditingProgram({ ...editingProgram, endTime: date.toISOString() });
                        }}
                        className="w-full p-2 bg-white/10 rounded-md border border-white/20"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-6">
                    <Button
                      variant="ghost"
                      onClick={() => setEditingProgram(null)}
                    >
                      Annuler
                    </Button>
                    <Button
                      onClick={() => {
                        const channelId = channels.find(c => 
                          c.programs?.some(p => p.id === editingProgram.id)
                        )?.id;
                        
                        if (channelId) {
                          const updatedPrograms = customPrograms[channelId]?.map(p =>
                            p.id === editingProgram.id ? editingProgram : p
                          ) || [editingProgram];
                          
                          setCustomPrograms({
                            ...customPrograms,
                            [channelId]: updatedPrograms
                          });
                        }
                        setEditingProgram(null);
                      }}
                    >
                      Enregistrer
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid gap-6"
            >
              {channels.map((channel) => (
                <motion.div
                  key={channel.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white/5 rounded-lg overflow-hidden backdrop-blur-sm border border-white/10"
                >
                  <div className="p-4 bg-gradient-to-r from-pink-500/20 to-purple-500/20 flex items-center space-x-4">
                    {channel.logo ? (
                      <img
                        src={channel.logo}
                        alt={channel.name}
                        className="w-12 h-12 object-contain rounded-lg bg-black/40 p-1"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-pink-500/20 flex items-center justify-center">
                        <Tv className="w-6 h-6 text-pink-400" />
                      </div>
                    )}
                    <h3 className="text-lg font-semibold text-white">{channel.name}</h3>
                  </div>

                  <div className="p-4">
                    {generatePrograms(channel).map((program) => (
                      <motion.div
                        key={program.id}
                        whileHover={{ scale: 1.02 }}
                        className="py-2 border-b border-white/10 last:border-0 relative group"
                      >
                        {editMode ? (
                          <div className="absolute right-0 top-0 space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingProgram(program);
                              }}
                              className="text-pink-400 hover:text-pink-300"
                            >
                              Modifier
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const updatedPrograms = customPrograms[channel.id].filter(p => p.id !== program.id);
                                setCustomPrograms({
                                  ...customPrograms,
                                  [channel.id]: updatedPrograms
                                });
                              }}
                              className="text-red-400 hover:text-red-300"
                            >
                              Supprimer
                            </Button>
                          </div>
                        ) : null}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Film className="w-4 h-4 text-pink-400" />
                            <span className="text-white/90">{program.title}</span>
                          </div>
                          <span className="text-sm text-pink-300">
                            {format(new Date(program.startTime), "HH:mm")} - 
                            {format(new Date(program.endTime), "HH:mm")}
                          </span>
                        </div>
                        {program.description && (
                          <p className="mt-1 text-sm text-white/60 ml-7">
                            {program.description}
                          </p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
