'use client';

import { useState, useEffect } from 'react';
import { type Address } from 'viem';
import { getCreatorStats, type CreatorStats } from '@/lib/contract';

interface Tip {
  from: string;
  amount: string;
  timestamp: number;
  message?: string;
}

interface TipHistoryProps {
  address: string;
}

export function TipHistory({ address }: TipHistoryProps) {
  const [stats, setStats] = useState<CreatorStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [recentTips, setRecentTips] = useState<Tip[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const creatorStats = await getCreatorStats(address as Address);
        setStats(creatorStats);
        
        // Fetch real tip history from the indexer database
        const response = await fetch(`/api/tips/history?recipient=${address}&limit=20`);
        if (response.ok) {
          const data = await response.json();
          setRecentTips(data.tips.map((tip: any) => ({
            from: tip.sender,
            amount: (parseInt(tip.amount) / 1e18).toFixed(6),
            timestamp: tip.timestamp,
            message: tip.message,
          })));
        }
      } catch (error) {
        console.error('Failed to fetch tip history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [address]);

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-[var(--color-surface-light)] rounded-xl w-1/2"></div>
        <div className="space-y-3">
          <div className="h-16 bg-[var(--color-surface-light)] rounded-xl"></div>
          <div className="h-16 bg-[var(--color-surface-light)] rounded-xl"></div>
          <div className="h-16 bg-[var(--color-surface-light)] rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats Summary */}
      {stats && (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[var(--color-surface-light)] rounded-xl p-4 text-center">
            <div className="text-2xl font-bold gradient-text">
              {parseFloat(stats.totalTips).toFixed(4)}
            </div>
            <div className="text-slate-400 text-xs">ETH Received</div>
          </div>
          <div className="bg-[var(--color-surface-light)] rounded-xl p-4 text-center">
            <div className="text-2xl font-bold gradient-text">
              {stats.tipCount}
            </div>
            <div className="text-slate-400 text-xs">Total Tips</div>
          </div>
        </div>
      )}

      {/* Recent Tips Section */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
          <span>📜</span>
          Recent Tips
        </h3>
        
        {recentTips.length > 0 ? (
          <div className="space-y-3">
            {recentTips.map((tip, index) => (
              <div
                key={index}
                className="bg-[var(--color-surface-light)] rounded-xl p-4 border border-white/10 hover:border-purple-500/30 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm">
                      💜
                    </div>
                    <div>
                      <div className="font-medium text-sm">
                        {tip.from}
                      </div>
                      <div className="text-xs text-slate-500">
                        {formatTimeAgo(tip.timestamp)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-purple-400">
                      {tip.amount} ETH
                    </div>
                    {tip.message && (
                      <div className="text-xs text-slate-400 mt-1 max-w-[150px] truncate">
                        "{tip.message}"
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[var(--color-surface-light)] rounded-xl p-6 text-center border border-white/10">
            <div className="text-3xl mb-2">🎁</div>
            <div className="text-slate-400 text-sm">
              No tips yet. Share your tip jar to get started!
            </div>
          </div>
        )}
      </div>

      {/* All-time stats */}
      {stats && (
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-500/20">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Average tip</span>
            <span className="font-semibold">
              {stats.tipCount > 0 
                ? (parseFloat(stats.totalTips) / stats.tipCount).toFixed(5)
                : '0'
              } ETH
            </span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-slate-400">Protocol fee (2%)</span>
            <span className="font-semibold text-purple-400">
              {(parseFloat(stats.totalTips) * 0.02).toFixed(6)} ETH
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  
  return new Date(timestamp).toLocaleDateString();
}
