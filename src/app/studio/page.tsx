import React, { Suspense } from 'react';
import { StudioWorkspace } from '@/components/studio/StudioWorkspace';

export const metadata = {
  title: 'AI Video Studio - VisionStory Avatar, Agent, Podcast & Presentation',
  description:
    'Create lifelike V-Character 4.0 talking videos, multi-shot AI Agent videos, AI Music Videos, Face Swap, Seedance 2.5 clips, Podcasts, and Slide Presentations.',
};

export default function StudioPage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-secondary)' }}>
          Loading VisionStory Studio...
        </div>
      }
    >
      <StudioWorkspace />
    </Suspense>
  );
}
