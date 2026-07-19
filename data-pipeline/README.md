# Jak dodawać nowe pozycje do menu

Wszystko w aplikacji (search.js, cards.js, quiz.js, setquiz.js,
similarity.js) czyta dane bezpośrednio z globalnych tablic `ROLLS` i
`SETS` zdefiniowanych w `js/data.js`. Nie ma osobnej rejestracji ani
indeksu do aktualizowania — wystarczy, że nowa pozycja znajdzie się w
jednej z tych dwóch tablic. Pole `tags` **nie jest już używane** —
podobieństwo (dystraktory w Quizie, "pułapki" w Składzie zestawu)
liczy się automatycznie z `ingredients` (patrz `similarity.js`).

Są dwa sposoby dodania nowej pozycji:

1. **Ręcznie w `js/data.js`** — szybkie, bezpieczne, polecane dla
   pojedynczych dodatków.
2. **Przez pipeline (`regenerate.sh`)** — do masowego importu z
   surowego tekstu menu.

---

## Sposób 1: ręcznie w `js/data.js`

### Nowa rolka — dopisz obiekt do tablicy `ROLLS`

```js
{
  "id": "r088",              // kolejny wolny, unikalny; NIE może zaczynać się od "s"
  "name": "Nazwa nowej rolki",
  "count": 1,                 // szt w porcji
  "ingredients": [
    "Nori", "Ryż", "Ser Philadelphia", "..."
  ],
  "needsSauce": true,         // true = ikonka "kropli" (sos unagi/spicy/sriracha podawany osobno)
  "image": "images/nazwa-pliku.webp"
}
```

### Nowy zestaw — dopisz obiekt do tablicy `SETS`

```js
{
  "id": "s025",
  "name": "Zestaw Nowy",
  "count": 30,                // liczba szt w zestawie, albo null jeśli nieznana
  "items": [
    { "name": "Philadelphia z łososiem", "rollId": "r058", "portion": "full" },
    { "name": "Coś bez zdjęcia",         "rollId": null,    "portion": "full" },
    { "name": "Maki z ogórkiem",         "rollId": "r041",  "portion": "half", "bonus": true, "qty": 2 }
  ],
  "image": "images/nazwa-pliku-zestawu.webp"
}
```

`portion`, `bonus` i `qty` w `items` są opcjonalne (domyślnie
`portion: "full"`, bez `bonus`/`qty`).

### Ściągawka pól

| Pole | Dotyczy | Opis |
|---|---|---|
| `id` | rolka, zestaw | unikalne; id rolki **nie** może zaczynać się od `"s"` — `itemById()` w `render.js` rozróżnia rolkę/zestaw właśnie po pierwszej literze |
| `name` | rolka, zestaw | wyświetlana nazwa |
| `count` | rolka, zestaw | szt w porcji / w zestawie; może być `null` dla zestawu |
| `ingredients` | rolka | lista składników — używana też do liczenia podobieństwa (Quiz, Skład zestawu) |
| `needsSauce` | rolka | pokazuje ikonkę sosu podawanego osobno |
| `items[].rollId` | zestaw | musi dokładnie zgadzać się z `id` istniejącej rolki w `ROLLS`, albo `null` gdy komponent nie ma własnego zdjęcia |
| `image` | rolka, zestaw | ścieżka do zdjęcia względem `index.html`, czyli plik musi leżeć w folderze `images/` obok `index.html` |

### Uwagi

- Zdjęcie nie musi istnieć od razu — brakujący plik w `images/`
  pokazuje się jako spokojny placeholder z nazwą pozycji (karta,
  detale, quiz), a nie jako złamana ikonka.
- Sprawdź ostatnie zajęte id przed dodaniem nowego:

  ```bash
  grep -o '"id": "r[0-9]*"' js/data.js | sort -t'r' -k2 -n | tail -1
  grep -o '"id": "s[0-9]*"' js/data.js | sort | tail -1
  ```

---

## Sposób 2: przez pipeline (`regenerate.sh`)

Do masowego dodawania pozycji z surowego tekstu menu:

1. Dopisz linijkę do `original_menu.txt` w formacie:
   `Nazwa WAGA g składnik, składnik, ...webp`
2. Dopisz odpowiadającą linijkę (**dokładną** nazwę pliku zdjęcia) do
   `exact_filenames.txt`, w tej samej kolejności/pozycji co w
   `original_menu.txt`.
3. Wrzuć zdjęcie do folderu `images/`.
4. Uruchom z folderu z `parse.py` / `create_data.py` / `parse_sets.py`
   / `build_data_js.py`:

   ```bash
   ./regenerate.sh
   ```

   Skrypt kolejno: `parse.py` → `create_data.py` → `parse_sets.py` →
   `build_data_js.py`, a na końcu kopiuje wynikowy `data.js` do
   `../js/data.js`.

### Zanim zaufasz wynikowi

`parse.py` / `parse_sets.py` to parsery oparte na regexach, z dość
sztywnymi założeniami co do formatu linijki (waga, opcjonalne
`: N szt`, składniki rozdzielone przecinkami) i z ręcznymi wyjątkami
zaszytymi w kodzie (`ALIASES`, `KNOWN_UNMATCHED`, specjalny przypadek
`Zestaw Tokio` w `parse_sets.py`). Po uruchomieniu sprawdź w
konsoli:

- `NO MATCH:` / `NO DIGIT:` / `META NO MATCH:` z `parse.py` —
  linijka nie dopasowała się do wzorca nagłówka,
- `Komponenty bez foto-karty (potrzebują ręcznej weryfikacji):` z
  `parse_sets.py` — składnik zestawu, którego nie udało się
  automatycznie powiązać z żadną rolką (trafi do `items` z
  `"rollId": null`).

Dla pojedynczej nowej pozycji zwykle prościej i bezpieczniej jest
użyć **Sposobu 1**.
