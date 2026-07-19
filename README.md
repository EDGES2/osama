# Trener Sushi

Statyczna aplikacja (bez build stepu) do nauki menu rolek i zestawów
sushi: fiszki, quiz rozpoznawania po zdjęciu, quiz składu zestawu,
wyszukiwarka z fuzzy-matchingiem.

## Struktura

```
index.html
css/style.css
js/            — data.js (dane menu) + logika UI, ładowane w kolejności z index.html
images/        — zdjęcia .webp pozycji menu (patrz images/README.txt)
data-pipeline/ — skrypty generujące js/data.js z surowego tekstu menu
```

## Uruchomienie lokalnie

Otwarcie `index.html` bezpośrednio przez `file://` częściowo działa,
ale próbkowanie koloru tła zdjęcia (`sampleEdgeColor` w `js/render.js`)
wymaga serwera HTTP (canvas jest "tainted" przy `file://`). Najprościej:

```bash
python3 -m http.server 8000
```

i otwórz `http://localhost:8000/`.

## Dodawanie nowych pozycji menu

Patrz [`data-pipeline/README.md`](data-pipeline/README.md).

## Hosting

Repo jest gotowe pod GitHub Pages "as is" — czysty HTML/CSS/JS, bez
kroku budowania. Wystarczy branch + `/ (root)` jako źródło Pages.
