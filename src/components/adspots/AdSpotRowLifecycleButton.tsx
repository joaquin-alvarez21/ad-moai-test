'use client';

import { memo, useState } from 'react';
import type { AdSpot } from '@/lib/types/adspot';
import { Button } from '@/components/ui/button';
import { TableCell } from '@/components/ui/table';
import { AdSpotLifecycleModal } from './AdSpotLifecycleModal';
import { History } from 'lucide-react';

/**
 * Componente Client Component para mostrar un botón que abre el modal de ciclo de vida.
 * 
 * Usa React.memo para evitar re-renders innecesarios.
 * 
 * @param adSpot - El AdSpot para el cual mostrar el botón
 */
export const AdSpotRowLifecycleButton = memo(function AdSpotRowLifecycleButton({
  adSpot,
}: {
  adSpot: AdSpot;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableCell>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setOpen(true)}
          className="gap-2"
        >
          <History className="h-4 w-4" />
          Ver timeline
        </Button>
      </TableCell>
      <AdSpotLifecycleModal
        adSpot={adSpot}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
});

