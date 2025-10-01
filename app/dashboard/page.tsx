"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain as Train, TrendingUp, Wrench, ClipboardList, Activity, Sparkles, Plus, CreditCard as Edit, Trash2, ChevronDown, ChevronUp, CirclePlay as PlayCircle, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockTrains, mockJobCards } from '@/lib/mock-data';
import type { Train as TrainType, JobCard, AIAllocation } from '@/lib/types';
import { SummaryCards } from '@/components/dashboard/summary-cards';
import { TrainCard } from '@/components/dashboard/train-card';
import { JobCardTable } from '@/components/dashboard/job-card-table';
import { AIPlanner } from '@/components/dashboard/ai-planner';
import { ChartsSection } from '@/components/dashboard/charts-section';
import { WhatIfSimulator } from '@/components/dashboard/what-if-simulator';

export default function DashboardPage() {
  const router = useRouter();
  const [trains, setTrains] = useState<TrainType[]>(mockTrains);
  const [jobCards, setJobCards] = useState<JobCard[]>(mockJobCards);
  const [expandedTrain, setExpandedTrain] = useState<string | null>(null);
  const [simulatedTrains, setSimulatedTrains] = useState<TrainType[]>(mockTrains);
  const [autoRunAI, setAutoRunAI] = useState(false);

  const stats = {
    totalTrains: trains.length,
    activeTrains: trains.filter(t => t.status === 'Run').length,
    standbyTrains: trains.filter(t => t.status === 'Standby').length,
    maintenanceTrains: trains.filter(t => t.status === 'Maintenance').length,
    pendingJobCards: jobCards.filter(j => j.status === 'Pending').length,
  };

  const handleTrainClick = (trainId: string) => {
    setExpandedTrain(expandedTrain === trainId ? null : trainId);
  };

  const handleAddJobCard = () => {
    const newJobCard: JobCard = {
      id: `${jobCards.length + 1}`,
      jobCardId: `JC-${String(jobCards.length + 1).padStart(3, '0')}`,
      trainId: trains[0].trainId,
      taskType: 'Maintenance',
      priority: 'Medium',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Pending',
      description: 'New task',
    };
    setJobCards([...jobCards, newJobCard]);
  };

  const handleDeleteJobCard = (id: string) => {
    setJobCards(jobCards.filter(jc => jc.id !== id));
  };

  const handleSimulationChange = (trainId: string, overrides: Partial<TrainType>) => {
    const updatedTrains = trains.map(train =>
      train.trainId === trainId ? { ...train, ...overrides } : train
    );
    setSimulatedTrains(updatedTrains);
    setAutoRunAI(true);
    setTimeout(() => setAutoRunAI(false), 100);
  };

  const handleResetSimulation = () => {
    setSimulatedTrains(trains);
    setAutoRunAI(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A] relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB4PSIyMCIgeT0iMzAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI0MCIgcng9IjgiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMDMiLz48Y2lyY2xlIGN4PSIzNSIgY3k9IjUwIiByPSI0IiBmaWxsPSIjZmZmIiBvcGFjaXR5PSIwLjAzIi8+PGNpcmNsZSBjeD0iNjUiIGN5PSI1MCIgcj0iNCIgZmlsbD0iI2ZmZiIgb3BhY2l0eT0iMC4wMyIvPjwvc3ZnPg==')] opacity-5"></div>

      <div className="relative z-10 container mx-auto px-4 py-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Train className="h-10 w-10 text-blue-400" />
                <h1 className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-5xl font-bold text-transparent">
                  Metro Control Dashboard
                </h1>
              </div>
              <p className="text-gray-300 text-lg">Real-time Train Management & Operations Center</p>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => router.push('/reports')}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-all"
              >
                <FileText className="h-4 w-4 mr-2" />
                View Reports
              </Button>
            </motion.div>
          </div>
        </motion.div>

        <SummaryCards stats={stats} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Train className="h-6 w-6 text-blue-400" />
              <h2 className="text-2xl font-bold text-white">Train Fleet Status</h2>
            </div>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#38B000]"></div>
                <span className="text-gray-200">Run</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FFD60A]"></div>
                <span className="text-gray-200">Standby</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF4747]"></div>
                <span className="text-gray-200">Maintenance</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {trains.map((train, index) => (
              <TrainCard
                key={train.id}
                train={train}
                index={index}
                isExpanded={expandedTrain === train.id}
                onToggle={() => handleTrainClick(train.id)}
              />
            ))}
          </div>
        </motion.div>

        <JobCardTable
          jobCards={jobCards}
          trains={trains}
          onAdd={handleAddJobCard}
          onDelete={handleDeleteJobCard}
        />

        <WhatIfSimulator
          trains={trains}
          onSimulationChange={handleSimulationChange}
          onReset={handleResetSimulation}
        />

        <AIPlanner trains={simulatedTrains} autoRun={autoRunAI} />

        <ChartsSection trains={simulatedTrains} />
      </div>
    </div>
  );
}
