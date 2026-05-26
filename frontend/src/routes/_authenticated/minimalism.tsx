import { createFileRoute } from '@tanstack/react-router';
import HolographicGuide from '@/features/minimalism';

export const Route = createFileRoute('/_authenticated/minimalism')({
  component: HolographicGuide,
});
