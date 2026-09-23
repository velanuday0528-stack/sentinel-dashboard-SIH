'use client';

import React from 'react';
import { useSentinel } from '@/context/sentinel-context';
import { Header } from '@/components/dashboard/header';
import { HeroSection } from '@/components/dashboard/hero-section';
import { OverviewView } from '@/components/dashboard/overview-view';
import { EnvironmentalView } from '@/components/dashboard/environmental-view';
import { IcingRiskView } from '@/components/dashboard/icing-risk-view';
import { AntiIcingView } from '@/components/dashboard/anti-icing-view';
import { AntennaHealthView } from '@/components/dashboard/antenna-health-view';
import { SafetyAlertsView } from '@/components/dashboard/safety-alerts-view';
import { EventLogsView } from '@/components/dashboard/event-logs-view';
import { SystemSettingsView } from '@/components/dashboard/system-settings-view';
import { ScenarioRunnerModal } from '@/components/dashboard/scenario-runner-modal';
import { SiteFooter } from '@/components/footer';

export default function Page() {
  const { activeTab } = useSentinel();

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Header & Navigation */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-8">
        {/* Render Views based on Active Tab */}
        {activeTab === 'overview' && (
          <>
            <HeroSection />
            <OverviewView />
          </>
        )}

        {activeTab === 'environmental' && <EnvironmentalView />}
        {activeTab === 'icing-risk' && <IcingRiskView />}
        {activeTab === 'anti-icing' && <AntiIcingView />}
        {activeTab === 'antenna-health' && <AntennaHealthView />}
        {activeTab === 'safety-alerts' && <SafetyAlertsView />}
        {activeTab === 'event-logs' && <EventLogsView />}
        {activeTab === 'system-settings' && <SystemSettingsView />}
      </main>

      {/* Interactive Scenario Runner Modal */}
      <ScenarioRunnerModal />

      {/* Site Footer */}
      <SiteFooter />
    </div>
  );
}
