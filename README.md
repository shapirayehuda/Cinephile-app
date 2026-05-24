# Cinephile (React + Vite)

Movie discovery app using OMDb. Set `VITE_OMDB_API_KEY` in `.env` and run `npm run dev`.

## רשימת קומפוננטות / Components

| קובץ | תפקיד |
|------|--------|
| **`src/main.jsx`** | נקודת כניסה: יוצר את ה־React root, עוטף ב־`StrictMode` ו־`BrowserRouter`, מרנדר את `App`. |
| **`src/App.jsx`** | שורש האפליקציה: `DiscoveryProvider`, כותרת עליונה (`Header`), ו־`Routes` — דף בית (`/`) ודף פרטי סרט (`/movie/:imdbId`). |
| **`src/assets/components/Header.jsx`** | כותרת האתר: מותג/קישור הביתה (מאפס את ה־feed בלחיצה) + מציג את `HeaderSearch`. |
| **`src/assets/components/HeaderSearch.jsx`** | שדה חיפוש + פילטרים (שנה, ז׳אנרים מרובים, מדינה), חיפוש חי (debounce), שליחת חיפוש ל־context וניווט ל־`/`. |
| **`src/assets/components/movie.jsx`** (`MovieCard`) | כרטיס סרט בגריד: פוסטר (עם fallback אם התמונה נכשלת), כותרת, שנה, דירוג; קישור ל־`/movie/:id`. |
| **`src/assets/components/VirtualMovieGrid.jsx`** | גריד וירטואלי (`react-virtuoso`): מציג רשימת כרטיסים, טעינת עמודים נוספים בגלילה, פוטר טעינה. |
| **`src/assets/components/AppLoader.jsx`** | אינדיקטור טעינה ויזואלי (ספינר + טקסט), לשימוש בדפים. |
| **`src/pages/MoviesHomePage.jsx`** | דף הבית: טוען feed או חיפוש לפי `searchTrigger` מ־OMDb, מיזוג תוצאות, טעינת דירוגים, מצבי טעינה/שגיאה/ריק. |
| **`src/pages/MovieDetailPage.jsx`** | דף פרטים לפי `imdbId`: plot, cast, meta, רקע מטושטש מהפוסטר; טעינה ושגיאות. |
| **`src/context/DiscoveryContext.jsx`** | `DiscoveryProvider` + `useDiscovery`: מצב חיפוש גלובלי (`searchTrigger`, `submitSearch`, `resetToFeed`) בין Header לדף הבית. |

---

# React + Vite (template notes)

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
