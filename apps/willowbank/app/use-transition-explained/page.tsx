"use client";

import React, { useState, useTransition } from "react";

export default function Page() {
  const [name, setName] = useState<string>("");
  const [lists, setLists] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  const LIST_SIZE: number = 10_000;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setName(value);

    startTransition(() => {
      const dataList: string[] = [];
      for (let i: number = 0; i < LIST_SIZE; i++) {
        dataList.push(`${value}-${i}`);
      }
      setLists(dataList);
    });
  };

  return (
    <div>
      <input type="text" value={name} onChange={handleChange} />
      {isPending ? (
        <div>Loading...</div>
      ) : (
        lists.map((list: string) => {
          return <div key={list}>{list}</div>;
        })
      )}
    </div>
  );
}
