# Jak dodawać nowe pozycje do menu

Wszystko w aplikacji (search.js, cards.js, quiz.js, setquiz.js,
similarity.js) czyta dane bezpośrednio z globalnych tablic `ROLLS` i
`SETS` zdefiniowanych w `js/data.js`. Nie ma osobnej rejestracji ani
indeksu do aktualizowania — wystarczy, że nowa pozycja znajdzie się w
jednej z tych dwóch tablic. Podobieństwo (dystraktory w Quizie,
"pułapki" w Składzie zestawu) liczy się automatycznie z `ingredients`
(patrz `similarity.js`).

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
  "id": "r091",              // kolejny wolny, unikalny; NIE może zaczynać się od "s"
  "name": "Nazwa nowej rolki",
  "count": 1,                 // szt w porcji
  "ingredients": [
    { "name": "Nori", "grams": null, "qty": null },
    { "name": "Ryż", "grams": 140, "qty": null },
    { "name": "Krewetki nobashi", "grams": 48, "qty": 3 }
  ],
  "weightGrams": null,        // realna zważona waga gotowej rolki; null, dopóki nikt jej nie zważył
  "needsSauce": true,         // true = ikonka "kropli" (sos unagi/spicy/sriracha podawany osobno)
  "image": "images/nazwa-pliku.webp"
}
```

`grams`/`qty` przy ingrediencie i `weightGrams` na poziomie rolki są
**opcjonalne** — jeśli nie znasz wagi, wpisz po prostu `null` (tak
wygląda dziś zdecydowana większość pozycji). `grams` to waga TEJ
porcji składnika w rolce (nie za sztukę), `qty` to ile sztuk ta waga
oznacza (3 krewetki, 2 plastry sera, ...).

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
`portion: "full"`, bez `bonus`/`qty`). Zestawy nie mają własnej
grammatury/`weightGrams` — waga liczona/pokazywana jest tylko dla
pojedynczych rolek.

### Ściągawka pól

| Pole | Dotyczy | Opis |
|---|---|---|
| `id` | rolka, zestaw | unikalne; id rolki **nie** może zaczynać się od `"s"` — `itemById()` w `render.js` rozróżnia rolkę/zestaw właśnie po pierwszej literze |
| `name` | rolka, zestaw | wyświetlana nazwa |
| `count` | rolka, zestaw | szt w porcji / w zestawie; może być `null` dla zestawu |
| `ingredients` | rolka | lista `{ name, grams, qty }` — używana też do liczenia podobieństwa (Quiz, Skład zestawu), po polu `name`; `grams`/`qty` mogą być `null` |
| `weightGrams` | rolka | realna zważona waga gotowej rolki; `null`, dopóki nikt jej nie zważył |
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

Do masowego dodawania pozycji z surowego tekstu menu. Pipeline składa
się z pięciu skryptów, uruchamianych po kolei przez `regenerate.sh`:

```
parse_source.py → build_rolls.py → build_sets.py → rename_images.py → build_data_js.py
```

| Skrypt | Wejście | Wyjście |
|---|---|---|
| `parse_source.py` | `original_menu.txt` + `exact_filenames.txt` (+ opcjonalne `.txt` obok zdjęć) | `rolls_parsed.json`, `sets_raw.json` |
| `build_rolls.py` | `rolls_parsed.json` | `rolls_clean.json`, `idx_to_id.json` |
| `build_sets.py` | `sets_raw.json` + `rolls_clean.json` | `sets_clean.json` |
| `rename_images.py` | `rolls_clean.json` + `sets_clean.json` + realne pliki w `images/` | przemianowane pliki w `images/` + zaktualizowane `*_clean.json` |
| `build_data_js.py` | `rolls_clean.json` + `sets_clean.json` | `data.js` |

Wszystkie skrypty mają wbudowaną pomoc (`python3 <skrypt>.py --help`)
i domyślne ścieżki, więc zwykle wystarczy `./regenerate.sh`.

### Dodawanie nowej pozycji

1. Dopisz linijkę do `original_menu.txt` w formacie:
   `Nazwa WAGA g składnik, składnik, ...webp`
2. Dopisz odpowiadającą linijkę (**dokładną**, aktualną nazwę pliku
   zdjęcia na dysku) do `exact_filenames.txt`, w tej samej
   kolejności/pozycji co w `original_menu.txt`.
3. Wrzuć zdjęcie do folderu `images/`.

**Jeżeli opis jest za długi, żeby zmieścić go w jednej linijce /
nazwie pliku** (tak jak dla „Zestaw Tokio”): zamiast wypisywać cały
skład w `original_menu.txt`, zostaw tam samą nazwę pozycji (bez wagi
i składu), a pełny opis — w **dokładnie tym samym formacie**, co
zwykła linijka — zapisz w osobnym pliku `.txt` **obok zdjęcia**, o
**identycznej nazwie bazowej** (różniącej się tylko rozszerzeniem):

```
images/Zestaw_Nowy_-_Opis.webp
images/Zestaw_Nowy_-_Opis.txt      <- tu pełny opis: "Zestaw Nowy - Opis 1200 g : 30 szt składnik, składnik, ..."
```

`parse_source.py` sam wykryje taki plik `.txt` i użyje go zamiast
linijki z `original_menu.txt` — nie trzeba nic dopisywać w kodzie
(wcześniej wymagało to ręcznej stałej `TOKIO_TEXT` w `parse_sets.py`;
teraz ten mechanizm działa dla dowolnej pozycji, automatycznie).

4. Uruchom z tego folderu:

   ```bash
   ./regenerate.sh                  # najpierw dry-run: pokaże plan przemianowania zdjęć, niczego nie zmienia na dysku
   ./regenerate.sh --apply-rename   # realnie przemianowuje zdjęcia w images/ na r0XX.ext / s0XX.ext i pisze js/data.js
   ```

   Za drugim razem (`--apply-rename`) skrypt naprawdę przemianowuje
   pliki w `images/` na krótkie, kanoniczne nazwy zgodne z `id`
   pozycji (`r088.webp`, `s025.webp`, ...) — rozszerzenie brane jest z
   realnego pliku na dysku (więc `.jpg` zostaje `.jpg`). Jeśli obok
   zdjęcia był też plik `.txt` z opisem, zostanie przemianowany razem
   z nim. Na końcu kopiuje `data.js` do `../js/data.js`.

   Domyślnie `rename_images.py` **przenosi** pliki (`mv`). Żeby
   zamiast tego kopiować i zostawić oryginały na miejscu (np. przy
   pierwszym teście), uruchom go osobno z `--mode copy`:

   ```bash
   python3 rename_images.py --source-dir ../images --apply --mode copy
   ```

### Dopisywanie kolejnych pozycji (nie trzeba nic „trzymać" ręcznie)

Pipeline zawsze przelicza **cały** `original_menu.txt`/`exact_filenames.txt`
od nowa — nie ma trybu "dopisz tylko te 5 nowych". To jednak nie znaczy,
że trzeba pilnować starych zdjęć czy ręcznie nic nie psuć:

- Po `--apply-rename` `rename_images.py` sam **synchronizuje
  `exact_filenames.txt`** — zamienia stare, długie nazwy na już
  nadane kanoniczne (`r001.webp`, ...). Dzięki temu przy kolejnym
  uruchomieniu stare 111 pozycji to zawsze **no-op** (źródło = cel,
  fizycznie nic się nie dzieje, w logu tylko jedna zbiorcza linijka
  `(+ ще N позицій вже мають канонічне ім'я)`) — realnie
  przemianowywane są tylko nowo dopisane linijki. Robi się
  automatyczna kopія `exact_filenames.txt.bak` na wszelki wypadek.
- Nie trzeba więc "trzymać" starych zdjęć pod starymi nazwami — po
  pierwszym `--apply-rename` wszystko już jest pod krótkimi nazwami, i
  tak zostaje.

**Żeby dodać N nowych pozycji:**

1. Wrzuć N nowych zdjęć do `images/` (dowolne nazwy — długie opisowe
   albo już od razu krótkie, bez znaczenia).
2. Dopisz N linijek **na końcu** `original_menu.txt` (ew. z
   grammaturą/`waga:`, patrz niżej) i N odpowiadających linijek **na
   końcu** `exact_filenames.txt` (te same, w tej samej kolejności).
3. `./regenerate.sh --apply-rename`.

**Ważne: zawsze dopisuj na końcu, nigdy nie wstawiaj w środku ani nie
zmieniaj kolejności istniejących linijek.** `id` (`r001`, `r002`, ...)
nadawane jest po pozycji linijki w pliku — wstawienie czegoś w środku
przesunie `id` wszystkich pozycji PO nim (a razem z tym — nazwy już
przemianowanych zdjęć, i wszelkie ręczne odwołania do starych `id` w
`js/data.js`, jeśli jakieś tam wprowadziłaś/eś ręcznie).

**Pipeline teraz zatrzymuje się (kod wyjścia ≠ 0, `set -e` w
`regenerate.sh` przerywa dalsze kroki), jeśli jakaś linijka się NIE
sparsuje** (`NO DIGIT` / `META NO MATCH` / `SET NO MATCH` w konsoli) —
zamiast po cichu ją pominąć i i tak przemianować resztę zdjęć (to był
błąd we wcześniejszej wersji tego pipeline'u — pozycja po prostu
znikała bez ostrzeżenia). Najczęstsza przyczyna: **nazwa pozycji nie
może zawierać cyfry** (np. "Rolka 2 w 1") — parser szuka pierwszej
cyfry w linijce, żeby oddzielić nazwę od wagi, więc cyfra w samej
nazwie zbija ten podział. Jeśli naprawdę tego potrzebujesz, dopisz
`--allow-errors` do `parse_source.py` (przez zmienną w
`regenerate.sh`) — ale wtedy ta pozycja po prostu zniknie z wyniku,
więc lepiej po prostu przeformułować nazwę.



Domyślnie nic się nie zmienia — jeśli nie dopiszesz nic dodatkowego,
każdy składnik dostanie `grams: null, qty: null`, a rolka
`weightGrams: null` (tak jak dziś dla zdecydowanej większości pozycji).

Jeśli konkretny składnik został zważony, dopisz to w nawiasie od razu
po jego nazwie w liście składu:

```
ryż (140g), krewetki nobashi (48g x3), tobiko (10g)
```

- `(NNg)` → `grams: NN`, `qty: null`
- `(NNg x M)` (działa też `xM`, `×M`, ze spacjami lub bez) → `grams: NN`, `qty: M`
  (`grams` to waga TEJ porcji składnika w rolce, nie za sztukę — więc
  "3 krewetki, 48 g łącznie" to `(48g x3)`, nie `(16g x3)`)

Żeby zapisać **realną, zważoną wagę całej gotowej rolki** — to inna
liczba niż "WEIGHT g" w nagłówku linijki, która jak dawniej jest tylko
orientacyjną etykietą z cennika/menu — dopisz gdziekolwiek na liście
składu (jako jeszcze jedną pozycję po przecinku) pseudo-składnik:

```
waga: 465g
```

(działa też `waga 465g`, `waga=465g`, `Waga:465g`).

Pełny przykład linijki (wszystko poza nawiasami i `waga:` wygląda
dokładnie tak samo, jak zawsze):

```
Burger z surimi 385 g nori (2g), ryż (140g), serek philadelphia (35g), awokado (30g), surimi (40g), majonez japonski (15g), łosoś surowy (30g), panko (30g), tempura (50g), sos unagi (15g), waga: 385g.webp
```

### Czyszczenie tekstu

`parse_source.py` czyści **cały** tekst (nazwy, składniki, nazwy
setów) zanim cokolwiek sparsuje: usuwa emoji i resztki po złamanych
sekwencjach emoji (np. samotny `?`), zwija wielokrotne spacje,
poprawia cyrylickie „bliźniaki” liter, które bywają niepostrzeżenie
wklejone zamiast łacińskich/polskich (np. `tobikо` z cyrylicką „o” →
`tobiko`). Ta logika jest w jednym miejscu — `textutils.py` — więc
działa identycznie dla rolek i setów.

### Zanim zaufasz wynikowi

Parsery oparte są na regexach, z dość sztywnymi założeniami co do
formatu linijki (waga, opcjonalne `: N szt`, składniki rozdzielone
przecinkami) i z ręcznymi wyjątkami zaszytymi w kodzie (`ALIASES`,
`KNOWN_UNMATCHED` w `build_sets.py`). Po uruchomieniu sprawdź w
konsoli:

- `NO DIGIT:` / `META NO MATCH:` / `SET NO MATCH:` z `parse_source.py`
  — linijka nie dopasowała się do wzorca nagłówka,
- `TXT OVERRIDE:` z `parse_source.py` — informacyjne, potwierdza które
  pozycje wzięły opis z osobnego pliku `.txt`,
- `Komponenty bez foto-karty (potrzebują ręcznej weryfikacji):` z
  `build_sets.py` — składnik zestawu, którego nie udało się
  automatycznie powiązać z żadną rolką (trafi do `items` z
  `"rollId": null`),
- `НЕ ЗНАЙДЕНО ... файл(ів)-джерел` z `rename_images.py` — dla którejś
  pozycji nie znaleziono zdjęcia w `images/` pod oczekiwaną nazwą;
  pipeline się zatrzyma i nic nie przemianuje, dopóki nie poprawisz
  (albo świadomie nie pominiesz przez `--skip-missing`).

Dla pojedynczej nowej pozycji zwykle prościej i bezpieczniej jest
użyć **Sposobu 1**.
