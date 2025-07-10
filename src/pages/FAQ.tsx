import React, { useState } from 'react';
import './FAQ.css';
import NavBar from '../components/navbar';
import Footer from '../components/footer';
import Contacts from '../components/contacts';
import LiveChat from '../components/LiveChat';
import FAQ from '../assets/faq.jpg';

const translations = {
  ro: {
    pageTitle: "Întrebări Frecvente",
    pageTitle1: "Despre noi și călătoriile noastre",
    pageTitle2: "Cum te pregătești și cum rezervi o călătorie",
    pageTitle3: "Cum ne deplasăm și unde stăm pe durata călătoriei?",
    pageTitle4: "Forma fizică și cât de solicitante sunt traseele",
    pageTitle5: "Siguranță și sprijin",
    pageTitle6: "Echipament și îmbrăcăminte",
    pageTitle7: "Întrebări legate de costuri și plată",
    pageDescription: "Ne bucurăm că ești interesat(ă) de călătoriile alături de Lumea Ta.",
    faq1: {
      question: "1.Ce face Lumea Ta diferită de alte agenții de turism?",
      answer: "Noi creăm călătorii autentice, nu doar simple tururi.<br>Itinerariile noastre sunt atent gândite, oferind un echilibru optim între activitate și confort, astfel încât să poți simți cu adevărat atmosfera locurilor vizitate.<br>Lucrăm cu grupuri mici, ghizi profesioniști și punem accentul pe experiențe unice, nu pe excursii standardizate."
    },
    faq2: {
      question: "2. Mă pot alătura unei aventuri dacă nu am mai călătorit în acest fel până acum?",
      answer: "Desigur! Programele noastre sunt potrivite atât pentru călători cu experiență, cât și pentru începători.<br>Vom alege un traseu care să corespundă nivelului tău de pregătire și îți vom oferi sprijin pe tot parcursul aventurii."
    },
    faq3: {
      question: "3.Câte persoane sunt, de regulă, într-un grup?",
      answer: "Formăm grupuri mici, de la 6 până la 15 persoane.<br>Această structură ne permite să creăm o atmosferă prietenoasă și să oferim o atenție personalizată fiecărui participant."
    },
    faq4: {
      question: "4.Este în regulă să mă alătur unei călătorii chiar dacă nu am experiență?",
      answer: "Da, avem trasee cu diferite niveluri de dificultate.<br>Dacă ești începător, îți vom recomanda un traseu ușor, fără porțiuni dificile sau eforturi prelungite."
    },
    faq5: {
      question: "5. Este posibil să particip la o călătorie împreună cu copiii?",
      answer: "Desigur, organizăm și tururi prietenoase pentru familii cu copii.<br>Ne dorim ca micuții să descopere lumea alături de părinți, într-un mod sigur și plăcut.<br>Totuși, responsabilitatea pentru copil rămâne în întregime la părinți, iar noi putem garanta doar gradul de dificultate al traseului și condițiile de siguranță.<br>Dacă ai îndoieli cu privire la potrivirea unui tur pentru copilul tău, scrie-ne — te vom ajuta cu drag să alegi cea mai bună opțiune."
    },
    faq6: {
      question: "6. Care sunt țările în care organizați tururi?",
      answer: "Explorăm lumea împreună!<br>Fiecare an aduce noi destinații în calendarul nostru, astfel încât chiar și cei care revin în călătoriile Lumea Ta să trăiască experiențe complet noi."
    },
    faq7: {
      question: "7. Ce trebuie să fac pentru a-mi rezerva locul?",
      answer: "Ne poți scrie direct pe site,<br>ne poți suna sau<br>ne poți da un mesaj pe WhatsApp sau rețelele sociale<br>— cum îți e mai comod.<br>După ce îți confirmăm locul, semnăm contract, primim un avans și te ajutăm pas cu pas cu tot ce ai nevoie pentru călătorie."
    },
    faq8: {
      question: "8. Este nevoie să plătesc ceva în avans?",
      answer: "Da, pentru a-ți păstra locul, este nevoie de un avans de 30–40% din prețul total al turului.<br>Restul sumei poate fi achitat în mai multe tranșe, până aproape de data plecării."
    },
    faq9: {
      question: "9. Ce facem dacă, dintr-un motiv sau altul, turul nu mai are loc?",
      answer: "Dacă nu se adună suficienți participanți, îți vom propune alte date sau un alt traseu asemănător.<br>Iar dacă niciuna dintre opțiuni nu ți se potrivește, îți returnăm integral avansul achitat."
    },
    faq10: {
      question: "10. Când ar fi cel mai bine să-mi fac rezervarea?",
      answer: "Îți recomandăm să îți rezervi locul cât mai din timp, mai ales pentru traseele populare.<br>Așa ai siguranța că prinzi un loc și beneficiezi de cele mai bune condiții."
    },
    faq11: {
      question: "11. Organizați și tururi personalizate, pentru companii, grupuri mici sau evenimente speciale?",
      answer: "Da, cu mare drag!<br>Poți completa o cerere, iar coordonatorul nostru îți va pregăti o propunere personalizată.<br>Organizăm tururi corporate, teambuilding-uri, aniversări sau călătorii private — și adaptăm totul în funcție de echipa sau grupul tău."
    },
    faq12: {
      question: "12.Pot primi sfaturi personalizate pentru pregătirea călătoriei?",
      answer: "Da, desigur!<br>Îți oferim toate informațiile legate de acte, te ajutăm cu vize, permise și asigurări.<br>Ne străduim să preluăm noi tot ce ține de organizare, ca tu să te poți concentra liniștit(ă) pe pregătirea personală pentru călătorie."
    },
    faq13: {
      question: "13. Ne puteți ajuta cu documentele și obținerea vizei?",
      answer: "Da, bineînțeles!<br>Îți oferim toate informațiile legate de documente și te sprijinim în procesul de obținere a vizei, permiselor și asigurărilor.<br>Ne dorim să ne ocupăm noi de partea organizatorică, ca tu să te poți pregăti în liniște pentru călătorie."
    },
    faq14: {
      question: "14. Cum arată cazarea în timpul turului?",
      answer: "În funcție de traseu, cazarea poate fi în hoteluri confortabile, cabane montane, tabere cu corturi sau chiar în iurte.<br>Indiferent de loc, ne dorim mereu să oferim călătorilor noștri un spațiu primitor și cât mai confortabil."
    },
    faq15: {
      question: "15. Pot să aleg cazare într-o cameră doar pentru mine?",
      answer: "Da, desigur — dacă dorești, putem organiza cazare într-o cameră single, contra unui cost suplimentar.<br>În taberele cu corturi, cazarea este de obicei în corturi de două persoane."
    },
    faq16: {
      question: "16. Cum ne deplasăm pe parcursul turului?",
      answer: "În funcție de traseu, folosim diferite mijloace de transport: minivanuri, mașini 4x4, trenuri sau zboruri interne.<br>Pe traseele de trekking, modul principal de deplasare este mersul pe jos."
    },
    faq17: {
      question: "17. Care sunt orele de plecare și de întoarcere?",
      answer: "Depinde de durata călătoriei.<br>Încercăm mereu să menționăm în programul turului atât datele exacte, cât și orele aproximative de plecare și întoarcere."
    },
    faq18: {
      question: "18. Trebuie să fiu într-o formă fizică bună ca să pot participa?",
      answer: "Tururile noastre sunt gândite pentru persoane cu diferite niveluri de pregătire fizică.<br>Avem trasee potrivite atât pentru începători, cât și pentru cei cu mai multă experiență.<br>Dacă ai îndoieli, scrie-ne — te ajutăm cu drag să alegi varianta care ți se potrivește cel mai bine."
    },
    faq19: {
      question: "19. Ce ar trebui să știu dacă merg într-un tur cu altitudine mai mare?",
      answer: "Îți recomandăm să faci antrenamente cardio regulate și drumeții cu rucsacul în spate, înainte de plecare.<br>În traseele noastre includem zile de aclimatizare, pentru ca organismul să se poată adapta treptat la altitudine."
    },
    faq20: {
      question: "20. Este o problemă dacă am un ritm mai lent decât ceilalți?",
      answer: "Ghizii noștri adaptează ritmul drumeției în funcție de nevoile și energia grupului.<br>Facem opriri regulate pentru odihnă și fotografii, astfel încât fiecare să se poată bucura de călătorie în propriul ritm."
    },
    faq21: {
      question: "21.E frig iarna în tururile montane? Cum sunt diferite turele de iarnă față de cele de vară?",
      answer: "Drumețiile de iarnă sunt o experiență complet diferită<br><br>Necesită haine călduroase, o pregătire mai atentă și rezistență la frig<br><br>Dar în schimb, te bucuri de liniște, munți acoperiți de zăpadă și o atmosferă unică de trekking de iarnă."
    },
    faq22: {
      question: "22. Cum aveți grijă de siguranța participanților pe durata turului?",
      answer: "Siguranța călătorilor noștri este prioritatea noastră<br><br>Colaborăm cu ghizi certificați și experimentați, folosim echipamente de calitate și planificăm cu grijă traseele, ținând cont de condițiile meteo și de alți factori importanți."
    },
    faq23: {
      question: "23. Este necesar un anumit tip de asigurare pentru aceste călătorii?",
      answer: "Da, recomandăm să ai o asigurare care acoperă activități outdoor și, ideal, și posibilitatea de evacuare în caz de urgență<br><br>Dacă ai nevoie, îți putem recomanda companii de asigurări de încredere, cu care au colaborat și alți călători de-ai noștri."
    },
    faq24: {
      question: "24. Ce fac dacă mi se face rău pe munte?",
      answer: "Ghizii noștri sunt instruiți să acorde primul ajutor și urmăresc cu atenție starea fiecărui participant<br><br>Dacă apar semne de rău de altitudine, luăm imediat măsuri — de la pauze și coborâre la o altitudine mai joasă, până la evacuare, dacă este necesar."
    },
    faq25: {
      question: "25. Ce echipament este necesar pentru călătorie?",
      answer: "După ce rezervi turul, îți trimitem o listă detaliată cu echipamentul necesar, adaptată traseului și sezonului<br><br>Totul ca să știi exact ce ai nevoie și să te simți pregătit(ă) pentru aventură."
    },
    faq26: {
      question: "26. Pot închiria echipamentul, dacă nu am tot ce-mi trebuie?",
      answer: "Da, în unele tururi oferim posibilitatea de a închiria echipament, cum ar fi saci de dormit, bețe de trekking și alte lucruri necesare<br><br>Te rugăm să ne întrebi din timp, ca să-ți confirmăm disponibilitatea pentru turul ales."
    },
    faq27: {
      question: "27. Gustări și mâncare în timpul călătoriilor",
      answer: "✔ Mesele principale sunt de obicei incluse în prețul turului. Ne străduim să ținem cont de preferințele fiecărui participant.<br>✔ Gustările le aduce fiecare pentru sine. Recomandăm carbohidrați rapizi – ciocolată, batoane energizante, fructe uscate, nuci, bomboane.<br>✔ Dacă ai restricții alimentare speciale, te rugăm să îl anunți din timp pe coordonator."
    },
    faq28: {
      question: "28. Cum pot plăti pentru tur?",
      answer: "Momentan, plata se face în numerar.<br>Lucrăm deja la implementarea opțiunilor de plată online și prin transfer bancar — atât pentru persoane fizice, cât și pentru companii.<br>Aceste variante vor fi disponibile în curând și te vom anunța imediat ce le activăm."
    },
    faq29: {
      question: "29. Ce cheltuieli suplimentare pot apărea pe parcursul turului?",
      answer: "Depinde de traseu, dar în general, cheltuielile personale nu sunt incluse în prețul turului.<br>De obicei, asta înseamnă băuturi, suveniruri, bacșiș pentru ghid și echipă.<br>Îți spunem din timp ce costuri pot apărea, ca să îți poți planifica bugetul în liniște."
    }
  },
  ru: {
    pageTitle: "Часто Задаваемые Вопросы",
    pageTitle1: "О нас и наших путешествиях",
    pageTitle2: "Как подготовиться и забронировать путешествие",
    pageTitle3: "Как мы передвигаемся и где остановимся во время поездки?",
    pageTitle4: "Физическая форма и сложность маршрутов",
    pageTitle5: "Безопасность и поддержка",
    pageTitle6: "Снаряжение и одежда",
    pageTitle7: "Вопросы по стоимости и оплате",
    pageDescription: "Мы рады, что вы заинтересованы в путешествиях с Lumea Ta.",
    faq1: {
      question: "1. Что делает Lumea Ta отличной от других туристических агентств?",
      answer: "Мы создаем аутентичные путешествия, а не просто обычные туры.<br>Наши маршруты тщательно продуманы, предлагая оптимальный баланс между активностью и комфортом, чтобы вы могли по-настоящему почувствовать атмосферу посещаемых мест.<br>Мы работаем с небольшими группами, профессиональными гидами и делаем акцент на уникальных впечатлениях, а не на стандартизированных экскурсиях."
    },
    faq2: {
      question: "2. Могу ли я присоединиться к приключению, если никогда раньше не путешествовал таким образом?",
      answer: "Конечно! Наши программы подходят как для опытных путешественников, так и для начинающих.<br>Мы выберем маршрут, соответствующий вашему уровню подготовки, и окажем поддержку на протяжении всего приключения."
    },
    faq3: {
      question: "3. Сколько человек обычно в группе?",
      answer: "Мы формируем небольшие группы от 6 до 15 человек.<br>Такая структура позволяет нам создать дружелюбную атмосферу и обеспечить индивидуальное внимание каждому участнику."
    },
    faq4: {
      question: "4. Можно ли присоединиться к путешествию, даже если у меня нет опыта?",
      answer: "Да, у нас есть маршруты с разными уровнями сложности.<br>Если вы новичок, мы порекомендуем легкий маршрут без сложных участков или длительных нагрузок."
    },
    faq5: {
      question: "5. Можно ли участвовать в путешествии с детьми?",
      answer: "Конечно, мы также организуем семейные туры для родителей с детьми.<br>Мы хотим, чтобы малыши открывали мир вместе с родителями безопасно и приятно.<br>Однако ответственность за ребенка полностью остается на родителях, а мы можем гарантировать только уровень сложности маршрута и условия безопасности.<br>Если у вас есть сомнения о подходящести тура для вашего ребенка, напишите нам — мы с радостью поможем выбрать лучший вариант."
    },
    faq6: {
      question: "6. В какие страны вы организуете туры?",
      answer: "Мы исследуем мир вместе!<br>Каждый год приносит новые направления в наш календарь, так что даже те, кто возвращается в путешествия с Lumea Ta, получают совершенно новые впечатления."
    },
    faq7: {
      question: "7. Что нужно сделать, чтобы забронировать место?",
      answer: "Вы можете написать нам прямо на сайте,<br>позвонить нам или<br>отправить сообщение в WhatsApp или социальные сети<br>— как вам удобнее.<br>После подтверждения места мы подписываем договор, получаем предоплату и помогаем вам шаг за шагом со всем необходимым для путешествия."
    },
    faq8: {
      question: "8. Нужно ли что-то платить заранее?",
      answer: "Да, для сохранения места необходима предоплата 30-40% от общей стоимости тура.<br>Остальная сумма может быть оплачена в несколько этапов до даты отъезда."
    },
    faq9: {
      question: "9. Что делать, если по какой-то причине тур не состоится?",
      answer: "Если не наберется достаточно участников, мы предложим другие даты или похожий маршрут.<br>А если ни один из вариантов вам не подходит, мы полностью вернем внесенную предоплату."
    },
    faq10: {
      question: "10. Когда лучше всего сделать бронирование?",
      answer: "Мы рекомендуем бронировать место как можно раньше, особенно для популярных маршрутов.<br>Так у вас будет гарантия места и лучшие условия."
    },
    faq11: {
      question: "11. Организуете ли вы персонализированные туры для компаний, небольших групп или специальных мероприятий?",
      answer: "Да, с большим удовольствием!<br>Вы можете заполнить заявку, и наш координатор подготовит персонализированное предложение.<br>Мы организуем корпоративные туры, тимбилдинги, дни рождения или частные путешествия — и адаптируем все под вашу команду или группу."
    },
    faq12: {
      question: "12. Могу ли я получить персональные советы по подготовке к путешествию?",
      answer: "Да, конечно!<br>Мы предоставляем всю информацию о документах, помогаем с визами, разрешениями и страховкой.<br>Мы стараемся взять на себя все организационные вопросы, чтобы вы могли спокойно сосредоточиться на личной подготовке к путешествию."
    },
    faq13: {
      question: "13. Можете ли вы помочь с документами и получением визы?",
      answer: "Да, конечно!<br>Мы предоставляем всю информацию о документах и поддерживаем в процессе получения виз, разрешений и страховки.<br>Мы хотим заняться организационной частью, чтобы вы могли спокойно подготовиться к путешествию."
    },
    faq14: {
      question: "14. Как выглядит размещение во время тура?",
      answer: "В зависимости от маршрута размещение может быть в комфортабельных отелях, горных хижинах, палаточных лагерях или даже в юртах.<br>Независимо от места, мы всегда стремимся предоставить нашим путешественникам гостеприимное и максимально комфортное пространство."
    },
    faq15: {
      question: "15. Могу ли я выбрать размещение в отдельной комнате?",
      answer: "Да, конечно — если хотите, мы можем организовать размещение в одноместном номере за дополнительную плату.<br>В палаточных лагерях размещение обычно в двухместных палатках."
    },
    faq16: {
      question: "16. Как мы передвигаемся во время тура?",
      answer: "В зависимости от маршрута мы используем различные виды транспорта: минивэны, автомобили 4x4, поезда или внутренние рейсы.<br>На треккинговых маршрутах основной способ передвижения — пешком."
    },
    faq17: {
      question: "17. Какое время отправления и возвращения?",
      answer: "Зависит от продолжительности путешествия.<br>Мы всегда стараемся указать в программе тура как точные даты, так и приблизительное время отправления и возвращения."
    },
    faq18: {
      question: "18. Нужно ли быть в хорошей физической форме для участия?",
      answer: "Наши туры разработаны для людей с разным уровнем физической подготовки.<br>У нас есть маршруты, подходящие как для начинающих, так и для более опытных.<br>Если у вас есть сомнения, напишите нам — мы с радостью поможем выбрать вариант, который подходит вам больше всего."
    },
    faq19: {
      question: "19. Что нужно знать, если я иду в тур на большую высоту?",
      answer: "Мы рекомендуем регулярные кардиотренировки и походы с рюкзаком перед отъездом.<br>В наши маршруты мы включаем дни акклиматизации, чтобы организм мог постепенно адаптироваться к высоте."
    },
    faq20: {
      question: "20. Проблема ли, если у меня более медленный темп, чем у других?",
      answer: "Наши гиды адаптируют темп похода в зависимости от потребностей и энергии группы.<br>Мы делаем регулярные остановки для отдыха и фотографий, чтобы каждый мог наслаждаться путешествием в своем собственном темпе."
    },
    faq21: {
      question: "21. Холодно ли зимой в горных турах? Чем отличаются зимние туры от летних?",
      answer: "Зимние походы — это совершенно другой опыт<br><br>Они требуют теплой одежды, более тщательной подготовки и устойчивости к холоду<br><br>Но взамен вы наслаждаетесь тишиной, заснеженными горами и уникальной атмосферой зимнего треккинга."
    },
    faq22: {
      question: "22. Как вы заботитесь о безопасности участников во время тура?",
      answer: "Безопасность наших путешественников — наш приоритет<br><br>Мы сотрудничаем с сертифицированными и опытными гидами, используем качественное снаряжение и тщательно планируем маршруты с учетом погодных условий и других важных факторов."
    },
    faq23: {
      question: "23. Нужен ли определенный тип страховки для этих путешествий?",
      answer: "Да, мы рекомендуем иметь страховку, покрывающую активный отдых и, в идеале, возможность эвакуации в чрезвычайной ситуации<br><br>Если нужно, мы можем порекомендовать надежные страховые компании, с которыми сотрудничали другие наши путешественники."
    },
    faq24: {
      question: "24. Что делать, если мне станет плохо в горах?",
      answer: "Наши гиды обучены оказанию первой помощи и внимательно следят за состоянием каждого участника<br><br>Если появляются признаки горной болезни, мы немедленно принимаем меры — от пауз и спуска на меньшую высоту до эвакуации, если необходимо."
    },
    faq25: {
      question: "25. Какое снаряжение необходимо для путешествия?",
      answer: "После бронирования тура мы отправляем подробный список необходимого снаряжения, адаптированный под маршрут и сезон<br><br>Все для того, чтобы вы точно знали, что вам нужно, и чувствовали себя готовыми к приключению."
    },
    faq26: {
      question: "26. Могу ли я арендовать снаряжение, если у меня нет всего необходимого?",
      answer: "Да, в некоторых турах мы предлагаем возможность аренды снаряжения, такого как спальные мешки, треккинговые палки и другие необходимые вещи<br><br>Пожалуйста, спросите нас заранее, чтобы мы могли подтвердить наличие для выбранного тура."
    },
    faq27: {
      question: "27. Перекусы и питание во время путешествий",
      answer: "✔ Основные приемы пищи обычно включены в стоимость тура. Мы стараемся учитывать предпочтения каждого участника.<br>✔ Перекусы каждый берет для себя. Рекомендуем быстрые углеводы — шоколад, энергетические батончики, сухофрукты, орехи, конфеты.<br>✔ Если у вас есть особые диетические ограничения, пожалуйста, заранее сообщите координатору."
    },
    faq28: {
      question: "28. Как я могу оплатить тур?",
      answer: "В настоящее время оплата производится наличными.<br>Мы уже работаем над внедрением онлайн-платежей и банковских переводов — как для физических лиц, так и для компаний.<br>Эти варианты будут доступны в ближайшее время, и мы уведомим вас, как только активируем их."
    },
    faq29: {
      question: "29. Какие дополнительные расходы могут возникнуть во время тура?",
      answer: "Зависит от маршрута, но в целом личные расходы не включены в стоимость тура.<br>Обычно это означает напитки, сувениры, чаевые гиду и команде.<br>Мы заранее расскажем, какие расходы могут возникнуть, чтобы вы могли спокойно планировать свой бюджет."
    }
  }
};

interface FAQPageProps {
  currentLang: 'ro' | 'ru';
  setCurrentLang: (lang: 'ro' | 'ru') => void;
}

const FAQPage: React.FC<FAQPageProps> = ({ currentLang, setCurrentLang }) => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqItems = [
    translations[currentLang].faq1,
    translations[currentLang].faq2,
    translations[currentLang].faq3,
    translations[currentLang].faq4,
    translations[currentLang].faq5,
    translations[currentLang].faq6,
    translations[currentLang].faq7,
    translations[currentLang].faq8,
    translations[currentLang].faq9,
    translations[currentLang].faq10,
    translations[currentLang].faq11,
    translations[currentLang].faq12,
    translations[currentLang].faq13,
    translations[currentLang].faq14,
    translations[currentLang].faq15,
    translations[currentLang].faq16,
    translations[currentLang].faq17,
    translations[currentLang].faq18,
    translations[currentLang].faq19,
    translations[currentLang].faq20,
    translations[currentLang].faq21,
    translations[currentLang].faq22,
    translations[currentLang].faq23,
    translations[currentLang].faq24,
    translations[currentLang].faq25,
    translations[currentLang].faq26,
    translations[currentLang].faq27,
    translations[currentLang].faq28,
    translations[currentLang].faq29,
  ];

  const shouldShowSectionTitle = (index: number) => {
    const sectionTitles = [
      { index: 0, title: translations[currentLang].pageTitle1 },   // Before question 1
      { index: 6, title: translations[currentLang].pageTitle2 },   // Before question 7
      { index: 13, title: translations[currentLang].pageTitle3 },  // Before question 14 (index 13)
      { index: 17, title: translations[currentLang].pageTitle4 },  // Before question 18 (index 17)
      { index: 21, title: translations[currentLang].pageTitle5 },  // Before question 22 (index 21)
      { index: 24, title: translations[currentLang].pageTitle6 },  // Before question 25 (index 24)
      { index: 27, title: translations[currentLang].pageTitle7 },  // Before question 28 (index 27)
    ];
    
    return sectionTitles.find(section => section.index === index)?.title;
  };

  return (
    <div className="faq-page">
      <NavBar currentLang={currentLang} setCurrentLang={setCurrentLang} />
      <LiveChat />
      <img src={FAQ} className='faq-bg' />
      <div className="faq-content">
        <div className="faq-header">
          <h1 className="faq-title">{translations[currentLang].pageTitle}</h1>
          <p className="faq-description">{translations[currentLang].pageDescription}</p>
        </div>

        <div className="faq-container">
          {faqItems.map((item, index) => (
            <div key={index}>
              {shouldShowSectionTitle(index) && (
                <h2 className="faq-section-title">{shouldShowSectionTitle(index)}</h2>
              )}
              <div className={`faq-item ${openFAQ === index ? 'active' : ''}`}>
                <button 
                  className="faq-question" 
                  onClick={() => toggleFAQ(index)}
                >
                  <span>{item.question}</span>
                  <span className={`faq-icon ${openFAQ === index ? 'open' : ''}`}>+</span>
                </button>
                {openFAQ === index && (
                  <div className="faq-answer">
                    <p dangerouslySetInnerHTML={{ __html: item.answer }}></p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="faq-footer-section">
        <Contacts currentLang={currentLang} />
        <Footer currentLang={currentLang} />
      </div>
    </div>
  );
};

export default FAQPage;