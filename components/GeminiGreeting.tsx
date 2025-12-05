import React, { useEffect, useState } from 'react';
import { getDailyInsight } from '../services/geminiService';
import { Sparkles, RefreshCcw } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface GeminiGreetingProps {
  userName: string;
}

const GeminiGreeting: React.FC<GeminiGreetingProps> = ({ userName }) => {
  const [greeting, setGreeting] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  const fetchGreeting = async () => {
    if (!process.env.API_KEY) {
        setGreeting(t.goodDay.replace('{name}', userName));
        return;
    }

    setLoading(true);
    // Simple caching mechanism in session storage to avoid burning tokens on every tab open
    const cached = sessionStorage.getItem('gemini_greeting');
    if (cached) {
      setGreeting(cached);
      setLoading(false);
      return;
    }

    const text = await getDailyInsight(userName);
    sessionStorage.setItem('gemini_greeting', text);
    setGreeting(text);
    setLoading(false);
  };

  const refreshGreeting = async (e: React.MouseEvent) => {
      e.stopPropagation();
      sessionStorage.removeItem('gemini_greeting');
      await fetchGreeting();
  }

  useEffect(() => {
    fetchGreeting();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userName]);

  return (
    <div className="flex items-center justify-center gap-2 animate-fade-in-up">
      <div className="bg-glass backdrop-blur-sm px-4 py-1.5 rounded-full border border-glassBorder text-white/90 text-xs sm:text-sm font-medium flex items-center gap-2 shadow-sm group">
        <Sparkles size={12} className="text-yellow-300" />
        {loading ? (
            <span className="animate-pulse">{t.consultingStars}</span>
        ) : (
            <span>{greeting}</span>
        )}
        <button onClick={refreshGreeting} className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 hover:text-blue-300">
            <RefreshCcw size={10} />
        </button>
      </div>
    </div>
  );
};

export default GeminiGreeting;