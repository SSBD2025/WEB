# 🚀 Projekt Frontendowy — Zasady Pracy

Ten dokument opisuje dobre praktyki i zasady pracy w naszym projekcie.

---

## 📂 1. Tworzenie funkcji API (`/api`)

Wszystkie funkcje do komunikacji z backendem (np. zapytania `GET`, `POST`, `PATCH`, `DELETE`) **dodajemy w folderze `/api`**.

✅ Dzięki temu:

- Mamy **porządek** w kodzie — wiemy, gdzie są wszystkie funkcje do zapytań.
- **Łatwo znaleźć** odpowiednią funkcję dla danego zasobu (users, posts, etc.).
- Możemy szybko aktualizować endpointy bez grzebania po całym projekcie.

---

### 📁 Struktura folderu `/api`

Przykład organizacji:

```bash
/src
  /api
    /auth
      login.api.ts
      register.api.ts
    /users
      get-users.api.ts
      create-user.api.ts
    /posts
      get-posts.api.ts
      create-post.api.ts
```

- Każdy **moduł** (np. `auth`, `users`, `posts`) ma własny folder.
- **Każdy endpoint** powinien mieć **osobny plik**.
- Nazwy plików trzymamy w formacie: **`co robi.api.ts`** (np. `create-user.api.ts`

---

### 🛠 Przykład funkcji API

```tsx
// /api/users/get-users.api.ts

import { axiosInstance } from "@/lib/axios"; // przygotowany axiosInstance

export const getUsers = async () => {
  const response = await axiosInstance.get("/users");
  return response.data;
};
```

> Uwaga: Nie rób od razu axios.get w komponencie! Zawsze twórz funkcję API osobno.
> 

---

### 🎯 Jak potem używać funkcji API?

```tsx
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/api/users/get-users.api";

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });
};
```

---

### 📋 Zasady dotyczące `/api`

- Funkcje API powinny być **czyste** — tylko zapytanie i zwrócenie `response.data`.
- Nazwy funkcji zawsze zaczynają się od czasownika: `getUsers`, `createPost`, `deleteUser`, itd.
- Jeśli API wymaga danych (`POST`, `PATCH`) — przekazuj dane jako argumenty funkcji.

Przykład:

```tsx
// /api/posts/create-post.api.ts
import { axiosInstance } from "@/lib/axios";

export const createPost = async (postData: { title: string; content: string }) => {
  const response = await axiosInstance.post("/posts", postData);
  return response.data;
};
```

---

### ✨ Podsumowanie

| ✔️ Co robić | ❌ Czego unikać |
| --- | --- |
| Funkcje API trzymamy w `/api` | Nie wrzucaj axiosa do komponentów |
| Każdy endpoint = osobny plik | Nie mieszaj loginu, rejestracji itp. w jednym pliku |
| Czyszczona `response.data` | Nie zwracaj całego response, bez potrzeby |

## 📦 2. Obsługa API z React Query

W projekcie mamy **globalną obsługę błędów i sukcesów** dzięki własnemu `QueryClient`.

### Jak działa automatyczna obsługa?

- **Wszelkie błędy** w zapytaniach (`useQuery`) i mutacjach (`useMutation`) są automatycznie łapane i pokazywane w `toast.error()`.
- **Udane mutacje** automatycznie wyświetlają `toast.success()`.

Nie musisz ręcznie łapać błędów w każdym miejscu!

### Przykład `useQuery`:

```tsx
// hooks/useUsers.ts
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/api/users.api";

export const useUsers = () => {
  const query = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  return {
    ...query,
    error: query.error
      ? {
          title: "Failed to fetch users",
          details: (query.error as Error).message,
        }
      : undefined,
  };
};
```

### Przykład `useMutation`:

```jsx
//hooks/useRegisterUser.ts
import { registerUser } from "@/api/auth.api";
import { axiosErrorHandler } from "@/lib/axiosErrorHandler";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
export const useRegisterUser = () => {
    return useMutation({
        mutationFn: registerUser,
        onError: (error) => axiosErrorHandler(error, "Failed to register user"),
        onSuccess: () => {
            toast.success("User registered successfully");
        }
    })
}
```

## 🧩 3. Komponenty UI — shadcn/ui

Używamy **biblioteki shadcn/ui** do budowania komponentów.

[Link do komponentów](https://ui.shadcn.com/docs/components/accordion) 

### Jak korzystać?

- Jeśli potrzebujesz nowego komponentu (np. nowy `Input`, `Card`, itp.):
    - Skorzystaj z `npx shadcn@latest add [nazwa]`

### Dobre praktyki:

- Jeśli zmieniasz style — zmieniaj tylko w jednym miejscu (`ui/`), żeby wszystko było spójne.

## 🛤️ 4. Routing — stałe ścieżki w constants/routes.ts

Ścieżki aplikacji trzymamy jako stałe w pliku `constants/routes.ts`.

### Przykład:

```tsx
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  PROFILE: (id: string) => `/profile/${id}`
};
```

### Jeśli dodajesz nową podstronę:

1. Dopisz nową ścieżkę do `ROUTES`.
2. Korzystaj potem w kodzie z `ROUTES.HOME`zamiast ręcznie pisać `"/"`.

✅ Dzięki temu później łatwo zmieniamy ścieżki w jednym miejscu!

## 📄 5. Stany ekranu — pusty ekran — constants/states.ts

Używamy domyślnych treści dla stanów pustych.

Plik: `constants/states.ts`

### Przykład:

```tsx
export const DEFAULT_EMPTY = {
  title: "Nic tutaj nie ma",
  message: "Wygląda na to, że jeszcze nic nie zostało dodane.",
};

export const DEFAULT_ERROR = {
  title: "Coś poszło nie tak",
  message: "Spróbuj ponownie później.",
};
```

### Jeśli chcesz dodać nowe stany:

1. Edytuj do pliku nową zmienną i napisz swoje teksty.
2. Ekrany korzystające z komponentu `DataRenderer` automatycznie pokażą nowe treści.

## ✨ 6. Używanie komponentu `DataRenderer`

Komponent `DataRenderer` pomaga w **ładnej obsłudze** 3 głównych stanów podczas pobierania danych:

- **Błąd** (Error),
- **Brak danych** (Empty),
- **Poprawne dane** (Success).

✅ Dzięki temu nie musisz pisać ręcznie trzech warunków `isError`, `isLoading`, `data.length === 0` w każdej stronie.

---

## Jak używać `DataRenderer`?

Przykład pobierania użytkowników:

```jsx
// pages/UsersPage.tsx
import { useUsers } from "@/hooks/useUsers";
import DataRenderer from "@/components/DataRenderer";
import { EMPTY_USERS } from "@/constants/states"

export const UsersPage = () => {
  const { status, error, data } = useUsers();

  return (
    <DataRenderer
      status={status}
      error={error}
      data={data}
      empty={EMPTY_USERS}
      render={(users) => (
        <ul>
          {users.map((user) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      )}
    />
  );
};
```

### ✨ Podsumowanie: co zyskujesz tym podejściem?

- **Super czyste strony** — tylko `useHook()` + `DataRenderer`.
- **Standaryzacja błędów** — zawsze to samo w każdym komponencie.
- **Obsługa loading/error/empty/success** bez żadnego powtarzania kodu.
- **Szybsze pisanie nowych stron** — kopiuj-wklej + zmień hooka.

### 🔥 Cały gotowiec krok po kroku:

- `DataRenderer` ➔ pokazuje loading, error, empty, success
- `useUsers` ➔ zawsze zwraca dane + error w tym samym formacie
- `UsersPage` ➔ ultra-czysty kod

## 🌍 7. Zmienne Środowiskowe

### Jakie zmienne środowiskowe są potrzebne?

1. **VITE_API_URL -** Adres bazowy API, do którego aplikacja będzie się łączyć.
    - Przykład: `VITE_API_URL=http://localhost:8080`