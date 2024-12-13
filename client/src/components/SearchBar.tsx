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
      <div className="relative">
        <Input
          type="text"
          placeholder="Rechercher une chaîne..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full pl-10 bg-white/10 backdrop-blur-sm border-white/20 focus:border-pink-500/50 transition-all duration-300"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={18} />
      </div>
    </motion.form>
  );
}
