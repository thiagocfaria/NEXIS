import { RouteLoading } from "@/components/route-loading";

export default function Loading() {
  return (
    <RouteLoading
      description="Verificando produtos abaixo do estoque minimo."
      listLabel="Carregando produtos"
      title="Estoque baixo"
    />
  );
}
