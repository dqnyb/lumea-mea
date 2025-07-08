import os
import pandas as pd
from openai import OpenAI
from dotenv import load_dotenv
from thefuzz import fuzz
from thefuzz import process
from word2number import w2n
import re
from collections import Counter
from difflib import SequenceMatcher


load_dotenv()
client = OpenAI()
luna_to_anotimp = {
    "ianuarie": "iarna", "ianuar": "iarna", "ian": "iarna", "ianuaie": "iarna", "ianurie": "iarna",
    "ianuariee": "iarna", "ianuri": "iarna", "ianuariea": "iarna",
    "ianuarie ": "iarna",
    "январь": "зима", "января": "зима",

    "februarie": "iarna", "februa": "iarna", "februari": "iarna", "febr": "iarna", "feb": "iarna",
    "febru": "iarna", "februrie": "iarna", "februare": "iarna",
    "февраль": "зима", "февраля": "зима",

    "martie": "primavara", "mart": "primavara", "marte": "primavara", "marti": "primavara",
    "martiee": "primavara", "mar": "primavara", "martie ": "primavara",
    "март": "весна", "марта": "весна",

    "aprilie": "primavara", "april": "primavara", "apr": "primavara", "apriliee": "primavara",
    "aprilie ": "primavara", "apriliea": "primavara",
    "апрель": "весна", "апреля": "весна", "апр": "весна",

    "mai": "primavara", "maii": "primavara", "mai ": "primavara", "ma": "primavara",
    "май": "весна", "мая": "весна",

    "iunie": "vara", "iun": "vara", "iuniee": "vara", "iunie ": "vara",
    "июнь": "лето", "июня": "лето", "июн": "лето",

    "iulie": "vara", "iul": "vara", "iuliee": "vara", "iulie ": "vara",
    "июль": "лето", "июля": "лето", "июл": "лето",

    "august": "vara", "aug": "vara", "augustt": "vara", "august ": "vara",
    "август": "лето", "августа": "лето", "авг": "лето",

    "septembrie": "toamna", "sept": "toamna", "sep": "toamna", "septembrie ": "toamna",
    "septembriee": "toamna",
    "сентябрь": "осень", "сентября": "осень", "сен": "осень",

    "octombrie": "toamna", "oct": "toamna", "octombriee": "toamna", "octombrie ": "toamna",
    "октябрь": "осень", "октября": "осень", "окт": "осень",

    "noiembrie": "toamna", "noi": "toamna", "noimbrie": "toamna", "noiembrie ": "toamna",
    "ноябрь": "осень", "ноября": "осень", "ноя": "осень",

    "decembrie": "iarna", "dec": "iarna", "decem": "iarna", "decembriee": "iarna",
    "decembrie ": "iarna", "decemrbie": "iarna",
    "декабрь": "зима", "декабря": "зима", "дек": "зима",

    "ianuarie": "iarna", "februarie": "iarna", "martie": "primavara",
    "aprilie": "primavara", "mai": "primavara", "iunie": "vara",
    "iulie": "vara", "august": "vara", "septembrie": "toamna",
    "octombrie": "toamna", "noiembrie": "toamna", "decembrie": "iarna",
}


    
def extrage_luna(text):
    text = str(text).lower()
    for luna in luna_to_anotimp:
        if luna in text:
            return luna
    return None

anotimpuri = [
    "iarna", "primavara", "vara", "toamna", "toate", "all",
    "зима", "весна", "лето", "осень", "все"
]

def extrage_anotimp_preferat(text):
    text = text.lower()
    cuvinte = text.split()
    for cuvant in cuvinte:
        rezultat = process.extractOne(cuvant, anotimpuri, scorer=fuzz.ratio)
        if rezultat and rezultat[1] >= 70:
            return rezultat[0]
    return None

def filtreaza_tururi_dupa_anotimp(tururi_text, anotimp_preferat, language):
    anotimp_normalizat = extrage_anotimp_preferat(anotimp_preferat)
    if not anotimp_normalizat:
        return "Nu am putut identifica anotimpul preferat."

    if language == "RO":
        tururi = re.split(r'\n(?=\s*- Titlu:)', tururi_text.strip())
    elif language == "RU":
        tururi = re.split(r'\n(?=\s*- Название:)', tururi_text.strip())
    else:
        tururi = re.split(r'\n(?=\s*-\s*(?:Nume|Название|Name):)', tururi_text.strip())
    tururi_filtrate = []
    if anotimp_normalizat in ["toate", "all" , "все"]:
        return "\n\n".join(tururi)
    
    for tur in tururi:
        for linie in tur.split("\n"):
            if linie.strip().startswith("Date:") or linie.strip().startswith("Даты:"):
                if linie.strip().startswith("Даты:"):
                    data = linie.split("Даты:")[1].strip()
                else:
                    data = linie.split("Date:")[1].strip()
                luna = extrage_luna(data)
                if luna and luna_to_anotimp.get(luna) == anotimp_normalizat:
                    tururi_filtrate.append(tur)

                break
    print(tururi_filtrate)
    if not tururi_filtrate:
        return "Nu există tururi pentru anotimpul specificat."

    return "\n\n".join(tururi_filtrate)


regiuni_posibile = [
    "romania", "europa", "turcia", "grecia", "spania", "italia", "franta",
    "transilvania", "dobrogea", "bucuresti", "moldova", "oltenia",
    "maramures", "banat", "asia", "america", "africa",

    "румыния", "европа", "турция", "греция", "испания", "италия", "франция",
    "трансильвания", "добруджа", "бухарест", "молдова", "олтения",
    "марамуреш", "банат", "азия", "америка", "африка"
]

def extrage_regiune(text):
    text = str(text).lower()
    cuvinte = text.split()

    scor_max = 0
    regiune_potrivita = None

    for cuvant in cuvinte:
        rezultat = process.extractOne(cuvant, regiuni_posibile, scorer=fuzz.ratio)
        if rezultat and rezultat[1] > scor_max and rezultat[1] >= 70:
            scor_max = rezultat[1]
            regiune_potrivita = rezultat[0]

    return regiune_potrivita


def filtreaza_tururi_dupa_regiune(tururi_text, regiune_preferata, language):
    regiune_normalizata = extrage_regiune(regiune_preferata)
    if not regiune_normalizata:
        return "Nu am putut identifica regiunea preferată."

    if language == "RO":
        tururi = re.split(r'\n(?=\s*- Titlu:)', tururi_text.strip())
    elif language == "RU":
        tururi = re.split(r'\n(?=\s*- Название:)', tururi_text.strip())
    else:
        tururi = re.split(r'\n(?=\s*-\s*(?:Nume|Название|Name):)', tururi_text.strip())
    tururi_filtrate = []

    for tur in tururi:
        for linie in tur.split("\n"):
            if linie.strip().lower().startswith("locatie:") or linie.strip().lower().startswith("локация:"):
                if linie.strip().lower().startswith("locatie:"):
                    locatie = linie.split("Locatie:")[1].strip().lower()
                else:
                    locatie = linie.split("Локация:")[1].strip().lower()
                scor = fuzz.partial_ratio(regiune_normalizata, locatie)
                if scor >= 70:
                    tururi_filtrate.append(tur)
                break
    if not tururi_filtrate:
        return "Nu există tururi pentru regiunea specificată."

    return "\n\n".join(tururi_filtrate)



def extrage_buget_maxim(text):
    prompt = f"""
Extrage suma maximă exprimată în textul de mai jos. Textul poate conține valori exprimate cu cifre sau cu litere în limba română.
Returnează doar numărul maxim găsit (ex: 500), fără alte explicații.

Text: "{text}"
"""
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        temperature=0,
        max_tokens=10,
    )
    raspuns = response.choices[0].message.content.strip()

    try:
        return int(raspuns)
    except:
        return None



def filtreaza_tururi_dupa_buget_maxim(tururi_text, buget_text, language):
    buget_max = extrage_buget_maxim(buget_text)
    if buget_max is None:
        return "Nu am putut identifica bugetul maxim."

    if language == "RO":
        tururi = re.split(r'\n(?=\s*- Titlu:)', tururi_text.strip())
    elif language == "RU":
        tururi = re.split(r'\n(?=\s*- Название:)', tururi_text.strip())
    else:
        tururi = re.split(r'\n(?=\s*-\s*(?:Nume|Название|Name):)', tururi_text.strip())
    tururi_filtrate = []

    for tur in tururi:
        for linie in tur.split("\n"):
            if linie.lower().strip().startswith("preț:") or linie.lower().strip().startswith("pret:") or linie.lower().strip().startswith("цена:"):
                try:
                    pret_str = linie.split(":")[1].strip().split()[0].replace(",", "")
                    pret_val = int(pret_str)
                    if pret_val <= buget_max:
                        tururi_filtrate.append(tur)
                except:
                    pass
                break

    if not tururi_filtrate:
        return "Nu există tururi care să se încadreze în bugetul specificat."

    return "\n\n".join(tururi_filtrate)

def extrage_dificultate(text):
    dificultati_posibile = [
        "usor", "ușor", "mediu", "dificil", "greu", "hard", "easy", "medium",
        "легко", "средний", "тяжело", "сложно" , "toate", "all"
    ]
    text = text.lower()
    
    cuvinte = text.split()
    
    for cuvant in cuvinte:
        rezultat = process.extractOne(cuvant, dificultati_posibile, scorer=fuzz.partial_ratio)
        if rezultat and rezultat[1] >= 70:
            return rezultat[0]
    
    return None

niveluri_acceptate = {
    "usor", "mediu", "dificil", "toate",
    "легко", "средний", "сложно", "все",
    "invalid"
}

def filtreaza_tururi_dupa_dificultate(tururi_text, dificultate_text, language):
    prompt = (
        f"Utilizatorul a spus: \"{dificultate_text}\".\n"
        "Analizează răspunsul pentru a identifica cel mai apropiat nivel de dificultate menționat.\n"
        "Nivelurile posibile și sinonimele/expresiile echivalente sunt:\n"
        "\n"
        "- usor (ex: usor, ușor, easy, новичок, легко, базовый, начальный, basic, ușurel)\n"
        "- mediu (ex: mediu, medium, mijlociu, moderat, intermediar, средний, средничок, на среднем уровне)\n"
        "- dificil (ex: dificil, greu, hard, сложно, тяжело, продвинутый, avansat)\n"
        "- toate (ex: toate, all, все, все уровни, indiferent de nivel, nu contează, без разницы, любой)\n"
        "\n"
        "Răspunde STRICT și DOAR cu unul dintre cuvintele: \n"
        "usor, mediu, dificil, toate (în română) sau \n"
        "легко, средний, сложно, все (în rusă), \n"
        "în funcție de limba și sinonimul găsit.\n"
        "Dacă nu identifici clar niciun nivel, răspunde DOAR cu: INVALID.\n"
        "\n"
        "Nu adăuga explicații, nici alte texte, răspunde doar cu nivelul ales sau INVALID.\n"
        "\n"
        "Exemple:\n"
        "\"Vreau un traseu ușor\" -> usor\n"
        "\"Средничок или что-то лёгкое\" -> легко\n"
        "\"Не знаю пока\" -> INVALID\n"
        "\"Depinde de traseu\" -> INVALID\n"
        "\"Без разницы какой\" -> все\n"
        "\"Наверное, сложный уровень подойдёт\" -> сложно\n"
    )

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0,
        max_tokens=10,
    )

    raspuns = response.choices[0].message.content.strip().lower()

    if raspuns not in niveluri_acceptate:
        raspuns = "invalid"

    if raspuns != "invalid":
        dificultate_preferata = raspuns
    else:
        dificultate_preferata = extrage_dificultate(dificultate_text)
        if not dificultate_preferata:
            return "Nu am putut identifica dificultatea preferată."

    ordinea_dificultatii = {
        "usor": 1,
        "ușor": 1,
        "mediu": 2,
        "dificil": 3,
        "greu": 3,
        "hard": 3,
        "easy": 1,
        "medium": 2,
        "легко": 1,
        "средний": 2,
        "тяжело": 3,
        "сложно": 3,
        "toate": 0,
        "all": 0,
        "все": 0,
        "все уровни": 0,
        "все уровни": 0,
        "toate": 0
    }

    if language == "RO":
        tururi = re.split(r'\n(?=\s*- Titlu:)', tururi_text.strip())
    elif language == "RU":
        tururi = re.split(r'\n(?=\s*- Название:)', tururi_text.strip())
    else:
        tururi = re.split(r'\n(?=\s*-\s*(?:Nume|Название|Name):)', tururi_text.strip())
    tururi_filtrate = []

    if dificultate_preferata in ["toate", "all", "все"]:
        return "\n\n".join(tururi)

    dificultati_posibile = [
        "usor", "ușor", "mediu", "dificil", "greu", "hard", "easy", "medium",
        "легко", "средний", "тяжело", "сложно", "toate", "all"
    ]

    for tur in tururi:
        for linie in tur.split("\n"):
            if ("dificultate" in linie.lower()) or ("сложность" in linie.lower()):
                dificultate_text_linie = linie.split(":", 1)[1].strip().lower()

                cuvinte_dificultate = dificultate_text_linie.split()
                rezultat_maxim = ("", 0)

                for cuvant in cuvinte_dificultate:
                    rezultat = process.extractOne(cuvant, dificultati_posibile, scorer=fuzz.partial_ratio)
                    if rezultat and rezultat[1] > rezultat_maxim[1]:
                        rezultat_maxim = rezultat

                dificultate_identificata = rezultat_maxim[0] if rezultat_maxim[1] >= 70 else None

                if dificultate_identificata and \
                    ordinea_dificultatii.get(dificultate_identificata, 99) == ordinea_dificultatii.get(dificultate_preferata, 99):
                    tururi_filtrate.append(tur)

                break

    if not tururi_filtrate:
        return "Nu există tururi pentru dificultatea specificată."

    return "\n\n".join(tururi_filtrate)

def extrage_numar_zile(text_durata):
    prompt = f"""
    Găsește și returnează cel mai mare număr din textul de mai jos, chiar dacă este scris cu litere,
    în română sau rusă. Răspunde DOAR cu acel număr, în cifre.

    Text:
    "{text_durata}"

    Dacă nu există niciun număr în text, răspunde cu 9999.
    Nu oferi explicații, doar răspunde cu numărul.
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0,
        max_tokens=10,
    )
    raspuns = response.choices[0].message.content.strip()

    try:
        numar = int(re.findall(r'\d+', raspuns)[0])
        return numar
    except:
        return 9999
    
def decide_filtrare_chatgpt(text):
    prompt = f"""
Analizează următorul text și determină dacă utilizatorul exprimă un filtru de tip:
- "minim" (ex: „cel puțin 15 zile”, „peste 15 zile”)
- "maxim" (ex: „până la 15 zile”, „sub 15 zile”)
- "neutru" (nu este clar dacă e minim sau maxim)

📌 Dacă textul este în limba rusă, folosește aceeași logică:
- "minim" (например: "не менее 15 дней", "от 15 дней")
- "maxim" (например: "до 15 дней", "меньше 15 дней")
- "neutru" — если направление фильтрации не ясно.

Text: "{text}"

Răspunde DOAR cu unul dintre cuvintele: minim, maxim, neutru.
Ответь ТОЛЬКО одним из слов: minim, maxim, neutru.
"""

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        temperature=0,
        max_tokens=10,
    )
    raspuns = response.choices[0].message.content.strip()
    return raspuns.strip().lower()


def filtreaza_tururi_dupa_durata(tururi_text, durata_max_text, language):
    durata_max = extrage_numar_zile(durata_max_text)

    if language == "RO":
        tururi = re.split(r'\n(?=\s*- Titlu:)', tururi_text.strip())
        durata_pattern = r'durată\s*:\s*(.+)'
    elif language == "RU":
        tururi = re.split(r'\n(?=\s*- Название:)', tururi_text.strip())
        durata_pattern = r'продолжительность\s*:\s*(.+)'
    else:
        tururi = re.split(r'\n(?=\s*-\s*(?:Nume|Название|Name):)', tururi_text.strip())
        durata_pattern = r'(?:durată|продолжительность|duration)\s*:\s*(.+)'

    tururi_filtrate = []

    for tur in tururi:
        match = re.search(durata_pattern, tur, flags=re.IGNORECASE)
        if match:
            
            durata_text = match.group(1).strip()
            zile_tur = extrage_numar_zile(durata_text)
            if zile_tur <= durata_max:
                tururi_filtrate.append(tur)


    if not tururi_filtrate:
        return "Nu există tururi care să se încadreze în durata specificată."

    return "\n\n".join(tururi_filtrate)

# -------------------- Preferințele utilizatorului --------------------
# preferinte = {
#     "regiune": "vreau in romania",
#     "anotimp": "Vreau in vara",
#     "durata_max": "pana la 15 zile ",
#     "dificultate": "mediu",
#     "buget": "pana 200 euro",
# }


def create_preferinte_text(preferinte):
    preferinte_text = (
        f"Regiune: {preferinte['regiune']}\n"
        f"Anotimp: {preferinte['anotimp']}\n"

        f"Durata maximă: {preferinte['durata_max']} zile\n"
        f"Dificultate: {preferinte['dificultate']}\n"
        f"Buget: {preferinte['buget']} euro\n"
    )
    return preferinte_text
        

# -------------------- Citire fișier CSV --------------------
df = pd.read_csv("chatbot_LumeaTa/chatBot/tururi-3.csv", header=1)
print(df)
df.columns = df.columns.str.strip()
df_ro = df[df["Limba"].str.strip().str.lower() == "ro"]

def read_csv(language):
    df = pd.read_csv("tururi-3.csv", header=1)
    df.columns = df.columns.str.strip()
    if language == "RO":
        df_lan = df[df["Limba"].str.strip().str.lower() == "ro"]
    elif language == "RU":
        df_lan = df[df["Limba"].str.strip().str.lower() == "ru"]
    else:
        df_lan = df
    return df_lan

tururi_text = ""
for _, row in df_ro.iterrows():
    tururi_text += (
        f"- Titlu: {row['Nume tur']}\n"
        f"  Locatie: {row['Locație']}\n"
        f"  Date: {row['Date']}\n"
        f"  Durată: {row['Durată']}\n"
        f"  Dificultate: {row['Nivel dificultate']}\n"
        f"  Preț: {row['Preț (EUR)']} EUR\n"
        f"  Locuri disponibile: {row['Locuri disponibile']}\n"
        f"  Inclus în preț: {row['Inclus în preț']}\n"
        f"  Suplimentar: <br>{row['CE SĂ AI CU TINE:']}\n"
        f"  Link: {row['Link pe FB']}\n\n"
    )

def proccess_tururi(df, language="RO"):
    tururi_text = ""
    language = language
    print("language = " , language)
    for _, row in df.iterrows():

        if language == "RO":
            tururi_text += (
                f"- Titlu: {row['Nume tur']}\n"
                f"  Locatie: {row['Locație']}\n"
                f"  Date: {row['Date']}\n"
                f"  Durată: {row['Durată']}\n"
                f"  Dificultate: {row['Nivel dificultate']}\n"
                f"  Preț: {row['Preț (EUR)']} EUR\n"
                f"  Locuri disponibile: {row['Locuri disponibile']}<br>\n"
                f"  Inclus în preț: {row['Inclus în preț']}<br>\n"
                f"  Suplimentar: <br>{row['CE SĂ AI CU TINE:']}<br>\n"
                f"  Link: {row['Link pe FB']}\n\n"
            )
        elif language == "RU":
            # print(row['Nume tur'])
            tururi_text += (
                f"- Название: {row['Nume tur']}\n"
                f"  Локация: {row['Locație']}\n"
                f"  Даты: {row['Date']}\n"
                f"  Продолжительность: {row['Durată']}\n"
                f"  Сложность: {row['Nivel dificultate']}\n"
                f"  Цена: {row['Preț (EUR)']} EUR\n"
                f"  Свободные места: {row['Locuri disponibile']}<br>\n"
                f"  Включено в стоимость: {row['Inclus în preț']}<br>\n"
                f"  Дополнительно: <br>{row['CE SĂ AI CU TINE:']}<br>\n"
                f"  Ссылка: {row['Link pe FB']}\n\n"
            )

        else:
            raise ValueError("Limba necunoscută. Folosește 'RO' sau 'RU'.")

    return tururi_text



def extrage_titluri_din_text(text):
    tururi = text.strip().split("\n\n")
    titluri = set()
    for tur in tururi:
        for linie in tur.split("\n"):
            if "- titlu:" in linie.lower() or "- название:" in linie.lower():
                titluri.add(linie)
                break
    return titluri


from datetime import datetime

def chat_with_openai(messages, temperature=0.7, max_tokens=100):
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        temperature=temperature,
        max_tokens=max_tokens
    )
    return response.choices[0].message.content.strip()


def extrage_data_cu_ai(tur):
    messages = [
        {
            "role": "system",
            "content": (
                "Ești un asistent care extrage doar data dintr-un text care descrie un tur turistic. "
                "Returnează doar data în formatul 'DD.MM.YYYY', fără alte explicații sau text. "
                "Dacă nu găsești nicio dată în text, scrie 'NU'."
            )
        },
        {
            "role": "user",
            "content": f"Tur:\n{tur}"
        }
    ]

    raspuns = chat_with_openai(messages, temperature=0.0, max_tokens=10)

    try:
        data_str = raspuns.strip()
        if data_str == "NU":
            return datetime.max
        return datetime.strptime(data_str, "%d.%m.%Y")
    except:
        return datetime.max

def without_filters(tururi_text, language):
    print("language == " , language)
    if language == "RO":
        tururi_listate = re.split(r'\n(?=\s*- Titlu:)', tururi_text.strip())
    elif language == "RU":
        tururi_listate = re.split(r'\n(?=\s*- Название:)', tururi_text.strip())
    else:
        tururi_listate = re.split(r'\n(?=\s*-\s*(?:Nume|Название|Name):)', tururi_text.strip())
    tururi = []

    def extrage_data(tur):
        return extrage_data_cu_ai(tur)

    tururi_sortate = sorted(tururi_listate, key=extrage_data)


    if language == "RO":
        prefix = "<br> 📅 Tur recomandat: "
        separator = "<br>"
    elif language == "RU":
        prefix = "<br> 📅 Рекомендуемый тур: "
        separator = "<br>"
    else:
        prefix = "<br>📅 Recommended tour: "
        separator = "<br>"

    for tur in tururi_sortate[:4]:
        tur_sort = ""
        tur_sort += prefix + "<br> \n"
        tur_sort += separator
        linii = tur.strip().split("\n")
        for linie in linii:
            if linie.strip():
                tur_sort += linie.strip() + "<br> \n"
        tur_sort += "<br>----------------------------------" + "<br> \n"
        tururi.append(tur_sort)
        
    if language == "RO":
        tururi.append("\n <br> Mai multe detalii puteti vedea pe site-ul nostru! <br><br>Doresti sa rezervi un loc? Da / Nu\n")
    if language == "RU":
        tururi.append("\n <br> Подробнее вы можете узнать на нашем сайте! <br><br>Хотите забронировать место? Да / Нет\n")

    return tururi

def aplica_filtrele(tururi_text, preferinte , language):
    text_anotimp = filtreaza_tururi_dupa_anotimp(tururi_text, preferinte["anotimp"],language)
    text_regiune = filtreaza_tururi_dupa_regiune(tururi_text, preferinte["regiune"], language)
    text_buget = filtreaza_tururi_dupa_buget_maxim(tururi_text, preferinte["buget"], language)
    text_dificultate = filtreaza_tururi_dupa_dificultate(tururi_text, preferinte["dificultate"], language)
    text_durata = filtreaza_tururi_dupa_durata(tururi_text, preferinte["durata_max"], language)

    not_preferinta = ""
    counter = 5

    if language == "RO":
        if "Nu exist" in text_anotimp:
            print("Nu există preferință legată de anotimp")
            not_preferinta += "Nu există preferință legată de anotimp,\n"
            counter -= 1
        if "Nu exist" in text_regiune:
            print("Nu există preferință legată de regiune")
            not_preferinta += "Nu există preferință legată de regiune,\n"
            counter -= 1
        if "Nu exist" in text_buget:
            print("Nu există preferință legată de buget")
            not_preferinta += "Nu există preferință legată de buget,\n"
            counter -= 1
        if "Nu exist" in text_dificultate:
            print("Nu există preferință legată de dificultate")
            not_preferinta += "Nu există preferință legată de dificultate,\n"
            counter -= 1
        if "Nu exist" in text_durata:
            print("Nu există preferință legată de durată\n\n")
            not_preferinta += "Nu există preferință legată de durată,\n"
            counter -= 1

    elif language == "RU":
        if "Nu exist" in text_anotimp:
            print("Нет предпочтения по времени года")
            not_preferinta += "Нет предпочтения по времени года,\n"
            counter -= 1
        if "Nu exist" in text_regiune:
            print("Нет предпочтения по региону")
            not_preferinta += "Нет предпочтения по региону,\n"
            counter -= 1
        if "Nu exist" in text_buget:
            print("Нет предпочтения по бюджету")
            not_preferinta += "Нет предпочтения по бюджету,\n"
            counter -= 1
        if "Nu exist" in text_dificultate:
            print("Нет предпочтения по сложности")
            not_preferinta += "Нет предпочтения по сложности,\n"
            counter -= 1
        if "Nu exist" in text_durata:
            print("Нет предпочтения по длительности\n\n")
            not_preferinta += "Нет предпочтения по длительности,\n"
            counter -= 1

    tururi_formatate = []
    tururi_formatate_0 = []
    tururi_formatate.append(not_preferinta)
    if counter == 0:
        if language == "RO":
            mesaj_intro = "Nu s-a găsit nicio potrivire clară. Îți arătăm cele mai apropiate tururi disponibile:\n"
            eticheta_tur = "📅 Tur recomandat: <br>\n"
        elif language == "RU":
            mesaj_intro = "Не найдено точных совпадений. Вот наиболее подходящие туры:\n"
            eticheta_tur = "📅 Рекомендуемый тур: <br>\n"
        else:
            mesaj_intro = "No exact match found. Here are the closest available tours:\n"
            eticheta_tur = "📅 Recommended tour: <br>\n"

        print(mesaj_intro)
        tururi_formatate_0.append(mesaj_intro)

        if language == "RO":
            tururi_listate = re.split(r'\n(?=\s*- Titlu:)', tururi_text.strip())
        elif language == "RU":
            tururi_listate = re.split(r'\n(?=\s*- Название:)', tururi_text.strip())

        def extrage_data(tur):
            return extrage_data_cu_ai(tur)

        tururi_sortate = sorted(tururi_listate, key=extrage_data)
        
        for tur in tururi_sortate[:5]:  # arătăm primele 5
            tur_sort = ""
            print(eticheta_tur.strip())
            tur_sort += eticheta_tur
            print("--------------------------- <br>")
            tur_sort += "<br>----------------------------------" + "<br> \n"
            for linie in tur.strip().split("\n"):
                print(linie.strip())
                tur_sort += linie.strip() + "<br>"
            print("---------------------------<br>\n")
            tur_sort += "<br>----------------------------------" + "<br> \n"
            tururi_formatate_0.append(tur_sort)

        return tururi_formatate_0


    print("Putem să îți recomandăm următoarele:\n")

    titluri1 = extrage_titluri_din_text(text_anotimp)
    titluri2 = extrage_titluri_din_text(text_regiune)
    titluri3 = extrage_titluri_din_text(text_buget)
    titluri4 = extrage_titluri_din_text(text_dificultate)
    titluri5 = extrage_titluri_din_text(text_durata)

    toate_titlurile = list(titluri1) + list(titluri2) + list(titluri3) + list(titluri4) + list(titluri5)

    contor = Counter(toate_titlurile)
    min_aparitii = counter
    titluri_frecvente = {titlu for titlu, count in contor.items() if count >= min_aparitii}

    if language == "RO":
        tururi_listate = re.split(r'\n(?=\s*- Titlu:)', tururi_text.strip())
    elif language == "RU":
        tururi_listate = re.split(r'\n(?=\s*- Название:)', tururi_text.strip())

    for titlu in titluri_frecvente:
        for tur in tururi_listate:
            if titlu.lower() in tur.lower():
                if language == "RO":
                    tur_formatat = "<br> 🌄 Tur: <br>\n"
                    for linie in tur.strip().split("\n"):
                        tur_formatat += linie.strip() + "<br> \n"
                    tur_formatat += "<br> --------------------------- <br>\n"

                elif language == "RU":
                    tur_formatat = "<br> 🌄 Тур: <br>\n"
                    for linie in tur.strip().split("\n"):
                        tur_formatat += linie.strip() + "<br> \n"
                    tur_formatat += "<br> --------------------------- <br>\n"

                else:
                    tur_formatat = "<br> 🌄 Tour: <br>\n "
                    for linie in tur.strip().split("\n"):
                        tur_formatat += linie.strip() + "\n"
                    tur_formatat += "<br> --------------------------- <br>\n"

                tururi_formatate.append(tur_formatat)
                break
    return tururi_formatate

