import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Clock, TrendingUp, History } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ViewingStatsProps {
  isVisible: boolean;
  onClose: () => void;
}

export function ViewingStats({ isVisible, onClose }: ViewingStatsProps) {
  const [stats, setStats] = useState<Array<{ date: string; count: number }>>([]);
  const [totalTime, setTotalTime] = useState(0);
  
  useEffect(() => {
    const viewingStats = JSON.parse(localStorage.getItem('viewingStats') || '{}');
    const history = JSON.parse(localStorage.getItem('viewingHistory') || '[]');
    
    // Calculer le temps total de visionnage
    const total = history.reduce((acc: number, entry: any) => acc + (entry.duration || 0), 0);
    setTotalTime(total);
    
    // Préparer les données pour le graphique
    const chartData = Object.entries(viewingStats)
      .map(([date, count]) => ({
        date,
        count: Number(count)
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    setStats(chartData);
  }, [isVisible]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
      exit={{ opacity: 0, y: 50 }}
      className={`fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-lg p-6 rounded-t-3xl border-t border-white/10 transform transition-all duration-500 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <History className="w-6 h-6 text-pink-400" />
            Statistiques de visionnage
          </h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            Fermer
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-pink-400" />
              <h3 className="text-lg font-medium text-white">Temps total de visionnage</h3>
            </div>
            <p className="text-3xl font-bold text-pink-400">
              {Math.floor(totalTime / (1000 * 60 * 60))}h{' '}
              {Math.floor((totalTime % (1000 * 60 * 60)) / (1000 * 60))}m
            </p>
          </div>
          
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-pink-400" />
              <h3 className="text-lg font-medium text-white">Tendance de visionnage</h3>
            </div>
            {stats.length > 0 && (
              <p className="text-3xl font-bold text-pink-400">
                {stats[stats.length - 1].count} chaînes aujourd'hui
              </p>
            )}
          </div>
        </div>
        
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats}>
              <XAxis 
                dataKey="date" 
                tick={{ fill: '#fff' }}
                tickFormatter={(date) => format(new Date(date), 'dd MMM', { locale: fr })}
              />
              <YAxis tick={{ fill: '#fff' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.9)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: '#fff' }}
                formatter={(value: number) => [`${value} chaînes`, 'Visionnages']}
                labelFormatter={(date) => format(new Date(date), 'dd MMMM yyyy', { locale: fr })}
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#ec4899"
                strokeWidth={2}
                dot={{ fill: '#ec4899', strokeWidth: 2 }}
                activeDot={{ r: 8, fill: '#ec4899', stroke: '#fff' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}
