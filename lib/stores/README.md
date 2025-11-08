# Zustand stores

프로젝트에 Zustand를 도입하기 위한 간단한 예제 스토어들이 포함되어 있습니다.

사용 예제 (React 컴포넌트에서):

```tsx
import React from "react";
import useAuthStore from "@/lib/stores/useAuthStore";

export default function Header() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <header>
      {user ? (
        <div>
          <img src={user.avatar} alt={user.username} />
          <span>{user.username}</span>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <div>Not signed in</div>
      )}
    </header>
  );
}
```

UI 상태 사용 예제:

```tsx
import useUIStore from "@/lib/stores/useUIStore";

export function ToggleTheme() {
  const darkMode = useUIStore((s) => s.darkMode);
  const setDarkMode = useUIStore((s) => s.setDarkMode);

  return (
    <button onClick={() => setDarkMode(!darkMode)}>
      {darkMode ? "Light" : "Dark"}
    </button>
  );
}
```

서버사이드 렌더링(Next.js) 관련 참고:

- Zustand는 클라이언트 사이드 상태 관리에 적합합니다. SSR에서 초기값을 주입하려면 컴포넌트가 마운트될 때 서버에서 받아온 값을 set 해주거나, zustand의 `persist` 또는 `subscribe`와 같은 미들웨어를 사용해 상태를 복원할 수 있습니다.
