import { formatISO, setDefaultOptions } from "date-fns";
import { ptBR } from "date-fns/locale";

setDefaultOptions({
  locale: ptBR,
});

export default function stripeFormatIsoDate(timestamp: number) {
  const dateFormatted = formatISO(timestamp * 1000);

  return dateFormatted;
}
