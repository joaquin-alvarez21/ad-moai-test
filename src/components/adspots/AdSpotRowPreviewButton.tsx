'use client';

import { memo, useState } from 'react';
import type { AdSpot } from '@/lib/types/adspot';
import { Button } from '@/components/ui/button';
import { TableCell } from '@/components/ui/table';
import { Eye } from 'lucide-react';
import { AdSpotPreviewModal } from './AdSpotPreviewModal';

/**
 * Componente Client Component para el botón de preview de un AdSpot.
 * 
 * Abre un modal que muestra cómo se vería el AdSpot en diferentes placements.
 * 
 * Usa React.memo para evitar re-renders innecesarios.
 * 
 * @param adSpot - El AdSpot para el cual mostrar el botón de preview
 */
export const AdSpotRowPreviewButton = memo(function AdSpotRowPreviewButton({
  adSpot,
}: {
  adSpot: AdSpot;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <TableCell>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="gap-2"
        >
          <Eye className="h-4 w-4" />
          Preview
        </Button>
      </TableCell>

      <AdSpotPreviewModal
        adSpot={adSpot}
        open={isOpen}
        onOpenChange={setIsOpen}
      />
    </>
  );
});

