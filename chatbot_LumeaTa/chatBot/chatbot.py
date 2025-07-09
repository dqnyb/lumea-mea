import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
import openai
import random
from langchain_experimental.agents.agent_toolkits import create_csv_agent
from langchain.agents.agent_types import AgentType
from langchain.chat_models import ChatOpenAI
from langchain.agents import AgentExecutor
import pandas as pd
import re
import exemple
from exemple import create_preferinte_text
from exemple import read_csv
from exemple import proccess_tururi
from exemple import aplica_filtrele
from exemple import without_filters
from flask import Flask, request, jsonify, session
from rapidfuzz import fuzz, process
from datetime import datetime
import requests 

load_dotenv()


TELEGRAM = os.getenv("TELEGRAM_API_KEY")
CHAT_ID = os.getenv("CHAT_ID")

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise RuntimeError("OPENAI_API_KEY environment variable is not set")

openai.api_key = OPENAI_API_KEY

app = Flask(__name__, static_folder="frontend")
app.secret_key = os.getenv("FLASK_SECRET_KEY")

CORS(app)

chat_log_str = ""

preferinte = {}
saved = {}
language_saved = ""


def traduce_preferinte(preferinte):
    preferinte_traduse = {}

    for cheie, valoare in preferinte.items():
        mesaj = [
            {"role": "system", "content": "Tradu următoarea valoare în limba română, menținând sensul inițial și adaptând la contextul turismului în România."},
            {"role": "user", "content": f"Valoare: '{valoare}'"}
        ]

        valoare_tradusa = chat_with_openai(mesaj)
        preferinte_traduse[cheie] = valoare_tradusa

    return preferinte_traduse



def log_message(sender, message):

    base_dir = os.path.expanduser("../logs")
    os.makedirs(base_dir, exist_ok=True)
    file_path = os.path.join(base_dir, "chat_log1.xlsx")

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    new_row = {"Timestamp": timestamp, "Sender": sender, "Message": message}

    try:
        if os.path.exists(file_path):
            df = pd.read_excel(file_path)
            df = pd.concat([df, pd.DataFrame([new_row])], ignore_index=True)
        else:
            df = pd.DataFrame([new_row])

        df.to_excel(file_path, index=False)
        print(f"[{timestamp}] [LOGGED] {sender}: {message}")
    except Exception as e:
        print(f"[EROARE] Logarea a eșuat: {e}")



def chat_with_openai(messages, temperature=0.7, max_tokens=100):
    response = openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        temperature=temperature,
        max_tokens=max_tokens
    )
    return response.choices[0].message.content.strip()

def chat_with_openai_0(prompt):
    response = openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "user", "content": prompt}
        ],
        temperature=0,
        max_tokens=20
    )
    return response.choices[0].message.content.strip()

def check_rag(user_response: str) -> str:
    text = user_response.lower()
    # Cuvinte cheie română
    keywords_evenimente_ro = [
        "evenimente", "eveniment", "optiuni", "opțiuni", "optiune", "opțiune",
        "tot", "toate", "toată", "toată oferta", "lista", "listă", "lista de oferte",
        "catalog", "program", "agenda", "ce este", "ce oferiti", "ce oferte", "ce oferiți",
        "vreau tot", "vreau toate", "vreau lista", "vreau să văd", "arata toate", "arată toate",
        "toate opțiunile", "toate evenimentele", "toate ofertele", "toate variantele",
        "toate posibilitățile", "tot ce aveți", "ce aveți", "toate activitățile",
        "lista completă", "tot ce oferiți", "ce mai e", "mai multe opțiuni", "mai multe evenimente"
    ]

    keywords_evenimente_ru = [
        "события", "событие", "варианты", "опции", "опция", "все", "всё", "все варианты",
        "все опции", "все события", "весь список", "весь каталог", "вся программа",
        "покажи все", "покажите все", "хочу все", "хочу все варианты", "все предложения",
        "все возможности", "все активности", "что есть", "что у вас есть", "все доступные",
        "весь перечень", "весь список событий", "все мероприятия", "полный список",
        "все доступные опции", "покажи мне все", "покажите мне все", "хочу увидеть все"
    ]

    if any(word in text for word in keywords_evenimente_ro):
        return "EVENIMENTE"
    if any(word in text for word in keywords_evenimente_ru):
        return "EVENIMENTE"
    
    prompt = (
        f"Clasifică intenția utilizatorului pe baza răspunsului: \"{user_response}\"\n"
        "Răspunde exact cu unul dintre aceste cuvinte: DA, EVENIMENTE, REZERVA, ALTCEVA.\n"
        "Reguli / Правила:\n"
        "- DA / ДА: dacă utilizatorul dorește să continue, confirmă afirmativ.\n"
        "- EVENIMENTE / СОБЫТИЯ: dacă utilizatorul exprimă interes pentru evenimente sau opțiuni,\n"
        "  sau dacă răspunsul este negativ, de exemplu „nu” / „нет” sau sinonimele lor, în orice formă.\n"
        "- REZERVA / РЕЗЕРВ: dacă utilizatorul exprimă intenția clară de a rezerva un loc sau o comandă,\n"
        "  prin cuvinte ca „rezerv”, „rezervare”, „vreau să rezerv”, „da, rezerv”, „да, забронировать” și altele similare.\n"
        "- ALTCEVA / ДРУГОЕ: pentru orice altceva care nu este mai sus.\n\n"
        "IMPORTANT: Orice răspuns care conține doar „nu”, „нет” sau sinonimele lor, trebuie să fie clasificat întotdeauna ca EVENIMENTE.\n\n"
        "Exemple / Примеры:\n"
        "\"Da\" -> DA\n"
        "\"Sigur, să continuăm\" -> DA\n"
        "\"Sunt interesat de evenimente\" -> EVENIMENTE\n"
        "\"Nu\" -> EVENIMENTE\n"
        "\"Нет\" -> EVENIMENTE\n"
        "\"Никаких\" -> EVENIMENTE\n"
        "\"Ни за что\" -> EVENIMENTE\n"
        "\"Ce oferte aveți?\" -> ALTCEVA\n"
        "\"Să începem\" -> DA\n"
        "\"Haide\" -> DA\n"
        "\"Hai\" -> DA\n"
        "\"Да\" -> DA\n"
        "\"Конечно, давайте продолжим\" -> DA\n"
        "\"Меня интересуют события\" -> EVENIMENTE\n"
        "\"Какие у вас есть предложения?\" -> ALTCEVA\n"
        "\"Начнем\" -> DA\n"
        "\"Поехали\" -> DA\n"
        "\"Старт\" -> DA\n"
        "\"Vreau să rezerv un loc\" -> REZERVA\n"
        "\"Da, vreau să rezerv\" -> REZERVA\n"
        "\"Да, забронировать\" -> REZERVA\n"
        "\"Rezervare te rog\" -> REZERVA\n"
        "\"Aș dori să fac o rezervare\" -> REZERVA\n"
        "Răspunsul trebuie să fie un singur cuvânt, exact unul dintre DA, EVENIMENTE, REZERVA, ALTCEVA."
    )


    messages = [
        {"role": "system", "content": "Ești un clasificator strict care răspunde doar cu DA, EVENIMENTE sau ALTCEVA."},
        {"role": "user", "content": prompt}
    ]
    try:
        answer = chat_with_openai(messages, temperature=0, max_tokens=10)
        answer = answer.strip().upper()
        if answer in {"DA", "EVENIMENTE", "ALTCEVA" , "REZERVA"}:
            return answer
        else:
            return "ALTCEVA"
    except Exception as e:
        print(f"[EROARE] check_rag failed: {e}")
        return "ALTCEVA"

    
def check_language(user_response: str) -> str:
    prompt = (
        f'Utilizatorul a scris: "{user_response}".\n'
        "Trebuie să determini în ce limbă dorește să continue conversația: română (RO) sau rusă (RU).\n\n"
        "Ia în considerare și expresii vagi, regionale, greșite sau colocviale. De exemplu:\n"
        "- Pentru română: „român”, „moldovenească”, „scrie în limba mea”, „romana fără diacritice”, „scrie normal”, „limba de aici”, „ca acasă”, etc.\n"
        "- Pentru rusă: „русский”, „румынский язык нет”, „по-русски”, „по нашему”, „российский”, „кирилица”, „давай по твоему”, etc.\n\n"
        "Acceptă și mesaje fără diacritice, cu greșeli sau în alfabetul greșit.\n\n"
        "Chiar dacă nu există indicii clare despre limba dorită, alege întotdeauna LIMBA cea mai probabilă dintre română (RO) sau rusă (RU).\n\n"
        "Răspunde STRICT cu una dintre cele două opțiuni, fără explicații:\n"
        "- RO\n"
        "- RU\n\n"
        "Exemple:\n"
        "\"scrie ca la țară\" -> RO\n"
        "\"давай по-нашему\" -> RU\n"
        "\"romana\" -> RO\n"
        "\"rusa\" -> RU\n"
        "\"moldoveneasca\" -> RO\n"
        "\"русский\" -> RU\n"
        "\"nu conteaza\" -> RO\n"
        "\"ce vrei tu\" -> RO\n"
        "\"cine e messi?\" -> RO\n\n"
        "Răspuns final:"
    )

    response = chat_with_openai_0(prompt)
    response = response.strip().upper()
    if response in {"RO", "RU"}:
        return response
    return "RO"



@app.route("/language", methods=["GET"])
def language():
    message = "👋 Bună ziua! Vă salută echipa Lumea Ta ( Здравствуйте! Вас приветствует команда Lumea Ta ) <br><br> Vă rugăm să selectați limba preferată (Пожалуйста, выберите предпочитаемый язык ) : 🇷🇴 Română | 🇷🇺 Русский";
    return jsonify({"ask_name": message})

@app.route("/start", methods=["GET", "POST"])
def start():
    user_data = request.get_json()
    response = user_data.get("name", "prieten")
    # print(response)
    # print("response = " , response)
    check_language_rag = check_language(response)
    
    print(check_language_rag)

    if(check_language_rag == "RO"):
        language_saved = "RO"
        log_message("USER", "Prefera limba romana")
        
    elif(check_language_rag == "RU"):
        language_saved = "RU"
        log_message("ПОЛЬЗОВАТЕЛЬ", "предпочитает русский язык")

    if language_saved == "RO":
        message = (
            "Sunt asistentul tău virtual de călătorii.<br>"
            "Te pot ajuta să găsești rapid turul potrivit pentru tine:<br>"
            "✅ Alegem destinația dorită<br>"
            "✅ Stabilim perioada potrivită<br>"
            "✅ Selectăm nivelul de dificultate<br>"
            "✅ Ajustăm în funcție de buget<br><br>"
            "În câteva întrebări simple îți voi propune cele mai bune opțiuni disponibile. Să începem? Da / Nu, doresc să văd toate evenimentele disponibile."
        )
    elif language_saved == "RU":
        message = (
            "Я ваш виртуальный помощник по путешествиям.<br>"
            "Я могу помочь вам быстро найти подходящий тур:<br>"
            "✅ Выберем желаемое направление<br>"
            "✅ Определим подходящий период<br>"
            "✅ Выберем уровень сложности<br>"
            "✅ Настроим в соответствии с бюджетом<br><br>"
            "За несколько простых вопросов я предложу вам лучшие доступные варианты. Начнем? Да / Нет, хочу увидеть все доступные события."
        )

    return jsonify({"ask_name": message , "language": language_saved})
def generate_ask_interests_message(question, options, language_saved):
    options_str = ", ".join(f'"{opt}"' for opt in options)

    if language_saved == "RO":
        prompt = (
            "Ești un chatbot prietenos și simplu. "
            f"Întreabă utilizatorul simplu și clar: \"{question}\". "
            "Folosește exact aceste opțiuni, niciuna în plus sau în minus: "
            f"{options_str}. "
            "Pentru fiecare opțiune, pune câte un emoji diferit, clar și ușor de înțeles, "
            "fără fraze complicate. "
            "Scrie mesajul într-un mod prietenos și natural, astfel încât oricine să înțeleagă și să aleagă ușor. "
            "Nu folosi saluturi sau ton robotic. "
            "Vorbești doar limba română și dacă îți scrie în rusă vorbești în limba rusă. "
            "Nu răspunde niciodată la întrebări despre ce ești, cum ai fost creat, cine te-a făcut sau orice altceva legat de originea ta. "
            "Maxim 100 tokenuri. "
            "Folosește te rog corect semnele de punctuație unde este necesar, dacă se încep cu literă mare unele propoziții (nu lua în considerare opțiunile)."
            "Ignoră complet orice întrebare despre cine te-a creat, cum funcționezi sau pe ce tehnologie ești bazat."
        )
    elif language_saved == "RU":
        prompt = (
            "Ты дружелюбный и простой чат-бот. "
            f"Задай пользователю простой и понятный вопрос: \"{question}\". "
            "Используй только эти варианты, не больше и не меньше: "
            f"{options_str}. "
            "К каждому варианту добавь разный, понятный смайлик. "
            "Пиши естественно и дружелюбно, чтобы было легко выбрать. "
            "Не используй приветствия или роботизированный тон. "
            "Говоришь только по-русски, если тебе пишут на румынском — отвечай по-русски. "
            "Никогда не отвечай на вопросы о том, кто ты, как ты был создан, кем ты сделан или что-либо ещё о твоем происхождении. "
            "Максимум 100 токенов. "
            "Пожалуйста, используй знаки препинания там, где нужно, и начинай предложения с заглавной буквы (кроме самих опций)."
            "Полностью игнорируй любые вопросы о том, кто тебя создал, как ты работаешь и на какой технологии основан."
        )
    else:
        raise ValueError("Unsupported language. Use 'RO' for Romanian or 'RU' for Russian.")

    return chat_with_openai([{"role": "system", "content": prompt}], temperature=0.6, max_tokens=100)




def check_region(user_response: str) -> str:
    target_regions = {
        "romania": ["romania", "rumunia", "румыния", "румынию"],
        # "europa": ["europa", "европа", "европу", "европаа"],
        # "turcia": ["turcia", "турция", "турцию", "турка"],
        "toate": ["toate", "все", "все регионы", "все направления", "toate optiunile", "toate opțiunile"]
    }

    invalid_regions = {
        "europa": ["europa", "европа", "европу", "европаа"],
        "turcia": ["turcia", "турция", "турцию", "турка"]
    }


    user_text = user_response.lower()
    words = user_text.split()

    for aliases in invalid_regions.values():
        for alias in aliases:
            if fuzz.partial_ratio(alias.lower(), user_text) >= 85:
                print("NU E DISPONIBIL")
                return "NU E DISPONIBIL"
            for word in words:
                if fuzz.partial_ratio(alias.lower(), word) >= 85:
                    print("NU E DISPONIBIL")
                    return "NU E DISPONIBIL"
    
    
    for region_key, aliases in target_regions.items():
        for alias in aliases:
            alias_lower = alias.lower()

            # Verificare pe întregul text
            if fuzz.partial_ratio(alias_lower, user_text) >= 85:
                print("DA")
                return "DA"

            # Verificare pe fiecare cuvânt
            for word in words:
                if fuzz.partial_ratio(alias_lower, word) >= 85:
                    print("DA")
                    return "DA"


    print("ACUM DEPINDE DE PROMPT ---- ")

    prompt = (
        f'Utilizatorul a răspuns: "{user_response}".\n'
        "Verifică dacă răspunsul conține clar DOAR una dintre următoarele alegeri valide: România (Румыния) \n"
        "Dacă utilizatorul alege orice altă regiune (precum Europa, Turcia sau altă țară), atunci NU este valid — returnează NU E DISPONIBIL.\n"
        "Acceptă formulări în română sau rusă, cu sau fără diacritice, majuscule/minuscule, sinonime sau expresii echivalente.\n"
        "Acceptă și greșeli de tastare sau forme aproximative, dacă cel puțin 70% din cuvânt seamănă clar cu numele unei regiuni și sensul este evident.\n"
        "\n"
        "Exemple ACCEPTATE (răspunde cu VALID):\n"
        "- „vreau să merg în România”\n"
        "- „rumunia” (greșit scris, dar clar înțeles)\n"
        "- „в Румынию”\n"
        "\n"
        "Exemple cu altă regiune decât România sau Toate (răspunde cu NU E DISPONIBIL):\n"
        "- „Europa”\n"
        "- „Turcia”\n"
        "- „в Европу”\n"
        "- „поехать в Турцию”\n"
        "- „турка”\n"
        "- „европа”\n"
        "\n"
        "Exemple RESPINSE complet (răspunde cu INVALID):\n"
        "- „Asia”\n"
        "- „Undeva în vest”\n"
        "- „Olanda”\n"
        "- „в Таиланд”\n"
        "- „nu știu”\n"
        "- „alege tu”\n"
        "- „nu contează”\n"
        "- „unde e cald”\n"
        "\n"
        "Răspunde STRICT cu:\n"
        "- VALID — dacă este clar că utilizatorul a menționat sau a vrut să menționeze România , VALID este doar legat de Romania\n"
        "- NU E DISPONIBIL — dacă a fost menționată clar altă regiune decât România sau Toate.\n"
        "- INVALID — dacă nu e clar deloc la ce se referă utilizatorul sau nu are legătură cu nicio regiune.\n"
        "\n"
        "Răspunde doar cu VALID, NU E DISPONIBIL sau INVALID."
    )


    messages = [
        {"role": "system", "content": "Ești un asistent care răspunde doar cu 'VALID' sau 'INVALID'."},
        {"role": "user", "content": prompt}
    ]

    try:
        answer = chat_with_openai(messages, temperature=0, max_tokens=20)
        answer = answer.strip().upper()
        print(f"acestea este answerul promptului = {answer}")
        if answer == "VALID":
            return "DA"
        elif answer == "NU E DISPONIBIL":
            return "Inca nu e disponibila tara ( IN PROGRES ) ! Te rog să alegi din urmatoaterele tari disponibile : România"
        else:
            return "Te rog să alegi o regiune validă: România, Europa, Turcia sau Toate."
    except Exception as e:
        print(f"[EROARE] check_region failed: {e}")
        return "Te rog să alegi o regiune validă: România, Europa, Turcia sau Toate."


def check_duration_ai(user_response: str) -> str:
    prompt = (
        f"Utilizatorul a spus: \"{user_response}\".\n\n"
        "Încearcă să interpretezi durata călătoriei chiar dacă este exprimată vag sau în limbaj natural, "
        "în română sau rusă (ex: 'un weekend', 'cam două săptămâni', 'vreau o escapadă scurtă', "
        "'на выходные', 'около недели', 'пара недель', 'долгое путешествие', 'до 10 дней').\n\n"
        "Încadrează răspunsul într-una dintre următoarele categorii stricte:\n"
        "- 1-3   (pentru călătorii foarte scurte: weekend, city break, „на пару дней”, „на выходные”)\n"
        "- 4-8   (pentru o săptămână sau puțin peste: „o săptămână”, „около недели”, „7 дней”, „до недели”)\n"
        "- 9-15  (pentru „două săptămâni”, „cam 10-12 zile”, „пара недель”, „до 10 дней”)\n"
        "- 15+   (pentru orice durată mai mare de 15 zile: „câteva săptămâni”, „luna viitoare”, „долгое путешествие”, „на месяц”)\n\n"
        "IMPORTANT: Răspunde STRICT cu unul dintre următoarele, fără alte explicații:\n"
        "- 1-3\n"
        "- 4-8\n"
        "- 9-15\n"
        "- 15+\n"
        "- INVALID (dacă nu se înțelege durata din răspunsul utilizatorului)\n\n"
        "Exemple:\n"
        "\"Un weekend la munte\" -> 1-3\n"
        "\"Cam o săptămână\" -> 4-8\n"
        "\"Două săptămâni în Italia\" -> 9-15\n"
        "\"Vreau să plec o lună\" -> 15+\n"
        "\"Vedem mai târziu\" -> INVALID\n"
        "\"На выходные в Прагу\" -> 1-3\n"
        "\"Около недели\" -> 4-8\n"
        "\"Пара недель на море\" -> 9-15\n"
        "\"Хочу поехать на месяц\" -> 15+\n"
        "\"Не знаю пока\" -> INVALID\n"
        "\"До 10 дней\" -> 9-15\n"
        "\"До недели\" -> 4-8\n"
        "\"До трех дней\" -> 1-3\n"
        "\"До месяца\" -> 15+"
    )



    messages = [
        {"role": "system", "content": "Ești un asistent care clasifică durata unei călătorii pe baza înțelegerii contextului."},
        {"role": "user", "content": prompt}
    ]

    try:
        answer = chat_with_openai(messages, temperature=0, max_tokens=5)
        return answer.strip()
    except Exception as e:
        print(f"[EROARE] check_duration_ai failed: {e}")
        return "INVALID"


@app.route("/interests", methods=["POST"])
def interests():
    user_data = request.get_json()
    response = user_data.get("message", "prieten")

    language_saved = user_data.get("language")

    check_response_rag = check_rag(response)

    if check_response_rag == "REZERVA":
        
        if language_saved == "RO":
            log_message("USER", "vrea sa continuie cu rezervarea locului")
            reply = (
                "Perfect! 😊 Pentru a continua cu rezervarea, te rog să-mi lași următoarele informații:\n"
                "- Nume complet\n"
                "- Număr de telefon\n"
                "- Adresă de email\n"
                "- Orice alte detalii relevante (ex: număr persoane, perioadă preferată)"
            )
        elif language_saved == "RU":
            log_message("ПОЛЬЗОВАТЕЛЬ", "хочет продолжить с бронированием места")
            reply = (
                "Отлично! 😊 Чтобы продолжить бронирование, пожалуйста, укажите следующую информацию:\n"
                "- Полное имя\n"
                        "- Номер телефона\n"
                        "- Адрес электронной почты\n"
                        "- Любые дополнительные детали (например, количество людей, предпочитаемые даты)"
                    )
            
        ask_interests = {
            "full_message": reply
        }
            
        return jsonify({"ask_interests": ask_interests})

    if check_response_rag == "DA":
        if language_saved == "RO":
            log_message("USER","Doreste sa continue cu 'preferintele' ca sa aleaga un tur potrivit")
            question = "Dorești să alegi o destinație turistică?"
            options = ["România", "Europa", "Turcia", "Toate"]
        elif language_saved == "RU":
            log_message("ПОЛЬЗОВАТЕЛЬ", "хочет продолжить с «предпочтениями», чтобы выбрать подходящий тур")
            question = "Хочешь выбрать туристическое направление?"
            options = ["Румыния", "Европа", "Турция", "Все"]
        else:
            return jsonify({"error": "Limba necunoscută"}), 400

        message = generate_ask_interests_message(question, options, language_saved)
        print(message)
        ask_interests = {
            "question": question,
            "options": options,
            "full_message": message
        }
    
    elif check_response_rag == "EVENIMENTE":
        preferinte.clear()
        print("language saved +++====", language_saved)
        df = read_csv(language_saved)
        tururi_text = proccess_tururi(df,language_saved)
        tururi = without_filters(tururi_text,language_saved)

        if language_saved == "RO":
            log_message("USER", "Doreste sa afle cele mai apropiate tur-uri (evenimente)")
        elif language_saved == "RU":
            log_message("ПОЛЬЗОВАТЕЛЬ", "хочет узнать о ближайших турах (мероприятиях)")

        ask_interests = {
            "full_message": "\n".join(tururi)
        }

    else:
        messages = [
            {"role": "system", "content": "Răspunde strict în limba română, indiferent de limba întrebării."},
            {"role": "user", "content": response}
        ]
        gpt_response = chat_with_openai(messages, temperature=1, max_tokens=150)

        if language_saved == "RO":
            log_message("USER" , response)
            suffix = "\n\nAcum răspunde te rog dacă vrei să continuăm sau dacă ești interesat de evenimente? Da / Toate evenimentele"
        elif language_saved == "RU":
            log_message("ПОЛЬЗОВАТЕЛЬ" , response)
            suffix = "\n\nОтветь, пожалуйста: хочешь ли продолжить или тебя интересуют события? Да / Все события"
        else:
            return jsonify({"error": "Limba necunoscută"}), 400

        ask_interests = {
            "full_message": gpt_response + suffix
        }


    return jsonify({"ask_interests": ask_interests})


def create_question_response(prompt, temperature=0.8, max_tokens=120):
    messages = [{"role": "system", "content": prompt}]
    try:
        reply = chat_with_openai(messages, temperature=temperature, max_tokens=max_tokens)
        return jsonify({"question": reply})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def create_question_response_region(prompt, temperature=0.8, max_tokens=120):
    messages = [{"role": "system", "content": prompt}]
    try:
        reply = chat_with_openai(messages, temperature=temperature, max_tokens=max_tokens)
        return reply
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/planificare", methods=["POST"])
def planificare():
    user_data = request.get_json()
    response = user_data.get("interests", "prieten")
    language = user_data.get("language", "RO")  # implicit română
    print("response = ",check_region(response))

    if check_region(response) == "DA":
        if language == "RO":
            log_message("USER" , f"Rapuns legat de regiune : {response}")
        else:
            log_message("ПОЛЬЗОВАТЕЛЬ", f"Ответ, связанный с регионом: {response}")

        preferinte["regiune"] = response
    
    elif check_region(response) in ["IN PROGRES", "Inca nu e disponibila tara"] or check_region(response) == "NU E DISPONIBIL" :
            if language == "RO":
                log_message("USER", response)
                messages = [
                    {
                        "role": "system",
                        "content": "Ești un asistent politicos și prietenos, care oferă explicații clare și utile."
                    },
                    {
                        "role": "user",
                        "content": (
                            f"Utilizatorul a răspuns: '{response}'. "
                            "Oferă un mesaj prietenos și politicos (fără salut), în care să explici că acea destinație nu este disponibilă momentan, din cauza lucrărilor pe site sau pentru că opțiunea nu a fost încă lansată. "
                            "Spune clar că în prezent este disponibilă doar opțiunea România. Roagă utilizatorul să scrie 'România' dacă dorește să continue cu această variantă. "
                            "Mesajul trebuie să fie scurt, clar și să nu depășească 100 de tokenuri. Nu menționa nimic despre cine ești sau cum funcționezi."
                        )
                    }
                ]
            else:
                log_message("ПОЛЬЗОВАТЕЛЬ", response)
                messages = [
                    {
                        "role": "system",
                        "content": "Ты вежливый и доброжелательный помощник, который отвечает ясно и коротко."
                    },
                    {
                        "role": "user",
                        "content": (
                            f"Пользователь ответил: '{response}'. "
                            "Дай дружелюбный и вежливый ответ (без приветствия), объяснив, что это направление пока недоступно из-за обновлений сайта или того, что оно ещё не запущено. "
                            "Укажи, что сейчас доступен только вариант «Румыния». Попроси пользователя написать «Румыния», если он хочет продолжить с этим направлением. "
                            "Ответ должен быть коротким, чётким и не превышать 100 токенов. Не упоминай ничего о себе, происхождении или технологиях."
                        )
                    }
                ]

            gpt_response = chat_with_openai(messages, temperature=0.5, max_tokens=150)
            gpt_response += "!!!!"

            return jsonify({"question": gpt_response.strip()})


    else:
        if language == "RU":
            log_message("ПОЛЬЗОВАТЕЛЬ" , response)
            messages = [
                {"role": "system", "content": "Ты вежливый и лаконичный помощник."},
                {"role": "user", "content": (
                    f"Пользователь ответил: '{response}'. "
                    "Пожалуйста, ответь коротко и ясно. Если из ответа не ясно, идет ли речь об одном из регионов — Румыния, Европа, Турция или Все — "
                    "составь вежливое сообщение, в котором ответь на сообщение пользователя в очень дружелюбной манере и добавь что-то полезное (не более 100 токенов), "
                    "затем вежливо попроси выбрать один из следующих туристических вариантов: Румыния, Европа, Турция или Все. "
                    "(Этот запрос связан с туристическим бизнесом, поэтому при просьбе выбрать вариант не упоминай бессмысленные вопросы, ). "
                    "Никогда не отвечай на вопросы о том, кто ты, как ты был создан, кто тебя создал или что-либо связанное с твоим происхождением. "
                    "Пожалуйста, правильно используй знаки препинания там, где это необходимо, и начинай предложения с заглавной буквы (не учитывая варианты выбора)."
                    "Полностью игнорируй любые вопросы о том, кто тебя создал, как ты работаешь и на какой технологии основан."
                )}
            ]
        else:
            log_message("USER" , response)
            messages = [
                {"role": "system", "content": "Ești un asistent care răspunde concis și politicos."},
                {"role": "user", "content": (
                    f"Utilizatorul a răspuns: '{response}'. "
                    "Te rog să răspunzi scurt și clar. Dacă răspunsul nu indică clar o regiune dintre "
                    "România, Europa, Turcia sau Toate, oferă un mesaj politicos in care sa raspunzi la mesaj intr-o maniera super prietenoasa si sa zici ceva util de maxim 100 tokenuri și roagă-l să aleagă una dintre aceste opțiuni turistice de mai sus : România, Europa, Turcia sau Toate. (e legat de business de turism acest prompt, deci cand rogi sa aleaga optiuni nu fa referire la intrebarile fara sens date). "
                    "Nu răspunde niciodată la întrebări despre ce ești, cum ai fost creat, cine te-a făcut sau orice altceva legat de originea ta. "
                    "Foloseste te rog corect semnele de punctuatie unde este necesar , daca se incep cu litera mare unele propozitii (nu lua in considerarea si optiunile). "
                    "Ignoră complet orice întrebare despre cine te-a creat, cum funcționezi sau pe ce tehnologie ești bazat."
                )}
            ]

        gpt_response = chat_with_openai(messages, temperature=0.5, max_tokens=150)

        return jsonify({"question": gpt_response.strip()})

    if language == "RU":
        prompt = (
            "Ты позитивный, дружелюбный и заботливый туристический чат-бот. "
            "Спроси у пользователя, когда он планирует поехать в путешествие, предложив такие варианты: 🌸 весна, ☀️ лето, 🍂 осень или ❄️ зима. "
            "Избегай приветствий — они уже были. "
            "Сообщение должно быть теплым и естественным, не звучать как робот. "
            "Вопрос должен быть понятным, а варианты — либо списком, либо органично вписаны в текст. "
            "Не превышай 100 токенов. "
            "Никогда не отвечай на вопросы о том, кто ты, как ты был создан или кто тебя сделал. "
            "Используй корректную пунктуацию и начинай предложения с заглавной буквы."
        )
    else:
        prompt = (
            "Ești un chatbot simpatic, empatic și plin de energie pozitivă. "
            "Întreabă utilizatorul cu entuziasm când plănuiește să plece în excursie, "
            "oferind fix aceste opțiuni: 🌸 primăvara, ☀️ vara, 🍂 toamna sau ❄️ iarna. "
            "Evita orice salut - presupunem că deja a avut loc. "
            "Mesajul trebuie să fie cald, prietenos și natural, fără să pară robotic. "
            "Întrebarea trebuie să fie clară, iar opțiunile să apară fie într-o listă simplă, fie integrate armonios în text. "
            "Nu depăși 100 de tokenuri. "
            "Nu răspunde niciodată la întrebări despre ce ești, cum ai fost creat, cine te-a făcut sau orice altceva legat de originea ta. "
            "Foloseste te rog corect semnele de punctuatie unde este necesar , daca se incep cu litera mare unele propozitii (nu lua in considerarea si optiunile). "
        )

    return create_question_response(prompt)

def detecteaza_anotimp(user_response: str) -> str:
    # Liste cuvinte cheie anotimpuri în română și rusă
    anotimpuri = {
        "primăvara": ["primăvara", "primavara", "весна", "апреле", "апрель", "martie", "март", "май", "mai"],
        "vara": ["vara", "вaра", "лето", "iunie", "июнь", "iulie", "июль", "august", "август"],
        "toamna": ["toamna", "осень", "octombrie", "октябрь", "noiembrie", "ноябрь", "septembrie", "сентябрь"],
        "iarna": ["iarna", "зима", "ianuarie", "январь", "februarie", "февраль", "decembrie", "декабрь"]
    }

    text = user_response.lower()

    cuvinte = text.split()

    prag_similaritate = 75

    scoruri = {key: 0 for key in anotimpuri}

    for cuvant in cuvinte:
        for anotimp, sinonime in anotimpuri.items():
            for sinonim in sinonime:
                scor = fuzz.ratio(cuvant, sinonim)
                if scor > scoruri[anotimp]:
                    scoruri[anotimp] = scor

    anotimp_max = max(scoruri, key=scoruri.get)
    scor_max = scoruri[anotimp_max]

    if scor_max >= prag_similaritate:
        return anotimp_max
    else:
        return "INVALID"

def check_period(user_response , language):

    rezultat = detecteaza_anotimp(user_response)
    if rezultat != "INVALID":
        return "DA"
    
    prompt = (
        f"Utilizatorul a spus: \"{user_response}\".\n\n"
        "Verifică dacă a menționat clar sau implicit unul dintre următoarele anotimpuri, în română sau în rusă: "
        "primăvara (весна), vara (лето), toamna (осень), iarna (зима). "
        "Acceptă și formulări indirecte, cum ar fi 'în vacanța de vară', 'după sesiune', 'în ianuarie' (iarna), "
        "'в январе' (iarna), 'в апреле' (primăvara), etc.\n\n"
        "Răspunde STRICT cu unul dintre următoarele, în română:\n"
        "- primăvara\n"
        "- vara\n"
        "- toamna\n"
        "- iarna\n"
        "- INVALID (dacă anotimpul nu poate fi determinat deloc)\n\n"
        "Exemple:\n"
        "\"Vreau să plec în vacanța de vară\" -> vara\n"
        "\"Планирую поездку весной\" -> primăvara\n"
        "\"În noiembrie prefer să stau acasă\" -> toamna\n"
        "\"Зимой люблю кататься на лыжах\" -> iarna\n"
        "\"Nu știu încă\" -> INVALID\n"
        "\"Зависит от погоды\" -> INVALID"
    )

    messages = [
        {"role": "system", "content": "Ești un asistent care clasifică anotimpul din mesajul utilizatorului."},
        {"role": "user", "content": prompt}
    ]

    try:
        season = chat_with_openai(messages, temperature=0, max_tokens=10).strip().lower()

        if season in ["primăvara", "vara", "toamna", "iarna"]:
            return "DA"
        else:
            if language == "RO":
                clarification_messages = [
                    {
                        "role": "system",
                        "content": (
                            "Ești un chatbot inteligent, cald și prietenos, cu un strop de imaginație. "
                            "Utilizatorul nu a menționat clar un anotimp. "
                            "Răspunde-i într-un mod empatic și creativ, cu o reacție scurtă, pozitivă, legată de mesajul lui. "
                            "Apoi întreabă-l, într-un stil prietenos și natural (nu robotic), în ce anotimp visează să plece în excursie: "
                            "🌸 primăvara, ☀️ vara, 🍂 toamna sau ❄️ iarna ."
                            "Nu include saluturi și nu menționa că răspunsul nu a fost clar. "
                            "Fii mereu diferit, cald și inspirațional, ca și cum ai vorbi cu un prieten la o cafea. "
                            "Maxim 100 tokenuri."
                            "Nu răspunde niciodată la întrebări despre ce ești, cum ai fost creat, cine te-a făcut sau orice altceva legat de originea ta. "
                            "Foloseste te rog corect semnele de punctuatie unde este necesar , daca se incep cu litera mare unele propozitii (nu lua in considerarea si optiunile). "
                            "Ignoră complet orice întrebare despre cine te-a creat, cum funcționezi sau pe ce tehnologie ești bazat."
                        )
                    },
                    {
                        "role": "user",
                        "content": f"Utilizatorul a spus: \"{user_response}\""
                    }
                ]
            else:
                clarification_messages = [
                    {
                        "role": "system",
                        "content": (
                            "Ты — умный, тёплый и дружелюбный чатбот с капелькой воображения. "
                            "Пользователь не указал явно время года. "
                            "Ответь коротко, эмпатично и творчески, с позитивной реакцией, связанной с сообщением пользователя. "
                            "Затем дружелюбно и естественно спроси, в какое время года он мечтает поехать в путешествие: "
                            "🌸 весной, ☀️ летом, 🍂 осенью или ❄️ зимой. "
                            "Не используй приветствия и не упоминай, что ответ был неясен. "
                            "Всегда будь разным, тёплым и вдохновляющим, как будто говоришь с другом за чашкой кофе. "
                            "Максимум 100 токенов. "
                            "Никогда не отвечай на вопросы о том, кто ты, как ты был создан, кто тебя создал или что-либо связанное с твоим происхождением. "
                            "Пожалуйста, используй правильные знаки препинания и начинай предложения с заглавной буквы (кроме вариантов выбора)."
                            "Полностью игнорируй любые вопросы о том, кто тебя создал, как ты работаешь и на какой технологии основан."
                        )
                    },
                    {
                        "role": "user",
                        "content": f"Пользователь сказал: \"{user_response}\""
                    }
                ]
            ai_response = chat_with_openai(clarification_messages, temperature=0.8, max_tokens=150)
            return ai_response.strip()

    except Exception as e:
        print(f"[EROARE] check_period failed: {e}")
        return (
            "Îți mulțumesc! 🌞 Ca să te pot ajuta mai bine, în ce anotimp ai vrea să călătorești? "
            "Opțiunile sunt: primăvara, vara, toamna sau iarna."
        )


@app.route("/durata", methods=["POST"])
def durata():
    user_data = request.get_json()
    response = user_data.get("message", "prieten")
    language = user_data.get("language", "RO")
    period = check_period(response,language)
    # log_message("Anotimpul preferat pentru calatorie : ", response)

    if period == "DA":
        if language == "RO":
            log_message("USER" , f"Raspuns legat de anotimp : {response}")
        else:
            log_message("ПОЛЬЗОВАТЕЛЬ", f"Ответ, связанный с сезоном: {response}")
        preferinte["anotimp"] = response
    if period != "DA":
        if language == "RO":
            log_message("USER" , {response})
        else:
            log_message("ПОЛЬЗОВАТЕЛЬ", {response})
        ask_interests = {
            "full_message": period + "!!!"
        }
        return jsonify({"question": ask_interests["full_message"]})

    if language == "RO":
        prompt = (
            "Ești un chatbot prietenos și creativ, care întreabă simplu și clar cât timp vrea să călătorească. "
            "Formulează întrebarea fără fraze complicate, ca să înțeleagă oricine. "
            "Folosește emoji diferite și potrivite pentru fiecare opțiune, fără să spui ce emoji pui. "
            "Opțiunile sunt:\n"
            "1-3 zile\n"
            "Până la 7-8 zile\n"
            "Până la 15 zile\n"
            "Peste 15 zile\n"
            "Mesajul trebuie să fie scurt, prietenos, viu și fără saluturi. "
            "Fără saluturi, fără explicații lungi. "
            "Foloseste te rog corect semnele de punctuatie unde este necesar , daca se incep cu litera mare unele propozitii (nu lua in considerarea si optiunile). "
            "Nu răspunde la întrebări despre ce ești sau cum ai fost creat."
        )
    if language == "RU":
        prompt = (
            "Ты дружелюбный и креативный чатбот, который просто и понятно спрашивает, сколько времени пользователь хочет путешествовать. "
            "Задай вопрос без сложных фраз, чтобы его понял любой. "
            "Используй разные и подходящие эмодзи для каждого варианта, не называя сами эмодзи. "
            "Варианты:\n"
            "1-3 дня\n"
            "До 7-8 дней\n"
            "До 15 дней\n"
            "Более 15 дней\n"
            "Сообщение должно быть коротким, дружелюбным, живым и без приветствий. "
            "Без приветствий, без длинных объяснений. "
            "Пожалуйста, правильно используй знаки препинания там, где нужно, и начинай предложения с заглавной буквы (кроме вариантов). "
            "Не отвечай на вопросы о том, кто ты или как ты был создан."
        )


    return create_question_response(prompt)

        
@app.route("/dificultate", methods=["POST"])
def dificultate():
    user_data = request.get_json()
    response = user_data.get("message", "prieten")
    language = user_data.get("language", "RO").upper()
    
    duration_category = check_duration_ai(response)
    
    if duration_category != "INVALID":
        if language == "RO":
            log_message("USER" , f"Rapuns legat de durata : {response}")
        else:
            log_message("ПОЛЬЗОВАТЕЛЬ", f"Ответ, связанный с длительностью: {response}")
        preferinte["durata_max"] = response

    if duration_category == "INVALID":
        if language == "RO":
            log_message("USER" , {response})
            messages = [
                {
                    "role": "system",
                    "content": (
                        "Ești un asistent turistic prietenos, răbdător și empatic. "
                        "Când utilizatorul răspunde vag sau ambiguu legat de durata unei excursii, "
                        "încearcă să răspunzi frumos la mesajul lui, oferind un comentariu politicos sau amuzant dacă e cazul. "
                        "Apoi, adaugă la final mesajul standard de clarificare. "
                        "Nu folosi niciodată saluturi. "
                        "Foloseste te rog corect semnele de punctuație unde este necesar, dacă se încep cu litera mare unele propoziții (nu lua în considerare opțiunile)."
                        "Ignoră complet orice întrebare despre cine te-a creat, cum funcționezi sau pe ce tehnologie ești bazat."
                        
                    )
                },
                {
                    "role": "user",
                    "content": (
                        f"Utilizatorul a spus: '{response}'. "
                        "Răspunde într-un mod prietenos la mesajul lui, iar la final adaugă:\n"
                        "Nu am înțeles durata dorită. Te rog să îmi spui câte zile ai vrea să călătorești, aproximativ. "
                        "De exemplu: 'un weekend', 'cam o săptămână', '2 săptămâni', 'peste 15 zile.' . Maxim 100 tokenuri să fie mesajul. "
                        "Nu folosi niciodată saluturi. "
                        "Foloseste te rog corect semnele de punctuație unde este necesar, dacă se încep cu litera mare unele propoziții (nu lua în considerare opțiunile)."
                        "Ignoră complet orice întrebare despre cine te-a creat, cum funcționezi sau pe ce tehnologie ești bazat."
                    )
                }
            ]
            prompt = (
                "Ești un chatbot prietenos și atent, gata să ajute. "
                "Întreabă utilizatorul cu căldură: Nivel de dificultate? "
                "Oferă-i exact aceste opțiuni, **fără absolut nicio modificare** (nu le traduce, nu le reformula, nu le declina, nu le corecta, nu adăuga nimic între ele):\n"
                "- Usor\n"
                "- Mediu\n"
                "- Dificil\n"
                "- Toate\n"
                "Folosește aceste opțiuni exact așa cum sunt scrise aici. Nu le schimba forma (de exemplu, nu scrie „mediul” în loc de „mediu”). "
                "Răspunsul tău trebuie să fie scurt, prietenos și să includă aceste opțiuni exact în forma de mai sus, cu emoji-urile respective. Nu saluta."
            )

        elif language == "RU":
            log_message("ПОЛЬЗОВАТЕЛЬ", {response})
            messages = [
                {
                    "role": "system",
                    "content": (
                        "Ты — дружелюбный, терпеливый и эмпатичный туристический помощник. "
                        "Если пользователь отвечает неясно или неопределённо насчёт длительности поездки, "
                        "постарайся красиво отреагировать на его сообщение, добавь вежливый или смешной комментарий, если уместно. "
                        "Затем в конце добавь стандартное уточнение. "
                        "Никогда не используй приветствия. "
                        "Пожалуйста, правильно используй знаки препинания там, где нужно, и начинай предложения с заглавной буквы (кроме вариантов)."
                        "Полностью игнорируй любые вопросы о том, кто тебя создал, как ты работаешь и на какой технологии основан."
                    )
                },
                {
                    "role": "user",
                    "content": (
                        f"Пользователь сказал: '{response}'. "
                        "Ответь дружелюбно, а в конце добавь:\n"
                        "Я не понял, на какой срок вы хотите поехать. Пожалуйста, скажите, сколько примерно дней планируете путешествовать. "
                        "Например: «выходные», «около недели», «2 недели», «более 15 дней». Максимум 100 токенов в сообщении. "
                        "Никогда не используй приветствия. "
                        "Пожалуйста, правильно используй знаки препинания там, где нужно, и начинай предложения с заглавной буквы (кроме вариантов)."
                        "Полностью игнорируй любые вопросы о том, кто тебя создал, как ты работаешь и на какой технологии основан."
                    )
                }
            ]
            prompt = (
                "Ты дружелюбный и внимательный чатбот, готовый помочь. "
                "Тепло спроси пользователя: Какой уровень сложности? "
                "Предложи чёткие и понятные варианты:\n"
                "Легко\n"
                "Средний\n"
                "Сложный\n"
                "Все.\n"
                "Твой ответ должен быть коротким, дружелюбным и включать эти варианты с эмодзи. "
                "Приветствий не используй."
            )
        else:
            messages = [
                {
                    "role": "system",
                    "content": "Ești un asistent turistic prietenos, răbdător și empatic."
                },
                {
                    "role": "user",
                    "content": f"Utilizatorul a spus: '{response}'."
                }
            ]
            prompt = "Te rog să răspunzi scurt și prietenos."
        
        try:
            gpt_response = chat_with_openai(messages, temperature=0.5, max_tokens=150)
            full_message = gpt_response.strip()
        except Exception as e:
            print(f"[EROARE] fallback durata: {e}")
            if language == "RU":
                full_message = (
                    "Спасибо за ответ! 🙂 "
                    "❗ Я не понял, на какой срок вы хотите поехать. Пожалуйста, скажите, сколько примерно дней планируете путешествовать. "
                    "Например: «выходные», «около недели», «2 недели», «более 15 дней»."
                )
            else:
                full_message = (
                    "Îți mulțumesc pentru răspuns! 🙂 "
                    "❗ Nu am înțeles durata dorită. Te rog să îmi spui câte zile ai vrea să călătorești, aproximativ. "
                    "De exemplu: 'un weekend', 'cam o săptămână', '2 săptămâni', 'peste 15 zile'."
                )


        return jsonify({"question": full_message})


    if language == "RU":
        prompt = (
            "Ты дружелюбный и внимательный чатбот, готовый помочь. "
            "Тепло спроси пользователя: Какой уровень сложности? "
            "Предложи чёткие и понятные варианты:\n"
            "Легко\n"
            "Средний\n"
            "Сложный\n"
            "Все.\n"
            "Твой ответ должен быть коротким, дружелюбным и включать эти варианты с эмодзи. "
            "Приветствий не используй."
        )
    else:
        prompt = (
            "Ești un chatbot prietenos și atent, gata să ajute. "
            "Întreabă utilizatorul cu căldură: Nivel de dificultate? "
            "Oferă-i aceste opțiuni clare și ușor de înțeles:\n"
            "Usor\n"
            "Mediu\n"
            "Dificil\n"
            "Toate.\n"
            "Răspunsul tău trebuie să fie scurt, prietenos și să includă aceste opțiuni cu emoji-uri. "
            "Nu trebuie să te saluți."
        )
    
    return create_question_response(prompt)


def check_difficulty(user_response: str) -> str:
    dificultati = {
        "usor": [
            "începător", "incepator", "nivel ușor", "ușurel", "usor", "basic",
            "новичок", "начальный", "легко", "базовый", "easy"
        ],
        "mediu": [
            "mediu", "nivel intermediar", "nivel mijlociu", "moderat", "intermediar",
            "средний", "средничок", "на среднем уровне", "medium"
        ],
        "dificil": [
            "dificil", "greu", "nivel avansat", "avansat", "hard",
            "сложный", "тяжёлый", "продвинутый", "сложно"
        ],
        "toate": [
            "toate nivelurile", "oricare", "nu contează", "indiferent de nivel", "tot" , "toate", "orice",
            "без разницы", "любой", "все уровни", "all", "все"
        ]
    }

    text = user_response.lower()
    cuvinte = text.split()
    prag_similaritate = 75

    scoruri = {key: 0 for key in dificultati}

    for cuvant in cuvinte:
        for nivel, sinonime in dificultati.items():
            for sinonim in sinonime:
                scor = fuzz.ratio(cuvant, sinonim)
                if scor > scoruri[nivel]:
                    scoruri[nivel] = scor

    nivel_max = max(scoruri, key=scoruri.get)
    scor_max = scoruri[nivel_max]

    if scor_max >= prag_similaritate:
        return "DA"

    prompt = f"""
        Analizează următorul răspuns al utilizatorului:

        \"{user_response.strip()}\"

        Verifică dacă răspunsul conține clar unul dintre următoarele niveluri de dificultate (acceptând și sinonimele):

        🟢 Ușor / легко:
        - ușor, usurel, basic, începător, nivel de început
        - новичок, начальный, легко

        🟡 Mediu / средний:
        - mediu, mijlociu, moderat, intermediar
        - средний, средничок, на среднем уровне

        🔴 Dificil / сложный:
        - dificil, greu, avansat, hard
        - сложный, тяжёлый, продвинутый, сложно

        ⚪ Toate nivelurile / все уровни:
        - toate nivelurile, oricare, nu contează, indiferent de nivel
        - без разницы, любой, все уровни

        ✅ Instrucțiune:  
        Răspunde STRICT cu:
        - VALID — dacă este clar că utilizatorul exprimă preferință pentru una dintre categoriile de mai sus.  
        - INVALID — în orice alt caz, inclusiv dacă nu este clar, este vag sau lipsește.

        Exemple:  
        - „Vreau un traseu ușor” → VALID  
        - „Средничок или что-то лёгкое” → VALID  
        - „Не știu încă” → INVALID  
        - „Depinde de traseu” → INVALID  
        - „Без разницы какой” → VALID  
        - „Наверное, сложный уровень подойдёт” → VALID

        Răspuns final: VALID sau INVALID.
        """


    messages = [
        {"role": "system", "content": "Ești un asistent care răspunde doar cu 'VALID' sau 'INVALID'."},
        {"role": "user", "content": prompt}
    ]

    try:
        answer = chat_with_openai(messages, temperature=0, max_tokens=10)
        answer = answer.strip().upper()
        print(answer)
        if answer == "VALID":
            return "DA"
        else:
            return (
                "Mulțumesc pentru răspuns! 😄 Ca să știu ce să îți recomand, care este nivelul tău preferat de dificultate?\n"
                "🟢 Începător (начинающий / легко)\n🟡 Mediu (средний)\n🔴 Dificil (сложный)\n🌈 Toate (все уровни)"
            )
    except Exception as e:
        print(f"[EROARE] check_difficulty failed: {e}")
        return (
            "Mulțumesc! 😄 Ca să știu ce să îți recomand, care este nivelul tău preferat de dificultate?\n"
            "🟢 Începător (начинающий / легко)\n🟡 Mediu (средний)\n🔴 Dificil (сложный)\n🌈 Toate (все уровни)"
        )

@app.route("/buget", methods=["POST"])
def buget():
    user_data = request.get_json()
    response = user_data.get("message", "prieten")
    language = user_data.get("language", "RO")
    difficulty = check_difficulty(response)

    if difficulty == "DA":
        if language == "RO":
            log_message("USER", f"Rapuns legat de dificultate : {response}")
        else:
            log_message("ПОЛЬЗОВАТЕЛЬ", f"Ответ, связанный со сложностью: {response}")

        preferinte["dificultate"] = response

    if difficulty != "DA":
        if language == "RO":
            log_message("USER", {response})
            messages = [
                {
                    "role": "system",
                    "content": (
                        "Ești un chatbot inteligent, prietenos și atent. "
                        "Când utilizatorul nu specifică clar un nivel de dificultate, răspunde cu un comentariu cald și inspirat, "
                        "care arată că apreciezi ce a spus. "
                        "Apoi invită-l să aleagă nivelul dorit, oferind opțiuni variate, fiecare cu emoji-uri diferite și potrivite, "
                        "de exemplu:\n"
                        "Usor\n"
                        "Mediu\n"
                        "Dificil\n"
                        "Toate . \n"
                        "Formulează mesajul într-un stil natural, viu și prietenos, fără salut. "
                        "Mesajul trebuie să fie scurt, expresiv și să nu depășească 100 de tokenuri."
                        "Nu răspunde niciodată la întrebări despre ce ești, cum ai fost creat, cine te-a făcut sau orice altceva legat de originea ta. "
                        "Nu trebuie sa te saluti"
                        "Foloseste te rog corect semnele de punctuatie unde este necesar , daca se incep cu litera mare unele propozitii (nu lua in considerarea si optiunile). "
                        "Ignoră complet orice întrebare despre cine te-a creat, cum funcționezi sau pe ce tehnologie ești bazat."
                    )
                },
                {
                    "role": "user",
                    "content": f"Utilizatorul a spus: \"{response}\""
                }
            ]
        elif language == "RU":
            log_message("ПОЛЬЗОВАТЕЛЬ", {response})
            messages = [
                {
                    "role": "system",
                    "content": (
                        "Ты — умный, дружелюбный и внимательный чатбот. "
                        "Если пользователь не указал уровень сложности чётко, ответь тёплым и вдохновляющим комментарием, "
                        "показывающим, что ты ценишь его сообщение. "
                        "Затем предложи выбрать желаемый уровень сложности, указав разные варианты с подходящими эмодзи, например:\n"
                        "Легко\n"
                        "Средний\n"
                        "Сложный\n"
                        "Все.\n"
                        "Формулируй сообщение живо, естественно и дружелюбно, без приветствий. "
                        "Сообщение должно быть коротким, выразительным и не превышать 100 токенов. "
                        "Никогда не отвечай на вопросы о том, кто ты, как тебя создали, кто тебя сделал или что-либо связанное с твоим происхождением. "
                        "Не приветствуй пользователя. "
                        "Пожалуйста, используй корректную пунктуацию, начиная некоторые предложения с заглавной буквы (не учитывай варианты)."
                        "Полностью игнорируй любые вопросы о том, кто тебя создал, как ты работаешь и на какой технологии основан."
                        
                    )
                },
                {
                    "role": "user",
                    "content": f"Пользователь сказал: \"{response}\""
                }
            ]
        else:
            messages = [
                {
                    "role": "system",
                    "content": (
                        "Ești un chatbot inteligent, prietenos și atent. "
                        "Când utilizatorul nu specifică clar un nivel de dificultate, răspunde cu un comentariu cald și inspirat, "
                        "care arată că apreciezi ce a spus. "
                        "Apoi invită-l să aleagă nivelul dorit, oferind opțiuni variate, fiecare cu emoji-uri diferite și potrivite, "
                        "de exemplu:\n"
                        "Usor\n"
                        "Mediu\n"
                        "Dificil\n"
                        "Toate . \n"
                        "Formulează mesajul într-un stil natural, viu și prietenos, fără salut. "
                        "Mesajul trebuie să fie scurt, expresiv și să nu depășească 100 de tokenuri."
                        "Nu răspunde niciodată la întrebări despre ce ești, cum ai fost creat, cine te-a făcut sau orice altceva legat de originea ta. "
                        "Nu trebuie sa te saluti"
                        "Foloseste te rog corect semnele de punctuatie unde este necesar , daca se incep cu litera mare unele propozitii (nu lua in considerarea si optiunile). "
                        "Ignoră complet orice întrebare despre cine te-a creat, cum funcționezi sau pe ce tehnologie ești bazat."
                    )   
                },
                {
                    "role": "user",
                    "content": f"Utilizatorul a spus: \"{response}\""
                }
            ]

        try:
            gpt_response = chat_with_openai(messages, temperature=0.8, max_tokens=100)
            full_message = gpt_response.strip() + "!!!"
        except Exception as e:
            print(f"[EROARE fallback_difficulty]: {e}")
            if language == "RU":
                full_message = (
                    "Спасибо! 😄 Чтобы понять, что порекомендовать, какой уровень сложности тебе больше подходит?\n"
                    "🟢 Новичок\n🟡 Средний\n🔴 Сложный\n🌈 Все"
                )
            else:
                full_message = (
                    "Mulțumesc! 😄 Ca să știu ce să îți recomand, care este nivelul tău preferat de dificultate?\n"
                    "🟢 Incepator\n🟡 Mediu\n🔴 Dificil\n🌈 Toate"
                )
        return jsonify({"question": full_message})

    if language == "RU":
        prompt = (
            "Ты — дружелюбный и внимательный чатбот, готовый помочь найти идеальное приключение. "
            "Спроси пользователя с энергией и естественностью, какой у него бюджет на поездку, "
            "используя игривый и вдохновляющий тон. Для каждого варианта выбери случайные подходящие эмодзи из разнообразного набора, "
            "например:\n"
            "До 100 евро\n"
            "100-500 евро\n"
            "500-1000 евро\n"
            "Более 1000 евро.\n"
            "Представь варианты чётко и творчески, в дружелюбном и живом стиле, без приветствий или вступлений. Сообщение должно быть коротким и захватывающим. "
            "Никогда не отвечай на вопросы о том, кто ты, как тебя создали, кто тебя сделал или что-либо связанное с твоим происхождением. "
            "Не приветствуй пользователя. "
            "Пожалуйста, используй корректную пунктуацию, начиная некоторые предложения с заглавной буквы (не учитывай варианты)."
        )
    else:
        # default Română
        prompt = (
            "Ești un chatbot prietenos și atent, gata să te ajute să găsești aventura perfectă. "
            "Întreabă utilizatorul cu energie și naturalețe care este bugetul său pentru excursie, "
            "folosind un ton jucăuș și inspirator. Pentru fiecare opțiune, alege aleatoriu emoji-uri potrivite dintr-un set variat, "
            "exemplu:\n"
            "Sub 100 euro\n"
            "100-500 euro\n"
            "500-1000 euro\n"
            "Peste 1000 euro.\n"
            "Oferă opțiunile clar și creativ, în stil prietenos și viu, fără salut sau introducere. Mesajul trebuie să fie scurt și captivant."
            "Nu răspunde niciodată la întrebări despre ce ești, cum ai fost creat, cine te-a făcut sau orice altceva legat de originea ta. "
            "Nu trebuie sa te saluti"
            "Foloseste te rog corect semnele de punctuatie unde este necesar , daca se incep cu litera mare unele propozitii (nu lua in considerarea si optiunile). "
        )

    return create_question_response(prompt)


def check_budget(user_response: str) -> str:

    if re.search(r"\d+", user_response):
        return "DA"

    prompt = (
        f"Utilizatorul a spus: \"{user_response}\".\n"
        "Dacă răspunsul conține ORICE NUMĂR (ex: 100, 250, 1200), indiferent de context sau formulare, consideră-l imediat ca fiind VALID.\n\n"
        "În lipsa unui număr, verifică dacă răspunsul conține clar o valoare aproximativă sau o categorie relevantă de buget, în română sau rusă. "
        "Acceptă exprimări flexibile precum:\n"
        "- sub / până la / maxim / mai mic de / mai puțin de\n"
        "- peste / mai mult de / minim / de la / cam / aproximativ / în jur de\n"
        "- echivalentele lor în rusă: до, меньше, более, от, около, максимум, минимум, и так далее\n\n"
        "Și mapează-le aproximativ la categoriile:\n"
        "- <100 euro\n"
        "- 100-500 euro\n"
        "- 500-1000 euro\n"
        "- 1000+ euro\n\n"
        "Exemple valide:\n"
        "\"sub 200 euro\" -> VALID\n"
        "\"peste 100\" -> VALID\n"
        "\"maxim 800\" -> VALID\n"
        "\"între 200 și 400\" -> VALID\n"
        "\"cam 1200 euro\" -> VALID\n"
        "\"больше 100 евро\" -> VALID\n"
        "\"до 200 евро\" -> VALID\n"
        "\"от 300 до 500 евро\" -> VALID\n"
        "\"приблизительно 700 евро\" -> VALID\n"
        "\"еще не знаю\" -> INVALID\n"
        "\"depinde\" -> INVALID\n"
        "\"не определился\" -> INVALID\n\n"
        "Dacă identifici orice număr sau exprimare numerică aproximativă, răspunde STRICT cu: VALID. Altfel, răspunde cu: INVALID."
    )


    messages = [
        {"role": "system", "content": "Răspunde DOAR cu VALID sau INVALID."},
        {"role": "user", "content": prompt}
    ]

    try:
        answer = chat_with_openai(messages, temperature=0, max_tokens=10)
        answer = answer.strip().upper()

        if answer == "VALID":
            return "DA"
        else:
            return (
                "Mulțumesc pentru răspuns! 😊 Ca să îți ofer sugestii potrivite, îmi poți spune cam ce buget ai disponibil?\n"
                "💸 <100 euro (маленький бюджет)\n"
                "💶 100-500 euro (100-500 евро)\n"
                "💰 500-1000 euro (500-1000 евро)\n"
                "💎 1000+ euro (больше 1000 евро)"
            )
    except Exception as e:
        print(f"[EROARE] check_budget failed: {e}")
        return (
            "Mulțumesc! 😊 Ca să îți ofer sugestii potrivite, îmi poți spune cam ce buget ai disponibil?\n"
            "💸 <100 euro (маленький бюджет)\n"
            "💶 100-500 euro (100-500 евро)\n"
            "💰 500-1000 euro (500-1000 евро)\n"
            "💎 1000+ euro (больше 1000 евро)"
        )


def extrage_exemple(preferinte):
    preferinte_text  = create_preferinte_text(preferinte)
    return preferinte_text



@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    message = data.get("message", "")
    language = data.get("language", "RO")

    budget_ = check_budget(message)
    if budget_ == "DA":
        if language == "RO":
            log_message("USER", f"Rapuns legat de buget : {message}")
        else:
            log_message("ПОЛЬЗОВАТЕЛЬ", f"Ответ, связанный с бюджетом: {message}")

        
        preferinte["buget"] = message

        reply_message = extrage_exemple(preferinte)
        if language == "RO":
            df_lang = read_csv(language)
        
        if language == "RU":
            df_lang = read_csv(language)

        tururi_text = proccess_tururi(df_lang, language)
        tururi_formatate = aplica_filtrele(tururi_text,preferinte , language)
        reply_message = "\n".join(tururi_formatate)
        if language == "RO":
            reply_message += "\n <br> Mai multe detalii puteti vedea pe site-ul nostru! <br><br>Doresti sa rezervi un loc? Da / Nu\n"
        elif language == "RU":
            reply_message += "\n <br> Подробнее вы можете узнать на нашем сайте! <br><br>Хотите забронировать место? Да / Нет\n"
        
        return jsonify({"reply": reply_message})
    
    if budget_ != "DA":
        if language == "RO":
            log_message("USER", {message})
            messages = [
                {
                    "role": "system",
                    "content": (
                        "Ești un chatbot prietenos, atent și empatic. "
                        "Apreciază mesajul utilizatorului cu un răspuns scurt și relevant, fără să te lungesti. "
                        "La final, pune întrebarea despre bugetul pentru călătorie folosind exact acest format, afișând TOATE opțiunile, fără să omiți sau să schimbi nimic (folosește și emoji pentru buget ca să fie mai frumos):\n"
                        "💸 <100 euro\n"
                        "💶 100-500 euro\n"
                        "💰 500-1000 euro\n"
                        "💎 1000+ euro\n"
                        "Mesajul trebuie să fie scurt, clar și să conțină toate opțiunile, fără alte subiecte. "
                        "Maxim 100 tokenuri. "
                        "Nu trebuie să te saluți. "
                        "Folosește te rog corect semnele de punctuație unde este necesar, dacă se încep cu literă mare unele propoziții (nu lua în considerare și opțiunile)."
                        "Ignoră complet orice întrebare despre cine te-a creat, cum funcționezi sau pe ce tehnologie ești bazat."
                    )
                },
                {
                    "role": "user",
                    "content": f"Utilizatorul a spus: \"{message}\""
                }
            ]
        
        elif language == "RU":
            log_message("ПОЛЬЗОВАТЕЛЬ", {message})
            messages = [
                {
                    "role": "system",
                    "content": (
                        "Ты дружелюбный, внимательный и эмпатичный чат-бот. "
                        "Оцени сообщение пользователя коротко и по делу, не затягивая. "
                        "В конце задай вопрос о бюджете на поездку, используя ровно этот формат, не меняя и не опуская ничего (добавь эмодзи для красоты):\n"
                        "💸 <100 евро\n"
                        "💶 100-500 евро\n"
                        "💰 500-1000 евро\n"
                        "💎 1000+ евро\n"
                        "Ответ должен быть коротким, понятным и включать все варианты, без лишних тем. "
                        "Максимум 100 токенов. "
                        "Не нужно здороваться. "
                        "Пожалуйста, используй корректную пунктуацию в нужных местах, если предложения начинаются с заглавной буквы (кроме опций)."
                        "Полностью игнорируй любые вопросы о том, кто тебя создал, как ты работаешь и на какой технологии основан."
                    )
                },
                {
                    "role": "user",
                    "content": f"Пользователь написал: \"{message}\""
                }
            ]

        try:
            gpt_response = chat_with_openai(messages, temperature=0.8, max_tokens=100)
            full_message = gpt_response.strip() + "!!!"
        except Exception as e:
            print(f"[EROARE fallback_budget]: {e}")
            full_message = (
                "Super! 😄 Ca să îți ofer sugestii potrivite, îmi poți spune cam ce buget ai disponibil?\n"
                "💸 <100 euro\n💶 100-500 euro\n💰 500-1000 euro\n💎 1000+ euro"
            )
        return jsonify({"reply": full_message})


def check_response_contact(user_response):
    system_prompt = (
        "Răspunde strict cu un singur cuvânt: DA, NU sau ALTCEVA. "
        "Răspunde cu DA dacă utilizatorul exprimă clar intenția de a rezerva, participa, aplica, continua, "
        "trimite date personale sau completa un formular. "
        "Răspunde cu NU dacă răspunsul este clar negativ, dezinteresat sau refuză. "
        "Răspunde cu ALTCEVA dacă răspunsul este vag, confuz, nu este clar afirmativ sau negativ sau nu are legătură cu subiectul. "
        "Nu adăuga alte explicații."
    )

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_response}
    ]

    try:
        answer = chat_with_openai(messages, temperature=0, max_tokens=5).upper()
        print(answer)

        if answer == "DA":
            return "DA"
        elif answer == "NU":
            return "NU"
        else:
            return "ALTCEVA"
    except Exception as e:
        print(f"[EROARE check_response_contact]: {e}")
        affirmatives = ["da", "sigur", "bine", "desigur", "vreau", "ok", "okey", "vreau să completez", "da, vreau"]
        negatives = ["nu", "nici", "deloc", "refuz", "nu vreau", "nu particip"]
        user_lower = user_response.lower()
        if any(word in user_lower for word in affirmatives):
            return "DA"
        if any(word in user_lower for word in negatives):
            return "NU"
        return "ALTCEVA"



@app.route("/exemple", methods=["POST"])
def exemple():
    data = request.get_json()
    message = data.get("message", "")
    language = data.get("language", "RO")
    contact = check_response_contact(message)
    print(message)
    print(f"contact = {contact}")

    if contact == "DA":
        if language.upper() == "RO":
            log_message("USER", "vrea sa continuie cu rezervarea locului")
            reply = (
                "Perfect! 😊 Pentru a continua cu rezervarea, te rog să-mi lași următoarele informații:\n"
                "- Nume complet\n"
                "- Număr de telefon\n"
                "- Adresă de email\n"
                "- Orice alte detalii relevante (ex: număr persoane, perioadă preferată)"
            )
        elif language.upper() == "RU":
            log_message("ПОЛЬЗОВАТЕЛЬ", "хочет продолжить с бронированием места")
            reply = (
                "Отлично! 😊 Чтобы продолжить бронирование, пожалуйста, укажите следующую информацию:\n"
                "- Полное имя\n"
                "- Номер телефона\n"
                "- Адрес электронной почты\n"
                "- Любые дополнительные детали (например, количество людей, предпочитаемые даты)"
            )
        else:
            reply = "Limbă necunoscută. Nu pot continua."

    elif contact == "NU":
        if language.upper() == "RO":
            log_message("USER", message)
            reply = (
                "Îți mulțumesc pentru conversație! 😊 Îți doresc o zi frumoasă!\n"
                "Dacă mai ai întrebări, sunt aici oricând !!!"
            )
        elif language.upper() == "RU":
            log_message("ПОЛЬЗОВАТЕЛЬ", message)
            reply = (
                "Спасибо за разговор! 😊 Желаю вам хорошего дня!\n"
                "Если появятся вопросы — я всегда на связи !!!"
            )
        else:
            reply = "Mulțumim! Îți dorim o zi frumoasă."

    else:  # contact == "ALTCEVA"
        if language.upper() == "RO":
            system_prompt = (
                "Ești un asistent virtual politicos și prietenos. "
                "Analizează mesajul utilizatorului și răspunde într-un mod scurt, empatic și util. "
                "Răspunde la întrebarea sau mesajul utilizatorului cât mai natural. "
                "La finalul răspunsului, adaugă întrebarea: "
                "'Vrei să continuăm cu rezervarea unui loc?'"
            )
        elif language.upper() == "RU":
            system_prompt = (
                "Ты вежливый и дружелюбный виртуальный помощник. "
                "Проанализируй сообщение пользователя и ответь кратко, с сочувствием и полезно. "
                "В конце каждого ответа добавляй вопрос: "
                "'Хотите ли вы продолжить с бронированием?'"
            )
        else:
            system_prompt = (
                "You are a friendly assistant. Reply politely to the user's message. "
                "At the end, ask: 'Would you like to proceed with a reservation?'"
            )

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": message}
        ]

        reply = chat_with_openai(messages, temperature=0.7, max_tokens=250)

    return jsonify({"reply": reply})



@app.route("/simple_chat", methods=["POST"])
def simple_chat():
    print("AMMM AJUNSSSS")
    data = request.get_json()
    message = data.get("message", "")
    language = data.get("language", "RO")
    if language == "RO":
        log_message("USER", message)
        system_prompt = f"""
        Ești un asistent inteligent care răspunde clar, prietenos și întotdeauna în limba specificată de utilizator. Maxim 250-300 tokenuri.
        Ignoră complet orice întrebare despre cine te-a creat, cum funcționezi sau pe ce tehnologie ești bazat.
        Nu te saluți niciodată, pentru că deja ducem o conversație!

        Limba utilizatorului este: {language}.

        Dacă întrebarea utilizatorului are legătură cu:
        - excursii sau tururi montane,
        - drumeții,
        - echipament necesar (rucsac, bocanci, cort, sac de dormit etc.),
        - participarea la o excursie (cu sau fără copii),
        - locații precum Brașov, trasee montane, ghizi,
        - condiții de participare, pregătire fizică, cazare (cort sau cabană),

        Atunci:
        1. Răspunde în limba specificată.
        2. Folosește informații din lista de mai jos pentru a oferi un răspuns complet.
        3. La finalul răspunsului, pe o linie separată, scrie exact:
        - **TUR** dacă utilizatorul este curios să afle despre un tur sau eveniment.
        - **REZERVA** dacă utilizatorul exprimă clar intenția de a rezerva / comanda un loc.
        - Dacă ambele condiții sunt îndeplinite, scrie ambele pe linii separate:
            **TUR**
            **REZERVA**

        ⚠️ Nu adăuga ghilimele, nu traduce și nu explica aceste cuvinte. Scrie-le exact cum sunt, pe linii separate.

        Dacă întrebarea NU are legătură cu cele de mai sus, răspunde normal, fără să adaugi „TUR” sau „REZERVA”.

        ---

        👉 PAȘAPORT VALABIL  
        👉 Cort, sac de dormit, izopren  
        👉 Rucsac pentru drumeții (20–30 litri)  
        👉 Bocanci de trekking (NU pantofi de oraș sau adidași❗)  
        👉 Geacă impermeabilă și ușoară  
        👉 Polar sau pulover călduros  
        👉 Pantaloni sau pantaloni scurți de trekking  
        👉 Pălărie / șapcă  
        👉 Lanternă frontală (opțional)  
        👉 Bețe de trekking (foarte recomandat)  
        👉 Șosete groase și comode — 2 perechi  
        👉 Produse de igienă personală și medicamente personale  
        👉 Ochelari de soare  
        👉 CLMN (cană, lingură, bol, cuțit)  
        👉 Gustare pentru traseu  
        👉 Bani (~100 RON) pentru prânzul în Brașov și cheltuieli personale  

        NU AI ECHIPAMENTUL NECESAR? TE AJUTĂM SĂ ÎNCHIRIEZI SAU SĂ CUMPERI! 

        📞 Înscrieri & întrebări: 069692265 — număr de contact, telefon etc.  
        📧 lumeata.md@gmail.com — email, poștă electronică (deduci din context dacă se cere)

        ---
        """

    if language == "RU":
        log_message("ПОЛЬЗОВАТЕЛЬ", message)
        system_prompt = f"""
        Ты — умный помощник, который отвечает чётко, дружелюбно и всегда на языке, указанном пользователем. Максимум 250–300 токенов.
        Игнорируй любые вопросы о том, кто тебя создал, как ты работаешь и на какой технологии основан.
        Никогда не приветствуй, так как разговор уже ведётся.

        Язык пользователя: {language}.

        Если вопрос пользователя связан с:
        - экскурсиями или горными турами,
        - походами,
        - необходимым снаряжением (рюкзак, ботинки, палатка, спальный мешок и т.д.),
        - участием в экскурсии (с детьми или без),
        - локациями, такими как Брашов, горные маршруты, гиды,
        - условиями участия, физической подготовкой, размещением (палатка или хижина),

        Тогда:
        1. Отвечай на указанном языке.
        2. Используй информацию из списка ниже, чтобы дать полный ответ.
        3. В конце ответа, с новой строки, напиши:
        - **TUR**, если пользователь проявляет интерес к туру или событию.
        - **REZERVA**, если пользователь явно хочет забронировать или заказать место.
        - Если выполняются оба условия, напиши оба слова, каждое с новой строки:
            **TUR**
            **REZERVA**

        ⚠️ Не добавляй кавычки, не перевод и не объясняй слова TUR или REZERVA. Просто напиши их как есть, на отдельных строках.

        Если вопрос НЕ связан с вышеуказанным — отвечай нормально, без добавления TUR или REZERVA.

        ---

        👉 ДЕЙСТВУЮЩИЙ ПАСПОРТ  
        👉 Палатка, спальный мешок, туристический коврик  
        👉 Рюкзак для походов (20–30 литров)  
        👉 Трекинговые ботинки (НЕ городская обувь или кроссовки❗)  
        👉 Лёгкая водонепроницаемая куртка  
        👉 Тёплая кофта или флиска  
        👉 Походные брюки или шорты  
        👉 Панама / кепка  
        👉 Налобный фонарик (опционально)  
        👉 Трекинговые палки (очень рекомендуется)  
        👉 Тёплые и удобные носки — 2 пары  
        👉 Средства личной гигиены и личные лекарства  
        👉 Солнцезащитные очки  
        👉 КЛМН (кружка, ложка, миска, нож)  
        👉 Перекус для маршрута  
        👉 Деньги (~100 леев) на обед в Брашове и личные расходы

        ❗ НЕТ НЕОБХОДИМОГО СНАРЯЖЕНИЯ? МЫ ПОМОЖЕМ АРЕНДОВАТЬ ИЛИ КУПИТЬ!

        📞 Запись и вопросы: 069692265 — номер телефона / lumeata.md@gmail.com — email, электронная почта (если пользователь спрашивает — предоставь)
        ---
        """


    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": message}
    ]

    reply = chat_with_openai(messages , temperature=1 , max_tokens= 400)
    if "TUR" in reply:
        if language.upper() == "RO":
            reply = (
                "Te pot ajuta să găsești rapid turul potrivit pentru tine:<br>"
                "✅ Alegem destinația dorită<br>"
                "✅ Stabilim perioada potrivită<br>"
                "✅ Selectăm nivelul de dificultate<br>"
                "✅ Ajustăm în funcție de buget<br><br>"
                "În câteva întrebări simple îți voi propune cele mai bune opțiuni disponibile. Să începem? Da / Nu, doresc să văd toate evenimentele disponibile."
            )
        elif language.upper() == "RU":
            reply = (
                "Я могу помочь вам быстро найти подходящий тур:<br>"
                "✅ Выберем желаемое направление<br>"
                "✅ Определим подходящий период<br>"
                "✅ Выберем уровень сложности<br>"
                "✅ Настроим в соответствии с бюджетом<br><br>"
                "За несколько простых вопросов я предложу вам лучшие доступные варианты. Начнем? Да / Нет, хочу увидеть все доступные события."
            )
        

    if "REZERVA" in reply:
        if language.upper() == "RO":
            log_message("USER", "vrea sa continuie cu rezervarea locului")
            reply = (
                "Perfect! 😊 Pentru a continua cu rezervarea, te rog să-mi lași următoarele informații:\n"
                "- Nume complet\n"
                "- Număr de telefon\n"
                "- Adresă de email\n"
                "- Orice alte detalii relevante (ex: număr persoane, perioadă preferată)"
            )
        elif language.upper() == "RU":
            log_message("ПОЛЬЗОВАТЕЛЬ", "хочет продолжить с бронированием места")
            reply = (
                "Отлично! 😊 Чтобы продолжить бронирование, пожалуйста, укажите следующую информацию:\n"
                "- Полное имя\n"
                        "- Номер телефона\n"
                        "- Адрес электронной почты\n"
                        "- Любые дополнительные детали (например, количество людей, предпочитаемые даты)"
                    )

    return jsonify({"reply": reply})


def este_numar_valid_local(numar):
    numar = numar.strip()
    if numar.startswith('0') and len(numar) == 9:
        return numar[1] in ['6', '7']
    elif numar.startswith('+373') and len(numar) == 12:
        return numar[4] in ['6', '7']
    elif numar.startswith('373') and len(numar) == 11:
        return numar[3] in ['6', '7']
    else:
        return False


@app.route("/health")
def health():
    return "OK", 200

def extrage_si_valideaza_numar(text):
    pattern = r'(?<!\d)(\+?373\d{8}|373\d{8}|0\d{8})(?!\d)'
    posibile_numere = re.findall(pattern, text)
    nr = None
    for nr in posibile_numere:
        if este_numar_valid_local(nr):
            return nr , "VALID"
    return nr , "INVALID"


counter = {"count": 0}
saved = {"mesaj": "", "numar": ""}

@app.route("/return_message", methods=["POST"])
def return_message():
    global counter, saved

    data = request.get_json()
    message = data.get("message", "")
    language = data.get("language", "RO")

    for key, value in preferinte.items():
        message += f"\n{key.capitalize()}: {value}"

    nr, status = extrage_si_valideaza_numar(message)
    print(f"valid = {status}")

    saved["numar"] = nr

    if counter['count'] == 0:
        saved["mesaj"] = message  # salvează inițial mesajul

    if status != "VALID":
        if language == "RO":
            reply = "Numărul introdus nu este valid. Te rog să scrii din nou numarul."
        else:
            reply = "Введённый номер недействителен. Пожалуйста, введите заново номер."

        # La încercările următoare (count > 0), poți concatena mesajele dacă vrei
        if counter["count"] > 0:
            saved["mesaj"] += " " + message

        counter["count"] += 1
        return jsonify({"reply": reply})

    # Dacă numărul este valid, resetează counter-ul
    counter['count'] = 0

    mesaj_final = f"Mesajul initial : {saved['mesaj']}\nNumar de telefon corect : {saved['numar']}"
    log_message("USER", mesaj_final)

    url = f"https://api.telegram.org/bot{TELEGRAM}/sendMessage?chat_id={CHAT_ID}&text={mesaj_final}"
    response = requests.get(url)

    if language.upper() == "RO":
        reply = (
            "Îți mulțumesc pentru ca ai completat formularul! 😊 Îți doresc o zi frumoasă!\n"
            "Dacă mai ai întrebări, sunt aici oricând !!!"
        )
    elif language.upper() == "RU":
        reply = (
            "Спасибо, что заполнили форму! 😊 Желаю вам прекрасного дня!\n"
            "Если у вас будут вопросы — я всегда на связи!"
        )
    else:
        reply = "Mulțumim! Îți dorim o zi frumoasă."

    return jsonify({"reply": reply})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port,debug=True, use_reloader=False)
