import { useEffect, useState } from 'react';
import { Truck } from 'lucide-react';
import { currencyFormatter } from '~/utils/formatters';
import { freeShippingService } from './freeShippingService';
import type { FreeShippingStatus } from './types';

interface FreeShippingBannerProps {
  authScope: boolean;
}

function formatCampaign(status: FreeShippingStatus) {
  if (status.elegivel && status.regra) {
    return `Você ganhou frete grátis: ${status.regra.nome}`;
  }

  const campaign = status.campanhas[0];
  if (!campaign) {
    return status.elegivel
      ? 'Frete grátis em toda a loja'
      : 'Frete grátis disponível';
  }

  if (campaign.tipo === 'valor_minimo_compra' && campaign.valor_minimo) {
    return `Frete grátis a partir de ${currencyFormatter.format(campaign.valor_minimo)}`;
  }
  if (campaign.tipo === 'pedidos_ultimos_dias') {
    return `Frete grátis para clientes frequentes nos últimos ${campaign.dias_considerados ?? 30} dias`;
  }
  if (campaign.tipo === 'pedidos_mes_atual') {
    return 'Frete grátis para clientes frequentes neste mês';
  }
  if (campaign.tipo === 'aniversario_dia') {
    return 'Frete grátis no dia do seu aniversário';
  }
  if (campaign.tipo === 'periodo_determinado') {
    return 'Frete grátis por tempo limitado';
  }

  return campaign.nome;
}

export function FreeShippingBanner({ authScope }: FreeShippingBannerProps) {
  const [status, setStatus] = useState<FreeShippingStatus | null>(null);

  useEffect(() => {
    let disposed = false;

    freeShippingService.getStatus()
      .then((response) => {
        if (!disposed) {
          setStatus(response);
        }
      })
      .catch(() => {
        if (!disposed) {
          setStatus(null);
        }
      });

    return () => {
      disposed = true;
    };
  }, [authScope]);

  if (!status?.ativo) {
    return null;
  }

  return (
    <div className="flex min-h-8 w-full items-center justify-center gap-2 bg-primary px-4 py-1.5 text-center text-[11px] font-semibold text-secondary">
      <Truck className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{formatCampaign(status)}</span>
    </div>
  );
}
