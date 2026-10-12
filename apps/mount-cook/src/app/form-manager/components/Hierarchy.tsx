import type { Nullable } from 'np-westland/types';
import { useEffect, useRef, useState } from 'react';
import { Tree } from 'react-arborist';
import type { ADSOccurrence } from '../types';

export default function Hierarchy({
  nodes,
  selected,
  onSelect,
}: {
  nodes: ADSOccurrence[];
  selected: Nullable<ADSOccurrence>;
  onSelect: (node: ADSOccurrence) => void;
}) {
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(400);
  useEffect(() => {
    if (!ref.current) {
      return;
    }
    const observer = new ResizeObserver(([entry]) => {
      setHeight(Math.max(1, entry.contentRect.height));
    });
    observer.observe(ref.current);
    return () => {
      observer.disconnect();
    };
  }, []);
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="p-3">
        <input
          aria-label="Search forms and slots"
          placeholder="Search forms and slots…"
          className="w-full rounded-md border px-3 py-2 text-sm"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
          }}
        />
      </div>
      <div ref={ref} className="min-h-0 flex-1" aria-label="Form hierarchy">
        <Tree<ADSOccurrence>
          data={nodes}
          width="100%"
          height={height}
          rowHeight={38}
          indent={18}
          openByDefault={false}
          disableDrag
          disableDrop
          disableEdit
          disableMultiSelection
          disableDeselectOnClick
          selection={selected?.id}
          searchTerm={search}
          searchMatch={(node, term) =>
            node.data.name.toLowerCase().includes(term.toLowerCase())
          }
          onSelect={(nodes) => {
            if (nodes[0]) {
              onSelect(nodes[0].data);
            }
          }}
        >
          {({ node, style }) => (
            <div
              style={style}
              title={`${node.data.name}${node.data.cycle ? ' (cycle; expansion stopped)' : ''}`}
              className={`flex h-full items-center gap-2 pr-3 text-sm ${node.isSelected ? 'bg-indigo-50 text-indigo-800' : 'text-slate-700'} ${node.isFocused ? 'outline outline-1 -outline-offset-1 outline-indigo-400' : ''}`}
            >
              <button
                type="button"
                tabIndex={-1}
                aria-label={node.isOpen ? 'Collapse form' : 'Expand form'}
                disabled={node.isLeaf}
                className="w-5 shrink-0 disabled:opacity-30"
                onClick={(event) => {
                  event.stopPropagation();
                  node.toggle();
                }}
              >
                {node.isLeaf ? '·' : node.isOpen ? '▾' : '▸'}
              </button>
              <span className="truncate">{node.data.name}</span>
              <span className="ml-auto shrink-0 text-xs text-slate-400">
                {node.data.cycle
                  ? 'Cycle'
                  : node.data.form.type === 'composite_form'
                    ? 'Composite'
                    : 'Simple'}
              </span>
            </div>
          )}
        </Tree>
      </div>
    </div>
  );
}
