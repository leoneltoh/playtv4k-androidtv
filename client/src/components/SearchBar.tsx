import { useState } from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-xl mx-auto mb-8"
      onSubmit={handleSubmit}
    >
      <div className="relative group">
        <Input
          type="text"
          placeholder="Rechercher une chaîne..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full pl-12 h-12 bg-white/10 backdrop-blur-sm border-white/20 focus:border-pink-500/50 hover:border-pink-500/30 transition-all duration-500 rounded-xl shadow-lg shadow-pink-500/10 focus:shadow-pink-500/20"
        />
        <motion.div
          className="absolute left-3 top-1/2 transform -translate-y-1/2"
          animate={{
            scale: value ? 0.9 : 1,
            rotate: value ? [0, -10, 10, -10, 0] : 0
          }}
          transition={{ duration: 0.3 }}
        >
          <Search className="text-pink-500/50 group-hover:text-pink-500/70 transition-colors duration-300" size={24} />
        </motion.div>
        {value && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-pink-300/70"
          >
            Appuyez sur Entrée pour rechercher
          </motion.div>
        )}
      </div>
    </motion.form>
  );
}
