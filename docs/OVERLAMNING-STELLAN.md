# Överlämning – il mackeria webbplats

Hej Stellan!

Det här dokumentet sammanfattar allt om den nya webbplatsen för **il mackeria** – vad som är byggt, hur du loggar in, och vad du kan göra själv i adminpanelen.

Webbplatsen är live på: **https://ilmackeria.se**

---

## 1. Logga in som administratör

| | |
|---|---|
| **Adress** | https://ilmackeria.se/admin/login |
| **E-post** | stellan@mackerian.se |
| **Lösenord** | Skickas separat till dig av Viktor (byt det vid första inloggningen) |

**Viktigt:** Byt lösenord efter första inloggningen.

Du har rollen **Administratör** – det ger full tillgång till allt i panelen, inklusive inställningar och användare.

---

## 2. Vad är det som byggts? (enkelt förklarat)

Tänk dig webbplatsen i tre delar:

### Den publika sidan (det besökare ser)
- Startsidan med sektioner du kan redigera (hero, meny, nyheter, bokning, hitta hit m.m.)
- Meny med schiacciata
- Nyheter
- Kontaktformulär (popup)
- Bokningsformulär / catering (popup)
- Svenska och engelska version

### Adminpanelen (det du loggar in på)
- Här uppdaterar du innehåll utan att behöva koda
- Här ser du bokningar och meddelanden från formulär
- Här publicerar du ändringar på startsidan

### Teknik bakom kulisserna (vi sköter detta)
| Tjänst | Vad den gör |
|--------|-------------|
| **Vercel** | Hostar webbplatsen (servern som visar sidan) |
| **Supabase** | Databas + inloggning för admin |
| **Resend** | Skickar e-post från `noreply@ilmackeria.se` |
| **Loopia** | Domänens DNS (pekar ilmackeria.se till Vercel) |

Du behöver normalt inte logga in på dessa tjänster – allt viktigt kan du göra via **adminpanelen**.

---

## 3. Funktioner i adminpanelen

### Översikt (`/admin`)
Snabb överblick: nya bokningar, utkast till nyheter, opublicerat innehåll.

### Startsidan (`/admin/pages/home`)
- Redigera sektioner på startsidan (text, bilder, knappar)
- **Spara utkast** – sparar utan att visa för besökare
- **Publicera** – gör ändringarna synliga på ilmackeria.se
- Dra och släpp för att ändra ordning på sektioner

### Meny (`/admin/menu`)
- Lägg till, redigera och ta bort menyobjekt
- Pris, beskrivning, varm/kall, bild
- Publicera / avpublicera rätter

### Nyheter (`/admin/news`)
- Skriv nyhetsinlägg med bild
- Publicera när du är redo

### Galleri (`/admin/gallery`)
- Ladda upp bilder
- Radera bilder du inte vill visa

### Öppettider (`/admin/opening-hours`)
- Uppdatera tider som visas på sajten

### Bokningar (`/admin/bookings`)
- Alla catering-/bokningsförfrågningar sparas här
- Status: **Ny** → **Kontaktad** → **Bekräftad** / **Avböjd**
- **Ingen bokning bekräftas automatiskt via mail** – du bestämmer själv när något är bokat och kontaktar kunden (telefon/mail)

### Meddelanden (`/admin/messages`)
- Alla meddelanden från kontaktformuläret
- Status: **Nytt** → **Läst** → **Besvarat**

### Inställningar (`/admin/settings`)
- Kontaktuppgifter, banner på sajten m.m.

### Användare (`/admin/anvandare`)
- Bjud in fler som ska kunna redigera (t.ex. personal)
- Roller: **Administratör**, **Redaktör**, **Läsare**

---

## 4. E-post – hur det fungerar

### Vad som skickas automatiskt

| Händelse | Till dig | Till kunden |
|----------|----------|-------------|
| Någon fyller i **kontaktformuläret** | Mail till **stellan@mackerian.se** | Nej |
| Någon skickar **bokningsförfrågan** | Mail till **stellan@mackerian.se** | Ett kort “tack, vi har tagit emot din förfrågan”-mail (inte en bokningsbekräftelse) |

Alla förfrågningar sparas **även i admin** – så du missar inget om e-post strular.

Mailet skickas från: **noreply@ilmackeria.se** (via Resend).

### E-postadress stellan@ilmackeria.se?

Vi har **inte** köpt en egen mailadress åt dig (t.ex. `stellan@ilmackeria.se`).

Idag går allt till din befintliga adress **stellan@mackerian.se**.

Vill du ha `@ilmackeria.se` kan vi sätta upp **Google Workspace** – det kostar ungefär **80–100 kr/månaden** och ger dig en riktig företagsmailadress.

---

## 5. Domänen ilmackeria.se

### Du äger rätten till domänen
Domänen **ilmackeria.se** köptes i ditt intresse, så att ingen annan kunde ta den. **Du äger rätten till den.**

### Tekniskt just nu
- Domänen ligger registrerad på **Viktors Loopia-konto** (viktordahlqvist@gmail.com) tills vi flyttar den
- DNS pekar korrekt mot webbplatsen
- När du vill kan vi **lägga över domänen** till ditt eget Loopia-konto (eller annan registrar) – säg bara till

### Webbhotell
Sidan hostas på **Vercel** (inte Loopias webbhotell). Det är snabbt och passar bra för den här typen av modern webbplats.

---

## 6. Vad besökare kan göra på sajten

- Se meny, nyheter, galleri, öppettider
- Byta språk (svenska / engelska)
- **Kontakta er** via formulär i headern
- **Boka catering** via knapp på startsidan och i bokningssektionen
- Läsa enskilda nyhetsartiklar

---

## 7. Nya funktioner i framtiden

Sidan är byggd så att vi **enkelt kan lägga till** saker om du vill, till exempel:

- Online-beställning
- Fler språk
- Nyhetsbrev
- Automatiskt bekräftelsemail när du markerar en bokning som “Bekräftad”
- Integration med bokföring eller kassasystem

**Säg bara till så fixar vi det.**

---

## 8. Bra att veta

- **Publicera alltid** startsidan efter ändringar (utkast syns inte för besökare)
- **Bokningar** – behandla “Bekräftad” i admin som er intern status; kunden får inget automatiskt bekräftelsemail idag
- **Säkerhet** – byt lösenord efter första inloggningen
- **Support** – kontakta Viktor om något strular eller om du vill ha hjälp med domänflytt, mail eller nya funktioner

---

## 9. Snabblänkar

| Vad | Länk |
|-----|------|
| Publika sajten | https://ilmackeria.se |
| Admin / logga in | https://ilmackeria.se/admin/login |
| Bokningar | https://ilmackeria.se/admin/bookings |
| Meddelanden | https://ilmackeria.se/admin/messages |
| Redigera startsidan | https://ilmackeria.se/admin/pages/home |

---

*Dokument upprättat juli 2026. Vid frågor – hör av dig till Viktor.*
