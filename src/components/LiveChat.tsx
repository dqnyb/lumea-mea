import React, { useState, useEffect, useRef } from "react";
import "./LiveChat.css";
import livechatopenbg from "../assets/Group 71a.png";
import closebutton from "../assets/closebutton.png";
import sendicon from "../assets/sendicon.png";
import chatboticon from "../assets/chatlogo.svg";

// ✅ Tipuri
type ChatMessage = {
  id: number;
  text: string;
  from: "user" | "bot";
};

declare global {
  interface Window {
    language: string;
  }
}

const initialMessages: ChatMessage[] = [];

interface LiveChatProps {
  open?: boolean;
  setOpen?: (open: boolean) => void;
}

const LiveChat: React.FC<LiveChatProps> = ({ open: controlledOpen, setOpen: setControlledOpen }) => {
  const [userName, setUserName] = useState<string | null>(null);
  const [onboardingStep, setOnboardingStep] = useState<number>(0);
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = setControlledOpen || setInternalOpen;
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const storedLang = localStorage.getItem("language");
    if (storedLang) {
      window.language = storedLang;
      console.log("Limba restaurată din localStorage:", window.language);
    } else {
      console.log("⚠️ Limba nu a fost găsită în localStorage!");
    }
  }, []);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);



  const sendStartRequest = (name: string) => {
    return fetch("https://lumea-mea.onrender.com/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    })
      .then((res) => res.json())
      .then((data) => {
        const botMsg: ChatMessage = {
          id: Date.now(),
          text: data.ask_name || "Cum te numești?",
          from: "bot",
        };
        // const language = data.language;
        // window.language = language;
          // localStorage.setItem("language", language);
        window.language = data.language
        localStorage.setItem("language", data.language);
        setMessages((prev) => [...prev, botMsg]);
        setUserName(name);
        setOnboardingStep(1);
      });
  };

  const exemple_1 = (name: string) => {
    return fetch("https://lumea-mea.onrender.com/exemple_1", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, message , language: window.language}),
    })
      .then((res) => res.json())
      .then((data) => {
        const botMsg: ChatMessage = {
          id: Date.now(),
          text: data.ask_name || "Cum te numești?",
          from: "bot",
        };
        const language = data.language;
        window.language = language;
        setMessages((prev) => [...prev, botMsg]);
        console.log(data.ask_name)
        if (data.ask_name.includes("Perfect! 😊 Pentru a continua cu rezervarea") || data.ask_name.includes("Отлично! 😊 Чтобы продолжить бронирование, пожалуйста")){
          setOnboardingStep(9)
          return;
        } else if (data.ask_name.includes("Este necesar să alegi o destinație turistică") || data.ask_name.includes("Необходимо выбрать туристическое направление")){
          setOnboardingStep(10)
          return;
        }
        setUserName(name);
        setOnboardingStep(10);
      });
  };

  const sendInterestsRequest = (msg: string) => {
    return fetch("https://lumea-mea.onrender.com/interests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: userName, message: msg, language: localStorage.getItem("language") }),
    })
      .then(res => res.json())
      .then(data => {
        const fullMsg = data.ask_interests?.full_message || data.message || "Răspuns necunoscut.";
        const botMsg: ChatMessage = {
          id: Date.now(),
          text: fullMsg,
          from: "bot",
        };

        setMessages((prev) => [...prev, botMsg]);

        if (fullMsg.includes("Perfect! 😊 Pentru a continua cu rezervarea, te rog să-mi lași următoarele informații") || fullMsg.includes("Отлично! 😊 Чтобы продолжить бронирование, пожалуйста, укажите следующую информацию")){
          setOnboardingStep(9);
        }
        if (
          fullMsg.includes("Tur recomandat") ||
          fullMsg.includes("Хотите забронировать место?")
        ) {
          setOnboardingStep(7);
        } else if (
          fullMsg.includes("Ответь, пожалуйста: хочешь ли продолжить или тебя интересуют события? Да / Все события") ||
          fullMsg.includes("Acum răspunde te rog dacă vrei să continuăm sau dacă ești interesat de evenimente? Da / Toate evenimentele")
        ) {
          // rămâne pe pasul curent (1)
        } else if (fullMsg.includes("Alege te rog o destinație turistică") || fullMsg.includes("Выберите, пожалуйста, туристическое направление")) {
          setOnboardingStep(2);
        } else {
          setOnboardingStep(2);
        }
      })
      .catch(err => {
        const errorMsg: ChatMessage = {
          id: Date.now(),
          text: "Eroare la comunicarea cu serverul: " + err.message,
          from: "bot",
        };
        setMessages((prev) => [...prev, errorMsg]);
      });
  };


  const sendPlanificareRequest = (interests: string) => {
    return fetch("https://lumea-mea.onrender.com/planificare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: userName,
        interests,
        language: window.language,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const replyText = data.question || "Răspuns necunoscut.";
        const botMsg: ChatMessage = { id: Date.now(), text: replyText, from: "bot" };
        setMessages((prev) => [...prev, botMsg]);
        if(replyText.includes("!!!!")){
          setOnboardingStep(2);
          return;
        }
        if (replyText.includes("Europa, Turcia") || replyText.includes("Европа, Турция")) {
          setOnboardingStep(2);
        } else {
          setOnboardingStep(3);
        }
      });
  };

  const sendChatRequest = (msg: string) => {
    return fetch("https://lumea-mea.onrender.com/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg }),
    })
      .then((res) => res.json())
      .then((data) => {
        const botMsg: ChatMessage = {
          id: Date.now(),
          text: data.reply || "Ne pare rău, nu am un răspuns acum.",
          from: "bot",
        };
        setMessages((prev) => [...prev, botMsg]);
      });
  };

  const sendDurataRequest = (msg: string) => {
    return fetch("https://lumea-mea.onrender.com/durata", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg, language: window.language }),
    })
      .then(res => res.json())
      .then(data => {
        const replyText = data.question || "Răspuns necunoscut.";
        const botMsg: ChatMessage = { id: Date.now(), text: replyText, from: "bot" };
        setMessages(prev => [...prev, botMsg]);
  
        if (replyText.includes("!!!")) {
          setOnboardingStep(3);
        } else {
          setOnboardingStep(4);
        }
      });
  };

  const sendDificultateRequest = (msg: string) => {
    return fetch("https://lumea-mea.onrender.com/dificultate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg, language: window.language }),
    })
      .then(res => res.json())
      .then(data => {
        const replyText = data.question || "Răspuns necunoscut.";
        const botMsg: ChatMessage = { id: Date.now(), text: replyText, from: "bot" };
        setMessages(prev => [...prev, botMsg]);
  
        if (
          replyText.includes("2 săptămâni") ||
          replyText.includes("cam o săptămână") ||
          replyText.includes("un weekend") ||
          replyText.includes("peste 15 zile") ||
          replyText.includes("2 недели") ||
          replyText.includes("около недели") ||
          replyText.includes("выходные") ||
          replyText.includes("более 15 дней")
        ) {
          setOnboardingStep(4);
        } else {
          setOnboardingStep(5);
        }
      });
  };

  const sendBugetRequest = (msg: string) => {
    return fetch("https://lumea-mea.onrender.com/buget", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg, language: window.language }),
    })
      .then(res => res.json())
      .then(data => {
        const replyText = data.question || "Răspuns necunoscut.";
        const botMsg: ChatMessage = { id: Date.now(), text: replyText, from: "bot" };
        setMessages(prev => [...prev, botMsg]);
  
        if (replyText.includes("!!!")) {
          setOnboardingStep(5);
        } else {
          setOnboardingStep(6);
        }
      });
  };

  const sendChatAdvancedRequest = (msg: string) => {
    return fetch("https://lumea-mea.onrender.com/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: userName, message: msg, language: window.language }),
    })
      .then(res => res.json())
      .then(data => {
        const replyText = data.reply || "Ne pare rău, nu am un răspuns acum.";
        const botMsg: ChatMessage = { id: Date.now(), text: replyText, from: "bot" };
        setMessages(prev => [...prev, botMsg]);
  
        if (replyText.includes("!!!")) {
          setOnboardingStep(6);
        } else if (
          replyText.includes("Doresti sa rezervi un loc? Da / Nu") ||
          replyText.includes("Хотите забронировать место? Да / Нет")
        ) {
          setOnboardingStep(7);
        } else if (replyText.includes("Alege te rog denumirea turului dorit pentru") || replyText.includes("Выберите, пожалуйста, название тура")) {
          setOnboardingStep(10);
        }
        else {
          setOnboardingStep(8);
        }
      });
  };

  const sendExempleRequest = (msg: string) => {
    return fetch("https://lumea-mea.onrender.com/exemple", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg, language: window.language }),
    })
      .then(res => res.json())
      .then(data => {
        const replyText = data.reply || "Răspuns necunoscut.";
        const botMsg: ChatMessage = { id: Date.now(), text: replyText, from: "bot" };
        setMessages(prev => [...prev, botMsg]);
  
        if (replyText.includes("!!!")) {
          setOnboardingStep(2);
        } else if (
          replyText.includes("Îți mulțumesc din suflet pentru conversație!") ||
          replyText.includes("Спасибо тебе за общение!")
        ) {
          setOnboardingStep(1);
        }
      });
  };

  const sendSimpleChatRequest = async (msg: string) => {
    try {
      const res = await fetch("https://lumea-mea.onrender.com/simple_chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, language: window.language }),
      });
  
      const data = await res.json();
      const replyText = data.reply || "Răspuns necunoscut.";
      const botMsg: ChatMessage = { id: Date.now(), text: replyText, from: "bot" };
      setMessages(prev => [...prev, botMsg]);
      if (replyText.includes("Perfect! 😊 Pentru a continua cu rezervarea, te rog să-mi lași următoarele informații:")){
        setOnboardingStep(9);
      }
      if (replyText.includes("✅ Ajustăm în funcție de buget") || replyText.includes("✅ Настроим в соответствии с бюджетом") ) {
        setOnboardingStep(1);
      }
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: Date.now(),
        text: "Eroare la comunicare: " + (error as Error).message,
        from: "bot",
      };
      setMessages(prev => [...prev, errorMsg]);
    }
  };
  
  const sendReturnMessageRequest = (msg: string) => {
    return fetch("https://lumea-mea.onrender.com/return_message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg, language: localStorage.getItem("language") }),
    })
      .then(res => res.json())
      .then(data => {
        const replyText = data.reply || "Răspuns necunoscut.";
        const botMsg: ChatMessage = { id: Date.now(), text: replyText, from: "bot" };
        setMessages(prev => [...prev, botMsg]);
        console.log('language = ', localStorage.getItem("language"))
        // console.log(replyText.includes("Numărul introdus nu este valid"))
        // console.log(replyText.includes("Îți mulțumesc din suflet pentru conversație"))
        if ( replyText.includes("Numărul introdus nu este valid") || replyText.includes("Введённый номер недействителен") ) {
          setOnboardingStep(9);
        } else if (replyText.includes("Îți mulțumesc din suflet pentru conversație") || replyText.includes("Спасибо тебе за общение!")){
          setOnboardingStep(1);
        } else {
          setOnboardingStep(8);
        }
      });
  };


  const handleSend = async () => {
    if (message.trim() === "") return;

    const userMsg: ChatMessage = { id: Date.now(), text: message, from: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    const currentStep = onboardingStep; // fix aici

    try {
      switch (currentStep) {
        case -1:
          await sendStartRequest(message);
          break;
        case 1:
          await sendInterestsRequest(message);
          break;
        case 2:
          await sendPlanificareRequest(message);
          break;
        case 3:
          await sendDurataRequest(message);
          break;
        case 4:
          await sendDificultateRequest(message);
          break;
        case 5:
          await sendBugetRequest(message);
          break;
        case 6:
          await sendChatAdvancedRequest(message);
          break;
        case 7:
          await sendExempleRequest(message);
          break;
        case 8:
          await sendSimpleChatRequest(message);
          break;
        case 9:
          await sendReturnMessageRequest(message);
          break;
        case 10:
          await exemple_1(message);
          break;
        default:
          // fallback chat simplu
          await sendChatRequest(message);
      }
    } catch (error: any) {
      console.error("Eroare:", error);
      const errMsg: ChatMessage = {
        id: Date.now(),
        text: "Eroare la comunicarea cu serverul.",
        from: "bot",
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setLoading(false);
      setMessage("");
    }
  };

  // ✅ Inițializare - întreabă limba
  useEffect(() => {
    if (open) {
      setVisible(true);
      if (messages.length === 0 && onboardingStep === 0) {
        setLoading(true);
        fetch("https://lumea-mea.onrender.com/language")
          .then((res) => res.json())
          .then((data) => {
            // window.language = data.language || "RO";
            console.log("11111")
            console.log(data.ask_name)
            const botMsg: ChatMessage = {
              id: Date.now(),
              text: data.ask_name || "Bun venit! Care este numele tău?",
              from: "bot",
            };
            setMessages([botMsg]);
            setOnboardingStep(-1);
          })
          .catch(() => {
            const errMsg: ChatMessage = {
              id: Date.now(),
              text: "Eroare la comunicarea cu serverul.",
              from: "bot",
            };
            setMessages([errMsg]);
          })
          .finally(() => setLoading(false));
      }
    } else {
      const timeout = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [open]);


  // ✅ Inițializare - întreabă limba
  useEffect(() => {
    scrollToBottom();
    if (open) {
      setVisible(true);
      if (messages.length === 0 && onboardingStep === 0) {
        setLoading(true);
        fetch("https://lumea-mea.onrender.com/language")
          .then((res) => res.json())
          .then((data) => {
            // window.language = data.language || "RO";
            const botMsg: ChatMessage = {
              id: Date.now(),
              text: data.ask_name || "Bun venit! Care este numele tău?",
              from: "bot",
            };
            setMessages([botMsg]);
            setOnboardingStep(-1);
          })
          .catch(() => {
            const errMsg: ChatMessage = {
              id: Date.now(),
              text: "Eroare la comunicarea cu serverul.",
              from: "bot",
            };
            setMessages([errMsg]);
          })
          .finally(() => setLoading(false));
      }
    } else {
      const timeout = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [open]);


  // ✅ Interfața
  return (
    <div>
      {!open && (
        <img
          src={chatboticon}
          className="livechat-chatboticon"
          alt="Deschide chat"
          onClick={() => setOpen(true)}
          style={{
            position: "fixed",
            right: 40,
            bottom: 40,
            width: 80,
            height: 80,
            zIndex: 1001,
            cursor: "pointer",
          }}
        />
      )}
      {visible && (
        <div className={`livechat-modal${open ? "" : " closed"}`}>
          <img src={livechatopenbg} className="livechat-modal-bg" alt="Live Chat Modal BG" />
          <img
            src={closebutton}
            className="livechat-close-button"
            alt="Close"
            onClick={() => setOpen(false)}
          />
          <div className="livechat-messages" style={{ overflowY: "auto", maxHeight: "60vh" }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`livechat-message livechat-message-${msg.from}`}
                dangerouslySetInnerHTML={{ __html: msg.text }}
              ></div>
            ))}
            {loading && (
              <div className="livechat-message livechat-message-bot">...scriu răspuns...</div>
            )}
            {/* Invisible element to scroll to */}
            <div ref={messagesEndRef} />
          </div>
          <div className="livechat-input-row">
            <input
              type="text"
              className="livechat-input"
              placeholder="Scrie-ți mesajul aici..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
              disabled={loading}
            />
            <button
              className="livechat-send-btn"
              onClick={handleSend}
              type="button"
              aria-label="Trimite mesaj"
              disabled={loading}
            >
              <img src={sendicon} alt="Send" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveChat;
