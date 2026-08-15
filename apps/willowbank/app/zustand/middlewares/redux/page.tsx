"use client";

import { ChangeEvent, useRef } from "react";
import { useStore } from "zustand";
import { devtools, redux } from "zustand/middleware";
import { createStore } from "zustand/vanilla";

type PersonStoreState = {
  firstName: string;
  lastName: string;
  email: string;
};

type PersonStoreAction =
  | {
      type: "person/setFirstName";
      firstName: string;
    }
  | {
      type: "person/setLastName";
      lastName: string;
    }
  | {
      type: "person/setEmail";
      email: string;
    };

type PersonStore = PersonStoreState & {
  dispatch: (action: PersonStoreAction) => PersonStoreAction;
};

const personStoreReducer = (
  state: PersonStoreState,
  action: PersonStoreAction,
) => {
  switch (action.type) {
    case "person/setFirstName": {
      return { ...state, firstName: action.firstName };
    }
    case "person/setLastName": {
      return { ...state, lastName: action.lastName };
    }
    case "person/setEmail": {
      return { ...state, email: action.email };
    }
    default: {
      return state;
    }
  }
};

const personStoreInitialState: PersonStoreState = {
  firstName: "Barbara",
  lastName: "Hepworth",
  email: "bhepworth@sculpture.com",
};

const personStore = createStore<PersonStore>()(
  devtools(redux(personStoreReducer, personStoreInitialState)),
);

export default function Page() {
  const firstNameInput = useRef<HTMLInputElement | null>(null);
  const lastNameInput = useRef<HTMLInputElement | null>(null);
  const emailInput = useRef<HTMLInputElement | null>(null);
  const firstName = useStore(personStore, (state) => state.firstName);
  const lastName = useStore(personStore, (state) => state.lastName);
  const email = useStore(personStore, (state) => state.email);
  const result = `${firstName} ${lastName} ${email}`;

  function handleFirstNameChange(event: ChangeEvent) {
    personStore.dispatch({
      type: "person/setFirstName",
      firstName: (event.target as any).value,
    });
  }

  function handleLastNameChange(event: ChangeEvent) {
    personStore.dispatch({
      type: "person/setLastName",
      lastName: (event.target as any).value,
    });
  }

  function handleEmailChange(event: ChangeEvent) {
    personStore.dispatch({
      type: "person/setEmail",
      email: (event.target as any).value,
    });
  }

  return (
    <div>
      <label style={{ display: "block" }}>
        First name:
        <input
          ref={firstNameInput}
          id="first-name"
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label style={{ display: "block" }}>
        Last name:
        <input
          ref={lastNameInput}
          id="last-name"
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <label style={{ display: "block" }}>
        Email:
        <input
          ref={emailInput}
          id="email"
          value={email}
          onChange={handleEmailChange}
        />
      </label>
      <p>{result}</p>
    </div>
  );
}
