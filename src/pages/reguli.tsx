import React from 'react';
import './reguli.css';
import NavBar from '../components/navbar';
import Footer from '../components/footer';
import Contacts from '../components/contacts';
import LiveChat from '../components/LiveChat';

const translations = {
  ro: {
    pageTitle: "Reguli și condiții",
    pageDescription: "Bine ați venit pe site-ul Lumea Ta! Oferim servicii de organizare a tururilor personalizate și experiențelor unice de călătorie. Regulamentul de mai jos stabilește condițiile de furnizare a serviciilor, protecția datelor personale, modalitățile de rezervare și plată, precum și alte aspecte ale interacțiunii cu clienții, în conformitate cu legislația Republicii Moldova.",
    section1: {
      title: "1. Dispoziții generale",
      content: "1.1. Prezentul regulament este elaborat în conformitate cu legislația Republicii Moldova, inclusiv Legea nr. 284/2004 privind comerțul și Legea nr. 133/2011 privind protecția datelor cu caracter personal.<br><br>1.2. Prin utilizarea acestui site, sunteți de acord cu termenii și condițiile menționate și confirmați că sunteți familiarizați cu regulile de prestare a serviciilor.<br><br>1.3. Compania își rezervă dreptul de a modifica regulamentul și condițiile, informând utilizatorii prin intermediul site-ului."
    },
    section2: {
      title: "2. Protecția datelor personale",
      content: "2.1. Respectăm Legea nr. 133/2011 privind protecția datelor cu caracter personal și garantăm confidențialitatea acestora.<br><br>2.2. Datele personale sunt utilizate exclusiv pentru procesarea comenzilor, menținerea contactului cu clienții și furnizarea serviciilor.<br><br>2.3. Transferul datelor către terți este posibil doar în cazurile prevăzute de lege sau cu consimțământul clientului.<br><br>2.4. Toate transferurile de date se realizează prin canale de comunicație securizate.<br><br>2.5. Aplicăm măsuri moderne de protecție a datelor, inclusiv criptare și control al accesului, conform standardelor internaționale."
    },
    section3: {
      title: "3. Rezervarea și plata turului",
      content: "3.1. Rezervarea unui tur se face prin intermediul site-ului nostru, telefonic sau prin alte mijloace menționate pe platforma noastră.<br><br>3.2. Pentru a efectua o rezervare, utilizatorul trebuie să furnizeze informații corecte și actualizate.<br><br>3.3. Turul este considerat rezervat după achitarea unui avans de 30% din costul total sau suma specificată în oferta turului. Clientul poate achita și suma integrală de la început.<br><br>3.4. Diferența de plată trebuie achitată până la termenul specificat în contract.<br><br>3.5. Plata poate fi efectuată cu card bancar sau prin transfer bancar. Plățile online sunt procesate în condiții de siguranță maximă, utilizând sisteme conforme cu standardele 3D-Secure.<br><br>3.6. Pentru plata online, pot fi necesare următoarele informații:<br><br>Numărul cardului (16 cifre)<br><br>Data expirării (lună și an)<br><br>Codul CVC/CVV (3 cifre)<br><br>Numele și prenumele titularului cardulu<br><br>3.7. Toate plățile sunt efectuate în MDL (leu moldovenesc). În cazul în care moneda tranzacției diferă, conversia se efectuează conform cursului băncii emitente.<br><br>3.8. Rambursările sunt efectuate exclusiv pe cardul utilizat pentru plată, în conformitate cu termenii de returnare specificați în contract."
    },
    section4: {
      title: "4. Condițiile de furnizare a serviciilor",
      content: "4.1. Serviciile sunt prestate conform programului turului, care este oferit clientului înainte de rezervare și descris în detaliu pe pagina fiecărui tur.<br><br>4.2. Compania își rezervă dreptul de a modifica programul turului în cazul unor circumstanțe neprevăzute, legate de condițiile meteo, siguranță sau alte motive obiective.<br><br>4.3. Clientul este obligat să respecte regulile stabilite de operatorul turistic, coordonator, ghid sau partenerii locali, precum și legislația Republicii Moldova.<br><br>4.4. Clientul trebuie să dețină o poliță de asigurare care acoperă riscurile asociate călătoriei.<br><br>4.5. Clientul este responsabil pentru pregătirea sa fizică și starea de sănătate, necesare pentru participarea la tur."
    },
    section5: {
      title: "5. Politica de anulare și rambursare",
      content: "5.1. Rambursările sunt posibile în cazul anulării turului de către client, în conformitate cu condițiile de anulare specificate în contract.<br><br>5.2. Suma rambursabilă depinde de momentul notificării și de condițiile turului respectiv.<br><br>5.3. Rambursările sunt procesate în termen de 10 - 30 de zile lucrătoare de la primirea cererii.<br><br>5.4. Clientul trebuie să trimită o solicitare scrisă de anulare, menționând motivul renunțării.<br><br>5.5. O rambursare integrală este posibilă dacă clientul găsește un înlocuitor pentru locul său în tur. În acest caz, noul participant achită integral costul turului, iar clientul inițial primește rambursarea completă."
    },
    section6: {
      title: "6. Politica de confidențialitate",
      content: "6.1. Respectăm confidențialitatea clienților noștri și aplicăm măsuri de protecție a datelor în conformitate cu legislația Republicii Moldova.<br><br>6.2. Toate transferurile de date sunt efectuate prin canale securizate.<br><br>6.3. Datele personale pot fi transmise autorităților sau altor entități juridice doar în cazurile prevăzute de lege."
    },
    section7: {
      title: "7. Răspundere",
      content: "7.1. Compania nu este responsabilă pentru circumstanțe de forță majoră, inclusiv dezastre naturale, decizii ale autorităților, defecțiuni tehnice și alte situații necontrolabile.<br><br>7.2. Compania nu este responsabilă pentru inconveniențele cauzate de modificările programului turului din motive independente de voința sa.<br><br>7.3. Utilizatorul acceptă că serviciile sunt oferite „așa cum sunt”, fără garanții suplimentare."
    },
    section8: {
      title: "8. Contacte",
      content: "Pentru orice întrebări sau clarificări legate de serviciile noastre, ne puteți contacta:<br><br>Denumire juridică: Lumea Ta SRL<br><br>IDNO: 10256000003726<br><br>Adresă juridică: Str. Al. Pușkin 43 - 10, Chișinău, Moldova<br><br>Telefon de contact: +373 69692265<br><br>Email: lumeata.md@gmail.c<br><br>"
    },
    lastUpdated:"Vă mulțumim că ați ales Lumea Ta! Ne străduim să vă oferim experiențe de neuitat și să transformăm visurile voastre în realitate!"
    
  },
  ru: {
    pageTitle: "Правила и условия",
    pageDescription: "Добро пожаловать на сайт Lumea Ta! Мы предоставляем услуги по организации авторских туров и путешествий. Настоящие правила регулируют порядок предоставления услуг, защиту персональных данных, условия оформления заказов и оплаты, а также другие аспекты взаимодействия с клиентами в соответствии с законодательством Республики Молдова.",
    section1: {
      title: "1. Сбор Информации",
      content: "1.1. Настоящие правила разработаны в соответствии с законодательством Республики Молдова, включая Закон № 284/2004 о торговле и Закон № 133/2011 о защите персональных данных.<br><br>1.2. Используя наш сайт, вы соглашаетесь с настоящими правилами и подтверждаете, что ознакомлены с условиями предоставления услуг.<br><br>1.3. Компания оставляет за собой право изменять правила и условия, уведомляя об этом пользователей на сайте."
    },
    section2: {
      title: "2. Защита персональных данных",
      content: "2.1. Мы соблюдаем Закон № 133/2011 о защите персональных данных и гарантируем их конфиденциальность.<br><br>2.2. Персональные данные используются исключительно для оформления заказов, обеспечения связи с клиентом и предоставления услуг.<br><br>2.3. Передача данных третьим лицам возможна только в случаях, предусмотренных законодательством, или с согласия клиента.<br><br>2.4. Вся передача данных осуществляется с использованием защищенных каналов связи.<br><br>2.5. Мы применяем современные методы защиты данных, включая шифрование и контроль доступа, в соответствии с международными стандартами."
    },
    section3: {
      title: "3. Оформление заказа и оплата",
      content: "3.1. Заказ тура осуществляется через наш сайт, по телефону или другим доступным способом, указанным на сайте.<br><br>3.2. Для оформления заказа пользователь предоставляет точную и актуальную информацию.<br><br>3.3. Тур считается забронированным после оплаты аванса в размере 30% от его стоимости или суммы, указанной в мероприятии. Клиент также может оплатить полную сумму сразу.<br><br>3.4. Оставшаяся сумма должна быть оплачена не позднее установленного срока, указанного в договоре.<br><br>3.5. Оплата заказов возможна платежной картой или банковским переводом. Онлайн-оплата производится в условиях максимальной безопасности с использованием платежных систем, соответствующих стандартам 3D-Secure.<br><br>3.6. Для онлайн-оплаты могут потребоваться следующие данные:<br><br>Номер карты (16 цифр)<br>Срок действия (месяц и год)<br>CVC или CVV код (3 цифры) <br>Имя и фамилия держателя карт<br><br>3.7. Все платежи обрабатываются в национальной валюте - MDL (молдавские леи). В случае если валюта операции отличается, конвертация суммы производится по курсу банка-эмитента.<br><br>3.8. Возврат денежных средств осуществляется только на ту платежную карту, которая использовалась для покупки, и в соответствии с условиями возврата, указанными в договоре."
    },
    section4: {
      title: "4. Условия предоставления услуг",
      content: "4.1. Услуги оказываются в соответствии с программой тура, которая предоставляется клиенту до оформления заказа и прописана на странице каждого тура.<br><br>4.2. Компания оставляет за собой право изменять программу тура в случае непредвиденных обстоятельств, связанных с погодными условиями, безопасностью или другими объективными причинами.<br><br>4.3. Клиент обязуется соблюдать правила, установленные туроператором, координатором, гидом или принимающей стороной, а также законодательство Республики Молдова.<br><br>4.4. Клиент обязан иметь страховой полис, покрывающий риски, связанные с путешествием.<br><br>4.5. Клиент несет ответственность за свою физическую подготовку и медицинские показания, необходимые для участия в туре."
    },
    section5: {
      title: "5. Политика возврата",
      content: "5.1. Возврат денежных средств возможен в случае отказа клиента от тура в соответствии с условиями аннуляции, указанными в договоре.<br><br>5.2. Сумма возврата зависит от срока уведомления об отказе и условий конкретного тура.<br><br>5.3. Возврат средств осуществляется в течение 10 - 30 рабочих дней с момента получения запроса клиента.<br><br>5.4. Клиент обязан подать письменный запрос на возврат, указав причину аннулирования тура.<br><br>5.5. Полный возврат денежных средств возможен, если клиент найдет другого человека, который займет его место в туре. В таком случае новый участник должен оплатить полную стоимость тура, а первоначальный клиент получит полный возврат своих средств.<br><br>5.1. Возврат денежных средств возможен в случае отказа клиента от тура в соответствии с условиями аннуляции, указанными в договоре.<br><br>5.2. Сумма возврата зависит от срока уведомления об отказе и условий конкретного тура.<br><br>5.3. Возврат средств осуществляется в течение 10 - 30 рабочих дней с момента получения запроса клиента.<br><br>5.4. Клиент обязан подать письменный запрос на возврат, указав причину аннулирования тура."
    },
    section6: {
      title: "6. Политика конфиденциальности",
      content: "6.1. Мы ценим вашу конфиденциальность и принимаем меры для защиты ваших персональных данных в соответствии с законодательством Республики Молдова.<br><br>6.2. Вся передача данных осуществляется с использованием защищенных каналов связи.<br><br>6.3. Персональные данные могут передаваться государственным органам или иным юридическим лицам только в случаях, предусмотренных законом."
    },
    section7: {
      title: "7. Ответственность",
      content: "7.1. Компания не несет ответственности за форс-мажорные обстоятельства, включая природные катастрофы, действия государственных органов, технические сбои и другие факторы, выходящие за рамки контроля Компании.<br><br>7.2. Компания не несет ответственности за неудобства, вызванные изменениями программы тура по независящим от нее причинам.<br><br>7.3. Пользователь соглашается с тем, что все предоставленные услуги оказываются как есть, без дополнительных гарантий."
    },
    section8: {
      title: "8. Контакты",
      content: "Для любых вопросов или уточнений, связанных с нашими услугами, вы можете связаться с нами:<br><br>Юридическое название компании: Lumea Ta SRL<br><br>IDNO: 10256000003726<br><br>Юридический адрес: ул. Ал. Пушкина д 43 - 10, Кишинев, Молдова<br><br>Контактный телефон: +373 69692265<br><br>Написать нам: lumeata.md@gmail.c<br><br>"
    },
    lastUpdated: "Спасибо, что выбрали Lumea Ta! Мы стараемся обеспечить вам незабываемый опыт путешествия и воплотить ваши мечты в жизнь."
  }
};

interface ReguliPageProps {
  currentLang: 'ro' | 'ru';
  setCurrentLang: (lang: 'ro' | 'ru') => void;
}

const ReguliPage: React.FC<ReguliPageProps> = ({ currentLang, setCurrentLang }) => {
  return (
    <div className="reguli-page">
      <NavBar currentLang={currentLang} setCurrentLang={setCurrentLang} />
      <LiveChat />
      
      {/* Hero Section */}
      <div className="reguli-hero">
        <div className="reguli-hero-overlay"></div>
        <div className="reguli-hero-content">
          <h1 className="reguli-title">{translations[currentLang].pageTitle}</h1>
          <p className="reguli-description">{translations[currentLang].pageDescription}</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="reguli-content">
        <div className="reguli-container">
          
          <div className="reguli-section">
            <h2 className="reguli-section-title">{translations[currentLang].section1.title}</h2>
            <div 
              className="reguli-section-text"
              dangerouslySetInnerHTML={{ __html: translations[currentLang].section1.content }}
            />
          </div>

          <div className="reguli-section">
            <h2 className="reguli-section-title">{translations[currentLang].section3.title}</h2>
            <div 
              className="reguli-section-text"
              dangerouslySetInnerHTML={{ __html: translations[currentLang].section3.content }}
            />
          </div>

          <div className="reguli-section">
            <h2 className="reguli-section-title">{translations[currentLang].section4.title}</h2>
            <div 
              className="reguli-section-text"
              dangerouslySetInnerHTML={{ __html: translations[currentLang].section4.content }}
            />
          </div>

          <div className="reguli-section">
            <h2 className="reguli-section-title">{translations[currentLang].section6.title}</h2>
            <div 
              className="reguli-section-text"
              dangerouslySetInnerHTML={{ __html: translations[currentLang].section6.content }}
            />
          </div>

          <div className="reguli-section">
            <h2 className="reguli-section-title">{translations[currentLang].section7.title}</h2>
            <div 
              className="reguli-section-text"
              dangerouslySetInnerHTML={{ __html: translations[currentLang].section7.content }}
            />
          </div>

          <div className="reguli-last-updated">
            <p>{translations[currentLang].lastUpdated}</p>
          </div>

        </div>
      </div>

      <div className="reguli-footer-section">
        <Contacts currentLang={currentLang} />
        <Footer currentLang={currentLang} />
      </div>
    </div>
  );
};

export default ReguliPage;