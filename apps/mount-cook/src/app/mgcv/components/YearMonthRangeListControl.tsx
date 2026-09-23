import { useFormInputNodes } from '@/app/mgcv/hooks/useFormInputNodes';
import { YearMonthRangeListControl as RangeListControl } from 'np-westland';
import type { YearMonthRange } from 'np-westland/types';
import { toYearMonth } from 'np-westland/utils';

export default function YearMonthRangeListControl() {
  const { isPending, error, data, isFetching } = useFormInputNodes(1);
  const ranges: YearMonthRange[] = (data ?? []).map((node) => ({
    start: toYearMonth(
      node.fieldInputs.find((input) => input.field_id === 1)?.value
    ),
    end: toYearMonth(
      node.fieldInputs.find((input) => input.field_id === 2)?.value
    ),
  }));

  return (
    <RangeListControl
      ranges={ranges}
      isPending={isPending}
      isFetching={isFetching}
      error={error?.message}
    />
  );
}
