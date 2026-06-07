import { RouteLoading } from "@/components/route-loading";

export default function Loading() {
  return (
    <RouteLoading
      description="Calculando indicadores e produtos mais vendidos."
      listLabel="Carregando ranking"
      title="Relatorios"
    />
  );
}
