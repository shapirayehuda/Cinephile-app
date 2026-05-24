# Cinephile

אפליקציית גילוי סרטים מבוססת React, עם נתונים מ-[OMDb API](https://www.omdbapi.com/).  
פרויקט BootCamp — WIX.

**אתר חי (GitHub Pages):** https://shapirayehuda.github.io/Cinephile-app/

---

## Tech stack

| טכנולוגיה | שימוש |
|-----------|--------|
| **React 19** | UI, Hooks, Context API |
| **Vite 8** | Build, dev server, HMR |
| **React Router 7** | ניווט SPA, URL ייחודי לכל סרט |
| **react-virtuoso** | גריד וירטואלי — ביצועים בגלילה על רשימות ארוכות |
| **OMDb API** | חיפוש, feed, פרטי סרט, דירוגים |
| **CSS (custom properties)** | עיצוב, Dark/Light mode, Responsive |
| **localStorage** | ערכת נושא, Watchlist |
| **GitHub Actions** | Build + פריסה אוטומטית ל-GitHub Pages |

---

## יכולות עיקריות (Technical highlights)

- **חיפוש חי עם Debounce** — `useDebouncedValue` (400ms) מפחית קריאות API בזמן הקלדה
- **React Context (גלובלי)** — `DiscoveryContext`, `ThemeContext`, `WatchlistContext`
- **ניווט (React Router)** — `/`, `/movie/:imdbId`, `/watchlist`, 404
- **גריד וירטואלי** — `VirtuosoGrid` לטעינה הדרגתית (infinite scroll)
- **מיון בצד לקוח** — שנה, דירוג, כותרת (A–Z / Z–A) בלי בקשות נוספות
- **Watchlist** — שמירה ב-`localStorage`, הסרה בודדת / ניקוי מלא
- **Dark / Light mode** — `data-theme` + שמירה ב-`localStorage`
- **Skeleton loading** — placeholder עם shimmer (מותאם ביצועים למובייל)
- **Responsive** — מובייל, tablet, desktop; `safe-area` לנוטש
- **Auto-focus** — `useRef` על שדה החיפוש בטעינה
- **GitHub Pages** — `base` path, `404.html` ל-SPA, secret ל-`VITE_OMDB_API_KEY`

---

## התקנה והרצה

```bash
npm install
```

צור `.env` (העתק מ-`.env.example`):

```env
VITE_OMDB_API_KEY=your_key_here
```

```bash
npm run dev      # פיתוח — http://localhost:5173
npm run build    # production build
npm run preview  # תצוגה מקומית של build
npm run lint     # ESLint
```

---

## מבנה הפרויקט

```
src/
├── api/              # OMDb — חיפוש, feed, פילטרים, דירוגים
├── assets/
│   ├── components/   # קומפוננטות UI
│   ├── movie.css
│   └── skeleton.css
├── context/          # Context API
├── hooks/            # Custom hooks
├── pages/            # דפים (Routes)
├── utils/            # עזר (מיון)
├── App.jsx
├── App.css
├── index.css
└── main.jsx
```

---

## רשימת קומפוננטות (מלאה)

### נקודת כניסה ושורש

| קובץ | תפקיד |
|------|--------|
| `src/main.jsx` | React root, `StrictMode`, `BrowserRouter` עם `basename` ל-GitHub Pages |
| `src/App.jsx` | `ThemeProvider` → `DiscoveryProvider` → `WatchlistProvider`, `Header`, `Routes` |

### קומפוננטות — Layout & ניווט

| קובץ | תפקיד |
|------|--------|
| `Header.jsx` | כותרת: מותג, קישור Watchlist (עם מונה), `ThemeToggle`, `HeaderSearch` |
| `HeaderSearch.jsx` | חיפוש + פילטרים (שנה, ז'אנרים, מדינה); debounce; שליחה ל-`DiscoveryContext` |
| `ThemeToggle.jsx` | מעבר Dark / Light |
| `MovieSortSelect.jsx` | בחירת מיון: שנה, דירוג, כותרת |

### קומפוננטות — סרטים & גריד

| קובץ | תפקיד |
|------|--------|
| `movie.jsx` (`MovieCard`) | כרטיס סרט: פוסטר, כותרת, שנה, דירוג, קישור ל-`/movie/:id`, `WatchlistButton` |
| `VirtualMovieGrid.jsx` | גריד וירטואלי (`react-virtuoso`), infinite scroll, `LoadMoreSkeleton` |
| `WatchlistButton.jsx` | כפתור הוספה/הסרה מ-Watchlist (compact על כרטיס, מלא בדף סרט) |
| `WatchlistCard.jsx` | כרטיס בדף Watchlist + כפתור Remove |

### קומפוננטות — טעינה (Skeleton)

| קובץ | תפקיד |
|------|--------|
| `MovieCardSkeleton.jsx` | שלד לכרטיס בודד |
| `MovieGridSkeleton.jsx` | רשת skeleton לדף הבית (4 כרטיסים) |
| `MovieDetailSkeleton.jsx` | שלד לדף פרטי סרט |
| `LoadMoreSkeleton.jsx` | שלד בטעינת "עוד תוצאות" |
| `MoviePosterMedia.jsx` | פוסטר משותף ל-`MovieCard` ו-`WatchlistCard` |

### דפים (Pages)

| קובץ | Route | תפקיד |
|------|-------|--------|
| `MoviesHomePage.jsx` | `/` | Feed / חיפוש, מיון, גריד וירטואלי, טעינה הדרגתית |
| `MovieDetailPage.jsx` | `/movie/:imdbId` | פרטי סרט מלאים מ-OMDb, Watchlist, backdrop |
| `WatchlistPage.jsx` | `/watchlist` | רשימה שמורה, מיון, הסרה, Clear all |
| `NotFoundPage.jsx` | `*` | 404 |

### Context API

| קובץ | תפקיד |
|------|--------|
| `DiscoveryContext.jsx` | `searchTrigger`, `submitSearch`, `resetToFeed` — חיפוש גלובלי |
| `ThemeContext.jsx` | `theme`, `toggleTheme`, `setTheme` — Dark/Light + `localStorage` |
| `WatchlistContext.jsx` | `watchlist`, `add`/`remove`/`toggle`/`clear`, `localStorage` |

### Hooks

| קובץ | תפקיד |
|------|--------|
| `useDebouncedValue.js` | ערך מעוכב בזמן — משמש לחיפוש חי |
| `useMoviePoster.js` | לוגיקת פוסטר + fallback (משותף לכרטיסים) |

### API & Utils

| קובץ | תפקיד |
|------|--------|
| `api/omdb.js` | קריאות OMDb: חיפוש, feed, פילטר genre/country, enrich ratings |
| `utils/sortMovies.js` | מיון: שנה, דירוג, כותרת (A–Z) |

### עיצוב (CSS)

| קובץ | תפקיד |
|------|--------|
| `index.css` | משתני ערכת נושא, `#root`, טיפוגרפיה |
| `App.css` | Header, חיפוש, watchlist, sort, skeleton, empty states |
| `movie.css` | כרטיסי סרט, גריד virtuoso |
| `movie-detail.css` | דף פרטי סרט |
| `skeleton.css` | shimmer (מותאם ביצועים; סטטי במובייל) |

---

## Routes

| URL | דף |
|-----|-----|
| `/` | Discovery / חיפוש |
| `/movie/tt0133093` | פרטי סרט (IMDb ID) |
| `/watchlist` | רשימת צפייה |
| כל נתיב אחר | 404 |

---

## פריסה ל-GitHub Pages

1. **Settings → Secrets → Actions:** `VITE_OMDB_API_KEY` (רק הערך, בלי `KEY=`)
2. **Settings → Pages → Source:** GitHub Actions
3. Push ל-`main` מפעיל workflow `deploy-pages.yml`

---

## רישיון

פרויקט לימודי / BootCamp.
