'use client';

import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { createAdSpotAction } from '@/app/(app)/adspots/actions';
import { adSpotCreateSchema } from '@/lib/validators/adspot';
import type { AdSpotCreatePayload } from '@/lib/types/adspot';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTransition } from 'react';

/**
 * Componente de formulario para crear un nuevo AdSpot (Client Component).
 * 
 * Utiliza react-hook-form con yup para validación y los componentes de shadcn
 * para el formulario. Muestra toasts para éxito/error y redirige a la lista
 * después de crear exitosamente.
 * 
 * @example
 * ```tsx
 * <AdSpotForm />
 * ```
 */
export function AdSpotForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<AdSpotCreatePayload>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(adSpotCreateSchema) as any,
    defaultValues: {
      title: '',
      imageUrl: '',
      placement: undefined,
      ttlMinutes: undefined,
    },
  });

  /**
   * Maneja el envío del formulario.
   * Convierte los valores del formulario a FormData y llama a la Server Action.
   * 
   * Nota: Se usa async/await dentro de startTransition, lo cual es soportado
   * para Server Actions. El estado isPending se rastrea automáticamente mientras
   * la promesa de la Server Action esté pendiente.
   */
  const onSubmit: SubmitHandler<AdSpotCreatePayload> = async (values) => {
    // Convertir los valores a FormData para mantener compatibilidad con la Server Action
    const formData = new FormData();
    formData.set('title', values.title);
    formData.set('imageUrl', values.imageUrl);
    formData.set('placement', values.placement);
    if (values.ttlMinutes !== undefined && values.ttlMinutes !== null) {
      formData.set('ttlMinutes', values.ttlMinutes.toString());
    }

    startTransition(async () => {
      const result = await createAdSpotAction(formData);

      if (result.success) {
        toast.success('¡Anuncio creado exitosamente!', {
          description: `"${result.data.title}" ha sido agregado a la lista de anuncios.`,
          duration: 4000,
        });
        // Usar router.push con refresh para asegurar datos actualizados
        router.push('/adspots');
        router.refresh();
      } else {
        // Mostrar error específico y amigable
        const errorMessage = result.error || 'No se pudo crear el anuncio. Por favor, intenta nuevamente.';
        toast.error('Error al crear el anuncio', {
          description: errorMessage,
          duration: 5000,
        });
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Campo: Título */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Título <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Ej: Promoción Verano 2024"
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                El título aparecerá en el anuncio. Usa un nombre descriptivo y atractivo.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo: URL de la imagen */}
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                URL de la imagen <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                La imagen debe estar disponible públicamente en internet. Asegúrate de que la URL sea accesible.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo: Placement */}
        <FormField
          control={form.control}
          name="placement"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Placement <span className="text-destructive">*</span>
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={isPending}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un placement" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="home_screen">Home Screen</SelectItem>
                  <SelectItem value="ride_summary">Ride Summary</SelectItem>
                  <SelectItem value="map_view">Map View</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Selecciona en qué parte de la aplicación móvil se mostrará este anuncio.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo: TTL (opcional) */}
        <FormField
          control={form.control}
          name="ttlMinutes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>TTL (minutos)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Ej: 60"
                  min="1"
                  step="1"
                  disabled={isPending}
                  {...field}
                  value={field.value ?? ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value === '' ? undefined : Number(value));
                  }}
                />
              </FormControl>
              <FormDescription>
                Tiempo de vida en minutos desde la creación. Si se deja vacío, el anuncio permanecerá activo indefinidamente.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Botones de acción */}
        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/adspots')}
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? 'Creando...' : 'Crear AdSpot'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

